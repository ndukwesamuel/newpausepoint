// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   ActivityIndicator,
// //   Alert,
// //   ScrollView,
// //   Animated,
// // } from "react-native";
// // import { useSelector } from "react-redux";
// // import axios from "axios";
// // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // import { useNavigation } from "@react-navigation/native";
// // import Toast from "react-native-toast-message";
// // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // const ElectricityPaymentScreen = () => {
// //   const { user } = useSelector((state) => state.AuthSlice);
// //   const navigation = useNavigation();

// //   const [meterId, setMeterId] = useState("");
// //   const [amount, setAmount] = useState("");
// //   const [meterInfo, setMeterInfo] = useState(null);
// //   const scaleAnim = useState(new Animated.Value(1))[0];

// //   const MIN_AMOUNT = 260;
// //   const MAX_AMOUNT = 100000;

// //   const quickAmounts = [5000, 10000, 20000, 50000, 100000];

// //   const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
// //     "api/captain/vend",
// //     "POST",
// //     "billpayment"
// //   );

// //   const { mutate: paybillsmeter, isLoading: paybillsmeterispending } =
// //     useMutateData("api/captain/buy/v2", "POST", "billpayment");

// //   // Calculate amounts with service charge and discount
// //   const calculateAmounts = () => {
// //     const principalAmount = Number(amount) || 0;
// //     const totalAmount = principalAmount; // Customer pays only the principal amount

// //     return {
// //       principalAmount,
// //       totalAmount,
// //     };
// //   };

// //   const handleCheckMeter = async () => {
// //     if (!meterId) {
// //       Alert.alert("Error", "Please enter meter ID");
// //       return;
// //     }

// //     if (meterId.length !== 11) {
// //       Alert.alert("Error", "Meter ID must be exactly 11 digits");
// //       return;
// //     }

// //     if (!/^\d+$/.test(meterId)) {
// //       Alert.alert("Error", "Meter ID must contain only numbers");
// //       return;
// //     }

// //     let data = { meterId };

// //     checkMeter(data, {
// //       onSuccess: (response) => {
// //         if (!response?.data || !response.data[0]) {
// //           Alert.alert("Error", "No meter information found for this ID");
// //           return;
// //         }
// //         setMeterInfo(response.data[0]);
// //         // Success animation
// //         Animated.sequence([
// //           Animated.timing(scaleAnim, {
// //             toValue: 1.1,
// //             duration: 200,
// //             useNativeDriver: true,
// //           }),
// //           Animated.timing(scaleAnim, {
// //             toValue: 1,
// //             duration: 200,
// //             useNativeDriver: true,
// //           }),
// //         ]).start();
// //         Alert.alert("Success", "Meter verified successfully! ⚡");
// //       },
// //       onError: (error) => {
// //         let errorMessage = "Failed to verify meter";
// //         if (error?.response?.data?.message) {
// //           errorMessage = error.response.data.message;
// //         } else if (error?.message) {
// //           errorMessage = error.message;
// //         }
// //         Alert.alert("Meter Verification Failed", errorMessage);
// //         setMeterInfo(null);
// //       },
// //     });
// //   };

// //   const handlePayment = async () => {
// //     if (!meterId) {
// //       Alert.alert("Error", "Please enter meter ID");
// //       return;
// //     }

// //     if (!amount) {
// //       Alert.alert("Error", "Please enter amount");
// //       return;
// //     }

// //     if (!meterInfo) {
// //       Alert.alert("Error", "Please verify the meter first");
// //       return;
// //     }

// //     const amountNumber = Number(amount);
// //     if (isNaN(amountNumber) || amountNumber < MIN_AMOUNT) {
// //       Alert.alert("Error", `Minimum amount is ₦${MIN_AMOUNT.toLocaleString()}`);
// //       return;
// //     }

// //     if (amountNumber > MAX_AMOUNT) {
// //       Alert.alert("Error", `Maximum amount is ₦${MAX_AMOUNT.toLocaleString()}`);
// //       return;
// //     }

// //     const { totalAmount } = calculateAmounts();

// //     Alert.alert(
// //       "Confirm Payment",
// //       `Are you sure you want to pay ₦${totalAmount.toLocaleString()}`,
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         { text: "Confirm", onPress: () => processPayment() },
// //       ]
// //     );
// //   };

// //   const processPayment = () => {
// //     let data = { meterId, amount };

// //     paybillsmeter(data, {
// //       onSuccess: (response) => {
// //         Alert.alert(
// //           "Payment Successful! 🎉",
// //           `Your electricity payment has been processed successfully!${
// //             response?.data?.token ? `\n\nToken: ${response.data.token}` : ""
// //           }`,
// //           [{ text: "OK", onPress: () => navigation.goBack() }]
// //         );
// //       },
// //       onError: (error) => {
// //         console.log({
// //           vgggvv: error.message,
// //         });

// //         let errorMessage = "Payment failed. Please try again";
// //         if (error?.response?.data?.message) {
// //           errorMessage = error.response.data.message;
// //         } else if (error?.response?.status === 402) {
// //           errorMessage = "Insufficient funds. Please top up your wallet";
// //         } else {
// //           errorMessage = error.message;
// //         }
// //         Alert.alert("Payment Failed", errorMessage);
// //       },
// //     });
// //   };

// //   const handleMeterIdChange = (text) => {
// //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// //     setMeterId(numericText);
// //     if (meterInfo && text !== meterId) {
// //       setMeterInfo(null);
// //     }
// //   };

// //   const handleAmountChange = (text) => {
// //     const numericText = text.replace(/[^0-9]/g, "");
// //     if (numericText === "" || Number(numericText) <= MAX_AMOUNT) {
// //       setAmount(numericText);
// //     }
// //   };

// //   const getProgressPercentage = () => {
// //     if (!amount) return 0;
// //     const numAmount = Number(amount);
// //     return Math.min((numAmount / MAX_AMOUNT) * 100, 100);
// //   };

// //   const getProgressColor = () => {
// //     const percentage = getProgressPercentage();
// //     if (percentage < 25) return "#3B82F6";
// //     if (percentage < 50) return "#10B981";
// //     if (percentage < 75) return "#F59E0B";
// //     return "#A855F7";
// //   };

