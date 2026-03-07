import React, { useState, useRef, useCallback, useEffect } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Clipboard,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";

const FundWalletScreen = ({ navigation }) => {
  // State for Paystack payment
  const [amount, setAmount] = useState("");
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [webviewstart, setwebviewstart] = useState(false);
  const [webviewdata, setwebviewdata] = useState(null);
  const [webviewLoading, setWebviewLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // State for funding method selection
  const [fundingMethod, setFundingMethod] = useState("transfer");
  const [isVirtualAccountExpanded, setIsVirtualAccountExpanded] =
    useState(true);
  const [isSafeHavenExpanded, setIsSafeHavenExpanded] = useState(true);

  const dispatch = useDispatch();
  const webViewRef = useRef(null);

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  const { userDatav2 } = useSelector((state) => state.authSlice);

  // Fetch BlueSalt bank account data
  const {
    data: blueSaltAccountData,
    isLoading: isLoadingBlueSalt,
    error: blueSaltError,
    refetch: refetchBlueSalt,
  } = useFetchData_v2("api/v1/bluesalt", "blueSaltAccount");

  console.log({
    ttt: get_user_profile_data?.data?.user?._id,
    xxx: userDatav2?.data?.token,
  });

  // Fetch SafeHaven virtual account data
  const {
    data: safeHavenAccountData,
    isLoading: isLoadingSafeHaven,
    error: safeHavenError,
    refetch: refetchSafeHaven,
  } = useFetchData_v2("api/v1/savehaven", "virtual-account");

  // Extract account details
  const blueSaltAccount = blueSaltAccountData;
  const hasSafeHavenAccount =
    safeHavenAccountData?.data &&
    Object.keys(safeHavenAccountData?.data).length > 0;
  const safeHavenAccount = safeHavenAccountData?.data;

  // Calculate transaction fee for Paystack
  const calculateFee = useCallback((amount) => {
    const numericAmount = parseFloat(amount) || 0;
    const serviceCharge = numericAmount * 0.02; // 2%
    const additionalFee = numericAmount > 10000 ? 100 : 0;
    return serviceCharge + additionalFee;
  }, []);

  // Validate amount input
  const validateAmount = useCallback((value) => {
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue <= 0) {
      return "Please enter a valid amount";
    }
    if (numericValue < 100) {
      return "Minimum amount is ₦100";
    }
    if (numericValue > 1000000) {
      return "Maximum amount is ₦1,000,000";
    }
    return null;
  }, []);

  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback((text, label = "Text") => {
    Clipboard.setString(text);
    Alert.alert("Copied!", `${label} copied to clipboard`);
  }, []);

  // Handle Paystack payment
  const handlePaystackPayment = async () => {
    const validationError = validateAmount(amount);
    if (validationError) {
      Alert.alert("Invalid Amount", validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/wallet/fund",
        {
          amount: parseFloat(amount),
          userid: get_user_profile_data?.data?.user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${user_data?.token}`,
            Authorization: `Bearer ${userDatav2?.data?.token}`,
            // this token is wrong for it but we will manage
          },
          timeout: 30000,
        },
      );

      if (response.data?.data) {
        setwebviewstart(true);
        setwebviewdata(response.data?.data);
        setWebviewLoading(true);
      } else {
        Alert.alert(
          "Payment Error",
          "Failed to initialize payment. Please try again.",
        );
      }
    } catch (error) {
      console.error("Payment initialization error:", error);

      let errorMessage = "An error occurred while initializing payment.";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (error.response?.status === 429) {
        errorMessage = "Too many requests. Please wait a moment and try again.";
      } else if (error.response) {
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = error.message || "Unknown error occurred.";
      }

      Alert.alert("Payment Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onNavigationStateChange = useCallback(
    (navState) => {
      const { url, loading } = navState;

      if (!loading) {
        setWebviewLoading(false);
      }

      if (url.includes("https://standard.paystack.co/close")) {
        setwebviewstart(false);
        Alert.alert(
          "Payment Completed",
          "Payment process completed. Please check your wallet balance.",
          [
            {
              text: "OK",
              onPress: () => {
                // refetchWallet();
                navigation.goBack();
              },
            },
          ],
        );
        return false;
      }

      if (url.includes("payment-success")) {
        setwebviewstart(false);
        Alert.alert("Success!", "Payment completed successfully!", [
          {
            text: "OK",
            onPress: () => {
              // refetchWallet();
              navigation.goBack();
            },
          },
        ]);
        return false;
      }

      if (url.includes("payment-cancel")) {
        setwebviewstart(false);
        Alert.alert("Cancelled", "Payment was cancelled.", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
        return false;
      }

      return true;
    },
    [navigation],
  );

  const handleBackFromWebView = useCallback(() => {
    Alert.alert(
      "Cancel Payment",
      "Are you sure you want to cancel this payment?",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => {
            setwebviewstart(false);
            setwebviewdata(null);
          },
        },
      ],
    );
  }, []);

  const handleQuickAmount = useCallback((quickAmount) => {
    setAmount(quickAmount.toString());
  }, []);

  // Calculate total amount including fees for Paystack
  const totalFee = calculateFee(amount);
  const totalAmount = parseFloat(amount || 0) + totalFee;

  useEffect(() => {
    dispatch(Get_User_Profle_Fun());
    return () => {};
  }, [dispatch]);

  // If WebView is active (Paystack payment in progress)
  if (webviewstart) {
    return (
      <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
        <View style={styles.webviewHeader}>
          <TouchableOpacity
            style={styles.backButtonWebView}
            onPress={handleBackFromWebView}
          >
            <Icon name="arrow-back" size={24} color="green" />
            <Text style={styles.backButtonText}>Cancel Payment</Text>
          </TouchableOpacity>
        </View>

        {webviewLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="green" />
            <Text style={styles.loadingText}>Loading Paystack...</Text>
          </View>
        )}

        <WebView
          ref={webViewRef}
          style={{ flex: 1 }}
          source={{ uri: webviewdata }}
          onNavigationStateChange={onNavigationStateChange}
          onLoadStart={() => setWebviewLoading(true)}
          onLoadEnd={() => setWebviewLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn("WebView error: ", nativeEvent);
            Alert.alert(
              "WebView Error",
              `Error loading payment page: ${nativeEvent.description}`,
            );
            setwebviewstart(false);
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          cacheEnabled={false}
          incognito={true}
          allowsBackForwardNavigationGestures={true}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="green" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          )}
        />
      </View>
    );
  }

  // Main screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Funding Method Selection */}
        <View style={styles.methodSelectionContainer}>
          <Text style={styles.methodSelectionTitle}>Choose Funding Method</Text>
          <View style={styles.methodButtons}>
            {/* Bank Transfer Button */}
            <TouchableOpacity
              style={[
                styles.methodButton,
                fundingMethod === "transfer" && styles.methodButtonActive,
              ]}
              onPress={() => setFundingMethod("transfer")}
            >
              <Icon
                name="account-balance"
                size={24}
                color={fundingMethod === "transfer" ? "#FFF" : "green"}
              />
              <Text
                style={[
                  styles.methodButtonText,
                  fundingMethod === "transfer" && styles.methodButtonTextActive,
                ]}
              >
                Bank Transfer
              </Text>
            </TouchableOpacity>

            {/* Paystack Button */}
            <TouchableOpacity
              style={[
                styles.methodButton,
                fundingMethod === "paystack" && styles.methodButtonActive,
              ]}
              onPress={() => setFundingMethod("paystack")}
            >
              <Icon
                name="payment"
                size={24}
                color={fundingMethod === "paystack" ? "#FFF" : "green"}
              />
              <Text
                style={[
                  styles.methodButtonText,
                  fundingMethod === "paystack" && styles.methodButtonTextActive,
                ]}
              >
                Pay with Card
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bank Transfer Section */}
        {fundingMethod === "transfer" && (
          <>
            {/* SafeHaven Account Section */}
            {isLoadingSafeHaven ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="green" />
                <Text style={styles.loadingText}>
                  Loading SafeHaven account...
                </Text>
              </View>
            ) : safeHavenError ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={48} color="#DC3545" />
                <Text style={styles.errorText}>
                  Failed to load SafeHaven account
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refetchSafeHaven}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : !hasSafeHavenAccount ? (
              // No SafeHaven Account - Show Create Prompt
              <TouchableOpacity
                style={styles.createAccountCard}
                onPress={() => navigation.navigate("CreateVirtualAccount")}
                activeOpacity={0.7}
              >
                <View style={styles.createAccountIconCircle}>
                  <MaterialCommunityIcons
                    name="bank-plus"
                    size={40}
                    color="#10B981"
                  />
                </View>
                <View style={styles.createAccountContent}>
                  <Text style={styles.createAccountTitle}>
                    Create Safe Haven Account
                  </Text>
                  <Text style={styles.createAccountDescription}>
                    Get instant funding from any bank with your dedicated
                    account number
                  </Text>
                </View>
                <Icon name="arrow-forward-ios" size={24} color="#10B981" />
              </TouchableOpacity>
            ) : (
              // Has SafeHaven Account - Show Account Details
              <View style={styles.virtualAccountCard}>
                <TouchableOpacity
                  style={styles.virtualAccountHeader}
                  onPress={() => setIsSafeHavenExpanded(!isSafeHavenExpanded)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name="bank"
                    size={24}
                    color="#10B981"
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.virtualAccountTitle}>
                      Safe Haven Account
                    </Text>
                    <View style={styles.statusBadge}>
                      <View
                        style={[styles.statusDot, styles.statusDotActive]}
                      />
                      <Text style={styles.statusText}>Active</Text>
                    </View>
                  </View>
                  <Icon
                    name={
                      isSafeHavenExpanded
                        ? "keyboard-arrow-up"
                        : "keyboard-arrow-down"
                    }
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>

                {isSafeHavenExpanded && (
                  <View style={styles.virtualAccountDetails}>
                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>
                        Account Number:
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() =>
                          handleCopyToClipboard(
                            safeHavenAccount.accountNumber,
                            "Account number",
                          )
                        }
                      >
                        <Text style={styles.accountDetailValue}>
                          {safeHavenAccount.accountNumber}
                        </Text>
                        <Icon
                          name="content-copy"
                          size={16}
                          color="#6366F1"
                          style={styles.copyIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>
                        Account Name:
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() =>
                          handleCopyToClipboard(
                            safeHavenAccount.accountName,
                            "Account name",
                          )
                        }
                      >
                        <Text style={styles.accountDetailValue}>
                          {safeHavenAccount.accountName}
                        </Text>
                        <Icon
                          name="content-copy"
                          size={16}
                          color="#6366F1"
                          style={styles.copyIcon}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>Bank Name:</Text>
                      <Text style={styles.accountDetailValue}>
                        {safeHavenAccount.bankName}
                      </Text>
                    </View>

                    <View style={styles.accountDetailRow}>
                      <Text style={styles.accountDetailLabel}>Bank Code:</Text>
                      <Text style={styles.accountDetailValue}>
                        {safeHavenAccount.bankCode}
                      </Text>
                    </View>

                    <View style={styles.accountInfo}>
                      <Icon name="info" size={16} color="#10B981" />
                      <Text style={styles.accountInfoText}>
                        Transfer to this account to fund your wallet instantly
                        with no fees. Available 24/7.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* BlueSalt Account Section (Alternative) */}
            {isLoadingBlueSalt ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="green" />
                <Text style={styles.loadingText}>
                  Loading BlueSalt account...
                </Text>
              </View>
            ) : blueSaltError ? (
              <View style={styles.errorContainer}>
                <Icon name="error-outline" size={48} color="#DC3545" />
                <Text style={styles.errorText}>
                  Failed to load BlueSalt account
                </Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refetchBlueSalt}
                >
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : blueSaltAccount ? (
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
                    BlueSalt Account (Alternative)
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
                      <Text style={styles.accountDetailLabel}>
                        Account Name:
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() =>
                          handleCopyToClipboard(
                            blueSaltAccount.accountName,
                            "Account name",
                          )
                        }
                      >
                        <Text style={styles.accountDetailValue}>
                          {blueSaltAccount.accountName}
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
                      <Text style={styles.accountDetailLabel}>
                        Account Number:
                      </Text>
                      <TouchableOpacity
                        style={styles.copyButton}
                        onPress={() =>
                          handleCopyToClipboard(
                            blueSaltAccount.accountNumber,
                            "Account number",
                          )
                        }
                      >
                        <Text style={styles.accountDetailValue}>
                          {blueSaltAccount.accountNumber}
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
                        {blueSaltAccount.bankName}
                      </Text>
                    </View>

                    <View style={styles.accountInfo}>
                      <Icon name="info" size={16} color="#FF9800" />
                      <Text style={styles.accountInfoText}>
                        Transfer any amount to this account to fund your wallet
                        automatically. Funds reflect instantly with no fees.
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : null}
          </>
        )}

        {/* Paystack Payment Section */}
        {fundingMethod === "paystack" && (
          <>
            {/* Amount Input Section */}
            <View style={styles.inputSection}>
              <Text style={styles.sectionTitle}>Enter Amount</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.00"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  editable={!isLoading}
                  placeholderTextColor="#999"
                />
                <TouchableOpacity
                  style={styles.feeIcon}
                  onPress={() => setShowFeeModal(true)}
                >
                  <Icon name="info-outline" size={20} color="green" />
                </TouchableOpacity>
              </View>

              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountContainer}>
                <Text style={styles.quickAmountLabel}>Quick amounts</Text>
                <View style={styles.quickAmountButtons}>
                  {[1000, 5000, 10000, 20000].map((quickAmount) => (
                    <TouchableOpacity
                      key={quickAmount}
                      style={[
                        styles.quickAmountButton,
                        amount === quickAmount.toString() &&
                          styles.quickAmountButtonActive,
                      ]}
                      onPress={() => handleQuickAmount(quickAmount)}
                    >
                      <Text
                        style={[
                          styles.quickAmountButtonText,
                          amount === quickAmount.toString() &&
                            styles.quickAmountButtonTextActive,
                        ]}
                      >
                        ₦{quickAmount.toLocaleString()}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Fee Breakdown */}
              {amount && parseFloat(amount) > 0 && (
                <View style={styles.feeBreakdown}>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Amount:</Text>
                    <Text style={styles.feeValue}>
                      ₦{parseFloat(amount).toLocaleString()}
                    </Text>
                  </View>
                  <View style={styles.feeRow}>
                    <Text style={styles.feeLabel}>Transaction Fee:</Text>
                    <Text style={styles.feeValue}>
                      ₦{totalFee.toLocaleString()}
                    </Text>
                  </View>
                  <View style={[styles.feeRow, styles.totalRow]}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalValue}>
                      ₦{totalAmount.toLocaleString()}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Fee Information */}
            <View style={styles.feeInfoCard}>
              <View style={styles.feeInfoHeader}>
                <Icon name="info-outline" size={20} color="green" />
                <Text style={styles.feeInfoTitle}>Transaction Fee</Text>
              </View>
              <Text style={styles.feeInfoText}>
                2% service charge + ₦100 for transactions above ₦10,000
              </Text>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={[
                styles.fundButton,
                {
                  opacity:
                    isLoading || !amount || parseFloat(amount) <= 0 ? 0.6 : 1,
                },
              ]}
              onPress={handlePaystackPayment}
              disabled={isLoading || !amount || parseFloat(amount) <= 0}
            >
              {isLoading ? (
                <View style={styles.buttonLoading}>
                  <ActivityIndicator color="#FFF" size="small" />
                  <Text style={[styles.buttonText, { marginLeft: 10 }]}>
                    Processing...
                  </Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Icon name="payment" size={20} color="#FFF" />
                  <Text style={styles.buttonText}>
                    Pay ₦{parseFloat(amount || 0).toLocaleString()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Enhanced Fee Modal */}
      <Modal
        transparent={true}
        visible={showFeeModal}
        onRequestClose={() => setShowFeeModal(false)}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Icon name="info-outline" size={32} color="green" />
              </View>
              <Text style={styles.modalTitle}>Transaction Fees</Text>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.feeRow}>
                <View style={styles.feeItem}>
                  <Text style={styles.feeLabel}>Service Charge</Text>
                  <Text style={styles.feeValue}>2%</Text>
                </View>
                <View style={styles.feeItem}>
                  <Text style={styles.feeLabel}>Additional Fee</Text>
                  <Text style={styles.feeValue}>₦100</Text>
                </View>
              </View>

              <View style={styles.feeNote}>
                <Text style={styles.feeNoteText}>
                  Additional ₦100 fee applies to transactions above ₦10,000
                </Text>
              </View>

              {amount && parseFloat(amount) > 0 && (
                <View style={styles.exampleCalculation}>
                  <Text style={styles.exampleTitle}>
                    For ₦{parseFloat(amount).toLocaleString()}:
                  </Text>
                  <Text style={styles.exampleText}>
                    Service charge: ₦
                    {(parseFloat(amount) * 0.02).toLocaleString()}
                  </Text>
                  {parseFloat(amount) > 10000 && (
                    <Text style={styles.exampleText}>Additional fee: ₦100</Text>
                  )}
                  <Text style={styles.exampleTotal}>
                    Total fee: ₦{calculateFee(amount).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowFeeModal(false)}
            >
              <Text style={styles.modalButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  methodSelectionContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  methodSelectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  methodButtons: {
    flexDirection: "row",
    gap: 12,
  },
  methodButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "#FFFFFF",
  },
  methodButtonActive: {
    backgroundColor: "green",
    borderColor: "green",
  },
  methodButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "green",
    marginLeft: 8,
  },
  methodButtonTextActive: {
    color: "#FFFFFF",
  },

  // Create Account Card Styles
  createAccountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 20,
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
  createAccountIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  createAccountContent: {
    flex: 1,
  },
  createAccountTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  createAccountDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 12,
  },
  benefitsContainer: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  benefitText: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },

  inputSection: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E9ECEF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    marginBottom: 20,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    padding: 0,
  },
  feeIcon: {
    padding: 4,
  },
  quickAmountContainer: {
    marginTop: 8,
  },
  quickAmountLabel: {
    fontSize: 14,
    color: "#6C757D",
    marginBottom: 12,
  },
  quickAmountButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E9ECEF",
    minWidth: 80,
    alignItems: "center",
  },
  quickAmountButtonActive: {
    backgroundColor: "green",
    borderColor: "green",
  },
  quickAmountButtonText: {
    fontSize: 12,
    color: "#6C757D",
    fontWeight: "500",
  },
  quickAmountButtonTextActive: {
    color: "#FFFFFF",
  },
  feeBreakdown: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  feeLabel: {
    fontSize: 14,
    color: "#6C757D",
  },
  feeValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E9ECEF",
    paddingTop: 8,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
  },
  feeInfoCard: {
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "green",
  },
  feeInfoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feeInfoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "green",
    marginLeft: 8,
  },
  feeInfoText: {
    fontSize: 13,
    color: "#1565C0",
    lineHeight: 18,
  },
  fundButton: {
    backgroundColor: "green",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "green",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  buttonLoading: {
    flexDirection: "row",
    alignItems: "center",
  },

  // Loading & Error States
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#DC3545",
    fontWeight: "500",
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: "green",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Virtual Account Styles
  virtualAccountCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#10B981",
  },
  virtualAccountDetails: {
    gap: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9CA3AF",
    marginRight: 4,
  },
  statusDotActive: {
    backgroundColor: "#10B981",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#10B981",
  },
  accountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  accountDetailLabel: {
    fontSize: 13,
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
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  accountInfoText: {
    fontSize: 12,
    color: "#065F46",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },

  // WebView Styles
  webviewHeader: {
    backgroundColor: "#FFF",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonWebView: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    marginLeft: 8,
    color: "green",
    fontSize: 16,
    fontWeight: "500",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 0,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 16,
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  modalBody: {
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  feeItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    marginHorizontal: 4,
  },
  feeNote: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
    marginTop: 16,
  },
  feeNoteText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 16,
  },
  exampleCalculation: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 12,
    color: "#6C757D",
    marginBottom: 4,
  },
  exampleTotal: {
    fontSize: 12,
    fontWeight: "600",
    color: "green",
    marginTop: 4,
  },
  modalButton: {
    backgroundColor: "green",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 24,
    minWidth: 120,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default FundWalletScreen;
