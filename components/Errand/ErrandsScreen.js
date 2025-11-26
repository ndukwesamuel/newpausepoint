// import React, { useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useQueryClient } from "@tanstack/react-query";
// import { useFetchData } from "../../hooks/Request";
// import { useDispatch, useSelector } from "react-redux";
// import { Get_User_Clans_Fun } from "../../Redux/UserSide/ClanSlice";
// import ScreenWrapper from "../shared/ScreenWrapper";

// const ErrandsScreen = () => {
//   const navigation = useNavigation();
//   const queryClient = useQueryClient();
//   const { userProfile_data } = useSelector((state) => state.ProfileSlice);

//   const {
//     data: getallErrand,
//     isLoading: isLoadinggetallErrand,
//     error: iserrorgetallErrand,
//     isFetching,
//     refetch,
//   } = useFetchData(`api/v1/guesterrand`, "errand");

//   // Function to determine status badge color
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return { bg: "#FEF3C7", text: "#92400E" }; // Warning yellow
//       case "picked_up":
//         return { bg: "#DBEAFE", text: "#1E40AF" }; // Info blue
//       case "completed":
//       case "delivered":
//         return { bg: "#D1FAE5", text: "#065F46" }; // Success green
//       case "cancelled":
//         return { bg: "#FEE2E2", text: "#991B1B" }; // Error red
//       default:
//         return { bg: "#F3F4F6", text: "#6B7280" }; // Gray
//     }
//   };

//   // Function to format date strings
//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return (
//       date.toLocaleDateString(undefined, {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//       }) +
//       " " +
//       date.toLocaleTimeString(undefined, {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     );
//   };

//   // Render function for each errand item
//   const renderErrandItem = ({ item }) => {
//     const totalItems = item.pickupLocations.reduce(
//       (acc, location) => acc + location.items.length,
//       0
//     );
//     const statusColors = getStatusColor(item.status);

//     return (
//       <TouchableOpacity
//         style={styles.errandCard}
//         onPress={() => navigation.navigate("erranddetail", { errand: item })}
//         activeOpacity={0.7}
//       >
//         {/* Card Header with Title and Status */}
//         <View style={styles.cardHeader}>
//           <Text style={styles.errandTitle} numberOfLines={2}>
//             {item.title}
//           </Text>
//           <View
//             style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
//           >
//             <Text style={[styles.statusText, { color: statusColors.text }]}>
//               {item.status.toUpperCase()}
//             </Text>
//           </View>
//         </View>

//         {/* Delivery Address */}
//         <View style={styles.deliverySection}>
//           <MaterialCommunityIcons
//             name="map-marker"
//             size={16}
//             color="#10B981"
//             style={{ marginRight: 6 }}
//           />
//           <Text style={styles.deliveryAddress} numberOfLines={1}>
//             {item.deliveryAddress}
//           </Text>
//         </View>

//         {/* Pickup Info */}
//         <View style={styles.pickupInfoContainer}>
//           <View style={styles.infoItem}>
//             <MaterialCommunityIcons
//               name="store-marker"
//               size={16}
//               color="#6B7280"
//             />
//             <Text style={styles.infoText}>
//               {item.pickupLocations.length} pickup
//               {item.pickupLocations.length > 1 ? "s" : ""}
//             </Text>
//           </View>
//           <View style={styles.infoDivider} />
//           <View style={styles.infoItem}>
//             <MaterialCommunityIcons
//               name="package-variant"
//               size={16}
//               color="#6B7280"
//             />
//             <Text style={styles.infoText}>
//               {totalItems} item{totalItems > 1 ? "s" : ""}
//             </Text>
//           </View>
//         </View>

//         {/* Footer with timestamp */}
//         <View style={styles.cardFooter}>
//           <MaterialCommunityIcons
//             name="clock-outline"
//             size={14}
//             color="#9CA3AF"
//             style={{ marginRight: 4 }}
//           />
//           <Text style={styles.timestamp}>{formatDate(item.createdAt)}</Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   // Loading state
//   if (isLoadinggetallErrand) {
//     return (
//       <View style={styles.centerContent}>
//         <ActivityIndicator size="large" color="#10B981" />
//         <Text style={styles.loadingText}>Loading errands...</Text>
//       </View>
//     );
//   }

