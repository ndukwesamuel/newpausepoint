import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFetchData } from "../../hooks/Request";

const ErrandsScreen = () => {
  const navigation = useNavigation();

  const {
    data: getallErrand,
    isLoading: isLoadinggetallErrand,
    error: iserrorgetallErrand,
  } = useFetchData(`api/v1/errand/me`, "getuserclans");

  console.log({
    mnmn: getallErrand?.data,
  });

  // This would typically come from your API/state management
  const errandsData = {
    errands: [
      // ... your errands data here ...
    ],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalErrands: 5,
    },
  };

  const renderErrandItem = ({ item }) => {
    const totalItems = item.pickupLocations.reduce(
      (acc, location) => acc + location.items.length,
      0
    );

    return (
      <TouchableOpacity
        style={styles.errandCard}
        onPress={() => navigation.navigate("ErrandDetail", { errand: item })}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) },
            ]}
          >
            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.deliveryAddress}>
          Deliver to: {item.deliveryAddress}
        </Text>

        <View style={styles.pickupInfo}>
          <Text style={styles.pickupText}>
            {item.pickupLocations.length} pickup locations
          </Text>
          <Text style={styles.itemText}>{totalItems} total items</Text>
        </View>

        {item.pickupLocations[0]?.items[0]?.images[0] && (
          <Image
            source={{ uri: item.pickupLocations[0].items[0].images[0] }}
            style={styles.itemImage}
          />
        )}

        <View style={styles.footer}>
          <Text style={styles.createdAt}>{formatDate(item.createdAt)}</Text>
          <Text style={styles.priority}>Priority: {item.priority}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107";
      case "picked_up":
        return "#2196F3";
      case "completed":
        return "#4CAF50";
      case "cancelled":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Text style={styles.header}>My Errands</Text>

      <FlatList
        data={getallErrand?.data}
        renderItem={renderErrandItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No errands found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 10,
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  errandCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  deliveryAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  pickupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  pickupText: {
    fontSize: 14,
    color: "#555",
  },
  itemText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  createdAt: {
    fontSize: 12,
    color: "#888",
  },
  priority: {
    fontSize: 12,
    color: "#888",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});

export default ErrandsScreen;
