import React from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator, // Import ActivityIndicator for loading
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "react-query"; // Import useQueryClient for retries
import { useFetchData } from "../../hooks/Request"; // Assuming this path is correct

const ErrandsScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient(); // Initialize query client

  const {
    data: getallErrand,
    isLoading: isLoadinggetallErrand,
    error: iserrorgetallErrand,
  } = useFetchData(`api/v1/errand`, "errand");

  console.log({
    mnmn: getallErrand?.data?.errands,
  });

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
    // Adjusting toLocaleDateString and toLocaleTimeString for better readability
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

  // Render function for each errand item in the FlatList
  const renderErrandItem = ({ item }) => {
    const totalItems = item.pickupLocations.reduce(
      (acc, location) => acc + location.items.length,
      0
    );

    return (
      <TouchableOpacity
        style={styles.errandCard}
        onPress={() => navigation.navigate("erranddetail", { errand: item })}
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

        {/* Display the first image of the first item from the first pickup location, if available
        {item.pickupLocations[0]?.items[0]?.images[0] && (
          <Image
            source={{ uri: item.pickupLocations[0].items[0].images[0] }}
            style={styles.itemImage}
            // Add a fallback image for better UX if the URI fails
            onError={(e) =>
              console.log("Image loading error:", e.nativeEvent.error)
            }
            // defaultSource={require("../../assets/placeholder-image.png")} // Replace with your placeholder image path
          />
        )} */}

        <View style={styles.footer}>
          <Text style={styles.createdAt}>
            Created: {formatDate(item.createdAt)}
          </Text>
          {/* Removed item.priority as it's not in the provided JSON structure */}
        </View>
      </TouchableOpacity>
    );
  };

  // Conditional rendering for loading state
  if (isLoadinggetallErrand) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading errands...</Text>
      </View>
    );
  }

  // Conditional rendering for error state
  if (iserrorgetallErrand) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>
          Error: {iserrorgetallErrand.message || "Failed to fetch data."}
        </Text>
        <TouchableOpacity
          onPress={() => queryClient.invalidateQueries("errand")}
        >
          <Text style={styles.retryButton}>Tap to Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <Text style={styles.header}>My Errands</Text>

      <FlatList
        data={getallErrand?.data?.errands}
        renderItem={renderErrandItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          // This will only show if data is successfully fetched but the array is empty
          <Text style={styles.emptyText}>No errands found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingTop: StatusBar.currentHeight || 20, // Adjust padding for status bar
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 28, // Slightly larger header
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingBottom: 15, // Increased bottom padding
    color: "#333",
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  errandCard: {
    backgroundColor: "#FFF",
    borderRadius: 12, // Slightly more rounded corners
    padding: 18, // Increased padding
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }, // More pronounced shadow
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4, // Android shadow
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 19, // Slightly larger title
    fontWeight: "bold",
    color: "#333",
    flex: 1,
    marginRight: 10, // Add some margin to separate title and badge
  },
  statusBadge: {
    paddingHorizontal: 10, // Increased horizontal padding
    paddingVertical: 5, // Increased vertical padding
    borderRadius: 15, // More rounded badge
    minWidth: 80, // Ensure minimum width for consistency
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    color: "#FFF",
    fontSize: 11, // Slightly smaller font for badge
    fontWeight: "bold",
  },
  deliveryAddress: {
    fontSize: 15,
    color: "#555",
    marginBottom: 12, // Increased bottom margin
  },
  pickupInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12, // Increased bottom margin
    borderTopWidth: 1, // Add a subtle border
    borderTopColor: "#EEE",
    paddingTop: 10,
  },
  pickupText: {
    fontSize: 15,
    color: "#555",
  },
  itemText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "bold",
  },
  itemImage: {
    width: "100%",
    height: 180, // Increased image height
    borderRadius: 10,
    marginBottom: 12,
    resizeMode: "cover",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-start", // Align to start since priority is removed
    marginTop: 8, // Increased top margin
  },
  createdAt: {
    fontSize: 13,
    color: "#888",
  },
  loadingText: {
    fontSize: 18,
    color: "#555",
    marginTop: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#D32F2F", // Red color for error
    textAlign: "center",
    marginBottom: 10,
  },
  retryButton: {
    fontSize: 16,
    color: "#007BFF", // Blue for actionable text
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
});

export default ErrandsScreen;
