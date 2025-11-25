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

// ------------------------------------------------------------------
// UPDATED IMPORT: Use @tanstack/react-query instead of react-query
import { useMutation } from "@tanstack/react-query";
// ------------------------------------------------------------------
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
const API_ENDPOINT = "https://your-api-endpoint.com/user-clans"; // Note: This constant is unused in the original logic but kept for context

const UserClans = () => {
  // State to store the list of user clans
  const [userClans, setUserClans] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState("Member"); // Initialize with 'Member'
  const animation = useRef(null);
  const [turnmodal, setTurnmodal] = useState(false);
  const [memberToApprove, setMemberToApprove] = useState(null); // State to hold the member being processed

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

  const { user_data } = useSelector((state) => state.AuthSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const effectFunction = () => {
    dispatch(Get_User_Clans_Fun());
    dispatch(Get_User_Profle_Fun());
    dispatch(Get_all_clan_User_Is_adminIN_Fun());
    // Only dispatch if AdmincurrentClanMeeting is present to avoid unnecessary calls
    if (get_user_profile_data?.AdmincurrentClanMeeting) {
      dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
    }
  };

  useEffect(() => {
    // Initial fetch of data
    effectFunction();

    // Re-fetch Get_Single_clan if the profile data updates with the Admin current clan
    if (get_user_profile_data?.AdmincurrentClanMeeting) {
      dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
    }

    return () => {};
  }, [dispatch, get_user_profile_data?.AdmincurrentClanMeeting]);

  const getAuthConfig = () => ({
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${user_data?.token}`,
    },
  });

  // ------------------------------------------------------------------
  // 1. TanStack Query useMutation for User Clan Select/Deselect (Join/Leave)
  // ------------------------------------------------------------------
  const SelectCLan_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}clan/select_user_clan/${data_info?.id}`;
      const config = getAuthConfig();

      if (data_info?.method === "GET") {
        return axios.get(url, config);
      }
      if (data_info?.method === "DELETE") {
        return axios.delete(url, config);
      }
      return Promise.reject(new Error("Invalid method provided."));
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Estate membership successfully updated",
      });

      // Refetch relevant data and trigger app reset flow
      dispatch(Get_User_Clans_Fun());
      dispatch(Get_User_Profle_Fun());
      dispatch(Get_all_clan_User_Is_adminIN_Fun());
      // The original code used to reset login/onboarding, maintaining this flow:
      dispatch(reset_login());
      dispatch(reset_isOnboarding());
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${
          error?.response?.data?.message || "Failed to update membership"
        }`,
      });
      // Refresh data on error to ensure consistency
      dispatch(Get_User_Clans_Fun());
      dispatch(Get_User_Profle_Fun());
      dispatch(Get_all_clan_User_Is_adminIN_Fun());
    },
  });

  // ------------------------------------------------------------------
  // 2. TanStack Query useMutation for Admin Clan Select/Deselect (Join/Leave Admin Role)
  // ------------------------------------------------------------------
  const Estate_admin_SelectCLan_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}clan/select_Admin_clan/${data_info?.id}`;
      const config = getAuthConfig();

      if (data_info?.method === "GET") {
        return axios.get(url, config);
      }
      if (data_info?.method === "DELETE") {
        return axios.delete(url, config);
      }
      return Promise.reject(new Error("Invalid method provided."));
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Admin Estate successfully updated",
      });

      // Refetch relevant data and trigger app reset flow
      dispatch(Get_User_Clans_Fun());
      dispatch(Get_User_Profle_Fun());
      dispatch(Get_all_clan_User_Is_adminIN_Fun());
      // The original code used to reset login/onboarding, maintaining this flow:
      dispatch(reset_login());
      dispatch(reset_isOnboarding());
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${
          error?.response?.data?.message || "Failed to update admin role"
        }`,
      });
      // Refresh data on error to ensure consistency
      dispatch(Get_User_Clans_Fun());
      dispatch(Get_User_Profle_Fun());
      dispatch(Get_all_clan_User_Is_adminIN_Fun());
    },
  });

  // ------------------------------------------------------------------
  // 3. TanStack Query useMutation for Approving/Rejecting/Suspending Member
  // ------------------------------------------------------------------
  const ApproveMember_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}clan/EstateAdminsapproveMembership`;
      const config = getAuthConfig();

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Member status successfully updated",
      });

      // Refetch single clan data to update the unapproved list
      if (get_user_profile_data?.AdmincurrentClanMeeting) {
        dispatch(
          Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting)
        );
      }
      setTurnmodal(false); // Close the decision modal
      setMemberToApprove(null); // Clear the selected member
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${
          error?.response?.data?.message || "Failed to update member status"
        }`,
      });
      // Do not close modal on error, allow user to retry
    },
  });

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    effectFunction();

    // Set refreshing to false after a short delay (or wait for dispatch completion in real app)
    setTimeout(() => setRefreshing(false), 1500);
  };

  const handleDecideMember = (item) => {
    setMemberToApprove(item);
    setTurnmodal(true);
  };

  const handleApproveAction = (status) => {
    if (!memberToApprove || ApproveMember_Mutation.isPending) return;

    ApproveMember_Mutation.mutate({
      clanId: get_user_profile_data?.AdmincurrentClanMeeting,
      memberId: memberToApprove?.user?._id,
      approvalStatus: status,
    });
  };

  // Render item function for FlatList (Member View)
  const renderClanItem = ({ item }) => {
    const isCurrentlySelected =
      get_user_profile_data?.currentClanMeeting?._id === item?._id;
    const isLoading = SelectCLan_Mutation.isPending;

    return (
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
        <View style={{ width: "70%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>Creator: {item?.email}</Text>
          <Text>Status: {item?.status}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? "#90ee90" : "green",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            width: "25%",
            alignItems: "center",
          }}
          onPress={() => {
            SelectCLan_Mutation.mutate({
              method: isCurrentlySelected ? "DELETE" : "GET",
              id: item?._id,
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isCurrentlySelected ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render item function for FlatList (Admin View)
  const AdminrenderClanItem = ({ item }) => {
    const isCurrentlySelectedAsAdmin =
      get_user_profile_data?.AdmincurrentClanMeeting === item?._id;
    const isLoading = Estate_admin_SelectCLan_Mutation.isPending;

    return (
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
        <View style={{ width: "70%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>Creator: {item?.email}</Text>
          <Text>Status: {item?.status}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isLoading ? "#90ee90" : "green",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            width: "25%",
            alignItems: "center",
          }}
          onPress={() => {
            Estate_admin_SelectCLan_Mutation.mutate({
              method: isCurrentlySelectedAsAdmin ? "DELETE" : "GET",
              id: item?._id,
            });
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isCurrentlySelectedAsAdmin ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // Render item function for FlatList (Approve Member View)
  const ApproverenderClanItem = ({ item }) => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 16,
        marginHorizontal: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "70%",
        }}
      >
        <Image
          source={{ uri: item?.user?.photo || "default_avatar_uri" }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            marginRight: 16,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item?.user?.name}
          </Text>
          <Text style={{ fontSize: 14, color: "gray" }}>
            {item?.user?.email}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: "bold", color: "orange" }}>
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
          width: "25%",
          alignItems: "center",
        }}
        onPress={() => handleDecideMember(item)}
      >
        <Text style={{ color: "white" }}>Decide</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {/* The original code had a loading indicator outside the FlatList, which is fine */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#CFCDCD",
          borderRadius: 6,
          padding: 5, // Slightly reduced padding for better fit
          width: "90%",
        }}
      >
        {/* Member Button */}
        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Member" ? "green" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
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

        {/* Admin Button */}
        <TouchableOpacity
          style={{
            backgroundColor: activeButton === "Admin" ? "green" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
            marginHorizontal: 5, // Spacing between buttons
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

        {/* Approve Member Button */}
        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Aprove" ? "green" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
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
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text>No estate memberships found.</Text>
            </View>
          )}
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
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text>You are not an administrator in any estate.</Text>
            </View>
          )}
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
          ListEmptyComponent={() => (
            <View style={{ padding: 20, alignItems: "center" }}>
              <Text>
                No pending member requests in your current Admin estate.
              </Text>
            </View>
          )}
        />
      )}

      {/* Decision Modal */}
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
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
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
              zIndex: 10,
            }}
            onPress={() => setTurnmodal(false)}
            disabled={ApproveMember_Mutation.isPending}
          >
            <MaterialIcons name="cancel" size={30} color="gray" />
          </TouchableOpacity>

          <View
            style={{
              gap: 15,
              width: "100%",
              alignItems: "center",
            }}
          >
            {["approved", "pending", "suspended", "rejected"].map((status) => {
              const statusText =
                status.charAt(0).toUpperCase() + status.slice(1);
              const bgColor =
                status === "approved"
                  ? "#04973C"
                  : status === "pending"
                  ? "#FFA500"
                  : status === "suspended"
                  ? "#FF6347"
                  : "#DC143C";

              return (
                <TouchableOpacity
                  key={status}
                  style={{
                    backgroundColor: ApproveMember_Mutation.isPending
                      ? "#ccc"
                      : bgColor,
                    paddingVertical: 15,
                    borderRadius: 6,
                    width: "80%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => handleApproveAction(status)}
                  disabled={ApproveMember_Mutation.isPending}
                >
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "600",
                      fontSize: 16,
                    }}
                  >
                    {statusText}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {ApproveMember_Mutation.isPending && (
            <ActivityIndicator
              size="large"
              color="green"
              style={{ marginTop: 20 }}
            />
          )}
        </View>
      </CenterReuseModals>
    </View>
  );
};

export default UserClans;
