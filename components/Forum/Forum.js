// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   RefreshControl,
//   ScrollView,
//   Platform,
//   KeyboardAvoidingView,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
// import AppScreen from "../shared/AppScreen";
// import {
//   LightFontText,
//   MediumFontText,
//   RegularFontText,
// } from "../shared/Paragrahp";
// import ForumModal from "./ForumModal";
// import ForumAdCard from "./ForumAdCard"; // Import the new Ad component
// import { useNavigation } from "@react-navigation/native";
// import { useDispatch, useSelector } from "react-redux";
// import { Get_My_Clan_Forum_Fun } from "../../Redux/UserSide/ForumSlice";
// import { formatDate, formatDateandTime } from "../../utils/DateTime";
// import LottieView from "lottie-react-native";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// import { API_CONFIG } from "../../api";
// import { useFetchData_v2 } from "../../hooks/Requestv2";

// const API_BASEURL = API_CONFIG?.BASE_URL;
// console.log({
//   tyyy: API_BASEURL,
// });

// // Sample Advertisement Data for Forum
// const forumAdvertisements = [
//   {
//     id: "forum_ad_1",
//     title: "Premium Estate Services",
//     subtitle: "24/7 Support Available",
//     description:
//       "Get professional maintenance and security services for your estate. Contact us today for a free consultation!",
//     imageUrl:
//       "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/estate-services",
//   },
//   {
//     id: "forum_ad_2",
//     title: "Local Grocery Delivery",
//     subtitle: "Fresh & Fast Delivery",
//     description:
//       "Order fresh groceries and get them delivered to your doorstep within 2 hours. First order discount available!",
//     imageUrl:
//       "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/grocery-delivery",
//   },
//   {
//     id: "forum_ad_3",
//     title: "Smart Home Installation",
//     subtitle: "Upgrade Your Living",
//     description:
//       "Transform your home with our smart home solutions. Professional installation and lifetime support included.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/smart-home",
//   },
//   {
//     id: "forum_ad_4",
//     title: "Fitness & Wellness Center",
//     subtitle: "Join Today - 50% Off",
//     description:
//       "State-of-the-art gym facilities near you. Personal trainers, yoga classes, and swimming pool access.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/fitness-center",
//   },
//   {
//     id: "forum_ad_5",
//     title: "Premium Cleaning Services",
//     subtitle: "Book Your First Clean",
//     description:
//       "Professional deep cleaning for homes and offices. Eco-friendly products and insured staff.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/cleaning",
//   },
//   {
//     id: "forum_ad_6",
//     title: "Solar Panel Installation",
//     subtitle: "Save on Energy Bills",
//     description:
//       "Switch to renewable energy with our affordable solar solutions. Government subsidies available.",
//     imageUrl:
//       "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
//     linkUrl: "https://www.pausepoint.net/", // "https://www.example.com/solar",
//   },
// ];

// const Forum = () => {
//   const [isModalVisible, setModalVisible] = useState(false);
//   const dispatch = useDispatch();
//   const animation = useRef(null);
//   const navigation = useNavigation();
//   const [refreshing, setRefreshing] = useState(false);

//   const { data: get_my_clan_forum_data, isLoading: isLoadingCategories } =
//     useFetchData_v2(`api/v1/forum`, `forum`);

//   const onRefresh = () => {
//     setRefreshing(true);
//     // dispatch(Get_My_Clan_Forum_Fun());
//     setRefreshing(false);
//   };

//   const Like_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       let url = `${API_BASEURL}forum/like/${data_info?.clanId}/${data_info?.forumid}`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           // Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.get(url, config);
//     },
//     onSuccess: (success) => {
//       dispatch(Get_My_Clan_Forum_Fun());
//     },
//     onError: (error) => {
//       Toast.show({
//         type: "error",
//         text1: `${error?.response?.data?.message} `,
//       });
//     },
//   });

//   const { get_my_clan_forum_message } = useSelector(
//     (state) => state.ForumSlice,
//   );

