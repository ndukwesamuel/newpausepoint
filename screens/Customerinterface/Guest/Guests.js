// import AppScreen from "../../../components/shared/AppScreen";
// import {
//   View,
//   Text,
//   Button,
//   Platform,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   ScrollView,
//   Image,
//   FlatList,
//   StyleSheet,
//   TextInput,
//   RefreshControl,
// } from "react-native";
// import React, { useEffect, useRef, useState } from "react";
// import LottieView from "lottie-react-native";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import * as ImagePicker from "expo-image-picker";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Ionicons, AntDesign } from "@expo/vector-icons";

// import DateTimePicker from "@react-native-community/datetimepicker";

// import { useDispatch, useSelector } from "react-redux";

// import {
//   NavigationContainer,
//   NavigationProp,
//   useNavigation,
// } from "@react-navigation/native";
// import { Get_All_User_Guest_Fun } from "../../../Redux/UserSide/GuestSlice";
// import { formatDateandTime } from "../../../utils/DateTime";
// import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
// import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";

// const Guests = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const animation = useRef(null);
//   const [searchQuery, setSearchQuery] = useState("");
//   const { get_all_user_guest_data } = useSelector((state) => state?.GuestSlice);
//   const { get_user_profile_data } = useSelector(
//     (state) => state?.UserProfileSlice
//   );
//   console.log({
//     ss: get_user_profile_data?.currentClanMeeting,
//   });

//   useEffect(() => {
//     return () => {};
//   }, [dispatch]);

//   const filteredData = get_all_user_guest_data?.userInvites?.filter((item) =>
//     item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase())
//   );
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     // Set the refreshing state to true
//     setRefreshing(true);
//     dispatch(Get_All_User_Guest_Fun());
//     dispatch(UserProfile_data_Fun());

//     // Wait for 2 seconds
//     setRefreshing(false);
//   };

//   const HistoryItem = ({ itemdata }) => {
//     return (
//       <TouchableOpacity
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-around",
//           borderWidth: 1,
//           borderColor: "#CFCDCD",
//           marginBottom: 10,
//           paddingVertical: 10,
//           borderRadius: 9,
//         }}
//         onPress={() => {
//           navigation.navigate("guestsdetail", { itemdata });
//         }}
//       >
//         <View>
//           <Text
//             style={{
//               fontSize: 18,
//               fontFamily: "RobotoSlab-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {itemdata?.access_code}
//           </Text>

//           <Text
//             style={{
//               fontSize: 11,
//               fontFamily: "RobotoSlab-Medium",
//               fontWeight: "500",
//             }}
//           >
//             Code ID
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {itemdata?.visitor_name}
//           </Text>

//           <Text
//             style={{
//               fontSize: 11,
//               fontFamily: "RobotoSlab-Medium",
//               fontWeight: "500",
//             }}
//           >
//             Visitor Name
//           </Text>
//         </View>

//         <View>
//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {formatDateandTime(itemdata?.expires)}
//           </Text>

//           <Text
//             style={{
//               fontSize: 11,
//               fontFamily: "RobotoSlab-Medium",
//               fontWeight: "500",
//             }}
//           >
//             Departure Time
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {itemdata?.phone_number}
//           </Text>

//           <Text
//             style={{
//               fontSize: 11,
//               fontFamily: "RobotoSlab-Medium",
//               fontWeight: "500",
//             }}
//           >
//             Phone Number
//           </Text>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <AppScreen>
//       {get_user_profile_data?.currentClanMeeting ? (
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             paddingHorizontal: 20,
//           }}
//         >
//           <TextInput
//             style={{
//               height: 40,
//               borderColor: "gray",
//               borderWidth: 1,
//               marginBottom: 10,
//               paddingLeft: 10,
//             }}
//             placeholder="Search by Visitor Name"
//             value={searchQuery}
//             onChangeText={(text) => setSearchQuery(text)}
//           />

//           <View
//             style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}
//           >
//             <TouchableOpacity
//               style={{
//                 backgroundColor: "green",
//                 // paddingHorizontal: 20,
//                 // paddingVertical: 10,
//                 borderRadius: 50,
//                 width: 50,
//                 height: 50,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//               // navigation.navigate("guestsdetail", { itemdata });

//               onPress={() => navigation.navigate("inviteguest")}
//             >
//               <MaterialIcons name="mode-edit" size={24} color="black" />
//             </TouchableOpacity>
//           </View>

//           {filteredData?.length === 0 ? (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <LottieView
//                 autoPlay
//                 ref={animation}
//                 style={{
//                   width: 200,
//                   height: 200,
//                 }}
//                 // Find more Lottie files at https://lottiefiles.com/featured
//                 source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
//               />
//             </View>
//           ) : (
//             <FlatList
//               data={filteredData}
//               showsHorizontalScrollIndicator={false}
//               showsVerticalScrollIndicator={false}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//               renderItem={({ item }) => <HistoryItem itemdata={item} />}
//             />
//           )}
//         </View>
//       ) : (
//         <ScrollView
//           contentContainerStyle={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }
//         >
//           <ClickToJoinCLan />
//           <Text style={{ fontSize: 18 }}>
//             Join a clan to see a guest list and invite guests.
//           </Text>
//         </ScrollView>
//       )}
//     </AppScreen>
//   );
// };

