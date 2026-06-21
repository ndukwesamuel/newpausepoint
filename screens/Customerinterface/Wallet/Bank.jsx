import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { useQueryClient } from "@tanstack/react-query";
import KYCVerificationModal from "./Kycverificationmodal";

export default function Bank() {
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [showAccountSection, setShowAccountSection] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(0);
  const [showDepositSection, setShowDepositSection] = useState(false);
  const [depositFetchTrigger, setDepositFetchTrigger] = useState(0);
  const [showKYCModal, setShowKYCModal] = useState(false);

  const {
    data: get_user_info,
    isLoading,
    error,
  } = useFetchData_v2("api/v1/user", "getuser");

  const {
    data: get_bank_info,
    isLoading: Isloadinget_bank_info,
    error: ISerrorget_bank_info,
  } = useFetchData_v2("api/v1/bank", "getbankinfo");

  // Check if user is verified (verificationStatus === "approved")
  const isVerified = get_bank_info?.verificationStatus === "approved";

  // Fetch single deposit account - only when verified
  const {
    data: singleDepositAccountData,
    isLoading: isLoadingSingleDepositAccount,
    error: singleDepositAccountError,
    refetch: refetchSingleDepositAccount,
  } = useFetchData_v2(
    "api/v1/bank/getcustomerSingleDepositAccount",
    "getcustomerSingleDepositAccount",
    {
      enabled: isVerified, // Only fetch when verified
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  );

  // Fetch customer account with trigger in query key
  const {
    data: customerAccountData,
    isLoading: isLoadingCustomerAccount,
    error: customerAccountError,
    refetch: refetchCustomerAccount,
  } = useFetchData_v2(
    "api/v1/bank/customerAccount",
    `customerAccount-${fetchTrigger}`,
    {
      enabled: fetchTrigger > 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  // Fetch deposit account with trigger in query key (for creating new deposit account flow)
  const {
    data: depositAccountData,
    isLoading: isLoadingDepositAccount,
    error: depositAccountError,
    refetch: refetchDepositAccount,
  } = useFetchData_v2(
    "api/v1/bank/customerDepositAccount",
    `depositAccount-${depositFetchTrigger}`,
    {
      enabled: depositFetchTrigger > 0,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    },
  );

  console.log({
    bankInfo: get_bank_info,
    isVerified,
    singleDepositAccount: singleDepositAccountData,
    customerAccount: customerAccountData,
    depositAccount: depositAccountData,
  });

  // ⛔ Don't run logic while loading or on error
  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingCard}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorCard}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={48}
            color="#DC2626"
          />
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorSubText}>{error?.message}</Text>
        </View>
      </View>
    );
  }

  const data = get_user_info?.data;

  const existdata = {
    firstName: data?.user?.firstName,
    lastName: data?.user?.lastName,
    phoneNumber: data?.phoneNumber,
    street: data?.address?.street,
    city: data?.address?.city,
    state: data?.address?.state,
  };

  const requiredFields = [
    "firstName",
    "lastName",
    "phoneNumber",
    "street",
    "city",
    "state",
  ];

  const missingFields = requiredFields.filter((field) => !existdata[field]);
  const hasAllFields = missingFields.length === 0;
  const hasBankInfo = !!get_bank_info;

  // Check if single deposit account exists and has data
  // API response structure: { success, message, data: { data: {...}, included: [...] } }
  // OR could be: { data: [...], included: [...] }

  // Handle both possible structures
  const depositData =
    singleDepositAccountData?.data?.data ||
    (Array.isArray(singleDepositAccountData?.data)
      ? singleDepositAccountData?.data[0]
      : null);

  const hasSingleDepositAccount = !!depositData;

  // Get the deposit account
  const depositAccount = depositData || null;

  // Get the virtual nuban/account number from included array (check both paths)
  const includedArray =
    singleDepositAccountData?.data?.included ||
    singleDepositAccountData?.included ||
    [];

  // console.log({
  //   iiiii: singleDepositAccountData.data.included,
  // });

  const includedAccountNumber = includedArray.find(
    (item) => item.type === "AccountNumber",
  );

  const handleCheckAccount = () => {
    setShowAccountSection(true);
    setFetchTrigger((prev) => prev + 1);
  };

  const handleCheckDepositAccount = () => {
    setShowDepositSection(true);
    setDepositFetchTrigger((prev) => prev + 1);
  };

  const handleKYCSuccess = () => {
    // Refetch bank info after successful KYC submission
    queryClient.invalidateQueries({ queryKey: ["getbankinfo"] });
  };

  // Check if customer account data exists
  const hasCustomerAccount =
    customerAccountData &&
    customerAccountData.data &&
    Object.keys(customerAccountData.data).length > 0;

  // Check if deposit account data exists
  const hasDepositAccount =
    depositAccountData &&
    depositAccountData.data &&
    Object.keys(depositAccountData.data).length > 0;

  // Helper function to format currency
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat("en-NG", {
  //     style: "currency",
  //     currency: "NGN",
  //     minimumFractionDigits: 2,
  //   }).format(amount || 0);
  // };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format((amount || 0) / 100);
  };
  return (
    <View style={styles.container}>
      {/* Profile Completion Card */}
      <View style={styles.sectionCard}>
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="account-check"
            size={20}
            color="#10B981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sectionTitle}>Profile Status</Text>
        </View>

        {hasAllFields ? (
          <Text style={styles.successText}>Profile complete ✅</Text>
        ) : (
          <View>
            <Text style={styles.warningText}>
              Please complete the following fields:
            </Text>

            <View style={styles.missingFieldsContainer}>
              {missingFields.map((field) => (
                <View key={field} style={styles.missingFieldItem}>
                  <MaterialCommunityIcons
                    name="alert-circle-outline"
                    size={16}
                    color="#DC2626"
                  />
                  <Text style={styles.missingFieldText}>{field}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => navigation.navigate("editPersonalInfo")}
            >
              <MaterialCommunityIcons
                name="account-edit"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.primaryButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bank Info Card - Only show if profile is complete */}
      {hasAllFields && (
        <View style={styles.sectionCard}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="bank"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Banking Information</Text>
          </View>

          {/* Bank Info Status */}
          {hasBankInfo ? (
            <View>
              {/* Verification Status Badge */}
              <View
                style={isVerified ? styles.successBadge : styles.warningBadge}
              >
                <MaterialCommunityIcons
                  name={isVerified ? "check-decagram" : "alert-circle"}
                  size={18}
                  color={isVerified ? "#065F46" : "#92400E"}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={
                    isVerified
                      ? styles.successBadgeText
                      : styles.warningBadgeText
                  }
                >
                  {isVerified ? "Verified ✅" : "Unverified ⚠️"}
                </Text>
              </View>

              {/* Show KYC button if NOT verified */}
              {!isVerified ? (
                <TouchableOpacity
                  style={styles.kycButton}
                  onPress={() => setShowKYCModal(true)}
                >
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.kycButtonText}>
                    Complete KYC Verification
                  </Text>
                </TouchableOpacity>
              ) : (
                /* User IS verified - Show deposit account info */
                <View>
                  {/* Loading state for single deposit account */}
                  {isLoadingSingleDepositAccount && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#10B981" />
                      <Text style={styles.loadingText}>
                        Fetching your deposit account...
                      </Text>
                    </View>
                  )}

                  {/* Error state for single deposit account */}
                  {singleDepositAccountError && (
                    <View style={styles.errorContainer}>
                      <MaterialCommunityIcons
                        name="alert-circle"
                        size={24}
                        color="#DC2626"
                      />
                      <Text style={styles.errorText}>
                        Failed to fetch deposit account
                      </Text>
                      <Text style={styles.errorSubText}>
                        {singleDepositAccountError?.message ||
                          "Please try again"}
                      </Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => refetchSingleDepositAccount()}
                      >
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Deposit account found */}
                  {!isLoadingSingleDepositAccount &&
                    !singleDepositAccountError &&
                    hasSingleDepositAccount && (
                      <View>
                        <View style={styles.successContainer}>
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={24}
                            color="#10B981"
                          />
                          <Text style={styles.successTitle}>
                            Deposit Account Active ✅
                          </Text>
                        </View>

                        {/* Deposit Account Details Card */}
                        <View style={styles.accountDetailsCard}>
                          <Text style={styles.accountLabel}>Account Name</Text>
                          <Text style={styles.accountValue}>
                            {includedAccountNumber?.attributes?.name ||
                              depositAccount?.attributes?.accountName ||
                              "N/A"}
                          </Text>

                          <Text style={styles.accountLabel}>
                            Account Number
                          </Text>
                          <Text style={styles.accountValue}>
                            {includedAccountNumber?.attributes?.accountNumber ||
                              depositAccount?.attributes?.accountNumber ||
                              "N/A"}
                          </Text>

                          <Text style={styles.accountLabel}>Bank</Text>
                          <Text style={styles.accountValue}>
                            {includedAccountNumber?.attributes?.bank?.name ||
                              depositAccount?.attributes?.bank?.name ||
                              "N/A"}
                          </Text>

                          <Text style={styles.accountLabel}>Account Type</Text>
                          <Text style={styles.accountValue}>
                            {depositAccount?.attributes?.type || "N/A"}
                          </Text>

                          <Text style={styles.accountLabel}>Status</Text>
                          <View
                            style={[
                              styles.statusBadge,
                              depositAccount?.attributes?.status === "ACTIVE"
                                ? styles.statusActive
                                : styles.statusInactive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.statusText,
                                depositAccount?.attributes?.status === "ACTIVE"
                                  ? styles.statusActiveText
                                  : styles.statusInactiveText,
                              ]}
                            >
                              {depositAccount?.attributes?.status || "N/A"}
                            </Text>
                          </View>

                          {/* Balance Section */}
                          <View style={styles.balanceSection}>
                            <Text style={styles.balanceSectionTitle}>
                              Account Balances
                            </Text>

                            <View style={styles.balanceRow}>
                              <Text style={styles.balanceLabel}>
                                Available Balance
                              </Text>
                              <Text style={styles.balanceValue}>
                                {formatCurrency(
                                  depositAccount?.attributes?.availableBalance,
                                )}
                              </Text>
                            </View>

                            <View style={styles.balanceRow}>
                              <Text style={styles.balanceLabel}>
                                Ledger Balance
                              </Text>
                              <Text style={styles.balanceValue}>
                                {formatCurrency(
                                  depositAccount?.attributes?.ledgerBalance,
                                )}
                              </Text>
                            </View>
                            {/* 
                            <View style={styles.balanceRow}>
                              <Text style={styles.balanceLabel}>
                                Pending Balance
                              </Text>
                              <Text style={styles.balanceValue}>
                                {formatCurrency(
                                  depositAccount?.attributes?.pendingBalance
                                )}
                              </Text>
                            </View> */}

                            {/* <View style={styles.balanceRow}>
                              <Text style={styles.balanceLabel}>
                                Hold Balance
                              </Text>
                              <Text style={styles.balanceValue}>
                                {formatCurrency(
                                  depositAccount?.attributes?.holdBalance
                                )}
                              </Text>
                            </View> */}
                          </View>
                        </View>

                        {/* Action Button */}
                        {/* <TouchableOpacity
                          style={styles.createDepositButton}
                          onPress={() => navigation.navigate("CreateDeposit")}
                        >
                          <MaterialCommunityIcons
                            name="cash-plus"
                            size={20}
                            color="#FFFFFF"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.createDepositButtonText}>
                            Fund Account / Make Deposit
                          </Text>
                        </TouchableOpacity> */}
                      </View>
                    )}

                  {/* No deposit account found - offer to create one */}
                  {!isLoadingSingleDepositAccount &&
                    !singleDepositAccountError &&
                    !hasSingleDepositAccount && (
                      <View>
                        <View style={styles.warningContainer}>
                          <MaterialCommunityIcons
                            name="information"
                            size={24}
                            color="#F59E0B"
                          />
                          <Text style={styles.warningTitle}>
                            No Deposit Account Found
                          </Text>
                          <Text style={styles.warningDescription}>
                            Your KYC is verified! Now create a deposit account
                            to start making transactions.
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={styles.primaryButton}
                          onPress={() =>
                            // navigation.navigate("CreateDepositAccount")
                          }
                        >
                          <MaterialCommunityIcons
                            name="account-plus"
                            size={20}
                            color="#FFFFFF"
                            style={{ marginRight: 8 }}
                          />
                          <Text style={styles.primaryButtonText}>
                            Create Deposit Account
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={styles.descriptionText}>
                No banking information found. Click below to check your customer
                account.
              </Text>

              {/* Check Customer Account Button */}
              {!showAccountSection && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={handleCheckAccount}
                  disabled={isLoadingCustomerAccount}
                >
                  {isLoadingCustomerAccount ? (
                    <>
                      <ActivityIndicator size="small" color="#10B981" />
                      <Text style={styles.secondaryButtonText}>
                        Checking...
                      </Text>
                    </>
                  ) : (
                    <>
                      <MaterialCommunityIcons
                        name="bank-check"
                        size={20}
                        color="#10B981"
                        style={{ marginRight: 8 }}
                      />
                      <Text style={styles.secondaryButtonText}>
                        Check Customer Account
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              )}

              {/* Show customer account results */}
              {showAccountSection && (
                <View style={{ marginTop: 16 }}>
                  {isLoadingCustomerAccount && (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color="#10B981" />
                      <Text style={styles.loadingText}>
                        Fetching account details...
                      </Text>
                    </View>
                  )}

                  {customerAccountError && (
                    <View style={styles.errorContainer}>
                      <MaterialCommunityIcons
                        name="alert-circle"
                        size={24}
                        color="#DC2626"
                      />
                      <Text style={styles.errorText}>
                        Failed to fetch account
                      </Text>
                      <Text style={styles.errorSubText}>
                        {customerAccountError?.message || "Please try again"}
                      </Text>
                      <TouchableOpacity
                        style={styles.retryButton}
                        onPress={handleCheckAccount}
                      >
                        <Text style={styles.retryButtonText}>Retry</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {!isLoadingCustomerAccount &&
                    !customerAccountError &&
                    customerAccountData && (
                      <View>
                        {hasCustomerAccount ? (
                          // Customer account exists
                          <View>
                            <View style={styles.successContainer}>
                              <MaterialCommunityIcons
                                name="check-circle"
                                size={24}
                                color="#10B981"
                              />
                              <Text style={styles.successTitle}>
                                Customer Account Found! ✅
                              </Text>
                            </View>

                            {/* Display account details if available */}
                            {customerAccountData.data?.accountNumber && (
                              <View style={styles.accountDetailsCard}>
                                <Text style={styles.accountLabel}>
                                  Account Number
                                </Text>
                                <Text style={styles.accountValue}>
                                  {customerAccountData.data.accountNumber}
                                </Text>

                                {customerAccountData.data?.accountName && (
                                  <>
                                    <Text style={styles.accountLabel}>
                                      Account Name
                                    </Text>
                                    <Text style={styles.accountValue}>
                                      {customerAccountData.data.accountName}
                                    </Text>
                                  </>
                                )}

                                {customerAccountData.data?.bankName && (
                                  <>
                                    <Text style={styles.accountLabel}>
                                      Bank Name
                                    </Text>
                                    <Text style={styles.accountValue}>
                                      {customerAccountData.data.bankName}
                                    </Text>
                                  </>
                                )}
                              </View>
                            )}
                          </View>
                        ) : (
                          // No customer account
                          <View>
                            <View style={styles.warningContainer}>
                              <MaterialCommunityIcons
                                name="information"
                                size={24}
                                color="#F59E0B"
                              />
                              <Text style={styles.warningTitle}>
                                No Customer Account Found
                              </Text>
                              <Text style={styles.warningDescription}>
                                You don't have a customer account yet. Create
                                one to start using banking services.
                              </Text>
                            </View>

                            <TouchableOpacity
                              style={styles.primaryButton}
                              onPress={() =>
                                navigation.navigate("CreateCustomerAccount")
                              }
                            >
                              <MaterialCommunityIcons
                                name="account-plus"
                                size={20}
                                color="#FFFFFF"
                                style={{ marginRight: 8 }}
                              />
                              <Text style={styles.primaryButtonText}>
                                Create Customer Account
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    )}
                </View>
              )}
            </View>
          )}
        </View>
      )}

      {/* KYC Verification Modal */}
      <KYCVerificationModal
        visible={showKYCModal}
        onClose={() => setShowKYCModal(false)}
        onSuccess={handleKYCSuccess}
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  // Section Card Styles
  sectionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  // Badge Styles
  successBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  successBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
  },
  warningBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  warningBadgeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
  },
  successText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#065F46",
  },
  infoBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  // Warning & Error Styles
  warningText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  missingFieldsContainer: {
    marginBottom: 16,
  },
  missingFieldItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 4,
  },
  missingFieldText: {
    fontSize: 13,
    color: "#DC2626",
    marginLeft: 8,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  // Button Styles
  primaryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  kycButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  kycButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#10B981",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  createDepositButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createDepositButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 12,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  // Loading Styles
  loadingCard: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 12,
    fontWeight: "500",
  },
  // Error Styles
  errorCard: {
    backgroundColor: "#FFFFFF",
    padding: 40,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  errorContainer: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#DC2626",
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
  errorSubText: {
    fontSize: 13,
    color: "#991B1B",
    marginTop: 4,
    textAlign: "center",
  },
  // Success Styles
  successContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 16,
    color: "#065F46",
    marginTop: 8,
    fontWeight: "700",
  },
  // Warning Styles
  warningContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
  },
  warningTitle: {
    fontSize: 16,
    color: "#92400E",
    marginTop: 8,
    fontWeight: "700",
  },
  warningDescription: {
    fontSize: 13,
    color: "#78350F",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 18,
  },
  // Account Details Card
  accountDetailsCard: {
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 4,
    marginTop: 8,
  },
  accountValue: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  // Status Badge Styles
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  statusActive: {
    backgroundColor: "#D1FAE5",
  },
  statusInactive: {
    backgroundColor: "#FEE2E2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusActiveText: {
    color: "#065F46",
  },
  statusInactiveText: {
    color: "#991B1B",
  },
  // Balance Section Styles
  balanceSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  balanceSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  balanceLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  balanceValue: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "700",
  },
};
