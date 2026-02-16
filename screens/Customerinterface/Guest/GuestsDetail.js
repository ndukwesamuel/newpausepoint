import AppScreen from "../../../components/shared/AppScreen";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
} from "react-native";

import * as Clipboard from "expo-clipboard";
import React, { useEffect, useRef, useState } from "react";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  MaterialIcons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import { useMutation } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Get_All_User_Guest_Fun,
  Get__User_Guest_detail_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import * as Sharing from "expo-sharing";

import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";

const GuestsDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  const { itemdata } = route.params;

  const { get_user_guest_detail_data } = useSelector(
    (state) => state?.GuestSlice,
  );

  const { user_data } = useSelector((state) => state.AuthSlice);

  const [qrCodeValue, setQRCodeValue] = useState("");
  const viewShotRef = useRef();

  // Departure Mutation
  const setDepartureRequest = async (data) => {
    let url = `${API_BASEURL}api/v1/guest/modify`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };
    return axios.patch(url, data, config);
  };

  const Set_Departure_Mutation = useMutation({
    mutationFn: setDepartureRequest,
    onSuccess: (response) => {
      Toast.show({
        type: "success",
        text1: "Guest marked as departed",
      });
      dispatch(Get__User_Guest_detail_Fun(itemdata?._id));
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to update status";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });

  // Cancel Mutation
  const cancelGuestRequest = async () => {
    let url = `${API_BASEURL}visitor/cancel/${get_user_guest_detail_data?.invitation?._id}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };
    return axios.post(url, {}, config);
  };

  const Cancle_Guests_Mutation = useMutation({
    mutationFn: cancelGuestRequest,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Visitor cancelled successfully",
      });
      dispatch(Get_All_User_Guest_Fun());
      navigation.goBack();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message || "Failed to cancel visitor";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });

  useEffect(() => {
    dispatch(Get__User_Guest_detail_Fun(itemdata?._id));
  }, [dispatch, itemdata?._id]);

  const copyAndShareAccessCode = async (accessCode) => {
    const message = `Hi,\n\nHere is your one-time access code: ${accessCode}\n\nPowered by Pausepoint.net.`;

    await Clipboard.setStringAsync(message);
    Toast.show({
      type: "success",
      text1: "Access code copied!",
    });

    try {
      await Share.share({ message: message });
    } catch (error) {
      console.error("Error sharing:", error.message);
    }
  };

  const captureAndShare = async () => {
    try {
      const uri = await captureQRCodeAsImage();
      await Sharing.shareAsync(uri, {
        dialogTitle: "Share QR Code",
        mimeType: "image/png",
      });
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to share QR code" });
    }
  };

  const captureQRCodeAsImage = async () => {
    try {
      if (!viewShotRef.current) throw new Error("ViewShot ref is null");
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch (error) {
      throw new Error("Error capturing QR code");
    }
  };

  const handleDeparture = () => {
    Alert.alert("Mark as Departed", "Are you sure the guest has departed?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Departed",
        onPress: () => {
          const data = {
            invitationId: get_user_guest_detail_data.invitation._id,
            status: "departed",
          };
          Set_Departure_Mutation.mutate(data);
        },
      },
    ]);
  };

  const handleCancelGuest = () => {
    Alert.alert(
      "Cancel Invitation",
      "Are you sure you want to cancel this invitation?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () => Cancle_Guests_Mutation.mutate(),
        },
      ],
    );
  };

  const handleOpenQrcodeModal = () => {
    const invitation = get_user_guest_detail_data?.invitation;
    if (!invitation) {
      Toast.show({ type: "error", text1: "Invitation data not loaded" });
      return;
    }
    const jsonString = JSON.stringify({
      code: invitation.access_code,
      name: invitation.visitor_name,
      expires: invitation.expires,
    });
    setQRCodeValue(jsonString);
    setModalVisible(true);
  };

  const invitation = get_user_guest_detail_data?.invitation;
  const statusColor =
    invitation?.status === "arrived"
      ? "#10B981"
      : invitation?.status === "departed"
        ? "#6B7280"
        : "#F59E0B";

  return (
    <AppScreen>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Header Card */}
          <View style={styles.headerCard}>
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="account-details"
                size={32}
                color="#10B981"
              />
            </View>
            <Text style={styles.headerTitle}>Guest Details</Text>
            <Text style={styles.headerSubtitle}>
              Invitation for {invitation?.visitor_name}
            </Text>
          </View>

          {/* Status Card */}
          <View style={styles.statusCard}>
            <View style={styles.statusRow}>
              <View style={styles.statusIconContainer}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={20}
                  color={statusColor}
                />
              </View>
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusLabel}>Current Status</Text>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: `${statusColor}15` },
                  ]}
                >
                  <Text
                    style={[styles.statusBadgeText, { color: statusColor }]}
                  >
                    {invitation?.status?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Personal Information Card */}
          <View style={styles.infoCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            <InfoRow
              icon="account-circle"
              label="Visitor Name"
              value={invitation?.visitor_name}
            />
            <InfoRow
              icon="gender-male-female"
              label="Gender"
              value={invitation?.gender}
            />
            <InfoRow
              icon="phone"
              label="Phone Number"
              value={invitation?.phone_number}
            />
          </View>

          {/* Access Code Card */}
          <View style={styles.accessCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="key-variant"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Access Code</Text>
            </View>

            <View style={styles.accessCodeContainer}>
              <View style={styles.accessCodeBox}>
                <Text style={styles.accessCodeText}>
                  {invitation?.access_code}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => copyAndShareAccessCode(invitation?.access_code)}
              >
                <MaterialCommunityIcons
                  name="share-variant"
                  size={24}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.accessCodeHint}>
              Tap the share icon to copy and send the access code
            </Text>
          </View>

          {/* Timeline Card */}
          <View style={styles.timelineCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Timeline</Text>
            </View>

            <TimelineItem
              icon="calendar-check"
              label="Arrived"
              value={formatDateandTime(invitation?.arrived_at) || "Not yet"}
              color="#10B981"
            />

            <View style={{}}>
              <TimelineItem
                icon="calendar-remove"
                label="Departed"
                value={formatDateandTime(invitation?.departed_at) || "Not yet"}
                color="#6B7280"
              />

              {!invitation?.departed_at && invitation?.status === "arrived" && (
                <TouchableOpacity
                  style={styles.departureButton}
                  onPress={handleDeparture}
                  disabled={Set_Departure_Mutation.isPending}
                >
                  {Set_Departure_Mutation.isPending ? (
                    <ActivityIndicator size="small" color="#10B981" />
                  ) : (
                    <>
                      <FontAwesome5
                        name="plane-departure"
                        size={16}
                        color="#10B981"
                      />
                      <Text style={styles.departureButtonText}>
                        Mark Departed
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}
            </View>

            <TimelineItem
              icon="calendar-clock"
              label="Expires"
              value={formatDateandTime(invitation?.expires) || "N/A"}
              color="#F59E0B"
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.qrButton}
              onPress={handleOpenQrcodeModal}
            >
              <MaterialCommunityIcons name="qrcode" size={24} color="#FFFFFF" />
              <Text style={styles.qrButtonText}>View QR Code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancelGuest}
              disabled={Cancle_Guests_Mutation.isPending}
            >
              {Cancle_Guests_Mutation.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="cancel"
                    size={24}
                    color="#FFFFFF"
                  />
                  <Text style={styles.cancelButtonText}>Cancel Invitation</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Edit Button */}
      <View style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate("inviteguest", { itemdata })}
        >
          <MaterialIcons name="edit" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* QR Code Modal */}
      <CenterReuseModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Guest QR Code</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialCommunityIcons
                name="close-circle"
                size={28}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {qrCodeValue !== "" && (
            <View style={styles.qrWrapper}>
              <ViewShot
                ref={viewShotRef}
                options={{ format: "png", quality: 1.0 }}
                style={styles.qrViewShot}
              >
                <QRCode
                  value={qrCodeValue}
                  size={220}
                  color="#111827"
                  backgroundColor="white"
                />
              </ViewShot>
              <Text style={styles.qrInstruction}>
                Scan this code at the security gate
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.shareQrButton}
            onPress={captureAndShare}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.shareQrButtonText}>Share QR Code</Text>
          </TouchableOpacity>
        </View>
      </CenterReuseModals>
    </AppScreen>
  );
};

// Helper Components
const InfoRow = ({ icon, label, value }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconContainer}>
      <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
    </View>
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    </View>
  </View>
);

const TimelineItem = ({ icon, label, value, color }) => (
  <View style={styles.timelineItem}>
    <View
      style={[styles.timelineIconContainer, { backgroundColor: `${color}15` }]}
    >
      <MaterialCommunityIcons name={icon} size={20} color={color} />
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={styles.timelineValue}>{value}</Text>
    </View>
  </View>
);

export default GuestsDetail;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },

  // Status Card
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Section Card Common Styles
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  timelineCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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

  // Info Row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },

  // Access Code
  accessCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  accessCodeBox: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    borderStyle: "dashed",
  },
  accessCodeText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 2,
    textAlign: "center",
  },
  shareButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  accessCodeHint: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
  },

  // Timeline
  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  timelineIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  timelineValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  departureContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // justifyContent: "space-between",
  },
  departureButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  departureButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
  },

  // Action Buttons
  actionSection: {
    gap: 12,
    marginTop: 8,
  },
  qrButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  cancelButton: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#DC2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // FAB
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  // Modal
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  qrWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  qrViewShot: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  qrInstruction: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    lineHeight: 18,
  },
  shareQrButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareQrButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