// //   const isValidAmount =
// //     amount && Number(amount) >= MIN_AMOUNT && Number(amount) <= MAX_AMOUNT;

// //   const { principalAmount, totalAmount } = calculateAmounts();

// //   return (
// //     <ScreenWrapper
// //       title="Power Up! ⚡"
// //       navigation={navigation}
// //       headerStyle={{ backgroundColor: "white" }}
// //     >
// //       <ScrollView
// //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// //       >
// //         {/* Header Card */}
// //         <View
// //           style={{
// //             backgroundColor: "white",
// //             borderRadius: 24,
// //             padding: 20,
// //             marginBottom: 20,
// //             shadowColor: "#000",
// //             shadowOffset: { width: 0, height: 4 },
// //             shadowOpacity: 0.1,
// //             shadowRadius: 12,
// //             elevation: 5,
// //           }}
// //         >
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               alignItems: "center",
// //               marginBottom: 20,
// //             }}
// //           >
// //             <View
// //               style={{
// //                 width: 48,
// //                 height: 48,
// //                 borderRadius: 16,
// //                 backgroundColor: "#3B82F6",
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //                 marginRight: 12,
// //               }}
// //             >
// //               <Text style={{ fontSize: 24 }}>⚡</Text>
// //             </View>
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
// //               >
// //                 Quick Payment
// //               </Text>
// //               <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
// //                 Easy & secure electricity payment
// //               </Text>
// //             </View>
// //           </View>

// //           {/* Meter ID Input */}
// //           <Text
// //             style={{
// //               fontSize: 14,
// //               fontWeight: "600",
// //               color: "#374151",
// //               marginBottom: 8,
// //             }}
// //           >
// //             🔢 Meter ID
// //           </Text>
// //           <View style={{ flexDirection: "row", marginBottom: 12 }}>
// //             <TextInput
// //               value={meterId}
// //               onChangeText={handleMeterIdChange}
// //               placeholder="Enter 11-digit meter ID"
// //               keyboardType="numeric"
// //               maxLength={11}
// //               style={{
// //                 flex: 1,
// //                 borderWidth: 2,
// //                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 12,
// //                 marginRight: 10,
// //                 fontSize: 16,
// //                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
// //               }}
// //             />
// //             {meterId.length === 11 && !meterInfo && (
// //               <TouchableOpacity
// //                 onPress={handleCheckMeter}
// //                 disabled={checkMeterispending}
// //                 style={{
// //                   backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
// //                   borderRadius: 12,
// //                   paddingHorizontal: 20,
// //                   justifyContent: "center",
// //                   minWidth: 90,
// //                 }}
// //               >
// //                 {checkMeterispending ? (
// //                   <ActivityIndicator color="#fff" />
// //                 ) : (
// //                   <Text
// //                     style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
// //                   >
// //                     Verify
// //                   </Text>
// //                 )}
// //               </TouchableOpacity>
// //             )}
// //           </View>

// //           {meterId.length > 0 && meterId.length !== 11 && (
// //             <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
// //               ⚠️ {meterId.length}/11 digits entered
// //             </Text>
// //           )}
// //         </View>

// //         {/* Meter Info Card */}
// //         {meterInfo && (
// //           <Animated.View
// //             style={{
// //               transform: [{ scale: scaleAnim }],
// //               backgroundColor: "#ECFDF5",
// //               borderRadius: 20,
// //               padding: 16,
// //               marginBottom: 20,
// //               borderLeftWidth: 4,
// //               borderLeftColor: "#10B981",
// //             }}
// //           >
// //             <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
// //               <View
// //                 style={{
// //                   width: 40,
// //                   height: 40,
// //                   borderRadius: 20,
// //                   backgroundColor: "#10B981",
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                   marginRight: 12,
// //                 }}
// //               >
// //                 <Text style={{ fontSize: 20 }}>✓</Text>
// //               </View>
// //               <View style={{ flex: 1 }}>
// //                 <Text
// //                   style={{
// //                     fontSize: 16,
// //                     fontWeight: "700",
// //                     color: "#065F46",
// //                     marginBottom: 8,
// //                   }}
// //                 >
// //                   🏆 Meter Verified!
// //                 </Text>
// //                 <Text
// //                   style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
// //                 >
// //                   <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
// //                   {meterInfo?.Customer_name}
// //                 </Text>
// //                 <Text style={{ fontSize: 14, color: "#374151" }}>
// //                   <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
// //                   {meterInfo?.Customer_address}
// //                 </Text>
// //               </View>
// //             </View>
// //           </Animated.View>
// //         )}

// //         {/* Amount Input Card */}
// //         <View
// //           style={{
// //             backgroundColor: "white",
// //             borderRadius: 24,
// //             padding: 20,
// //             marginBottom: 20,
// //             shadowColor: "#000",
// //             shadowOffset: { width: 0, height: 4 },
// //             shadowOpacity: 0.1,
// //             shadowRadius: 12,
// //             elevation: 5,
// //           }}
// //         >
// //           <Text
// //             style={{
// //               fontSize: 14,
// //               fontWeight: "600",
// //               color: "#374151",
// //               marginBottom: 8,
// //             }}
// //           >
// //             💰 Amount (₦{MIN_AMOUNT.toLocaleString()} - ₦
// //             {MAX_AMOUNT.toLocaleString()})
// //           </Text>

// //           <View style={{ position: "relative", marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 position: "absolute",
// //                 left: 16,
// //                 top: 16,
// //                 fontSize: 28,
// //                 fontWeight: "bold",
// //                 color: amount ? "#1F2937" : "#D1D5DB",
// //                 zIndex: 1,
// //               }}
// //             >
// //               ₦
// //             </Text>
// //             <TextInput
// //               value={amount}
// //               onChangeText={handleAmountChange}
// //               placeholder="0"
// //               keyboardType="numeric"
// //               editable={!!meterInfo}
// //               style={{
// //                 borderWidth: 2,
// //                 borderColor: isValidAmount ? "#3B82F6" : "#E5E7EB",
// //                 borderRadius: 16,
// //                 paddingLeft: 48,
// //                 paddingRight: 16,
// //                 paddingVertical: 16,
// //                 fontSize: 32,
// //                 fontWeight: "bold",
// //                 color: meterInfo ? "#1F2937" : "#9CA3AF",
// //                 backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
// //               }}
// //             />
// //           </View>

