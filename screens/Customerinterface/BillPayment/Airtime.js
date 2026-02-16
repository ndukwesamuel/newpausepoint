// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   Animated,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { useFetchData, useMutateData } from "../../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";

// const Airtime = () => {
//   const { user } = useSelector((state) => state.AuthSlice);
//   const navigation = useNavigation();

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [amount, setAmount] = useState("");
//   const [selectedNetwork, setSelectedNetwork] = useState(null);
//   const [networks, setNetworks] = useState([]);
//   const scaleAnim = useState(new Animated.Value(1))[0];

//   const MAX_AMOUNT = 50000;
//   const SERVICE_CHARGE = 0; // No service charge for airtime

//   const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

//   // Purchase airtime mutation
//   const { mutate: purchaseAirtime, isLoading: purchaseLoading } = useMutateData(
//     "api/v1/vtu/purchase",
//     "POST",
//     "airtime"
//   );

//   // Auto-detect network from phone number
//   const detectNetwork = (phone) => {
//     const firstFourDigits = phone.substring(0, 4);

//     // MTN prefixes
//     const mtnPrefixes = [
//       "0803",
//       "0806",
//       "0703",
//       "0706",
//       "0813",
//       "0816",
//       "0810",
//       "0814",
//       "0903",
//       "0906",
//       "0913",
//       "0916",
//     ];
//     // Airtel prefixes
//     const airtelPrefixes = [
//       "0802",
//       "0808",
//       "0708",
//       "0812",
//       "0701",
//       "0902",
//       "0907",
//       "0912",
//     ];
//     // Glo prefixes
//     const gloPrefixes = [
//       "0805",
//       "0807",
//       "0705",
//       "0815",
//       "0811",
//       "0905",
//       "0915",
//     ];
//     // 9mobile prefixes
//     const nineMobilePrefixes = ["0809", "0817", "0818", "0909", "0908"];

//     if (mtnPrefixes.includes(firstFourDigits)) {
//       return networks.find((n) => n.id === "mtn");
//     } else if (airtelPrefixes.includes(firstFourDigits)) {
//       return networks.find((n) => n.id === "airtel");
//     } else if (gloPrefixes.includes(firstFourDigits)) {
//       return networks.find((n) => n.id === "glo");
//     } else if (nineMobilePrefixes.includes(firstFourDigits)) {
//       return networks.find((n) => n.id === "9mobile");
//     }
//     return null;
//   };

//   const handlePhoneNumberChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
//     setPhoneNumber(numericText);
//   };

//   const handleAmountChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (numericText === "" || Number(numericText) <= MAX_AMOUNT) {
//       setAmount(numericText);
//     }
//   };

//   const handlePurchase = async () => {
//     if (!phoneNumber) {
//       Alert.alert("Error", "Please enter phone number");
//       return;
//     }

//     if (phoneNumber.length !== 11) {
//       Alert.alert("Error", "Phone number must be 11 digits");
//       return;
//     }

//     if (!selectedNetwork) {
//       Alert.alert("Error", "Please select a network");
//       return;
//     }

//     if (!amount) {
//       Alert.alert("Error", "Please enter amount");
//       return;
//     }

//     const amountNumber = Number(amount);
//     if (isNaN(amountNumber) || amountNumber < selectedNetwork.min_amount) {
//       Alert.alert(
//         "Error",
//         `Minimum amount for ${
//           selectedNetwork.name
//         } is ₦${selectedNetwork.min_amount.toLocaleString()}`
//       );
//       return;
//     }

//     if (amountNumber > MAX_AMOUNT) {
//       Alert.alert("Error", `Maximum amount is ₦${MAX_AMOUNT.toLocaleString()}`);
//       return;
//     }

//     Alert.alert(
//       "Confirm Purchase",
//       `Buy ₦${amountNumber.toLocaleString()} ${
//         selectedNetwork.name
//       } airtime for ${phoneNumber}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Confirm", onPress: () => processPurchase() },
//       ]
//     );
//   };

//   const processPurchase = () => {
//     const data = {
//       phone: phoneNumber,
//       amount: amount,
//       network: selectedNetwork.id,
//     };

//     console.log({
//       ccc: data,
//     });