//   const { get_user_profile_data } = useSelector(
//     (state) => state.UserProfileSlice,
//   );

//   const toggleModal = () => {
//     setModalVisible(!isModalVisible);
//   };

//   // Function to insert ads into forum posts
//   const getForumDataWithAds = () => {
//     if (!get_my_clan_forum_data) return [];

//     const posts = get_my_clan_forum_data;
//     const dataWithAds = [];
//     let adIndex = 0;

//     posts.forEach((post, index) => {
//       // Add the post
//       dataWithAds.push({ type: "post", data: post });

//       // Add an ad after every 2 posts
//       if ((index + 1) % 2 === 0 && adIndex < forumAdvertisements.length) {
//         dataWithAds.push({
//           type: "ad",
//           data: forumAdvertisements[adIndex % forumAdvertisements.length],
//         });
//         adIndex++;
//       }
//     });

//     return dataWithAds;
//   };

//   const renderItem = ({ item }) => {
//     if (item.type === "ad") {
//       return <ForumAdCard ad={item.data} />;
//     }

//     // Regular post rendering
//     const post = item.data;
//     return (
//       <TouchableOpacity
//         style={styles.postCard}
//         onPress={() => navigation.navigate("forumdetail", post)}
//         activeOpacity={0.7}
//       >
//         {/* Post Header */}
//         <View style={styles.postHeader}>
//           <View style={styles.authorContainer}>
//             <View style={styles.avatarContainer}>
//               <Image
//                 source={{ uri: post?.user?.photo }}
//                 style={styles.avatar}
//               />
//               <View style={styles.onlineBadge} />
//             </View>
//             <View style={styles.authorInfo}>
//               <Text style={styles.authorName}>{post?.user?.name}</Text>
//               <View style={styles.timestampContainer}>
//                 <MaterialCommunityIcons
//                   name="clock-outline"
//                   size={12}
//                   color="#9CA3AF"
//                   style={{ marginRight: 4 }}
//                 />
//                 <Text style={styles.timestamp}>
//                   {formatDateandTime(post?.createdAt)}
//                 </Text>
//               </View>
//             </View>
//           </View>
//         </View>

//         {/* Post Content */}
//         <Text style={styles.postContent} numberOfLines={4}>
//           {post?.content}
//         </Text>

//         {/* Post Actions */}
//         <View style={styles.postActions}>
//           <TouchableOpacity
//             style={styles.actionButton}
//             // onPress={(e) => {
//             //   e.stopPropagation();
//             //   Like_Mutation.mutate({
//             //     forumid: post?._id,
//             //     clanId: post?.clan,
//             //   });
//             // }}
//             activeOpacity={0.7}
//           >
//             <View
//               style={[
//                 styles.actionIconContainer,
//                 { backgroundColor: "#FEE2E2" },
//               ]}
//             >
//               <MaterialCommunityIcons
//                 // name={
//                 //   post?.likes?.includes(user_data?.user?._id)
//                 //     ? "heart"
//                 //     : "heart-outline"
//                 //  this is realy needed}
//                 name="heart"
//                 size={18}
//                 color="#DC2626"
//               />
//             </View>
//             <Text style={styles.actionText}>{post?.likes?.length || 0}</Text>
//             <Text style={styles.actionLabel}>Likes</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.actionButton}
//             // onPress={(e) => {
//             //   e.stopPropagation();
//             //   navigation.navigate("forumdetail", post);
//             // }}
//             activeOpacity={0.7}
//           >
//             <View
//               style={[
//                 styles.actionIconContainer,
//                 { backgroundColor: "#DBEAFE" },
//               ]}
//             >
//               <MaterialCommunityIcons
//                 name="comment-outline"
//                 size={18}
//                 color="#3B82F6"
//               />
//             </View>
//             <Text style={styles.actionText}>{post?.comments?.length || 0}</Text>
//             <Text style={styles.actionLabel}>Comments</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={styles.viewDetailsButton}
//             // onPress={() => navigation.navigate("forumdetail", post)}
//             activeOpacity={0.7}
//           >
//             <Text style={styles.viewDetailsText}>View Details</Text>
//             <MaterialCommunityIcons
//               name="chevron-right"
//               size={16}
//               color="#10B981"
//             />
//           </TouchableOpacity>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <AppScreen style={styles.appScreen}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         <View style={styles.content}>
//           <>
//             {/* Header */}
//             <View style={styles.header}>
//               <View style={styles.headerContent}>
//                 <MaterialCommunityIcons
//                   name="forum"
//                   size={24}
//                   color="#10B981"
//                 />
//                 <Text style={styles.headerTitle}>Community Forum</Text>
//               </View>
//               {get_user_profile_data?.currentClanMeeting?.name && (
//                 <Text style={styles.headerSubtitle}>
//                   {get_user_profile_data.currentClanMeeting.name}
//                 </Text>
//               )}
//             </View>