// //           {/* Progress Bar */}
// //           {amount && Number(amount) > 0 && (
// //             <View style={{ marginBottom: 16 }}>
// //               <View
// //                 style={{
// //                   height: 12,
// //                   backgroundColor: "#E5E7EB",
// //                   borderRadius: 6,
// //                   overflow: "hidden",
// //                 }}
// //               >
// //                 <View
// //                   style={{
// //                     height: "100%",
// //                     width: `${getProgressPercentage()}%`,
// //                     backgroundColor: getProgressColor(),
// //                     borderRadius: 6,
// //                   }}
// //                 />
// //               </View>
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   marginTop: 8,
// //                 }}
// //               >
// //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //                   ₦{MIN_AMOUNT.toLocaleString()}
// //                 </Text>
// //                 <Text
// //                   style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
// //                 >
// //                   {getProgressPercentage().toFixed(0)}%
// //                 </Text>
// //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //                   ₦{MAX_AMOUNT.toLocaleString()}
// //                 </Text>
// //               </View>
// //             </View>
// //           )}

// //           {/* Validation Message */}
// //           {amount && Number(amount) < MIN_AMOUNT && (
// //             <View
// //               style={{
// //                 backgroundColor: "#FEF3C7",
// //                 borderRadius: 12,
// //                 padding: 12,
// //                 marginBottom: 16,
// //               }}
// //             >
// //               <Text style={{ color: "#92400E", fontSize: 13 }}>
// //                 ⚠️ Minimum amount is ₦{MIN_AMOUNT.toLocaleString()}
// //               </Text>
// //             </View>
// //           )}

// //           <View>
// //             <Text
// //               style={{
// //                 fontSize: 13,
// //                 fontWeight: "600",
// //                 color: "#6B7280",
// //                 marginBottom: 10,
// //               }}
// //             >
// //               Quick Select:
// //             </Text>
// //             <View
// //               style={{
// //                 flexDirection: "row",
// //                 justifyContent: "space-between",
// //                 gap: 8,
// //               }}
// //             >
// //               {quickAmounts.map((quickAmount) => (
// //                 <TouchableOpacity
// //                   key={quickAmount}
// //                   onPress={() => setAmount(quickAmount.toString())}
// //                   disabled={!meterInfo}
// //                   style={{
// //                     flex: 1,
// //                     backgroundColor:
// //                       amount === quickAmount.toString() ? "#3B82F6" : "#F3F4F6",
// //                     borderRadius: 12,
// //                     paddingVertical: 12,
// //                     alignItems: "center",
// //                     opacity: !meterInfo ? 0.5 : 1,
// //                   }}
// //                 >
// //                   <Text
// //                     style={{
// //                       fontSize: 13,
// //                       fontWeight: "700",
// //                       color:
// //                         amount === quickAmount.toString() ? "#fff" : "#374151",
// //                     }}
// //                   >
// //                     ₦{(quickAmount / 1000).toFixed(0)}k
// //                   </Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           </View>

// //           {/* Cost Breakdown */}
// //           {isValidAmount && (
// //             <View
// //               style={{
// //                 backgroundColor: "#F8FAFC",
// //                 borderRadius: 12,
// //                 padding: 16,
// //                 marginTop: 16,
// //                 borderWidth: 1,
// //                 borderColor: "#E2E8F0",
// //               }}
// //             >
// //               <Text
// //                 style={{
// //                   fontSize: 14,
// //                   fontWeight: "700",
// //                   color: "#374151",
// //                   marginBottom: 12,
// //                 }}
// //               >
// //                 Cost Breakdown
// //               </Text>

// //               <View style={{ marginBottom: 8 }}>
// //                 <View
// //                   style={{
// //                     flexDirection: "row",
// //                     justifyContent: "space-between",
// //                     marginBottom: 6,
// //                   }}
// //                 >
// //                   <Text style={{ fontSize: 13, color: "#6B7280" }}>
// //                     Principal Amount:
// //                   </Text>
// //                   <Text
// //                     style={{
// //                       fontSize: 13,
// //                       fontWeight: "600",
// //                       color: "#374151",
// //                     }}
// //                   >
// //                     ₦{principalAmount.toLocaleString()}
// //                   </Text>
// //                 </View>

// //                 <View
// //                   style={{
// //                     height: 1,
// //                     backgroundColor: "#E5E7EB",
// //                     marginVertical: 8,
// //                   }}
// //                 />

// //                 <View
// //                   style={{
// //                     flexDirection: "row",
// //                     justifyContent: "space-between",
// //                   }}
// //                 >
// //                   <Text
// //                     style={{
// //                       fontSize: 15,
// //                       fontWeight: "700",
// //                       color: "#1F2937",
// //                     }}
// //                   >
// //                     Total Amount:
// //                   </Text>
// //                   <Text
// //                     style={{
// //                       fontSize: 15,
// //                       fontWeight: "700",
// //                       color: "#1F2937",
// //                     }}
// //                   >
// //                     ₦{totalAmount.toLocaleString()}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           )}
// //         </View>

// //         {/* Stats Cards */}
// //         {isValidAmount && (
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               marginBottom: 20,
// //               gap: 10,
// //             }}
// //           >
// //             <View
// //               style={{
// //                 flex: 1,
// //                 backgroundColor: "#EFF6FF",
// //                 borderRadius: 16,
// //                 padding: 16,
// //                 alignItems: "center",
// //               }}
// //             >
// //               <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
// //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// //                 Power
// //               </Text>
// //               <Text
// //                 style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
// //               >
// //                 Ready
// //               </Text>
// //             </View>
// //             <View
// //               style={{
// //                 flex: 1,
// //                 backgroundColor: "#ECFDF5",
// //                 borderRadius: 16,
// //                 padding: 16,
// //                 alignItems: "center",
// //               }}
// //             >
// //               <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
// //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// //                 You Pay
// //               </Text>
// //               <Text
// //                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
// //               >
// //                 ₦{totalAmount.toLocaleString()}
// //               </Text>
// //             </View>
// //           </View>
// //         )}

