import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Switch,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const BENEFICIARIES_KEY = "electricity_beneficiaries";

const ElectricityPaymentScreen = () => {
  const navigation = useNavigation();

  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData_v2("api/v1/wallet", "wallet");

  const mainBalance = data?.balance;

  const [meterId, setMeterId] = useState("");
  const [walletUnits, setWalletUnits] = useState("");
  const [useEmergency, setUseEmergency] = useState(false);
  const [meterInfo, setMeterInfo] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const [beneficiaries, setBeneficiaries] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [showBeneficiariesExpanded, setShowBeneficiariesExpanded] =
    useState(true);

  const NORMAL_PRICE = 260;
  const EMERGENCY_UNITS = 38;
  const EMERGENCY_DEBT = 10000;
  const MIN_UNITS = 1;
  const MAX_UNITS = 500;
  const SERVICE_CHARGE = 250;
  const SERVICE_CHARGE_DISCOUNT = 100;

  const {
    data: statusResponse,
    isLoading: isLoadingStatus,
    isFetching: isFetchingStatus,
    refetch: refetchStatus,
  } = useFetchData_v2(
    "api/v1/captain/electricty/emergency-status",
    "emergency-status",
  );

  const isStatusLoading = isLoadingStatus || isFetchingStatus;

  const statusData = statusResponse?.data;

  const {
    mutate: checkMeter,
    isLoading: checkMeterLoading,
    isPending: checkMeterPending,
  } = useMutateData_v2(
    "api/v1/captain/electricty/QueryCustomerInfo",
    "POST",
    "billpayment",
  );

  const checkMeterIsPending = checkMeterPending ?? checkMeterLoading;

  const {
    mutate: buyElectricity,
    isLoading: buyLoading,
    isPending: buyPending,
  } = useMutateData_v2(
    "api/v1/captain/electricty/purchase_electricty",
    "POST",
    "buy-electricity",
  );

  const isBuying = buyPending ?? buyLoading;

  const {
    data: payDebtResponse,
    isLoading: payDebtLoading,
    isFetching: payDebtFetching,
    refetch: refetchPayDebt,
  } = useFetchData_v2(
    "api/v1/captain/electricty/UserPayDeptElectricty",
    "pay-debt",
    { enabled: false },
  );
  const isPayingDebt = payDebtLoading || payDebtFetching;

  // ==================== BENEFICIARIES ====================

  const loadBeneficiaries = async () => {
    try {
      const saved = await AsyncStorage.getItem(BENEFICIARIES_KEY);
      if (saved) setBeneficiaries(JSON.parse(saved));
    } catch (e) {
      console.error("Error loading beneficiaries:", e);
    }
  };

  const saveBeneficiaries = async (data) => {
    try {
      await AsyncStorage.setItem(BENEFICIARIES_KEY, JSON.stringify(data));
    } catch (e) {
      console.error("Error saving beneficiaries:", e);
      Alert.alert("Error", "Failed to save beneficiary");
    }
  };

  const addBeneficiary = async () => {
    if (!meterInfo) return;
    const exists = beneficiaries.find((b) => b.meterId === meterId);
    if (exists) {
      Alert.alert(
        "Already Saved",
        `This meter is already saved as "${exists.nickname || "Meter " + exists.meterId.slice(-4)}"`,
      );
      setShowSaveModal(false);
      return;
    }
    if (beneficiaries.length >= 10) {
      Alert.alert(
        "Limit Reached",
        "Maximum 10 beneficiaries. Delete one to add new.",
      );
      setShowSaveModal(false);
      return;
    }
    const newBeneficiary = {
      id: Date.now().toString(),
      meterId,
      nickname: nickname.trim() || "",
      customerName: meterInfo.Customer_name || "",
      customerAddress: meterInfo.Customer_address || "",
      lastUsed: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...beneficiaries, newBeneficiary];
    setBeneficiaries(updated);
    await saveBeneficiaries(updated);
    setShowSaveModal(false);
    setNickname("");
    Alert.alert(
      "✅ Saved Successfully!",
      `"${newBeneficiary.nickname || "Meter " + meterId.slice(-4)}" added to your saved meters.`,
      [{ text: "Got it!", style: "default" }],
    );
  };

  const deleteBeneficiary = async (id) => {
    Alert.alert("Delete Beneficiary", "Remove this beneficiary?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const updated = beneficiaries.filter((b) => b.id !== id);
          setBeneficiaries(updated);
          await saveBeneficiaries(updated);
          Alert.alert("Deleted", "Beneficiary removed");
        },
      },
    ]);
  };

  const useBeneficiary = async (beneficiary) => {
    setMeterId(beneficiary.meterId);
    const updated = beneficiaries.map((b) =>
      b.id === beneficiary.id
        ? { ...b, lastUsed: new Date().toISOString() }
        : b,
    );
    setBeneficiaries(updated);
    await saveBeneficiaries(updated);
    checkMeter(
      { meterId: beneficiary.meterId },
      {
        onSuccess: (response) => {
          if (!response?.data || !response.data[0]) {
            Alert.alert("Error", "No meter information found");
            return;
          }
          setMeterInfo(response.data[0]);
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        },
        onError: (error) => {
          Alert.alert("Error", error?.message || "Failed to verify meter");
          setMeterInfo(null);
        },
      },
    );
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  // ==================== HELPERS ====================

  const calculateTotals = () => {
    const walletUnitsNum = Number(walletUnits) || 0;
    const emergencyUnitsNum = useEmergency ? EMERGENCY_UNITS : 0;
    const totalUnits = walletUnitsNum + emergencyUnitsNum;
    const walletCost = walletUnitsNum * NORMAL_PRICE;
    const emergencyCost = useEmergency ? EMERGENCY_DEBT : 0;
    const serviceChargeDiscount =
      (SERVICE_CHARGE * SERVICE_CHARGE_DISCOUNT) / 100;
    const serviceChargeFinal = SERVICE_CHARGE - serviceChargeDiscount;
    return {
      walletUnits: walletUnitsNum,
      emergencyUnits: emergencyUnitsNum,
      totalUnits,
      walletCost,
      emergencyCost,
      serviceChargeOriginal: SERVICE_CHARGE,
      serviceChargeDiscount,
      serviceChargeFinal,
      payNow: walletCost + serviceChargeFinal,
      oweAfter: emergencyCost,
    };
  };

  const handleCheckMeter = () => {
    if (!meterId || meterId.length !== 11 || !/^\d+$/.test(meterId)) {
      Alert.alert("Error", "Please enter a valid 11-digit meter ID");
      return;
    }
    checkMeter(
      { meterId },
      {
        onSuccess: (response) => {
          if (!response?.data || !response.data[0]) {
            Alert.alert("Error", "No meter information found");
            return;
          }
          setMeterInfo(response.data[0]);
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.05,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
          Alert.alert("Success", "Meter verified! ⚡");
        },
        onError: (error) => {
          Alert.alert("Error", error?.message || "Failed to verify meter");
          setMeterInfo(null);
        },
      },
    );
  };

  const handlePayDebt = () => {
    Alert.alert(
      "Pay Debt",
      `Deduct ₦${EMERGENCY_DEBT.toLocaleString()} from your wallet?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await refetchPayDebt();
              if (result.data?.success) {
                Alert.alert(
                  "Debt Paid! ✅",
                  `₦${result.data.data.debtPaid.toLocaleString()} deducted\n` +
                    `${result.data.data.unitsRepaid} units restored\n` +
                    `Wallet: ₦${result.data.data.newWalletBalance.toLocaleString()}`,
                );
                refetchStatus();
              }
            } catch (error) {
              Alert.alert("Error", error.message || "Payment failed");
            }
          },
        },
      ],
    );
  };

  const handlePayment = () => {
    const totals = calculateTotals();
    if (!meterId || !meterInfo) {
      Alert.alert("Error", "Please verify the meter first");
      return;
    }
    if (totals.totalUnits < MIN_UNITS) {
      Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} unit`);
      return;
    }
    if (totals.totalUnits > MAX_UNITS) {
      Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
      return;
    }
    if (totals?.walletUnits > statusData?.maxWalletUnits) {
      Alert.alert("Error", `Max wallet units: ${statusData?.maxWalletUnits}`);
      return;
    }

    let msg = `Buy ${totals.totalUnits} units?\n\n`;
    if (totals.walletUnits > 0)
      msg += `💰 Wallet: ${totals.walletUnits} units = ₦${totals.walletCost.toLocaleString()}\n`;
    if (useEmergency)
      msg += `⚡ Emergency: ${EMERGENCY_UNITS} units = ₦${EMERGENCY_DEBT.toLocaleString()} (owed)\n`;
    msg += `🎁 Service Charge: ₦0 (100% OFF!)\n\nPay Now: ₦${totals.payNow.toLocaleString()}`;
    if (useEmergency) msg += `\nWill Owe: ₦${totals.oweAfter.toLocaleString()}`;

    console.log({
      meterId,
      units: totals.walletUnits,
      useEmergency,
    });

    Alert.alert("Confirm", msg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Buy",
        onPress: () => {
          buyElectricity(
            { meterId, units: totals.walletUnits, useEmergency },
            {
              onSuccess: (data) => {
                let successMsg = `Token: ${data.data.token}\nUnits: ${data.data.totalUnits} kWh`;
                if (data.data.emergencyUnits > 0)
                  successMsg += `\n\nDebt: ₦${data.data.emergencyAmountOwed.toLocaleString()}`;
                successMsg += `\nWallet: ₦${data.data.newWalletBalance.toLocaleString()}`;
                Alert.alert("Success! 🎉", successMsg, [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
                refetchStatus();
              },
              // onError: (error) =>
              //   console.log({
              //     yuuu: error,
              //   }),

              onError: (error) =>
                Alert.alert("Error", error.message || "Purchase failed"),
              // Alert.alert("Error", error.message || "Purchase failed"),
            },
          );
        },
      },
    ]);
  };

  const handleMeterIdChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setMeterId(numericText);
    if (meterInfo) setMeterInfo(null);
  };

  const handleWalletUnitsChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    const num = Number(numericText) || 0;
    if (numericText === "" || num <= statusData?.maxWalletUnits)
      setWalletUnits(numericText);
  };

  const totals = calculateTotals();
  const isValidPurchase =
    totals.totalUnits >= MIN_UNITS && totals.totalUnits <= MAX_UNITS;
  const hasDebt = statusData?.emergency?.hasDebt || false;
  const canUseEmergency = statusData?.emergency?.canUse || false;
  const canPayDebt = hasDebt && statusData?.walletBalance >= EMERGENCY_DEBT;

  // ==================== RENDER ====================

  const renderSaveBeneficiaryModal = () => (
    <Modal
      visible={showSaveModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowSaveModal(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 24,
            width: "85%",
            maxWidth: 400,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: "#DBEAFE",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <MaterialCommunityIcons
                name="content-save"
                size={20}
                color="#3B82F6"
              />
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>
              Save as Beneficiary
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>
              Meter ID
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>
              ****{meterId.slice(-4)}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#6B7280",
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              Customer
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "600", color: "#374151" }}>
              {meterInfo?.Customer_name}
            </Text>
          </View>
          <View style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#374151",
                marginBottom: 8,
              }}
            >
              Nickname (Optional)
            </Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder="e.g., Home, Mom's House, Office"
              style={{
                borderWidth: 2,
                borderColor: "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                fontSize: 14,
                backgroundColor: "#F9FAFB",
              }}
              maxLength={30}
            />
            <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
              Give this meter a friendly name
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setShowSaveModal(false);
                setNickname("");
              }}
              style={{
                flex: 1,
                backgroundColor: "#F3F4F6",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#6B7280" }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={addBeneficiary}
              style={{
                flex: 1,
                backgroundColor: "#3B82F6",
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
                💾 Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // ── Compact empty state — same size/feel as emergency card ──
  const renderEmptyBeneficiariesState = () => {
    if (beneficiaries.length > 0) return null;
    return (
      <View
        style={{
          backgroundColor: "#EFF6FF",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: "#3B82F6",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#DBEAFE",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 12,
            flexShrink: 0,
          }}
        >
          <MaterialCommunityIcons
            name="bookmark-multiple-outline"
            size={20}
            color="#3B82F6"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#1E40AF",
              marginBottom: 3,
            }}
          >
            💾 No saved meters yet
          </Text>
          <Text style={{ fontSize: 12, color: "#6B7280", lineHeight: 17 }}>
            Verify a meter below, then tap Save for quick access next time
          </Text>
        </View>
      </View>
    );
  };

  const renderBeneficiariesList = () => {
    if (beneficiaries.length === 0) return null;
    const sorted = [...beneficiaries].sort(
      (a, b) => new Date(b.lastUsed) - new Date(a.lastUsed),
    );
    return (
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 20,
          padding: 16,
          marginBottom: 20,
          elevation: 3,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            setShowBeneficiariesExpanded(!showBeneficiariesExpanded)
          }
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: showBeneficiariesExpanded ? 16 : 0,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons
              name="bookmark-multiple"
              size={20}
              color="#3B82F6"
            />
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#1F2937",
                marginLeft: 8,
              }}
            >
              💾 Saved Meters ({beneficiaries.length})
            </Text>
          </View>
          <MaterialCommunityIcons
            name={showBeneficiariesExpanded ? "chevron-up" : "chevron-down"}
            size={24}
            color="#6B7280"
          />
        </TouchableOpacity>
        {showBeneficiariesExpanded &&
          sorted.map((beneficiary, index) => (
            <View
              key={beneficiary.id}
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 12,
                padding: 14,
                marginBottom: index < sorted.length - 1 ? 10 : 0,
                borderLeftWidth: 4,
                borderLeftColor: "#3B82F6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1F2937",
                      marginBottom: 4,
                    }}
                  >
                    {beneficiary.nickname ||
                      `Meter ${beneficiary.meterId.slice(-4)}`}
                  </Text>
                  <Text
                    style={{ fontSize: 13, color: "#374151", marginBottom: 2 }}
                  >
                    {beneficiary.customerName}
                  </Text>
                  <Text style={{ fontSize: 11, color: "#6B7280" }}>
                    ****{beneficiary.meterId.slice(-4)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#9CA3AF",
                      marginTop: 6,
                      fontStyle: "italic",
                    }}
                  >
                    Last used:{" "}
                    {new Date(beneficiary.lastUsed).toLocaleDateString()}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => useBeneficiary(beneficiary)}
                    style={{
                      backgroundColor: "#3B82F6",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                    }}
                  >
                    <Text
                      style={{ fontSize: 12, fontWeight: "700", color: "#fff" }}
                    >
                      Use
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteBeneficiary(beneficiary.id)}
                    style={{
                      backgroundColor: "#FEE2E2",
                      borderRadius: 8,
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="delete"
                      size={16}
                      color="#DC2626"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
      </View>
    );
  };

  const renderWalletCard = () => (
    <View
      style={{
        backgroundColor: "#EFF6FF",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
          <View>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              Wallet Balance
            </Text>
            {isFetchingStatus ? (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ActivityIndicator size="small" color="#1E40AF" />
                <Text style={{ fontSize: 14, color: "#6B7280", marginLeft: 8 }}>
                  Updating...
                </Text>
              </View>
            ) : (
              <>
                <Text
                  style={{ fontSize: 20, fontWeight: "700", color: "#1E40AF" }}
                >
                  {/* ₦ {mainBalance} */}₦{mainBalance?.toFixed(2) || "0.00"}
                </Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>
                  Max {statusData?.maxWalletUnits || 0} units
                </Text>
              </>
            )}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => refetchStatus()}
          disabled={isFetchingStatus}
          style={{
            backgroundColor: isFetchingStatus ? "#9CA3AF" : "#DBEAFE",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          {isFetchingStatus ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
              Refresh
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDebtWarning = () => {
    if (!hasDebt) return null;
    const shortfall = EMERGENCY_DEBT - statusData?.walletBalance;
    return (
      <View
        style={{
          backgroundColor: "#FEE2E2",
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: "#DC2626",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 24, marginRight: 10 }}>🔒</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#DC2626" }}>
            Purchases Locked
          </Text>
        </View>
        <Text style={{ fontSize: 14, color: "#7F1D1D", marginBottom: 12 }}>
          Clear your ₦{EMERGENCY_DEBT.toLocaleString()} debt to continue.
        </Text>
        <View
          style={{
            backgroundColor: "#FECACA",
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Debt:</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}>
              ₦{EMERGENCY_DEBT.toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: shortfall > 0 ? 8 : 0,
            }}
          >
            <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Wallet:</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#7F1D1D" }}>
              ₦{statusData?.walletBalance?.toLocaleString()}
              {/* ₦{mainBalance.toFixed(2) || "0.00"} */}
            </Text>
          </View>
          {shortfall > 0 && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Need:</Text>
              <Text
                style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}
              >
                ₦{shortfall.toLocaleString()}
              </Text>
            </View>
          )}
        </View>
        {canPayDebt ? (
          <TouchableOpacity
            onPress={handlePayDebt}
            disabled={isPayingDebt}
            style={{
              backgroundColor: isPayingDebt ? "#9CA3AF" : "#059669",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            {isPayingDebt ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
                >
                  ✓ Pay ₦{EMERGENCY_DEBT.toLocaleString()} Now
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  Deduct from wallet
                </Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <View
            style={{
              backgroundColor: "#FCA5A5",
              borderRadius: 12,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#7F1D1D", fontWeight: "600", fontSize: 14 }}>
              ❌ Insufficient Balance
            </Text>
            <Text style={{ color: "#7F1D1D", fontSize: 12, marginTop: 2 }}>
              Fund ₦{shortfall.toLocaleString()} more
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderEmergencyStatusCard = () => {
    if (isStatusLoading) {
      return (
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      );
    }
    if (!statusData?.isEligible) {
      const progress = statusData?.eligibilityProgress;
      return (
        <View
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
              Unlock Emergency Units
            </Text>
          </View>
          <View
            style={{
              height: 10,
              backgroundColor: "#E5E7EB",
              borderRadius: 5,
              overflow: "hidden",
              marginBottom: 8,
            }}
          >
            <View
              style={{
                height: "100%",
                width: `${progress?.percentage || 0}%`,
                backgroundColor: "#3B82F6",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              ₦{(progress?.current || 0).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              ₦{(progress?.required || 100000).toLocaleString()}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "#6B7280",
              marginTop: 10,
              textAlign: "center",
            }}
          >
            Spend ₦{(progress?.remaining || 0).toLocaleString()} more to unlock
          </Text>
        </View>
      );
    }
    return (
      <View
        style={{
          backgroundColor: canUseEmergency ? "#ECFDF5" : "#FEF3C7",
          borderRadius: 16,
          padding: 16,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: canUseEmergency ? "#10B981" : "#F59E0B",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <Text style={{ fontSize: 20, marginRight: 8 }}>⚡</Text>
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: canUseEmergency ? "#065F46" : "#92400E",
            }}
          >
            Emergency: {EMERGENCY_UNITS} units = ₦
            {EMERGENCY_DEBT.toLocaleString()}
          </Text>
        </View>
        <Text style={{ fontSize: 12, color: "#6B7280" }}>
          {canUseEmergency
            ? "Available to use"
            : "Currently in use (pay debt first)"}
        </Text>
      </View>
    );
  };

  const renderPurchaseForm = () => {
    if (hasDebt) return null;
    return (
      <>
        {/* ── Meter Input ── */}
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            padding: 20,
            marginBottom: 20,
            elevation: 3,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 10,
            }}
          >
            🔢 Meter ID
          </Text>

          {/* Verify button ABOVE the input so keyboard never covers it */}
          {meterId.length === 11 && !meterInfo && (
            <TouchableOpacity
              onPress={handleCheckMeter}
              disabled={checkMeterIsPending}
              style={{
                backgroundColor: checkMeterIsPending ? "#9CA3AF" : "#3B82F6",
                borderRadius: 12,
                paddingVertical: 13,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                marginBottom: 10,
                elevation: 3,
              }}
            >
              {checkMeterIsPending ? (
                <>
                  <ActivityIndicator color="#fff" size="small" />
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      fontSize: 15,
                      marginLeft: 8,
                    }}
                  >
                    Verifying...
                  </Text>
                </>
              ) : (
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}
                >
                  ⚡ Verify Meter
                </Text>
              )}
            </TouchableOpacity>
          )}

          <TextInput
            value={meterId}
            onChangeText={handleMeterIdChange}
            placeholder="Enter 11-digit meter ID"
            keyboardType="numeric"
            maxLength={11}
            style={{
              borderWidth: 2,
              borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
              borderRadius: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              fontSize: 16,
              backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
            }}
          />
          {meterId.length > 0 && meterId.length !== 11 && (
            <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 6 }}>
              ⚠️ {meterId.length}/11 digits
            </Text>
          )}
        </View>

        {/* ── Verified meter info ── */}
        {meterInfo && (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              backgroundColor: "#ECFDF5",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#10B981",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#10B981",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: "#065F46",
                    marginBottom: 4,
                  }}
                >
                  Meter Verified!
                </Text>
                <Text style={{ fontSize: 13, color: "#374151" }}>
                  {meterInfo?.Customer_name}
                </Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>
                  {meterInfo?.Customer_address}
                </Text>
              </View>
            </View>
            {!beneficiaries.find((b) => b.meterId === meterId) ? (
              <TouchableOpacity
                onPress={() => setShowSaveModal(true)}
                style={{
                  backgroundColor: "#3B82F6",
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  elevation: 4,
                }}
              >
                <MaterialCommunityIcons
                  name="content-save"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}
                >
                  💾 Save This Meter for Later
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  backgroundColor: "#E0E7FF",
                  borderRadius: 10,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#4F46E5"
                  style={{ marginRight: 6 }}
                />
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#4F46E5" }}
                >
                  ✓ Already saved as beneficiary
                </Text>
              </View>
            )}
          </Animated.View>
        )}

        {/* ── Units Input ── */}
        {meterInfo && (
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 20,
              padding: 20,
              marginBottom: 20,
              elevation: 3,
            }}
          >
            <View style={{ marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: 8,
                }}
              >
                💰 Units from Wallet (₦{NORMAL_PRICE}/unit)
              </Text>
              <TextInput
                value={walletUnits}
                onChangeText={handleWalletUnitsChange}
                placeholder="0"
                keyboardType="numeric"
                style={{
                  borderWidth: 2,
                  borderColor: walletUnits ? "#3B82F6" : "#E5E7EB",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 24,
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "#F9FAFB",
                }}
              />
              <Text
                style={{
                  fontSize: 11,
                  color: "#6B7280",
                  marginTop: 6,
                  textAlign: "center",
                }}
              >
                Max: {statusData?.maxWalletUnits || 0} units
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  gap: 8,
                }}
              >
                {[5, 10, 20, statusData?.maxWalletUnits || 0]
                  .filter(
                    (v, i, a) =>
                      a.indexOf(v) === i &&
                      v > 0 &&
                      v <= (statusData?.maxWalletUnits || 0),
                  )
                  .slice(0, 4)
                  .map((unit) => (
                    <TouchableOpacity
                      key={unit}
                      onPress={() => setWalletUnits(unit.toString())}
                      style={{
                        flex: 1,
                        backgroundColor:
                          walletUnits === unit.toString()
                            ? "#3B82F6"
                            : "#F3F4F6",
                        borderRadius: 8,
                        paddingVertical: 8,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "600",
                          color:
                            walletUnits === unit.toString()
                              ? "#fff"
                              : "#374151",
                        }}
                      >
                        {unit}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>

            {statusData?.isEligible && canUseEmergency && (
              <View
                style={{
                  backgroundColor: useEmergency ? "#FEF3C7" : "#F9FAFB",
                  borderRadius: 12,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: useEmergency ? "#F59E0B" : "#E5E7EB",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: "#374151",
                      }}
                    >
                      ⚡ Add Emergency Units
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                    >
                      {EMERGENCY_UNITS} units • ₦
                      {EMERGENCY_DEBT.toLocaleString()} debt
                    </Text>
                  </View>
                  <Switch
                    value={useEmergency}
                    onValueChange={setUseEmergency}
                    trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
                    thumbColor={useEmergency ? "#F59E0B" : "#9CA3AF"}
                  />
                </View>
                {useEmergency && (
                  <View
                    style={{
                      backgroundColor: "#FEF3C7",
                      borderRadius: 8,
                      padding: 8,
                      marginTop: 12,
                    }}
                  >
                    <Text style={{ fontSize: 11, color: "#92400E" }}>
                      ⚠️ Debt auto-deducted from wallet when you fund
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* ── Summary ── */}
        {meterInfo && isValidPurchase && (
          <View
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: "#374151",
                marginBottom: 12,
              }}
            >
              Summary
            </Text>
            {totals.walletUnits > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 13, color: "#6B7280" }}>
                  💰 {totals.walletUnits} × ₦{NORMAL_PRICE}
                </Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}
                >
                  ₦{totals.walletCost.toLocaleString()}
                </Text>
              </View>
            )}
            {useEmergency && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 13, color: "#F59E0B" }}>
                  ⚡ {EMERGENCY_UNITS} units
                </Text>
                <Text
                  style={{ fontSize: 13, fontWeight: "600", color: "#F59E0B" }}
                >
                  ₦{EMERGENCY_DEBT.toLocaleString()}
                </Text>
              </View>
            )}
            <View
              style={{
                backgroundColor: "#ECFDF5",
                borderRadius: 8,
                padding: 10,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: "#A7F3D0",
                borderStyle: "dashed",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>
                    🎁 Service Charge
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#10B981",
                      borderRadius: 4,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}
                    >
                      100% OFF
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      textDecorationLine: "line-through",
                    }}
                  >
                    ₦{SERVICE_CHARGE.toLocaleString()}
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: "#10B981",
                    }}
                  >
                    ₦0
                  </Text>
                </View>
              </View>
              <Text
                style={{
                  fontSize: 10,
                  color: "#059669",
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                You save ₦{SERVICE_CHARGE.toLocaleString()}! 🎉
              </Text>
            </View>
            <View
              style={{
                height: 1,
                backgroundColor: "#E5E7EB",
                marginVertical: 10,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
              >
                Total:
              </Text>
              <Text
                style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
              >
                {totals.totalUnits} kWh
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#059669" }}
              >
                Pay Now:
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
              >
                ₦{totals.payNow.toLocaleString()}
              </Text>
            </View>
            {useEmergency && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}
                >
                  Will Owe:
                </Text>
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#DC2626" }}
                >
                  ₦{totals.oweAfter.toLocaleString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* ── Buy Button ── */}
        {meterInfo && isValidPurchase && (
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isBuying}
            style={{
              backgroundColor: isBuying
                ? "#9CA3AF"
                : useEmergency
                  ? "#F59E0B"
                  : "#3B82F6",
              borderRadius: 16,
              paddingVertical: 18,
              elevation: 5,
            }}
          >
            {isBuying ? (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ActivityIndicator color="#fff" />
                <Text
                  style={{
                    color: "#fff",
                    marginLeft: 10,
                    fontSize: 16,
                    fontWeight: "700",
                  }}
                >
                  Processing...
                </Text>
              </View>
            ) : (
              <View>
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontSize: 18,
                    fontWeight: "700",
                  }}
                >
                  ⚡ Buy {totals.totalUnits} Units
                </Text>
                <Text
                  style={{
                    color: "rgba(255,255,255,0.8)",
                    textAlign: "center",
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Pay ₦{totals.payNow.toLocaleString()}
                  {useEmergency &&
                    ` • Owe ₦${totals.oweAfter.toLocaleString()}`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </>
    );
  };

  return (
    <ScreenWrapper
      title="Buy Electricity ⚡"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 60}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "#F8FAFC" }}
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {renderWalletCard()}
          {renderDebtWarning()}
          {renderEmergencyStatusCard()}
          {renderEmptyBeneficiariesState()}
          {renderBeneficiariesList()}
          {renderPurchaseForm()}

          {!meterInfo && !hasDebt && beneficiaries.length > 0 && (
            <View
              style={{
                backgroundColor: "#F9FAFB",
                borderRadius: 16,
                padding: 16,
                marginTop: 8,
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "#6B7280",
                  fontSize: 13,
                  fontStyle: "italic",
                }}
              >
                💡 Select a saved meter or enter a new meter ID above
              </Text>
            </View>
          )}

          <View style={{ marginTop: 24 }}>
            <Text
              style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}
            >
              Wallet: ₦{NORMAL_PRICE}/unit • Emergency: {EMERGENCY_UNITS} units
              = ₦{EMERGENCY_DEBT.toLocaleString()}
            </Text>
            <Text
              style={{
                textAlign: "center",
                fontSize: 10,
                color: "#10B981",
                marginTop: 4,
                fontWeight: "600",
              }}
            >
              🎁 Service Charge: FREE (100% discount applied!)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {renderSaveBeneficiaryModal()}
    </ScreenWrapper>
  );
};

export default ElectricityPaymentScreen;