//             {/* Empty State with Message */}
//             {get_my_clan_forum_message && (
//               <View style={styles.emptyStateContainer}>
//                 <LottieView
//                   autoPlay
//                   ref={animation}
//                   style={styles.lottieAnimation}
//                   source={require("../../assets/Lottie/notFund.json")}
//                 />
//                 <Text style={styles.emptyStateText}>
//                   {get_my_clan_forum_message}
//                 </Text>
//               </View>
//             )}

//             {/* Forum Posts List with Ads */}
//             <FlatList
//               data={getForumDataWithAds()}
//               keyExtractor={(item, index) =>
//                 item.type === "ad"
//                   ? `ad-${item.data.id}-${index}`
//                   : `post-${item.data._id}`
//               }
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.listContent}
//               refreshControl={
//                 <RefreshControl
//                   refreshing={refreshing}
//                   onRefresh={onRefresh}
//                   colors={["#10B981"]}
//                   tintColor="#10B981"
//                 />
//               }
//               renderItem={renderItem}
//               ListEmptyComponent={
//                 !get_my_clan_forum_message && (
//                   <View style={styles.emptyStateContainer}>
//                     <LottieView
//                       autoPlay
//                       ref={animation}
//                       style={styles.lottieAnimation}
//                       source={require("../../assets/Lottie/notFund.json")}
//                     />
//                     <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
//                     <Text style={styles.emptyStateSubtext}>
//                       Be the first to start a conversation!
//                     </Text>
//                   </View>
//                 )
//               }
//             />

//             {/* Floating Action Button */}
//             {/* pls add this when you have fix the create screen  */}
//             {/* <TouchableOpacity
//                 style={styles.fab}
//                 onPress={() => navigation.navigate("createforum")}
//                 activeOpacity={0.8}
//               >
//                 <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
//               </TouchableOpacity> */}
//           </>

//           <ForumModal visible={isModalVisible} onClose={toggleModal} />
//         </View>
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default Forum;