// //         {/* Pay Button */}
// //         {meterInfo && isValidAmount && (
// //           <TouchableOpacity
// //             onPress={handlePayment}
// //             disabled={paybillsmeterispending}
// //             style={{
// //               backgroundColor: paybillsmeterispending ? "#9CA3AF" : "#3B82F6",
// //               borderRadius: 16,
// //               paddingVertical: 18,
// //               shadowColor: "#3B82F6",
// //               shadowOffset: { width: 0, height: 4 },
// //               shadowOpacity: 0.3,
// //               shadowRadius: 8,
// //               elevation: 8,
// //             }}
// //           >
// //             {paybillsmeterispending ? (
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "center",
// //                   alignItems: "center",
// //                 }}
// //               >
// //                 <ActivityIndicator color="#fff" />
// //                 <Text
// //                   style={{
// //                     color: "#fff",
// //                     marginLeft: 10,
// //                     fontSize: 16,
// //                     fontWeight: "700",
// //                   }}
// //                 >
// //                   Processing...
// //                 </Text>
// //               </View>
// //             ) : (
// //               <Text
// //                 style={{
// //                   color: "#fff",
// //                   textAlign: "center",
// //                   fontSize: 18,
// //                   fontWeight: "700",
// //                 }}
// //               >
// //                 ⚡ Pay ₦{totalAmount.toLocaleString()}
// //               </Text>
// //             )}
// //           </TouchableOpacity>
// //         )}

// //         {/* Helper Text */}
// //         {!meterInfo && (
// //           <View
// //             style={{
// //               backgroundColor: "#F9FAFB",
// //               borderRadius: 16,
// //               padding: 16,
// //               marginTop: 20,
// //             }}
// //           >
// //             <Text
// //               style={{
// //                 textAlign: "center",
// //                 color: "#6B7280",
// //                 fontSize: 13,
// //                 fontStyle: "italic",
// //               }}
// //             >
// //               💡 Enter your meter ID and verify to continue
// //             </Text>
// //           </View>
// //         )}

// //         {/* Footer Info */}
// //         <View style={{ marginTop: 20 }}>
// //           <Text
// //             style={{
// //               textAlign: "center",
// //               fontSize: 12,
// //               color: "#9CA3AF",
// //             }}
// //           >
// //             🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
// //           </Text>
// //         </View>
// //       </ScrollView>
// //     </ScreenWrapper>
// //   );
// // };

// // export default ElectricityPaymentScreen;

// import React, { useState } from "react";
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
// import axios from "axios";
// import { useFetchData, useMutateData } from "../../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// const ElectricityPaymentScreen = () => {
//   const { user } = useSelector((state) => state.AuthSlice);
//   const navigation = useNavigation();

//   const [meterId, setMeterId] = useState("");
//   const [units, setUnits] = useState(""); // Changed from amount to units
//   const [meterInfo, setMeterInfo] = useState(null);
//   const scaleAnim = useState(new Animated.Value(1))[0];

//   const PRICE_PER_UNIT = 260; // ₦260 per unit
//   const MIN_UNITS = 1; // Minimum 10 units
//   const MAX_UNITS = 400; // Maximum 400 units

//   const quickUnits = [10, 20, 50, 100, 200]; // Quick select units

//   const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
//     "api/captain/vend",
//     "POST",
//     "billpayment"
//   );

//   const { mutate: paybillsmeter, isLoading: paybillsmeterispending } =
//     useMutateData("api/captain/buy/v2", "POST", "billpayment");

//   // Calculate total amount based on units
//   const calculateAmounts = () => {
//     const unitsNumber = Number(units) || 0;
//     const totalAmount = unitsNumber * PRICE_PER_UNIT;

//     return {
//       units: unitsNumber,
//       totalAmount,
//       pricePerUnit: PRICE_PER_UNIT,
//     };
//   };

//   const handleCheckMeter = async () => {
//     if (!meterId) {
//       Alert.alert("Error", "Please enter meter ID");
//       return;
//     }

//     if (meterId.length !== 11) {
//       Alert.alert("Error", "Meter ID must be exactly 11 digits");
//       return;
//     }

//     if (!/^\d+$/.test(meterId)) {
//       Alert.alert("Error", "Meter ID must contain only numbers");
//       return;
//     }

//     let data = { meterId };

//     checkMeter(data, {
//       onSuccess: (response) => {
//         if (!response?.data || !response.data[0]) {
//           Alert.alert("Error", "No meter information found for this ID");
//           return;
//         }
//         setMeterInfo(response.data[0]);
//         // Success animation
//         Animated.sequence([
//           Animated.timing(scaleAnim, {
//             toValue: 1.1,
//             duration: 200,
//             useNativeDriver: true,
//           }),
//           Animated.timing(scaleAnim, {
//             toValue: 1,
//             duration: 200,
//             useNativeDriver: true,
//           }),
//         ]).start();
//         Alert.alert("Success", "Meter verified successfully! ⚡");
//       },
//       onError: (error) => {
//         let errorMessage = "Failed to verify meter";
//         if (error?.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         } else if (error?.message) {
//           errorMessage = error.message;
//         }
//         Alert.alert("Meter Verification Failed", errorMessage);
//         setMeterInfo(null);
//       },
//     });
//   };

//   const handlePayment = async () => {
//     if (!meterId) {
//       Alert.alert("Error", "Please enter meter ID");
//       return;
//     }

//     if (!units) {
//       Alert.alert("Error", "Please enter number of units");
//       return;
//     }

//     if (!meterInfo) {
//       Alert.alert("Error", "Please verify the meter first");
//       return;
//     }

//     const unitsNumber = Number(units);
//     if (isNaN(unitsNumber) || unitsNumber < MIN_UNITS) {
//       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} units`);
//       return;
//     }

//     if (unitsNumber > MAX_UNITS) {
//       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
//       return;
//     }

//     const { totalAmount } = calculateAmounts();

//     Alert.alert(
//       "Confirm Payment",
//       `Are you sure you want to purchase ${unitsNumber} units for ₦${totalAmount.toLocaleString()}?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         { text: "Confirm", onPress: () => processPayment() },
//       ]
//     );
//   };

//   const processPayment = () => {
//     let data = { meterId, units: Number(units) }; // Send units instead of amount

