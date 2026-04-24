// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   Platform,
//   Image,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
// import { fmt, fmtDate, getInitials, categoryColor } from "./marketplaceHelpers";
// import Toast from "react-native-toast-message";

// // ─── STATUS BADGE ─────────────────────────────────────────────────────────────
// const AdminStatusBadge = ({ status }) => {
//   const config = {
//     Approve: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
//     Pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
//     Decline: { bg: "#FEE2E2", color: "#991B1B", label: "Declined" },
//   }[status] || { bg: "#F3F4F6", color: "#374151", label: status };

//   return (
//     <View style={[styles.adminBadge, { backgroundColor: config.bg }]}>
//       <Text style={[styles.adminBadgeText, { color: config.color }]}>
//         {config.label}
//       </Text>
//     </View>
//   );
// };

// // ─── LISTING STATUS BADGE ─────────────────────────────────────────────────────
// const ListingStatusBadge = ({ status }) => {
//   const config = {
//     available: { bg: "#D1FAE5", color: "#065F46", label: "Available" },
//     sold: { bg: "#FEE2E2", color: "#991B1B", label: "Sold" },
//     reserved: { bg: "#EDE9FE", color: "#6D28D9", label: "Reserved" },
//   }[status] || { bg: "#F3F4F6", color: "#374151", label: status };

//   return (
//     <View style={[styles.listingBadge, { backgroundColor: config.bg }]}>
//       <Text style={[styles.listingBadgeText, { color: config.color }]}>
//         {config.label}
//       </Text>
//     </View>
//   );
// };

// // ─── MY LISTING CARD ──────────────────────────────────────────────────────────
// const MyListingCard = ({ item, onMarkStatus, onDelete, onView, onEdit }) => {
//   const cat = categoryColor(item.category);

//   return (
//     <View style={styles.card}>
//       <View style={styles.cardRow}>
//         {/* Thumbnail — tap to view */}
//         <TouchableOpacity
//           style={styles.thumbnail}
//           onPress={() => onView(item)}
//           activeOpacity={0.85}
//         >
//           {item.images?.length > 0 ? (
//             <Image
//               source={{ uri: item.images[0].url }}
//               style={StyleSheet.absoluteFill}
//               resizeMode="cover"
//             />
//           ) : (
//             <View
//               style={[
//                 StyleSheet.absoluteFill,
//                 {
//                   backgroundColor: cat.bg,
//                   justifyContent: "center",
//                   alignItems: "center",
//                 },
//               ]}
//             >
//               <MaterialCommunityIcons
//                 name="image-outline"
//                 size={24}
//                 color={cat.color}
//               />
//             </View>
//           )}
//         </TouchableOpacity>

//         {/* Info */}
//         <View style={styles.cardInfo}>
//           <Text style={styles.cardTitle} numberOfLines={1}>
//             {item.name}
//           </Text>
//           <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
//           <Text style={styles.cardDate}>{fmtDate(item.createdAt)}</Text>
//           <View style={styles.badgeRow}>
//             <AdminStatusBadge status={item.status} />
//             <ListingStatusBadge status={item.listingStatus} />
//           </View>
//         </View>

//         {/* Actions */}
//         <View style={styles.cardActions}>
//           <TouchableOpacity
//             style={styles.actionBtn}
//             onPress={() => onView(item)}
//           >
//             <MaterialCommunityIcons
//               name="eye-outline"
//               size={18}
//               color="#6B7280"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.actionBtn,
//               { marginTop: 6, backgroundColor: "#EFF6FF" },
//             ]}
//             onPress={() => onEdit(item)}
//           >
//             <MaterialCommunityIcons
//               name="pencil-outline"
//               size={18}
//               color="#2563EB"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.actionBtn, { marginTop: 6 }]}
//             onPress={() => onDelete(item._id)}
//           >
//             <MaterialCommunityIcons
//               name="trash-can-outline"
//               size={18}
//               color="#EF4444"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Mark status row */}
//       {item.status === "Approve" && (
//         <View style={styles.markStatusRow}>
//           <Text style={styles.markStatusLabel}>Mark as:</Text>
//           {["available", "sold", "reserved"].map((s) => (
//             <TouchableOpacity
//               key={s}
//               onPress={() => onMarkStatus(item._id, s)}
//               style={[
//                 styles.markStatusBtn,
//                 item.listingStatus === s && { backgroundColor: "#10B981" },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.markStatusBtnText,
//                   item.listingStatus === s && { color: "white" },
//                 ]}
//               >
//                 {s.charAt(0).toUpperCase() + s.slice(1)}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// // ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
// export default function MarketplaceMyListings() {
//   const navigation = useNavigation();

