// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ScrollView,
//   Linking,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import AppScreen from "../../../components/shared/AppScreen";
// import EmergencyModal, {
//   EmergencyModalTwo,
// } from "../../../components/Emergency/Modal";
// import {
//   MediumFontText,
//   RegularFontText,
// } from "../../../components/shared/Paragrahp";
// import DarkModeToggle from "../../../components/Account/DarkModeToggle";
// import General from "../../../components/Account/General";
// import { DeleteAccountModal } from "../../../components/Account/Modal";
// import { DeleteLAccount, Logout } from "../../../components/Account/Logout";

// import { useNavigation } from "@react-navigation/native";
// import { NativeStackNavigationProp } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../../navigation/AppNavigation";

// import { useDispatch, useSelector } from "react-redux";
// import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";

// // TypeScript Types
// interface UserProfileData {
//   photo?: string;
//   user?: {
//     name?: string;
//   };
//   phoneNumber?: string;
// }

// type GeneralData = {
//   id: number;
//   icon: string;
//   label: string;
//   icon_type: string;
//   link: string;
// };

// interface Announcement {
//   id: string;
//   title: string;
//   content: string;
//   date: string;
//   link?: string;
// }

// interface Advertisement {
//   id: string;
//   imageUrl: string;
//   linkUrl: string;
//   altText: string;
// }

// // Sample Data
// const sampleAnnouncements: Announcement[] = [
//   {
//     id: "1",
//     title: "Community Guidelines Refreshed",
//     content:
//       "We've updated our community guidelines to foster a more positive and respectful environment for everyone.",
//     date: "2025-01-01",
//     link: "https://yourplatform.com/guidelines",
//   },
//   {
//     id: "2",
//     title: "Scheduled Maintenance",
//     content:
//       "Heads up! We have scheduled system maintenance on June 15th from 2 AM to 4 AM UTC. Expect minor interruptions during this time.",
//     date: "2025-06-08",
//   },
//   {
//     id: "3",
//     title: "Platform Update: Enhanced Security",
//     content:
//       "We've implemented stronger encryption protocols to ensure your data is even safer. Read more about our commitment to security.",
//     date: "2025-06-05",
//     link: "https://yourplatform.com/security-updates",
//   },
// ];

// const sampleAdvertisements: Advertisement[] = [
//   {
//     id: "ad1",
//     imageUrl:
//       "https://placehold.co/300x100/FF5733/FFFFFF?text=Estate+Services+Ad",
//     linkUrl: "https://www.example.com/ad1",
//     altText: "Advertisement for Estate Services",
//   },
//   {
//     id: "ad2",
//     imageUrl:
//       "https://placehold.co/300x100/33FF57/000000?text=Local+Business+Ad",
//     linkUrl: "https://www.example.com/ad2",
//     altText: "Advertisement for Local Business",
//   },
//   {
//     id: "ad3",
//     imageUrl:
//       "https://placehold.co/300x100/3357FF/FFFFFF?text=Property+Management",
//     linkUrl: "https://www.example.com/ad3",
//     altText: "Advertisement for Property Management",
//   },
// ];

// const data: GeneralData[] = [
//   {
//     id: 1,
//     icon: "user",
//     label: "Personal Info",
//     icon_type: "AntDesign",
//     link: "PersonalInfo",
//   },
//   {
//     id: 2,
//     icon: "user",
//     label: "Edit Personal Info",
//     icon_type: "AntDesign",
//     link: "editPersonalInfo",
//   },

//   {
//     id: 3,
//     icon: "history",
//     label: "Transaction History",
//     icon_type: "AntDesign",
//     link: "transactionHistory",
//   },
// ];

// let new_item: GeneralData = {
//   id: 4,
//   icon: "logout-outline",
//   label: "Logout",
//   icon_type: "Ionicons",
//   link: "Logout",
// };

// const Account: React.FC = () => {
//   const navigation =
//     useNavigation<NativeStackNavigationProp<RootStackParamList>>();

//   const { userProfile_data } = useSelector((state: any) => state?.ProfileSlice);

//   const [modalVisible, setModalVisible] = useState<boolean>(false);
//   const [modalformVisible, setModalFormVisible] = useState<boolean>(false);

//   const openModal = (): void => {
//     setModalVisible(true);
//   };

//   const closeFormModal = (): void => {
//     setModalFormVisible(false);
//   };

//   const closeModal = (): void => {
//     setModalVisible(false);
//   };

//   const handleDarkModeToggle = (isDarkMode: boolean): void => {
//     console.log(`Dark Mode is ${isDarkMode ? "enabled" : "disabled"}`);
//   };

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(UserProfile_data_Fun());
//     return () => {};
//   }, [dispatch]);

//   // Function to handle opening announcement links
//   const handleAnnouncementPress = async (link?: string): Promise<void> => {
//     if (link) {
//       try {
//         const supported = await Linking.canOpenURL(link);
//         if (supported) {
//           await Linking.openURL(link);
//         } else {
//           Alert.alert(
//             "Cannot Open Link",
//             `Could not open the link: ${link}. It might not be a valid URL.`,
//           );
//         }
//       } catch (error) {
//         console.error("Failed to open link:", error);
//         Alert.alert(
//           "Error",
//           "An unexpected error occurred while trying to open the link.",
//         );
//       }
//     } else {
//       Alert.alert(
//         "No Link",
//         "No specific link provided for this announcement.",
//       );
//     }
//   };