//   // Error state
//   if (iserrorgetallErrand) {
//     return (
//       <View style={styles.centerContent}>
//         <View style={styles.errorContainer}>
//           <MaterialCommunityIcons
//             name="alert-circle-outline"
//             size={48}
//             color="#DC2626"
//           />
//           <Text style={styles.errorText}>
//             {iserrorgetallErrand.message || "Failed to fetch errands"}
//           </Text>
//           <TouchableOpacity
//             style={styles.retryButton}
//             onPress={() =>
//               queryClient.invalidateQueries({ queryKey: ["errand"] })
//             }
//           >
//             <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
//             <Text style={styles.retryButtonText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   }

//   let freeErrandsRemaining = userProfile_data?.user?.freeErrandsRemaining;

//   return (
//     <ScreenWrapper
//       title="Errand"
//       navigation={navigation}
//       headerStyle={{
//         backgroundColor: "white",
//       }}
//       showHeader={false}
//     >
//       <View style={styles.container}>
//         {/* Free Errands Badge */}
//         {freeErrandsRemaining > 0 && (
//           <View style={styles.freeErrandsBanner}>
//             <View style={styles.bannerIconContainer}>
//               <MaterialCommunityIcons name="gift" size={20} color="#10B981" />
//             </View>
//             <Text style={styles.freeErrandsText}>
//               You have {freeErrandsRemaining} free errand
//               {freeErrandsRemaining > 1 ? "s" : ""} remaining!
//             </Text>
//           </View>
//         )}

//         {/* Errands List */}
//         <FlatList
//           data={getallErrand?.data?.errands}
//           renderItem={renderErrandItem}
//           keyExtractor={(item) => item._id}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <View style={styles.emptyIconContainer}>
//                 <MaterialCommunityIcons
//                   name="package-variant-closed"
//                   size={64}
//                   color="#D1D5DB"
//                 />
//               </View>
//               <Text style={styles.emptyTitle}>No errands yet</Text>
//               <Text style={styles.emptyDescription}>
//                 Create your first errand to get started
//               </Text>
//             </View>
//           }
//           refreshing={isFetching}
//           onRefresh={refetch}
//         />

