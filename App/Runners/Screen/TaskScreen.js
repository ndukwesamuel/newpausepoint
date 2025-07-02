import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useFetchData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const TaskScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState("en_route");

  const {
    data: errandsData,
    isLoading: isErrandsLoading,
    error: errandsError,
    refetch: refetchErrands,
  } = useFetchData(`api/v1/runner/me`, "geterrandinfo");

  // Filter tasks based on active tab
  const filteredTasks = errandsData?.data?.filter(
    (task) => task?.status === activeTab
  );

  const statusTabs = [
    // "assigned",
    "en_route",
    "picked_up",
    "delivered",
    "completed",
    // "cancelled",
  ];

  const formatStatusText = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status) => {
    const colors = {
      assigned: "#3498db",
      en_route: "#2ecc71",
      picked_up: "#f39c12",
      delivered: "#27ae60",
      completed: "#95a5a6",
      cancelled: "#e74c3c",
    };
    return colors[status] || "#7f8c8d";
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text
          style={[styles.taskStatus, { color: getStatusColor(item.status) }]}
        >
          {formatStatusText(item.status)}
        </Text>
      </View>

      <Text style={styles.taskDescription}>{item.description}</Text>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user?.name || "N/A"}</Text>
        <Text style={styles.clanName}>{item.clan?.name || "No clan"}</Text>
      </View>

      <Text style={styles.deliveryAddress}>
        Deliver to: {item.deliveryAddress || "Not specified"}
      </Text>

      {item.pickupLocations?.length > 0 && (
        <View style={styles.storeSection}>
          {item.pickupLocations.map((store, index) => (
            <View key={`store-${index}`} style={styles.storeCard}>
              <Text style={styles.storeName}>{store.name}</Text>
              <Text style={styles.storeAddress}>{store.address}</Text>

              {store.items?.map((product, pIndex) => (
                <View key={`product-${pIndex}`} style={styles.productItem}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.name}</Text>
                    <Text style={styles.productDesc}>
                      {product.description}
                    </Text>
                  </View>
                  <View style={styles.productMeta}>
                    <Text style={styles.productQty}>
                      Qty: {product.quantity}
                    </Text>
                    <Text style={styles.productPrice}>
                      ₦{product.price?.toFixed(2) || "0.00"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text>Subtotal:</Text>
          <Text>₦{item.totalPrice?.toFixed(2) || "0.00"}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Service Fee:</Text>
          <Text>₦{item.serviceCharge?.toFixed(2) || "0.00"}</Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalAmount}>
            ₦{item.totalAmount?.toFixed(2) || "0.00"}
          </Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            padding: 12,
            borderRadius: 6,
            flex: 1,
            marginRight: 8,
            alignItems: "center",
          }}
          // onPress={() => navigation.navigate("ErrandDetailsScreen")}
          onPress={() =>
            navigation.navigate("ErrandDetailsScreen", {
              errand: item,
            })
          }
        >
          <Text style={styles.buttonText}>View Details</Text>
        </TouchableOpacity>
        {/* {activeTab === "assigned" && (
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.buttonText}>Start Delivery</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </View>
  );

  if (isErrandsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a90e2" />
      </View>
    );
  }

  if (errandsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading tasks</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchErrands}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Horizontal Scrollable Tab Bar */}
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
        >
          {statusTabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && styles.activeTab,
                activeTab === tab && {
                  backgroundColor: getStatusColor(tab) + "20",
                  borderColor: getStatusColor(tab),
                },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab && styles.activeTabText,
                  activeTab === tab && { color: getStatusColor(tab) },
                ]}
              >
                {formatStatusText(tab)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No {formatStatusText(activeTab).toLowerCase()} tasks found
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#e74c3c",
    fontSize: 16,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#4a90e2",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  tabContainer: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tabScrollContent: {
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeTab: {
    borderWidth: 1,
  },
  tabText: {
    color: "#7f8c8d",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#95a5a6",
    fontSize: 16,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    marginRight: 10,
  },
  taskStatus: {
    textTransform: "capitalize",
    fontWeight: "600",
  },
  taskDescription: {
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  userName: {
    fontWeight: "500",
    color: "#2c3e50",
  },
  clanName: {
    color: "#7f8c8d",
    fontStyle: "italic",
  },
  deliveryAddress: {
    marginBottom: 12,
    color: "#34495e",
    fontStyle: "italic",
  },
  storeSection: {
    marginBottom: 12,
  },
  storeCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  storeName: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#2c3e50",
  },
  storeAddress: {
    color: "#7f8c8d",
    fontSize: 12,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontWeight: "500",
    color: "#2c3e50",
  },
  productDesc: {
    color: "#95a5a6",
    fontSize: 12,
    marginTop: 2,
  },
  productMeta: {
    flex: 1,
    alignItems: "flex-end",
  },
  productQty: {
    color: "#7f8c8d",
    fontSize: 12,
  },
  productPrice: {
    fontWeight: "600",
    color: "#2c3e50",
  },
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
    paddingTop: 12,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  totalRow: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#ecf0f1",
  },
  totalText: {
    fontWeight: "600",
  },
  totalAmount: {
    fontWeight: "700",
    color: "#2c3e50",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: "#4a90e2",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#ecf0f1",
    padding: 12,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "500",
    color: "#fff",
  },
});

export default TaskScreen;