//   // Function to handle opening advertisement links
//   const handleAdvertPress = async (link: string): Promise<void> => {
//     if (!link) {
//       Alert.alert("No Advert Link", "This advertisement does not have a link.");
//       return;
//     }
//     try {
//       const supported = await Linking.canOpenURL(link);
//       if (supported) {
//         await Linking.openURL(link);
//       } else {
//         Alert.alert(
//           "Cannot Open Advertisement",
//           `Could not open the ad link: ${link}. It might not be a valid URL.`,
//         );
//       }
//     } catch (error) {
//       console.error("Failed to open ad link:", error);
//       Alert.alert(
//         "Error",
//         "An unexpected error occurred while trying to open the ad.",
//       );
//     }
//   };

//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.container}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Header */}
//           <View style={styles.header}>
//             <Text style={styles.headerTitle}>Account</Text>
//           </View>

//           {/* Profile Card */}
//           <TouchableOpacity
//             style={styles.profileCard}
//             onPress={() => navigation.navigate("PersonalInfo")}
//             activeOpacity={0.7}
//           >
//             <View style={styles.profileContent}>
//               <View style={styles.profileImageContainer}>
//                 <Image
//                   source={{
//                     uri:
//                       (userProfile_data as UserProfileData)?.photo ||
//                       "https://placehold.co/68x68/CCCCCC/000000?text=User",
//                   }}
//                   style={styles.profileImage}
//                 />
//                 <View style={styles.profileBadge}>
//                   <MaterialCommunityIcons
//                     name="check"
//                     size={12}
//                     color="#FFFFFF"
//                   />
//                 </View>
//               </View>

//               <View style={styles.profileInfo}>
//                 <Text style={styles.profileName}>
//                   {(userProfile_data as UserProfileData)?.user?.name ||
//                     "User Name"}
//                 </Text>
//                 <Text style={styles.profilePhone}>
//                   {(userProfile_data as UserProfileData)?.phoneNumber || "N/A"}
//                 </Text>
//                 <View style={styles.viewProfileButton}>
//                   <Text style={styles.viewProfileText}>View Profile</Text>
//                   <MaterialCommunityIcons
//                     name="chevron-right"
//                     size={16}
//                     color="#10B981"
//                   />
//                 </View>
//               </View>
//             </View>
//           </TouchableOpacity>

//           <View
//             style={{
//               borderTopWidth: 1,
//               borderTopColor: "#F3F4F6",
//               paddingTop: 16,
//               flexDirection: "row",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <Logout item={new_item} />
//             <Text
//               style={{
//                 fontSize: 20,
//                 fontWeight: "500",
//               }}
//             >
//               Logout
//             </Text>
//           </View>
//           {/* General Options Card */}
//           <View style={styles.sectionCard}>
//             <View style={styles.sectionHeader}>
//               <MaterialCommunityIcons
//                 name="cog"
//                 size={20}
//                 color="#10B981"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.sectionTitle}>General</Text>
//             </View>

//             <View style={styles.generalOptionsContainer}>
//               {data?.map((item: GeneralData, index: number) => (
//                 <View key={item?.id}>
//                   <General item={item} />
//                   {index < data.length - 1 && (
//                     <View style={styles.optionDivider} />
//                   )}
//                 </View>
//               ))}
//             </View>
//           </View>

//           {/* Announcements Card */}
//           {sampleAnnouncements.length > 0 && (
//             <View style={styles.sectionCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="bullhorn"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>Announcements</Text>
//               </View>

//               {sampleAnnouncements.map((announcement, index) => (
//                 <TouchableOpacity
//                   key={announcement.id}
//                   style={[
//                     styles.announcementItem,
//                     index < sampleAnnouncements.length - 1 && {
//                       marginBottom: 12,
//                     },
//                   ]}
//                   onPress={() => handleAnnouncementPress(announcement.link)}
//                   activeOpacity={0.7}
//                 >
//                   <View style={styles.announcementHeader}>
//                     <View style={styles.announcementIconContainer}>
//                       <MaterialCommunityIcons
//                         name="information"
//                         size={16}
//                         color="#3B82F6"
//                       />
//                     </View>
//                     <View style={{ flex: 1 }}>
//                       <Text style={styles.announcementTitle}>
//                         {announcement.title}
//                       </Text>
//                       <Text style={styles.announcementDate}>
//                         {announcement.date}
//                       </Text>
//                     </View>
//                     {announcement.link && (
//                       <MaterialCommunityIcons
//                         name="open-in-new"
//                         size={18}
//                         color="#6B7280"
//                       />
//                     )}
//                   </View>
//                   <Text style={styles.announcementContent} numberOfLines={2}>
//                     {announcement.content}
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}

