

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import TheScan from "../TheScan";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
import { formatDateandTime } from "../../../utils/DateTime";

const STATUS_CONFIG = {
  pending:   { bg: "#FEF3C7", text: "#92400E", label: "Pending", icon: "clock-outline" },
  arrived:   { bg: "#D1FAE5", text: "#065F46", label: "Arrived", icon: "check-circle" },
  departed:  { bg: "#F3F4F6", text: "#374151", label: "Departed", icon: "exit-run" },
};

const AdminGuests = () => {
  const navigation = useNavigation();
  const [codeInput, setCodeInput] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [detailVisible, setDetailVisible] = useState(false);
  const [scanModalVisible, setScanModalVisible] = useState(false);

  const {
    data: lookupData,
    isLoading: isLookingUp,
    isError: isLookupError,
    error: lookupError,
    refetch: refetchLookup,
  } = useFetchData_v2(
    `api/v1/visitor/estateadmin/lookup?code=${encodeURIComponent(searchedCode)}`,
    `admin-guest-lookup-${searchedCode}`,
    { enabled: !!searchedCode },
  );

  const guestData = lookupData?.invitation;

  const visitorMutation = useMutateData_v2(
    "api/v1/visitor/estateadmin",
    "POST",
    undefined,
    {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: data?.message || "Status updated!",
        });
        refetchLookup();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Something went wrong",
        });
      },
    },
  );

  const handleSubmitCode = () => {
    const code = codeInput.trim();
    if (!code) return;

    if (code === searchedCode) {
      refetchLookup();
    } else {
      setSearchedCode(code);
    }
    setDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setDetailVisible(false);
  };

  const handleAction = () => {
    if (!guestData?.access_code) return;
    visitorMutation.mutate({ accessCode: guestData.access_code });
  };

  const status = guestData?.status || "pending";
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const isExpired = guestData?.expires
    ? new Date(guestData.expires) < new Date()
    : false;

  const getButtonConfig = () => {
    if (isExpired && status !== "arrived") {
      return { label: "Invitation Expired", icon: "calendar-remove", color: "#9CA3AF", disabled: true };
    }
    if (status === "departed") {
      return { label: "Visitor Departed", icon: "check-circle", color: "#9CA3AF", disabled: true };
    }
    if (status === "arrived") {
      return { label: "Mark as Departed", icon: "exit-run", color: "#DC2626", disabled: false };
    }
    return { label: "Confirm Visitor Arrived", icon: "account-check", color: "#10B981", disabled: false };
  };

  const buttonConfig = getButtonConfig();

  // ── Detail modal content ─────────────────────────────────────────────────
  const renderDetailContent = () => {
    if (isLookingUp) {
      return (
        <View style={styles.detailCentered}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Looking up code...</Text>
        </View>
      );
    }

    if (isLookupError || !guestData) {
      return (
        <View style={styles.detailCentered}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>
            {lookupError?.message || `No guest found for code "${searchedCode}"`}
          </Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <MaterialCommunityIcons name={statusInfo.icon} size={16} color={statusInfo.text} />
          <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
        </View>

        <Text style={styles.visitorName}>{guestData?.visitor_name}</Text>

        <View style={styles.detailsGrid}>
          <DetailItem
            icon="qrcode"
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
            label="Access Code"
            value={guestData?.access_code}
            mono
          />
          <DetailItem
            icon="phone"
            iconBg="#D1FAE5"
            iconColor="#10B981"
            label="Phone Number"
            value={guestData?.phone_number?.toString()}
          />
          <DetailItem
            icon="calendar-alert"
            iconBg="#EDE9FE"
            iconColor="#8B5CF6"
            label="Expires"
            value={`${formatDateandTime(guestData?.expires)}${isExpired ? " (Expired)" : ""}`}
            valueColor={isExpired ? "#DC2626" : undefined}
          />
        </View>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: buttonConfig.color },
            buttonConfig.disabled && styles.actionButtonDisabled,
          ]}
          onPress={handleAction}
          disabled={buttonConfig.disabled || visitorMutation.isPending}
        >
          {visitorMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name={buttonConfig.icon} size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>{buttonConfig.label}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper
      title="Estate Guests"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <View style={styles.wrapper}>
        {/* ── Access code entry + QR row ──────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialCommunityIcons name="key-variant" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Enter guest's full access code"
              placeholderTextColor="#9CA3AF"
              value={codeInput}
              onChangeText={setCodeInput}
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={handleSubmitCode}
            />
            {codeInput.length > 0 && (
              <TouchableOpacity onPress={() => setCodeInput("")}>
                <MaterialIcons name="close" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={handleSubmitCode}
            disabled={!codeInput.trim()}
          >
            <MaterialIcons name="search" size={22} color={codeInput.trim() ? "#10B981" : "#D1D5DB"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setScanModalVisible(true)}
          >
            <Image
              source={require("../../../assets/qrcode.png")}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        </View>

        {/* ── Prompt ───────────────────────────────────────────────────── */}
        <View style={styles.centered}>
          <MaterialCommunityIcons name="key-variant" size={48} color="#D1D5DB" />
          <Text style={styles.emptyText}>
            Enter a guest's full access code and search to view their details
          </Text>
        </View>
      </View>

      {/* ── QR Scanner Modal ─────────────────────────────────────────────── */}
      <CenterReuseModals
        visible={scanModalVisible}
        onClose={() => setScanModalVisible(false)}
      >
        <View style={styles.qrModal}>
          <View style={styles.qrModalHeader}>
            <Text style={styles.qrModalTitle}>Scan QR Code </Text>
            <TouchableOpacity onPress={() => setScanModalVisible(false)}>
              <MaterialIcons name="cancel" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <TheScan />
        </View>
      </CenterReuseModals>

      {/* ── Guest Detail Popup ───────────────────────────────────────────── */}
      <CenterReuseModals visible={detailVisible} onClose={handleCloseDetail}>
        <View style={styles.detailModal}>
          <View style={styles.qrModalHeader}>
            <Text style={styles.qrModalTitle}>Guest Details</Text>
            <TouchableOpacity onPress={handleCloseDetail}>
              <MaterialIcons name="cancel" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          {renderDetailContent()}
        </View>
      </CenterReuseModals>
    </ScreenWrapper>
  );
};

// ─── Detail item ──────────────────────────────────────────────────────────────
const DetailItem = ({ icon, iconBg, iconColor, label, value, mono, valueColor }) => (
  <View style={styles.detailItem}>
    <View style={[styles.detailIcon, { backgroundColor: iconBg }]}>
      <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          mono && styles.monoValue,
          valueColor && { color: valueColor },
        ]}
      >
        {value || "N/A"}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Search ──
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
  },
  qrButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── States ──
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
  },
  emptyText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },

  // ── QR Modal ──
  qrModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    height: "80%",
  },
  qrModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  // ── Detail Modal ──
  detailModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
  },
  detailCentered: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  statusText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  visitorName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  detailsGrid: { gap: 14, marginBottom: 20 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  monoValue: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 14,
    borderRadius: 14,
  },
  actionButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default AdminGuests;
