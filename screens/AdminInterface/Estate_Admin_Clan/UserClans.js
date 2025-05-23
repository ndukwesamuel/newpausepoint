// Import necessary modules from React Native and Expo
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  Get_Single_clan,
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
import { CenterReuseModals } from "../../../components/shared/ReuseModals";

// Replace this with the correct API endpoint for fetching user clans
const API_ENDPOINT = "https://your-api-endpoint.com/user-clans";

const UserClans = () => {
  // State to store the list of user clans
  const [userClans, setUserClans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState("Member"); // Initialize with 'Social' as the active button
  const animation = useRef(null);
  const [turnmodal, setTurnmodal] = useState(false);

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedClan, setSelectedClan] = useState(null);

  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
  } = useSelector((state) => state?.ClanSlice);

  const unapprovedClans = get_Single_clan_data?.data?.members?.filter(
    (clan) => clan?.status !== "approved"
  );

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );
  //   Get_User_Clans_Fun

  // Effect to fetch user clans when the component mounts

  const effectFunction = () => {
    dispatch(Get_User_Clans_Fun());
    dispatch(Get_User_Profle_Fun());
    dispatch(Get_all_clan_User_Is_adminIN_Fun());
    dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
  };

  useEffect(() => {
    dispatch(Get_User_Clans_Fun());
    dispatch(Get_User_Profle_Fun());
    dispatch(Get_all_clan_User_Is_adminIN_Fun());
    dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));

    return () => {};
  }, [dispatch]);

  const SelectCLan_Mutation = useMutation(
    (data_info) => {
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
        dispatch(reset_login());
        dispatch(reset_isOnboarding());
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
        dispatch(reset_login());
        dispatch(reset_isOnboarding());
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

  const ApproveMember_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}clan/EstateAdminsapproveMembership`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Request To Join Estate successfully ",
        });
        dispatch(
          Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting)
        );

        setTurnmodal(false);
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    effectFunction();

    // Wait for 2 seconds
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
      {console.log({
        item,
      })}
      <View style={{ width: "75%" }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
        <Text>{item?.description}</Text>
        <Text>Creator: {item?.email}</Text>
        <Text>Status: {item?.status}</Text>
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
        {SelectCLan_Mutation.isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <View>
            {get_user_profile_data?.currentClanMeeting?._id === item?._id ? (
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
        <Text>Creator: {item?.email}</Text>
        <Text>Status: {item?.status}</Text>
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

  const ApproverenderClanItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 16,
          width: "80%",
        }}
      >
        <Image
          source={{ uri: item?.user?.photo }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 16,
          }}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {item?.user?.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: "gray",
            }}
          >
            {item?.user?.email}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "green", // Customize color based on status
            }}
          >
            {item?.status}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "green",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 10,
        }}
        onPress={() => {
          setTurnmodal(true);
        }}
      >
        <View>
          <Text style={{ color: "white" }}>decide</Text>
        </View>
      </TouchableOpacity>

      <CenterReuseModals
        visible={turnmodal}
        onClose={() => setTurnmodal(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            width: "80%",
          }}
        >
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
            Decide User Membership
          </Text>

          <TouchableOpacity
            style={{
              position: "absolute",
              top: 10,
              right: 10,
            }}
            onPress={() => setTurnmodal(false)}
          >
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>

          <View
            style={{
              // flexDirection: "row",
              // justifyContent: "space-between",
              // alignItems: "center",
              gap: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 6,
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                ApproveMember_Mutation.mutate({
                  clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                  memberId: item?.user?._id,
                  approvalStatus: "approved",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Approved
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 6,
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                ApproveMember_Mutation.mutate({
                  clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                  memberId: item?.user?._id,
                  approvalStatus: "pending",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Pending
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 6,
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                ApproveMember_Mutation.mutate({
                  clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                  memberId: item?.user?._id,
                  approvalStatus: "suspended",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Suspended
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 10,
                paddingVertical: 15,
                borderRadius: 6,
                width: "50%",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 40,
              }}
              onPress={() => {
                ApproveMember_Mutation.mutate({
                  clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                  memberId: item?.user?._id,
                  approvalStatus: "rejected",
                });
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Rejected
              </Text>
            </TouchableOpacity>
          </View>
          {ApproveMember_Mutation.isLoading && (
            <ActivityIndicator size="Larger" color="green" />
          )}
        </View>
      </CenterReuseModals>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {refreshing && <ActivityIndicator size="large" color="#0C1401" />}

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
            data="My Estate"
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

        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Aprove" ? "green" : "transparent",
            padding: 10, // Adjust the padding as needed
            borderRadius: 5, // Add rounded corners if desired
          }}
          onPress={() => setActiveButton("Aprove")}
        >
          <MediumFontText
            data="Approve Member"
            textstyle={{
              fontSize: 16,
              fontWeight: "500",

              color: activeButton === "Aprove" ? "white" : "black",
            }}
          />
        </TouchableOpacity>
      </View>

      {activeButton === "Member" && (
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

      {activeButton === "Admin" && (
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

      {activeButton === "Aprove" && (
        <FlatList
          data={unapprovedClans}
          keyExtractor={(item) => item._id}
          renderItem={ApproverenderClanItem}
          style={{ width: "100%" }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default UserClans;
