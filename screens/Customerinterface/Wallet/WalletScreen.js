// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   RefreshControl,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import * as Clipboard from "expo-clipboard";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import {
//   MaterialCommunityIcons,
//   FontAwesome5,
//   Ionicons,
//   MaterialIcons,
//   Entypo,
//   AntDesign,
// } from "@expo/vector-icons";
// {
//   /* <FontAwesome5 name="superpowers" size={24} color="black" /> */
// }
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// import SafeHavenCard from "./safehaven/SafeHavenCard";
// import { useFetchData_v2 } from "../../../hooks/Requestv2";
// import DueNotificationChecker from "./DueNotificationChecker";

// const WalletScreen = ({}) => {
//   const {
//     data,
//     isLoading,
//     error,
//     refetch: refetchWallet,
//   } = useFetchData_v2("api/v1/wallet", "wallet");

//   let mainBalance = data?.balance;

//   const { get_user_profile_data } = useSelector(
//     (state) => state.UserProfileSlice,
//   );

//   const { userDatav2 } = useSelector((state) => state.authSlice);



//   const clanMembers = get_user_profile_data?.data?.currentClanMeeting?.members



// const currentMember = clanMembers?.find(
//   (member) => member.user?.toString() === userDatav2?.data?.user?.id?.toString()
// );

// const isApproved = currentMember?.status === "approved";




//   const isGuest = false; //  user_data?.user?.isGuest;

//   const navigation = useNavigation();
//   const [refreshing, setRefreshing] = useState(false);

//   const quickLinks = [
//     {
//       id: 1,
//       name: "My Clans",
//       icon: "people-outline",
//       iconSet: Ionicons,
//       color: "#2196F3",
//       type: "clans",
//       route: "myclan",
//       params: {},
//       condition: true //userDatav2?.data?.isInClan,
//     },
//        {
//       id: 3,
//       name: "Dues",
//       icon: "superpowers",
//       iconSet: FontAwesome5,
//       color: "#009688",
//       type: "amenities",
//       route: "Due",
//       params: {},
//       condition: isApproved//userDatav2?.data?.isInClan,
//     },
//         {
//       id: 6,
//       name: "Artisan",
//       icon: "room-service",
//       iconSet: MaterialIcons,
//       color: "#FF9800",
//       type: "service",
//       route: "service",
//       params: {},
//       condition: true,
//     },
//     {
//       id: 7,
//       name: "Marketplace",
//       icon: "store",
//       iconSet: MaterialIcons,
//       color: "#00BCD4",
//       type: "marketplace",
//       route: "Marketplace",
//       params: {},
//       condition: true,
//     },
//      {
//       id: 11,
//       name: "Access card",
//       icon: "card",
//       iconSet: Ionicons,
//       color: "#2196F3",
//       type: "clans",
//       route: "UserCard",
//       params: {},
//       condition: isApproved //userDatav2?.data?.isInClan,
//     },
//     {
//       id: 2,
//       name: "Amenities",
//       icon: "apartment",
//       iconSet: MaterialIcons,
//       color: "#009688",
//       type: "amenities",
//       route: "amentities",
//       params: {},
//       condition: isApproved//userDatav2?.data?.isInClan,
//     },
 

//     {
//       id: 4,
//       name: "Emergency",
//       icon: "emergency",
//       iconSet: MaterialIcons,
//       color: "#F44336",
//       type: "emergency",
//       route: "Emergencyscreen",
//       params: {},
//       condition: isApproved//userDatav2?.data?.isInClan,
//     },
//     {
//       id: 5,
//       name: "Polls/Surveys",
//       icon: "poll",
//       iconSet: MaterialIcons,
//       color: "#9C27B0",
//       type: "polls",
//       route: "userpolls",
//       params: {},
//       condition: isApproved//userDatav2?.data?.isInClan,
//     },