// export default Guests;

// const styles = StyleSheet.create({});

import AppScreen from "../../../components/shared/AppScreen";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Get_All_User_Guest_Fun } from "../../../Redux/UserSide/GuestSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";

const Guests = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { get_all_user_guest_data } = useSelector((state) => state?.GuestSlice);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  const filteredData = get_all_user_guest_data?.userInvites?.filter((item) =>
    item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(Get_All_User_Guest_Fun());
    dispatch(UserProfile_data_Fun());
    setRefreshing(false);
  };

  const HistoryItem = ({ itemdata }) => {
    return (
      <TouchableOpacity
        style={styles.guestCard}
        onPress={() => {
          navigation.navigate("guestsdetail", { itemdata });
        }}
      >
        {/* Guest Icon */}
        <View style={styles.guestIconContainer}>
          <MaterialCommunityIcons name="account" size={32} color="#3B82F6" />
        </View>

        {/* Guest Details */}
        <View style={styles.guestDetailsContainer}>
          {/* Top Row - Code and Name */}
          <View style={styles.guestTopRow}>
            <View style={styles.guestInfoBlock}>
              <Text style={styles.guestPrimaryText}>
                {itemdata?.access_code}
              </Text>
              <Text style={styles.guestSecondaryText}>Access Code</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>ACTIVE</Text>
            </View>
          </View>

          {/* Visitor Name */}
          <View style={styles.guestNameRow}>
            <MaterialCommunityIcons
              name="account-circle"
              size={16}
              color="#6B7280"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.guestNameText}>{itemdata?.visitor_name}</Text>
          </View>

          {/* Bottom Row - Phone and Expiry */}
          <View style={styles.guestBottomRow}>
            <View style={styles.guestInfoItem}>
              <MaterialCommunityIcons
                name="phone"
                size={14}
                color="#6B7280"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.guestInfoText}>{itemdata?.phone_number}</Text>
            </View>

            <View style={styles.guestInfoItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#6B7280"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.guestInfoText}>
                {formatDateandTime(itemdata?.expires)}
              </Text>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#D1D5DB"
        />
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      {get_user_profile_data?.currentClanMeeting ? (
        <View style={styles.scrollView}>
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerCard}>
              <View style={styles.headerContent}>
                <View style={styles.headerTitleRow}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={24}
                    color="#10B981"
                    style={{ marginRight: 12 }}
                  />
                  <View>
                    <Text style={styles.headerTitle}>Guest Management</Text>
                    <Text style={styles.headerSubtitle}>
                      {filteredData?.length || 0} active guests
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Search Section */}
            <View style={styles.searchCard}>
              <View style={styles.searchInputContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by visitor name..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                />
                {searchQuery !== "" && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Guest List Section */}
            <View style={styles.guestListCard}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>Guest List</Text>
              </View>

              {filteredData?.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={styles.emptyStateAnimation}
                    source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                  />
                  <Text style={styles.emptyStateTitle}>No guests found</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Invite guests to get started"}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredData}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  // scrollEnabled={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#10B981"
                    />
                  }
                  renderItem={({ item }) => <HistoryItem itemdata={item} />}
                  keyExtractor={(item, index) => index.toString()}
                />
              )}
            </View>
          </View>

          {/* Floating Action Button */}

          <View
            style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}
          >
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate("inviteguest")}
            >
              <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.noAccessContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
            />
          }
        >
          <View style={styles.noAccessCard}>
            <View style={styles.noAccessIconContainer}>
              <MaterialCommunityIcons
                name="account-group-outline"
                size={64}
                color="#10B981"
              />
            </View>
            <ClickToJoinCLan />
            <Text style={styles.noAccessTitle}>Join a Clan to Continue</Text>
            <Text style={styles.noAccessSubtitle}>
              You need to be part of a clan to view and manage guest invitations
            </Text>
          </View>
        </ScrollView>
      )}
    </AppScreen>
  );
};

export default Guests;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for FAB
  },

  // Header Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 4,
  },

  // Search Card
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInputContainer: {
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

  // Guest List Card
  guestListCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Guest Card
  guestCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  guestIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  guestDetailsContainer: {
    flex: 1,
  },
  guestTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  guestInfoBlock: {
    flex: 1,
  },
  guestPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  guestSecondaryText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  guestNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  guestNameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  guestBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guestInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestInfoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Empty State
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateAnimation: {
    width: 160,
    height: 160,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    letterSpacing: 0.3,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  // No Access State
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  noAccessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    maxWidth: 400,
  },
  noAccessIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginTop: 16,
    textAlign: "center",
  },
  noAccessSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },
});
