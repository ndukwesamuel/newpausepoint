import React, { useState } from "react";
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
} from "react-native";
import { useSelector } from "react-redux";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const ElectricityPaymentScreen = () => {
  const { user_data } = useSelector((state) => state.AuthSlice);
  const navigation = useNavigation();

  const [meterId, setMeterId] = useState("");
  const [walletUnits, setWalletUnits] = useState("");
  const [useEmergency, setUseEmergency] = useState(false); // Toggle instead of input
  const [meterInfo, setMeterInfo] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Constants
  const NORMAL_PRICE = 260;
  const EMERGENCY_UNITS = 38;
  const EMERGENCY_DEBT = 10000;
  const MIN_UNITS = 1;
  const MAX_UNITS = 500;

  // Fetch emergency status
  const {
    data: statusResponse,
    isLoading: isLoadingStatus,
    refetch: refetchStatus,
  } = useFetchData("api/captainv4/emergency-status", "emergency-status");

  const statusData = statusResponse?.data || {
    walletBalance: 0,
    maxWalletUnits: 0,
    normalPricePerUnit: 260,
    isEligible: false,
    hasAccount: false,
    eligibilityProgress: {
      current: 0,
      required: 100000,
      remaining: 100000,
      percentage: 0,
    },
    emergency: null,
  };

  // Mutations
  const { mutate: checkMeter, isLoading: checkMeterIsPending } = useMutateData(
    "api/captain/vend",
    "POST",
    "billpayment",
  );

  const { mutate: buyElectricity, isLoading: isBuying } = useMutateData(
    "api/captainv4/buy/v4",
    "POST",
    "buy-electricity",
  );

  const { mutate: payDebt, isLoading: isPayingDebt } = useMutateData(
    "api/captainv4/paydebt",
    "GET",
    "pay-debt",
  );

  // Calculate totals
  const calculateTotals = () => {
    const walletUnitsNum = Number(walletUnits) || 0;
    const emergencyUnitsNum = useEmergency ? EMERGENCY_UNITS : 0;
    const totalUnits = walletUnitsNum + emergencyUnitsNum;
    const walletCost = walletUnitsNum * NORMAL_PRICE;
    const emergencyCost = useEmergency ? EMERGENCY_DEBT : 0;

    return {
      walletUnits: walletUnitsNum,
      emergencyUnits: emergencyUnitsNum,
      totalUnits,
      walletCost,
      emergencyCost,
      payNow: walletCost,
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
              toValue: 1.1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 200,
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
      `Deduct ₦${EMERGENCY_DEBT.toLocaleString()} from your wallet to clear your debt?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay Now",
          style: "destructive",
          onPress: () => {
            payDebt(
              {},
              {
                onSuccess: (data) => {
                  Alert.alert(
                    "Debt Paid! ✅",
                    `₦${data.data.debtPaid.toLocaleString()} deducted\n` +
                      `${data.data.unitsRepaid} emergency units restored\n` +
                      `Wallet: ₦${data.data.newWalletBalance.toLocaleString()}`,
                  );
                  refetchStatus();
                },
                onError: (error) => {
                  Alert.alert("Error", error.message || "Payment failed");
                },
              },
            );
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

    if (totals.walletUnits > statusData.maxWalletUnits) {
      Alert.alert("Error", `Max wallet units: ${statusData.maxWalletUnits}`);
      return;
    }

    let msg = `Buy ${totals.totalUnits} units?\n\n`;
    if (totals.walletUnits > 0) {
      msg += `💰 Wallet: ${
        totals.walletUnits
      } units = ₦${totals.walletCost.toLocaleString()}\n`;
    }
    if (useEmergency) {
      msg += `⚡ Emergency: ${EMERGENCY_UNITS} units = ₦${EMERGENCY_DEBT.toLocaleString()} (owed)\n`;
    }
    msg += `\nPay Now: ₦${totals.payNow.toLocaleString()}`;
    if (useEmergency) {
      msg += `\nWill Owe: ₦${totals.oweAfter.toLocaleString()}`;
    }

    Alert.alert("Confirm", msg, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Buy",
        onPress: () => {
          buyElectricity(
            {
              meterId,
              walletUnits: totals.walletUnits,
              useEmergency: useEmergency,
            },
            {
              onSuccess: (data) => {
                let successMsg = `Token: ${data.data.token}\nUnits: ${data.data.totalUnits} kWh`;
                if (data.data.emergencyUnits > 0) {
                  successMsg += `\n\nDebt: ₦${data.data.emergencyAmountOwed.toLocaleString()}`;
                }
                successMsg += `\nWallet: ₦${data.data.newWalletBalance.toLocaleString()}`;

                Alert.alert("Success! 🎉", successMsg, [
                  { text: "OK", onPress: () => navigation.goBack() },
                ]);
                refetchStatus();
              },
              onError: (error) => {
                Alert.alert("Error", error.message || "Purchase failed");
              },
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
    if (numericText === "" || num <= statusData.maxWalletUnits) {
      setWalletUnits(numericText);
    }
  };

  const totals = calculateTotals();
  const isValidPurchase =
    totals.totalUnits >= MIN_UNITS && totals.totalUnits <= MAX_UNITS;
  const hasDebt = statusData.emergency?.hasDebt || false;
  const canUseEmergency = statusData.emergency?.canUse || false;
  const canPayDebt = hasDebt && statusData.walletBalance >= EMERGENCY_DEBT;

  // ==================== RENDER ====================

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
            <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E40AF" }}>
              ₦{(statusData.walletBalance || 0).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              Max {statusData.maxWalletUnits || 0} units
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => refetchStatus()}
          style={{
            backgroundColor: "#DBEAFE",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDebtWarning = () => {
    if (!hasDebt) return null;
    const shortfall = EMERGENCY_DEBT - statusData.walletBalance;

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
              ₦{statusData.walletBalance.toLocaleString()}
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
    if (isLoadingStatus) {
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

    if (!statusData.isEligible) {
      const progress = statusData.eligibilityProgress;
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
        {/* Meter Input */}
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
              marginBottom: 8,
            }}
          >
            🔢 Meter ID
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <TextInput
              value={meterId}
              onChangeText={handleMeterIdChange}
              placeholder="Enter 11-digit meter ID"
              keyboardType="numeric"
              maxLength={11}
              style={{
                flex: 1,
                borderWidth: 2,
                borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 12,
                marginRight: 10,
                fontSize: 16,
                backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
              }}
            />
            {meterId.length === 11 && !meterInfo && (
              <TouchableOpacity
                onPress={handleCheckMeter}
                disabled={checkMeterIsPending}
                style={{
                  backgroundColor: checkMeterIsPending ? "#9CA3AF" : "#3B82F6",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  justifyContent: "center",
                }}
              >
                {checkMeterIsPending ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "700" }}>
                    Verify
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {meterId.length > 0 && meterId.length !== 11 && (
            <Text style={{ color: "#F59E0B", fontSize: 12 }}>
              ⚠️ {meterId.length}/11 digits
            </Text>
          )}
        </View>

        {/* Meter Info */}
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
            <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          </Animated.View>
        )}

        {/* Units Input */}
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
            {/* Wallet Units */}
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
                Max: {statusData.maxWalletUnits || 0} units
              </Text>

              {/* Quick Select */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                  gap: 8,
                }}
              >
                {[5, 10, 20, statusData.maxWalletUnits || 0]
                  .filter(
                    (v, i, a) =>
                      a.indexOf(v) === i &&
                      v > 0 &&
                      v <= (statusData.maxWalletUnits || 0),
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

            {/* Emergency Toggle */}
            {statusData.isEligible && canUseEmergency && (
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

        {/* Summary */}
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

        {/* Buy Button */}
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
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F8FAFC" }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {renderWalletCard()}
        {renderDebtWarning()}
        {renderEmergencyStatusCard()}
        {renderPurchaseForm()}

        {!meterInfo && !hasDebt && (
          <View
            style={{
              backgroundColor: "#F9FAFB",
              borderRadius: 16,
              padding: 16,
              marginTop: 20,
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
              💡 Enter meter ID to continue
            </Text>
          </View>
        )}

        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}>
            Wallet: ₦{NORMAL_PRICE}/unit • Emergency: {EMERGENCY_UNITS} units =
            ₦{EMERGENCY_DEBT.toLocaleString()}
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ElectricityPaymentScreen;
