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
// import { useMutation } from "react-query";
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
// import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
// import { formatDateandTime } from "../../../utils/DateTime";

// const UserPolls = () => {
//   const [polls, setPolls] = useState([]);
//   const { get_all_poll_data } = useSelector((state) => state?.PollSlice);
//   const { get_user_profile_data } = useSelector(
//     (state) => state?.UserProfileSlice
//   );
//   const [refreshing, setRefreshing] = useState(false);

//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const animation = useRef(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const onRefresh = () => {
//     // Set the refreshing state to true
//     setRefreshing(true);
//     dispatch(Get_All_Polls_Fun());

//     // Wait for 2 seconds
//     setRefreshing(false);
//   };

//   useEffect(() => {
//     dispatch(Get_All_Polls_Fun());
//   }, []);

//   const filteredData = get_all_poll_data?.data?.filter((item) =>
//     item?.question?.toLowerCase().includes(searchQuery?.toLowerCase())
//   );

//   console.log({
//     fff: get_all_poll_data,
//   });

//   const HistoryItem = ({ itemdata }) => {
//     return (
//       <TouchableOpacity
//         style={{
//           flexDirection: "row",
//           // justifyContent: "space-around",
//           paddingHorizontal: 10,
//           borderWidth: 1,
//           borderColor: "#CFCDCD",
//           marginBottom: 10,
//           paddingVertical: 10,
//           borderRadius: 9,
//         }}
//         onPress={() => {
//           navigation.navigate("estatepollsdetail", { itemdata });
//         }}
//       >
//         <View>
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
//             <Text
//               style={{
//                 fontSize: 11,
//                 fontFamily: "RobotoSlab-Medium",
//                 fontWeight: "500",
//               }}
//             >
//               Question
//             </Text>
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: "Inter-SemiBold",
//                 fontWeight: "600",
//               }}
//             >
//               {itemdata?.question}
//             </Text>
//           </View>

//           <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
//             <Text
//               style={{
//                 fontSize: 11,
//                 fontFamily: "RobotoSlab-Medium",
//                 fontWeight: "500",
//               }}
//             >
//               Date
//             </Text>
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontFamily: "Inter-SemiBold",
//                 fontWeight: "600",
//               }}
//             >
//               {formatDateandTime(itemdata?.createdAt)}
//             </Text>
//           </View>
//         </View>
//       </TouchableOpacity>
//     );
//   };

//   return (
//     <View style={{ flex: 1, padding: 20 }}>
//       {get_user_profile_data?.currentClanMeeting?._id ? (
//         <>
//           <View
//             style={{
//               flex: 1,
//               justifyContent: "center",
//               paddingHorizontal: 20,
//             }}
//           >
//             <TextInput
//               style={{
//                 height: 40,
//                 borderColor: "gray",
//                 borderWidth: 1,
//                 marginBottom: 10,
//                 paddingLeft: 10,
//               }}
//               placeholder="Search by Visitor Name"
//               value={searchQuery}
//               onChangeText={(text) => setSearchQuery(text)}
//             />

//             {filteredData?.length === 0 ? (
//               <ScrollView
//                 // style={{
//                 //   flex: 1,
//                 //   justifyContent: "center",
//                 //   alignItems: "center",
//                 // }}

//                 contentContainerStyle={{
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flex: 1,
//                 }}
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                   />
//                 }
//               >
//                 <LottieView
//                   autoPlay
//                   ref={animation}
//                   style={{
//                     width: 200,
//                     height: 200,
//                     // backgroundColor: "#eee",
//                   }}
//                   // Find more Lottie files at https://lottiefiles.com/featured
//                   source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
//                 />
//               </ScrollView>
//             ) : (
//               <FlatList
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={refreshing}
//                     onRefresh={onRefresh}
//                   />
//                 }
//                 data={filteredData}
//                 renderItem={({ item }) => <HistoryItem itemdata={item} />}
//               />
//             )}
//           </View>
//         </>
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
//           <TouchableOpacity
//             style={{
//               borderWidth: 1,
//               borderColor: "#D9D9D9",
//               padding: 10,
//               borderRadius: 6,
//             }}
//             onPress={() => navigation.navigate("myclan")}
//           >
//             <Text> Click join a clan </Text>
//           </TouchableOpacity>
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// export default UserPolls;

import AppScreen from "../../../components/shared/AppScreen";
import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Dimensions,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { formatDateandTime } from "../../../utils/DateTime";

