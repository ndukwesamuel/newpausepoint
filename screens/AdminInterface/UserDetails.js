// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   Modal,
//   TouchableWithoutFeedback,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import { useRoute } from "@react-navigation/native";
// import { useDispatch, useSelector } from "react-redux";
// import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import { useMutation } from "@tanstack/react-query";
// import Toast from "react-native-toast-message";
// import axios from "axios";
// import ScreenWrapper from "../../components/shared/ScreenWrapper";
// import {
//   Admin_Get_Single_Clan_Memeber_Fun,
//   Get_Single_clan,
// } from "../../Redux/UserSide/ClanSlice";
// import { Admin_Get_Single_User_Fun } from "../../Redux/Admin/UserSlice";
// import { useNavigation } from "@react-navigation/native";

// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// const STATUS_CONFIG = {
//   approved: { bg: "#DCFCE7", text: "#166534", label: "Approved" },
//   pending: { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
//   suspended: { bg: "#FEE2E2", text: "#991B1B", label: "Suspended" },
//   rejected: { bg: "#F3F4F6", text: "#374151", label: "Rejected" },
// };

// export default function UserDetails() {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const route = useRoute();
//   // const { item } = route.params;

//   let item = "OPERA1-AAAA-0001";

//   const [confirmModalVisible, setConfirmModalVisible] = useState(false);

//   const { get_user_profile_data } = useSelector(
//     (state) => state?.UserProfileSlice,
//   );
//   const { admin_get_single_clan_memeber_data } = useSelector(
//     (state) => state?.ClanSlice,
//   );

//   useEffect(() => {
//     if (item) {
//       dispatch(Admin_Get_Single_User_Fun(item));
//       // item.user is just an ID string based on actual data
//       const userId = item?.user?._id || item?.user;
//       if (userId) {
//         dispatch(Admin_Get_Single_Clan_Memeber_Fun(userId));
//       }
//     }
//   }, [item, dispatch]);

//   // ── Member data ───────────────────────────────────────────────────────────
//   const member = admin_get_single_clan_memeber_data?.data?.member;
//   const userProfile = admin_get_single_clan_memeber_data?.data?.userProfile;
//   const isLoading = !admin_get_single_clan_memeber_data;

//   const status = member?.status || item?.status || "pending";
//   const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

//   const isApproved = status === "approved";
//   const nextStatus = isApproved ? "suspended" : "approved";
//   const memberId =
//     member?.user?._id || member?.user || item?.user?._id || item?.user;

//   // ── Approve/suspend mutation ──────────────────────────────────────────────
//   const ApproveMember_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       return axios.post(
//         `${API_BASEURL}clan/EstateAdminsapproveMembership`,
//         data_info,
//         { headers: { "Content-Type": "application/json" } },
//       );
//     },
//     onSuccess: () => {
//       Toast.show({
//         type: "success",
//         text1: isApproved
//           ? "User suspended successfully"
//           : "User reinstated successfully",
//       });
//       const adminClanId =
//         get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ||
//         get_user_profile_data?.data?.AdmincurrentClanMeeting;
//       if (adminClanId) dispatch(Get_Single_clan(adminClanId));
//       const userId = item?.user?._id || item?.user;
//       if (userId) dispatch(Admin_Get_Single_Clan_Memeber_Fun(userId));
//       setConfirmModalVisible(false);
//     },
//     onError: (error) => {
//       Toast.show({
//         type: "error",
//         text1: error?.response?.data?.message || "Error updating status",
//       });
//     },
//   });

//   const handleConfirm = () => {
//     if (!memberId) {
//       Toast.show({ type: "error", text1: "Missing member ID" });
//       return;
//     }
//     const adminClanId =
//       get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ||
//       get_user_profile_data?.data?.AdmincurrentClanMeeting;

//     ApproveMember_Mutation.mutate({
//       clanId: adminClanId,
//       memberId,
//       approvalStatus: nextStatus,
//     });
//   };

