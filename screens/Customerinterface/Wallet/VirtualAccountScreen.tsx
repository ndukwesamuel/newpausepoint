import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { useSelector } from "react-redux";

const VirtualAccountScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const { userDatav2 } = useSelector((state) => state.authSlice);
  const userId = userDatav2?.data?.user?.id;

  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    refetch: refetchVirtualAccount,
  } = useFetchData_v2("api/v1/savehaven", "virtual-account");

  // ✅ DATA AS ARRAY
  const accountDetails = virtualAccountData?.data || [];
  const hasAccount = accountDetails.length > 0;

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchVirtualAccount();
    } finally {
      setRefreshing(false);
    }
  };

  const handleCopyToClipboard = async (text, label) => {
    if (!text) return;
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", `${label} copied to clipboard`);
  };

  if (isLoadingVirtualAccount) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading account details...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Virtual Account</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* NO ACCOUNT */}
      {!hasAccount && (
        <View style={styles.noAccountContainer}>
          <View style={styles.noAccountCard}>
            <MaterialCommunityIcons
              name="bank-plus"
              size={64}
              color="#10B981"
            />
            <Text style={styles.noAccountTitle}>
              Create Your Virtual Account
            </Text>
            <Text style={styles.noAccountDescription}>
              Get a dedicated Safe Haven account for instant wallet funding.
            </Text>

            <TouchableOpacity
              style={styles.createButton}
              onPress={() => navigation.navigate("CreateVirtualAccount")}
            >
              <Text style={styles.createButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* HAS ACCOUNT(S) */}
      <View style={styles.accountContainer}>
        {/* ACCOUNT CARD */}
        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <MaterialCommunityIcons name="bank" size={32} color="#10B981" />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.bankName}>{accountDetails?.bankName}</Text>
              <Text style={styles.statusText}>
                {accountDetails?.other?.status || "Active"}
              </Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <TouchableOpacity
              onPress={() =>
                handleCopyToClipboard(
                  accountDetails?.accountNumber,
                  "Account number",
                )
              }
            >
              <Text style={styles.detailValue}>
                {accountDetails?.accountNumber}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Name</Text>
            <Text style={styles.detailValue}>
              {accountDetails?.accountName}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank Code</Text>
            <Text style={styles.detailValue}>{accountDetails?.bankCode}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Type</Text>
            <Text style={styles.detailValue}>
              {accountDetails?.other?.accountType || "Current"}
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              handleCopyToClipboard(
                accountDetails?.accountNumber,
                "Account number",
              )
            }
          >
            <MaterialCommunityIcons
              name="content-copy"
              size={20}
              color="#6366F1"
            />
            <Text style={styles.actionButtonText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.shareButton]}
            onPress={() => Alert.alert("Share", "Coming soon")}
          >
            <MaterialIcons name="share" size={20} color="#10B981" />
            <Text style={styles.actionButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },

  // No Account Styles
  noAccountContainer: {
    padding: 16,
  },
  noAccountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  noAccountTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  noAccountDescription: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  benefitsContainer: {
    width: "100%",
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitText: {
    fontSize: 15,
    color: "#374151",
    marginLeft: 12,
    fontWeight: "500",
  },
  createButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
  },
  infoText: {
    fontSize: 13,
    color: "#6366F1",
    marginLeft: 8,
    flex: 1,
  },

  // Has Account Styles
  accountContainer: {
    padding: 16,
  },
  accountCard: {
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
  accountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  bankLogoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  bankName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    color: "#10B981",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  detailLabel: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  copyIconButton: {
    padding: 8,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },
  instructionsCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  instructionsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    marginLeft: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: "#78350F",
    lineHeight: 20,
    marginBottom: 12,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  warningText: {
    fontSize: 12,
    color: "#991B1B",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2FF",
    paddingVertical: 14,
    borderRadius: 12,
    marginRight: 8,
  },
  shareButton: {
    backgroundColor: "#D1FAE5",
    marginRight: 0,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
});

export default VirtualAccountScreen;
