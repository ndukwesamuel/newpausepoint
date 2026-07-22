import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// export { parseDeviceLockError } from "./deviceLockUtils";

const AccountLockModal = ({ visible, lockInfo, onClose }) => {
  if (!lockInfo) return null;

  const isFrozen = lockInfo.type === "frozen";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: isFrozen ? "#FEE2E2" : "#FEF3C7" },
            ]}
          >
            <MaterialCommunityIcons
              name={isFrozen ? "lock-alert-outline" : "clock-outline"}
              size={32}
              color={isFrozen ? "#DC2626" : "#92400E"}
            />
          </View>

          <Text style={styles.title}>
            {isFrozen ? "Account Frozen" : "Account Temporarily Paused"}
          </Text>

          {isFrozen ? (
            <Text style={styles.message}>
              This account has been frozen because it was used on too many
              different devices. Please contact your estate admin to
              reactivate it.
            </Text>
          ) : (
            <Text style={styles.message}>
              A login was just attempted from a new device. For security,
              this account is temporarily paused
              {lockInfo.minutesLeft
                ? ` for about ${lockInfo.minutesLeft} minute${
                    lockInfo.minutesLeft === 1 ? "" : "s"
                  }`
                : ""}
              . Please try again shortly.
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFrozen ? "#DC2626" : "#10B981" },
            ]}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={styles.buttonText}>
              {isFrozen ? "Okay, I'll contact admin" : "Okay"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default AccountLockModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});