//   // ── Loading state ─────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <ScreenWrapper
//         title="Member Details"
//         navigation={navigation}
//         headerStyle={{ backgroundColor: "white" }}
//       >
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color="#10B981" />
//           <Text style={styles.loadingText}>Loading member details...</Text>
//         </View>
//       </ScreenWrapper>
//     );
//   }

//   const displayName = member?.user?.name || item?.user?.name || "Unknown";

//   const displayEmail = member?.user?.email || item?.user?.email || "";

//   const displayPhoto =
//     userProfile?.photo ||
//     "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg";

//   return (
//     <ScreenWrapper
//       title="Member Details"
//       navigation={navigation}
//       headerStyle={{ backgroundColor: "white" }}
//     >
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* ── Profile card ──────────────────────────────────────────────── */}
//         <View style={styles.profileCard}>
//           <Image source={{ uri: displayPhoto }} style={styles.avatar} />
//           <View style={styles.profileInfo}>
//             <Text style={styles.profileName}>{displayName}</Text>
//             {displayEmail ? (
//               <Text style={styles.profileEmail}>{displayEmail}</Text>
//             ) : null}
//             <View
//               style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
//             >
//               <Text style={[styles.statusText, { color: statusConfig.text }]}>
//                 {statusConfig.label}
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* ── Member code ───────────────────────────────────────────────── */}
//         {(member?.memberCode || item?.memberCode) && (
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <MaterialCommunityIcons
//                 name="identifier"
//                 size={18}
//                 color="#10B981"
//               />
//               <Text style={styles.cardTitle}>Member Code</Text>
//             </View>
//             <Text style={styles.memberCode}>
//               {member?.memberCode || item?.memberCode}
//             </Text>
//           </View>
//         )}

//         {/* ── Address info ──────────────────────────────────────────────── */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialCommunityIcons
//               name="home-map-marker"
//               size={18}
//               color="#10B981"
//             />
//             <Text style={styles.cardTitle}>Address Information</Text>
//           </View>

//           <InfoRow
//             label="Street"
//             value={
//               member?.street || item?.street || userProfile?.address?.street
//             }
//           />
//           <InfoRow
//             label="House Number"
//             value={member?.houseNumber || item?.houseNumber}
//           />
//           <InfoRow
//             label="Unit Number"
//             value={member?.unitNumber || item?.unitNumber}
//           />
//           <InfoRow
//             label="Apartment Type"
//             value={member?.apartmentType || item?.apartmentType}
//           />
//           <InfoRow label="City" value={userProfile?.address?.city} last />
//         </View>

//         {/* ── Contact info ──────────────────────────────────────────────── */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialCommunityIcons
//               name="phone-outline"
//               size={18}
//               color="#10B981"
//             />
//             <Text style={styles.cardTitle}>Contact</Text>
//           </View>
//           <InfoRow
//             label="Phone Number"
//             value={userProfile?.phoneNumber || member?.phonenumber}
//             last
//           />
//         </View>

//         {/* ── Action button ─────────────────────────────────────────────── */}
//         <TouchableOpacity
//           style={[
//             styles.actionButton,
//             { backgroundColor: isApproved ? "#FEE2E2" : "#DCFCE7" },
//           ]}
//           onPress={() => setConfirmModalVisible(true)}
//           disabled={ApproveMember_Mutation.isPending}
//         >
//           {ApproveMember_Mutation.isPending ? (
//             <ActivityIndicator
//               size="small"
//               color={isApproved ? "#DC2626" : "#16A34A"}
//             />
//           ) : (
//             <>
//               <MaterialCommunityIcons
//                 name={isApproved ? "account-cancel" : "account-check"}
//                 size={20}
//                 color={isApproved ? "#DC2626" : "#16A34A"}
//               />
//               <Text
//                 style={[
//                   styles.actionButtonText,
//                   { color: isApproved ? "#DC2626" : "#16A34A" },
//                 ]}
//               >
//                 {isApproved ? "Suspend Member" : "Reinstate Member"}
//               </Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </ScrollView>

