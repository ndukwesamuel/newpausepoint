import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import axios from "axios";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const ElectricityPaymentScreen = () => {
  const { user } = useSelector((state) => state.AuthSlice);

  const navigation = useNavigation();

  const [meterId, setMeterId] = useState("");
  const [units, setUnits] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [meterInfo, setMeterInfo] = useState(null);

  const {
    mutate: checkMeter,
    isLoading: checkMeterispending,
    error,
  } = useMutateData("api/captain/vend", "POST", "billpayment");

  const {
    mutate: paybillsmeter,
    isLoading: paybillsmeterispending,
    error: errorpaybillsmeter,
  } = useMutateData("api/captain/buy", "POST", "billpayment");

  const {
    data: electRate,
    isLoading: electRateIsloading,
    error: electRateError,
  } = useFetchData("api/captain/electricity-rates", "history_info");

  // Constants (should match backend)
  const amountPerUnit = 230;
  const vatPerUnit = 30;
  const serviceFeePerUnit = 10;

  // const calculateCosts = () => {
  //   const u = Number(units) || 0;
  //   const amount = u * amountPerUnit;
  //   const vat = u * vatPerUnit;
  //   const service = u * serviceFeePerUnit;
  //   const total = amount + vat + service;
  //   return { amount, vat, service, total };
  // };

  const calculateCosts = () => {
    const u = Number(units) || 0;
    const amount = u * (electRate?.amountPerUnit || 0);
    const vat = u * (electRate?.vatPerUnit || 0);
    const service = u * (electRate?.serviceFeePerUnit || 0);
    const total = amount + vat + service;
    return { amount, vat, service, total };
  };
  const handleCheckMeter = async () => {
    // Validation checks
    if (!meterId) {
      Alert.alert("Error", "Please enter meter ID");
      return;
    }

    if (meterId.length !== 11) {
      Alert.alert("Error", "Meter ID must be exactly 11 digits");
      return;
    }

    // Check if meterId contains only numbers
    if (!/^\d+$/.test(meterId)) {
      Alert.alert("Error", "Meter ID must contain only numbers");
      return;
    }

    let data = {
      meterId,
    };

    checkMeter(data, {
      onSuccess: (response) => {
        try {
          console.log({
            jaja: response?.data[0],
          });

          if (!response?.data || !response.data[0]) {
            Alert.alert("Error", "No meter information found for this ID");
            return;
          }

          setMeterInfo(response.data[0]);
          Alert.alert("Success", "Meter verified successfully!");
        } catch (err) {
          Alert.alert("Error", "Failed to process meter information");
        }
      },

      onError: (error) => {
        console.log({
          ttt: error,
        });

        console.error("Check Meter Error:", error);

        // Handle different types of errors
        let errorMessage = "Failed to verify meter";

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.status === 404) {
          errorMessage = "Meter ID not found";
        } else if (error?.response?.status === 500) {
          errorMessage = "Server error. Please try again later";
        } else if (error?.response?.status >= 400) {
          errorMessage = "Invalid meter ID or request";
        }

        Alert.alert("Meter Verification Failed", errorMessage);

        // Clear meter info on error
        setMeterInfo(null);
      },
    });
  };

  const handlePayment = async () => {
    // Comprehensive validation
    if (!meterId) {
      Alert.alert("Error", "Please enter meter ID");
      return;
    }

    if (!units) {
      Alert.alert("Error", "Please enter units");
      return;
    }

    if (!meterInfo) {
      Alert.alert("Error", "Please verify the meter first");
      return;
    }

    // Validate units
    const unitsNumber = Number(units);
    if (isNaN(unitsNumber) || unitsNumber <= 0) {
      Alert.alert("Error", "Please enter a valid number of units");
      return;
    }

    if (unitsNumber > 1000) {
      Alert.alert("Error", "Maximum 1000 units allowed per transaction");
      return;
    }

    // Calculate total for confirmation
    const { total } = calculateCosts();

    // Show confirmation dialog
    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to purchase ${units} units for ₦${total}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => processPayment(),
        },
      ]
    );
  };

  const processPayment = () => {
    let data = { meterId, units };

    paybillsmeter(data, {
      onSuccess: (response) => {
        try {
          console.log("Payment success:", response);

          // Show success message
          Alert.alert(
            "Payment Successful",
            `Your electricity units have been purchased successfully!${
              response?.data?.token ? `\n\nToken: ${response.data.token}` : ""
            }`,
            [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]
          );
        } catch (err) {
          console.error("Payment success handler error:", err);
          Alert.alert(
            "Warning",
            "Payment may have been processed, but there was an issue displaying the result. Please check your transaction history."
          );
          navigation.goBack();
        }
      },
      onError: (error) => {
        // console.error("Payment Error:", error?.message);
        console.log({
          fggc: error,
        });

        // Handle different payment error scenarios
        let errorMessage = "Payment failed. Please try again";

        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        } else if (error?.response?.status === 402) {
          errorMessage = "Insufficient funds. Please top up your wallet";
        } else if (error?.response?.status === 400) {
          errorMessage = "Invalid payment request";
        } else if (error?.response?.status === 500) {
          errorMessage =
            "Server error. If money was debited, it will be refunded";
        } else if (error?.code === "NETWORK_ERROR") {
          errorMessage = "Network error. Please check your connection";
        }

        Alert.alert("Payment Failed", errorMessage);
      },
    });
  };

  // Handle input changes with validation
  const handleMeterIdChange = (text) => {
    // Only allow numbers and limit to 11 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setMeterId(numericText);

    // Clear meter info when meter ID changes
    if (meterInfo && text !== meterId) {
      setMeterInfo(null);
    }
  };

  const handleUnitsChange = (text) => {
    // Only allow numbers and decimal point
    const numericText = text.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    const parts = numericText.split(".");
    if (parts.length > 2) {
      return;
    }

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setUnits(numericText);
  };

  const { amount, vat, service, total } = calculateCosts();

  if (electRateIsloading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={{ marginTop: 10 }}>Loading rates...</Text>
      </View>
    );
  }

  return (
    <ScreenWrapper
      title="Make Utility Payment"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      // showHeader={false}
    >
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
        {/* Meter ID Input + Proceed Button */}
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 5 }}>
          Meter ID
        </Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            value={meterId}
            onChangeText={handleMeterIdChange}
            placeholder="Enter 11-digit meter ID"
            keyboardType="numeric"
            maxLength={11}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: meterId.length === 11 ? "#2563eb" : "#ccc",
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              marginRight: 10,
            }}
          />

          {meterId.length === 11 && (
            <TouchableOpacity
              onPress={handleCheckMeter}
              disabled={checkMeterispending}
              style={{
                backgroundColor: checkMeterispending ? "#9ca3af" : "#2563eb",
                borderRadius: 8,
                paddingHorizontal: 15,
                justifyContent: "center",
              }}
            >
              {checkMeterispending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600" }}>Verify</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {meterId.length > 0 && meterId.length !== 11 && (
          <Text style={{ color: "red", fontSize: 12, marginTop: 5 }}>
            Meter ID must be exactly 11 digits ({meterId.length}/11)
          </Text>
        )}

        {/* Show Meter Info if available */}
        {meterInfo && (
          <View
            style={{
              backgroundColor: "#f0f9ff",
              borderRadius: 8,
              padding: 12,
              marginTop: 15,
              marginBottom: 20,
              borderLeft: 4,
              borderLeftColor: "#2563eb",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                marginBottom: 8,
                color: "#2563eb",
              }}
            >
              ✓ Meter Verified
            </Text>
            <Text style={{ marginBottom: 4 }}>
              <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
              {meterInfo?.Customer_name}
            </Text>
            <Text>
              <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
              {meterInfo?.Customer_address}
            </Text>
          </View>
        )}

        {/* Units Input */}
        <Text
          style={{
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          Units (kWh)
        </Text>
        <TextInput
          value={units}
          onChangeText={handleUnitsChange}
          placeholder="Enter units (e.g., 10.5)"
          keyboardType="decimal-pad"
          editable={!!meterInfo}
          style={{
            borderWidth: 1,
            borderColor: meterInfo ? "#ccc" : "#e5e5e5",
            backgroundColor: meterInfo ? "#fff" : "#f9f9f9",
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 20,
            color: meterInfo ? "#000" : "#999",
          }}
        />

        {!meterInfo && units && (
          <Text
            style={{
              color: "orange",
              fontSize: 12,
              marginTop: -15,
              marginBottom: 15,
            }}
          >
            Please verify meter first before entering units
          </Text>
        )}

        {/* Cost Breakdown */}
        {units && Number(units) > 0 && (
          <View
            style={{
              backgroundColor: "#f3f4f6",
              borderRadius: 8,
              padding: 15,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
              Cost Breakdown
            </Text>
            <Text>Units: {units} kWh</Text>
            {/* <Text>Rate: ₦{amountPerUnit} per unit</Text> */}
            <View
              style={{
                marginTop: 8,
                paddingTop: 8,
                borderTopWidth: 1,
                borderTopColor: "#e5e5e5",
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                Total: ₦{total.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Pay Button */}
        {meterInfo && units && Number(units) > 0 && (
          <TouchableOpacity
            onPress={handlePayment}
            disabled={paybillsmeterispending}
            style={{
              backgroundColor: paybillsmeterispending ? "#9ca3af" : "#2563eb",
              borderRadius: 8,
              paddingVertical: 14,
              marginTop: 10,
            }}
          >
            {paybillsmeterispending ? (
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
                    fontWeight: "600",
                  }}
                >
                  Processing...
                </Text>
              </View>
            ) : (
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                Pay ₦{total.toLocaleString()}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Helper Text */}
        {!meterInfo && (
          <Text
            style={{
              textAlign: "center",
              color: "#666",
              fontSize: 14,
              marginTop: 20,
              fontStyle: "italic",
            }}
          >
            Enter your 11-digit meter ID and tap "Verify" to continue
          </Text>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default ElectricityPaymentScreen;