const { width } = Dimensions.get("window");

const UserPolls = () => {
  const [polls, setPolls] = useState([]);
  const { get_all_poll_data } = useSelector((state) => state?.PollSlice);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(Get_All_Polls_Fun());
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(Get_All_Polls_Fun());
  }, []);

  const filteredData = get_all_poll_data?.data?.filter((item) =>
    item?.question?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const HistoryItem = ({ itemdata, index }) => {
    return (
      <TouchableOpacity
        style={[styles.pollCard, { marginTop: index === 0 ? 0 : 16 }]}
        onPress={() => {
          navigation.navigate("estatepollsdetail", { itemdata });
        }}
        activeOpacity={0.7}
      >
        <View style={styles.pollHeader}>
          <View style={styles.pollIcon}>
            <Ionicons name="chatbubble-ellipses" size={20} color="#4A90E2" />
          </View>
          <View style={styles.pollBadge}>
            <Text style={styles.pollBadgeText}>Poll</Text>
          </View>
        </View>

        <View style={styles.pollContent}>
          <Text style={styles.questionLabel}>Question</Text>
          <Text style={styles.questionText} numberOfLines={2}>
            {itemdata?.question}
          </Text>
        </View>

        <View style={styles.pollFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="time-outline" size={14} color="#8E8E93" />
            <Text style={styles.dateText}>
              {formatDateandTime(itemdata?.createdAt)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </View>
      </TouchableOpacity>
    );
  };

  const EmptyState = () => (
    <View style={styles.emptyContainer}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.lottieAnimation}
        source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
      />
      <Text style={styles.emptyTitle}>No Polls Found</Text>
      <Text style={styles.emptySubtitle}>
        {searchQuery
          ? "Try adjusting your search terms"
          : "Pull down to refresh and check for new polls"}
      </Text>
    </View>
  );

  const SearchHeader = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#8E8E93"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search polls by question..."
          placeholderTextColor="#8E8E93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color="#8E8E93" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const JoinClanPrompt = () => (
    <View style={styles.joinClanContainer}>
      <View style={styles.joinClanCard}>
        <View style={styles.joinClanIcon}>
          <Ionicons name="people" size={40} color="#4A90E2" />
        </View>
        <Text style={styles.joinClanTitle}>Join a Clan</Text>
        <Text style={styles.joinClanSubtitle}>
          Connect with your community and participate in polls by joining a clan
          first.
        </Text>
        <TouchableOpacity
          style={styles.joinClanButton}
          onPress={() => navigation.navigate("myclan")}
          activeOpacity={0.8}
        >
          <Text style={styles.joinClanButtonText}>Join Clan</Text>
          <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {get_user_profile_data?.currentClanMeeting?._id ? (
        <>
          <SearchHeader />

          <View style={styles.contentContainer}>
            {filteredData?.length === 0 ? (
              <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#4A90E2"]}
                    tintColor="#4A90E2"
                  />
                }
                showsVerticalScrollIndicator={false}
              >
                <EmptyState />
              </ScrollView>
            ) : (
              <FlatList
                data={filteredData}
                renderItem={({ item, index }) => (
                  <HistoryItem itemdata={item} index={index} />
                )}
                keyExtractor={(item, index) =>
                  item?.id?.toString() || index.toString()
                }
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#4A90E2"]}
                    tintColor="#4A90E2"
                  />
                }
              />
            )}
          </View>
        </>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#4A90E2"]}
              tintColor="#4A90E2"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <JoinClanPrompt />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  searchContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
    fontFamily: "Inter-Regular",
  },
  clearButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  listContainer: {
    padding: 20,
  },
  pollCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  pollHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pollIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  pollBadge: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pollBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: "Inter-Medium",
    fontWeight: "500",
  },
  pollContent: {
    marginBottom: 16,
  },
  questionLabel: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "RobotoSlab-Medium",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  questionText: {
    fontSize: 16,
    color: "#1C1C1E",
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    lineHeight: 22,
  },
  pollFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    color: "#8E8E93",
    fontFamily: "Inter-Regular",
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  lottieAnimation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
  },
  joinClanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  joinClanCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    width: width - 40,
    maxWidth: 320,
  },
  joinClanIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  joinClanTitle: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 12,
  },
  joinClanSubtitle: {
    fontSize: 16,
    fontFamily: "Inter-Regular",
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  joinClanButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
  },
  joinClanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    marginRight: 8,
  },
});

export default UserPolls;