// const styles = StyleSheet.create({
//   appScreen: {
//     paddingHorizontal: 0,
//   },
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   content: {
//     flex: 1,
//   },
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 16,
//     paddingTop: 20,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 4,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#111827",
//     marginLeft: 10,
//     letterSpacing: 0.3,
//   },
//   headerSubtitle: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginLeft: 34,
//   },
//   listContent: {
//     paddingHorizontal: 16,
//     paddingTop: 16,
//     paddingBottom: 100,
//   },
//   postCard: {
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
//   postHeader: {
//     marginBottom: 12,
//   },
//   authorContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   avatarContainer: {
//     position: "relative",
//     marginRight: 12,
//   },
//   avatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     borderWidth: 2,
//     borderColor: "#E5E7EB",
//   },
//   onlineBadge: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: "#10B981",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   authorInfo: {
//     flex: 1,
//   },
//   authorName: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 2,
//     letterSpacing: 0.3,
//   },
//   timestampContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   timestamp: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#9CA3AF",
//   },
//   postContent: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//     lineHeight: 20,
//     marginBottom: 12,
//   },
//   postActions: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//   },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginRight: 20,
//   },
//   actionIconContainer: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 6,
//   },
//   actionText: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#111827",
//     marginRight: 4,
//   },
//   actionLabel: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6B7280",
//   },
//   viewDetailsButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginLeft: "auto",
//     backgroundColor: "#D1FAE5",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   viewDetailsText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#10B981",
//     marginRight: 4,
//     letterSpacing: 0.3,
//   },
//   emptyStateContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 60,
//     paddingHorizontal: 32,
//   },
//   lottieAnimation: {
//     width: 200,
//     height: 200,
//   },
//   emptyStateTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginTop: 16,
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   emptyStateSubtext: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#9CA3AF",
//     textAlign: "center",
//     lineHeight: 20,
//   },
//   fab: {
//     position: "absolute",
//     right: 20,
//     top: 24,
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
//   noClanContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 32,
//   },
//   noClanCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 32,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   noClanIconContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "#F3F4F6",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 24,
//   },
//   noClanTitle: {
//     fontSize: 20,
//     fontWeight: "800",
//     color: "#111827",
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   noClanSubtext: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 24,
//   },
//   joinClanButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#10B981",
//     paddingHorizontal: 24,
//     paddingVertical: 14,
//     borderRadius: 16,
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   joinClanButtonText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },
// });

import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useRef, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppScreen from "../shared/AppScreen";
import ForumModal from "./ForumModal";
import ForumAdCard from "./ForumAdCard";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { formatDateandTime } from "../../utils/DateTime";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

import { useFetchData_v2, useMutateData_v2 } from "../../hooks/Requestv2";

// ── Ad data ──────────────────────────────────────────────
const forumAdvertisements = [
  {
    id: "forum_ad_1",
    title: "Premium Estate Services",
    subtitle: "24/7 Support Available",
    description:
      "Get professional maintenance and security services for your estate.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    linkUrl: "https://www.pausepoint.net/",
  },
  {
    id: "forum_ad_2",
    title: "Local Grocery Delivery",
    subtitle: "Fresh & Fast Delivery",
    description:
      "Order fresh groceries delivered to your doorstep within 2 hours.",
    imageUrl:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
    linkUrl: "https://www.pausepoint.net/",
  },
  {
    id: "forum_ad_3",
    title: "Smart Home Installation",
    subtitle: "Upgrade Your Living",
    description: "Transform your home with our smart home solutions.",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
    linkUrl: "https://www.pausepoint.net/",
  },
];

