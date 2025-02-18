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
import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { formatDateandTime } from "../../../utils/DateTime";

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
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_All_Polls_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  useEffect(() => {
    dispatch(Get_All_Polls_Fun());
  }, []);

  const filteredData = get_all_poll_data?.data?.filter((item) =>
    item?.question?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  console.log({
    fff: get_all_poll_data,
  });

  const HistoryItem = ({ itemdata }) => {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          // justifyContent: "space-around",
          paddingHorizontal: 10,
          borderWidth: 1,
          borderColor: "#CFCDCD",
          marginBottom: 10,
          paddingVertical: 10,
          borderRadius: 9,
        }}
        onPress={() => {
          navigation.navigate("estatepollsdetail", { itemdata });
        }}
      >
        <View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "RobotoSlab-Medium",
                fontWeight: "500",
              }}
            >
              Question
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-SemiBold",
                fontWeight: "600",
              }}
            >
              {itemdata?.question}
            </Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 25 }}>
            <Text
              style={{
                fontSize: 11,
                fontFamily: "RobotoSlab-Medium",
                fontWeight: "500",
              }}
            >
              Date
            </Text>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "Inter-SemiBold",
                fontWeight: "600",
              }}
            >
              {formatDateandTime(itemdata?.createdAt)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {get_user_profile_data?.currentClanMeeting?._id ? (
        <>
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

            {filteredData?.length === 0 ? (
              <ScrollView
                // style={{
                //   flex: 1,
                //   justifyContent: "center",
                //   alignItems: "center",
                // }}

                contentContainerStyle={{
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                }}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
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
              </ScrollView>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                data={filteredData}
                renderItem={({ item }) => <HistoryItem itemdata={item} />}
              />
            )}
          </View>
        </>
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
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#D9D9D9",
              padding: 10,
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate("myclan")}
          >
            <Text> Click join a clan </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
};

export default UserPolls;
