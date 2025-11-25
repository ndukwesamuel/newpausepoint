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
// Update the import to use TanStack Query
import { useMutation } from "@tanstack/react-query";
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

  // Route params extraction (simplified for readability)
  const { item } = route.params;

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const { admin_get_single_clan_memeber_data } = useSelector(
    (state) => state?.ClanSlice
  );

  const { Singleuser_data } = useSelector((state) => state?.UserSlice);

  const {
    user_data,
    // user_isError, // Removed unused variables
    // user_isSuccess,
    // user_isLoading,
    // user_message,
  } = useSelector((state) => state.AuthSlice);

  // NOTE: Assuming item contains the necessary user ID to fetch details
  useEffect(() => {
    if (item) {
      dispatch(Admin_Get_Single_User_Fun(item));
      // Use user ID from item structure to fetch clan member details
      dispatch(Admin_Get_Single_Clan_Memeber_Fun(item?.user?._id));
    }
    return () => {};
  }, [item, dispatch]);

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
  const usertypelist = ["All", "Active", "Banned", "Pending"];

  // Note: The logic below for filteredUsers using userFile (fakedata)
  // and status is not used in the main render, but is kept if needed elsewhere.
  const filteredUsers = userFile.filter((user) => {
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

  // Removed unused RenderItem and capitalizeFirstLetter functions for brevity,
  // as they were likely used for a FlatList display not present here.

  // --- TanStack Query Mutation for Member Approval/Suspension ---
  const ApproveMember_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}clan/EstateAdminsapproveMembership`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "User status updated successfully",
      });

      // Refresh the single clan data
      dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));

      // Close the modal
      setIsModalVisible(false);
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Error updating status"}`,
      });
    },
  });

  // Helper function to render the status badge
  const Stattus_fuc = () => {
    const status = admin_get_single_clan_memeber_data?.data?.member?.status;
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";

    if (status === "Banned") {
      statusColor = "#F34357"; // Red
      statusBackColor = "#FDF2F3";
    } else if (status === "Pending") {
      statusColor = "#F27F2D"; // Orange
      statusBackColor = "#FFF1E7";
    } else if (status === "suspended") {
      // Assuming 'suspended' is the status after Banning
      statusColor = "#F34357";
      statusBackColor = "#FDF2F3";
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
          {status}
        </Text>
      </View>
    );
  };

  // Determine if the user is currently approved (or not suspended/banned)
  const isApproved =
    admin_get_single_clan_memeber_data?.data?.member?.status === "approved";

  // Determine the current user ID for the mutation payload
  const memberId = admin_get_single_clan_memeber_data?.data?.member?.user?._id;

  // Determine the next status for the button action
  const nextStatus = isApproved ? "suspended" : "approved";
  const buttonText = isApproved ? "Ban User" : "Reinstate User";

  return (
    <ScrollView>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        {/* User Header Info (Image, Name, Email, Status) */}
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

        {/* User Details Card */}
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

          {/* Home Address */}
          <View style={{ marginBottom: 5, paddingBottom: 10 }}>
            <RegularFontText
              data="Home Address"
              textstyle={{ fontSize: 13, color: "#696969" }}
            />
            <MediumFontText
              data={`${
                admin_get_single_clan_memeber_data?.data?.userProfile?.address
                  ?.street || ""
              } ${
                admin_get_single_clan_memeber_data?.data?.userProfile?.address
                  ?.city || ""
              } `}
              textstyle={{ fontSize: 19 }}
            />
          </View>

          {/* Phone Number */}
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

        {/* Action Button (Ban/Reinstate) */}
        <Formbutton
          buttonStyle={{
            backgroundColor: isApproved ? "#FDF2F3" : "#04973C",
            borderColor: isApproved ? "#F34357" : "#04973C",
            paddingVertical: 14,
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 10,
          }}
          textStyle={{
            color: isApproved ? "#F34357" : "white",
            fontWeight: "500",
            fontSize: 14,
            fontFamily: "RobotoSlab-Medium",
          }}
          data={buttonText}
          onPress={() => setIsModalVisible(true)}
          isLoading={ApproveMember_Mutation.isPending}
        />

        {/* Ban/Reinstate Confirmation Modal */}
        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
          onRequestClose={toggleModal} // Good practice for Android back button
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
                    data={isApproved ? "Ban User " : "Reinstate User"}
                    textstyle={{
                      fontSize: 18,
                      textAlign: "center",
                      width: "100%",
                    }}
                  />
                </View>

                <RegularFontText
                  data={
                    isApproved
                      ? "Banning this user will suspend their account indefinitely, preventing further access to the system."
                      : "Reinstating this user will reactivate their account, allowing them to access the system"
                  }
                  textstyle={{
                    fontSize: 14,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                />

                {/* Modal Action Buttons */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  {/* Primary Action Button (Ban/Reinstate) */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: isApproved ? "#FDF2F3" : "#04973C",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                      borderWidth: isApproved ? 1 : 0,
                      borderColor: isApproved ? "#F34357" : "transparent",
                    }}
                    onPress={() => {
                      if (
                        memberId &&
                        get_user_profile_data?.AdmincurrentClanMeeting
                      ) {
                        ApproveMember_Mutation.mutate({
                          clanId:
                            get_user_profile_data?.AdmincurrentClanMeeting,
                          memberId: memberId,
                          approvalStatus: nextStatus,
                        });
                      } else {
                        Toast.show({
                          type: "error",
                          text1: "Missing ID information.",
                        });
                      }
                    }}
                  >
                    <RegularFontText
                      data={isApproved ? "Confirm Ban" : "Confirm Reinstate"}
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                        color: isApproved ? "#F34357" : "white",
                      }}
                    />
                  </TouchableOpacity>

                  {/* Cancel Button */}
                  <TouchableOpacity
                    style={{
                      backgroundColor: isApproved ? "#04973C" : "white",
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                      borderRadius: 6,
                      borderWidth: isApproved ? 0 : 1,
                      borderColor: isApproved ? "transparent" : "#04973C",
                    }}
                    onPress={toggleModal}
                  >
                    <RegularFontText
                      data="Cancel"
                      textstyle={{
                        fontSize: 14,
                        fontWeight: "400",
                        textAlign: "center",
                        color: isApproved ? "white" : "#04973C",
                      }}
                    />
                  </TouchableOpacity>
                </View>
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
