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
import axios from "axios";
import Constants from "expo-constants";
import { useDispatch, useSelector } from "react-redux";
import { useFetchData } from "../../../hooks/Request";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

const FundWalletScreen = ({ navigation }) => {
  // State for Paystack payment
  const [amount, setAmount] = useState("");
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [webviewstart, setwebviewstart] = useState(false);
  const [webviewdata, setwebviewdata] = useState(null);
  const [webviewLoading, setWebviewLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // State for funding method selection
  const [fundingMethod, setFundingMethod] = useState("paystack"); // 'paystack' or 'transfer'
  const [isVirtualAccountExpanded, setIsVirtualAccountExpanded] =
    useState(true);

  const dispatch = useDispatch();
  const webViewRef = useRef(null);

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

  // Fetch wallet data
  const {
    data: walletData,
    isLoading: isLoadingData,
    error: walletError,
    refetch: refetchWallet,
  } = useFetchData("wallet", "wallet");

  // Fetch virtual account data
  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    error: virtualAccountError,
    refetch: refetchVirtualAccount,
  } = useFetchData("api/v3/bank/singleUser", "virtual-account");

  const {
    data: get_user_info,
    isLoading: isLoadingget_user_info,
    error: isErrorget_user_info,
    refetch: refetchget_user_info,
  } = useFetchData_v2("api/v1/user", "getuser");

  console.log({
    tttyy: get_user_info,
  });

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
  const handleCopyToClipboard = useCallback((text) => {
    Clipboard.setString(text);
    Alert.alert("Copied!", "Copied to clipboard");
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
          userid: userProfile_data?.user?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user_data?.token}`,
          },
          timeout: 30000,
        }
      );

      console.log("Payment initialization response:", response.data?.data);

      if (response.data?.data) {
        setwebviewstart(true);
        setwebviewdata(response.data?.data);
        setWebviewLoading(true);
      } else {
        Alert.alert(
          "Payment Error",
          "Failed to initialize payment. Please try again."
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
      console.log("WebView Navigation State Changed:", url);

      if (!loading) {
        setWebviewLoading(false);
      }

      // Handle Paystack redirects
      if (url.includes("https://standard.paystack.co/close")) {
        console.log("Paystack close URL detected");
        setwebviewstart(false);
        Alert.alert(
          "Payment Completed",
          "Payment process completed. Please check your wallet balance.",
          [
            {
              text: "OK",
              onPress: () => {
                refetchWallet();
                navigation.goBack();
              },
            },
          ]
        );
        return false;
      }

      if (url.includes("payment-success")) {
        console.log("Success callback detected");
        setwebviewstart(false);
        Alert.alert("Success!", "Payment completed successfully!", [
          {
            text: "OK",
            onPress: () => {
              refetchWallet();
              navigation.goBack();
            },
          },
        ]);
        return false;
      }

      if (url.includes("payment-cancel")) {
        console.log("Cancel callback detected");
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
    [navigation, refetchWallet]
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
      ]
    );
  }, []);

  const handleQuickAmount = useCallback((quickAmount) => {
    setAmount(quickAmount.toString());
  }, []);

  // Calculate total amount including fees for Paystack
  const totalFee = calculateFee(amount);
  const totalAmount = parseFloat(amount || 0) + totalFee;

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
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
              `Error loading payment page: ${nativeEvent.description}`
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
        {/* Current Balance Display */}
        {walletData?.balance !== undefined && (
          <View style={styles.balanceCard}>
            <View style={styles.balanceContent}>
              <Icon name="account-balance-wallet" size={48} color="green" />
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceAmount}>
                ₦{walletData.balance.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Funding Method Selection */}
        <View style={styles.methodSelectionContainer}>
          <Text style={styles.methodSelectionTitle}>Choose Funding Method</Text>
          <View style={styles.methodButtons}>
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
          </View>
        </View>

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

        {/* Bank Transfer Section */}
        {/* {fundingMethod === "transfer" && virtualAccountData?.data && (
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
                      ⚠️ A transaction fee of ₦250 applies per transaction.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )} */}
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
  balanceCard: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  balanceContent: {
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6C757D",
    marginTop: 12,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "green",
    marginTop: 4,
  },
  methodSelectionContainer: {
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
    marginBottom: 8,
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
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
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
