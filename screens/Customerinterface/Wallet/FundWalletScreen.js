import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useFetchData } from "../../../hooks/Request";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function FundWalletScreen() {
  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    error: virtualAccountError,
    refetch: refetchVirtualAccount,
  } = useFetchData("api/v3/bank/singleUser", "virtual-account");

  const [isVirtualAccountExpanded, setIsVirtualAccountExpanded] =
    useState(true);
  return (
    <ScrollView>
      <View style={styles.container}>
        {virtualAccountData?.data && (
          <View style={styles.virtualAccountCard}>
            <TouchableOpacity
              style={styles.virtualAccountHeader}
              onPress={() =>
                setIsVirtualAccountExpanded(!isVirtualAccountExpanded)
              }
              activeOpacity={0.7}
            >
              <Icon name="account-balance" size={24} color="#4CAF50" />
              <Text style={styles.virtualAccountTitle}>
                Your Virtual Account
              </Text>
              <Icon
                name={
                  isVirtualAccountExpanded
                    ? "keyboard-arrow-up"
                    : "keyboard-arrow-down"
                }
                size={24}
                color="#666"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            {isVirtualAccountExpanded && (
              <View style={styles.virtualAccountDetails}>
                <View style={styles.accountDetailRow}>
                  <Text style={styles.accountDetailLabel}>Account Name:</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() =>
                      handleCopyToClipboard(
                        virtualAccountData?.data?.accountName
                      )
                    }
                  >
                    <Text style={styles.accountDetailValue}>
                      {virtualAccountData?.data?.accountName}
                    </Text>
                    <Icon
                      name="content-copy"
                      size={16}
                      color="#666"
                      style={styles.copyIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.accountDetailRow}>
                  <Text style={styles.accountDetailLabel}>Account Number:</Text>
                  <TouchableOpacity
                    style={styles.copyButton}
                    onPress={() =>
                      handleCopyToClipboard(
                        virtualAccountData?.data?.accountNumber
                      )
                    }
                  >
                    <Text style={styles.accountDetailValue}>
                      {virtualAccountData?.data?.accountNumber}
                    </Text>
                    <Icon
                      name="content-copy"
                      size={16}
                      color="#666"
                      style={styles.copyIcon}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.accountDetailRow}>
                  <Text style={styles.accountDetailLabel}>Bank Name:</Text>
                  <Text style={styles.accountDetailValue}>
                    {virtualAccountData?.data?.bankName}
                  </Text>
                </View>

                <View style={styles.accountInfo}>
                  <Icon name="info" size={16} color="#FF9800" />
                  <Text style={styles.accountInfoText}>
                    Transfer money to this account to fund your wallet
                    automatically
                  </Text>
                </View>

                <View style={styles.accountInfo}>
                  <View style={{ marginLeft: 8 }}>
                    <Text
                      style={[
                        styles.accountInfoText,
                        { color: "#666", marginTop: 2 },
                      ]}
                    >
                      ⚠️ A transaction fee applies ₦250 per transaction.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },
  balance: {
    fontSize: 22,
    marginLeft: 10,
    fontWeight: "600",
    color: "#4CAF50",
  },

  // Virtual Account Card Styles
  virtualAccountCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  virtualAccountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  virtualAccountTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#4CAF50",
  },
  virtualAccountDetails: {
    gap: 12,
  },
  accountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountDetailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  accountDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  copyIcon: {
    marginLeft: 6,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  accountInfoText: {
    fontSize: 12,
    color: "#E65100",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dueItem: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  dueItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dueDetails: {
    marginLeft: 15,
    flex: 1,
  },
  dueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dueDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
    marginTop: 8,
  },
  dueStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dueStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  paidStatus: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  pendingStatus: {
    backgroundColor: "#FFF3E0",
    color: "#EF6C00",
  },
  dueDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  dueUpcoming: {
    color: "#2196F3",
  },
  dueToday: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  dueLate: {
    color: "#F44336",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  utilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  utilityCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    elevation: 1,
  },
  utilityImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  utilityName: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ADDED to space out content and refresh button
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },

  accountInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  accountInfoText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
});
