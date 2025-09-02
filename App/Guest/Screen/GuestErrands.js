import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  SafeAreaView, // Import ActivityIndicator for loading
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "react-query"; // Import useQueryClient for retries
// import { useFetchData } from "../../hooks/Request"; // Assuming this path is correct
import { useDispatch, useSelector } from "react-redux";
import { useFetchData } from "../../../hooks/Request";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
// import { Get_User_Clans_Fun } from "../../Redux/UserSide/ClanSlice";
// import ScreenWrapper from "../shared/ScreenWrapper";
// ScreenWrapper
// useFetchData
const GuestErrands = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient(); // Initialize query client
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const {
    data: getallErrand,
    isLoading: isLoadinggetallErrand,
    error: iserrorgetallErrand,
  } = useFetchData(`api/v1/errand`, "errand");

  console.log({
    mnmn: userProfile_data?.currentClanMeeting?.settings,
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

        <View style={styles.footer}>
          <Text style={styles.createdAt}>
            Created: {formatDate(item.createdAt)}
          </Text>
          {/* Removed item.priority as it's not in the provided JSON structure */}
        </View>
      </TouchableOpacity>
    );
  };

  //   // Conditional rendering for loading state
  //   if (isLoadinggetallErrand) {
  //     return (
  //       <View style={[styles.container, styles.centerContent]}>
  //         <ActivityIndicator size="large" color="#007BFF" />
  //         <Text style={styles.loadingText}>Loading errands...</Text>
  //       </View>
  //     );
  //   }

  //   // Conditional rendering for error state
  //   if (iserrorgetallErrand) {
  //     return (
  //       <View style={[styles.container, styles.centerContent]}>
  //         <Text style={styles.errorText}>
  //           Error: {iserrorgetallErrand.message || "Failed to fetch data."}
  //         </Text>
  //         <TouchableOpacity
  //           onPress={() => queryClient.invalidateQueries("errand")}
  //         >
  //           <Text style={styles.retryButton}>Tap to Retry</Text>
  //         </TouchableOpacity>
  //       </View>
  //     );
  //   }

  let freeErrandsRemaining = userProfile_data?.user?.freeErrandsRemaining;

  return (
    // <ScreenWrapper
    //   title="Errand"
    //   navigation={navigation}
    //   headerStyle={{
    //     backgroundColor: "white",
    //   }}
    // >

    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" />
      <View>
        {freeErrandsRemaining > 0 && (
          <View
            style={{
              backgroundColor: "#8BC34A", // A nice green color
              paddingVertical: 8,
              paddingHorizontal: 15,
              borderRadius: 20,
              alignSelf: "center", // Center the badge horizontally
              marginVertical: 10, // Add vertical spacing
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 3,
              elevation: 3,
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              You have {freeErrandsRemaining} free errand
              {freeErrandsRemaining > 1 ? "s" : ""}!
            </Text>
          </View>
        )}

        <View style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "green",
              // paddingHorizontal: 20,
              // paddingVertical: 10,
              borderRadius: 50,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            // navigation.navigate("guestsdetail", { itemdata });

            onPress={() => navigation.navigate("createErrand")}
          >
            <MaterialIcons name="mode-edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
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
    </SafeAreaView>
    // {/* </ScreenWrapper> */}
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

export default GuestErrands;

const ErrandComingSoonScreen = ({ clanName, liveFromDate }) => {
  const navigation = useNavigation();

  // Helper function to format the date if provided
  const formatLiveDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return ` Please check back on ${d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })} at ${d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })} WAT.`;
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        backgroundColor: "#F0F8FF",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
        paddingHorizontal: 25,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F0F8FF" />

      <View
        style={{
          alignItems: "center",
          maxWidth: 600,
          width: "100%",
        }}
      >
        <MaterialIcons name="timer" size={100} color="green" />
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            color: "green",
            marginTop: 30,
            marginBottom: 15,
            textAlign: "center",
          }}
        >
          Errands Coming Soon!
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: "#555",
            textAlign: "center",
            lineHeight: 26,
            marginBottom: 30,
          }}
        >
          We're excited to bring convenient errand services to your clan,{" "}
          {clanName || "this clan"}! The errand feature is not yet active.
          {formatLiveDate(liveFromDate)}
          {!liveFromDate &&
            ` Stay tuned for updates on when you can start requesting errands.`}
        </Text>

        <View
          style={{
            backgroundColor: "#FFF",
            borderRadius: 15,
            padding: 25,
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 6,
            width: "100%",
          }}
        >
          <Text
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#333",
              marginBottom: 15,
              textAlign: "center",
            }}
          >
            What is an Errand?
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              lineHeight: 24,
              marginBottom: 10,
            }}
          >
            An "errand" allows you to request assistance with various tasks
            within your community, such as:
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              marginLeft: 15,
              marginBottom: 5,
            }}
          >
            • Picking up groceries or food from local stores.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              marginLeft: 15,
              marginBottom: 5,
            }}
          >
            • Delivering packages or documents.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              marginLeft: 15,
              marginBottom: 5,
            }}
          >
            • Getting items from specific pickup locations.
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#666",
              lineHeight: 24,
              marginBottom: 10,
            }}
          >
            Our aim is to simplify your daily life by connecting you with
            trusted members who can help efficiently.
          </Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "",
            paddingVertical: 14,
            paddingHorizontal: 30,
            borderRadius: 30,
            marginTop: 50,
            shadowColor: "#007BFF",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 8,
          }}
          onPress={() => navigation.goBack()}
        >
          <Text
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