const Forum = () => {
  const animation = useRef(null);
  const navigation = useNavigation();
  const [isModalVisible, setModalVisible] = useState(false);

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  const currentUserId = get_user_profile_data?.user?._id;

  // ── Fetch all forum posts ────────────────────────────────
  const {
    data: get_my_clan_forum_data,
    isLoading,
    isFetching,
    refetch,
  } = useFetchData_v2("api/v1/forum", "forum");

  // ── Like mutation ────────────────────────────────────────
  const likeMutation = useMutateData_v2(
    "api/v1/forum/like",
    "PATCH",
    ["forum"], // invalidates forum list on success so likes update
    {
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to like post",
        });
      },
    },
  );

  // ── Mix ads into posts ───────────────────────────────────
  const getForumDataWithAds = () => {
    const posts = get_my_clan_forum_data || [];
    const dataWithAds = [];
    let adIndex = 0;

    posts.forEach((post, index) => {
      dataWithAds.push({ type: "post", data: post });
      if ((index + 1) % 2 === 0 && adIndex < forumAdvertisements.length) {
        dataWithAds.push({
          type: "ad",
          data: forumAdvertisements[adIndex % forumAdvertisements.length],
        });
        adIndex++;
      }
    });

    return dataWithAds;
  };

  // ── Render each item ─────────────────────────────────────
  const renderItem = ({ item }) => {
    if (item.type === "ad") return <ForumAdCard ad={item.data} />;

    const post = item.data;
    const isLiked = post?.likes?.includes(currentUserId);
    const isLiking = likeMutation.isPending;

    return (
      <TouchableOpacity
        style={styles.postCard}
        onPress={() => navigation.navigate("forumdetail", post)}
        activeOpacity={0.7}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.authorContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={{ uri: post?.user?.photo }}
                style={styles.avatar}
              />
              <View style={styles.onlineBadge} />
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post?.user?.name}</Text>
              <View style={styles.timestampContainer}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={12}
                  color="#9CA3AF"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.timestamp}>
                  {formatDateandTime(post?.createdAt)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent} numberOfLines={4}>
          {post?.content}
        </Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          {/* Like button — fully wired */}
          <TouchableOpacity
            style={[styles.actionButton, isLiking && { opacity: 0.5 }]}
            onPress={(e) => {
              e.stopPropagation?.();
              if (!isLiking) {
                likeMutation.mutate({ forumId: post?._id });
              }
            }}
            disabled={isLiking}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: isLiked ? "#FEE2E2" : "#F3F4F6" },
              ]}
            >
              <MaterialCommunityIcons
                name={isLiked ? "heart" : "heart-outline"}
                size={18}
                color={isLiked ? "#DC2626" : "#6B7280"}
              />
            </View>
            <Text style={[styles.actionText, isLiked && { color: "#DC2626" }]}>
              {post?.likes?.length || 0}
            </Text>
            <Text style={styles.actionLabel}>Likes</Text>
          </TouchableOpacity>

          {/* Comment count */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate("forumdetail", post)}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.actionIconContainer,
                { backgroundColor: "#DBEAFE" },
              ]}
            >
              <MaterialCommunityIcons
                name="comment-outline"
                size={18}
                color="#3B82F6"
              />
            </View>
            <Text style={styles.actionText}>{post?.comments?.length || 0}</Text>
            <Text style={styles.actionLabel}>Comments</Text>
          </TouchableOpacity>

          {/* View details */}
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate("forumdetail", post)}
            activeOpacity={0.7}
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={16}
              color="#10B981"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen style={styles.appScreen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialCommunityIcons name="forum" size={24} color="#10B981" />
              <Text style={styles.headerTitle}>Community Forum</Text>
            </View>
            {get_user_profile_data?.currentClanMeeting?.name && (
              <Text style={styles.headerSubtitle}>
                {get_user_profile_data.currentClanMeeting.name}
              </Text>
            )}
          </View>

          {/* List */}
          <FlatList
            data={getForumDataWithAds()}
            keyExtractor={(item, index) =>
              item.type === "ad"
                ? `ad-${item.data.id}-${index}`
                : `post-${item.data._id}`
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={refetch}
                colors={["#10B981"]}
                tintColor="#10B981"
              />
            }
            renderItem={renderItem}
            ListEmptyComponent={
              <View style={styles.emptyStateContainer}>
                <LottieView
                  autoPlay
                  ref={animation}
                  style={styles.lottieAnimation}
                  source={require("../../assets/Lottie/notFund.json")}
                />
                <Text style={styles.emptyStateTitle}>No Posts Yet</Text>
                <Text style={styles.emptyStateSubtext}>
                  Be the first to start a conversation!
                </Text>
              </View>
            }
          />

          <ForumModal
            visible={isModalVisible}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default Forum;

const styles = StyleSheet.create({
  appScreen: { paddingHorizontal: 0 },
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { flex: 1 },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 34,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  postCard: {
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
  postHeader: { marginBottom: 12 },
  authorContainer: { flexDirection: "row", alignItems: "center" },
  avatarContainer: { position: "relative", marginRight: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  onlineBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  authorInfo: { flex: 1 },
  authorName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  timestampContainer: { flexDirection: "row", alignItems: "center" },
  timestamp: { fontSize: 12, fontWeight: "500", color: "#9CA3AF" },
  postContent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginRight: 4,
  },
  actionLabel: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  viewDetailsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#10B981",
    marginRight: 4,
    letterSpacing: 0.3,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  lottieAnimation: { width: 200, height: 200 },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
  },
});