//     {
//       id: 8,
//       name: "ICE Contacts",
//       icon: "contact-phone",
//       iconSet: MaterialIcons,
//       color: "#E91E63",
//       type: "ice",
//       route: "icecontact",
//       params: {},
//       condition: true,
//     },
//     {
//       id: 9,
//       name: "Domestic Staff",
//       icon: "people",
//       iconSet: MaterialIcons,
//       color: "#3F51B5",
//       type: "domestic",
//       route: "domestic",
//       params: {},
//       condition: isApproved//userDatav2?.data?.isInClan,
//     },

//     // {
//     //   id: 10,
//     //   name: "General Dues",
//     //   icon: "superpowers",
//     //   iconSet: FontAwesome5,
//     //   color: "#009688",
//     //   type: "amenities",
//     //   route: "GeneralDuesUser",
//     //   params: {},
//     //   condition: userDatav2?.data?.isInClan,
//     // },
//   ];

//   const visibleQuickLinks = quickLinks.filter((link) => link.condition);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     try {
//       await refetchWallet();
//     } catch (error) {
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   const handleReloadWallet = async () => {
//     try {
//       const { data } = await refetchWallet();
//       if (data) {
//         Alert.alert("Success", "Wallet balance updated!");
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to refresh wallet. Please try again.");
//     }
//   };

//   return (
//     <ScrollView
//       style={{ flex: 1 }}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <View style={styles.container}>
//         {/* ================================
//             WALLET BALANCE CARD 
//         ================================ */}
//         <View
//           style={{
//             backgroundColor: "#10B981",
//             borderRadius: 20,
//             padding: 24,
//             shadowColor: "#10B981",
//             shadowOffset: { width: 0, height: 8 },
//             shadowOpacity: 0.3,
//             shadowRadius: 12,
//             elevation: 8,
//             overflow: "hidden",
//           }}
//         >
//           {/* Decorative circles */}
//           <View
//             style={{
//               position: "absolute",
//               top: -30,
//               right: -30,
//               width: 120,
//               height: 120,
//               borderRadius: 60,
//               backgroundColor: "rgba(255, 255, 255, 0.1)",
//             }}
//           />
//           <View
//             style={{
//               position: "absolute",
//               bottom: -20,
//               left: -20,
//               width: 80,
//               height: 80,
//               borderRadius: 40,
//               backgroundColor: "rgba(255, 255, 255, 0.08)",
//             }}
//           />

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//               marginBottom: 20,
//             }}
//           >
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
//               <MaterialCommunityIcons
//                 name="wallet"
//                 size={20}
//                 color="rgba(255, 255, 255, 0.9)"
//                 style={{ marginRight: 8 }}
//               />
//               <Text
//                 style={{
//                   color: "rgba(255, 255, 255, 0.9)",
//                   fontSize: 13,
//                   fontWeight: "500",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 Available Balance
//               </Text>
//               <TouchableOpacity
//                 onPress={handleReloadWallet}
//                 disabled={isLoading}
//                 style={{
//                   marginLeft: 12,
//                   padding: 6,
//                   backgroundColor: "rgba(255, 255, 255, 0.15)",
//                   borderRadius: 8,
//                 }}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <MaterialCommunityIcons
//                     name="reload"
//                     size={18}
//                     color="#FFFFFF"
//                   />
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               alignItems: "center",
//             }}
//           >
//             <View>
//               <Text
//                 style={{
//                   color: "#FFFFFF",
//                   fontSize: 32,
//                   fontWeight: "700",
//                   letterSpacing: 0.5,
//                 }}
//               >
//                 ₦{mainBalance?.toFixed(2) ?? "0.00"}
//               </Text>
//               <Text
//                 style={{
//                   color: "rgba(255, 255, 255, 0.7)",
//                   fontSize: 12,
//                   marginTop: 4,
//                 }}
//               >
//                 Tap reload to refresh
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={{
//                 backgroundColor: "#FFFFFF",
//                 paddingHorizontal: 20,
//                 paddingVertical: 12,
//                 borderRadius: 25,
//                 flexDirection: "row",
//                 alignItems: "center",
//                 shadowColor: "#000",
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: 3,
//               }}
//               onPress={() => navigation.navigate("FundWallet")}
//             >
//               <MaterialCommunityIcons
//                 name="plus"
//                 size={18}
//                 color="#10B981"
//                 style={{ marginRight: 6 }}
//               />
//               <Text
//                 style={{
//                   color: "#10B981",
//                   fontWeight: "700",
//                   fontSize: 14,
//                   letterSpacing: 0.3,
//                 }}
//               >
//                 Add Money
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ================================
//             👇 ADD VIRTUAL ACCOUNT CARD HERE
//         ================================ */}
//         <SafeHavenCard />

//         {/* ================================
//             BILLS PAYMENT SECTION
//         ================================ */}
//         <View
//           style={{
//             marginTop: 24,
//             marginBottom: 20,
//             backgroundColor: "#FFFFFF",
//             padding: 16,
//             borderRadius: 16,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 8,
//             elevation: 3,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="flash"
//               size={20}
//               color="#10B981"
//               style={{ marginRight: 8 }}
//             />
//             <Text
//               style={{
//                 fontSize: 16,
//                 fontWeight: "700",
//                 color: "#1F2937",
//                 letterSpacing: 0.3,
//               }}
//             >
//               Bills Payment
//             </Text>
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               flexWrap: "wrap",
//               justifyContent: "space-between",
//             }}
//           >
//             {/* Electricity */}

//             <TouchableOpacity
//               style={{
//                 width: "30%",
//                 alignItems: "center",
//                 marginBottom: 16,
//               }}
//               onPress={() =>
//                 navigation.navigate("UtilityPayment", {
//                   billType: "electricty",
//                 })
//               }
//             >
//               <View
//                 style={{
//                   width: 56,
//                   height: 56,
//                   backgroundColor: "#FEF3C7",
//                   borderRadius: 16,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginBottom: 8,
//                 }}
//               >
//                 <Icon name="electric-bolt" size={28} color="#F59E0B" />
//               </View>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#374151",
//                   textAlign: "center",
//                   fontWeight: "500",
//                 }}
//               >
//                 Electricity
//               </Text>
//             </TouchableOpacity>

//             {/* Airtime */}
//             <TouchableOpacity
//               style={{
//                 width: "30%",
//                 alignItems: "center",
//                 marginBottom: 16,
//               }}
//               onPress={() =>
//                 navigation.navigate("Airtime", {
//                   data: {
//                     _id: "61efaba1da92348f9dde5f6c",
//                     name: "Mobile Recharge",
//                     identifier: "AIRTIME",
//                     description: "Airtime Recharge",
//                     createdAt: "2022-01-25T07:49:53.181Z",
//                     updatedAt: "2022-01-25T07:49:53.181Z",
//                     __v: 0,
//                   },
//                 })
//               }
//             >
//               <View
//                 style={{
//                   width: 56,
//                   height: 56,
//                   backgroundColor: "#E0E7FF",
//                   borderRadius: 16,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginBottom: 8,
//                 }}
//               >

//                 <MaterialIcons name="call" size={24} color="black" />
//                 {/* <MaterialCommunityIcons name="aliyun" size={26} color="#6366F1" /> */}
//               </View>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#374151",
//                   textAlign: "center",
//                   fontWeight: "500",
//                 }}
//               >
//                 Airtime
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={{
//                 width: "30%",
//                 alignItems: "center",
//                 marginBottom: 16,
//               }}
//               onPress={() =>
//                 navigation.navigate("DataPurchase", {
//                   data: {
//                     _id: "61efabb2da92348f9dde5f6e",
//                     name: "DATA PURCHASE",
//                     identifier: "DATA",
//                     description: "Data bundle subscription",

//                     __v: 0,
//                   },
//                 })
//               }
//             >
//               <View
//                 style={{
//                   width: 56,
//                   height: 56,
//                   backgroundColor: "#E0E7FF",
//                   borderRadius: 16,
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginBottom: 8,
//                 }}
//               >
//                 <MaterialIcons
//                   name="signal-wifi-statusbar-connected-no-internet-4"
//                   size={24}
//                   color="black"
//                 />
//               </View>
//               <Text
//                 style={{
//                   fontSize: 12,
//                   color: "#374151",
//                   textAlign: "center",
//                   fontWeight: "500",
//                 }}
//               >
//                 Data
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* ================================
//             QUICK LINKS SECTION
//         ================================ */}
//         <View
//           style={{
//             marginTop: 20,
//             marginBottom: 20,
//             backgroundColor: "#FFFFFF",
//             padding: 16,
//             borderRadius: 16,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 2 },
//             shadowOpacity: 0.05,
//             shadowRadius: 8,
//             elevation: 3,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 16,
//             }}
//           >
//             <MaterialCommunityIcons
//               name="link-variant"
//               size={20}
//               color="#10B981"
//               style={{ marginRight: 8 }}
//             />
//             <Text
//               style={{
//                 fontSize: 16,
//                 fontWeight: "700",
//                 color: "#1F2937",
//                 letterSpacing: 0.3,
//               }}
//             >
//               Quick Links
//             </Text>
//           </View>

//           <View
//             style={{
//               flexDirection: "row",
//               flexWrap: "wrap",
//               justifyContent: "space-between",
//             }}
//           >
//             {visibleQuickLinks.map((link) => {
//               const IconComponent = link.iconSet;
//               return (
//                 <TouchableOpacity
//                   key={link.id}
//                   style={{
//                     width: "25%",
//                     alignItems: "center",
//                     marginBottom: 20,
//                   }}
//                   onPress={() => navigation.navigate(link.route, link.params)}
//                 >
//                   <View
//                     style={{
//                       width: 50,
//                       height: 50,
//                       backgroundColor: `${link.color}15`,
//                       borderRadius: 16,
//                       justifyContent: "center",
//                       alignItems: "center",
//                       marginBottom: 8,
//                     }}
//                   >
//                     <IconComponent
//                       name={link.icon}
//                       size={24}
//                       color={link.color}
//                     />
//                   </View>
//                   <Text
//                     style={{
//                       fontSize: 11,
//                       color: "#374151",
//                       textAlign: "center",
//                       fontWeight: "500",
//                       lineHeight: 14,
//                     }}
//                   >
//                     {link.name}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingVertical: 20,
//     paddingHorizontal: 10,
//   },
// });

// export default WalletScreen;



import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  AppState,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import SafeHavenCard from "./safehaven/SafeHavenCard";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import DueNotificationChecker from "./DueNotificationChecker";

// ── Emergency type config ─────────────────────────────────────────────────────
const EMERGENCY_CONFIG = {
  fire:       { icon: "fire",          color: "#EF4444", bg: "#FEE2E2", label: "Fire"       },
  health:     { icon: "hospital-box",  color: "#3B82F6", bg: "#DBEAFE", label: "Health"     },
  theft:      { icon: "shield-alert",  color: "#F59E0B", bg: "#FEF3C7", label: "Theft"      },
  kidnapping: { icon: "alert-octagon", color: "#8B5CF6", bg: "#EDE9FE", label: "Kidnapping" },
  burglary:   { icon: "door-open",     color: "#EC4899", bg: "#FCE7F3", label: "Burglary"   },
};

const WalletScreen = ({}) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData_v2("api/v1/wallet", "wallet");

  // ── Active emergencies ────────────────────────────────────────────────────
  const {
    data: emergencyData,
    refetch: refetchEmergencies,
  } = useFetchData_v2("api/v1/Emergencyreport/active", "activeEmergencies");

  const activeEmergencies = emergencyData?.data || [];
  const [emergencyModalVisible, setEmergencyModalVisible] = useState(false);
  const appState = useRef(AppState.currentState);

  // Show modal when active emergencies load
  useEffect(() => {
    if (activeEmergencies.length > 0) {
      setEmergencyModalVisible(true);
    }
  }, [activeEmergencies.length]);

  // Refetch when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        refetchEmergencies();
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, []);

  const latestEmergency = activeEmergencies[0];
  const emergencyConfig = latestEmergency
    ? EMERGENCY_CONFIG[latestEmergency.type] || {
        icon: "alert-circle",
        color: "#EF4444",
        bg: "#FEE2E2",
        label: "Emergency",
      }
    : null;

  let mainBalance = data?.balance;

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  const { userDatav2 } = useSelector((state) => state.authSlice);

  const clanMembers = get_user_profile_data?.data?.currentClanMeeting?.members;

  const currentMember = clanMembers?.find(
    (member) => member.user?.toString() === userDatav2?.data?.user?.id?.toString()
  );

  const isApproved = currentMember?.status === "approved";

  const isGuest = false;
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const quickLinks = [
    {
      id: 1,
      name: "My Clans",
      icon: "people-outline",
      iconSet: Ionicons,
      color: "#2196F3",
      type: "clans",
      route: "myclan",
      params: {},
      condition: true,
    },
    {
      id: 3,
      name: "Dues",
      icon: "superpowers",
      iconSet: FontAwesome5,
      color: "#009688",
      type: "amenities",
      route: "Due",
      params: {},
      condition: isApproved,
    },
    {
      id: 6,
      name: "Artisan",
      icon: "room-service",
      iconSet: MaterialIcons,
      color: "#FF9800",
      type: "service",
      route: "service",
      params: {},
      condition: true,
    },
    {
      id: 7,
      name: "Marketplace",
      icon: "store",
      iconSet: MaterialIcons,
      color: "#00BCD4",
      type: "marketplace",
      route: "Marketplace",
      params: {},
      condition: true,
    },
    {
      id: 11,
      name: "Access card",
      icon: "card",
      iconSet: Ionicons,
      color: "#2196F3",
      type: "clans",
      route: "UserCard",
      params: {},
      condition: isApproved,
    },
    {
      id: 2,
      name: "Amenities",
      icon: "apartment",
      iconSet: MaterialIcons,
      color: "#009688",
      type: "amenities",
      route: "amentities",
      params: {},
      condition: isApproved,
    },
    {
      id: 4,
      name: "Emergency",
      icon: "emergency",
      iconSet: MaterialIcons,
      color: "#F44336",
      type: "emergency",
      route: "Emergencyscreen",
      params: {},
      condition: isApproved,
    },
    {
      id: 5,
      name: "Polls/Surveys",
      icon: "poll",
      iconSet: MaterialIcons,
      color: "#9C27B0",
      type: "polls",
      route: "userpolls",
      params: {},
      condition: isApproved,
    },
    {
      id: 8,
      name: "ICE Contacts",
      icon: "contact-phone",
      iconSet: MaterialIcons,
      color: "#E91E63",
      type: "ice",
      route: "icecontact",
      params: {},
      condition: true,
    },
    {
      id: 9,
      name: "Domestic Staff",
      icon: "people",
      iconSet: MaterialIcons,
      color: "#3F51B5",
      type: "domestic",
      route: "domestic",
      params: {},
      condition: isApproved,
    },
  ];

  const visibleQuickLinks = quickLinks.filter((link) => link.condition);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchWallet();
      await refetchEmergencies();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleReloadWallet = async () => {
    try {
      const { data } = await refetchWallet();
      if (data) {
        Alert.alert("Success", "Wallet balance updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to refresh wallet. Please try again.");
    }
  };

  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>

          {/* ── Active emergency banner ─────────────────────────────────── */}
          {activeEmergencies.length > 0 && (
            <TouchableOpacity
              style={styles.emergencyBanner}
              onPress={() => setEmergencyModalVisible(true)}
              activeOpacity={0.85}
            >
              <View style={styles.emergencyBannerPulse}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color="#FFFFFF"
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.emergencyBannerTitle}>
                  🚨 Active Emergency Alert
                </Text>
                <Text style={styles.emergencyBannerSub}>
                  {activeEmergencies.length} active emergency in your estate. Tap to view.
                </Text>
              </View>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          )}

          {/* ================================
              WALLET BALANCE CARD
          ================================ */}
          <View
            style={{
              backgroundColor: "#10B981",
              borderRadius: 20,
              padding: 24,
              shadowColor: "#10B981",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8,
              overflow: "hidden",
            }}
          >
            {/* Decorative circles */}
            <View
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: -20,
                left: -20,
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name="wallet"
                  size={20}
                  color="rgba(255, 255, 255, 0.9)"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: 13,
                    fontWeight: "500",
                    letterSpacing: 0.5,
                  }}
                >
                  Available Balance
                </Text>
                <TouchableOpacity
                  onPress={handleReloadWallet}
                  disabled={isLoading}
                  style={{
                    marginLeft: 12,
                    padding: 6,
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    borderRadius: 8,
                  }}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <MaterialCommunityIcons
                      name="refresh"
                      size={16}
                      color="rgba(255, 255, 255, 0.9)"
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 32,
                fontWeight: "800",
                letterSpacing: 0.5,
                marginBottom: 4,
              }}
            >
              ₦{mainBalance?.toLocaleString() || "0.00"}
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  marginRight: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("FundWallet")}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}
                >
                  Fund Wallet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  flex: 1,
                  marginLeft: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderRadius: 12,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
                onPress={() => navigation.navigate("transactionHistory")}
              >
                <Text
                  style={{ color: "#FFFFFF", fontWeight: "700", fontSize: 14 }}
                >
                  History
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================
              VIRTUAL ACCOUNT CARD
          ================================ */}
          <SafeHavenCard />

          {/* ================================
              BILLS PAYMENT SECTION
          ================================ */}
          <View
            style={{
              marginTop: 24,
              marginBottom: 20,
              backgroundColor: "#FFFFFF",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="flash"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#1F2937",
                  letterSpacing: 0.3,
                }}
              >
                Bills Payment
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {/* Electricity */}
              <TouchableOpacity
                style={{ width: "30%", alignItems: "center", marginBottom: 16 }}
                onPress={() =>
                  navigation.navigate("UtilityPayment", { billType: "electricty" })
                }
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#FEF3C7",
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Icon name="electric-bolt" size={28} color="#F59E0B" />
                </View>
                <Text
                  style={{ fontSize: 12, color: "#374151", textAlign: "center", fontWeight: "500" }}
                >
                  Electricity
                </Text>
              </TouchableOpacity>

              {/* Airtime */}
              <TouchableOpacity
                style={{ width: "30%", alignItems: "center", marginBottom: 16 }}
                onPress={() =>
                  navigation.navigate("Airtime", {
                    data: {
                      _id: "61efaba1da92348f9dde5f6c",
                      name: "Mobile Recharge",
                      identifier: "AIRTIME",
                      description: "Airtime Recharge",
                      createdAt: "2022-01-25T07:49:53.181Z",
                      updatedAt: "2022-01-25T07:49:53.181Z",
                      __v: 0,
                    },
                  })
                }
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#E0E7FF",
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons name="call" size={24} color="black" />
                </View>
                <Text
                  style={{ fontSize: 12, color: "#374151", textAlign: "center", fontWeight: "500" }}
                >
                  Airtime
                </Text>
              </TouchableOpacity>

              {/* Data */}
              <TouchableOpacity
                style={{ width: "30%", alignItems: "center", marginBottom: 16 }}
                onPress={() =>
                  navigation.navigate("DataPurchase", {
                    data: {
                      _id: "61efabb2da92348f9dde5f6e",
                      name: "DATA PURCHASE",
                      identifier: "DATA",
                      description: "Data bundle subscription",
                      __v: 0,
                    },
                  })
                }
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    backgroundColor: "#E0E7FF",
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons
                    name="signal-wifi-statusbar-connected-no-internet-4"
                    size={24}
                    color="black"
                  />
                </View>
                <Text
                  style={{ fontSize: 12, color: "#374151", textAlign: "center", fontWeight: "500" }}
                >
                  Data
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ================================
              QUICK LINKS SECTION
          ================================ */}
          <View
            style={{
              marginTop: 20,
              marginBottom: 20,
              backgroundColor: "#FFFFFF",
              padding: 16,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <MaterialCommunityIcons
                name="link-variant"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#1F2937",
                  letterSpacing: 0.3,
                }}
              >
                Quick Links
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {visibleQuickLinks.map((link) => {
                const IconComponent = link.iconSet;
                return (
                  <TouchableOpacity
                    key={link.id}
                    style={{
                      width: "25%",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                    onPress={() => navigation.navigate(link.route, link.params)}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        backgroundColor: `${link.color}15`,
                        borderRadius: 16,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <IconComponent
                        name={link.icon}
                        size={24}
                        color={link.color}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#374151",
                        textAlign: "center",
                        fontWeight: "500",
                        lineHeight: 14,
                      }}
                    >
                      {link.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ── Emergency Alert Modal ──────────────────────────────────────────── */}
      <Modal
        visible={emergencyModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setEmergencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Icon */}
            <View
              style={[
                styles.modalIconWrap,
                { backgroundColor: emergencyConfig?.bg || "#FEE2E2" },
              ]}
            >
              <MaterialCommunityIcons
                name={emergencyConfig?.icon || "alert-circle"}
                size={40}
                color={emergencyConfig?.color || "#EF4444"}
              />
            </View>

            <Text style={styles.modalTitle}>🚨 Emergency Alert</Text>
            <Text style={styles.modalSubtitle}>
              There is an active emergency in your estate
            </Text>

            {/* Details */}
            {latestEmergency && (
              <View style={styles.detailCard}>
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text style={styles.detailLabel}>Type</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      { color: emergencyConfig?.color, fontWeight: "700" },
                    ]}
                  >
                    {emergencyConfig?.label || latestEmergency.type}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name="map-marker-outline"
                    size={16}
                    color="#6B7280"
                  />
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue} numberOfLines={2}>
                    {latestEmergency.address}
                  </Text>
                </View>

                {latestEmergency.additionalInfo ? (
                  <View style={[styles.detailRow, { alignItems: "flex-start" }]}>
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={16}
                      color="#6B7280"
                    />
                    <Text style={styles.detailLabel}>Details</Text>
                    <Text style={styles.detailValue} numberOfLines={3}>
                      {latestEmergency.additionalInfo}
                    </Text>
                  </View>
                ) : null}

                {activeEmergencies.length > 1 && (
                  <Text style={styles.moreEmergencies}>
                    +{activeEmergencies.length - 1} more active{" "}
                    {activeEmergencies.length - 1 === 1 ? "emergency" : "emergencies"}
                  </Text>
                )}
              </View>
            )}

            {/* Safety tip */}
            <View style={styles.safetyTip}>
              <MaterialCommunityIcons
                name="shield-check-outline"
                size={16}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.safetyTipText}>
                Stay calm, stay safe, and follow estate security instructions.
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={styles.dismissBtn}
              onPress={() => setEmergencyModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.dismissBtnText}>I Understand  Stay Safe</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => {
                setEmergencyModalVisible(false);
                navigation.navigate("Emergencyscreen");
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.viewBtnText}>View Emergency Screen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },

  // ── Emergency banner ──
  emergencyBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  emergencyBannerPulse: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  emergencyBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  emergencyBannerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
    marginTop: 2,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 6,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  detailCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    width: 60,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  moreEmergencies: {
    fontSize: 12,
    fontWeight: "600",
    color: "#EF4444",
    textAlign: "center",
    marginTop: 4,
  },
  safetyTip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 12,
    width: "100%",
    marginBottom: 20,
  },
  safetyTipText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#065F46",
    lineHeight: 18,
  },
  dismissBtn: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  dismissBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  viewBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  viewBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
});

export default WalletScreen;