//   const { data, isLoading, isError, refetch } = useFetchData_v2(
//     "api/v1/marketRouter/my-listings",
//     "myListings",
//   );

//   const { mutate: updateStatus } = useMutateData_v2(
//     "api/v1/marketRouter",
//     "PATCH",
//     ["myListings"],
//   );

//   const { mutate: deleteListingMutation } = useMutateData_v2(
//     // "api/v1/marketRouter",
//     `api/v1/marketRouter/${id}`,
//     "DELETE",
//     ["myListings", "marketplace"],
//   );

//   const myListings = data?.data || [];

//   const handleMarkStatus = (id, listingStatus) => {
//     updateStatus({
//       url: `api/v1/marketRouter/${id}/listing-status`,
//       data: { listingStatus },
//     });
//   };

//   // const handleDelete = (id) => {
//   //   console.log({
//   //     vvvvv: id,
//   //   });

//   //   Alert.alert(
//   //     "Delete Listing",
//   //     "Are you sure you want to delete this listing?",
//   //     [
//   //       { text: "Cancel", style: "cancel" },
//   //       {
//   //         text: "Delete",
//   //         style: "destructive",
//   //         onPress: () => {
//   //           deleteListingMutation(
//   //             { url: `api/v1/marketRouter/${id}`, data: {} },
//   //             {
//   //               onSuccess: () => {
//   //                 Toast.show({ type: "success", text1: "Listing deleted" });
//   //                 refetch();
//   //               },
//   //               onError: () => {
//   //                 Toast.show({
//   //                   type: "error",
//   //                   text1: "Failed to delete listing",
//   //                 });
//   //               },
//   //             },
//   //           );
//   //         },
//   //       },
//   //     ],
//   //   );
//   // };

//   const handleDelete = (id) => {
//     Alert.alert(
//       "Delete Listing",
//       "Are you sure you want to delete this listing?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               // call API directly instead of useMutateData_v2
//               const token = user_data?.data?.token;
//               const res = await axios.delete(
//                 `${API_URL}api/v1/marketRouter/${id}`,
//                 { headers: { Authorization: `Bearer ${token}` } },
//               );
//               Toast.show({ type: "success", text1: "Listing deleted" });
//               refetch();
//             } catch (err) {
//               Toast.show({ type: "error", text1: "Failed to delete listing" });
//             }
//           },
//         },
//       ],
//     );
//   };
//   const stats = {
//     total: myListings.length,
//     approved: myListings.filter((l) => l.status === "Approve").length,
//     pending: myListings.filter((l) => l.status === "Pending").length,
//     sold: myListings.filter((l) => l.listingStatus === "sold").length,
//   };

