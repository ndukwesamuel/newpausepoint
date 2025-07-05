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
import { emergencydata } from "../../components/Emergency/emdata";
import AppScreen from "../../components/shared/AppScreen";
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../components/Emergency/Modal";
import {
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../components/shared/Paragrahp";

import { AntDesign } from "@expo/vector-icons";
import { Formbutton, Forminput_Icon } from "../../components/shared/InputForm";
import { userFile } from "../../utils/fakedata";
import { useRoute } from "@react-navigation/native";
import { HalfScreenModal } from "../../components/shared/ReuseableModal";
import { Admin_Get_Single_User_Fun } from "../../Redux/Admin/UserSlice";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  Admin_Get_Single_Clan_Memeber_Fun,
  Get_Single_clan,
} from "../../Redux/UserSide/ClanSlice";
export default function UserDetails({ navigation }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const route = useRoute();

  console.log({
    iii: route,
  });

  // const { item } = route.params as { item: any };

  const { item } = route.params;
  console.log({
    item: item,
  });

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const { admin_get_single_clan_memeber_data } = useSelector(
    (state) => state?.ClanSlice
  );

  const { Singleuser_data } = useSelector((state) => state?.UserSlice);

  useEffect(() => {
    dispatch(Admin_Get_Single_User_Fun(item));
    dispatch(Admin_Get_Single_Clan_Memeber_Fun(item?.user?._id));

    return () => {};
  }, []);

  console.log({
    ooo: admin_get_single_clan_memeber_data?.data?.member,
  });
  console.log({
    qqqoo: admin_get_single_clan_memeber_data?.data?.userProfile,
  });

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

  const RenderItem = ({ item }) => {
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";
    if (item?.status === "Banned") {
      statusColor = "#F34357"; // Red color for 'Banned' status
      statusBackColor = "#FDF2F3";
    } else if (item?.status === "Pending") {
      statusColor = "#F27F2D"; // Yellow color for 'Pending' status
      statusBackColor = "#FFF1E7";
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#CFCDCD",
          borderRadius: 6,
          paddingHorizontal: 10,
          gap: 10,
          paddingVertical: 20,
          marginBottom: 20,
        }}
        onPress={() =>
          navigation.navigate("adminUserDetails", { data: "this" })
        }
      >
        <View
          style={{
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://img.bleacherreport.net/img/images/photos/003/701/847/hi-res-c834ba050d9e72e90eca37c6b08b6fc5_crop_north.jpg?1508166325&w=3072&h=2048",
            }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
              }}
            >
              {item?.user?.name}
            </Text>

            <Text>{item?.user?.email}</Text>
          </View>

          <View
            style={{ backgroundColor: statusBackColor, paddingHorizontal: 10 }}
          >
            <Text style={{ color: statusColor }}>{item?.status}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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

  const Stattus_fuc = () => {
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";
    if (admin_get_single_clan_memeber_data?.data?.member?.status === "Banned") {
      statusColor = "#F34357"; // Red color for 'Banned' status
      statusBackColor = "#FDF2F3";
    } else if (
      admin_get_single_clan_memeber_data?.data?.member?.status === "Pending"
    ) {
      statusColor = "#F27F2D"; // Yellow color for 'Pending' status
      statusBackColor = "#FFF1E7";
    }

    return (
      <View
        style={{
          backgroundColor: statusBackColor,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: statusColor, textAlign: "center" }}>
          {admin_get_single_clan_memeber_data?.data?.member?.status}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView>
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
              uri: admin_get_single_clan_memeber_data?.data?.userProfile?.photo,
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />

          <View style={{ flex: 1, gap: 5 }}>
            <SemiBoldFontText
              data={
                admin_get_single_clan_memeber_data?.data?.member?.user?.name
              }
              textstyle={{ fontSize: 22 }}
            />
            <MediumFontText
              data={
                admin_get_single_clan_memeber_data?.data?.member?.user?.email
              }
              textstyle={{ fontSize: 11 }}
            />
            <View style={{ width: "40%" }}>
              <Stattus_fuc />
            </View>
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

          {/* <View style={{ marginBottom: 5, paddingBottom: 10 }}>
            <RegularFontText
              data="Resident ID"
              textstyle={{ fontSize: 13, color: "#696969" }}
            />
            <MediumFontText data="2340OPL56" textstyle={{ fontSize: 19 }} />
          </View> */}

          <View style={{ marginBottom: 5, paddingBottom: 10 }}>
            <RegularFontText
              data="Home Address"
              textstyle={{ fontSize: 13, color: "#696969" }}
            />
            <MediumFontText
              data={`${admin_get_single_clan_memeber_data?.data?.userProfile?.address?.street} ${admin_get_single_clan_memeber_data?.data?.userProfile?.address?.city} `}
              textstyle={{ fontSize: 19 }}
            />
          </View>

          <View style={{ marginBottom: 5, paddingBottom: 10 }}>
            <RegularFontText
              data="Phone Number"
              textstyle={{ fontSize: 13, color: "#696969" }}
            />
            <MediumFontText
              data={
                admin_get_single_clan_memeber_data?.data?.userProfile
                  ?.phoneNumber
              }
              textstyle={{ fontSize: 19 }}
            />
          </View>
        </View>

        <Formbutton
          buttonStyle={{
            backgroundColor:
              item?.status === "approved" ? "#FDF2F3" : "#04973C",

            borderColor: item?.status === "approved" ? "#F34357" : "",
            paddingVertical: 14,
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 10,
          }}
          textStyle={{
            color: item?.status === "approved" ? "#F34357" : "white",

            fontWeight: "500",
            fontSize: 14,
            fontFamily: "RobotoSlab-Medium",
          }}
          data={item?.status === "approved" ? "Ban User" : "Reinstate User"}
          onPress={() => setIsModalVisible(!isModalVisible)}
        />

        {/* <EmergencyModal visible={modalVisible} onClose={closeModal} setModalFormVisible={setModalFormVisible} /> */}

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
        >
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
                      admin_get_single_clan_memeber_data?.data?.member
                        ?.status === "approved"
                        ? "Ban User "
                        : "Reinstate User"
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
                    admin_get_single_clan_memeber_data?.data?.member?.status ===
                    "approved"
                      ? "Banning this user will suspend their account indefinitely, preventing further access to the system."
                      : "Reinstating this user will reactivate their account, allowing them to access the system"
                  }
                  textstyle={{
                    fontSize: 14,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                />
                {admin_get_single_clan_memeber_data?.data?.member?.status ===
                "approved" ? (
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
                          clanId:
                            get_user_profile_data?.AdmincurrentClanMeeting,
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
                          clanId:
                            get_user_profile_data?.AdmincurrentClanMeeting,
                          memberId:
                            admin_get_single_clan_memeber_data?.data?.member
                              ?.user?._id,
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
    </ScrollView>
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
