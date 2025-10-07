import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert, // Import Alert
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native"; // Import useNavigation
import { useMutateData } from "../../../hooks/Request";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const { width } = Dimensions.get("window");

const ErrandDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation(); // Get navigation object for goBack()
  const { errand } = route.params;

  const {
    mutate: assignedErrand,
    isLoading: assignedErrandispending,
    error: assignedErranderror,
  } = useMutateData("api/v1/guesterrand", "PATCH", "geterrandinfo");

  // Function to show the confirmation alert
  const showConfirmStatusUpdate = (newStatus) => {
    let title = "";
    let message = "";

    if (newStatus === "assigned") {
      title = "Confirm Acceptance";
      message = "Are you sure you want to accept and pay for this errand?";
    } else if (newStatus === "cancelled") {
      title = "Confirm Cancellation";
      message = "Are you sure you want to cancel this errand?";
    } else if (newStatus === "en_route") {
      // Added confirmation for 'en_route'
      title = "Confirm En Route";
      message = "Are you sure you want to mark this errand as 'En Route'?";
    } else {
      // Fallback for unexpected status
      title = "Confirm Action";
      message = `Are you sure you want to change status to ${newStatus}?`;
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: "No",
          onPress: () => console.log("Status update cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleUpdateStatus(newStatus), // If 'Yes', trigger the actual update
        },
      ],
      { cancelable: false } // User must tap a button
    );
  };

  const handleUpdateStatus = (newStatus) => {
    let data = {
      status: newStatus,
      errandId: errand?._id,
    };

    console.log({
      payloadToSend: data, // More descriptive name
    });

    assignedErrand(data, {
      onSuccess: (response) => {
        console.log({ successResponse: response }); // More descriptive name

        Alert.alert("Success", "Status updated successfully", [{ text: "OK" }]);
        navigation.goBack(); // Navigate back after success
      },
      onError: (error) => {
        console.log({ errorDetails: error?.response });

        // Improve error message extraction
        const errorMessage =
          error.response?.data?.message || // Check backend message first
          error.message ||
          "Failed to update status. Please try again.";

        Alert.alert("Error", errorMessage, [{ text: "OK" }]);
      },
    });
  };

  if (!errand) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Errand details not found.</Text>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107"; // Amber
      case "assigned": // Add assigned status color
        return "#673AB7"; // Deep Purple
      case "en_route":
        return "#FF9800"; // Orange
      case "picked_up":
        return "#2196F3"; // Blue
      case "delivered":
        return "#00BCD4"; // Cyan
      case "completed":
        return "#4CAF50"; // Green
      case "cancelled":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <ScreenWrapper
      title="Errand Details"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerTitle}>{errand.title}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Status</Text>
          <View style={styles.statusRow}>
            {/* Corrected to View */}
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(errand.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {errand.status.toUpperCase()}
              </Text>
            </View>
            {errand.status === "pending" && (
              <View style={styles.actionButtonsContainer}>
                {" "}
                {/* Corrected to View */}
                <TouchableOpacity
                  onPress={() => showConfirmStatusUpdate("assigned")} // Call the confirmation function
                  style={[styles.actionButton, styles.assignButton]}
                  disabled={assignedErrandispending} // Disable while loading
                >
                  {assignedErrandispending ? (
                    <Text style={styles.buttonText}>Processing...</Text>
                  ) : (
                    <Text style={styles.buttonText}>Accept & Pay</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => showConfirmStatusUpdate("cancelled")} // Call the confirmation function
                  style={[styles.actionButton, styles.cancelButton]}
                  disabled={assignedErrandispending} // Disable while loading
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/* Corrected closing tag to View */}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Delivery Information</Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Address:</Text>{" "}
            {errand.deliveryAddress}
          </Text>
        </View>

        {errand?.type === "pickup" ? (
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeader}>Pickup Information</Text>
            title
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>title:</Text> {errand.title}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Description:</Text>
              {errand.description || "N/A"}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Address:</Text>{" "}
              {errand.pickUpAddress}
            </Text>
            {errand.images && errand.images.length > 0 && (
              <Image
                source={{ uri: errand?.images[0]?.url }}
                style={styles.itemImage}
                onError={(e) =>
                  console.log("Image loading error:", e.nativeEvent.error)
                }
              />
            )}
          </View>
        ) : (
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeader}>Pickup Locations & Items</Text>
            {errand.pickupLocations && errand.pickupLocations.length > 0 ? (
              errand.pickupLocations.map((location, locIndex) => (
                <View key={locIndex} style={styles.locationCard}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationAddress}>{location.address}</Text>
                  {location.items && location.items.length > 0 ? (
                    location.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemName}>{item.name}</Text>
                          <Text style={styles.itemQuantityPrice}>
                            {item.quantity} x ₦{item.price?.toFixed(2) || "N/A"}
                          </Text>
                        </View>
                        <Text style={styles.itemDescription}>
                          {item.description || "No description."}
                        </Text>

                        {item.images && item.images.length > 0 && (
                          <Image
                            source={{ uri: item.images[0] }}
                            style={styles.itemImage}
                            onError={(e) =>
                              console.log(
                                "Image loading error:",
                                e.nativeEvent.error
                              )
                            }
                          />
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noItemsText}>
                      No items listed for this pickup location.
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>
                No pickup locations listed for this errand.
              </Text>
            )}
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Financial Summary</Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Total Price:</Text> ₦
            {errand.totalPrice?.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Service Charge:</Text> ₦
            {errand.serviceCharge?.toFixed(2) || "0.00"}
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Delivery Charge:</Text> ₦
            {errand?.deliveryFee?.toFixed(2) || "500.00"}
          </Text>

          <Text style={styles.totalAmountText}>
            <Text style={styles.boldText}>Total Amount:</Text> ₦
            {errand.totalAmount?.toFixed(2) || "0.00"}
          </Text>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Timestamps</Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Created At:</Text>{" "}
            {formatDate(errand.createdAt)}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Last Updated:</Text>{" "}
            {formatDate(errand.updatedAt)}
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  detailSection: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingBottom: 5,
  },
  detailText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 8,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: "bold",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 10,
  },
  statusText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 90,
  },
  assignButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
  enRouteButton: {
    backgroundColor: "#FF9800", // Orange for En Route
  },
  buttonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "bold",
  },
  locationCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  locationName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 5,
  },
  locationAddress: {
    fontSize: 15,
    color: "#666",
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  itemQuantityPrice: {
    fontSize: 15,
    color: "#555",
    fontWeight: "600",
  },
  itemDescription: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  itemImage: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "cover",
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  errorText: {
    fontSize: 18,
    color: "#D32F2F",
    textAlign: "center",
  },
  noItemsText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default ErrandDetailScreen;