//     purchaseAirtime(data, {
//       onSuccess: (response) => {
//         Alert.alert(
//           "Purchase Successful! 🎉",
//           `₦${amount} airtime has been sent to ${phoneNumber}`,
//           [{ text: "OK", onPress: () => navigation.goBack() }]
//         );
//       },
//       onError: (error) => {
//         console.log({
//           cncnc: error.message,
//         });
//         Alert.alert("Purchase Failed", error.message);
//       },
//     });
//   };

//   const getProgressPercentage = () => {
//     if (!amount || !selectedNetwork) return 0;
//     const numAmount = Number(amount);
//     return Math.min((numAmount / MAX_AMOUNT) * 100, 100);
//   };

//   const getProgressColor = () => {
//     const percentage = getProgressPercentage();
//     if (percentage < 25) return "#3B82F6";
//     if (percentage < 50) return "#10B981";
//     if (percentage < 75) return "#F59E0B";
//     return "#A855F7";
//   };

//   const isValidAmount =
//     amount &&
//     selectedNetwork &&
//     Number(amount) >= selectedNetwork.min_amount &&
//     Number(amount) <= MAX_AMOUNT;

//   const networkIcons = {
//     mtn: "📱",
//     airtel: "📞",
//     glo: "☎️",
//     "9mobile": "📲",
//   };

//   const networkColors = {
//     mtn: "#FFCC00",
//     airtel: "#EF4444",
//     glo: "#10B981",
//     "9mobile": "#059669",
//   };

//   return (
//     <ScrollView
//       style={{ flex: 1, backgroundColor: "#F8FAFC" }}
//       contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
//     >
//       {/* Header Card */}
//       <View
//         style={{
//           backgroundColor: "white",
//           borderRadius: 24,
//           padding: 20,
//           marginBottom: 20,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.1,
//           shadowRadius: 12,
//           elevation: 5,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 20,
//           }}
//         >
//           <View
//             style={{
//               width: 48,
//               height: 48,
//               borderRadius: 16,
//               backgroundColor: "#3B82F6",
//               justifyContent: "center",
//               alignItems: "center",
//               marginRight: 12,
//             }}
//           >
//             <Text style={{ fontSize: 24 }}>📱</Text>
//           </View>
//           <View style={{ flex: 1 }}>
//             <Text
//               style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
//             >
//               Buy Airtime
//             </Text>
//             <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
//               Fast & secure airtime purchase
//             </Text>
//           </View>
//         </View>

//         {/* Phone Number Input */}
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: "600",
//             color: "#374151",
//             marginBottom: 8,
//           }}
//         >
//           📞 Phone Number
//         </Text>
//         <TextInput
//           value={phoneNumber}
//           onChangeText={handlePhoneNumberChange}
//           placeholder="Enter 11-digit phone number"
//           keyboardType="numeric"
//           maxLength={11}
//           style={{
//             borderWidth: 2,
//             borderColor: phoneNumber.length === 11 ? "#3B82F6" : "#E5E7EB",
//             borderRadius: 12,
//             paddingHorizontal: 16,
//             paddingVertical: 12,
//             fontSize: 16,
//             backgroundColor: selectedNetwork ? "#EFF6FF" : "#F9FAFB",
//             marginBottom: 8,
//           }}
//         />

//         {phoneNumber.length > 0 && phoneNumber.length !== 11 && (
//           <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
//             ⚠️ {phoneNumber.length}/11 digits entered
//           </Text>
//         )}
//       </View>

//       {/* Network Selection */}
//       <View
//         style={{
//           backgroundColor: "white",
//           borderRadius: 24,
//           padding: 20,
//           marginBottom: 20,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.1,
//           shadowRadius: 12,
//           elevation: 5,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: "600",
//             color: "#374151",
//             marginBottom: 12,
//           }}
//         >
//           🌐 Select Network
//         </Text>

