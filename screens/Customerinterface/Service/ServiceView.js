

// // import React, { useRef, useState } from "react";
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TextInput,
// //   Image,
// //   Pressable,
// //   FlatList,
// //   RefreshControl,
// //   TouchableOpacity,
// // } from "react-native";
// // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // import LottieView from "lottie-react-native";
// // import ScreenWrapper from "../../../components/shared/ScreenWrapper";
// // import { useFetchData_v2 } from "../../../hooks/Requestv2";

// // const PLACEHOLDER_IMAGE =
// //   "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

// // const ServiceView = ({ navigation }) => {
// //   const animation = useRef(null);
// //   const [search, setSearch] = useState("");
// //   const [refreshing, setRefreshing] = useState(false);

// //   // ── Fetch from artisan endpoint ───────────────────────────────────────
// //   const {
// //     data: artisanData,
// //     isLoading,
// //     refetch,
// //   } = useFetchData_v2("api/v1/artisan", "artisans");

// //   const artisans = artisanData?.data || [];

// //   const filtered = artisans.filter(
// //     (item) =>
// //       item?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
// //       item?.typeOfJob?.toLowerCase().includes(search.toLowerCase()),
// //   );

// //   const onRefresh = async () => {
// //     setRefreshing(true);
// //     await refetch();
// //     setRefreshing(false);
// //   };

// //   // ── Card ──────────────────────────────────────────────────────────────
// //   const renderItem = ({ item }) => (
// //     <Pressable
// //       onPress={() => navigation.navigate("vendorService", { item })}
// //       style={styles.cardWrapper}
// //     >
// //       <View style={styles.card}>
// //         {/* Photo */}
// //         <Image
// //           source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
// //           style={styles.cardImage}
// //         />

// //         {/* Job type badge */}
// //         <View style={styles.badgeWrap}>
// //           <View style={styles.badge}>
// //             <Text style={styles.badgeText} numberOfLines={1}>
// //               {item?.typeOfJob || "Service"}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Content */}
// //         <View style={styles.cardContent}>
// //           <Text style={styles.cardName} numberOfLines={1}>
// //             {item?.fullName}
// //           </Text>

// //           {item?.details ? (
// //             <Text style={styles.cardDetails} numberOfLines={2}>
// //               {item.details}
// //             </Text>
// //           ) : null}

// //           {/* Phone row — shown only if present */}
// //           {item?.phone_number ? (
// //             <View style={styles.phoneRow}>
// //               <MaterialCommunityIcons
// //                 name="phone-outline"
// //                 size={13}
// //                 color="#10B981"
// //               />
// //               <Text style={styles.phoneText}>{item.phone_number}</Text>
// //             </View>
// //           ) : null}
// //         </View>
// //       </View>
// //     </Pressable>
// //   );

// //   // ── Empty state ───────────────────────────────────────────────────────
// //   const renderEmpty = () => (
// //     <View style={styles.emptyState}>
// //       <LottieView
// //         autoPlay
// //         ref={animation}
// //         style={styles.lottie}
// //         source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
// //       />
// //       <Text style={styles.emptyTitle}>No services found</Text>
// //       <Text style={styles.emptySubtitle}>
// //         {search ? "Try a different search term" : "No artisans registered yet"}
// //       </Text>
// //     </View>
// //   );

// //   return (
// //     <ScreenWrapper
// //       title="Services"
// //       navigation={navigation}
// //       headerStyle={{ backgroundColor: "white" }}
// //     >
// //       <View style={styles.container}>

// //         {/* Search bar */}
// //         <View style={styles.searchCard}>
// //           <View style={styles.searchRow}>
// //             <MaterialCommunityIcons
// //               name="magnify"
// //               size={20}
// //               color="#6B7280"
// //               style={{ marginRight: 8 }}
// //             />
// //             <TextInput
// //               placeholder="Search by name or service..."
// //               style={styles.searchInput}
// //               placeholderTextColor="#9CA3AF"
// //               value={search}
// //               onChangeText={setSearch}
// //             />
// //             {search !== "" && (
// //               <TouchableOpacity onPress={() => setSearch("")}>
// //                 <MaterialCommunityIcons
// //                   name="close-circle"
// //                   size={18}
// //                   color="#9CA3AF"
// //                 />
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //         </View>

// //         {/* Count pill */}
// //         {filtered.length > 0 && (
// //           <View style={styles.countRow}>
// //             <MaterialCommunityIcons
// //               name="account-hard-hat-outline"
// //               size={16}
// //               color="#10B981"
// //               style={{ marginRight: 6 }}
// //             />
// //             <Text style={styles.countText}>
// //               {filtered.length} {filtered.length === 1 ? "artisan" : "artisans"}
// //             </Text>
// //           </View>
// //         )}