//     paybillsmeter(data, {
//       onSuccess: (response) => {
//         Alert.alert(
//           "Payment Successful! 🎉",
//           `Your electricity payment has been processed successfully!${
//             response?.data?.transaction?.token
//               ? `\n\nToken: ${response.data.transaction.token}`
//               : ""
//           }\n\nUnits: ${response?.data?.units_purchased || units} kWh`,
//           [{ text: "OK", onPress: () => navigation.goBack() }]
//         );
//       },
//       onError: (error) => {
//         console.log({
//           vgggvv: error.message,
//         });

//         let errorMessage = "Payment failed. Please try again";
//         if (error?.response?.data?.error) {
//           errorMessage = error.response.data.error;
//         } else if (error?.response?.data?.message) {
//           errorMessage = error.response.data.message;
//         } else if (error?.response?.status === 402) {
//           errorMessage = "Insufficient funds. Please top up your wallet";
//         } else {
//           errorMessage = error.message;
//         }
//         Alert.alert("Payment Failed", errorMessage);
//       },
//     });
//   };

//   const handleMeterIdChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
//     setMeterId(numericText);
//     if (meterInfo && text !== meterId) {
//       setMeterInfo(null);
//     }
//   };

//   const handleUnitsChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     if (numericText === "" || Number(numericText) <= MAX_UNITS) {
//       setUnits(numericText);
//     }
//   };

//   const getProgressPercentage = () => {
//     if (!units) return 0;
//     const numUnits = Number(units);
//     return Math.min((numUnits / MAX_UNITS) * 100, 100);
//   };

//   const getProgressColor = () => {
//     const percentage = getProgressPercentage();
//     if (percentage < 25) return "#3B82F6";
//     if (percentage < 50) return "#10B981";
//     if (percentage < 75) return "#F59E0B";
//     return "#A855F7";
//   };

//   const isValidUnits =
//     units && Number(units) >= MIN_UNITS && Number(units) <= MAX_UNITS;

//   const { units: unitsNumber, totalAmount, pricePerUnit } = calculateAmounts();

//   return (
//     <ScreenWrapper
//       title="Power Up! ⚡"
//       navigation={navigation}
//       headerStyle={{ backgroundColor: "white" }}
//     >
//       <ScrollView
//         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
//         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
//       >
//         {/* Header Card */}
//         <View
//           style={{
//             backgroundColor: "white",
//             borderRadius: 24,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.1,
//             shadowRadius: 12,
//             elevation: 5,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 20,
//             }}
//           >
//             <View
//               style={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 16,
//                 backgroundColor: "#3B82F6",
//                 justifyContent: "center",
//                 alignItems: "center",
//                 marginRight: 12,
//               }}
//             >
//               <Text style={{ fontSize: 24 }}>⚡</Text>
//             </View>
//             <View style={{ flex: 1 }}>
//               <Text
//                 style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
//               >
//                 Quick Payment
//               </Text>
//               <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
//                 ₦{PRICE_PER_UNIT} per unit • Easy & secure
//               </Text>
//             </View>
//           </View>

//           {/* Meter ID Input */}
//           <Text
//             style={{
//               fontSize: 14,
//               fontWeight: "600",
//               color: "#374151",
//               marginBottom: 8,
//             }}
//           >
//             🔢 Meter ID
//           </Text>
//           <View style={{ flexDirection: "row", marginBottom: 12 }}>
//             <TextInput
//               value={meterId}
//               onChangeText={handleMeterIdChange}
//               placeholder="Enter 11-digit meter ID"
//               keyboardType="numeric"
//               maxLength={11}
//               style={{
//                 flex: 1,
//                 borderWidth: 2,
//                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
//                 borderRadius: 12,
//                 paddingHorizontal: 16,
//                 paddingVertical: 12,
//                 marginRight: 10,
//                 fontSize: 16,
//                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
//               }}
//             />
//             {meterId.length === 11 && !meterInfo && (
//               <TouchableOpacity
//                 onPress={handleCheckMeter}
//                 disabled={checkMeterispending}
//                 style={{
//                   backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
//                   borderRadius: 12,
//                   paddingHorizontal: 20,
//                   justifyContent: "center",
//                   minWidth: 90,
//                 }}
//               >
//                 {checkMeterispending ? (
//                   <ActivityIndicator color="#fff" />
//                 ) : (
//                   <Text
//                     style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
//                   >
//                     Verify
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>

//           {meterId.length > 0 && meterId.length !== 11 && (
//             <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
//               ⚠️ {meterId.length}/11 digits entered
//             </Text>
//           )}
//         </View>

//         {/* Meter Info Card */}
//         {meterInfo && (
//           <Animated.View
//             style={{
//               transform: [{ scale: scaleAnim }],
//               backgroundColor: "#ECFDF5",
//               borderRadius: 20,
//               padding: 16,
//               marginBottom: 20,
//               borderLeftWidth: 4,
//               borderLeftColor: "#10B981",
//             }}
//           >
//             <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
//               <View
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 20,
//                   backgroundColor: "#10B981",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   marginRight: 12,
//                 }}
//               >
//                 <Text style={{ fontSize: 20 }}>✓</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text
//                   style={{
//                     fontSize: 16,
//                     fontWeight: "700",
//                     color: "#065F46",
//                     marginBottom: 8,
//                   }}
//                 >
//                   🏆 Meter Verified!
//                 </Text>
//                 <Text
//                   style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
//                 >
//                   <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
//                   {meterInfo?.Customer_name}
//                 </Text>
//                 <Text style={{ fontSize: 14, color: "#374151" }}>
//                   <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
//                   {meterInfo?.Customer_address}
//                 </Text>
//               </View>
//             </View>
//           </Animated.View>
//         )}

//         {/* Units Input Card */}
//         <View
//           style={{
//             backgroundColor: "white",
//             borderRadius: 24,
//             padding: 20,
//             marginBottom: 20,
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: 4 },
//             shadowOpacity: 0.1,
//             shadowRadius: 12,
//             elevation: 5,
//           }}
//         >
//           <Text
//             style={{
//               fontSize: 14,
//               fontWeight: "600",
//               color: "#374151",
//               marginBottom: 8,
//             }}
//           >
//             ⚡ Units ({MIN_UNITS} - {MAX_UNITS} kWh) • ₦{PRICE_PER_UNIT}/unit
//           </Text>