//         <View
//           style={{
//             flexDirection: "row",
//             flexWrap: "wrap",
//             gap: 10,
//           }}
//         >
//           {[
//             {
//               id: "mtn",
//               name: "MTN Nigeria",
//               min_amount: 100,
//             },
//             {
//               id: "airtel",
//               name: "Airtel Nigeria",
//               min_amount: 100,
//             },
//             {
//               id: "glo",
//               name: "Glo Nigeria",
//               min_amount: 100,
//             },
//             {
//               id: "9mobile",
//               name: "9mobile",
//               min_amount: 100,
//             },
//           ].map((network) => (
//             <TouchableOpacity
//               key={network.id}
//               onPress={() => setSelectedNetwork(network)}
//               style={{
//                 flex: 1,
//                 minWidth: "45%",
//                 backgroundColor:
//                   selectedNetwork?.id === network.id
//                     ? networkColors[network.id] || "#3B82F6"
//                     : "#F3F4F6",
//                 borderRadius: 16,
//                 padding: 16,
//                 alignItems: "center",
//                 borderWidth: 2,
//                 borderColor:
//                   selectedNetwork?.id === network.id
//                     ? networkColors[network.id] || "#3B82F6"
//                     : "#E5E7EB",
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "700",
//                   color:
//                     selectedNetwork?.id === network.id ? "#fff" : "#374151",
//                   textAlign: "center",
//                 }}
//               >
//                 {network.name}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       </View>

//       {/* Selected Network Info */}
//       {selectedNetwork && (
//         <Animated.View
//           style={{
//             transform: [{ scale: scaleAnim }],
//             backgroundColor: "#ECFDF5",
//             borderRadius: 20,
//             padding: 16,
//             marginBottom: 20,
//             borderLeftWidth: 4,
//             borderLeftColor: networkColors[selectedNetwork.id] || "#10B981",
//           }}
//         >
//           <View style={{ flexDirection: "row", alignItems: "center" }}>
//             <View
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 20,
//                 backgroundColor: networkColors[selectedNetwork.id] || "#10B981",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginRight: 12,
//               }}
//             >
//               <Text style={{ fontSize: 20 }}>✓</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text
//                 style={{
//                   fontSize: 16,
//                   fontWeight: "700",
//                   color: "#065F46",
//                 }}
//               >
//                 {selectedNetwork.name} Selected
//               </Text>
//               <Text style={{ fontSize: 13, color: "#374151", marginTop: 2 }}>
//                 Minimum amount: ₦{selectedNetwork.min_amount.toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         </Animated.View>
//       )}

//       {/* Amount Input Card */}
//       <View
//         style={{
//           backgroundColor: "white",
//           borderRadius: 24,
//           padding: 20,
//           marginBottom: 20,
//           shadowColor: "#000",
//           shadowOffset: { width: 0, height: 4 },
//           shadowOpacity: 0.1,
//           shadowRadius: 12,
//           elevation: 5,
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 14,
//             fontWeight: "600",
//             color: "#374151",
//             marginBottom: 8,
//           }}
//         >
//           💰 Amount
//           {selectedNetwork &&
//             ` (₦${selectedNetwork.min_amount.toLocaleString()} - ₦${MAX_AMOUNT.toLocaleString()})`}
//         </Text>

//         <View style={{ position: "relative", marginBottom: 16 }}>
//           <Text
//             style={{
//               position: "absolute",
//               left: 16,
//               top: 16,
//               fontSize: 28,
//               fontWeight: "bold",
//               color: amount ? "#1F2937" : "#D1D5DB",
//               zIndex: 1,
//             }}
//           >
//             ₦
//           </Text>
//           <TextInput
//             value={amount}
//             onChangeText={handleAmountChange}
//             placeholder="0"
//             keyboardType="numeric"
//             editable={!!selectedNetwork}
//             style={{
//               borderWidth: 2,
//               borderColor: isValidAmount ? "#3B82F6" : "#E5E7EB",
//               borderRadius: 16,
//               paddingLeft: 48,
//               paddingRight: 16,
//               paddingVertical: 16,
//               fontSize: 32,
//               fontWeight: "bold",
//               color: selectedNetwork ? "#1F2937" : "#9CA3AF",
//               backgroundColor: selectedNetwork ? "#fff" : "#F9FAFB",
//             }}
//           />
//         </View>