// //         {/* Grid list */}
// //         <FlatList
// //           data={filtered}
// //           renderItem={renderItem}
// //           keyExtractor={(item, index) => item?._id || index.toString()}
// //           ListEmptyComponent={renderEmpty}
// //           numColumns={2}
// //           columnWrapperStyle={styles.columnWrapper}
// //           contentContainerStyle={styles.listContent}
// //           showsVerticalScrollIndicator={false}
// //           refreshControl={
// //             <RefreshControl
// //               refreshing={refreshing}
// //               onRefresh={onRefresh}
// //               tintColor="#10B981"
// //               colors={["#10B981"]}
// //             />
// //           }
// //         />
// //       </View>
// //     </ScreenWrapper>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F9FAFB",
// //     paddingHorizontal: 16,
// //     paddingTop: 16,
// //   },

// //   // ── Search ──
// //   searchCard: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     padding: 12,
// //     marginBottom: 12,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   searchRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     backgroundColor: "#F9FAFB",
// //     borderRadius: 12,
// //     paddingHorizontal: 12,
// //     paddingVertical: 10,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     fontSize: 14,
// //     fontWeight: "500",
// //     color: "#111827",
// //   },

// //   // ── Count ──
// //   countRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 12,
// //     paddingHorizontal: 4,
// //   },
// //   countText: {
// //     fontSize: 13,
// //     fontWeight: "600",
// //     color: "#6B7280",
// //   },

// //   // ── List ──
// //   listContent: {
// //     paddingBottom: 40,
// //     flexGrow: 1,
// //   },
// //   columnWrapper: {
// //     justifyContent: "space-between",
// //     marginBottom: 16,
// //   },

// //   // ── Card ──
// //   cardWrapper: {
// //     width: "48%",
// //   },
// //   card: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 16,
// //     overflow: "hidden",
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 8,
// //     elevation: 3,
// //   },
// //   cardImage: {
// //     width: "100%",
// //     height: 130,
// //     backgroundColor: "#F3F4F6",
// //   },
// //   badgeWrap: {
// //     position: "absolute",
// //     top: 8,
// //     left: 8,
// //     right: 8,
// //   },
// //   badge: {
// //     backgroundColor: "rgba(16, 185, 129, 0.9)",
// //     paddingHorizontal: 8,
// //     paddingVertical: 4,
// //     borderRadius: 8,
// //     alignSelf: "flex-start",
// //     maxWidth: "100%",
// //   },
// //   badgeText: {
// //     fontSize: 10,
// //     fontWeight: "700",
// //     color: "#FFFFFF",
// //     letterSpacing: 0.3,
// //   },
// //   cardContent: {
// //     padding: 12,
// //     backgroundColor: "#FFFFFF",
// //   },
// //   cardName: {
// //     fontSize: 14,
// //     fontWeight: "700",
// //     color: "#111827",
// //     marginBottom: 4,
// //     letterSpacing: 0.3,
// //   },
// //   cardDetails: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //     color: "#6B7280",
// //     lineHeight: 17,
// //     marginBottom: 6,
// //   },
// //   phoneRow: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 4,
// //     marginTop: 4,
// //   },
// //   phoneText: {
// //     fontSize: 11,
// //     fontWeight: "600",
// //     color: "#10B981",
// //   },

// //   // ── Empty ──
// //   emptyState: {
// //     flex: 1,
// //     alignItems: "center",
// //     justifyContent: "center",
// //     paddingVertical: 60,
// //   },
// //   lottie: {
// //     width: 180,
// //     height: 180,
// //   },
// //   emptyTitle: {
// //     fontSize: 18,
// //     fontWeight: "700",
// //     color: "#111827",
// //     marginTop: 12,
// //     letterSpacing: 0.3,
// //   },
// //   emptySubtitle: {
// //     fontSize: 13,
// //     fontWeight: "500",
// //     color: "#6B7280",
// //     marginTop: 6,
// //     textAlign: "center",
// //   },
// // });

// // export default ServiceView;


// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Image,
//   Pressable,
//   FlatList,
//   RefreshControl,
//   TouchableOpacity,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import LottieView from "lottie-react-native";
// // import ScreenWrapper from "../../components/shared/ScreenWrapper";
// // ScreenWrapper
// // import { useFetchData_v2 } from "../../hooks/Requestv2";
// import ScreenWrapper from "../../../components/shared/ScreenWrapper";
// import { useFetchData_v2 } from "../../../hooks/Requestv2";

// // useFetchData_v2

// const PLACEHOLDER_IMAGE =
//   "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

// const ServiceView = ({ navigation }) => {
//   const animation = useRef(null);
//   const [search, setSearch] = useState("");
//   const [refreshing, setRefreshing] = useState(false);

