// Import necessary modules from React Native and Expo
import React, { useEffect, useRef, useState } from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";

import {
  Get_User_Clans_Fun,
  Get_all_clan_User_Is_adminIN_Fun,
} from "../../../Redux/UserSide/ClanSlice";
import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import { reset_login } from "../../../Redux/AuthSlice";
import { reset_isOnboarding } from "../../../Redux/DontwantToResetSlice";

// Replace this with the correct API endpoint for fetching user clans
const API_ENDPOINT = "https://your-api-endpoint.com/user-clans";

const UserClans = () => {
  // State to store the list of user clans
  const [userClans, setUserClans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState("Member"); // Initialize with 'Social' as the active button
  const animation = useRef(null);

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClan, setSelectedClan] = useState(null);

  const { get_user_clan_data, get_all_clan_adminIN_data } = useSelector(
    (state) => state?.ClanSlice
  );

  const { user_data } = useSelector((state) => state.AuthSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const Logout_fun = () => {
    dispatch(reset_login());
    dispatch(reset_isOnboarding());
  };
  //   Get_User_Clans_Fun

  // Effect to fetch user clans when the component mounts

  useEffect(() => {
    dispatch(Get_User_Profle_Fun());
    dispatch(Get_User_Clans_Fun());
    dispatch(Get_all_clan_User_Is_adminIN_Fun());

    return () => {};
  }, []);

  const SelectCLan_Mutation = useMutation(
    (data_info) => {
      console.log({
        data_info,
      });
      let url = `${API_BASEURL}clan/select_user_clan/${data_info?.id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      if (data_info?.method == "GET") {
        return axios.get(url, config);
      }

      if (data_info?.method == "DELETE") {
        return axios.delete(url, config);
      }
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Request To Join Estate successfully ",
        });

        dispatch(Get_User_Clans_Fun());
        dispatch(Get_User_Profle_Fun());
        dispatch(Get_all_clan_User_Is_adminIN_Fun());
        Logout_fun();
      },

      onError: (error) => {
        console.log({
          ppp: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message}`,
        });
        dispatch(Get_User_Clans_Fun());
        dispatch(Get_User_Profle_Fun());
        dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const Estate_admin_SelectCLan_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}clan/select_Admin_clan/${data_info?.id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      if (data_info?.method == "GET") {
        return axios.get(url, config);
      }

      if (data_info?.method == "DELETE") {
        return axios.delete(url, config);
      }
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Request To Join Estate successfully ",
        });

        dispatch(Get_User_Clans_Fun());
        dispatch(Get_User_Profle_Fun());
        dispatch(Get_all_clan_User_Is_adminIN_Fun());
        Logout_fun();
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        dispatch(Get_User_Clans_Fun());
        dispatch(Get_User_Profle_Fun());
        dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_User_Clans_Fun());
    dispatch(Get_User_Profle_Fun());

    setRefreshing(false);
  };

  // Render item function for FlatList
  const renderClanItem = ({ item }) => (
    <View
      style={{
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ width: "75%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
        <Text>{item?.description}</Text>
        {/* <Text>Creator: {item?.creator._id}</Text> */}
        <Text>Status: {item?.status}</Text>
        <Text>Email: {item?.email}</Text>
        {/* <Text>Status: {item?._id}</Text> */}

        {/* <Text>Status: {get_user_profile_data?.currentClanMeeting?._id}</Text> */}
      </View>

      <TouchableOpacity
        // onPress={() => {
        //   setSelectedClan(item);
        //   setIsModalVisible(true);
        // }}
        style={{
          backgroundColor: "green",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={
          get_user_profile_data?.currentClanMeeting?._id === item?._id
            ? () => {
                SelectCLan_Mutation.mutate({
                  method: "DELETE",

                  id: item?._id,
                });
                // dispatch(Get_User_Profle_Fun());
              }
            : () => {
                SelectCLan_Mutation.mutate({
                  method: "GET",

                  id: item?._id,
                });
              }
        }
      >
        <View>
          {get_user_profile_data?.currentClanMeeting?._id === item?._id ? (
            <Text style={{ color: "white" }}>Leave</Text>
          ) : (
            <Text style={{ color: "white" }}>Join</Text>
          )}
        </View>
      </TouchableOpacity>
      {/* Add more details as needed */}
    </View>
  );

  const AdminrenderClanItem = ({ item }) => (
    <View
      style={{
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View style={{ width: "75%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
        <Text>{item?.description}</Text>
        {/* <Text>Creator: {item?.creator._id}</Text> */}
        <Text>Status: {item?.status}</Text>
        <Text>Email: {item?.email}</Text>
        {/* <Text>Status: {item?._id}</Text> */}
        {/* <Text>Status: {get_user_profile_data?.AdmincurrentClanMeeting}</Text> */}
      </View>

      <TouchableOpacity
        // onPress={() => {
        //   setSelectedClan(item);
        //   setIsModalVisible(true);
        // }}
        style={{
          backgroundColor: "green",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={
          get_user_profile_data?.AdmincurrentClanMeeting === item?._id
            ? () => {
                Estate_admin_SelectCLan_Mutation.mutate({
                  method: "DELETE",

                  id: item?._id,
                });
                // dispatch(Get_User_Profle_Fun());
              }
            : () => {
                Estate_admin_SelectCLan_Mutation.mutate({
                  method: "GET",

                  id: item?._id,
                });
              }
        }
      >
        {Estate_admin_SelectCLan_Mutation.isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            {get_user_profile_data?.AdmincurrentClanMeeting === item?._id ? (
              <Text style={{ color: "white" }}>Leave</Text>
            ) : (
              <Text style={{ color: "white" }}>Join</Text>
            )}
          </View>
        )}
      </TouchableOpacity>
      {/* Add more details as needed */}
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {refreshing ||
        (SelectCLan_Mutation.isLoading && (
          <ActivityIndicator size="large" color="#0C1401" />
        ))}

      <View
        style={{
          //   marginVertical: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#CFCDCD",
          borderRadius: 6,
          padding: 10,
          width: "90%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Member" ? "green" : "transparent",
            padding: 10, // Adjust the padding as needed
            borderRadius: 5, // Add rounded corners if desired
          }}
          onPress={() => setActiveButton("Member")}
        >
          <MediumFontText
            data="Member"
            textstyle={{
              fontSize: 16,
              fontWeight: "500",

              color: activeButton === "Member" ? "white" : "black",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: activeButton === "Admin" ? "green" : "transparent",
            padding: 10, // Adjust the padding as needed
            borderRadius: 5, // Add rounded corners if desired
          }}
          onPress={() => setActiveButton("Admin")}
        >
          <MediumFontText
            data="Admin"
            textstyle={{
              fontSize: 16,
              fontWeight: "500",

              color: activeButton === "Admin" ? "white" : "black",
            }}
          />
        </TouchableOpacity>
      </View>

      {activeButton === "Member" && (
        <>
          {get_user_clan_data?.length < 1 ? (
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
              data={get_user_clan_data}
              keyExtractor={(item) => item._id}
              renderItem={renderClanItem}
              style={{ width: "100%" }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}

      {activeButton === "Admin" && (
        <>
          {get_all_clan_adminIN_data === null ? (
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
              data={get_all_clan_adminIN_data?.clans_info}
              keyExtractor={(item) => item._id}
              renderItem={AdminrenderClanItem}
              style={{ width: "100%" }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
    </View>
  );
};

export default UserClans;