//           <View style={{ position: "relative", marginBottom: 16 }}>
//             <TextInput
//               value={units}
//               onChangeText={handleUnitsChange}
//               placeholder="0"
//               keyboardType="numeric"
//               editable={!!meterInfo}
//               style={{
//                 borderWidth: 2,
//                 borderColor: isValidUnits ? "#3B82F6" : "#E5E7EB",
//                 borderRadius: 16,
//                 paddingHorizontal: 16,
//                 paddingVertical: 16,
//                 fontSize: 32,
//                 fontWeight: "bold",
//                 color: meterInfo ? "#1F2937" : "#9CA3AF",
//                 backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
//                 textAlign: "center",
//               }}
//             />
//             {units && (
//               <Text
//                 style={{
//                   position: "absolute",
//                   right: 16,
//                   top: 22,
//                   fontSize: 18,
//                   fontWeight: "600",
//                   color: "#6B7280",
//                 }}
//               >
//                 kWh
//               </Text>
//             )}
//           </View>

//           {/* Progress Bar */}
//           {units && Number(units) > 0 && (
//             <View style={{ marginBottom: 16 }}>
//               <View
//                 style={{
//                   height: 12,
//                   backgroundColor: "#E5E7EB",
//                   borderRadius: 6,
//                   overflow: "hidden",
//                 }}
//               >
//                 <View
//                   style={{
//                     height: "100%",
//                     width: `${getProgressPercentage()}%`,
//                     backgroundColor: getProgressColor(),
//                     borderRadius: 6,
//                   }}
//                 />
//               </View>
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginTop: 8,
//                 }}
//               >
//                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
//                   {MIN_UNITS} units
//                 </Text>
//                 <Text
//                   style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
//                 >
//                   {getProgressPercentage().toFixed(0)}%
//                 </Text>
//                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
//                   {MAX_UNITS} units
//                 </Text>
//               </View>
//             </View>
//           )}

//           {/* Validation Message */}
//           {units && Number(units) < MIN_UNITS && (
//             <View
//               style={{
//                 backgroundColor: "#FEF3C7",
//                 borderRadius: 12,
//                 padding: 12,
//                 marginBottom: 16,
//               }}
//             >
//               <Text style={{ color: "#92400E", fontSize: 13 }}>
//                 ⚠️ Minimum purchase is {MIN_UNITS} units
//               </Text>
//             </View>
//           )}

//           <View>
//             <Text
//               style={{
//                 fontSize: 13,
//                 fontWeight: "600",
//                 color: "#6B7280",
//                 marginBottom: 10,
//               }}
//             >
//               Quick Select:
//             </Text>
//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 gap: 8,
//               }}
//             >
//               {quickUnits.map((quickUnit) => (
//                 <TouchableOpacity
//                   key={quickUnit}
//                   onPress={() => setUnits(quickUnit.toString())}
//                   disabled={!meterInfo}
//                   style={{
//                     flex: 1,
//                     backgroundColor:
//                       units === quickUnit.toString() ? "#3B82F6" : "#F3F4F6",
//                     borderRadius: 12,
//                     paddingVertical: 12,
//                     alignItems: "center",
//                     opacity: !meterInfo ? 0.5 : 1,
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontWeight: "700",
//                       color:
//                         units === quickUnit.toString() ? "#fff" : "#374151",
//                     }}
//                   >
//                     {quickUnit}
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 10,
//                       color:
//                         units === quickUnit.toString() ? "#E0E7FF" : "#6B7280",
//                       marginTop: 2,
//                     }}
//                   >
//                     kWh
//                   </Text>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </View>

//           {/* Cost Breakdown */}
//           {isValidUnits && (
//             <View
//               style={{
//                 backgroundColor: "#F8FAFC",
//                 borderRadius: 12,
//                 padding: 16,
//                 marginTop: 16,
//                 borderWidth: 1,
//                 borderColor: "#E2E8F0",
//               }}
//             >
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "700",
//                   color: "#374151",
//                   marginBottom: 12,
//                 }}
//               >
//                 Cost Breakdown
//               </Text>

//               <View style={{ marginBottom: 8 }}>
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     marginBottom: 6,
//                   }}
//                 >
//                   <Text style={{ fontSize: 13, color: "#6B7280" }}>Units:</Text>
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontWeight: "600",
//                       color: "#374151",
//                     }}
//                   >
//                     {unitsNumber} kWh
//                   </Text>
//                 </View>

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                     marginBottom: 6,
//                   }}
//                 >
//                   <Text style={{ fontSize: 13, color: "#6B7280" }}>
//                     Price per unit:
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontWeight: "600",
//                       color: "#374151",
//                     }}
//                   >
//                     ₦{pricePerUnit.toLocaleString()}
//                   </Text>
//                 </View>

//                 <View
//                   style={{
//                     height: 1,
//                     backgroundColor: "#E5E7EB",
//                     marginVertical: 8,
//                   }}
//                 />

//                 <View
//                   style={{
//                     flexDirection: "row",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Text
//                     style={{
//                       fontSize: 15,
//                       fontWeight: "700",
//                       color: "#1F2937",
//                     }}
//                   >
//                     Total Amount:
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 15,
//                       fontWeight: "700",
//                       color: "#1F2937",
//                     }}
//                   >
//                     ₦{totalAmount.toLocaleString()}
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>

//         {/* Stats Cards */}
//         {isValidUnits && (
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               marginBottom: 20,
//               gap: 10,
//             }}
//           >
//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: "#EFF6FF",
//                 borderRadius: 16,
//                 padding: 16,
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
//               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
//                 Units
//               </Text>
//               <Text
//                 style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
//               >
//                 {unitsNumber} kWh
//               </Text>
//             </View>
//             <View
//               style={{
//                 flex: 1,
//                 backgroundColor: "#ECFDF5",
//                 borderRadius: 16,
//                 padding: 16,
//                 alignItems: "center",
//               }}
//             >
//               <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
//               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
//                 You Pay
//               </Text>
//               <Text
//                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
//               >
//                 ₦{totalAmount.toLocaleString()}
//               </Text>
//             </View>
//           </View>
//         )}