//   // ── Fetch from artisan endpoint ───────────────────────────────────────
//   const {
//     data: artisanData,
//     isLoading,
//     refetch,
//   } = useFetchData_v2("api/v1/artisan", "artisans");

//   const artisans = artisanData?.data || [];

//   const filtered = artisans.filter(
//     (item) =>
//       item?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//       item?.typeOfJob?.toLowerCase().includes(search.toLowerCase()),
//   );

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await refetch();
//     setRefreshing(false);
//   };

//   // ── Card ──────────────────────────────────────────────────────────────
//   const renderItem = ({ item }) => (
//     <Pressable
//       onPress={() => navigation.navigate("vendorService", { item })}
//       style={styles.cardWrapper}
//     >
//       <View style={styles.card}>
//         {/* Photo */}
//         <Image
//           source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
//           style={styles.cardImage}
//         />

//         {/* Job type badge */}
//         <View style={styles.badgeWrap}>
//           <View style={styles.badge}>
//             <Text style={styles.badgeText} numberOfLines={1}>
//               {item?.typeOfJob || "Service"}
//             </Text>
//           </View>
//         </View>

//         {/* Content */}
//         <View style={styles.cardContent}>
//           <Text style={styles.cardName} numberOfLines={1}>
//             {item?.fullName}
//           </Text>

//           {item?.details ? (
//             <Text style={styles.cardDetails} numberOfLines={2}>
//               {item.details}
//             </Text>
//           ) : null}

//           {/* Phone row — shown only if present */}
//           {item?.phone_number ? (
//             <View style={styles.phoneRow}>
//               <MaterialCommunityIcons
//                 name="phone-outline"
//                 size={13}
//                 color="#10B981"
//               />
//               <Text style={styles.phoneText}>{item.phone_number}</Text>
//             </View>
//           ) : null}
//         </View>
//       </View>
//     </Pressable>
//   );

//   // ── Empty state ───────────────────────────────────────────────────────
//   const renderEmpty = () => (
//     <View style={styles.emptyState}>
//       {/* <LottieView
//       //   autoPlay
//       //   ref={animation}
//       //   style={styles.lottie}
//       //   source={require("../../assets/Lottie/Animation - 1704444696995.json")}
//       // /> */}
//       <Text style={styles.emptyTitle}>No services found</Text>
//       <Text style={styles.emptySubtitle}>
//         {search ? "Try a different search term" : "No artisans registered yet"}
//       </Text>
//     </View>
//   );

//   return (
//     <ScreenWrapper
//       title="Services"
//       navigation={navigation}
//       headerStyle={{ backgroundColor: "white" }}
//     >
//       <View style={styles.container}>

//         {/* Search bar */}
//         <View style={styles.searchCard}>
//           <View style={styles.searchRow}>
//             <MaterialCommunityIcons
//               name="magnify"
//               size={20}
//               color="#6B7280"
//               style={{ marginRight: 8 }}
//             />
//             <TextInput
//               placeholder="Search by name or service..."
//               style={styles.searchInput}
//               placeholderTextColor="#9CA3AF"
//               value={search}
//               onChangeText={setSearch}
//             />
//             {search !== "" && (
//               <TouchableOpacity onPress={() => setSearch("")}>
//                 <MaterialCommunityIcons
//                   name="close-circle"
//                   size={18}
//                   color="#9CA3AF"
//                 />
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>

//         {/* Count pill */}
//         {filtered.length > 0 && (
//           <View style={styles.countRow}>
//             <MaterialCommunityIcons
//               name="account-hard-hat-outline"
//               size={16}
//               color="#10B981"
//               style={{ marginRight: 6 }}
//             />
//             <Text style={styles.countText}>
//               {filtered.length} {filtered.length === 1 ? "artisan" : "artisans"}
//             </Text>
//           </View>
//         )}

//         {/* Grid list */}
//         <FlatList
//           data={filtered}
//           renderItem={renderItem}
//           keyExtractor={(item, index) => item?._id || index.toString()}
//           ListEmptyComponent={renderEmpty}
//           numColumns={2}
//           columnWrapperStyle={styles.columnWrapper}
//           contentContainerStyle={styles.listContent}
//           showsVerticalScrollIndicator={false}
//           refreshControl={
//             <RefreshControl
//               refreshing={refreshing}
//               onRefresh={onRefresh}
//               tintColor="#10B981"
//               colors={["#10B981"]}
//             />
//           }
//         />
//       </View>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//     paddingHorizontal: 16,
//     paddingTop: 16,
//   },

//   // ── Search ──
//   searchCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 12,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   searchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#111827",
//   },

//   // ── Count ──
//   countRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     paddingHorizontal: 4,
//   },
//   countText: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#6B7280",
//   },

