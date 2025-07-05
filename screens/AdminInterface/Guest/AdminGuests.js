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
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { Get_All_User_Guest_Fun } from "../../../Redux/UserSide/GuestSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import { Admin_Get_All_User_Guest_Fun } from "../../../Redux/Admin/AdminGuestSlice";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import TheScan from "../TheScan";

const AdminGuests = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { Admin_get_all_user_guest_data } = useSelector(
    (state) => state?.AdminGuestSlice
  );
  const [modalVisible, setModalVisible] = useState(false);

  console.log({
    ww: Admin_get_all_user_guest_data?.clanInvites,
  });
  useEffect(() => {
    dispatch(Admin_Get_All_User_Guest_Fun());

    dispatch(UserProfile_data_Fun());

    return () => {};
  }, [dispatch]);

  const filteredData = Admin_get_all_user_guest_data?.clanInvites?.filter(
    (item) =>
      item.access_code?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Admin_Get_All_User_Guest_Fun());

    dispatch(UserProfile_data_Fun());
    // Wait for 2 seconds
    setRefreshing(false);
  };

  const HistoryItem = ({ itemdata }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          borderWidth: 1,
          borderColor: "#CFCDCD",
          marginBottom: 10,
          paddingVertical: 10,
          borderRadius: 9,
        }}
        onPress={() => {
          navigation.navigate("AdminGuestsDetail", { itemdata });
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 18,
              fontFamily: "RobotoSlab-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.access_code}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "RobotoSlab-Medium",
              fontWeight: "500",
            }}
          >
            Code ID
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.visitor_name}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "RobotoSlab-Medium",
              fontWeight: "500",
            }}
          >
            Visitor Name
          </Text>
        </View>

        <View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {formatDateandTime(itemdata?.expires)}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "RobotoSlab-Medium",
              fontWeight: "500",
            }}
          >
            Departure Time
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.phone_number}
          </Text>

          <Text
            style={{
              fontSize: 11,
              fontFamily: "RobotoSlab-Medium",
              fontWeight: "500",
            }}
          >
            Phone Number
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <AppScreen>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
              width: "80%",
            }}
            placeholder="Search by Visitor Name"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />

          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
            }}
          >
            <Image
              source={require("../../../assets/qrcode.png")}
              style={{
                width: 25,
                height: 25,
                // tintColor: currentTab == title ? "#5359D1" : "black",
              }}
            />
          </TouchableOpacity>
        </View>

        {filteredData?.length === 0 ? (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: 200,
                height: 200,
                // backgroundColor: "#eee",
              }}
              // Find more Lottie files at https://lottiefiles.com/featured
              source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
            />
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={({ item }) => <HistoryItem itemdata={item} />}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}
      </View>

      <CenterReuseModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            width: "90%",
            height: "80%",
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "RobotoSlab-Medium",
              color: "black",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Qrcode
          </Text>

          <TheScan />
        </View>
      </CenterReuseModals>
    </AppScreen>
  );
};

export default AdminGuests;

const styles = StyleSheet.create({});