//   return (
//     <View style={styles.container}>
//       {isLoading ? (
//         <View style={styles.centerState}>
//           <ActivityIndicator size="large" color="#10B981" />
//         </View>
//       ) : isError ? (
//         <View style={styles.centerState}>
//           <MaterialCommunityIcons
//             name="alert-circle-outline"
//             size={48}
//             color="#D1D5DB"
//           />
//           <Text style={styles.centerStateText}>Failed to load</Text>
//           <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
//             <Text style={styles.retryBtnText}>Retry</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <FlatList
//           data={myListings}
//           keyExtractor={(item) => item._id}
//           onRefresh={refetch}
//           refreshing={isLoading}
//           ListHeaderComponent={
//             myListings.length > 0 ? (
//               <View style={styles.statsRow}>
//                 {[
//                   { label: "Total", value: stats.total, color: "#374151" },
//                   { label: "Live", value: stats.approved, color: "#10B981" },
//                   { label: "Pending", value: stats.pending, color: "#F59E0B" },
//                   { label: "Sold", value: stats.sold, color: "#EF4444" },
//                 ].map((s) => (
//                   <View key={s.label} style={styles.statCard}>
//                     <Text style={[styles.statValue, { color: s.color }]}>
//                       {s.value}
//                     </Text>
//                     <Text style={styles.statLabel}>{s.label}</Text>
//                   </View>
//                 ))}
//               </View>
//             ) : null
//           }
//           renderItem={({ item }) => (
//             <MyListingCard
//               item={item}
//               onMarkStatus={handleMarkStatus}
//               onDelete={handleDelete}
//               onView={(listing) =>
//                 navigation.navigate("MarketplaceDetail", { listing })
//               }
//               onEdit={(listing) =>
//                 navigation.navigate("MarketplaceUpdate", { listing })
//               }
//             />
//           )}
//           contentContainerStyle={{ padding: 16, gap: 12 }}
//           showsVerticalScrollIndicator={false}
//           ListEmptyComponent={
//             <View style={styles.emptyState}>
//               <MaterialCommunityIcons
//                 name="store-outline"
//                 size={56}
//                 color="#D1D5DB"
//               />
//               <Text style={styles.emptyTitle}>No listings yet</Text>
//               <Text style={styles.emptySub}>
//                 Tap + to create your first listing
//               </Text>
//               <TouchableOpacity
//                 style={styles.createBtn}
//                 onPress={() => navigation.navigate("MarketplaceCreate")}
//               >
//                 <Text style={styles.createBtnText}>Create Listing</Text>
//               </TouchableOpacity>
//             </View>
//           }
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === "ios" ? 56 : 20,
//     paddingBottom: 16,
//     backgroundColor: "white",
//     borderBottomWidth: 0.5,
//     borderBottomColor: "#F3F4F6",
//   },
//   backBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#F9FAFB",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   headerTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
//   addBtn: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#10B981",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   centerState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     gap: 12,
//   },
//   centerStateText: { fontSize: 14, color: "#9CA3AF" },
//   retryBtn: {
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     backgroundColor: "#10B981",
//     borderRadius: 8,
//   },
//   retryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },

//   statsRow: {
//     flexDirection: "row",
//     gap: 10,
//     marginBottom: 16,
//   },
//   statCard: {
//     flex: 1,
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 12,
//     alignItems: "center",
//     borderWidth: 0.5,
//     borderColor: "#F3F4F6",
//   },
//   statValue: { fontSize: 20, fontWeight: "800" },
//   statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

//   card: {
//     backgroundColor: "white",
//     borderRadius: 14,
//     overflow: "hidden",
//     borderWidth: 0.5,
//     borderColor: "#F3F4F6",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardRow: { flexDirection: "row", padding: 12, gap: 12 },
//   thumbnail: {
//     width: 80,
//     height: 80,
//     borderRadius: 10,
//     backgroundColor: "#F3F4F6",
//     overflow: "hidden",
//     position: "relative",
//   },
//   cardInfo: { flex: 1, gap: 4 },
//   cardTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
//   cardPrice: { fontSize: 15, fontWeight: "700", color: "#10B981" },
//   cardDate: { fontSize: 11, color: "#9CA3AF" },
//   badgeRow: { flexDirection: "row", gap: 6, marginTop: 4 },
//   adminBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
//   adminBadgeText: { fontSize: 10, fontWeight: "700" },
//   listingBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
//   listingBadgeText: { fontSize: 10, fontWeight: "700" },
//   cardActions: { justifyContent: "center" },
//   actionBtn: {
//     width: 34,
//     height: 34,
//     borderRadius: 8,
//     backgroundColor: "#FEF2F2",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   markStatusRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     paddingHorizontal: 12,
//     paddingBottom: 12,
//   },
//   markStatusLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
//   markStatusBtn: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 99,
//     backgroundColor: "#F3F4F6",
//   },
//   markStatusBtnText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },

//   emptyState: { alignItems: "center", paddingVertical: 60, gap: 8 },
//   emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
//   emptySub: { fontSize: 13, color: "#9CA3AF" },
//   createBtn: {
//     marginTop: 8,
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     backgroundColor: "#10B981",
//     borderRadius: 10,
//   },
//   createBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
// });

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { API_CONFIG } from "../../../api";
import { fmt, fmtDate, categoryColor } from "./marketplaceHelpers";
import Toast from "react-native-toast-message";

const API_URL = API_CONFIG.BASE_URL;

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const AdminStatusBadge = ({ status }) => {
  const config = {
    Approve: { bg: "#D1FAE5", color: "#065F46", label: "Approved" },
    Pending: { bg: "#FEF3C7", color: "#92400E", label: "Pending" },
    Decline: { bg: "#FEE2E2", color: "#991B1B", label: "Declined" },
  }[status] || { bg: "#F3F4F6", color: "#374151", label: status };

  return (
    <View style={[styles.adminBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.adminBadgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

// ─── LISTING STATUS BADGE ─────────────────────────────────────────────────────
const ListingStatusBadge = ({ status }) => {
  const config = {
    available: { bg: "#D1FAE5", color: "#065F46", label: "Available" },
    sold: { bg: "#FEE2E2", color: "#991B1B", label: "Sold" },
    reserved: { bg: "#EDE9FE", color: "#6D28D9", label: "Reserved" },
  }[status] || { bg: "#F3F4F6", color: "#374151", label: status };

  return (
    <View style={[styles.listingBadge, { backgroundColor: config.bg }]}>
      <Text style={[styles.listingBadgeText, { color: config.color }]}>
        {config.label}
      </Text>
    </View>
  );
};

// ─── MY LISTING CARD ──────────────────────────────────────────────────────────
const MyListingCard = ({ item, onMarkStatus, onDelete, onView, onEdit }) => {
  const cat = categoryColor(item.category);

  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        {/* Thumbnail — tap to view */}
        <TouchableOpacity
          style={styles.thumbnail}
          onPress={() => onView(item)}
          activeOpacity={0.85}
        >
          {item.images?.length > 0 ? (
            <Image
              source={{ uri: item.images[0].url }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: cat.bg,
                  justifyContent: "center",
                  alignItems: "center",
                },
              ]}
            >
              <MaterialCommunityIcons
                name="image-outline"
                size={24}
                color={cat.color}
              />
            </View>
          )}
        </TouchableOpacity>

        {/* Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
          <Text style={styles.cardDate}>{fmtDate(item.createdAt)}</Text>
          <View style={styles.badgeRow}>
            <AdminStatusBadge status={item.status} />
            <ListingStatusBadge status={item.listingStatus} />
          </View>
        </View>

        {/* 3 action buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionBtnGray}
            onPress={() => onView(item)}
          >
            <MaterialCommunityIcons
              name="eye-outline"
              size={17}
              color="#6B7280"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnBlue}
            onPress={() => onEdit(item)}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={17}
              color="#2563EB"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtnRed}
            onPress={() => onDelete(item._id)}
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={17}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mark status row — only if approved */}
      {item.status === "Approve" && (
        <View style={styles.markStatusRow}>
          <Text style={styles.markStatusLabel}>Mark as:</Text>
          {["available", "sold", "reserved"].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => onMarkStatus(item._id, s)}
              style={[
                styles.markStatusBtn,
                item.listingStatus === s && { backgroundColor: "#10B981" },
              ]}
            >
              <Text
                style={[
                  styles.markStatusBtnText,
                  item.listingStatus === s && { color: "white" },
                ]}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MarketplaceMyListings() {
  const navigation = useNavigation();

  // Get token from Redux
  const { userDatav2: user_data } = useSelector((state) => state.authSlice);
  const token = user_data?.data?.token;

  const { data, isLoading, isError, refetch } = useFetchData_v2(
    "api/v1/marketRouter/my-listings",
    "myListings",
  );

  const myListings = data?.data || [];

  // ── Mark listing status (available / sold / reserved) ────────────────────
  const handleMarkStatus = async (id, listingStatus) => {
    try {
      await axios.patch(
        `${API_URL}api/v1/marketRouter/${id}/listing-status`,
        { listingStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Toast.show({ type: "success", text1: `Marked as ${listingStatus}` });
      refetch();
    } catch (err) {
      Toast.show({ type: "error", text1: "Failed to update status" });
    }
  };

  // ── Delete listing ────────────────────────────────────────────────────────
  const handleDelete = (id) => {
    Alert.alert(
      "Delete Listing",
      "Are you sure you want to delete this listing?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}api/v1/marketRouter/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Toast.show({ type: "success", text1: "Listing deleted" });
              refetch();
            } catch (err) {
              Toast.show({ type: "error", text1: "Failed to delete listing" });
            }
          },
        },
      ],
    );
  };

  const stats = {
    total: myListings.length,
    approved: myListings.filter((l) => l.status === "Approve").length,
    pending: myListings.filter((l) => l.status === "Pending").length,
    sold: myListings.filter((l) => l.listingStatus === "sold").length,
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text style={styles.centerStateText}>Failed to load</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={myListings}
          keyExtractor={(item) => item._id}
          onRefresh={refetch}
          refreshing={isLoading}
          ListHeaderComponent={
            myListings.length > 0 ? (
              <View style={styles.statsRow}>
                {[
                  { label: "Total", value: stats.total, color: "#374151" },
                  { label: "Live", value: stats.approved, color: "#10B981" },
                  { label: "Pending", value: stats.pending, color: "#F59E0B" },
                  { label: "Sold", value: stats.sold, color: "#EF4444" },
                ].map((s) => (
                  <View key={s.label} style={styles.statCard}>
                    <Text style={[styles.statValue, { color: s.color }]}>
                      {s.value}
                    </Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                ))}
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <MyListingCard
              item={item}
              onMarkStatus={handleMarkStatus}
              onDelete={handleDelete}
              onView={(listing) =>
                navigation.navigate("MarketplaceDetail", { listing })
              }
              onEdit={(listing) =>
                navigation.navigate("MarketplaceUpdate", { listing })
              }
            />
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="store-outline"
                size={56}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No listings yet</Text>
              <Text style={styles.emptySub}>
                Tap + to create your first listing
              </Text>
              <TouchableOpacity
                style={styles.createBtn}
                onPress={() => navigation.navigate("MarketplaceCreate")}
              >
                <Text style={styles.createBtnText}>Create Listing</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  centerStateText: { fontSize: 14, color: "#9CA3AF" },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },

  statsRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  card: {
    backgroundColor: "white",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRow: { flexDirection: "row", padding: 12, gap: 12 },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
  },
  cardInfo: { flex: 1, gap: 4 },
  cardTitle: { fontSize: 14, fontWeight: "700", color: "#111827" },
  cardPrice: { fontSize: 15, fontWeight: "700", color: "#10B981" },
  cardDate: { fontSize: 11, color: "#9CA3AF" },
  badgeRow: { flexDirection: "row", gap: 6, marginTop: 4, flexWrap: "wrap" },
  adminBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  adminBadgeText: { fontSize: 10, fontWeight: "700" },
  listingBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  listingBadgeText: { fontSize: 10, fontWeight: "700" },

  cardActions: { justifyContent: "space-between", gap: 6 },
  actionBtnGray: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnBlue: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnRed: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  markStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 12,
    flexWrap: "wrap",
  },
  markStatusLabel: { fontSize: 11, color: "#9CA3AF", fontWeight: "500" },
  markStatusBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
  },
  markStatusBtnText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },

  emptyState: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptySub: { fontSize: 13, color: "#9CA3AF" },
  createBtn: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#10B981",
    borderRadius: 10,
  },
  createBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
});