//   // ── List ──
//   listContent: {
//     paddingBottom: 40,
//     flexGrow: 1,
//   },
//   columnWrapper: {
//     justifyContent: "space-between",
//     marginBottom: 16,
//   },

//   // ── Card ──
//   cardWrapper: {
//     width: "48%",
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     overflow: "hidden",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   cardImage: {
//     width: "100%",
//     height: 130,
//     backgroundColor: "#F3F4F6",
//   },
//   badgeWrap: {
//     position: "absolute",
//     top: 8,
//     left: 8,
//     right: 8,
//   },
//   badge: {
//     backgroundColor: "rgba(16, 185, 129, 0.9)",
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     alignSelf: "flex-start",
//     maxWidth: "100%",
//   },
//   badgeText: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },
//   cardContent: {
//     padding: 12,
//     backgroundColor: "#FFFFFF",
//   },
//   cardName: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 4,
//     letterSpacing: 0.3,
//   },
//   cardDetails: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#6B7280",
//     lineHeight: 17,
//     marginBottom: 6,
//   },
//   phoneRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 4,
//     marginTop: 4,
//   },
//   phoneText: {
//     fontSize: 11,
//     fontWeight: "600",
//     color: "#10B981",
//   },

//   // ── Empty ──
//   emptyState: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 60,
//   },
//   lottie: {
//     width: 180,
//     height: 180,
//   },
//   emptyTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 12,
//     letterSpacing: 0.3,
//   },
//   emptySubtitle: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginTop: 6,
//     textAlign: "center",
//   },
// });

// export default ServiceView;


import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

const PLACEHOLDER_IMAGE =
  "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

const ServiceView = ({ navigation }) => {
  const animation = useRef(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: artisanData,
    isLoading,
    refetch,
  } = useFetchData_v2("api/v1/artisan", "artisans");

  const artisans = artisanData?.data || [];

  const filtered = artisans.filter(
    (item) =>
      item?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      item?.typeOfJob?.toLowerCase().includes(search.toLowerCase()),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("vendorService", { item })}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
          style={styles.cardImage}
        />

        {/* Job type badge */}
        <View style={styles.badgeWrap}>
          <View style={styles.badge}>
            <Text style={styles.badgeText} numberOfLines={1}>
              {item?.typeOfJob || "Service"}
            </Text>
          </View>
        </View>

        {/* Rating pill — overlaid bottom-right of image */}
        {item?.avgRating > 0 && (
          <View style={styles.ratingPill}>
            <MaterialCommunityIcons name="star" size={11} color="#F59E0B" />
            <Text style={styles.ratingPillText}>
              {item.avgRating.toFixed(1)}
            </Text>
          </View>
        )}

        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item?.fullName}
          </Text>

          {item?.details ? (
            <Text style={styles.cardDetails} numberOfLines={2}>
              {item.details}
            </Text>
          ) : null}

          {item?.phone_number ? (
            <View style={styles.phoneRow}>
              <MaterialCommunityIcons
                name="phone-outline"
                size={13}
                color="#10B981"
              />
              <Text style={styles.phoneText}>{item.phone_number}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.lottie}
        source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
      />
      <Text style={styles.emptyTitle}>No services found</Text>
      <Text style={styles.emptySubtitle}>
        {search ? "Try a different search term" : "No artisans registered yet"}
      </Text>
    </View>
  );

  return (
    <ScreenWrapper
      title="Services"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <View style={styles.container}>
        <View style={styles.searchCard}>
          <View style={styles.searchRow}>
            <MaterialCommunityIcons
              name="magnify"
              size={20}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <TextInput
              placeholder="Search by name or service..."
              style={styles.searchInput}
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            {search !== "" && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <MaterialCommunityIcons
                  name="close-circle"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {filtered.length > 0 && (
          <View style={styles.countRow}>
            <MaterialCommunityIcons
              name="account-hard-hat-outline"
              size={16}
              color="#10B981"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.countText}>
              {filtered.length}{" "}
              {filtered.length === 1 ? "artisan" : "artisans"}
            </Text>
          </View>
        )}

        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item, index) => item?._id || index.toString()}
          ListEmptyComponent={renderEmpty}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
              colors={["#10B981"]}
            />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },
  countRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  countText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  listContent: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardWrapper: {
    width: "48%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#F3F4F6",
  },
  badgeWrap: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
  },
  badge: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  // ── Rating pill — bottom-right corner of image ──
  ratingPill: {
    position: "absolute",
    bottom: 138, // just above the card content (130px image + 8px gap)
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  ratingPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardContent: {
    padding: 12,
    backgroundColor: "#FFFFFF",
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  cardDetails: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 17,
    marginBottom: 6,
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  phoneText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    letterSpacing: 0.3,
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
});

export default ServiceView;