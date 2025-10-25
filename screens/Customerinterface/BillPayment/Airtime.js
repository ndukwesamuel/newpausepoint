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
} from "react-native";
import { useSelector } from "react-redux";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const Airtime = () => {
  const { user } = useSelector((state) => state.AuthSlice);
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [networks, setNetworks] = useState([]);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const MAX_AMOUNT = 50000;
  const SERVICE_CHARGE = 0; // No service charge for airtime

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  // Purchase airtime mutation
  const { mutate: purchaseAirtime, isLoading: purchaseLoading } = useMutateData(
    "api/v1/vtu/purchase",
    "POST",
    "airtime"
  );

  // Auto-detect network from phone number
  const detectNetwork = (phone) => {
    const firstFourDigits = phone.substring(0, 4);

    // MTN prefixes
    const mtnPrefixes = [
      "0803",
      "0806",
      "0703",
      "0706",
      "0813",
      "0816",
      "0810",
      "0814",
      "0903",
      "0906",
      "0913",
      "0916",
    ];
    // Airtel prefixes
    const airtelPrefixes = [
      "0802",
      "0808",
      "0708",
      "0812",
      "0701",
      "0902",
      "0907",
      "0912",
    ];
    // Glo prefixes
    const gloPrefixes = [
      "0805",
      "0807",
      "0705",
      "0815",
      "0811",
      "0905",
      "0915",
    ];
    // 9mobile prefixes
    const nineMobilePrefixes = ["0809", "0817", "0818", "0909", "0908"];

    if (mtnPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.id === "mtn");
    } else if (airtelPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.id === "airtel");
    } else if (gloPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.id === "glo");
    } else if (nineMobilePrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.id === "9mobile");
    }
    return null;
  };

  const handlePhoneNumberChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(numericText);
  };

  const handleAmountChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "" || Number(numericText) <= MAX_AMOUNT) {
      setAmount(numericText);
    }
  };

  const handlePurchase = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    if (phoneNumber.length !== 11) {
      Alert.alert("Error", "Phone number must be 11 digits");
      return;
    }

    if (!selectedNetwork) {
      Alert.alert("Error", "Please select a network");
      return;
    }

    if (!amount) {
      Alert.alert("Error", "Please enter amount");
      return;
    }

    const amountNumber = Number(amount);
    if (isNaN(amountNumber) || amountNumber < selectedNetwork.min_amount) {
      Alert.alert(
        "Error",
        `Minimum amount for ${
          selectedNetwork.name
        } is ₦${selectedNetwork.min_amount.toLocaleString()}`
      );
      return;
    }

    if (amountNumber > MAX_AMOUNT) {
      Alert.alert("Error", `Maximum amount is ₦${MAX_AMOUNT.toLocaleString()}`);
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      `Buy ₦${amountNumber.toLocaleString()} ${
        selectedNetwork.name
      } airtime for ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => processPurchase() },
      ]
    );
  };

  const processPurchase = () => {
    const data = {
      phone: phoneNumber,
      amount: amount,
      network: selectedNetwork.id,
    };

    console.log({
      ccc: data,
    });

    purchaseAirtime(data, {
      onSuccess: (response) => {
        Alert.alert(
          "Purchase Successful! 🎉",
          `₦${amount} airtime has been sent to ${phoneNumber}`,
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      },
      onError: (error) => {
        console.log({
          cncnc: error,
        });

        let errorMessage = "Purchase failed. Please try again";
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.response?.status === 402) {
          errorMessage = "Insufficient funds. Please top up your wallet";
        }
        Alert.alert("Purchase Failed", errorMessage);
      },
    });
  };

  const getProgressPercentage = () => {
    if (!amount || !selectedNetwork) return 0;
    const numAmount = Number(amount);
    return Math.min((numAmount / MAX_AMOUNT) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage < 25) return "#3B82F6";
    if (percentage < 50) return "#10B981";
    if (percentage < 75) return "#F59E0B";
    return "#A855F7";
  };

  const isValidAmount =
    amount &&
    selectedNetwork &&
    Number(amount) >= selectedNetwork.min_amount &&
    Number(amount) <= MAX_AMOUNT;

  const networkIcons = {
    mtn: "📱",
    airtel: "📞",
    glo: "☎️",
    "9mobile": "📲",
  };

  const networkColors = {
    mtn: "#FFCC00",
    airtel: "#EF4444",
    glo: "#10B981",
    "9mobile": "#059669",
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F8FAFC" }}
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      {/* Header Card */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
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
              width: 48,
              height: 48,
              borderRadius: 16,
              backgroundColor: "#3B82F6",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 24 }}>📱</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
            >
              Buy Airtime
            </Text>
            <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
              Fast & secure airtime purchase
            </Text>
          </View>
        </View>

        {/* Phone Number Input */}
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 8,
          }}
        >
          📞 Phone Number
        </Text>
        <TextInput
          value={phoneNumber}
          onChangeText={handlePhoneNumberChange}
          placeholder="Enter 11-digit phone number"
          keyboardType="numeric"
          maxLength={11}
          style={{
            borderWidth: 2,
            borderColor: phoneNumber.length === 11 ? "#3B82F6" : "#E5E7EB",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            backgroundColor: selectedNetwork ? "#EFF6FF" : "#F9FAFB",
            marginBottom: 8,
          }}
        />

        {phoneNumber.length > 0 && phoneNumber.length !== 11 && (
          <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
            ⚠️ {phoneNumber.length}/11 digits entered
          </Text>
        )}
      </View>

      {/* Network Selection */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: "#374151",
            marginBottom: 12,
          }}
        >
          🌐 Select Network
        </Text>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          {[
            {
              id: "mtn",
              name: "MTN Nigeria",
              min_amount: 100,
            },
            {
              id: "airtel",
              name: "Airtel Nigeria",
              min_amount: 100,
            },
            {
              id: "glo",
              name: "Glo Nigeria",
              min_amount: 100,
            },
            {
              id: "9mobile",
              name: "9mobile",
              min_amount: 100,
            },
          ].map((network) => (
            <TouchableOpacity
              key={network.id}
              onPress={() => setSelectedNetwork(network)}
              style={{
                flex: 1,
                minWidth: "45%",
                backgroundColor:
                  selectedNetwork?.id === network.id
                    ? networkColors[network.id] || "#3B82F6"
                    : "#F3F4F6",
                borderRadius: 16,
                padding: 16,
                alignItems: "center",
                borderWidth: 2,
                borderColor:
                  selectedNetwork?.id === network.id
                    ? networkColors[network.id] || "#3B82F6"
                    : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color:
                    selectedNetwork?.id === network.id ? "#fff" : "#374151",
                  textAlign: "center",
                }}
              >
                {network.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Network Info */}
      {selectedNetwork && (
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            backgroundColor: "#ECFDF5",
            borderRadius: 20,
            padding: 16,
            marginBottom: 20,
            borderLeftWidth: 4,
            borderLeftColor: networkColors[selectedNetwork.id] || "#10B981",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: networkColors[selectedNetwork.id] || "#10B981",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 12,
              }}
            >
              <Text style={{ fontSize: 20 }}>✓</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#065F46",
                }}
              >
                {selectedNetwork.name} Selected
              </Text>
              <Text style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
                Minimum amount: ₦{selectedNetwork.min_amount.toLocaleString()}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}

      {/* Amount Input Card */}
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
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
          💰 Amount
          {selectedNetwork &&
            ` (₦${selectedNetwork.min_amount.toLocaleString()} - ₦${MAX_AMOUNT.toLocaleString()})`}
        </Text>

        <View style={{ position: "relative", marginBottom: 16 }}>
          <Text
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              fontSize: 28,
              fontWeight: "bold",
              color: amount ? "#1F2937" : "#D1D5DB",
              zIndex: 1,
            }}
          >
            ₦
          </Text>
          <TextInput
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            keyboardType="numeric"
            editable={!!selectedNetwork}
            style={{
              borderWidth: 2,
              borderColor: isValidAmount ? "#3B82F6" : "#E5E7EB",
              borderRadius: 16,
              paddingLeft: 48,
              paddingRight: 16,
              paddingVertical: 16,
              fontSize: 32,
              fontWeight: "bold",
              color: selectedNetwork ? "#1F2937" : "#9CA3AF",
              backgroundColor: selectedNetwork ? "#fff" : "#F9FAFB",
            }}
          />
        </View>

        {/* Progress Bar */}
        {amount && Number(amount) > 0 && selectedNetwork && (
          <View style={{ marginBottom: 16 }}>
            <View
              style={{
                height: 12,
                backgroundColor: "#E5E7EB",
                borderRadius: 6,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${getProgressPercentage()}%`,
                  backgroundColor: getProgressColor(),
                  borderRadius: 6,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <Text style={{ fontSize: 11, color: "#6B7280" }}>
                ₦{selectedNetwork.min_amount.toLocaleString()}
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
              >
                {getProgressPercentage().toFixed(0)}%
              </Text>
              <Text style={{ fontSize: 11, color: "#6B7280" }}>
                ₦{MAX_AMOUNT.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Validation Message */}
        {amount &&
          selectedNetwork &&
          Number(amount) < selectedNetwork.min_amount && (
            <View
              style={{
                backgroundColor: "#FEF3C7",
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#92400E", fontSize: 13 }}>
                ⚠️ Minimum amount is ₦
                {selectedNetwork.min_amount.toLocaleString()}
              </Text>
            </View>
          )}

        <View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: "#6B7280",
              marginBottom: 10,
            }}
          >
            Quick Select:
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount.toString())}
                disabled={!selectedNetwork}
                style={{
                  backgroundColor:
                    amount === quickAmount.toString() ? "#3B82F6" : "#F3F4F6",
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  opacity: !selectedNetwork ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color:
                      amount === quickAmount.toString() ? "#fff" : "#374151",
                  }}
                >
                  ₦{quickAmount.toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Summary Card */}
      {isValidAmount && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            gap: 10,
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#EFF6FF",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>
              {networkIcons[selectedNetwork.id]}
            </Text>
            <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
              Network
            </Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E40AF" }}>
              {selectedNetwork.name.split(" ")[0]}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#ECFDF5",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
            <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
              Amount
            </Text>
            <Text style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}>
              ₦{Number(amount).toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "#F5F3FF",
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 24, marginBottom: 8 }}>📱</Text>
            <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
              To
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "#7C3AED",
              }}
            >
              {phoneNumber.substring(0, 4)}***
            </Text>
          </View>
        </View>
      )}

      {/* Purchase Button */}
      {selectedNetwork && isValidAmount && phoneNumber.length === 11 && (
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={purchaseLoading}
          style={{
            backgroundColor: purchaseLoading ? "#9CA3AF" : "#3B82F6",
            borderRadius: 16,
            paddingVertical: 18,
            shadowColor: "#3B82F6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          {purchaseLoading ? (
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
            <Text
              style={{
                color: "#fff",
                textAlign: "center",
                fontSize: 18,
                fontWeight: "700",
              }}
            >
              📱 Buy ₦{Number(amount).toLocaleString()} Airtime
            </Text>
          )}
        </TouchableOpacity>
      )}

      {/* Helper Text */}
      {!selectedNetwork && (
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
            💡 Enter phone number and select network to continue
          </Text>
        </View>
      )}

      {/* Footer Info */}
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#9CA3AF",
          }}
        >
          🔒 Secure payment • ⚡ Instant delivery • 🎯 24/7 support
        </Text>
      </View>
    </ScrollView>
  );
};

export default Airtime;