//       {/* ── Confirm modal ─────────────────────────────────────────────────── */}
//       <Modal
//         transparent
//         animationType="slide"
//         visible={confirmModalVisible}
//         onRequestClose={() => setConfirmModalVisible(false)}
//       >
//         <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
//           <View style={styles.modalOverlay}>
//             <TouchableWithoutFeedback>
//               <View style={styles.modalContainer}>
//                 {/* Header */}
//                 <View style={styles.modalHeader}>
//                   <MaterialCommunityIcons
//                     name={isApproved ? "account-cancel" : "account-check"}
//                     size={24}
//                     color={isApproved ? "#DC2626" : "#16A34A"}
//                   />
//                   <Text style={styles.modalTitle}>
//                     {isApproved ? "Suspend Member" : "Reinstate Member"}
//                   </Text>
//                 </View>

//                 {/* Description */}
//                 <Text style={styles.modalDescription}>
//                   {isApproved
//                     ? `Are you sure you want to suspend ${displayName}? They will lose access to the estate.`
//                     : `Are you sure you want to reinstate ${displayName}? They will regain access to the estate.`}
//                 </Text>

//                 {/* Buttons */}
//                 <View style={styles.modalButtons}>
//                   <TouchableOpacity
//                     style={styles.cancelButton}
//                     onPress={() => setConfirmModalVisible(false)}
//                     disabled={ApproveMember_Mutation.isPending}
//                   >
//                     <Text style={styles.cancelButtonText}>Cancel</Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={[
//                       styles.confirmButton,
//                       {
//                         backgroundColor: isApproved ? "#DC2626" : "#16A34A",
//                         opacity: ApproveMember_Mutation.isPending ? 0.6 : 1,
//                       },
//                     ]}
//                     onPress={handleConfirm}
//                     disabled={ApproveMember_Mutation.isPending}
//                   >
//                     {ApproveMember_Mutation.isPending ? (
//                       <ActivityIndicator size="small" color="#fff" />
//                     ) : (
//                       <Text style={styles.confirmButtonText}>
//                         {isApproved ? "Yes, Suspend" : "Yes, Reinstate"}
//                       </Text>
//                     )}
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </TouchableWithoutFeedback>
//           </View>
//         </TouchableWithoutFeedback>
//       </Modal>
//     </ScreenWrapper>
//   );
// }

// // ─── Info row ─────────────────────────────────────────────────────────────────
// const InfoRow = ({ label, value, last }) => {
//   if (!value) return null;
//   return (
//     <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
//       <Text style={styles.infoLabel}>{label}</Text>
//       <Text style={styles.infoValue}>{value}</Text>
//     </View>
//   );
// };

// // ─── Styles ───────────────────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   loadingText: {
//     marginTop: 12,
//     color: "#6B7280",
//     fontSize: 14,
//   },

//   // ── Profile card ──
//   profileCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   avatar: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 2,
//     borderColor: "#10B981",
//   },
//   profileInfo: {
//     flex: 1,
//     gap: 4,
//   },
//   profileName: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   profileEmail: {
//     fontSize: 13,
//     color: "#6B7280",
//   },
//   statusBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 20,
//     marginTop: 4,
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: "600",
//   },

//   // ── Cards ──
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 8,
//     marginBottom: 14,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cardTitle: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#1F2937",
//   },
//   memberCode: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#10B981",
//     letterSpacing: 1,
//   },

