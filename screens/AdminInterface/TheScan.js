import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Button,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDateandTime } from "../../utils/DateTime";
import { useDispatch, useSelector } from "react-redux";
import {
  Admin_Get_All_Clan_Memeber_Fun,
  Get_Single_clan,
} from "../../Redux/UserSide/ClanSlice";

// ─── Detect QR code type ──────────────────────────────────────────────────────
// Member codes: LPC-AAAA-0001, CCE-AAAA-0435, OPERA1-AAAA-1003
// Guest codes: JSON string {"code":"321077","name":"Emeka","expires":"..."}
const isMemberCode = (data) => {
  return /^[A-Z0-9]+-[A-Z0-9]+-\d{3,6}$/.test(data.trim());
};

// ─── Main scanner ─────────────────────────────────────────────────────────────
export default function TheScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();

  const { get_Single_clan_data } = useSelector((state) => state?.ClanSlice);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  useEffect(() => {
    dispatch(Admin_Get_All_Clan_Memeber_Fun());

    // Try admin clan first, fall back to member clan
    const adminClanId =
      get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ||
      get_user_profile_data?.data?.AdmincurrentClanMeeting;

    if (adminClanId) {
      dispatch(Get_Single_clan(adminClanId));
    }
  }, []);

  // ── Members come from profile directly (already populated) ───────────────
  const clanMembers =
    get_user_profile_data?.data?.AdmincurrentClanMeeting?.members ||
    get_user_profile_data?.data?.currentClanMeeting?.members ||
    get_Single_clan_data?.data?.members ||
    [];

  const handleBarcodeScanned = ({ data }) => {
    if (scanned) return;
    setScanned(true);
    setScannedData(data);
    setModalVisible(true);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScannedData(null);
    setModalVisible(false);
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#10B981" />
        <Text style={styles.permissionText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons name="camera-off" size={48} color="#9CA3AF" />
        <Text style={styles.permissionText}>
          Camera permission is required to scan QR codes
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "code39", "ean13"],
        }}
      />

      {/* Scan frame */}
      {!scanned && (
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          <Text style={styles.scanHint}>Point camera at QR code</Text>
        </View>
      )}

      {/* Scan again */}
      {scanned && (
        <View style={styles.scanAgainContainer}>
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={handleScanAgain}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={18} color="#fff" />
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Result modal — slides up from bottom */}
      {modalVisible && scannedData && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleScanAgain}
            >
              <MaterialIcons name="cancel" size={24} color="#374151" />
            </TouchableOpacity>
            <Converter data={scannedData} clanMembers={clanMembers} />
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Converter ────────────────────────────────────────────────────────────────
const Converter = ({ data, clanMembers }) => {
  const navigation = useNavigation();

  // ── 1. Member QR ──────────────────────────────────────────────────────────
  if (isMemberCode(data)) {
    const foundMember = clanMembers.find(
      (member) => member.memberCode === data.trim(),
    );

    if (!foundMember) {
      return (
        <UnknownCode
          data={data}
          message="Member code not found in this estate"
        />
      );
    }

    return (
      <View>
        <View style={resultStyles.headerRow}>
          <View
            style={[resultStyles.typeBadge, { backgroundColor: "#DBEAFE" }]}
          >
            <MaterialCommunityIcons name="account" size={14} color="#1D4ED8" />
            <Text style={[resultStyles.typeBadgeText, { color: "#1D4ED8" }]}>
              Resident
            </Text>
          </View>
        </View>

        {console.log({
          dfffggg: foundMember,
        })}

        <InfoRow label="Resident Name" value={foundMember?.user?.name} large />
        <InfoRow label="Member Code" value={foundMember?.memberCode} />
        {foundMember?.houseNumber ? (
          <InfoRow label="House Number" value={foundMember.houseNumber} />
        ) : null}
        {foundMember?.street ? (
          <InfoRow label="Street" value={foundMember.street} />
        ) : null}
        <InfoRow
          label="Status"
          value={foundMember?.status?.toUpperCase()}
          valueColor={
            foundMember?.status === "approved" ? "#059669" : "#F59E0B"
          }
        />

        <TouchableOpacity
          style={resultStyles.actionButton}
          onPress={() =>
            navigation.navigate("AdminTab", {
              screen: "adminUserDetails",
              params: { item: foundMember },
            })
          }
        >
          <MaterialCommunityIcons name="account-check" size={18} color="#fff" />
          <Text style={resultStyles.actionButtonText}>View Member Details</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── 2. Guest QR — JSON parse ──────────────────────────────────────────────
  try {
    const itemdata = JSON.parse(data);

    return (
      <View>
        <View style={resultStyles.headerRow}>
          <View
            style={[resultStyles.typeBadge, { backgroundColor: "#DCFCE7" }]}
          >
            <MaterialCommunityIcons
              name="account-clock"
              size={14}
              color="#059669"
            />
            <Text style={[resultStyles.typeBadgeText, { color: "#059669" }]}>
              Visitor
            </Text>
          </View>
        </View>

        <InfoRow label="Visitor Name" value={itemdata?.name} large />
        <InfoRow label="Access Code" value={itemdata?.code} />
        <InfoRow label="Expires" value={formatDateandTime(itemdata?.expires)} />
        {itemdata?.phone_number ? (
          <InfoRow label="Phone Number" value={itemdata.phone_number} />
        ) : null}

        <TouchableOpacity
          style={resultStyles.actionButton}
          onPress={() => navigation.navigate("AdminGuestsDetail", { itemdata })}
        >
          <MaterialCommunityIcons name="check-circle" size={18} color="#fff" />
          <Text style={resultStyles.actionButtonText}>Verify Visitor</Text>
        </TouchableOpacity>
      </View>
    );
  } catch (err) {
    // ── 3. Unknown ────────────────────────────────────────────────────────────
    return <UnknownCode data={data} message="Unknown QR code format" />;
  }
};

// ─── Unknown code ─────────────────────────────────────────────────────────────
const UnknownCode = ({ data, message }) => (
  <View style={resultStyles.unknownContainer}>
    <MaterialCommunityIcons name="qrcode-remove" size={40} color="#9CA3AF" />
    <Text style={resultStyles.unknownTitle}>{message}</Text>
    <View style={resultStyles.unknownCodeBox}>
      <Text style={resultStyles.unknownCodeText}>{data}</Text>
    </View>
  </View>
);

// ─── Info row ─────────────────────────────────────────────────────────────────
const InfoRow = ({ label, value, large, valueColor }) => (
  <View style={resultStyles.infoRow}>
    <Text style={resultStyles.infoLabel}>{label}</Text>
    <Text
      style={[
        large ? resultStyles.infoValueLarge : resultStyles.infoValue,
        valueColor ? { color: valueColor } : {},
      ]}
    >
      {value || "N/A"}
    </Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  permissionButton: {
    marginTop: 16,
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  scanFrame: {
    position: "absolute",
    top: "25%",
    left: "15%",
    width: "70%",
    height: "40%",
    justifyContent: "center",
    alignItems: "center",
  },
  corner: {
    position: "absolute",
    width: 24,
    height: 24,
    borderColor: "#10B981",
    borderWidth: 3,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scanHint: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    position: "absolute",
    bottom: -40,
  },
  scanAgainContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  scanAgainButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  scanAgainText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    minHeight: "45%",
  },
  closeButton: {
    alignSelf: "flex-end",
    marginBottom: 12,
  },
});

const resultStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  infoValueLarge: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 8,
    gap: 8,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  unknownContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  unknownTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 12,
    marginBottom: 16,
  },
  unknownCodeBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 14,
    width: "100%",
    alignItems: "center",
  },
  unknownCodeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 1,
  },
});
