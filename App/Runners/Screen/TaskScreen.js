import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFetchData } from "../../../hooks/Request";

const TaskScreen = () => {
  const [activeTab, setActiveTab] = useState("pending");

  const {
    data: errandsData,
    isLoading: isErrandsLoading,
    error: errandsError,
    refetch: refetchErrands,
  } = useFetchData(`api/v1/runner/errands`, "geterrandinfo");

  const [tasks, setTasks] = useState(errandsData?.data); // Using the provided data

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => task.status === activeTab);

  const statusTabs = [
    "pending",
    "assigned",
    "in-progress",
    "completed",
    "cancelled",
  ];

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <Text style={styles.taskStatus}>{item.status}</Text>
      </View>

      <Text style={styles.taskDescription}>{item.description}</Text>

      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.user.name}</Text>
        <Text style={styles.clanName}>{item.clan.name}</Text>
      </View>

      <Text style={styles.deliveryAddress}>
        Deliver to: {item.deliveryAddress}
      </Text>

      <View style={styles.storeSection}>
        {item.pickupLocations.map((store, index) => (
          <View key={index} style={styles.storeCard}>
            <Text style={styles.storeName}>{store.name}</Text>
            <Text style={styles.storeAddress}>{store.address}</Text>

            {store.items.map((product, pIndex) => (
              <View key={pIndex} style={styles.productItem}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productDesc}>{product.description}</Text>
                </View>
                <View style={styles.productMeta}>
                  <Text style={styles.productQty}>Qty: {product.quantity}</Text>
                  <Text style={styles.productPrice}>
                    ₦{product.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      <View style={styles.priceSection}>
        <View style={styles.priceRow}>
          <Text>Subtotal:</Text>
          <Text>₦{item.totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Service Fee:</Text>
          <Text>₦{item.serviceCharge.toFixed(2)}</Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text>Total:</Text>
          <Text>₦{item.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.secondaryButton}>
          <Text>View Details</Text>
        </TouchableOpacity>
        {activeTab === "pending" && (
          <TouchableOpacity style={styles.primaryButton}>
            <Text>Accept Task</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Status Tabs */}
      <View style={styles.tabContainer}>
        {statusTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task List */}
      <FlatList
        data={filteredTasks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text>No {activeTab} tasks found</Text>
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
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#4a90e2",
  },
  tabText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4a90e2",
  },
  listContent: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  taskCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  taskStatus: {
    textTransform: "capitalize",
    color: "#666",
  },
  taskDescription: {
    color: "#666",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  userName: {
    fontWeight: "500",
  },
  clanName: {
    color: "#666",
  },
  deliveryAddress: {
    marginBottom: 12,
    color: "#444",
  },
  storeSection: {
    marginBottom: 12,
  },
  storeCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
  storeName: {
    fontWeight: "500",
    marginBottom: 4,
  },
  storeAddress: {
    color: "#666",
    fontSize: 12,
    marginBottom: 8,
  },
  productItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productInfo: {
    flex: 2,
  },
  productName: {
    fontWeight: "500",
  },
  productDesc: {
    color: "#666",
    fontSize: 12,
  },
  productMeta: {
    flex: 1,
    alignItems: "flex-end",
  },
  productQty: {
    color: "#666",
    fontSize: 12,
  },
  productPrice: {
    fontWeight: "500",
  },
  priceSection: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  primaryButton: {
    backgroundColor: "#4a90e2",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
});

export default TaskScreen;