//   // ── Info row ──
//   infoRow: {
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   infoLabel: {
//     fontSize: 11,
//     color: "#9CA3AF",
//     textTransform: "uppercase",
//     letterSpacing: 0.5,
//     marginBottom: 3,
//   },
//   infoValue: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#111827",
//   },

//   // ── Action button ──
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 14,
//     paddingVertical: 16,
//     gap: 8,
//     marginTop: 4,
//   },
//   actionButtonText: {
//     fontSize: 15,
//     fontWeight: "700",
//   },

//   // ── Modal ──
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     paddingBottom: 40,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     marginBottom: 14,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: "#6B7280",
//     lineHeight: 22,
//     marginBottom: 24,
//   },
//   modalButtons: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   cancelButton: {
//     flex: 1,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   cancelButtonText: {
//     fontSize: 15,
//     fontWeight: "600",
//     color: "#6B7280",
//   },
//   confirmButton: {
//     flex: 1,
//     borderRadius: 12,
//     paddingVertical: 14,
//     alignItems: "center",
//   },
//   confirmButtonText: {
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#fff",
//   },
// });

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { useFetchData_v2, useMutateData_v2 } from "../../hooks/Requestv2";

const STATUS_CONFIG = {
  approved: { bg: "#DCFCE7", text: "#166534", label: "Approved" },
  pending: { bg: "#FEF3C7", text: "#92400E", label: "Pending" },
  suspended: { bg: "#FEE2E2", text: "#991B1B", label: "Suspended" },
  rejected: { bg: "#F3F4F6", text: "#374151", label: "Rejected" },
};

export default function UserDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  // let item = "OPERA1-AAAA-0001";

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  // ── Get member code from item ─────────────────────────────────────────────
  // item can be a member object with memberCode or just a memberCode string
  const memberCode = item?.memberCode || item;

  // ── Get clan ID from admin profile ────────────────────────────────────────
  const adminClanId =
    get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ||
    get_user_profile_data?.data?.AdmincurrentClanMeeting;

  // ── Fetch member details from new endpoint ────────────────────────────────
  const {
    data: memberResponse,
    isLoading,
    isError,
    refetch,
  } = useFetchData_v2(
    `api/v1/clan/estate/getUserByMemberCode/${memberCode}`,
    `member-${memberCode}`,
    { enabled: !!memberCode },
  );

  const memberData = memberResponse?.data;
  const member = memberData?.member;
  const user = memberData?.user;
  const profile = memberData?.profile;

  // ── Status ────────────────────────────────────────────────────────────────
  const status = member?.status || "pending";
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const isApproved = status === "approved";
  const nextStatus = isApproved ? "suspended" : "approved";
  const memberId = user?._id;

  // ── Approve/suspend mutation ──────────────────────────────────────────────
  const { mutate: updateMemberStatus, isPending: isUpdating } =
    useMutateData_v2(
      "api/v1/clan/EstateAdminsapproveMembership",
      "POST",
      `member-${memberCode}`,
    );

  const handleConfirm = () => {
    if (!memberId || !adminClanId) {
      Toast.show({ type: "error", text1: "Missing required information" });
      return;
    }

    updateMemberStatus(
      { clanId: adminClanId, memberId, approvalStatus: nextStatus },
      {
        onSuccess: () => {
          Toast.show({
            type: "success",
            text1: isApproved
              ? "Member suspended successfully"
              : "Member reinstated successfully",
          });
          refetch();
          setConfirmModalVisible(false);
        },
        onError: (error) => {
          Toast.show({
            type: "error",
            text1: error?.data?.message || "Error updating status",
          });
        },
      },
    );
  };

  // ── Display values ────────────────────────────────────────────────────────
  const displayName = user?.name || "Unknown";
  const displayEmail = user?.email || "";
  const displayPhoto =
    profile?.photo ||
    "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg";

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScreenWrapper
        title="Member Details"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading member details...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError || !memberData) {
    return (
      <ScreenWrapper
        title="Member Details"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.centered}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#EF4444"
          />
          <Text style={styles.errorText}>Failed to load member details</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      title="Member Details"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Profile card ─────────────────────────────────────────────── */}
        <View style={styles.profileCard}>
          <Image source={{ uri: displayPhoto }} style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{displayName}</Text>
            {displayEmail ? (
              <Text style={styles.profileEmail}>{displayEmail}</Text>
            ) : null}
            <View
              style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}
            >
              <Text style={[styles.statusText, { color: statusConfig.text }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Member code ──────────────────────────────────────────────── */}
        {member?.memberCode && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons
                name="identifier"
                size={18}
                color="#10B981"
              />
              <Text style={styles.cardTitle}>Member Code</Text>
            </View>
            <Text style={styles.memberCode}>{member.memberCode}</Text>
          </View>
        )}

        {/* ── Address info ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="home-map-marker"
              size={18}
              color="#10B981"
            />
            <Text style={styles.cardTitle}>Address Information</Text>
          </View>
          <InfoRow label="Home Address" value={member?.homeAddress} />
          <InfoRow
            label="Street"
            value={member?.street || profile?.address?.street}
          />
          <InfoRow label="House Number" value={member?.houseNumber} />
          <InfoRow label="Unit Number" value={member?.unitNumber} />
          <InfoRow label="Apartment Type" value={member?.apartmentType} />
          <InfoRow label="City" value={profile?.address?.city} last />
        </View>

        {/* ── Contact info ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={18}
              color="#10B981"
            />
            <Text style={styles.cardTitle}>Contact</Text>
          </View>
          <InfoRow
            label="Phone Number"
            value={profile?.phoneNumber || member?.phonenumber}
            last
          />
        </View>

        {/* ── Action button ─────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isApproved ? "#FEE2E2" : "#DCFCE7" },
          ]}
          onPress={() => setConfirmModalVisible(true)}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator
              size="small"
              color={isApproved ? "#DC2626" : "#16A34A"}
            />
          ) : (
            <>
              <MaterialCommunityIcons
                name={isApproved ? "account-cancel" : "account-check"}
                size={20}
                color={isApproved ? "#DC2626" : "#16A34A"}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  { color: isApproved ? "#DC2626" : "#16A34A" },
                ]}
              >
                {isApproved ? "Suspend Member" : "Reinstate Member"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ── Confirm modal ────────────────────────────────────────────────── */}
      <Modal
        transparent
        animationType="slide"
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setConfirmModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <MaterialCommunityIcons
                    name={isApproved ? "account-cancel" : "account-check"}
                    size={24}
                    color={isApproved ? "#DC2626" : "#16A34A"}
                  />
                  <Text style={styles.modalTitle}>
                    {isApproved ? "Suspend Member" : "Reinstate Member"}
                  </Text>
                </View>

                <Text style={styles.modalDescription}>
                  {isApproved
                    ? `Are you sure you want to suspend ${displayName}? They will lose access to the estate.`
                    : `Are you sure you want to reinstate ${displayName}? They will regain access to the estate.`}
                </Text>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setConfirmModalVisible(false)}
                    disabled={isUpdating}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      {
                        backgroundColor: isApproved ? "#DC2626" : "#16A34A",
                        opacity: isUpdating ? 0.6 : 1,
                      },
                    ]}
                    onPress={handleConfirm}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.confirmButtonText}>
                        {isApproved ? "Yes, Suspend" : "Yes, Reinstate"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenWrapper>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, last }) => {
  if (!value) return null;
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#F9FAFB" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#6B7280", fontSize: 14 },
  errorText: {
    color: "#EF4444",
    marginTop: 12,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#10B981",
  },
  profileInfo: { flex: 1, gap: 4 },
  profileName: { fontSize: 20, fontWeight: "700", color: "#111827" },
  profileEmail: { fontSize: 13, color: "#6B7280" },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  statusText: { fontSize: 12, fontWeight: "600" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1F2937" },
  memberCode: {
    fontSize: 22,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 1,
  },

  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  infoValue: { fontSize: 15, fontWeight: "600", color: "#111827" },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    paddingVertical: 16,
    gap: 8,
    marginTop: 4,
  },
  actionButtonText: { fontSize: 15, fontWeight: "700" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: { flexDirection: "row", gap: 12 },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 15, fontWeight: "600", color: "#6B7280" },
  confirmButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