//         {/* Floating Action Button */}
//         <TouchableOpacity
//           style={styles.fab}
//           onPress={() => navigation.navigate("createErrand")}
//           activeOpacity={0.8}
//         >
//           <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
//         </TouchableOpacity>
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   centerContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 20,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginTop: 12,
//     fontWeight: "500",
//   },
//   errorContainer: {
//     alignItems: "center",
//     paddingHorizontal: 32,
//   },
//   errorText: {
//     fontSize: 14,
//     color: "#374151",
//     textAlign: "center",
//     marginTop: 16,
//     marginBottom: 24,
//     fontWeight: "500",
//     lineHeight: 20,
//   },
//   retryButton: {
//     backgroundColor: "#10B981",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   retryButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "700",
//     marginLeft: 8,
//     letterSpacing: 0.3,
//   },
//   freeErrandsBanner: {
//     backgroundColor: "#D1FAE5",
//     marginHorizontal: 16,
//     marginTop: 16,
//     marginBottom: 8,
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   bannerIconContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   freeErrandsText: {
//     flex: 1,
//     color: "#065F46",
//     fontSize: 14,
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 8,
//     paddingBottom: 100, // Space for FAB
//   },
//   errandCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: 12,
//   },
//   errandTitle: {
//     flex: 1,
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//     marginRight: 12,
//     lineHeight: 22,
//   },
//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//     minWidth: 80,
//     alignItems: "center",
//   },
//   statusText: {
//     fontSize: 10,
//     fontWeight: "700",
//     letterSpacing: 0.5,
//   },
//   deliverySection: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   deliveryAddress: {
//     flex: 1,
//     fontSize: 14,
//     color: "#374151",
//     fontWeight: "500",
//   },
//   pickupInfoContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   infoItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   infoDivider: {
//     width: 1,
//     height: 16,
//     backgroundColor: "#E5E7EB",
//     marginHorizontal: 12,
//   },
//   infoText: {
//     fontSize: 13,
//     color: "#6B7280",
//     fontWeight: "500",
//     marginLeft: 6,
//   },
//   cardFooter: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   timestamp: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     fontWeight: "500",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     paddingVertical: 60,
//     paddingHorizontal: 32,
//   },
//   emptyIconContainer: {
//     width: 96,
//     height: 96,
//     borderRadius: 48,
//     backgroundColor: "#F3F4F6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   emptyDescription: {
//     fontSize: 14,
//     color: "#6B7280",
//     textAlign: "center",
//     fontWeight: "500",
//     lineHeight: 20,
//   },
//   fab: {
//     position: "absolute",
//     right: 20,
//     bottom: 24,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#10B981",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.4,
//     shadowRadius: 12,
//     elevation: 8,
//   },
// });

// export default ErrandsScreen;

import React, { useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useFetchData } from "../../hooks/Request";
import { useDispatch, useSelector } from "react-redux";
import { Get_User_Clans_Fun } from "../../Redux/UserSide/ClanSlice";
import ScreenWrapper from "../shared/ScreenWrapper";
import ErrandAdCard from "./ErrandAdCard";
// import ErrandAdCard from "../../components/Errand/ErrandAdCard";

// Sample Advertisement Data for Errand Screen
const errandAdvertisements = [
  {
    id: "errand_ad_1",
    title: "Quick Delivery Pro",
    subtitle: "Same-Day Service",
    description:
      "Get your errands done faster with our premium delivery network",
    imageUrl:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/quick-delivery",
    iconName: "truck-fast",
    discount: "50% OFF",
    ctaSubtext: "First 3 Orders",
  },
  {
    id: "errand_ad_2",
    title: "Grocery Shopping",
    subtitle: "Fresh & Fast",
    description: "Professional shoppers who pick the best items for you",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/grocery",
    iconName: "cart",
    discount: "NEW",
    ctaSubtext: "Available Now",
  },
  {
    id: "errand_ad_3",
    title: "Pharmacy Pickup",
    subtitle: "Health First",
    description: "Secure prescription pickup and delivery to your doorstep",
    imageUrl:
      "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/pharmacy",
    iconName: "medical-bag",
    discount: "FREE",
    ctaSubtext: "No Delivery Fee",
  },
  {
    id: "errand_ad_4",
    title: "Package Collection",
    subtitle: "Never Miss It",
    description: "We collect packages from anywhere and deliver to you",
    imageUrl:
      "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/packages",
    iconName: "package-variant-closed",
    discount: "SAVE",
    ctaSubtext: "Bulk Discounts",
  },
  {
    id: "errand_ad_5",
    title: "Document Services",
    subtitle: "Print & Deliver",
    description: "Printing, photocopying, and document pickup services",
    imageUrl:
      "https://images.unsplash.com/photo-1554224311-beee4ece3c5d?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/documents",
    iconName: "file-document",
    discount: "20% OFF",
    ctaSubtext: "This Week Only",
  },
  {
    id: "errand_ad_6",
    title: "Gift Delivery",
    subtitle: "Special Occasions",
    description: "Shop, wrap, and deliver gifts with personalized messages",
    imageUrl:
      "https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/gifts",
    iconName: "gift",
    discount: "HOT",
    ctaSubtext: "Popular Choice",
  },
];

const ErrandsScreen = () => {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const {
    data: getallErrand,
    isLoading: isLoadinggetallErrand,
    error: iserrorgetallErrand,
    isFetching,
    refetch,
  } = useFetchData(`api/v1/guesterrand`, "errand");

  // Function to insert ads into errands list (every 2 errands)
  const getErrandsWithAds = () => {
    const errands = getallErrand?.data?.errands || [];
    if (errands.length === 0) return [];

    const dataWithAds = [];
    let adIndex = 0;

    errands.forEach((errand, index) => {
      // Add the errand
      dataWithAds.push({ type: "errand", data: errand });

      // Add an ad after every 2 errands
      if ((index + 1) % 2 === 0 && adIndex < errandAdvertisements.length) {
        dataWithAds.push({
          type: "ad",
          data: errandAdvertisements[adIndex % errandAdvertisements.length],
        });
        adIndex++;
      }
    });

    return dataWithAds;
  };

  // Function to determine status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E" };
      case "picked_up":
        return { bg: "#DBEAFE", text: "#1E40AF" };
      case "completed":
      case "delivered":
        return { bg: "#D1FAE5", text: "#065F46" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#991B1B" };
      default:
        return { bg: "#F3F4F6", text: "#6B7280" };
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

  // Render function for each item
  const renderItem = ({ item }) => {
    if (item.type === "ad") {
      return <ErrandAdCard ad={item.data} />;
    }

    // Regular errand rendering
    const errand = item.data;
    const totalItems = errand.pickupLocations.reduce(
      (acc, location) => acc + location.items.length,
      0
    );
    const statusColors = getStatusColor(errand.status);

    return (
      <TouchableOpacity
        style={styles.errandCard}
        onPress={() => navigation.navigate("erranddetail", { errand })}
        activeOpacity={0.7}
      >
        {/* Card Header with Title and Status */}
        <View style={styles.cardHeader}>
          <Text style={styles.errandTitle} numberOfLines={2}>
            {errand.title}
          </Text>
          <View
            style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
          >
            <Text style={[styles.statusText, { color: statusColors.text }]}>
              {errand.status.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.deliverySection}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color="#10B981"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.deliveryAddress} numberOfLines={1}>
            {errand.deliveryAddress}
          </Text>
        </View>

        {/* Pickup Info */}
        <View style={styles.pickupInfoContainer}>
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="store-marker"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.infoText}>
              {errand.pickupLocations.length} pickup
              {errand.pickupLocations.length > 1 ? "s" : ""}
            </Text>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoItem}>
            <MaterialCommunityIcons
              name="package-variant"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.infoText}>
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </Text>
          </View>
        </View>

        {/* Footer with timestamp */}
        <View style={styles.cardFooter}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={14}
            color="#9CA3AF"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.timestamp}>{formatDate(errand.createdAt)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Loading state
  if (isLoadinggetallErrand) {
    return (
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading errands...</Text>
      </View>
    );
  }

  // Error state
  if (iserrorgetallErrand) {
    return (
      <View style={styles.centerContent}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#DC2626"
          />
          <Text style={styles.errorText}>
            {iserrorgetallErrand.message || "Failed to fetch errands"}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              queryClient.invalidateQueries({ queryKey: ["errand"] })
            }
          >
            <MaterialCommunityIcons name="refresh" size={20} color="#FFFFFF" />
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  let freeErrandsRemaining = userProfile_data?.user?.freeErrandsRemaining;

  return (
    <ScreenWrapper
      title="Errand"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      showHeader={false}
    >
      <View style={styles.container}>
        {/* Free Errands Badge */}
        {freeErrandsRemaining > 0 && (
          <View style={styles.freeErrandsBanner}>
            <View style={styles.bannerIconContainer}>
              <MaterialCommunityIcons name="gift" size={20} color="#10B981" />
            </View>
            <Text style={styles.freeErrandsText}>
              You have {freeErrandsRemaining} free errand
              {freeErrandsRemaining > 1 ? "s" : ""} remaining!
            </Text>
          </View>
        )}

        {/* Errands List with Ads */}
        <FlatList
          data={getErrandsWithAds()}
          keyExtractor={(item, index) =>
            item.type === "ad"
              ? `ad-${item.data.id}-${index}`
              : `errand-${item.data._id}`
          }
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <MaterialCommunityIcons
                  name="package-variant-closed"
                  size={64}
                  color="#D1D5DB"
                />
              </View>
              <Text style={styles.emptyTitle}>No errands yet</Text>
              <Text style={styles.emptyDescription}>
                Create your first errand to get started
              </Text>
            </View>
          }
          refreshing={isFetching}
          onRefresh={refetch}
        />

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("createErrand")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
    fontWeight: "500",
  },
  errorContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
    fontWeight: "500",
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  freeErrandsBanner: {
    backgroundColor: "#D1FAE5",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  bannerIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  freeErrandsText: {
    flex: 1,
    color: "#065F46",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 100,
  },
  errandCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  errandTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginRight: 12,
    lineHeight: 22,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  deliverySection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  deliveryAddress: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  pickupInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  infoDivider: {
    width: 1,
    height: 16,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 12,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginLeft: 6,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

export default ErrandsScreen;