//         {/* Pay Button */}
//         {meterInfo && isValidUnits && (
//           <TouchableOpacity
//             onPress={handlePayment}
//             disabled={paybillsmeterispending}
//             style={{
//               backgroundColor: paybillsmeterispending ? "#9CA3AF" : "#3B82F6",
//               borderRadius: 16,
//               paddingVertical: 18,
//               shadowColor: "#3B82F6",
//               shadowOffset: { width: 0, height: 4 },
//               shadowOpacity: 0.3,
//               shadowRadius: 8,
//               elevation: 8,
//             }}
//           >
//             {paybillsmeterispending ? (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "center",
//                   alignItems: "center",
//                 }}
//               >
//                 <ActivityIndicator color="#fff" />
//                 <Text
//                   style={{
//                     color: "#fff",
//                     marginLeft: 10,
//                     fontSize: 16,
//                     fontWeight: "700",
//                   }}
//                 >
//                   Processing...
//                 </Text>
//               </View>
//             ) : (
//               <Text
//                 style={{
//                   color: "#fff",
//                   textAlign: "center",
//                   fontSize: 18,
//                   fontWeight: "700",
//                 }}
//               >
//                 ⚡ Pay ₦{totalAmount.toLocaleString()} for {unitsNumber} units
//               </Text>
//             )}
//           </TouchableOpacity>
//         )}

//         {/* Helper Text */}
//         {!meterInfo && (
//           <View
//             style={{
//               backgroundColor: "#F9FAFB",
//               borderRadius: 16,
//               padding: 16,
//               marginTop: 20,
//             }}
//           >
//             <Text
//               style={{
//                 textAlign: "center",
//                 color: "#6B7280",
//                 fontSize: 13,
//                 fontStyle: "italic",
//               }}
//             >
//               💡 Enter your meter ID and verify to continue
//             </Text>
//           </View>
//         )}

//         {/* Footer Info */}
//         <View style={{ marginTop: 20 }}>
//           <Text
//             style={{
//               textAlign: "center",
//               fontSize: 12,
//               color: "#9CA3AF",
//             }}
//           >
//             🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
//           </Text>
//           <Text
//             style={{
//               textAlign: "center",
//               fontSize: 11,
//               color: "#9CA3AF",
//               marginTop: 4,
//             }}
//           >
//             Min: {MIN_UNITS} units • Max: {MAX_UNITS} units • ₦{PRICE_PER_UNIT}
//             /unit
//           </Text>
//         </View>
//       </ScrollView>
//     </ScreenWrapper>
//   );
// };

