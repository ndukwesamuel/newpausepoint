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
import {
  Get_All_Domestic_Fun,
  Get_All_User_Guest_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import {
  formatDate,
  formatDateString,
  formatDateandTime,
} from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";

const DomesticStaff = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { get_all_user_guest_data, get_all_domestic_data } = useSelector(
    (state) => state?.GuestSlice
  );
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    dispatch(Get_All_Domestic_Fun());

    return () => {};
  }, [dispatch]);

  const filteredData = get_all_domestic_data?.domesticStaff?.filter((item) =>
    item.staffName?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_All_Domestic_Fun());
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
  //
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("domesticDetail", { itemdata: item });
      }}
    >
      <Text style={styles.staffName}>{item.staffName}</Text>
      <Text style={styles.staffDetails}>
        Role: {item.Role} | Gender: {item.gender}
      </Text>

      <Text style={styles.staffDetails}>
        Phone: {item.phone} | Working Hours: {item.workingHours}
      </Text>
      <Text style={styles.staffDetails}>
        DOB: {formatDate(item.dateOfBirth)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingVertical: 10,
      }}
    >
      {get_user_profile_data?.currentClanMeeting ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search by staff name"
            value={searchQuery}
            onChangeText={setSearchQuery}
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

              onPress={() => navigation.navigate("creatdomestic")}
            >
              <MaterialIcons name="mode-edit" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {}

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
            <>
              <FlatList
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={(item) => item._id}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                ListEmptyComponent={() => (
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
                )}
              />
            </>
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
    </View>
  );
};

export default DomesticStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  staffDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