//           {/* Advertisements Card */}
//           {sampleAdvertisements.length > 0 && (
//             <View style={styles.sectionCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="advertisements"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>Featured</Text>
//               </View>

//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator={false}
//                 contentContainerStyle={styles.advertScrollContent}
//               >
//                 {sampleAdvertisements.map((ad, index) => (
//                   <TouchableOpacity
//                     key={ad.id}
//                     style={[
//                       styles.advertItem,
//                       index < sampleAdvertisements.length - 1 && {
//                         marginRight: 12,
//                       },
//                     ]}
//                     onPress={() => handleAdvertPress(ad.linkUrl)}
//                     activeOpacity={0.8}
//                   >
//                     <Image
//                       source={{ uri: ad.imageUrl }}
//                       style={styles.advertImage}
//                     />
//                     <View style={styles.advertOverlay}>
//                       <MaterialCommunityIcons
//                         name="open-in-new"
//                         size={20}
//                         color="#FFFFFF"
//                       />
//                     </View>
//                   </TouchableOpacity>
//                 ))}
//               </ScrollView>
//             </View>
//           )}

//           {/* Delete Account Section */}
//           <View style={styles.dangerZoneCard}>
//             <View style={styles.sectionHeader}>
//               <MaterialCommunityIcons
//                 name="alert-circle"
//                 size={20}
//                 color="#DC2626"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={[styles.sectionTitle, { color: "#DC2626" }]}>
//                 Danger Zone
//               </Text>
//             </View>
//             <DeleteLAccount item={new_item} />
//           </View>
//         </ScrollView>

//         {/* Emergency Modal */}
//         <EmergencyModalTwo
//           visible={modalformVisible}
//           onClose={closeFormModal}
//         />
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default Account;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 40,
//   },
//   header: {
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "800",
//     color: "#111827",
//     textAlign: "center",
//     letterSpacing: 0.3,
//   },
//   profileCard: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 16,
//     marginTop: 20,
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   profileContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   profileImageContainer: {
//     position: "relative",
//     marginRight: 16,
//   },
//   profileImage: {
//     width: 72,
//     height: 72,
//     borderRadius: 36,
//     borderWidth: 3,
//     borderColor: "#10B981",
//   },
//   profileBadge: {
//     position: "absolute",
//     bottom: 2,
//     right: 2,
//     width: 22,
//     height: 22,
//     borderRadius: 11,
//     backgroundColor: "#10B981",
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 2,
//     borderColor: "#FFFFFF",
//   },
//   profileInfo: {
//     flex: 1,
//   },
//   profileName: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 4,
//     letterSpacing: 0.3,
//   },
//   profilePhone: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginBottom: 8,
//   },
//   viewProfileButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#D1FAE5",
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 12,
//   },
//   viewProfileText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#10B981",
//     marginRight: 4,
//     letterSpacing: 0.3,
//   },
//   logoutButtonContainer: {
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//     paddingTop: 16,
//   },
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },
//   generalOptionsContainer: {
//     gap: 0,
//   },
//   optionDivider: {
//     height: 1,
//     backgroundColor: "#F3F4F6",
//     marginVertical: 12,
//   },
//   announcementItem: {
//     backgroundColor: "#F9FAFB",
//     padding: 12,
//     borderRadius: 12,
//     borderLeftWidth: 3,
//     borderLeftColor: "#3B82F6",
//   },
//   announcementHeader: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 8,
//   },
//   announcementIconContainer: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: "#DBEAFE",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   announcementTitle: {
//     fontSize: 14,
//     fontWeight: "700",
//     color: "#111827",
//     marginBottom: 2,
//     letterSpacing: 0.3,
//   },
//   announcementDate: {
//     fontSize: 11,
//     fontWeight: "500",
//     color: "#9CA3AF",
//   },
//   announcementContent: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6B7280",
//     lineHeight: 18,
//     marginLeft: 38,
//   },
//   advertScrollContent: {
//     paddingRight: 16,
//   },
//   advertItem: {
//     width: 280,
//     height: 140,
//     borderRadius: 16,
//     overflow: "hidden",
//     backgroundColor: "#F3F4F6",
//     position: "relative",
//   },
//   advertImage: {
//     width: "100%",
//     height: "100%",
//     resizeMode: "cover",
//   },
//   advertOverlay: {
//     position: "absolute",
//     top: 12,
//     right: 12,
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "rgba(0, 0, 0, 0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dangerZoneCard: {
//     backgroundColor: "#FFFFFF",
//     marginHorizontal: 16,
//     marginTop: 16,
//     borderRadius: 16,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: "#FEE2E2",
//     shadowColor: "#DC2626",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 3,
//   },
// });

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import ScreenWrapper from "../shared/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const ErrandsScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenWrapper
      title="Errand"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
      showHeader={false}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="rocket-launch-outline"
          size={72}
          color="#10B981"
        />
        <Text style={styles.title}>Coming Soon</Text>
        <Text style={styles.subtitle}>
          We're working on something exciting.{"\n"}Errands will be available
          shortly!
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
    fontWeight: "500",
  },
});

export default ErrandsScreen;
