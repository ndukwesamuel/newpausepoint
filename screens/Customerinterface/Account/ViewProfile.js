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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

import { useRoute } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
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
import { useFetchData_v2 } from "../../../hooks/Requestv2";

function ViewProfile_main({ navigation }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'household'

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  let item = {};

  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

  const userIdToFind = userProfile_data?.user?._id;
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString(),
  );

  // Check if user is a clan member
  const isClanMember = !!foundMember;

  // Fetch clan info
  const {
    data: getuserclanInfo,
    isLoading: isloadinggetuserclanInfo,
    error: iserrorgetuserclanInfo,
  } = useFetchData(
    `clan/${userProfile_data?.currentClanMeeting?._id}`,
    "getuserclans",
  );

  // Fetch household data using the new hook
  const {
    data: householdData,
    isLoading: isLoadingHousehold,
    error: householdError,
  } = useFetchData_v2("api/v1/household/user", "getUserHousehold");

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, []);

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
        text1: " successfully ",
      });
      dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
      setIsModalVisible(!isModalVisible);
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
    },
  });

  const jsonString = JSON.stringify(userProfile_data);
  const mainuserId = userProfile_data?.user?._id;
  const mainmembers = userProfile_data?.currentClanMeeting?.members;
  const foundermember = mainmembers?.find(
    (member) => member.user === mainuserId,
  );

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  // Tab Button Component
  const TabButton = ({ title, isActive, onPress, icon }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={isActive ? "#10B981" : "#6B7280"}
        style={{ marginRight: 8 }}
      />
      <Text
        style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  // Profile Tab Content
  const ProfileTabContent = () => (
    <View style={styles.tabContent}>
      {/* User Info Section */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account"
            size={20}
            color="#10B981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sectionTitle}>User Information k</Text>
        </View>

        {console.log({
          fff: foundermember,
        })}

        <View style={styles.infoRow}>
          <RegularFontText data="Phone Number" textstyle={styles.infoLabel} />
          <MediumFontText
            data={foundermember?.phonenumber || "N/A"}
            textstyle={styles.infoValue}
          />
        </View>

        {!getuserclanInfo?.data?.settings?.allowMembersToEditProfile && (
          <View style={styles.infoRow}>
            <RegularFontText data="Home Address" textstyle={styles.infoLabel} />
            <MediumFontText
              data={foundermember?.homeAddress || "N/A"}
              textstyle={styles.infoValue}
            />
          </View>
        )}

        <View style={styles.infoRow}>
          <RegularFontText data="Member Code" textstyle={styles.infoLabel} />
          <MediumFontText
            data={foundermember?.memberCode || "N/A"}
            textstyle={styles.infoValue}
          />
        </View>
      </View>

      {/* QR Code Section */}
      {userProfile_data?.user?.isGuest !== true && (
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="qrcode"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>QR Code</Text>
          </View>

          <View style={styles.qrCodeContainer}>
            {foundermember?.memberCode && (
              <QRCode
                value={foundermember?.memberCode}
                size={200}
                color="black"
                backgroundColor="white"
              />
            )}
          </View>
        </View>
      )}
    </View>
  );

  // Household Tab Content
  const HouseholdTabContent = () => {
    if (isLoadingHousehold) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading household data...</Text>
        </View>
      );
    }

    if (householdError || !householdData?.data) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="home-alert" size={48} color="#9CA3AF" />
          <Text style={styles.emptyText}>No household data available</Text>
        </View>
      );
    }

    const household = householdData.data;

    return (
      <View style={styles.tabContent}>
        {/* Household Info Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="home"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Household Details</Text>
          </View>

          <View style={styles.infoRow}>
            <RegularFontText
              data="Household Name"
              textstyle={styles.infoLabel}
            />
            <MediumFontText
              data={household.name || "N/A"}
              textstyle={styles.infoValue}
            />
          </View>

          <View style={styles.infoRow}>
            <RegularFontText data="Type" textstyle={styles.infoLabel} />
            <MediumFontText
              data={household.type || "N/A"}
              textstyle={styles.infoValue}
            />
          </View>

          {household.description && (
            <View style={styles.infoRow}>
              <RegularFontText
                data="Description"
                textstyle={styles.infoLabel}
              />
              <MediumFontText
                data={household.description}
                textstyle={styles.infoValue}
              />
            </View>
          )}

          <View style={styles.infoRow}>
            <RegularFontText data="Address" textstyle={styles.infoLabel} />
            <MediumFontText
              data={household.address || "N/A"}
              textstyle={styles.infoValue}
            />
          </View>
        </View>

        {/* Estate/Clan Info Section */}
        {householdData.clanInfo && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="office-building"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Estate Information</Text>
            </View>

            <View style={styles.infoRow}>
              <RegularFontText
                data="Estate Name"
                textstyle={styles.infoLabel}
              />
              <MediumFontText
                data={householdData.clanInfo.name || "N/A"}
                textstyle={styles.infoValue}
              />
            </View>

            <View style={styles.infoRow}>
              <RegularFontText
                data="Estate Address"
                textstyle={styles.infoLabel}
              />
              <MediumFontText
                data={householdData.clanInfo.address || "N/A"}
                textstyle={styles.infoValue}
              />
            </View>

            <View style={styles.infoRow}>
              <RegularFontText data="Contact" textstyle={styles.infoLabel} />
              <MediumFontText
                data={householdData.clanInfo.phonenumber || "N/A"}
                textstyle={styles.infoValue}
              />
            </View>
          </View>
        )}

        {/* Household Members Section */}
        {household.members && household.members.length > 0 && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-group"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Household Members</Text>
            </View>

            {household.members.map((member, index) => (
              <View key={member._id || index} style={styles.memberCard}>
                <View style={styles.memberIconContainer}>
                  <MaterialCommunityIcons
                    name="account"
                    size={24}
                    color="#10B981"
                  />
                </View>
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {member.user?.firstName} {member.user?.lastName}
                  </Text>
                  <Text style={styles.memberEmail}>{member.user?.email}</Text>
                  <Text style={styles.memberDate}>
                    Joined: {new Date(member.joinedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: userProfile_data?.photo,
            }}
            style={styles.profileImage}
          />

          <View style={styles.profileInfo}>
            <SemiBoldFontText
              data={userProfile_data?.user?.name}
              textstyle={styles.profileName}
            />
            <MediumFontText
              data={userProfile_data?.user?.email}
              textstyle={styles.profileEmail}
            />
          </View>
        </View>
      </View>

      {/* Tab Buttons - Only show if user is a clan member */}
      {isClanMember && (
        <View style={styles.tabContainer}>
          <TabButton
            title="Profile"
            icon="account"
            isActive={activeTab === "profile"}
            onPress={() => setActiveTab("profile")}
          />
          <TabButton
            title="Household"
            icon="home"
            isActive={activeTab === "household"}
            onPress={() => setActiveTab("household")}
          />
        </View>
      )}

      {/* Tab Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "profile" ? (
          <ProfileTabContent />
        ) : (
          <HouseholdTabContent />
        )}
      </ScrollView>

      {/* Modal (keeping existing modal) */}
      <Modal transparent={true} animationType="slide" visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <MediumFontText
                  data={
                    item?.status === "approved" ? "Ban User" : "Reinstate User"
                  }
                  textstyle={styles.modalTitle}
                />
              </View>

              <RegularFontText
                data={
                  item?.status === "approved"
                    ? "Banning this user will suspend their account indefinitely, preventing further access to the system."
                    : "Reinstating this user will reactivate their account, allowing them to access the system"
                }
                textstyle={styles.modalDescription}
              />

              {item?.status === "approved" ? (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonDanger}
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
                      textstyle={styles.modalButtonText}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalButtonPrimary}
                    onPress={toggleModal}
                  >
                    <RegularFontText
                      data="Cancel"
                      textstyle={styles.modalButtonTextWhite}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalButtonOutline}
                    onPress={toggleModal}
                  >
                    <RegularFontText
                      data="Cancel"
                      textstyle={styles.modalButtonTextGreen}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalButtonPrimary}
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
                      textstyle={styles.modalButtonTextWhite}
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

  const userIdToFind = userProfile_data?.user?._id;
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString(),
  );

  const {
    data: getuserclanInfo,
    isLoading: isloadinggetuserclanInfo,
    error: iserrorgetuserclanInfo,
  } = useFetchData(
    `clan/${userProfile_data?.currentClanMeeting?._id}`,
    "getuserclans",
  );

  const {
    data: getuserinfo,
    isLoading: isloadinggetuserinfo,
    error: iserrorgetuserinfo,
  } = useFetchData(`api/v1/general/UserProfile`, "getuserinfo");

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, []);

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

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
        text1: " successfully ",
      });
      dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
      setIsModalVisible(!isModalVisible);
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
    },
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.profileHeader}>
          <Image
            source={{
              uri: userProfile_data?.photo,
            }}
            style={styles.profileImage}
          />

          <View style={styles.profileInfo}>
            <SemiBoldFontText
              data={userProfile_data?.user?.name}
              textstyle={styles.profileName}
            />
            <MediumFontText
              data={userProfile_data?.user?.email}
              textstyle={styles.profileEmail}
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>User Information</Text>
            </View>

            <View style={styles.infoRow}>
              <RegularFontText
                data="Phone Number"
                textstyle={styles.infoLabel}
              />
              <MediumFontText
                data={getuserinfo?.user?.phoneNumber || ""}
                textstyle={styles.infoValue}
              />
            </View>

            <View style={styles.infoRow}>
              <RegularFontText
                data="Home Address"
                textstyle={styles.infoLabel}
              />
              <MediumFontText
                data={`${getuserinfo?.user?.address?.street || ""}${
                  getuserinfo?.user?.address?.street ? ", " : ""
                }${getuserinfo?.user?.address?.city || ""}${
                  getuserinfo?.user?.address?.city ? ", " : ""
                }${getuserinfo?.user?.address?.state || ""}`}
                textstyle={styles.infoValue}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function ViewProfile({ navigation }) {
  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);
  const { userDatav2 } = useSelector((state) => state?.authSlice);

  return (
    <ScreenWrapper
      title="Personal Info"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {userDatav2?.data?.isInClan ? (
          <ViewProfile_main />
        ) : (
          <GeneralViewProfile />
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#10B981",
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
  },
  tabButtonActive: {
    backgroundColor: "#D1FAE5",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  tabButtonTextActive: {
    color: "#10B981",
    fontWeight: "700",
  },
  tabContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
  },
  qrCodeContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  memberCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginBottom: 12,
  },
  memberIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  memberEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 2,
  },
  memberDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
    letterSpacing: 0.3,
  },
  modalDescription: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButtonDanger: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonPrimary: {
    flex: 1,
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonOutline: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
    letterSpacing: 0.3,
  },
  modalButtonTextWhite: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  modalButtonTextGreen: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },
});
