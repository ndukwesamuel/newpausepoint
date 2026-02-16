import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import * as Clipboard from "expo-clipboard";
import { Alert } from "react-native";

const VirtualAccountCard = () => {
  const navigation = useNavigation();

  // Fetch virtual account data
  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    error: virtualAccountError,
  } = useFetchData_v2("api/v1/savehaven", "virtual-account");

  const hasAccount = virtualAccountData?.data?.length > 0;
  const accountDetails = virtualAccountData?.data?.[0];

  const handleCopyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
      Alert.alert("Copied!", "Account number copied to clipboard");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  if (isLoadingVirtualAccount) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="small" color="#10B981" />
        <Text style={styles.loadingText}>Loading account...</Text>
      </View>
    );
  }

  if (!hasAccount) {
    // Show creation prompt card
    return (
      <TouchableOpacity
        style={styles.noAccountCard}
        onPress={() => navigation.navigate("CreateVirtualAccount")}
        activeOpacity={0.7}
      >
        <View style={styles.iconCircle}>
          <MaterialCommunityIcons name="bank-plus" size={32} color="#10B981" />
        </View>

        <View style={styles.noAccountContent}>
          <Text style={styles.noAccountTitle}>Create Virtual Account</Text>
          <Text style={styles.noAccountDescription}>
            Get instant funding from any bank
          </Text>
        </View>

        <MaterialIcons name="arrow-forward-ios" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    );
  }

  // Show account details card
  return (
    <TouchableOpacity
      style={styles.accountCard}
      onPress={() => navigation.navigate("VirtualAccountScreen")}
      activeOpacity={0.9}
    >
      <View style={styles.cardHeader}>
        <View style={styles.bankIcon}>
          <MaterialCommunityIcons name="bank" size={24} color="#10B981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.bankName}>{accountDetails?.bankName}</Text>
          <View style={styles.statusContainer}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>Active</Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#6B7280" />
      </View>

      <View style={styles.divider} />

      <View style={styles.accountInfo}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Number</Text>
          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumber}>
              {accountDetails?.accountNumber}
            </Text>
            <TouchableOpacity
              onPress={() =>
                handleCopyToClipboard(accountDetails?.accountNumber)
              }
              style={styles.copyButton}
            >
              <MaterialCommunityIcons
                name="content-copy"
                size={16}
                color="#6366F1"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Account Name</Text>
          <Text style={styles.accountName} numberOfLines={1}>
            {accountDetails?.accountName}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <MaterialIcons name="info-outline" size={16} color="#6B7280" />
        <Text style={styles.footerText}>
          Tap to view full details and share
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: "#6B7280",
  },

  // No Account Card
  noAccountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#D1FAE5",
    borderStyle: "dashed",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  noAccountContent: {
    flex: 1,
    marginLeft: 16,
  },
  noAccountTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  noAccountDescription: {
    fontSize: 13,
    color: "#6B7280",
  },

  // Account Card
  accountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  bankIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  bankName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  accountInfo: {
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  accountNumberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 1,
  },
  copyButton: {
    padding: 8,
    backgroundColor: "#EEF2FF",
    borderRadius: 6,
  },
  accountName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
});

export default VirtualAccountCard;
