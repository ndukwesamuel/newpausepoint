import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  SafeAreaView, // Use SafeAreaView for iOS notch areas
  Dimensions, // For responsive image sizing
} from "react-native";
import { useRoute } from "@react-navigation/native"; // To access navigation parameters

const { width } = Dimensions.get("window"); // Get screen width for responsive images

const ErrandDetailScreen = () => {
  const route = useRoute();
  // Extract the 'errand' object passed as a parameter from the previous screen
  const { errand } = route.params;

  // Handle case where errand data might be missing (though unlikely with proper navigation)
  if (!errand) {
    return (
      <SafeAreaView style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Errand details not found.</Text>
      </SafeAreaView>
    );
  }

  // --- Helper Functions (reused from ErrandsScreen for consistency) ---

  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#FFC107"; // Amber
      case "picked_up":
        return "#2196F3"; // Blue
      case "completed":
        return "#4CAF50"; // Green
      case "cancelled":
        return "#F44336"; // Red
      default:
        return "#9E9E9E"; // Grey
    }
  };

  // Function to format date strings
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

  // --- Render the Errand Details ---
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.headerTitle}>{errand.title}</Text>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Status</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(errand.status) },
            ]}
          >
            <Text style={styles.statusText}>{errand.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Delivery Information</Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Address:</Text>{" "}
            {errand.deliveryAddress}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Description:</Text>{" "}
            {errand.description}
          </Text>
        </View>

        {errand.user && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeader}>Requested By</Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Name:</Text> {errand.user.name}
            </Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Email:</Text> {errand.user.email}
            </Text>
          </View>
        )}

        {errand.clan && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionHeader}>Clan</Text>
            <Text style={styles.detailText}>
              <Text style={styles.boldText}>Name:</Text> {errand.clan.name}
            </Text>
          </View>
        )}

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Pickup Locations & Items</Text>
          {errand.pickupLocations.map((location, locIndex) => (
            <View key={locIndex} style={styles.locationCard}>
              <Text style={styles.locationName}>{location.name}</Text>
              <Text style={styles.locationAddress}>{location.address}</Text>
              {location.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.itemCard}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantityPrice}>
                      {item.quantity} x ${item.price?.toFixed(2) || "N/A"}
                    </Text>
                  </View>
                  <Text style={styles.itemDescription}>{item.description}</Text>
                  {item.images && item.images.length > 0 && (
                    <Image
                      source={{ uri: item.images[0] }} // Display the first image
                      style={styles.itemImage}
                      onError={(e) =>
                        console.log("Image loading error:", e.nativeEvent.error)
                      }
                      //   defaultSource={require("../../assets/placeholder-image.png")} // Replace with your placeholder image path
                    />
                  )}
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.detailSection}>
          <Text style={styles.sectionHeader}>Financial Summary</Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Total Price:</Text> $
            {errand.totalPrice?.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.detailText}>
            <Text style={styles.boldText}>Service Charge:</Text> $
            {errand.serviceCharge?.toFixed(2) || "0.00"}
          </Text>
          <Text style={styles.totalAmountText}>
            <Text style={styles.boldText}>Total Amount:</Text> $
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40, // Extra padding at the bottom for scroll comfort
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
    lineHeight: 24, // Improve readability
  },
  boldText: {
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: "flex-start", // Align badge to the left
    marginBottom: 10,
  },
  statusText: {
    color: "#FFF",
    fontSize: 13,
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
    flex: 1, // Allow name to take available space
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
    width: "100%", // Make image fluid within its container
    height: width * 0.5, // Responsive height based on screen width
    borderRadius: 8,
    marginTop: 10,
    resizeMode: "cover",
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28A745", // Green for total amount
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
});

export default ErrandDetailScreen;
