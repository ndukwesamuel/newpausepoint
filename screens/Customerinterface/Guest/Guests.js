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
  console.log({
    ss: get_user_profile_data?.currentClanMeeting,
  });

  useEffect(() => {
    return () => {};
  }, [dispatch]);

  const filteredData = get_all_user_guest_data?.userInvites?.filter((item) =>
    item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_All_User_Guest_Fun());
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
          navigation.navigate("guestsdetail", { itemdata });
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
      {get_user_profile_data?.currentClanMeeting ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <TextInput
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              marginBottom: 10,
              paddingLeft: 10,
            }}
            placeholder="Search by Visitor Name"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />

          <View
            style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}
          >
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

              onPress={() => navigation.navigate("inviteguest")}
            >
              <MaterialIcons name="mode-edit" size={24} color="black" />
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
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
            </View>
          ) : (
            <FlatList
              data={filteredData}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              renderItem={({ item }) => <HistoryItem itemdata={item} />}
            />
          )}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ClickToJoinCLan />
          <Text style={{ fontSize: 18 }}>
            Join a clan to see a guest list and invite guests.
          </Text>
        </ScrollView>
      )}
    </AppScreen>
  );
};

export default Guests;

const styles = StyleSheet.create({});