//         {/* Progress Bar */}
//         {amount && Number(amount) > 0 && selectedNetwork && (
//           <View style={{ marginBottom: 16 }}>
//             <View
//               style={{
//                 height: 12,
//                 backgroundColor: "#E5E7EB",
//                 borderRadius: 6,
//                 overflow: "hidden",
//               }}
//             >
//               <View
//                 style={{
//                   height: "100%",
//                   width: `${getProgressPercentage()}%`,
//                   backgroundColor: getProgressColor(),
//                   borderRadius: 6,
//                 }}
//               />
//             </View>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginTop: 8,
//               }}
//             >
//               <Text style={{ fontSize: 11, color: "#6B7280" }}>
//                 ₦{selectedNetwork.min_amount.toLocaleString()}
//               </Text>
//               <Text
//                 style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
//               >
//                 {getProgressPercentage().toFixed(0)}%
//               </Text>
//               <Text style={{ fontSize: 11, color: "#6B7280" }}>
//                 ₦{MAX_AMOUNT.toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Validation Message */}
//         {amount &&
//           selectedNetwork &&
//           Number(amount) < selectedNetwork.min_amount && (
//             <View
//               style={{
//                 backgroundColor: "#FEF3C7",
//                 borderRadius: 12,
//                 padding: 12,
//                 marginBottom: 16,
//               }}
//             >
//               <Text style={{ color: "#92400E", fontSize: 13 }}>
//                 ⚠️ Minimum amount is ₦
//                 {selectedNetwork.min_amount.toLocaleString()}
//               </Text>
//             </View>
//           )}

//         <View>
//           <Text
//             style={{
//               fontSize: 13,
//               fontWeight: "600",
//               color: "#6B7280",
//               marginBottom: 10,
//             }}
//           >
//             Quick Select:
//           </Text>
//           <View
//             style={{
//               flexDirection: "row",
//               flexWrap: "wrap",
//               gap: 8,
//             }}
//           >
//             {quickAmounts.map((quickAmount) => (
//               <TouchableOpacity
//                 key={quickAmount}
//                 onPress={() => setAmount(quickAmount.toString())}
//                 disabled={!selectedNetwork}
//                 style={{
//                   backgroundColor:
//                     amount === quickAmount.toString() ? "#3B82F6" : "#F3F4F6",
//                   borderRadius: 12,
//                   paddingVertical: 10,
//                   paddingHorizontal: 16,
//                   opacity: !selectedNetwork ? 0.5 : 1,
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 13,
//                     fontWeight: "700",
//                     color:
//                       amount === quickAmount.toString() ? "#fff" : "#374151",
//                   }}
//                 >
//                   ₦{quickAmount.toLocaleString()}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>
//       </View>

//       {/* Summary Card */}
//       {isValidAmount && (
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             marginBottom: 20,
//             gap: 10,
//           }}
//         >
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#EFF6FF",
//               borderRadius: 16,
//               padding: 16,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 24, marginBottom: 8 }}>
//               {networkIcons[selectedNetwork.id]}
//             </Text>
//             <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
//               Network
//             </Text>
//             <Text style={{ fontSize: 13, fontWeight: "700", color: "#1E40AF" }}>
//               {selectedNetwork.name.split(" ")[0]}
//             </Text>
//           </View>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#ECFDF5",
//               borderRadius: 16,
//               padding: 16,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
//             <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
//               Amount
//             </Text>
//             <Text style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}>
//               ₦{Number(amount).toLocaleString()}
//             </Text>
//           </View>
//           <View
//             style={{
//               flex: 1,
//               backgroundColor: "#F5F3FF",
//               borderRadius: 16,
//               padding: 16,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 24, marginBottom: 8 }}>📱</Text>
//             <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
//               To
//             </Text>
//             <Text
//               style={{
//                 fontSize: 12,
//                 fontWeight: "700",
//                 color: "#7C3AED",
//               }}
//             >
//               {phoneNumber.substring(0, 4)}***
//             </Text>
//           </View>
//         </View>
//       )}

//       {/* Purchase Button */}
//       {selectedNetwork && isValidAmount && phoneNumber.length === 11 && (
//         <TouchableOpacity
//           onPress={handlePurchase}
//           disabled={purchaseLoading}
//           style={{
//             backgroundColor: purchaseLoading ? "#9CA3AF" : "#3B82F6",
//             borderRadius: 16,
//             paddingVertical: 18,
//             shadowColor: "#3B82F6",
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.3,
//             shadowRadius: 8,
//             elevation: 8,
//           }}
//         >
//           {purchaseLoading ? (
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <ActivityIndicator color="#fff" />
//               <Text
//                 style={{
//                   color: "#fff",
//                   marginLeft: 10,
//                   fontSize: 16,
//                   fontWeight: "700",
//                 }}
//               >
//                 Processing...
//               </Text>
//             </View>
//           ) : (
//             <Text
//               style={{
//                 color: "#fff",
//                 textAlign: "center",
//                 fontSize: 18,
//                 fontWeight: "700",
//               }}
//             >
//               📱 Buy ₦{Number(amount).toLocaleString()} Airtime
//             </Text>
//           )}
//         </TouchableOpacity>
//       )}

