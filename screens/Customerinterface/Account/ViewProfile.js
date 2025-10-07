import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";
import { AntDesign } from "@expo/vector-icons";

import { useRoute } from "@react-navigation/native";
// import { HalfScreenModal } from "../../components/shared/ReuseableModal";
// import { Admin_Get_Single_User_Fun } from "../../Redux/Admin/UserSlice";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
// import { Get_Single_clan } from "../../Redux/UserSide/ClanSlice";
import AppScreen from "../../../components/shared/AppScreen";
import { Formbutton } from "../../../components/shared/InputForm";
import { userFile } from "../../../utils/fakedata";
import { Admin_Get_Single_User_Fun } from "../../../Redux/Admin/UserSlice";
import { HalfScreenModal } from "../../../components/shared/ReuseableModal";
import { Get_Single_clan } from "../../../Redux/UserSide/ClanSlice";
import QRCode from "react-native-qrcode-svg";
import { useFetchData } from "../../../hooks/Request";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
function ViewProfile_main({ navigation }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  let item = {};

  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

  const userIdToFind = userProfile_data?.user?._id; // The userId you're looking for
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString()
  );

  console.log({
    jaja: foundMember,
  });

  const {
    data: getuserclanInfo,
    isLoading: isloadinggetuserclanInfo,
    error: iserrorgetuserclanInfo,
  } = useFetchData(
    `clan/${userProfile_data?.currentClanMeeting?._id}`,
    "getuserclans"
  );

  console.log({
    vv: getuserclanInfo?.data?.settings?.allowMembersToEditProfile,
  });

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    // dispatch(Admin_Get_Single_User_Fun(item));
    dispatch(UserProfile_data_Fun());

    return () => {};
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userType, setUserType] = useState("All");
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const filteredUsers = userFile.filter((user) => {
    // if (userType === "ALL") {

    if (userType.toUpperCase() === "ALL") {
      return true; // Show all users
    } else {
      return user.status === userType; // Show users with selected status
    }
  });

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
          text1: " successfully ",
        });
        dispatch(
          Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting)
        );

        // setTurnmodal(false);
        setIsModalVisible(!isModalVisible);
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

  const jsonString = JSON.stringify(userProfile_data);

  const mainuserId = userProfile_data?.user?._id;
  const mainmembers = userProfile_data?.currentClanMeeting?.members;
  const foundermember = mainmembers?.find(
    (member) => member.user === mainuserId
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      <View
        style={{
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          source={{
            uri: userProfile_data?.photo,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />

        <View style={{ flex: 1, gap: 5 }}>
          <SemiBoldFontText
            data={userProfile_data?.user?.name}
            textstyle={{ fontSize: 22 }}
          />
          <MediumFontText
            data={userProfile_data?.user?.email}
            textstyle={{ fontSize: 11 }}
          />
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderRadius: 7,
          borderColor: "#2632381F",
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginTop: 20,
        }}
      >
        <View
          style={{
            marginBottom: 20,
            borderBottomColor: "#CFCDCD",
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}
        >
          <SemiBoldFontText data="User Info " textstyle={{ fontSize: 18 }} />
        </View>
        <View>
          {/* New fields added here */}
          {foundermember?.apartmentType && (
            <View style={{ marginBottom: 5, paddingBottom: 10 }}>
              <RegularFontText
                data="Apartment Type"
                textstyle={{ fontSize: 13, color: "#696969" }}
              />
              <MediumFontText
                data={foundermember?.apartmentType}
                textstyle={{ fontSize: 19 }}
              />
            </View>
          )}

          {foundermember?.houseNumber && (
            <View style={{ marginBottom: 5, paddingBottom: 10 }}>
              <RegularFontText
                data="House Number"
                textstyle={{ fontSize: 13, color: "#696969" }}
              />
              <MediumFontText
                data={foundermember?.houseNumber}
                textstyle={{ fontSize: 19 }}
              />
            </View>
          )}

          {foundermember?.street && (
            <View style={{ marginBottom: 5, paddingBottom: 10 }}>
              <RegularFontText
                data="Street"
                textstyle={{ fontSize: 13, color: "#696969" }}
              />
              <MediumFontText
                data={foundermember?.street}
                textstyle={{ fontSize: 19 }}
              />
            </View>
          )}

          {foundermember?.unitNumber && (
            <View style={{ marginBottom: 5, paddingBottom: 10 }}>
              <RegularFontText
                data="Unit Number"
                textstyle={{ fontSize: 13, color: "#696969" }}
              />
              <MediumFontText
                data={foundermember?.unitNumber}
                textstyle={{ fontSize: 19 }}
              />
            </View>
          )}
        </View>
        {/* <View style={{ marginBottom: 5, paddingBottom: 10 }}>
          <RegularFontText
            data="Resident ID"
            textstyle={{ fontSize: 13, color: "#696969" }}
          />
          <MediumFontText data="2340OPL56" textstyle={{ fontSize: 19 }} />
        </View> */}

        {!getuserclanInfo?.data?.settings?.allowMembersToEditProfile && (
          <View style={{ marginBottom: 5, paddingBottom: 10 }}>
            <RegularFontText
              data="Home Address "
              textstyle={{ fontSize: 13, color: "#696969" }}
            />
            <MediumFontText
              data={foundermember?.homeAddress}
              textstyle={{ fontSize: 19 }}
            />
          </View>
        )}

        <View style={{ marginBottom: 5, paddingBottom: 10 }}>
          <RegularFontText
            data="Phone Number"
            textstyle={{ fontSize: 13, color: "#696969" }}
          />
          <MediumFontText
            data={foundermember?.phonenumber}
            textstyle={{ fontSize: 19 }}
          />
        </View>
        <View style={{ marginBottom: 5, paddingBottom: 10 }}>
          <RegularFontText
            data="Member Code"
            textstyle={{ fontSize: 13, color: "#696969" }}
          />
          <MediumFontText
            data={foundermember?.memberCode}
            textstyle={{ fontSize: 19 }}
          />
        </View>
      </View>

      {userProfile_data?.user?.isGuest != true && (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 7,
            borderColor: "#2632381F",
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              borderBottomColor: "#CFCDCD",
              borderBottomWidth: 1,
              paddingBottom: 10,
            }}
          >
            <SemiBoldFontText data="Qr Code" textstyle={{ fontSize: 18 }} />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            {jsonString !== "" && (
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <QRCode
                  value={foundermember?.memberCode}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            )}
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          ></View>
        </View>
      )}

      <Modal transparent={true} animationType="slide" visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View
                style={{
                  marginBottom: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  borderBottomColor: "#CFCDCD",
                  borderBottomWidth: 1,
                  paddingBottom: 10,
                }}
              >
                <MediumFontText
                  data={
                    item?.status === "approved" ? "Ban User " : "Reinstate User"
                  }
                  textstyle={{
                    fontSize: 18,
                    textAlign: "center",
                    width: "100%",
                  }}
                />
              </View>

              <RegularFontText
                data={
                  item?.status === "approved"
                    ? "BBanning this user will suspend their account indefinitely, preventing further access to the system."
                    : "Reinstating this user will reactivate their account, allowing them to access the system"
                }
                textstyle={{
                  fontSize: 14,
                  fontWeight: "400",
                  textAlign: "center",
                }}
              />
              {item?.status === "approved" ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#FDF2F3",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                    }}
                    onPress={() => {
                      ApproveMember_Mutation.mutate({
                        clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                        memberId: item?.user?._id,
                        approvalStatus: "suspended",
                      });
                    }}
                  >
                    <RegularFontText
                      data="Ban User"
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#04973C",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                    }}
                    onPress={toggleModal}
                  >
                    <RegularFontText
                      data="Cancel"
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                        color: "white",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: "#04973C",
                    }}
                    onPress={toggleModal}
                  >
                    <RegularFontText
                      data="Cancel"
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                        color: "#04973C",
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#04973C",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                    }}
                    onPress={() => {
                      ApproveMember_Mutation.mutate({
                        clanId: get_user_profile_data?.AdmincurrentClanMeeting,
                        memberId: item?.user?._id,
                        approvalStatus: "approved",
                      });
                    }}
                  >
                    <RegularFontText
                      data="Reinstate"
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                        color: "white",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

function GeneralViewProfile({ navigation }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  let item = {};

  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

  const userIdToFind = userProfile_data?.user?._id; // The userId you're looking for
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString()
  );

  console.log({
    jaja: foundMember,
  });

  const {
    data: getuserclanInfo,
    isLoading: isloadinggetuserclanInfo,
    error: iserrorgetuserclanInfo,
  } = useFetchData(
    `clan/${userProfile_data?.currentClanMeeting?._id}`,
    "getuserclans"
  );

  const {
    data: getuserinfo,
    isLoading: isloadinggetuserinfo,
    error: iserrorgetuserinfo,
  } = useFetchData(
    `api/v1/general/UserProfile`,
    // `clan/${userProfile_data?.currentClanMeeting?._id}`,
    "getuserinfo"
  );

  console.log({
    ddd: getuserinfo?.user,
  });

  console.log({
    vv: getuserclanInfo?.data?.settings?.allowMembersToEditProfile,
  });

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    // dispatch(Admin_Get_Single_User_Fun(item));
    dispatch(UserProfile_data_Fun());

    return () => {};
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userType, setUserType] = useState("All");
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const filteredUsers = userFile.filter((user) => {
    // if (userType === "ALL") {

    if (userType.toUpperCase() === "ALL") {
      return true; // Show all users
    } else {
      return user.status === userType; // Show users with selected status
    }
  });

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

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
          text1: " successfully ",
        });
        dispatch(
          Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting)
        );

        // setTurnmodal(false);
        setIsModalVisible(!isModalVisible);
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

  const jsonString = JSON.stringify(userProfile_data);

  const mainuserId = userProfile_data?.user?._id;
  const mainmembers = userProfile_data?.currentClanMeeting?.members;
  const foundermember = mainmembers?.find(
    (member) => member.user === mainuserId
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
      <View
        style={{
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Image
          source={{
            uri: userProfile_data?.photo,
          }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />

        <View style={{ flex: 1, gap: 5 }}>
          <SemiBoldFontText
            data={userProfile_data?.user?.name}
            textstyle={{ fontSize: 22 }}
          />
          <MediumFontText
            data={userProfile_data?.user?.email}
            textstyle={{ fontSize: 11 }}
          />
        </View>
      </View>

      <View
        style={{
          borderWidth: 1,
          borderRadius: 7,
          borderColor: "#2632381F",
          paddingHorizontal: 10,
          paddingVertical: 10,
          marginTop: 20,
        }}
      >
        <View style={{ marginBottom: 5, paddingBottom: 10 }}>
          <RegularFontText
            data="Phone Number"
            textstyle={{ fontSize: 13, color: "#696969" }}
          />
          <MediumFontText
            data={getuserinfo?.user?.phoneNumber || ""}
            textstyle={{ fontSize: 19 }}
          />
        </View>

        <View style={{ marginBottom: 5, paddingBottom: 10 }}>
          <RegularFontText
            data="Home Address"
            textstyle={{ fontSize: 13, color: "#696969" }}
          />
          <MediumFontText
            data={`${getuserinfo?.user?.address?.street || ""}${
              getuserinfo?.user?.address?.street ? ", " : ""
            }${getuserinfo?.user?.address?.city || ""}${
              getuserinfo?.user?.address?.city ? ", " : ""
            }${getuserinfo?.user?.address?.state || ""}`}
            textstyle={{ fontSize: 19 }}
          />
        </View>
      </View>
    </View>
  );
}

export default function ViewProfile({ navigation }) {
  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

  return (
    <ScreenWrapper
      title="Personal Info"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      // showHeader={false}
    >
      <ScrollView>
        {userProfile_data?.user?.isGuest === true ? (
          <GeneralViewProfile />
        ) : (
          <ViewProfile_main />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "30%",
  },
});