// export default ElectricityPaymentScreen;

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
} from "react-native";
import { useSelector } from "react-redux";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const ElectricityPaymentScreen = () => {
  const { user_data } = useSelector((state) => state.AuthSlice);
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);
  const navigation = useNavigation();

  console.log({
    vvv: user_data?.user.id,
  });

  console.log({
    vvv2: userProfile_data?.currentClanMeeting?._id,
  });

  const [meterId, setMeterId] = useState("");
  const [units, setUnits] = useState("");
  const [meterInfo, setMeterInfo] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const PRICE_PER_UNIT = 260;
  const MIN_UNITS = 1;
  const MAX_UNITS = 400;

  const quickUnits = [10, 20, 50, 100, 200];

  const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
    "api/captain/vend",
    "POST",
    "billpayment"
  );

  // Calculate total amount based on units
  const calculateAmounts = () => {
    const unitsNumber = Number(units) || 0;
    const totalAmount = unitsNumber * PRICE_PER_UNIT;

    return {
      units: unitsNumber,
      totalAmount,
      pricePerUnit: PRICE_PER_UNIT,
    };
  };

  const handleCheckMeter = async () => {
    if (!meterId) {
      Alert.alert("Error", "Please enter meter ID");
      return;
    }

    if (meterId.length !== 11) {
      Alert.alert("Error", "Meter ID must be exactly 11 digits");
      return;
    }

    if (!/^\d+$/.test(meterId)) {
      Alert.alert("Error", "Meter ID must contain only numbers");
      return;
    }

    let data = { meterId };

    checkMeter(data, {
      onSuccess: (response) => {
        if (!response?.data || !response.data[0]) {
          Alert.alert("Error", "No meter information found for this ID");
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
        Alert.alert("Success", "Meter verified successfully! ⚡");
      },
      onError: (error) => {
        let errorMessage = "Failed to verify meter";
        if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        Alert.alert("Meter Verification Failed", errorMessage);
        setMeterInfo(null);
      },
    });
  };

  const handlePayment = async () => {
    if (!meterId) {
      Alert.alert("Error", "Please enter meter ID");
      return;
    }

    if (!units) {
      Alert.alert("Error", "Please enter number of units");
      return;
    }

    if (!meterInfo) {
      Alert.alert("Error", "Please verify the meter first");
      return;
    }

    const unitsNumber = Number(units);
    if (isNaN(unitsNumber) || unitsNumber < MIN_UNITS) {
      Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} units`);
      return;
    }

    if (unitsNumber > MAX_UNITS) {
      Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
      return;
    }

    const { totalAmount } = calculateAmounts();

    Alert.alert(
      "Confirm Payment",
      `Are you sure you want to purchase ${unitsNumber} units for ₦${totalAmount.toLocaleString()}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => processPayment() },
      ]
    );
  };

  const processPayment = async () => {
    setIsProcessingPayment(true);

    try {
      const paymentData = {
        meterId,
        units: Number(units),
        userID: user_data.user.id,
        ClanId: userProfile_data?.currentClanMeeting?._id,
      };

      console.log({
        xxxx: paymentData,
      });

      // Replace with your actual API base URL
      const baseURL = "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/";
      const response = await fetch(`${baseURL}api/captain/buy/v2`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_data.token}`, // Add auth token if needed
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      // Payment successful
      Alert.alert(
        "Payment Successful! 🎉",
        `Your electricity payment has been processed successfully!${
          data?.data?.transaction?.token
            ? `\n\nToken: ${data.data.transaction.token}`
            : ""
        }\n\nUnits: ${data?.data?.units_purchased || units} kWh`,
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.log("Payment error:", error);

      let errorMessage = "Payment failed. Please try again";

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message?.includes("402") || error?.status === 402) {
        errorMessage = "Insufficient funds. Please top up your wallet";
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert("Payment Failed", errorMessage);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleMeterIdChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setMeterId(numericText);
    if (meterInfo && text !== meterId) {
      setMeterInfo(null);
    }
  };

  const handleUnitsChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "");
    if (numericText === "" || Number(numericText) <= MAX_UNITS) {
      setUnits(numericText);
    }
  };

  const getProgressPercentage = () => {
    if (!units) return 0;
    const numUnits = Number(units);
    return Math.min((numUnits / MAX_UNITS) * 100, 100);
  };

  const getProgressColor = () => {
    const percentage = getProgressPercentage();
    if (percentage < 25) return "#3B82F6";
    if (percentage < 50) return "#10B981";
    if (percentage < 75) return "#F59E0B";
    return "#A855F7";
  };

  const isValidUnits =
    units && Number(units) >= MIN_UNITS && Number(units) <= MAX_UNITS;

  const { units: unitsNumber, totalAmount, pricePerUnit } = calculateAmounts();

  return (
    <ScreenWrapper
      title="Power Up! ⚡"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
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
              <Text style={{ fontSize: 24 }}>⚡</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
              >
                Quick Payment
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                ₦{PRICE_PER_UNIT} per unit • Easy & secure
              </Text>
            </View>
          </View>

          {/* Meter ID Input */}
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
          <View style={{ flexDirection: "row", marginBottom: 12 }}>
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
                disabled={checkMeterispending}
                style={{
                  backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
                  borderRadius: 12,
                  paddingHorizontal: 20,
                  justifyContent: "center",
                  minWidth: 90,
                }}
              >
                {checkMeterispending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
                  >
                    Verify
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          {meterId.length > 0 && meterId.length !== 11 && (
            <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
              ⚠️ {meterId.length}/11 digits entered
            </Text>
          )}
        </View>

        {/* Meter Info Card */}
        {meterInfo && (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              backgroundColor: "#ECFDF5",
              borderRadius: 20,
              padding: 16,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: "#10B981",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
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
                <Text style={{ fontSize: 20 }}>✓</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#065F46",
                    marginBottom: 8,
                  }}
                >
                  🏆 Meter Verified!
                </Text>
                <Text
                  style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
                >
                  <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
                  {meterInfo?.Customer_name}
                </Text>
                <Text style={{ fontSize: 14, color: "#374151" }}>
                  <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
                  {meterInfo?.Customer_address}
                </Text>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Units Input Card */}
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
            ⚡ Units ({MIN_UNITS} - {MAX_UNITS} kWh) • ₦{PRICE_PER_UNIT}/unit
          </Text>

          <View style={{ position: "relative", marginBottom: 16 }}>
            <TextInput
              value={units}
              onChangeText={handleUnitsChange}
              placeholder="0"
              keyboardType="numeric"
              editable={!!meterInfo}
              style={{
                borderWidth: 2,
                borderColor: isValidUnits ? "#3B82F6" : "#E5E7EB",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 16,
                fontSize: 32,
                fontWeight: "bold",
                color: meterInfo ? "#1F2937" : "#9CA3AF",
                backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
                textAlign: "center",
              }}
            />
            {units && (
              <Text
                style={{
                  position: "absolute",
                  right: 16,
                  top: 22,
                  fontSize: 18,
                  fontWeight: "600",
                  color: "#6B7280",
                }}
              >
                kWh
              </Text>
            )}
          </View>

          {/* Progress Bar */}
          {units && Number(units) > 0 && (
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
                  {MIN_UNITS} units
                </Text>
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
                >
                  {getProgressPercentage().toFixed(0)}%
                </Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>
                  {MAX_UNITS} units
                </Text>
              </View>
            </View>
          )}

          {/* Validation Message */}
          {units && Number(units) < MIN_UNITS && (
            <View
              style={{
                backgroundColor: "#FEF3C7",
                borderRadius: 12,
                padding: 12,
                marginBottom: 16,
              }}
            >
              <Text style={{ color: "#92400E", fontSize: 13 }}>
                ⚠️ Minimum purchase is {MIN_UNITS} units
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
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              {quickUnits.map((quickUnit) => (
                <TouchableOpacity
                  key={quickUnit}
                  onPress={() => setUnits(quickUnit.toString())}
                  disabled={!meterInfo}
                  style={{
                    flex: 1,
                    backgroundColor:
                      units === quickUnit.toString() ? "#3B82F6" : "#F3F4F6",
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: "center",
                    opacity: !meterInfo ? 0.5 : 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color:
                        units === quickUnit.toString() ? "#fff" : "#374151",
                    }}
                  >
                    {quickUnit}
                  </Text>
                  <Text
                    style={{
                      fontSize: 10,
                      color:
                        units === quickUnit.toString() ? "#E0E7FF" : "#6B7280",
                      marginTop: 2,
                    }}
                  >
                    kWh
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Cost Breakdown */}
          {isValidUnits && (
            <View
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: 12,
                padding: 16,
                marginTop: 16,
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
                Cost Breakdown
              </Text>

              <View style={{ marginBottom: 8 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>Units:</Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    {unitsNumber} kWh
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>
                    Price per unit:
                  </Text>
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#374151",
                    }}
                  >
                    ₦{pricePerUnit.toLocaleString()}
                  </Text>
                </View>

                <View
                  style={{
                    height: 1,
                    backgroundColor: "#E5E7EB",
                    marginVertical: 8,
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1F2937",
                    }}
                  >
                    Total Amount:
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      color: "#1F2937",
                    }}
                  >
                    ₦{totalAmount.toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Stats Cards */}
        {isValidUnits && (
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
              <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
              <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
                Units
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
              >
                {unitsNumber} kWh
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
                You Pay
              </Text>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
              >
                ₦{totalAmount.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Pay Button */}
        {meterInfo && isValidUnits && (
          <TouchableOpacity
            onPress={handlePayment}
            disabled={isProcessingPayment}
            style={{
              backgroundColor: isProcessingPayment ? "#9CA3AF" : "#3B82F6",
              borderRadius: 16,
              paddingVertical: 18,
              shadowColor: "#3B82F6",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            {isProcessingPayment ? (
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
                ⚡ Pay ₦{totalAmount.toLocaleString()} for {unitsNumber} units
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Helper Text */}
        {!meterInfo && (
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
              💡 Enter your meter ID and verify to continue
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
            🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#9CA3AF",
              marginTop: 4,
            }}
          >
            Min: {MIN_UNITS} units • Max: {MAX_UNITS} units • ₦{PRICE_PER_UNIT}
            /unit
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

export default ElectricityPaymentScreen;