//       {/* Helper Text */}
//       {!selectedNetwork && (
//         <View
//           style={{
//             backgroundColor: "#F9FAFB",
//             borderRadius: 16,
//             padding: 16,
//             marginTop: 20,
//           }}
//         >
//           <Text
//             style={{
//               textAlign: "center",
//               color: "#6B7280",
//               fontSize: 13,
//               fontStyle: "italic",
//             }}
//           >
//             💡 Enter phone number and select network to continue
//           </Text>
//         </View>
//       )}

//       {/* Footer Info */}
//       <View style={{ marginTop: 20 }}>
//         <Text
//           style={{
//             textAlign: "center",
//             fontSize: 12,
//             color: "#9CA3AF",
//           }}
//         >
//           🔒 Secure payment • ⚡ Instant delivery • 🎯 24/7 support
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default Airtime;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Airtime = () => {
  const { user } = useSelector((state) => state.AuthSlice);
  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Spinning animation for loading
  const spinAnim = useRef(new Animated.Value(0)).current;

  const MAX_AMOUNT = 50000;
  const SERVICE_CHARGE = 0;

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const networks = [
    {
      id: "mtn",
      name: "MTN Nigeria",
      min_amount: 100,
      color: "#FFCC00",
      bgColor: "#FEF3C7",
    },
    {
      id: "airtel",
      name: "Airtel Nigeria",
      min_amount: 100,
      color: "#EF4444",
      bgColor: "#FEE2E2",
    },
    {
      id: "glo",
      name: "Glo Nigeria",
      min_amount: 100,
      color: "#10B981",
      bgColor: "#D1FAE5",
    },
    {
      id: "9mobile",
      name: "9mobile",
      min_amount: 100,
      color: "#059669",
      bgColor: "#D1FAE5",
    },
  ];

  // Purchase airtime mutation
  const { mutate: purchaseAirtime, isPending: purchaseLoading } = useMutateData(
    "api/v1/vtu/purchase",
    "POST",
    "airtime",
  );

  // Start spinning animation when loading
  useEffect(() => {
    if (purchaseLoading) {
      spinAnim.setValue(0);
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [purchaseLoading]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Auto-detect network from phone number
  const detectNetwork = (phone) => {
    const firstFourDigits = phone.substring(0, 4);

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
    const gloPrefixes = [
      "0805",
      "0807",
      "0705",
      "0815",
      "0811",
      "0905",
      "0915",
    ];
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

    // Auto-detect network
    if (numericText.length >= 4) {
      const detected = detectNetwork(numericText);
      if (detected) {
        setSelectedNetwork(detected);
      }
    }
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
        } is ₦${selectedNetwork.min_amount.toLocaleString()}`,
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
      ],
    );
  };

  const processPurchase = () => {
    const data = {
      phone: phoneNumber,
      amount: amount,
      network: selectedNetwork.id,
    };

    purchaseAirtime(data, {
      onSuccess: (response) => {
        Alert.alert(
          "Purchase Successful!",
          `₦${amount} airtime has been sent to ${phoneNumber}`,
          [{ text: "OK", onPress: () => navigation.goBack() }],
        );
      },
      onError: (error) => {
        Alert.alert("Purchase Failed", error.message);
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

  const canPurchase =
    selectedNetwork && isValidAmount && phoneNumber.length === 11;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons
              name="cellphone"
              size={28}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Buy Airtime</Text>
            <Text style={styles.headerSubtitle}>
              Fast & secure airtime purchase
            </Text>
          </View>
        </View>
      </View>

      {/* Phone Number Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="phone"
            size={20}
            color="#10B981"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Phone Number</Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color={phoneNumber.length === 11 ? "#10B981" : "#6B7280"}
            style={styles.inputIcon}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder="Enter 11-digit phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={11}
            style={styles.textInput}
          />
          {phoneNumber.length === 11 && (
            <View style={styles.inputSuccessIcon}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#10B981"
              />
            </View>
          )}
        </View>

        {phoneNumber.length > 0 && phoneNumber.length !== 11 && (
          <View style={styles.warningBadge}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={14}
              color="#92400E"
            />
            <Text style={styles.warningText}>
              {phoneNumber.length}/11 digits entered
            </Text>
          </View>
        )}
      </View>

      {/* Network Selection Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="signal-variant"
            size={20}
            color="#10B981"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Select Network</Text>
        </View>

        <View style={styles.networkGrid}>
          {networks.map((network) => (
            <TouchableOpacity
              key={network.id}
              onPress={() => setSelectedNetwork(network)}
              activeOpacity={0.7}
              style={[
                styles.networkButton,
                selectedNetwork?.id === network.id && {
                  backgroundColor: network.color,
                  borderColor: network.color,
                },
              ]}
            >
              <View
                style={[
                  styles.networkIconContainer,
                  {
                    backgroundColor:
                      selectedNetwork?.id === network.id
                        ? "rgba(255,255,255,0.3)"
                        : network.bgColor,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name="sim"
                  size={20}
                  color={
                    selectedNetwork?.id === network.id
                      ? "#FFFFFF"
                      : network.color
                  }
                />
              </View>
              <Text
                style={[
                  styles.networkName,
                  selectedNetwork?.id === network.id &&
                    styles.networkNameSelected,
                ]}
              >
                {network.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Selected Network Info */}
      {selectedNetwork && (
        <View
          style={[
            styles.selectedNetworkCard,
            { borderLeftColor: selectedNetwork.color },
          ]}
        >
          <View
            style={[
              styles.selectedNetworkIcon,
              { backgroundColor: selectedNetwork.color },
            ]}
          >
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.selectedNetworkInfo}>
            <Text style={styles.selectedNetworkName}>
              {selectedNetwork.name} Selected
            </Text>
            <Text style={styles.selectedNetworkMin}>
              Minimum amount: ₦{selectedNetwork.min_amount.toLocaleString()}
            </Text>
          </View>
        </View>
      )}

      {/* Amount Input Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="cash"
            size={20}
            color="#10B981"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>
            Amount
            {selectedNetwork && (
              <Text style={styles.amountRange}>
                {" "}
                (₦{selectedNetwork.min_amount.toLocaleString()} - ₦
                {MAX_AMOUNT.toLocaleString()})
              </Text>
            )}
          </Text>
        </View>

        <View style={styles.amountInputContainer}>
          <Text
            style={[
              styles.currencySymbol,
              amount ? styles.currencySymbolActive : null,
            ]}
          >
            ₦
          </Text>
          <TextInput
            value={amount}
            onChangeText={handleAmountChange}
            placeholder="0"
            placeholderTextColor="#D1D5DB"
            keyboardType="numeric"
            editable={!!selectedNetwork}
            style={[
              styles.amountInput,
              !selectedNetwork && styles.amountInputDisabled,
            ]}
          />
        </View>

        {/* Progress Bar */}
        {amount && Number(amount) > 0 && selectedNetwork && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: getProgressColor(),
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabelMin}>
                ₦{selectedNetwork.min_amount.toLocaleString()}
              </Text>
              <Text style={styles.progressLabelPercent}>
                {getProgressPercentage().toFixed(0)}%
              </Text>
              <Text style={styles.progressLabelMax}>
                ₦{MAX_AMOUNT.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Validation Warning */}
        {amount &&
          selectedNetwork &&
          Number(amount) < selectedNetwork.min_amount && (
            <View style={styles.validationWarning}>
              <MaterialCommunityIcons name="alert" size={16} color="#92400E" />
              <Text style={styles.validationWarningText}>
                Minimum amount is ₦{selectedNetwork.min_amount.toLocaleString()}
              </Text>
            </View>
          )}

        {/* Quick Amounts */}
        <View style={styles.quickAmountsSection}>
          <Text style={styles.quickAmountsLabel}>Quick Select:</Text>
          <View style={styles.quickAmountsGrid}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                onPress={() => setAmount(quickAmount.toString())}
                disabled={!selectedNetwork}
                activeOpacity={0.7}
                style={[
                  styles.quickAmountButton,
                  amount === quickAmount.toString() &&
                    styles.quickAmountButtonActive,
                  !selectedNetwork && styles.quickAmountButtonDisabled,
                ]}
              >
                <Text
                  style={[
                    styles.quickAmountText,
                    amount === quickAmount.toString() &&
                      styles.quickAmountTextActive,
                  ]}
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
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: "#DBEAFE" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#3B82F6" },
              ]}
            >
              <MaterialCommunityIcons name="sim" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Network</Text>
            <Text style={[styles.summaryValue, { color: "#1E40AF" }]}>
              {selectedNetwork.name.split(" ")[0]}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#D1FAE5" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#10B981" },
              ]}
            >
              <MaterialCommunityIcons name="cash" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={[styles.summaryValue, { color: "#059669" }]}>
              ₦{Number(amount).toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#E0E7FF" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#6366F1" },
              ]}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>To</Text>
            <Text style={[styles.summaryValue, { color: "#4338CA" }]}>
              {phoneNumber.substring(0, 4)}***
            </Text>
          </View>
        </View>
      )}

      {/* Purchase Button */}
      {canPurchase && (
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={purchaseLoading}
          activeOpacity={0.8}
          style={[
            styles.purchaseButton,
            purchaseLoading && styles.purchaseButtonDisabled,
          ]}
        >
          {purchaseLoading ? (
            <View style={styles.purchaseButtonContent}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <ActivityIndicator size="small" color="white" />
              </Animated.View>
              <Text style={styles.purchaseButtonText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.purchaseButtonContent}>
              <MaterialCommunityIcons
                name="cellphone-arrow-down"
                size={22}
                color="#FFFFFF"
              />
              <Text style={styles.purchaseButtonText}>
                Buy ₦{Number(amount).toLocaleString()} Airtime
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Helper Text */}
      {!selectedNetwork && (
        <View style={styles.helperCard}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.helperText}>
            Enter phone number and select network to continue
          </Text>
        </View>
      )}

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color="#10B981"
          />
          <Text style={styles.footerText}>Secure</Text>
        </View>
        <View style={styles.footerDot} />
        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={16}
            color="#F59E0B"
          />
          <Text style={styles.footerText}>Instant</Text>
        </View>
        <View style={styles.footerDot} />
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="headset" size={16} color="#3B82F6" />
          <Text style={styles.footerText}>24/7 Support</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Airtime;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  // Header Card
  headerCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },

  // Card Styles
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Input Styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  inputSuccessIcon: {
    marginLeft: 8,
  },

  // Warning Badge
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400E",
    marginLeft: 6,
  },

  // Network Grid
  networkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  networkButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  networkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  networkName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  networkNameSelected: {
    color: "#FFFFFF",
  },

  // Selected Network Card
  selectedNetworkCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedNetworkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedNetworkInfo: {
    flex: 1,
  },
  selectedNetworkName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065F46",
  },
  selectedNetworkMin: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginTop: 2,
  },

  // Amount Input
  amountRange: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  currencySymbol: {
    fontSize: 28,
    fontWeight: "700",
    color: "#D1D5DB",
    marginRight: 4,
  },
  currencySymbolActive: {
    color: "#1F2937",
  },
  amountInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 32,
    fontWeight: "700",
    color: "#1F2937",
  },
  amountInputDisabled: {
    color: "#9CA3AF",
  },

  // Progress Bar
  progressContainer: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  progressLabelMin: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },
  progressLabelPercent: {
    fontSize: 12,
    fontWeight: "700",
    color: "#3B82F6",
  },
  progressLabelMax: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Validation Warning
  validationWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },
  validationWarningText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#92400E",
    marginLeft: 8,
  },

  // Quick Amounts
  quickAmountsSection: {
    marginTop: 4,
  },
  quickAmountsLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
  },
  quickAmountsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickAmountButton: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  quickAmountButtonActive: {
    backgroundColor: "#10B981",
  },
  quickAmountButtonDisabled: {
    opacity: 0.5,
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  quickAmountTextActive: {
    color: "#FFFFFF",
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Purchase Button
  purchaseButton: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonDisabled: {
    backgroundColor: "#6EE7B7",
    shadowOpacity: 0.15,
  },
  purchaseButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginLeft: 10,
  },

  // Helper Card
  helperCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  helperText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
    fontStyle: "italic",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 4,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 12,
  },
});
