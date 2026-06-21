import React, { useRef, useState } from "react";
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
import Toast from "react-native-toast-message";

import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";
import { MediumFontText } from "../../../components/shared/Paragrahp";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const UserClans = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState("Member");
  const [loadingClanId, setLoadingClanId] = useState(null); // tracks which clan is loading
  const animation = useRef(null);
  const dispatch = useDispatch();

  // ----------------------------------------------------------------
  // Fetch all clans the user belongs to
  // ----------------------------------------------------------------
  const { data: allMyClans, refetch: refetchallMyClans } = useFetchData_v2(
    "api/v1/clan/user/allMyClans",
    "allMyClans",
  );

  const { userDatav2 } = useSelector((state) => state.authSlice);

  console.log({
    iiii: userDatav2?.data?.user?.id, // allMyClans?.userClans[0]?.admins[0]?.user,
  });

  const { get_all_clan_adminIN_data } = useSelector(
    (state) => state?.ClanSlice,
  );

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  const filterAdminClans = (clans, userId) => {
    return clans?.filter((clan) =>
      clan?.admins?.some((admin) => admin?.user?._id === userId),
    );
  };

  // Usage
  const adminClans = filterAdminClans(
    allMyClans?.userClans,
    userDatav2?.data?.user?.id,
  );

  console.log({
    yyy: adminClans,
  });

  // ----------------------------------------------------------------
  // Single PATCH mutation for both Member and Admin clan selection
  // Body shape drives the logic:
  //   Member Join  → { currentClanMeeting: clanId }
  //   Member Leave → { currentClanMeeting: null }
  //   Admin  Join  → { AdmincurrentClanMeeting: clanId }
  //   Admin  Leave → { AdmincurrentClanMeeting: null }
  // ----------------------------------------------------------------
  const updateClanMutation = useMutateData_v2(
    "api/v1/clan/user/allMyClans",
    "PATCH",
    ["allMyClans"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Clan updated successfully",
        });
        dispatch(Get_User_Profle_Fun());
        setLoadingClanId(null);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "An error occurred",
        });
        setLoadingClanId(null);
      },
    },
  );

  // ----------------------------------------------------------------
  // Pull-to-refresh
  // ----------------------------------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchallMyClans(), dispatch(Get_User_Profle_Fun())]);
    setRefreshing(false);
  };

  // ----------------------------------------------------------------
  // Member clan list item
  // ----------------------------------------------------------------
  const renderClanItem = ({ item }) => {
    const isCurrentClan =
      (get_user_profile_data?.data?.currentClanMeeting?._id ??
        get_user_profile_data?.data?.currentClanMeeting) === item?._id;

    const isThisLoading = loadingClanId === item?._id;

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
        <View style={{ width: "75%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          {/* <Text>{item?.description}</Text> */}
          {/* <Text>Status: {item?.status}</Text>
          <Text>Email: {item?.email}</Text> */}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isCurrentClan ? "#dc3545" : "#04973C",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            setLoadingClanId(item?._id);
            updateClanMutation.mutate({
              currentClanMeeting: isCurrentClan ? null : item?._id,
            });
          }}
          disabled={isThisLoading}
        >
          {isThisLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isCurrentClan ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ----------------------------------------------------------------
  // Admin clan list item
  // ----------------------------------------------------------------
  const AdminrenderClanItem = ({ item }) => {
    const isAdminCurrentClan =
      (get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ??
        get_user_profile_data?.data?.AdmincurrentClanMeeting) === item?._id;

    console.log({
      xxx: item,
    });

    const isThisLoading = loadingClanId === item?._id;

    console.log({
      oooo: item,
    });

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
        <View style={{ width: "75%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>Status: {item?.status}</Text>
          <Text>Email: {item?.email}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isAdminCurrentClan ? "#dc3545" : "#04973C",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            setLoadingClanId(item?._id);
            updateClanMutation.mutate({
              AdmincurrentClanMeeting: isAdminCurrentClan ? null : item?._id,
            });
          }}
          disabled={isThisLoading}
        >
          {false ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isAdminCurrentClan ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {loadingClanId !== null && (
        <ActivityIndicator
          size="large"
          color="#0C1401"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        />
      )}

      {/* Tab toggle */}
      <View
        style={{
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
              activeButton === "Member" ? "#04973C" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
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
            backgroundColor:
              activeButton === "Admin" ? "#04973C" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
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

      {/* Member tab */}
      {activeButton === "Member" && (
        <>
          {!allMyClans?.userClans?.length ? (
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
                style={{ width: 200, height: 200 }}
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
            </View>
          ) : (
            <FlatList
              data={allMyClans?.userClans}
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

      {/* Admin tab */}
      {activeButton === "Admin" && (
        <>
          {!allMyClans?.userClans?.length ? (
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
                style={{ width: 200, height: 200 }}
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
            </View>
          ) : (
            <FlatList
              data={adminClans}
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
