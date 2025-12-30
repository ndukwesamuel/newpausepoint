// // // import React, { useState } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // //   ScrollView,
// // //   Animated,
// // // } from "react-native";
// // // import { useSelector } from "react-redux";
// // // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // // import { useNavigation } from "@react-navigation/native";
// // // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // // const ElectricityPaymentScreen = () => {
// // //   const { user_data } = useSelector((state) => state.AuthSlice);
// // //   const { userProfile_data } = useSelector((state) => state.ProfileSlice);
// // //   const navigation = useNavigation();

// // //   console.log({
// // //     vvv: user_data?.user.id,
// // //   });

// // //   console.log({
// // //     vvv2: userProfile_data?.currentClanMeeting?._id,
// // //   });

// // //   const [meterId, setMeterId] = useState("");
// // //   const [units, setUnits] = useState("");
// // //   const [meterInfo, setMeterInfo] = useState(null);
// // //   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
// // //   const scaleAnim = useState(new Animated.Value(1))[0];

// // //   const PRICE_PER_UNIT = 260;
// // //   const MIN_UNITS = 1;
// // //   const MAX_UNITS = 400;

// // //   const quickUnits = [10, 20, 50, 100, 200];

// // //   const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
// // //     "api/captain/vend",
// // //     "POST",
// // //     "billpayment"
// // //   );

// // //   // Calculate total amount based on units
// // //   const calculateAmounts = () => {
// // //     const unitsNumber = Number(units) || 0;
// // //     const totalAmount = unitsNumber * PRICE_PER_UNIT;

// // //     return {
// // //       units: unitsNumber,
// // //       totalAmount,
// // //       pricePerUnit: PRICE_PER_UNIT,
// // //     };
// // //   };

// // //   const handleCheckMeter = async () => {
// // //     if (!meterId) {
// // //       Alert.alert("Error", "Please enter meter ID");
// // //       return;
// // //     }

// // //     if (meterId.length !== 11) {
// // //       Alert.alert("Error", "Meter ID must be exactly 11 digits");
// // //       return;
// // //     }

// // //     if (!/^\d+$/.test(meterId)) {
// // //       Alert.alert("Error", "Meter ID must contain only numbers");
// // //       return;
// // //     }

// // //     let data = { meterId };

// // //     checkMeter(data, {
// // //       onSuccess: (response) => {
// // //         if (!response?.data || !response.data[0]) {
// // //           Alert.alert("Error", "No meter information found for this ID");
// // //           return;
// // //         }
// // //         setMeterInfo(response.data[0]);
// // //         Animated.sequence([
// // //           Animated.timing(scaleAnim, {
// // //             toValue: 1.1,
// // //             duration: 200,
// // //             useNativeDriver: true,
// // //           }),
// // //           Animated.timing(scaleAnim, {
// // //             toValue: 1,
// // //             duration: 200,
// // //             useNativeDriver: true,
// // //           }),
// // //         ]).start();
// // //         Alert.alert("Success", "Meter verified successfully! ⚡");
// // //       },
// // //       onError: (error) => {
// // //         let errorMessage = "Failed to verify meter";
// // //         if (error?.response?.data?.message) {
// // //           errorMessage = error.response.data.message;
// // //         } else if (error?.message) {
// // //           errorMessage = error.message;
// // //         }
// // //         Alert.alert("Meter Verification Failed", errorMessage);
// // //         setMeterInfo(null);
// // //       },
// // //     });
// // //   };

// // //   const handlePayment = async () => {
// // //     if (!meterId) {
// // //       Alert.alert("Error", "Please enter meter ID");
// // //       return;
// // //     }

// // //     if (!units) {
// // //       Alert.alert("Error", "Please enter number of units");
// // //       return;
// // //     }

// // //     if (!meterInfo) {
// // //       Alert.alert("Error", "Please verify the meter first");
// // //       return;
// // //     }

// // //     const unitsNumber = Number(units);
// // //     if (isNaN(unitsNumber) || unitsNumber < MIN_UNITS) {
// // //       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} units`);
// // //       return;
// // //     }

// // //     if (unitsNumber > MAX_UNITS) {
// // //       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
// // //       return;
// // //     }

// // //     const { totalAmount } = calculateAmounts();

// // //     Alert.alert(
// // //       "Confirm Payment",
// // //       `Are you sure you want to purchase ${unitsNumber} units for ₦${totalAmount.toLocaleString()}?`,
// // //       [
// // //         { text: "Cancel", style: "cancel" },
// // //         { text: "Confirm", onPress: () => processPayment() },
// // //       ]
// // //     );
// // //   };

// // //   const processPayment = async () => {
// // //     setIsProcessingPayment(true);

// // //     try {
// // //       const paymentData = {
// // //         meterId,
// // //         units: Number(units),
// // //         userID: user_data.user.id,
// // //         ClanId: userProfile_data?.currentClanMeeting?._id,
// // //       };

// // //       console.log({
// // //         xxxx: paymentData,
// // //       });

// // //       // Replace with your actual API base URL
// // //       const baseURL = "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/";
// // //       const response = await fetch(`${baseURL}api/captain/buy/v2`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${user_data.token}`, // Add auth token if needed
// // //         },
// // //         body: JSON.stringify(paymentData),
// // //       });

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(
// // //           data.message || `HTTP error! status: ${response.status}`
// // //         );
// // //       }

// // //       // Payment successful
// // //       Alert.alert(
// // //         "Payment Successful! 🎉",
// // //         `Your electricity payment has been processed successfully!${
// // //           data?.data?.transaction?.token
// // //             ? `\n\nToken: ${data.data.transaction.token}`
// // //             : ""
// // //         }\n\nUnits: ${data?.data?.units_purchased || units} kWh`,
// // //         [{ text: "OK", onPress: () => navigation.goBack() }]
// // //       );
// // //     } catch (error) {
// // //       console.log("Payment error:", error);

// // //       let errorMessage = "Payment failed. Please try again";

// // //       if (error?.response?.data?.error) {
// // //         errorMessage = error.response.data.error;
// // //       } else if (error?.response?.data?.message) {
// // //         errorMessage = error.response.data.message;
// // //       } else if (error?.message?.includes("402") || error?.status === 402) {
// // //         errorMessage = "Insufficient funds. Please top up your wallet";
// // //       } else if (error.message) {
// // //         errorMessage = error.message;
// // //       }

// // //       Alert.alert("Payment Failed", errorMessage);
// // //     } finally {
// // //       setIsProcessingPayment(false);
// // //     }
// // //   };

// // //   const handleMeterIdChange = (text) => {
// // //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// // //     setMeterId(numericText);
// // //     if (meterInfo && text !== meterId) {
// // //       setMeterInfo(null);
// // //     }
// // //   };

// // //   const handleUnitsChange = (text) => {
// // //     const numericText = text.replace(/[^0-9]/g, "");
// // //     if (numericText === "" || Number(numericText) <= MAX_UNITS) {
// // //       setUnits(numericText);
// // //     }
// // //   };

// // //   const getProgressPercentage = () => {
// // //     if (!units) return 0;
// // //     const numUnits = Number(units);
// // //     return Math.min((numUnits / MAX_UNITS) * 100, 100);
// // //   };

// // //   const getProgressColor = () => {
// // //     const percentage = getProgressPercentage();
// // //     if (percentage < 25) return "#3B82F6";
// // //     if (percentage < 50) return "#10B981";
// // //     if (percentage < 75) return "#F59E0B";
// // //     return "#A855F7";
// // //   };

// // //   const isValidUnits =
// // //     units && Number(units) >= MIN_UNITS && Number(units) <= MAX_UNITS;

// // //   const { units: unitsNumber, totalAmount, pricePerUnit } = calculateAmounts();

// // //   return (
// // //     <ScreenWrapper
// // //       title="Power Up! ⚡"
// // //       navigation={navigation}
// // //       headerStyle={{ backgroundColor: "white" }}
// // //     >
// // //       <ScrollView
// // //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// // //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// // //       >
// // //         {/* Header Card */}
// // //         <View
// // //           style={{
// // //             backgroundColor: "white",
// // //             borderRadius: 24,
// // //             padding: 20,
// // //             marginBottom: 20,
// // //             shadowColor: "#000",
// // //             shadowOffset: { width: 0, height: 4 },
// // //             shadowOpacity: 0.1,
// // //             shadowRadius: 12,
// // //             elevation: 5,
// // //           }}
// // //         >
// // //           <View
// // //             style={{
// // //               flexDirection: "row",
// // //               alignItems: "center",
// // //               marginBottom: 20,
// // //             }}
// // //           >
// // //             <View
// // //               style={{
// // //                 width: 48,
// // //                 height: 48,
// // //                 borderRadius: 16,
// // //                 backgroundColor: "#3B82F6",
// // //                 justifyContent: "center",
// // //                 alignItems: "center",
// // //                 marginRight: 12,
// // //               }}
// // //             >
// // //               <Text style={{ fontSize: 24 }}>⚡</Text>
// // //             </View>
// // //             <View style={{ flex: 1 }}>
// // //               <Text
// // //                 style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
// // //               >
// // //                 Quick Payment
// // //               </Text>
// // //               <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
// // //                 ₦{PRICE_PER_UNIT} per unit • Easy & secure
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* Meter ID Input */}
// // //           <Text
// // //             style={{
// // //               fontSize: 14,
// // //               fontWeight: "600",
// // //               color: "#374151",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             🔢 Meter ID
// // //           </Text>
// // //           <View style={{ flexDirection: "row", marginBottom: 12 }}>
// // //             <TextInput
// // //               value={meterId}
// // //               onChangeText={handleMeterIdChange}
// // //               placeholder="Enter 11-digit meter ID"
// // //               keyboardType="numeric"
// // //               maxLength={11}
// // //               style={{
// // //                 flex: 1,
// // //                 borderWidth: 2,
// // //                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
// // //                 borderRadius: 12,
// // //                 paddingHorizontal: 16,
// // //                 paddingVertical: 12,
// // //                 marginRight: 10,
// // //                 fontSize: 16,
// // //                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
// // //               }}
// // //             />
// // //             {meterId.length === 11 && !meterInfo && (
// // //               <TouchableOpacity
// // //                 onPress={handleCheckMeter}
// // //                 disabled={checkMeterispending}
// // //                 style={{
// // //                   backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
// // //                   borderRadius: 12,
// // //                   paddingHorizontal: 20,
// // //                   justifyContent: "center",
// // //                   minWidth: 90,
// // //                 }}
// // //               >
// // //                 {checkMeterispending ? (
// // //                   <ActivityIndicator color="#fff" />
// // //                 ) : (
// // //                   <Text
// // //                     style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
// // //                   >
// // //                     Verify
// // //                   </Text>
// // //                 )}
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>

// // //           {meterId.length > 0 && meterId.length !== 11 && (
// // //             <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
// // //               ⚠️ {meterId.length}/11 digits entered
// // //             </Text>
// // //           )}
// // //         </View>

// // //         {/* Meter Info Card */}
// // //         {meterInfo && (
// // //           <Animated.View
// // //             style={{
// // //               transform: [{ scale: scaleAnim }],
// // //               backgroundColor: "#ECFDF5",
// // //               borderRadius: 20,
// // //               padding: 16,
// // //               marginBottom: 20,
// // //               borderLeftWidth: 4,
// // //               borderLeftColor: "#10B981",
// // //             }}
// // //           >
// // //             <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
// // //               <View
// // //                 style={{
// // //                   width: 40,
// // //                   height: 40,
// // //                   borderRadius: 20,
// // //                   backgroundColor: "#10B981",
// // //                   justifyContent: "center",
// // //                   alignItems: "center",
// // //                   marginRight: 12,
// // //                 }}
// // //               >
// // //                 <Text style={{ fontSize: 20 }}>✓</Text>
// // //               </View>
// // //               <View style={{ flex: 1 }}>
// // //                 <Text
// // //                   style={{
// // //                     fontSize: 16,
// // //                     fontWeight: "700",
// // //                     color: "#065F46",
// // //                     marginBottom: 8,
// // //                   }}
// // //                 >
// // //                   🏆 Meter Verified!
// // //                 </Text>
// // //                 <Text
// // //                   style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
// // //                 >
// // //                   <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
// // //                   {meterInfo?.Customer_name}
// // //                 </Text>
// // //                 <Text style={{ fontSize: 14, color: "#374151" }}>
// // //                   <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
// // //                   {meterInfo?.Customer_address}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </Animated.View>
// // //         )}

// // //         {/* Units Input Card */}
// // //         <View
// // //           style={{
// // //             backgroundColor: "white",
// // //             borderRadius: 24,
// // //             padding: 20,
// // //             marginBottom: 20,
// // //             shadowColor: "#000",
// // //             shadowOffset: { width: 0, height: 4 },
// // //             shadowOpacity: 0.1,
// // //             shadowRadius: 12,
// // //             elevation: 5,
// // //           }}
// // //         >
// // //           <Text
// // //             style={{
// // //               fontSize: 14,
// // //               fontWeight: "600",
// // //               color: "#374151",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             ⚡ Units ({MIN_UNITS} - {MAX_UNITS} kWh) • ₦{PRICE_PER_UNIT}/unit
// // //           </Text>

// // //           <View style={{ position: "relative", marginBottom: 16 }}>
// // //             <TextInput
// // //               value={units}
// // //               onChangeText={handleUnitsChange}
// // //               placeholder="0"
// // //               keyboardType="numeric"
// // //               editable={!!meterInfo}
// // //               style={{
// // //                 borderWidth: 2,
// // //                 borderColor: isValidUnits ? "#3B82F6" : "#E5E7EB",
// // //                 borderRadius: 16,
// // //                 paddingHorizontal: 16,
// // //                 paddingVertical: 16,
// // //                 fontSize: 32,
// // //                 fontWeight: "bold",
// // //                 color: meterInfo ? "#1F2937" : "#9CA3AF",
// // //                 backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
// // //                 textAlign: "center",
// // //               }}
// // //             />
// // //             {units && (
// // //               <Text
// // //                 style={{
// // //                   position: "absolute",
// // //                   right: 16,
// // //                   top: 22,
// // //                   fontSize: 18,
// // //                   fontWeight: "600",
// // //                   color: "#6B7280",
// // //                 }}
// // //               >
// // //                 kWh
// // //               </Text>
// // //             )}
// // //           </View>

// // //           {/* Progress Bar */}
// // //           {units && Number(units) > 0 && (
// // //             <View style={{ marginBottom: 16 }}>
// // //               <View
// // //                 style={{
// // //                   height: 12,
// // //                   backgroundColor: "#E5E7EB",
// // //                   borderRadius: 6,
// // //                   overflow: "hidden",
// // //                 }}
// // //               >
// // //                 <View
// // //                   style={{
// // //                     height: "100%",
// // //                     width: `${getProgressPercentage()}%`,
// // //                     backgroundColor: getProgressColor(),
// // //                     borderRadius: 6,
// // //                   }}
// // //                 />
// // //               </View>
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "space-between",
// // //                   marginTop: 8,
// // //                 }}
// // //               >
// // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                   {MIN_UNITS} units
// // //                 </Text>
// // //                 <Text
// // //                   style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
// // //                 >
// // //                   {getProgressPercentage().toFixed(0)}%
// // //                 </Text>
// // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                   {MAX_UNITS} units
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           )}

// // //           {/* Validation Message */}
// // //           {units && Number(units) < MIN_UNITS && (
// // //             <View
// // //               style={{
// // //                 backgroundColor: "#FEF3C7",
// // //                 borderRadius: 12,
// // //                 padding: 12,
// // //                 marginBottom: 16,
// // //               }}
// // //             >
// // //               <Text style={{ color: "#92400E", fontSize: 13 }}>
// // //                 ⚠️ Minimum purchase is {MIN_UNITS} units
// // //               </Text>
// // //             </View>
// // //           )}

// // //           <View>
// // //             <Text
// // //               style={{
// // //                 fontSize: 13,
// // //                 fontWeight: "600",
// // //                 color: "#6B7280",
// // //                 marginBottom: 10,
// // //               }}
// // //             >
// // //               Quick Select:
// // //             </Text>
// // //             <View
// // //               style={{
// // //                 flexDirection: "row",
// // //                 justifyContent: "space-between",
// // //                 gap: 8,
// // //               }}
// // //             >
// // //               {quickUnits.map((quickUnit) => (
// // //                 <TouchableOpacity
// // //                   key={quickUnit}
// // //                   onPress={() => setUnits(quickUnit.toString())}
// // //                   disabled={!meterInfo}
// // //                   style={{
// // //                     flex: 1,
// // //                     backgroundColor:
// // //                       units === quickUnit.toString() ? "#3B82F6" : "#F3F4F6",
// // //                     borderRadius: 12,
// // //                     paddingVertical: 12,
// // //                     alignItems: "center",
// // //                     opacity: !meterInfo ? 0.5 : 1,
// // //                   }}
// // //                 >
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 13,
// // //                       fontWeight: "700",
// // //                       color:
// // //                         units === quickUnit.toString() ? "#fff" : "#374151",
// // //                     }}
// // //                   >
// // //                     {quickUnit}
// // //                   </Text>
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 10,
// // //                       color:
// // //                         units === quickUnit.toString() ? "#E0E7FF" : "#6B7280",
// // //                       marginTop: 2,
// // //                     }}
// // //                   >
// // //                     kWh
// // //                   </Text>
// // //                 </TouchableOpacity>
// // //               ))}
// // //             </View>
// // //           </View>

// // //           {/* Cost Breakdown */}
// // //           {isValidUnits && (
// // //             <View
// // //               style={{
// // //                 backgroundColor: "#F8FAFC",
// // //                 borderRadius: 12,
// // //                 padding: 16,
// // //                 marginTop: 16,
// // //                 borderWidth: 1,
// // //                 borderColor: "#E2E8F0",
// // //               }}
// // //             >
// // //               <Text
// // //                 style={{
// // //                   fontSize: 14,
// // //                   fontWeight: "700",
// // //                   color: "#374151",
// // //                   marginBottom: 12,
// // //                 }}
// // //               >
// // //                 Cost Breakdown
// // //               </Text>

// // //               <View style={{ marginBottom: 8 }}>
// // //                 <View
// // //                   style={{
// // //                     flexDirection: "row",
// // //                     justifyContent: "space-between",
// // //                     marginBottom: 6,
// // //                   }}
// // //                 >
// // //                   <Text style={{ fontSize: 13, color: "#6B7280" }}>Units:</Text>
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 13,
// // //                       fontWeight: "600",
// // //                       color: "#374151",
// // //                     }}
// // //                   >
// // //                     {unitsNumber} kWh
// // //                   </Text>
// // //                 </View>

// // //                 <View
// // //                   style={{
// // //                     flexDirection: "row",
// // //                     justifyContent: "space-between",
// // //                     marginBottom: 6,
// // //                   }}
// // //                 >
// // //                   <Text style={{ fontSize: 13, color: "#6B7280" }}>
// // //                     Price per unit:
// // //                   </Text>
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 13,
// // //                       fontWeight: "600",
// // //                       color: "#374151",
// // //                     }}
// // //                   >
// // //                     ₦{pricePerUnit.toLocaleString()}
// // //                   </Text>
// // //                 </View>

// // //                 <View
// // //                   style={{
// // //                     height: 1,
// // //                     backgroundColor: "#E5E7EB",
// // //                     marginVertical: 8,
// // //                   }}
// // //                 />

// // //                 <View
// // //                   style={{
// // //                     flexDirection: "row",
// // //                     justifyContent: "space-between",
// // //                   }}
// // //                 >
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 15,
// // //                       fontWeight: "700",
// // //                       color: "#1F2937",
// // //                     }}
// // //                   >
// // //                     Total Amount:
// // //                   </Text>
// // //                   <Text
// // //                     style={{
// // //                       fontSize: 15,
// // //                       fontWeight: "700",
// // //                       color: "#1F2937",
// // //                     }}
// // //                   >
// // //                     ₦{totalAmount.toLocaleString()}
// // //                   </Text>
// // //                 </View>
// // //               </View>
// // //             </View>
// // //           )}
// // //         </View>

// // //         {/* Stats Cards */}
// // //         {isValidUnits && (
// // //           <View
// // //             style={{
// // //               flexDirection: "row",
// // //               justifyContent: "space-between",
// // //               marginBottom: 20,
// // //               gap: 10,
// // //             }}
// // //           >
// // //             <View
// // //               style={{
// // //                 flex: 1,
// // //                 backgroundColor: "#EFF6FF",
// // //                 borderRadius: 16,
// // //                 padding: 16,
// // //                 alignItems: "center",
// // //               }}
// // //             >
// // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
// // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // //                 Units
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
// // //               >
// // //                 {unitsNumber} kWh
// // //               </Text>
// // //             </View>
// // //             <View
// // //               style={{
// // //                 flex: 1,
// // //                 backgroundColor: "#ECFDF5",
// // //                 borderRadius: 16,
// // //                 padding: 16,
// // //                 alignItems: "center",
// // //               }}
// // //             >
// // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
// // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // //                 You Pay
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
// // //               >
// // //                 ₦{totalAmount.toLocaleString()}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         )}

// // //         {/* Pay Button */}
// // //         {meterInfo && isValidUnits && (
// // //           <TouchableOpacity
// // //             onPress={handlePayment}
// // //             disabled={isProcessingPayment}
// // //             style={{
// // //               backgroundColor: isProcessingPayment ? "#9CA3AF" : "#3B82F6",
// // //               borderRadius: 16,
// // //               paddingVertical: 18,
// // //               shadowColor: "#3B82F6",
// // //               shadowOffset: { width: 0, height: 4 },
// // //               shadowOpacity: 0.3,
// // //               shadowRadius: 8,
// // //               elevation: 8,
// // //             }}
// // //           >
// // //             {isProcessingPayment ? (
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "center",
// // //                   alignItems: "center",
// // //                 }}
// // //               >
// // //                 <ActivityIndicator color="#fff" />
// // //                 <Text
// // //                   style={{
// // //                     color: "#fff",
// // //                     marginLeft: 10,
// // //                     fontSize: 16,
// // //                     fontWeight: "700",
// // //                   }}
// // //                 >
// // //                   Processing...
// // //                 </Text>
// // //               </View>
// // //             ) : (
// // //               <Text
// // //                 style={{
// // //                   color: "#fff",
// // //                   textAlign: "center",
// // //                   fontSize: 18,
// // //                   fontWeight: "700",
// // //                 }}
// // //               >
// // //                 ⚡ Pay ₦{totalAmount.toLocaleString()} for {unitsNumber} units
// // //               </Text>
// // //             )}
// // //           </TouchableOpacity>
// // //         )}

// // //         {/* Helper Text */}
// // //         {!meterInfo && (
// // //           <View
// // //             style={{
// // //               backgroundColor: "#F9FAFB",
// // //               borderRadius: 16,
// // //               padding: 16,
// // //               marginTop: 20,
// // //             }}
// // //           >
// // //             <Text
// // //               style={{
// // //                 textAlign: "center",
// // //                 color: "#6B7280",
// // //                 fontSize: 13,
// // //                 fontStyle: "italic",
// // //               }}
// // //             >
// // //               💡 Enter your meter ID and verify to continue
// // //             </Text>
// // //           </View>
// // //         )}

// // //         {/* Footer Info */}
// // //         <View style={{ marginTop: 20 }}>
// // //           <Text
// // //             style={{
// // //               textAlign: "center",
// // //               fontSize: 12,
// // //               color: "#9CA3AF",
// // //             }}
// // //           >
// // //             🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
// // //           </Text>
// // //           <Text
// // //             style={{
// // //               textAlign: "center",
// // //               fontSize: 11,
// // //               color: "#9CA3AF",
// // //               marginTop: 4,
// // //             }}
// // //           >
// // //             Min: {MIN_UNITS} units • Max: {MAX_UNITS} units • ₦{PRICE_PER_UNIT}
// // //             /unit
// // //           </Text>
// // //         </View>
// // //       </ScrollView>
// // //     </ScreenWrapper>
// // //   );
// // // };

// // // export default ElectricityPaymentScreen;

// // // // // import React, { useState } from "react";
// // // // // import {
// // // // //   View,
// // // // //   Text,
// // // // //   TextInput,
// // // // //   TouchableOpacity,
// // // // //   ActivityIndicator,
// // // // //   Alert,
// // // // //   ScrollView,
// // // // //   Animated,
// // // // // } from "react-native";
// // // // // import { useSelector } from "react-redux";
// // // // // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // // // // import { useNavigation } from "@react-navigation/native";
// // // // // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // // // // const ElectricityPaymentScreen = () => {
// // // // //   const { user_data } = useSelector((state) => state.AuthSlice);
// // // // //   const { userProfile_data } = useSelector((state) => state.ProfileSlice);
// // // // //   const navigation = useNavigation();

// // // // //   console.log({
// // // // //     vvv: user_data?.user.id,
// // // // //   });

// // // // //   console.log({
// // // // //     vvv2: userProfile_data?.currentClanMeeting?._id,
// // // // //   });

// // // // //   const [meterId, setMeterId] = useState("");
// // // // //   const [units, setUnits] = useState("");
// // // // //   const [meterInfo, setMeterInfo] = useState(null);
// // // // //   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
// // // // //   const scaleAnim = useState(new Animated.Value(1))[0];

// // // // //   const PRICE_PER_UNIT = 260;
// // // // //   const MIN_UNITS = 1;
// // // // //   const MAX_UNITS = 400;

// // // // //   const quickUnits = [10, 20, 50, 100, 200];

// // // // //   const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
// // // // //     "api/captain/vend",
// // // // //     "POST",
// // // // //     "billpayment"
// // // // //   );

// // // // //   // Calculate total amount based on units
// // // // //   const calculateAmounts = () => {
// // // // //     const unitsNumber = Number(units) || 0;
// // // // //     const totalAmount = unitsNumber * PRICE_PER_UNIT;

// // // // //     return {
// // // // //       units: unitsNumber,
// // // // //       totalAmount,
// // // // //       pricePerUnit: PRICE_PER_UNIT,
// // // // //     };
// // // // //   };

// // // // //   const handleCheckMeter = async () => {
// // // // //     if (!meterId) {
// // // // //       Alert.alert("Error", "Please enter meter ID");
// // // // //       return;
// // // // //     }

// // // // //     if (meterId.length !== 11) {
// // // // //       Alert.alert("Error", "Meter ID must be exactly 11 digits");
// // // // //       return;
// // // // //     }

// // // // //     if (!/^\d+$/.test(meterId)) {
// // // // //       Alert.alert("Error", "Meter ID must contain only numbers");
// // // // //       return;
// // // // //     }

// // // // //     let data = { meterId };

// // // // //     checkMeter(data, {
// // // // //       onSuccess: (response) => {
// // // // //         if (!response?.data || !response.data[0]) {
// // // // //           Alert.alert("Error", "No meter information found for this ID");
// // // // //           return;
// // // // //         }
// // // // //         setMeterInfo(response.data[0]);
// // // // //         Animated.sequence([
// // // // //           Animated.timing(scaleAnim, {
// // // // //             toValue: 1.1,
// // // // //             duration: 200,
// // // // //             useNativeDriver: true,
// // // // //           }),
// // // // //           Animated.timing(scaleAnim, {
// // // // //             toValue: 1,
// // // // //             duration: 200,
// // // // //             useNativeDriver: true,
// // // // //           }),
// // // // //         ]).start();
// // // // //         Alert.alert("Success", "Meter verified successfully! ⚡");
// // // // //       },
// // // // //       onError: (error) => {
// // // // //         let errorMessage = "Failed to verify meter";
// // // // //         if (error?.response?.data?.message) {
// // // // //           errorMessage = error.response.data.message;
// // // // //         } else if (error?.message) {
// // // // //           errorMessage = error.message;
// // // // //         }
// // // // //         Alert.alert("Meter Verification Failed", errorMessage);
// // // // //         setMeterInfo(null);
// // // // //       },
// // // // //     });
// // // // //   };

// // // // //   const handlePayment = async () => {
// // // // //     if (!meterId) {
// // // // //       Alert.alert("Error", "Please enter meter ID");
// // // // //       return;
// // // // //     }

// // // // //     if (!units) {
// // // // //       Alert.alert("Error", "Please enter number of units");
// // // // //       return;
// // // // //     }

// // // // //     if (!meterInfo) {
// // // // //       Alert.alert("Error", "Please verify the meter first");
// // // // //       return;
// // // // //     }

// // // // //     const unitsNumber = Number(units);
// // // // //     if (isNaN(unitsNumber) || unitsNumber < MIN_UNITS) {
// // // // //       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} units`);
// // // // //       return;
// // // // //     }

// // // // //     if (unitsNumber > MAX_UNITS) {
// // // // //       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
// // // // //       return;
// // // // //     }

// // // // //     const { totalAmount } = calculateAmounts();

// // // // //     Alert.alert(
// // // // //       "Confirm Payment",
// // // // //       `Are you sure you want to purchase ${unitsNumber} units for ₦${totalAmount.toLocaleString()}?`,
// // // // //       [
// // // // //         { text: "Cancel", style: "cancel" },
// // // // //         { text: "Confirm", onPress: () => processPayment() },
// // // // //       ]
// // // // //     );
// // // // //   };

// // // // //   const processPayment = async () => {
// // // // //     setIsProcessingPayment(true);

// // // // //     try {
// // // // //       const paymentData = {
// // // // //         meterId,
// // // // //         units: Number(units),
// // // // //         userID: user_data.user.id,
// // // // //         ClanId: userProfile_data?.currentClanMeeting?._id,
// // // // //       };

// // // // //       console.log({
// // // // //         xxxx: paymentData,
// // // // //       });

// // // // //       // Replace with your actual API base URL
// // // // //       const baseURL = "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/";
// // // // //       const response = await fetch(`${baseURL}api/captain/buy/v2`, {
// // // // //         method: "POST",
// // // // //         headers: {
// // // // //           "Content-Type": "application/json",
// // // // //           Authorization: `Bearer ${user_data.token}`, // Add auth token if needed
// // // // //         },
// // // // //         body: JSON.stringify(paymentData),
// // // // //       });

// // // // //       const data = await response.json();

// // // // //       if (!response.ok) {
// // // // //         throw new Error(
// // // // //           data.message || `HTTP error! status: ${response.status}`
// // // // //         );
// // // // //       }

// // // // //       // Payment successful
// // // // //       Alert.alert(
// // // // //         "Payment Successful! 🎉",
// // // // //         `Your electricity payment has been processed successfully!${
// // // // //           data?.data?.transaction?.token
// // // // //             ? `\n\nToken: ${data.data.transaction.token}`
// // // // //             : ""
// // // // //         }\n\nUnits: ${data?.data?.units_purchased || units} kWh`,
// // // // //         [{ text: "OK", onPress: () => navigation.goBack() }]
// // // // //       );
// // // // //     } catch (error) {
// // // // //       console.log("Payment error:", error);

// // // // //       let errorMessage = "Payment failed. Please try again";

// // // // //       if (error?.response?.data?.error) {
// // // // //         errorMessage = error.response.data.error;
// // // // //       } else if (error?.response?.data?.message) {
// // // // //         errorMessage = error.response.data.message;
// // // // //       } else if (error?.message?.includes("402") || error?.status === 402) {
// // // // //         errorMessage = "Insufficient funds. Please top up your wallet";
// // // // //       } else if (error.message) {
// // // // //         errorMessage = error.message;
// // // // //       }

// // // // //       Alert.alert("Payment Failed", errorMessage);
// // // // //     } finally {
// // // // //       setIsProcessingPayment(false);
// // // // //     }
// // // // //   };

// // // // //   const handleMeterIdChange = (text) => {
// // // // //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// // // // //     setMeterId(numericText);
// // // // //     if (meterInfo && text !== meterId) {
// // // // //       setMeterInfo(null);
// // // // //     }
// // // // //   };

// // // // //   const handleUnitsChange = (text) => {
// // // // //     const numericText = text.replace(/[^0-9]/g, "");
// // // // //     if (numericText === "" || Number(numericText) <= MAX_UNITS) {
// // // // //       setUnits(numericText);
// // // // //     }
// // // // //   };

// // // // //   const getProgressPercentage = () => {
// // // // //     if (!units) return 0;
// // // // //     const numUnits = Number(units);
// // // // //     return Math.min((numUnits / MAX_UNITS) * 100, 100);
// // // // //   };

// // // // //   const getProgressColor = () => {
// // // // //     const percentage = getProgressPercentage();
// // // // //     if (percentage < 25) return "#3B82F6";
// // // // //     if (percentage < 50) return "#10B981";
// // // // //     if (percentage < 75) return "#F59E0B";
// // // // //     return "#A855F7";
// // // // //   };

// // // // //   const isValidUnits =
// // // // //     units && Number(units) >= MIN_UNITS && Number(units) <= MAX_UNITS;

// // // // //   const { units: unitsNumber, totalAmount, pricePerUnit } = calculateAmounts();

// // // // //   return (
// // // // //     <ScreenWrapper
// // // // //       title="Power Up! ⚡"
// // // // //       navigation={navigation}
// // // // //       headerStyle={{ backgroundColor: "white" }}
// // // // //     >
// // // // //       <ScrollView
// // // // //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// // // // //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// // // // //       >
// // // // //         {/* Header Card */}
// // // // //         <View
// // // // //           style={{
// // // // //             backgroundColor: "white",
// // // // //             borderRadius: 24,
// // // // //             padding: 20,
// // // // //             marginBottom: 20,
// // // // //             shadowColor: "#000",
// // // // //             shadowOffset: { width: 0, height: 4 },
// // // // //             shadowOpacity: 0.1,
// // // // //             shadowRadius: 12,
// // // // //             elevation: 5,
// // // // //           }}
// // // // //         >
// // // // //           <View
// // // // //             style={{
// // // // //               flexDirection: "row",
// // // // //               alignItems: "center",
// // // // //               marginBottom: 20,
// // // // //             }}
// // // // //           >
// // // // //             <View
// // // // //               style={{
// // // // //                 width: 48,
// // // // //                 height: 48,
// // // // //                 borderRadius: 16,
// // // // //                 backgroundColor: "#3B82F6",
// // // // //                 justifyContent: "center",
// // // // //                 alignItems: "center",
// // // // //                 marginRight: 12,
// // // // //               }}
// // // // //             >
// // // // //               <Text style={{ fontSize: 24 }}>⚡</Text>
// // // // //             </View>
// // // // //             <View style={{ flex: 1 }}>
// // // // //               <Text
// // // // //                 style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
// // // // //               >
// // // // //                 Quick Payment
// // // // //               </Text>
// // // // //               <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
// // // // //                 ₦{PRICE_PER_UNIT} per unit • Easy & secure
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* Meter ID Input */}
// // // // //           <Text
// // // // //             style={{
// // // // //               fontSize: 14,
// // // // //               fontWeight: "600",
// // // // //               color: "#374151",
// // // // //               marginBottom: 8,
// // // // //             }}
// // // // //           >
// // // // //             🔢 Meter ID
// // // // //           </Text>
// // // // //           <View style={{ flexDirection: "row", marginBottom: 12 }}>
// // // // //             <TextInput
// // // // //               value={meterId}
// // // // //               onChangeText={handleMeterIdChange}
// // // // //               placeholder="Enter 11-digit meter ID"
// // // // //               keyboardType="numeric"
// // // // //               maxLength={11}
// // // // //               style={{
// // // // //                 flex: 1,
// // // // //                 borderWidth: 2,
// // // // //                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
// // // // //                 borderRadius: 12,
// // // // //                 paddingHorizontal: 16,
// // // // //                 paddingVertical: 12,
// // // // //                 marginRight: 10,
// // // // //                 fontSize: 16,
// // // // //                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
// // // // //               }}
// // // // //             />
// // // // //             {meterId.length === 11 && !meterInfo && (
// // // // //               <TouchableOpacity
// // // // //                 onPress={handleCheckMeter}
// // // // //                 disabled={checkMeterispending}
// // // // //                 style={{
// // // // //                   backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
// // // // //                   borderRadius: 12,
// // // // //                   paddingHorizontal: 20,
// // // // //                   justifyContent: "center",
// // // // //                   minWidth: 90,
// // // // //                 }}
// // // // //               >
// // // // //                 {checkMeterispending ? (
// // // // //                   <ActivityIndicator color="#fff" />
// // // // //                 ) : (
// // // // //                   <Text
// // // // //                     style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
// // // // //                   >
// // // // //                     Verify
// // // // //                   </Text>
// // // // //                 )}
// // // // //               </TouchableOpacity>
// // // // //             )}
// // // // //           </View>

// // // // //           {meterId.length > 0 && meterId.length !== 11 && (
// // // // //             <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
// // // // //               ⚠️ {meterId.length}/11 digits entered
// // // // //             </Text>
// // // // //           )}
// // // // //         </View>

// // // // //         {/* Meter Info Card */}
// // // // //         {meterInfo && (
// // // // //           <Animated.View
// // // // //             style={{
// // // // //               transform: [{ scale: scaleAnim }],
// // // // //               backgroundColor: "#ECFDF5",
// // // // //               borderRadius: 20,
// // // // //               padding: 16,
// // // // //               marginBottom: 20,
// // // // //               borderLeftWidth: 4,
// // // // //               borderLeftColor: "#10B981",
// // // // //             }}
// // // // //           >
// // // // //             <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
// // // // //               <View
// // // // //                 style={{
// // // // //                   width: 40,
// // // // //                   height: 40,
// // // // //                   borderRadius: 20,
// // // // //                   backgroundColor: "#10B981",
// // // // //                   justifyContent: "center",
// // // // //                   alignItems: "center",
// // // // //                   marginRight: 12,
// // // // //                 }}
// // // // //               >
// // // // //                 <Text style={{ fontSize: 20 }}>✓</Text>
// // // // //               </View>
// // // // //               <View style={{ flex: 1 }}>
// // // // //                 <Text
// // // // //                   style={{
// // // // //                     fontSize: 16,
// // // // //                     fontWeight: "700",
// // // // //                     color: "#065F46",
// // // // //                     marginBottom: 8,
// // // // //                   }}
// // // // //                 >
// // // // //                   🏆 Meter Verified!
// // // // //                 </Text>
// // // // //                 <Text
// // // // //                   style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
// // // // //                 >
// // // // //                   <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
// // // // //                   {meterInfo?.Customer_name}
// // // // //                 </Text>
// // // // //                 <Text style={{ fontSize: 14, color: "#374151" }}>
// // // // //                   <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
// // // // //                   {meterInfo?.Customer_address}
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           </Animated.View>
// // // // //         )}

// // // // //         {/* Units Input Card */}
// // // // //         <View
// // // // //           style={{
// // // // //             backgroundColor: "white",
// // // // //             borderRadius: 24,
// // // // //             padding: 20,
// // // // //             marginBottom: 20,
// // // // //             shadowColor: "#000",
// // // // //             shadowOffset: { width: 0, height: 4 },
// // // // //             shadowOpacity: 0.1,
// // // // //             shadowRadius: 12,
// // // // //             elevation: 5,
// // // // //           }}
// // // // //         >
// // // // //           <Text
// // // // //             style={{
// // // // //               fontSize: 14,
// // // // //               fontWeight: "600",
// // // // //               color: "#374151",
// // // // //               marginBottom: 8,
// // // // //             }}
// // // // //           >
// // // // //             ⚡ Units ({MIN_UNITS} - {MAX_UNITS} kWh) • ₦{PRICE_PER_UNIT}/unit
// // // // //           </Text>

// // // // //           <View style={{ position: "relative", marginBottom: 16 }}>
// // // // //             <TextInput
// // // // //               value={units}
// // // // //               onChangeText={handleUnitsChange}
// // // // //               placeholder="0"
// // // // //               keyboardType="numeric"
// // // // //               editable={!!meterInfo}
// // // // //               style={{
// // // // //                 borderWidth: 2,
// // // // //                 borderColor: isValidUnits ? "#3B82F6" : "#E5E7EB",
// // // // //                 borderRadius: 16,
// // // // //                 paddingHorizontal: 16,
// // // // //                 paddingVertical: 16,
// // // // //                 fontSize: 32,
// // // // //                 fontWeight: "bold",
// // // // //                 color: meterInfo ? "#1F2937" : "#9CA3AF",
// // // // //                 backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
// // // // //                 textAlign: "center",
// // // // //               }}
// // // // //             />
// // // // //             {units && (
// // // // //               <Text
// // // // //                 style={{
// // // // //                   position: "absolute",
// // // // //                   right: 16,
// // // // //                   top: 22,
// // // // //                   fontSize: 18,
// // // // //                   fontWeight: "600",
// // // // //                   color: "#6B7280",
// // // // //                 }}
// // // // //               >
// // // // //                 kWh
// // // // //               </Text>
// // // // //             )}
// // // // //           </View>

// // // // //           {/* Progress Bar */}
// // // // //           {units && Number(units) > 0 && (
// // // // //             <View style={{ marginBottom: 16 }}>
// // // // //               <View
// // // // //                 style={{
// // // // //                   height: 12,
// // // // //                   backgroundColor: "#E5E7EB",
// // // // //                   borderRadius: 6,
// // // // //                   overflow: "hidden",
// // // // //                 }}
// // // // //               >
// // // // //                 <View
// // // // //                   style={{
// // // // //                     height: "100%",
// // // // //                     width: `${getProgressPercentage()}%`,
// // // // //                     backgroundColor: getProgressColor(),
// // // // //                     borderRadius: 6,
// // // // //                   }}
// // // // //                 />
// // // // //               </View>
// // // // //               <View
// // // // //                 style={{
// // // // //                   flexDirection: "row",
// // // // //                   justifyContent: "space-between",
// // // // //                   marginTop: 8,
// // // // //                 }}
// // // // //               >
// // // // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // // //                   {MIN_UNITS} units
// // // // //                 </Text>
// // // // //                 <Text
// // // // //                   style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
// // // // //                 >
// // // // //                   {getProgressPercentage().toFixed(0)}%
// // // // //                 </Text>
// // // // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // // //                   {MAX_UNITS} units
// // // // //                 </Text>
// // // // //               </View>
// // // // //             </View>
// // // // //           )}

// // // // //           {/* Validation Message */}
// // // // //           {units && Number(units) < MIN_UNITS && (
// // // // //             <View
// // // // //               style={{
// // // // //                 backgroundColor: "#FEF3C7",
// // // // //                 borderRadius: 12,
// // // // //                 padding: 12,
// // // // //                 marginBottom: 16,
// // // // //               }}
// // // // //             >
// // // // //               <Text style={{ color: "#92400E", fontSize: 13 }}>
// // // // //                 ⚠️ Minimum purchase is {MIN_UNITS} units
// // // // //               </Text>
// // // // //             </View>
// // // // //           )}

// // // // //           <View>
// // // // //             <Text
// // // // //               style={{
// // // // //                 fontSize: 13,
// // // // //                 fontWeight: "600",
// // // // //                 color: "#6B7280",
// // // // //                 marginBottom: 10,
// // // // //               }}
// // // // //             >
// // // // //               Quick Select:
// // // // //             </Text>
// // // // //             <View
// // // // //               style={{
// // // // //                 flexDirection: "row",
// // // // //                 justifyContent: "space-between",
// // // // //                 gap: 8,
// // // // //               }}
// // // // //             >
// // // // //               {quickUnits.map((quickUnit) => (
// // // // //                 <TouchableOpacity
// // // // //                   key={quickUnit}
// // // // //                   onPress={() => setUnits(quickUnit.toString())}
// // // // //                   disabled={!meterInfo}
// // // // //                   style={{
// // // // //                     flex: 1,
// // // // //                     backgroundColor:
// // // // //                       units === quickUnit.toString() ? "#3B82F6" : "#F3F4F6",
// // // // //                     borderRadius: 12,
// // // // //                     paddingVertical: 12,
// // // // //                     alignItems: "center",
// // // // //                     opacity: !meterInfo ? 0.5 : 1,
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 13,
// // // // //                       fontWeight: "700",
// // // // //                       color:
// // // // //                         units === quickUnit.toString() ? "#fff" : "#374151",
// // // // //                     }}
// // // // //                   >
// // // // //                     {quickUnit}
// // // // //                   </Text>
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 10,
// // // // //                       color:
// // // // //                         units === quickUnit.toString() ? "#E0E7FF" : "#6B7280",
// // // // //                       marginTop: 2,
// // // // //                     }}
// // // // //                   >
// // // // //                     kWh
// // // // //                   </Text>
// // // // //                 </TouchableOpacity>
// // // // //               ))}
// // // // //             </View>
// // // // //           </View>

// // // // //           {/* Cost Breakdown */}
// // // // //           {isValidUnits && (
// // // // //             <View
// // // // //               style={{
// // // // //                 backgroundColor: "#F8FAFC",
// // // // //                 borderRadius: 12,
// // // // //                 padding: 16,
// // // // //                 marginTop: 16,
// // // // //                 borderWidth: 1,
// // // // //                 borderColor: "#E2E8F0",
// // // // //               }}
// // // // //             >
// // // // //               <Text
// // // // //                 style={{
// // // // //                   fontSize: 14,
// // // // //                   fontWeight: "700",
// // // // //                   color: "#374151",
// // // // //                   marginBottom: 12,
// // // // //                 }}
// // // // //               >
// // // // //                 Cost Breakdown
// // // // //               </Text>

// // // // //               <View style={{ marginBottom: 8 }}>
// // // // //                 <View
// // // // //                   style={{
// // // // //                     flexDirection: "row",
// // // // //                     justifyContent: "space-between",
// // // // //                     marginBottom: 6,
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={{ fontSize: 13, color: "#6B7280" }}>Units:</Text>
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 13,
// // // // //                       fontWeight: "600",
// // // // //                       color: "#374151",
// // // // //                     }}
// // // // //                   >
// // // // //                     {unitsNumber} kWh
// // // // //                   </Text>
// // // // //                 </View>

// // // // //                 <View
// // // // //                   style={{
// // // // //                     flexDirection: "row",
// // // // //                     justifyContent: "space-between",
// // // // //                     marginBottom: 6,
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text style={{ fontSize: 13, color: "#6B7280" }}>
// // // // //                     Price per unit:
// // // // //                   </Text>
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 13,
// // // // //                       fontWeight: "600",
// // // // //                       color: "#374151",
// // // // //                     }}
// // // // //                   >
// // // // //                     ₦{pricePerUnit.toLocaleString()}
// // // // //                   </Text>
// // // // //                 </View>

// // // // //                 <View
// // // // //                   style={{
// // // // //                     height: 1,
// // // // //                     backgroundColor: "#E5E7EB",
// // // // //                     marginVertical: 8,
// // // // //                   }}
// // // // //                 />

// // // // //                 <View
// // // // //                   style={{
// // // // //                     flexDirection: "row",
// // // // //                     justifyContent: "space-between",
// // // // //                   }}
// // // // //                 >
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 15,
// // // // //                       fontWeight: "700",
// // // // //                       color: "#1F2937",
// // // // //                     }}
// // // // //                   >
// // // // //                     Total Amount:
// // // // //                   </Text>
// // // // //                   <Text
// // // // //                     style={{
// // // // //                       fontSize: 15,
// // // // //                       fontWeight: "700",
// // // // //                       color: "#1F2937",
// // // // //                     }}
// // // // //                   >
// // // // //                     ₦{totalAmount.toLocaleString()}
// // // // //                   </Text>
// // // // //                 </View>
// // // // //               </View>
// // // // //             </View>
// // // // //           )}
// // // // //         </View>

// // // // //         {/* Stats Cards */}
// // // // //         {isValidUnits && (
// // // // //           <View
// // // // //             style={{
// // // // //               flexDirection: "row",
// // // // //               justifyContent: "space-between",
// // // // //               marginBottom: 20,
// // // // //               gap: 10,
// // // // //             }}
// // // // //           >
// // // // //             <View
// // // // //               style={{
// // // // //                 flex: 1,
// // // // //                 backgroundColor: "#EFF6FF",
// // // // //                 borderRadius: 16,
// // // // //                 padding: 16,
// // // // //                 alignItems: "center",
// // // // //               }}
// // // // //             >
// // // // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
// // // // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // // // //                 Units
// // // // //               </Text>
// // // // //               <Text
// // // // //                 style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
// // // // //               >
// // // // //                 {unitsNumber} kWh
// // // // //               </Text>
// // // // //             </View>
// // // // //             <View
// // // // //               style={{
// // // // //                 flex: 1,
// // // // //                 backgroundColor: "#ECFDF5",
// // // // //                 borderRadius: 16,
// // // // //                 padding: 16,
// // // // //                 alignItems: "center",
// // // // //               }}
// // // // //             >
// // // // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>💵</Text>
// // // // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // // // //                 You Pay
// // // // //               </Text>
// // // // //               <Text
// // // // //                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
// // // // //               >
// // // // //                 ₦{totalAmount.toLocaleString()}
// // // // //               </Text>
// // // // //             </View>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Pay Button */}
// // // // //         {meterInfo && isValidUnits && (
// // // // //           <TouchableOpacity
// // // // //             onPress={handlePayment}
// // // // //             disabled={isProcessingPayment}
// // // // //             style={{
// // // // //               backgroundColor: isProcessingPayment ? "#9CA3AF" : "#3B82F6",
// // // // //               borderRadius: 16,
// // // // //               paddingVertical: 18,
// // // // //               shadowColor: "#3B82F6",
// // // // //               shadowOffset: { width: 0, height: 4 },
// // // // //               shadowOpacity: 0.3,
// // // // //               shadowRadius: 8,
// // // // //               elevation: 8,
// // // // //             }}
// // // // //           >
// // // // //             {isProcessingPayment ? (
// // // // //               <View
// // // // //                 style={{
// // // // //                   flexDirection: "row",
// // // // //                   justifyContent: "center",
// // // // //                   alignItems: "center",
// // // // //                 }}
// // // // //               >
// // // // //                 <ActivityIndicator color="#fff" />
// // // // //                 <Text
// // // // //                   style={{
// // // // //                     color: "#fff",
// // // // //                     marginLeft: 10,
// // // // //                     fontSize: 16,
// // // // //                     fontWeight: "700",
// // // // //                   }}
// // // // //                 >
// // // // //                   Processing...
// // // // //                 </Text>
// // // // //               </View>
// // // // //             ) : (
// // // // //               <Text
// // // // //                 style={{
// // // // //                   color: "#fff",
// // // // //                   textAlign: "center",
// // // // //                   fontSize: 18,
// // // // //                   fontWeight: "700",
// // // // //                 }}
// // // // //               >
// // // // //                 ⚡ Pay ₦{totalAmount.toLocaleString()} for {unitsNumber} units
// // // // //               </Text>
// // // // //             )}
// // // // //           </TouchableOpacity>
// // // // //         )}

// // // // //         {/* Helper Text */}
// // // // //         {!meterInfo && (
// // // // //           <View
// // // // //             style={{
// // // // //               backgroundColor: "#F9FAFB",
// // // // //               borderRadius: 16,
// // // // //               padding: 16,
// // // // //               marginTop: 20,
// // // // //             }}
// // // // //           >
// // // // //             <Text
// // // // //               style={{
// // // // //                 textAlign: "center",
// // // // //                 color: "#6B7280",
// // // // //                 fontSize: 13,
// // // // //                 fontStyle: "italic",
// // // // //               }}
// // // // //             >
// // // // //               💡 Enter your meter ID and verify to continue
// // // // //             </Text>
// // // // //           </View>
// // // // //         )}

// // // // //         {/* Footer Info */}
// // // // //         <View style={{ marginTop: 20 }}>
// // // // //           <Text
// // // // //             style={{
// // // // //               textAlign: "center",
// // // // //               fontSize: 12,
// // // // //               color: "#9CA3AF",
// // // // //             }}
// // // // //           >
// // // // //             🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
// // // // //           </Text>
// // // // //           <Text
// // // // //             style={{
// // // // //               textAlign: "center",
// // // // //               fontSize: 11,
// // // // //               color: "#9CA3AF",
// // // // //               marginTop: 4,
// // // // //             }}
// // // // //           >
// // // // //             Min: {MIN_UNITS} units • Max: {MAX_UNITS} units • ₦{PRICE_PER_UNIT}
// // // // //             /unit
// // // // //           </Text>
// // // // //         </View>
// // // // //       </ScrollView>
// // // // //     </ScreenWrapper>
// // // // //   );
// // // // // };

// // // // // export default ElectricityPaymentScreen;

// // // // import React, { useState, useEffect } from "react";
// // // // import {
// // // //   View,
// // // //   Text,
// // // //   TextInput,
// // // //   TouchableOpacity,
// // // //   ActivityIndicator,
// // // //   Alert,
// // // //   ScrollView,
// // // //   Animated,
// // // // } from "react-native";
// // // // import { useSelector } from "react-redux";
// // // // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // // // import { useNavigation } from "@react-navigation/native";
// // // // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // // // const ElectricityPaymentScreen = () => {
// // // //   const { user_data } = useSelector((state) => state.AuthSlice);
// // // //   const { userProfile_data } = useSelector((state) => state.ProfileSlice);
// // // //   const navigation = useNavigation();

// // // //   const [meterId, setMeterId] = useState("");
// // // //   const [units, setUnits] = useState("");
// // // //   const [meterInfo, setMeterInfo] = useState(null);
// // // //   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
// // // //   const [isLoadingCreditStatus, setIsLoadingCreditStatus] = useState(true);
// // // //   const scaleAnim = useState(new Animated.Value(1))[0];

// // // //   // Credit status state
// // // //   const [creditStatus, setCreditStatus] = useState({
// // // //     isEligible: false,
// // // //     walletBalance: 0,
// // // //     eligibilityProgress: {
// // // //       current: 0,
// // // //       required: 100000,
// // // //       percentage: 0,
// // // //     },
// // // //     credit: {
// // // //       limit: 10000,
// // // //       available: 0,
// // // //       outstanding: 0,
// // // //       canUse: false,
// // // //     },
// // // //   });

// // // //   // Price constants
// // // //   const NORMAL_PRICE_PER_UNIT = 260;
// // // //   const CREDIT_PRICE_PER_UNIT = 262;
// // // //   const MIN_UNITS = 1;
// // // //   const MAX_UNITS = 400;
// // // //   const WALLET_THRESHOLD = 2000; // ₦2,000 threshold for credit usage

// // // //   const quickUnits = [10, 20, 50, 100, 200];

// // // //   const baseURL = "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/";

// // // //   // Fetch credit status on mount
// // // //   useEffect(() => {
// // // //     fetchCreditStatus();
// // // //   }, []);

// // // //   const fetchCreditStatus = async () => {
// // // //     setIsLoadingCreditStatus(true);
// // // //     try {
// // // //       const response = await fetch(`${baseURL}api/captain/credit-status`, {
// // // //         method: "GET",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${user_data.token}`,
// // // //         },
// // // //       });

// // // //       const data = await response.json();

// // // //       if (data.success) {
// // // //         setCreditStatus(data.data);
// // // //       }
// // // //     } catch (error) {
// // // //       console.log("Error fetching credit status:", error);
// // // //     } finally {
// // // //       setIsLoadingCreditStatus(false);
// // // //     }
// // // //   };

// // // //   const { mutate: checkMeter, isLoading: checkMeterispending } = useMutateData(
// // // //     "api/captain/vend",
// // // //     "POST",
// // // //     "billpayment"
// // // //   );

// // // //   // Calculate payment breakdown based on wallet balance and credit availability
// // // //   const calculatePaymentBreakdown = () => {
// // // //     const unitsNumber = Number(units) || 0;
// // // //     const walletBalance = creditStatus.walletBalance || 0;
// // // //     const availableCredit = creditStatus.credit?.available || 0;
// // // //     const canUseCredit =
// // // //       creditStatus.credit?.canUse && walletBalance <= WALLET_THRESHOLD;

// // // //     // Calculate total at normal price first
// // // //     const totalAtNormalPrice = unitsNumber * NORMAL_PRICE_PER_UNIT;

// // // //     // If wallet can cover everything, use wallet only
// // // //     if (walletBalance >= totalAtNormalPrice) {
// // // //       return {
// // // //         units: unitsNumber,
// // // //         walletUnits: unitsNumber,
// // // //         creditUnits: 0,
// // // //         walletAmount: totalAtNormalPrice,
// // // //         creditAmount: 0,
// // // //         totalAmount: totalAtNormalPrice,
// // // //         pricePerUnit: NORMAL_PRICE_PER_UNIT,
// // // //         paymentSource: "wallet_only",
// // // //         canProceed: true,
// // // //         shortfall: 0,
// // // //         usingCredit: false,
// // // //       };
// // // //     }

// // // //     // Wallet can't cover it - check if credit can help
// // // //     if (!canUseCredit) {
// // // //       // No credit available, show shortfall
// // // //       return {
// // // //         units: unitsNumber,
// // // //         walletUnits: 0,
// // // //         creditUnits: 0,
// // // //         walletAmount: walletBalance,
// // // //         creditAmount: 0,
// // // //         totalAmount: totalAtNormalPrice,
// // // //         pricePerUnit: NORMAL_PRICE_PER_UNIT,
// // // //         paymentSource: "insufficient",
// // // //         canProceed: false,
// // // //         shortfall: totalAtNormalPrice - walletBalance,
// // // //         usingCredit: false,
// // // //       };
// // // //     }

// // // //     // Calculate how many units wallet can cover at normal price
// // // //     const walletUnits = Math.floor(walletBalance / NORMAL_PRICE_PER_UNIT);
// // // //     const walletAmount = walletUnits * NORMAL_PRICE_PER_UNIT;

// // // //     // Remaining units need to come from credit at credit price
// // // //     const creditUnits = unitsNumber - walletUnits;
// // // //     const creditAmount = creditUnits * CREDIT_PRICE_PER_UNIT;

// // // //     // Check if credit can cover the remaining
// // // //     if (creditAmount > availableCredit) {
// // // //       // Not enough credit either
// // // //       const maxCreditUnits = Math.floor(
// // // //         availableCredit / CREDIT_PRICE_PER_UNIT
// // // //       );
// // // //       const totalPossibleUnits = walletUnits + maxCreditUnits;
// // // //       const shortfall =
// // // //         (unitsNumber - totalPossibleUnits) * CREDIT_PRICE_PER_UNIT;

// // // //       return {
// // // //         units: unitsNumber,
// // // //         walletUnits: walletUnits,
// // // //         creditUnits: maxCreditUnits,
// // // //         walletAmount: walletAmount,
// // // //         creditAmount: maxCreditUnits * CREDIT_PRICE_PER_UNIT,
// // // //         totalAmount: walletAmount + maxCreditUnits * CREDIT_PRICE_PER_UNIT,
// // // //         pricePerUnit: NORMAL_PRICE_PER_UNIT,
// // // //         creditPricePerUnit: CREDIT_PRICE_PER_UNIT,
// // // //         paymentSource: "insufficient",
// // // //         canProceed: false,
// // // //         shortfall: shortfall,
// // // //         usingCredit: true,
// // // //       };
// // // //     }

// // // //     // Can proceed with wallet + credit
// // // //     const totalAmount = walletAmount + creditAmount;

// // // //     return {
// // // //       units: unitsNumber,
// // // //       walletUnits: walletUnits,
// // // //       creditUnits: creditUnits,
// // // //       walletAmount: walletAmount,
// // // //       creditAmount: creditAmount,
// // // //       totalAmount: totalAmount,
// // // //       pricePerUnit: NORMAL_PRICE_PER_UNIT,
// // // //       creditPricePerUnit: CREDIT_PRICE_PER_UNIT,
// // // //       paymentSource:
// // // //         walletUnits > 0 && creditUnits > 0
// // // //           ? "wallet_and_credit"
// // // //           : creditUnits > 0
// // // //           ? "credit_only"
// // // //           : "wallet_only",
// // // //       canProceed: true,
// // // //       shortfall: 0,
// // // //       usingCredit: creditUnits > 0,
// // // //     };
// // // //   };

// // // //   const handleCheckMeter = async () => {
// // // //     if (!meterId) {
// // // //       Alert.alert("Error", "Please enter meter ID");
// // // //       return;
// // // //     }

// // // //     if (meterId.length !== 11) {
// // // //       Alert.alert("Error", "Meter ID must be exactly 11 digits");
// // // //       return;
// // // //     }

// // // //     if (!/^\d+$/.test(meterId)) {
// // // //       Alert.alert("Error", "Meter ID must contain only numbers");
// // // //       return;
// // // //     }

// // // //     let data = { meterId };

// // // //     checkMeter(data, {
// // // //       onSuccess: (response) => {
// // // //         if (!response?.data || !response.data[0]) {
// // // //           Alert.alert("Error", "No meter information found for this ID");
// // // //           return;
// // // //         }
// // // //         setMeterInfo(response.data[0]);
// // // //         Animated.sequence([
// // // //           Animated.timing(scaleAnim, {
// // // //             toValue: 1.1,
// // // //             duration: 200,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //           Animated.timing(scaleAnim, {
// // // //             toValue: 1,
// // // //             duration: 200,
// // // //             useNativeDriver: true,
// // // //           }),
// // // //         ]).start();
// // // //         Alert.alert("Success", "Meter verified successfully! ⚡");
// // // //       },
// // // //       onError: (error) => {
// // // //         let errorMessage = "Failed to verify meter";
// // // //         if (error?.response?.data?.message) {
// // // //           errorMessage = error.response.data.message;
// // // //         } else if (error?.message) {
// // // //           errorMessage = error.message;
// // // //         }
// // // //         Alert.alert("Meter Verification Failed", errorMessage);
// // // //         setMeterInfo(null);
// // // //       },
// // // //     });
// // // //   };

// // // //   const handlePayment = async () => {
// // // //     if (!meterId) {
// // // //       Alert.alert("Error", "Please enter meter ID");
// // // //       return;
// // // //     }

// // // //     if (!units) {
// // // //       Alert.alert("Error", "Please enter number of units");
// // // //       return;
// // // //     }

// // // //     if (!meterInfo) {
// // // //       Alert.alert("Error", "Please verify the meter first");
// // // //       return;
// // // //     }

// // // //     const unitsNumber = Number(units);
// // // //     if (isNaN(unitsNumber) || unitsNumber < MIN_UNITS) {
// // // //       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} units`);
// // // //       return;
// // // //     }

// // // //     if (unitsNumber > MAX_UNITS) {
// // // //       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
// // // //       return;
// // // //     }

// // // //     const breakdown = calculatePaymentBreakdown();

// // // //     if (!breakdown.canProceed) {
// // // //       Alert.alert(
// // // //         "Insufficient Funds",
// // // //         `You need ₦${breakdown.shortfall.toLocaleString()} more to complete this purchase.\n\nWallet Balance: ₦${creditStatus.walletBalance.toLocaleString()}${
// // // //           creditStatus.credit?.available > 0
// // // //             ? `\nAvailable Credit: ₦${creditStatus.credit.available.toLocaleString()}`
// // // //             : ""
// // // //         }`
// // // //       );
// // // //       return;
// // // //     }

// // // //     // Build confirmation message
// // // //     let confirmMessage = `Purchase ${unitsNumber} units for ₦${breakdown.totalAmount.toLocaleString()}?\n\n`;

// // // //     if (breakdown.usingCredit) {
// // // //       confirmMessage += `💳 Payment Breakdown:\n`;
// // // //       if (breakdown.walletUnits > 0) {
// // // //         confirmMessage += `• ${
// // // //           breakdown.walletUnits
// // // //         } units from Wallet @ ₦${NORMAL_PRICE_PER_UNIT} = ₦${breakdown.walletAmount.toLocaleString()}\n`;
// // // //       }
// // // //       if (breakdown.creditUnits > 0) {
// // // //         confirmMessage += `• ${
// // // //           breakdown.creditUnits
// // // //         } units from Emergency Credit @ ₦${CREDIT_PRICE_PER_UNIT} = ₦${breakdown.creditAmount.toLocaleString()}\n`;
// // // //       }
// // // //       confirmMessage += `\n⚠️ Credit used will be auto-deducted from your next wallet funding.`;
// // // //     } else {
// // // //       confirmMessage += `💳 ₦${breakdown.totalAmount.toLocaleString()} from Wallet`;
// // // //     }

// // // //     Alert.alert("Confirm Payment", confirmMessage, [
// // // //       { text: "Cancel", style: "cancel" },
// // // //       { text: "Confirm", onPress: () => processPayment(breakdown) },
// // // //     ]);
// // // //   };

// // // //   const processPayment = async (breakdown) => {
// // // //     setIsProcessingPayment(true);

// // // //     try {
// // // //       const paymentData = {
// // // //         meterId,
// // // //         units: Number(units),
// // // //         userID: user_data.user.id,
// // // //         ClanId: userProfile_data?.currentClanMeeting?._id,
// // // //       };

// // // //       const response = await fetch(`${baseURL}api/captain/buy/v4`, {
// // // //         method: "POST",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${user_data.token}`,
// // // //         },
// // // //         body: JSON.stringify(paymentData),
// // // //       });

// // // //       const data = await response.json();

// // // //       if (!response.ok) {
// // // //         throw new Error(
// // // //           data.error || data.message || `HTTP error! status: ${response.status}`
// // // //         );
// // // //       }

// // // //       // Build success message
// // // //       let successMessage = `Your electricity payment has been processed successfully!\n\n`;
// // // //       successMessage += `🔑 Token: ${
// // // //         data?.data?.transaction?.token || "N/A"
// // // //       }\n`;
// // // //       successMessage += `⚡ Units: ${
// // // //         data?.data?.units_purchased || units
// // // //       } kWh\n\n`;

// // // //       if (data?.data?.payment_breakdown) {
// // // //         const pb = data.data.payment_breakdown;
// // // //         successMessage += `💳 Payment:\n`;
// // // //         if (pb.from_wallet > 0) {
// // // //           successMessage += `• Wallet: ₦${pb.from_wallet.toLocaleString()}\n`;
// // // //         }
// // // //         if (pb.from_credit > 0) {
// // // //           successMessage += `• Emergency Credit: ₦${pb.from_credit.toLocaleString()}\n`;
// // // //         }
// // // //       }

// // // //       if (data?.data?.credit_status?.outstanding_balance > 0) {
// // // //         successMessage += `\n📋 Credit Owed: ₦${data.data.credit_status.outstanding_balance.toLocaleString()}`;
// // // //       }

// // // //       Alert.alert("Payment Successful! 🎉", successMessage, [
// // // //         { text: "OK", onPress: () => navigation.goBack() },
// // // //       ]);

// // // //       // Refresh credit status
// // // //       fetchCreditStatus();
// // // //     } catch (error) {
// // // //       console.log("Payment error:", error);

// // // //       let errorMessage = "Payment failed. Please try again";

// // // //       if (error?.response?.data?.error) {
// // // //         errorMessage = error.response.data.error;
// // // //       } else if (error?.response?.data?.message) {
// // // //         errorMessage = error.response.data.message;
// // // //       } else if (error.message) {
// // // //         errorMessage = error.message;
// // // //       }

// // // //       Alert.alert("Payment Failed", errorMessage);
// // // //     } finally {
// // // //       setIsProcessingPayment(false);
// // // //     }
// // // //   };

// // // //   const handleMeterIdChange = (text) => {
// // // //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// // // //     setMeterId(numericText);
// // // //     if (meterInfo && text !== meterId) {
// // // //       setMeterInfo(null);
// // // //     }
// // // //   };

// // // //   const handleUnitsChange = (text) => {
// // // //     const numericText = text.replace(/[^0-9]/g, "");
// // // //     if (numericText === "" || Number(numericText) <= MAX_UNITS) {
// // // //       setUnits(numericText);
// // // //     }
// // // //   };

// // // //   const getProgressPercentage = () => {
// // // //     if (!units) return 0;
// // // //     const numUnits = Number(units);
// // // //     return Math.min((numUnits / MAX_UNITS) * 100, 100);
// // // //   };

// // // //   const getProgressColor = () => {
// // // //     const percentage = getProgressPercentage();
// // // //     if (percentage < 25) return "#3B82F6";
// // // //     if (percentage < 50) return "#10B981";
// // // //     if (percentage < 75) return "#F59E0B";
// // // //     return "#A855F7";
// // // //   };

// // // //   const isValidUnits =
// // // //     units && Number(units) >= MIN_UNITS && Number(units) <= MAX_UNITS;

// // // //   const breakdown = calculatePaymentBreakdown();

// // // //   // Render Credit Status Card
// // // //   const renderCreditStatusCard = () => {
// // // //     if (isLoadingCreditStatus) {
// // // //       return (
// // // //         <View
// // // //           style={{
// // // //             backgroundColor: "#F3F4F6",
// // // //             borderRadius: 16,
// // // //             padding: 16,
// // // //             marginBottom: 20,
// // // //             alignItems: "center",
// // // //           }}
// // // //         >
// // // //           <ActivityIndicator size="small" color="#6B7280" />
// // // //           <Text style={{ color: "#6B7280", marginTop: 8, fontSize: 12 }}>
// // // //             Loading credit status...
// // // //           </Text>
// // // //         </View>
// // // //       );
// // // //     }

// // // //     // User is eligible and has credit available
// // // //     if (creditStatus.isEligible) {
// // // //       const hasOutstanding = creditStatus.credit?.outstanding > 0;
// // // //       const canUseNow =
// // // //         creditStatus.credit?.canUse &&
// // // //         creditStatus.walletBalance <= WALLET_THRESHOLD;

// // // //       return (
// // // //         <View
// // // //           style={{
// // // //             backgroundColor: hasOutstanding ? "#FEF3C7" : "#ECFDF5",
// // // //             borderRadius: 16,
// // // //             padding: 16,
// // // //             marginBottom: 20,
// // // //             borderLeftWidth: 4,
// // // //             borderLeftColor: hasOutstanding ? "#F59E0B" : "#10B981",
// // // //           }}
// // // //         >
// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               alignItems: "center",
// // // //               marginBottom: 12,
// // // //             }}
// // // //           >
// // // //             <Text style={{ fontSize: 20, marginRight: 8 }}>
// // // //               {hasOutstanding ? "⚡" : "🎉"}
// // // //             </Text>
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 14,
// // // //                 fontWeight: "700",
// // // //                 color: hasOutstanding ? "#92400E" : "#065F46",
// // // //               }}
// // // //             >
// // // //               {hasOutstanding
// // // //                 ? "Emergency Credit Active"
// // // //                 : "Emergency Credit Available"}
// // // //             </Text>
// // // //           </View>

// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               justifyContent: "space-between",
// // // //               marginBottom: 8,
// // // //             }}
// // // //           >
// // // //             <View style={{ flex: 1 }}>
// // // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}>
// // // //                 Available
// // // //               </Text>
// // // //               <Text
// // // //                 style={{
// // // //                   fontSize: 16,
// // // //                   fontWeight: "700",
// // // //                   color: "#059669",
// // // //                 }}
// // // //               >
// // // //                 ₦{(creditStatus.credit?.available || 0).toLocaleString()}
// // // //               </Text>
// // // //             </View>

// // // //             {hasOutstanding && (
// // // //               <View style={{ flex: 1, alignItems: "flex-end" }}>
// // // //                 <Text
// // // //                   style={{ fontSize: 11, color: "#6B7280", marginBottom: 2 }}
// // // //                 >
// // // //                   Outstanding
// // // //                 </Text>
// // // //                 <Text
// // // //                   style={{
// // // //                     fontSize: 16,
// // // //                     fontWeight: "700",
// // // //                     color: "#DC2626",
// // // //                   }}
// // // //                 >
// // // //                   ₦{(creditStatus.credit?.outstanding || 0).toLocaleString()}
// // // //                 </Text>
// // // //               </View>
// // // //             )}
// // // //           </View>

// // // //           {canUseNow ? (
// // // //             <Text style={{ fontSize: 11, color: "#065F46", marginTop: 4 }}>
// // // //               ✓ Credit available for this purchase @ ₦{CREDIT_PRICE_PER_UNIT}
// // // //               /unit
// // // //             </Text>
// // // //           ) : creditStatus.walletBalance > WALLET_THRESHOLD ? (
// // // //             <Text style={{ fontSize: 11, color: "#6B7280", marginTop: 4 }}>
// // // //               ℹ️ Credit activates when wallet is below ₦
// // // //               {WALLET_THRESHOLD.toLocaleString()}
// // // //             </Text>
// // // //           ) : null}

// // // //           {hasOutstanding && (
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 11,
// // // //                 color: "#92400E",
// // // //                 marginTop: 8,
// // // //                 fontStyle: "italic",
// // // //               }}
// // // //             >
// // // //               Auto-repaid when you fund your wallet
// // // //             </Text>
// // // //           )}
// // // //         </View>
// // // //       );
// // // //     }

// // // //     // User not eligible - show progress
// // // //     const progress = creditStatus.eligibilityProgress;
// // // //     return (
// // // //       <View
// // // //         style={{
// // // //           backgroundColor: "#F3F4F6",
// // // //           borderRadius: 16,
// // // //           padding: 16,
// // // //           marginBottom: 20,
// // // //         }}
// // // //       >
// // // //         <View
// // // //           style={{
// // // //             flexDirection: "row",
// // // //             alignItems: "center",
// // // //             marginBottom: 12,
// // // //           }}
// // // //         >
// // // //           <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
// // // //           <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
// // // //             Unlock Emergency Credit
// // // //           </Text>
// // // //         </View>

// // // //         <View
// // // //           style={{
// // // //             height: 8,
// // // //             backgroundColor: "#E5E7EB",
// // // //             borderRadius: 4,
// // // //             overflow: "hidden",
// // // //             marginBottom: 8,
// // // //           }}
// // // //         >
// // // //           <View
// // // //             style={{
// // // //               height: "100%",
// // // //               width: `${Math.min(progress?.percentage || 0, 100)}%`,
// // // //               backgroundColor: "#3B82F6",
// // // //               borderRadius: 4,
// // // //             }}
// // // //           />
// // // //         </View>

// // // //         <View
// // // //           style={{
// // // //             flexDirection: "row",
// // // //             justifyContent: "space-between",
// // // //           }}
// // // //         >
// // // //           <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // //             ₦{(progress?.current || 0).toLocaleString()} spent
// // // //           </Text>
// // // //           <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // //             ₦{(progress?.required || 100000).toLocaleString()} goal
// // // //           </Text>
// // // //         </View>

// // // //         <Text
// // // //           style={{
// // // //             fontSize: 11,
// // // //             color: "#6B7280",
// // // //             marginTop: 8,
// // // //             textAlign: "center",
// // // //           }}
// // // //         >
// // // //           Spend ₦
// // // //           {(
// // // //             (progress?.required || 100000) - (progress?.current || 0)
// // // //           ).toLocaleString()}{" "}
// // // //           more to unlock ₦10,000 emergency credit
// // // //         </Text>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   // Render Wallet Balance Card
// // // //   const renderWalletCard = () => {
// // // //     return (
// // // //       <View
// // // //         style={{
// // // //           backgroundColor: "#EFF6FF",
// // // //           borderRadius: 16,
// // // //           padding: 16,
// // // //           marginBottom: 20,
// // // //           flexDirection: "row",
// // // //           alignItems: "center",
// // // //           justifyContent: "space-between",
// // // //         }}
// // // //       >
// // // //         <View style={{ flexDirection: "row", alignItems: "center" }}>
// // // //           <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
// // // //           <View>
// // // //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // //               Wallet Balance
// // // //             </Text>
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 18,
// // // //                 fontWeight: "700",
// // // //                 color: "#1E40AF",
// // // //               }}
// // // //             >
// // // //               ₦{(creditStatus.walletBalance || 0).toLocaleString()}
// // // //             </Text>
// // // //           </View>
// // // //         </View>

// // // //         <TouchableOpacity
// // // //           onPress={fetchCreditStatus}
// // // //           style={{
// // // //             backgroundColor: "#DBEAFE",
// // // //             borderRadius: 8,
// // // //             paddingHorizontal: 12,
// // // //             paddingVertical: 6,
// // // //           }}
// // // //         >
// // // //           <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
// // // //             Refresh
// // // //           </Text>
// // // //         </TouchableOpacity>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   // Render Cost Breakdown
// // // //   const renderCostBreakdown = () => {
// // // //     if (!isValidUnits) return null;

// // // //     return (
// // // //       <View
// // // //         style={{
// // // //           backgroundColor: "#F8FAFC",
// // // //           borderRadius: 12,
// // // //           padding: 16,
// // // //           marginTop: 16,
// // // //           borderWidth: 1,
// // // //           borderColor: breakdown.usingCredit ? "#FCD34D" : "#E2E8F0",
// // // //         }}
// // // //       >
// // // //         <Text
// // // //           style={{
// // // //             fontSize: 14,
// // // //             fontWeight: "700",
// // // //             color: "#374151",
// // // //             marginBottom: 12,
// // // //           }}
// // // //         >
// // // //           Cost Breakdown
// // // //         </Text>

// // // //         <View style={{ marginBottom: 8 }}>
// // // //           {/* Total Units */}
// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               justifyContent: "space-between",
// // // //               marginBottom: 6,
// // // //             }}
// // // //           >
// // // //             <Text style={{ fontSize: 13, color: "#6B7280" }}>Total Units:</Text>
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 13,
// // // //                 fontWeight: "600",
// // // //                 color: "#374151",
// // // //               }}
// // // //             >
// // // //               {breakdown.units} kWh
// // // //             </Text>
// // // //           </View>

// // // //           {/* If using credit, show split breakdown */}
// // // //           {breakdown.usingCredit ? (
// // // //             <>
// // // //               {/* Wallet portion */}
// // // //               {breakdown.walletUnits > 0 && (
// // // //                 <View
// // // //                   style={{
// // // //                     flexDirection: "row",
// // // //                     justifyContent: "space-between",
// // // //                     marginBottom: 6,
// // // //                     paddingLeft: 8,
// // // //                   }}
// // // //                 >
// // // //                   <Text style={{ fontSize: 12, color: "#6B7280" }}>
// // // //                     💰 {breakdown.walletUnits} units @ ₦{NORMAL_PRICE_PER_UNIT}:
// // // //                   </Text>
// // // //                   <Text
// // // //                     style={{
// // // //                       fontSize: 12,
// // // //                       fontWeight: "600",
// // // //                       color: "#374151",
// // // //                     }}
// // // //                   >
// // // //                     ₦{breakdown.walletAmount.toLocaleString()}
// // // //                   </Text>
// // // //                 </View>
// // // //               )}

// // // //               {/* Credit portion */}
// // // //               {breakdown.creditUnits > 0 && (
// // // //                 <View
// // // //                   style={{
// // // //                     flexDirection: "row",
// // // //                     justifyContent: "space-between",
// // // //                     marginBottom: 6,
// // // //                     paddingLeft: 8,
// // // //                   }}
// // // //                 >
// // // //                   <Text style={{ fontSize: 12, color: "#F59E0B" }}>
// // // //                     ⚡ {breakdown.creditUnits} units @ ₦{CREDIT_PRICE_PER_UNIT}:
// // // //                   </Text>
// // // //                   <Text
// // // //                     style={{
// // // //                       fontSize: 12,
// // // //                       fontWeight: "600",
// // // //                       color: "#F59E0B",
// // // //                     }}
// // // //                   >
// // // //                     ₦{breakdown.creditAmount.toLocaleString()}
// // // //                   </Text>
// // // //                 </View>
// // // //               )}

// // // //               {/* Credit notice */}
// // // //               <View
// // // //                 style={{
// // // //                   backgroundColor: "#FEF3C7",
// // // //                   borderRadius: 8,
// // // //                   padding: 8,
// // // //                   marginTop: 8,
// // // //                   marginBottom: 8,
// // // //                 }}
// // // //               >
// // // //                 <Text style={{ fontSize: 11, color: "#92400E" }}>
// // // //                   ⚠️ Emergency credit @ ₦{CREDIT_PRICE_PER_UNIT}/unit (₦2
// // // //                   premium)
// // // //                 </Text>
// // // //               </View>
// // // //             </>
// // // //           ) : (
// // // //             /* Normal price breakdown */
// // // //             <View
// // // //               style={{
// // // //                 flexDirection: "row",
// // // //                 justifyContent: "space-between",
// // // //                 marginBottom: 6,
// // // //               }}
// // // //             >
// // // //               <Text style={{ fontSize: 13, color: "#6B7280" }}>
// // // //                 Price per unit:
// // // //               </Text>
// // // //               <Text
// // // //                 style={{
// // // //                   fontSize: 13,
// // // //                   fontWeight: "600",
// // // //                   color: "#374151",
// // // //                 }}
// // // //               >
// // // //                 ₦{NORMAL_PRICE_PER_UNIT}
// // // //               </Text>
// // // //             </View>
// // // //           )}

// // // //           <View
// // // //             style={{
// // // //               height: 1,
// // // //               backgroundColor: "#E5E7EB",
// // // //               marginVertical: 8,
// // // //             }}
// // // //           />

// // // //           {/* Total */}
// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               justifyContent: "space-between",
// // // //             }}
// // // //           >
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 15,
// // // //                 fontWeight: "700",
// // // //                 color: "#1F2937",
// // // //               }}
// // // //             >
// // // //               Total Amount:
// // // //             </Text>
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 15,
// // // //                 fontWeight: "700",
// // // //                 color: breakdown.usingCredit ? "#F59E0B" : "#1F2937",
// // // //               }}
// // // //             >
// // // //               ₦{breakdown.totalAmount.toLocaleString()}
// // // //             </Text>
// // // //           </View>

// // // //           {/* Shortfall warning */}
// // // //           {!breakdown.canProceed && breakdown.shortfall > 0 && (
// // // //             <View
// // // //               style={{
// // // //                 backgroundColor: "#FEE2E2",
// // // //                 borderRadius: 8,
// // // //                 padding: 10,
// // // //                 marginTop: 12,
// // // //               }}
// // // //             >
// // // //               <Text
// // // //                 style={{ fontSize: 12, color: "#DC2626", fontWeight: "600" }}
// // // //               >
// // // //                 ❌ Insufficient funds
// // // //               </Text>
// // // //               <Text style={{ fontSize: 11, color: "#DC2626", marginTop: 4 }}>
// // // //                 You need ₦{breakdown.shortfall.toLocaleString()} more to
// // // //                 complete this purchase
// // // //               </Text>
// // // //             </View>
// // // //           )}
// // // //         </View>
// // // //       </View>
// // // //     );
// // // //   };

// // // //   return (
// // // //     <ScreenWrapper
// // // //       title="Power Up! ⚡"
// // // //       navigation={navigation}
// // // //       headerStyle={{ backgroundColor: "white" }}
// // // //     >
// // // //       <ScrollView
// // // //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// // // //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// // // //       >
// // // //         {/* Wallet Balance Card */}
// // // //         {renderWalletCard()}

// // // //         {/* Credit Status Card */}
// // // //         {renderCreditStatusCard()}

// // // //         {/* Header Card */}
// // // //         <View
// // // //           style={{
// // // //             backgroundColor: "white",
// // // //             borderRadius: 24,
// // // //             padding: 20,
// // // //             marginBottom: 20,
// // // //             shadowColor: "#000",
// // // //             shadowOffset: { width: 0, height: 4 },
// // // //             shadowOpacity: 0.1,
// // // //             shadowRadius: 12,
// // // //             elevation: 5,
// // // //           }}
// // // //         >
// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               alignItems: "center",
// // // //               marginBottom: 20,
// // // //             }}
// // // //           >
// // // //             <View
// // // //               style={{
// // // //                 width: 48,
// // // //                 height: 48,
// // // //                 borderRadius: 16,
// // // //                 backgroundColor: "#3B82F6",
// // // //                 justifyContent: "center",
// // // //                 alignItems: "center",
// // // //                 marginRight: 12,
// // // //               }}
// // // //             >
// // // //               <Text style={{ fontSize: 24 }}>⚡</Text>
// // // //             </View>
// // // //             <View style={{ flex: 1 }}>
// // // //               <Text
// // // //                 style={{ fontSize: 20, fontWeight: "bold", color: "#1F2937" }}
// // // //               >
// // // //                 Quick Payment
// // // //               </Text>
// // // //               <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
// // // //                 ₦{NORMAL_PRICE_PER_UNIT}/unit • Emergency: ₦
// // // //                 {CREDIT_PRICE_PER_UNIT}/unit
// // // //               </Text>
// // // //             </View>
// // // //           </View>

// // // //           {/* Meter ID Input */}
// // // //           <Text
// // // //             style={{
// // // //               fontSize: 14,
// // // //               fontWeight: "600",
// // // //               color: "#374151",
// // // //               marginBottom: 8,
// // // //             }}
// // // //           >
// // // //             🔢 Meter ID
// // // //           </Text>
// // // //           <View style={{ flexDirection: "row", marginBottom: 12 }}>
// // // //             <TextInput
// // // //               value={meterId}
// // // //               onChangeText={handleMeterIdChange}
// // // //               placeholder="Enter 11-digit meter ID"
// // // //               keyboardType="numeric"
// // // //               maxLength={11}
// // // //               style={{
// // // //                 flex: 1,
// // // //                 borderWidth: 2,
// // // //                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
// // // //                 borderRadius: 12,
// // // //                 paddingHorizontal: 16,
// // // //                 paddingVertical: 12,
// // // //                 marginRight: 10,
// // // //                 fontSize: 16,
// // // //                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
// // // //               }}
// // // //             />
// // // //             {meterId.length === 11 && !meterInfo && (
// // // //               <TouchableOpacity
// // // //                 onPress={handleCheckMeter}
// // // //                 disabled={checkMeterispending}
// // // //                 style={{
// // // //                   backgroundColor: checkMeterispending ? "#9CA3AF" : "#3B82F6",
// // // //                   borderRadius: 12,
// // // //                   paddingHorizontal: 20,
// // // //                   justifyContent: "center",
// // // //                   minWidth: 90,
// // // //                 }}
// // // //               >
// // // //                 {checkMeterispending ? (
// // // //                   <ActivityIndicator color="#fff" />
// // // //                 ) : (
// // // //                   <Text
// // // //                     style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}
// // // //                   >
// // // //                     Verify
// // // //                   </Text>
// // // //                 )}
// // // //               </TouchableOpacity>
// // // //             )}
// // // //           </View>

// // // //           {meterId.length > 0 && meterId.length !== 11 && (
// // // //             <Text style={{ color: "#F59E0B", fontSize: 12, marginTop: 4 }}>
// // // //               ⚠️ {meterId.length}/11 digits entered
// // // //             </Text>
// // // //           )}
// // // //         </View>

// // // //         {/* Meter Info Card */}
// // // //         {meterInfo && (
// // // //           <Animated.View
// // // //             style={{
// // // //               transform: [{ scale: scaleAnim }],
// // // //               backgroundColor: "#ECFDF5",
// // // //               borderRadius: 20,
// // // //               padding: 16,
// // // //               marginBottom: 20,
// // // //               borderLeftWidth: 4,
// // // //               borderLeftColor: "#10B981",
// // // //             }}
// // // //           >
// // // //             <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
// // // //               <View
// // // //                 style={{
// // // //                   width: 40,
// // // //                   height: 40,
// // // //                   borderRadius: 20,
// // // //                   backgroundColor: "#10B981",
// // // //                   justifyContent: "center",
// // // //                   alignItems: "center",
// // // //                   marginRight: 12,
// // // //                 }}
// // // //               >
// // // //                 <Text style={{ fontSize: 20 }}>✓</Text>
// // // //               </View>
// // // //               <View style={{ flex: 1 }}>
// // // //                 <Text
// // // //                   style={{
// // // //                     fontSize: 16,
// // // //                     fontWeight: "700",
// // // //                     color: "#065F46",
// // // //                     marginBottom: 8,
// // // //                   }}
// // // //                 >
// // // //                   🏆 Meter Verified!
// // // //                 </Text>
// // // //                 <Text
// // // //                   style={{ fontSize: 14, color: "#374151", marginBottom: 4 }}
// // // //                 >
// // // //                   <Text style={{ fontWeight: "600" }}>Name:</Text>{" "}
// // // //                   {meterInfo?.Customer_name}
// // // //                 </Text>
// // // //                 <Text style={{ fontSize: 14, color: "#374151" }}>
// // // //                   <Text style={{ fontWeight: "600" }}>Address:</Text>{" "}
// // // //                   {meterInfo?.Customer_address}
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
// // // //           </Animated.View>
// // // //         )}

// // // //         {/* Units Input Card */}
// // // //         <View
// // // //           style={{
// // // //             backgroundColor: "white",
// // // //             borderRadius: 24,
// // // //             padding: 20,
// // // //             marginBottom: 20,
// // // //             shadowColor: "#000",
// // // //             shadowOffset: { width: 0, height: 4 },
// // // //             shadowOpacity: 0.1,
// // // //             shadowRadius: 12,
// // // //             elevation: 5,
// // // //           }}
// // // //         >
// // // //           <Text
// // // //             style={{
// // // //               fontSize: 14,
// // // //               fontWeight: "600",
// // // //               color: "#374151",
// // // //               marginBottom: 8,
// // // //             }}
// // // //           >
// // // //             ⚡ Units ({MIN_UNITS} - {MAX_UNITS} kWh)
// // // //           </Text>

// // // //           <View style={{ position: "relative", marginBottom: 16 }}>
// // // //             <TextInput
// // // //               value={units}
// // // //               onChangeText={handleUnitsChange}
// // // //               placeholder="0"
// // // //               keyboardType="numeric"
// // // //               editable={!!meterInfo}
// // // //               style={{
// // // //                 borderWidth: 2,
// // // //                 borderColor: isValidUnits ? "#3B82F6" : "#E5E7EB",
// // // //                 borderRadius: 16,
// // // //                 paddingHorizontal: 16,
// // // //                 paddingVertical: 16,
// // // //                 fontSize: 32,
// // // //                 fontWeight: "bold",
// // // //                 color: meterInfo ? "#1F2937" : "#9CA3AF",
// // // //                 backgroundColor: meterInfo ? "#fff" : "#F9FAFB",
// // // //                 textAlign: "center",
// // // //               }}
// // // //             />
// // // //             {units && (
// // // //               <Text
// // // //                 style={{
// // // //                   position: "absolute",
// // // //                   right: 16,
// // // //                   top: 22,
// // // //                   fontSize: 18,
// // // //                   fontWeight: "600",
// // // //                   color: "#6B7280",
// // // //                 }}
// // // //               >
// // // //                 kWh
// // // //               </Text>
// // // //             )}
// // // //           </View>

// // // //           {/* Progress Bar */}
// // // //           {units && Number(units) > 0 && (
// // // //             <View style={{ marginBottom: 16 }}>
// // // //               <View
// // // //                 style={{
// // // //                   height: 12,
// // // //                   backgroundColor: "#E5E7EB",
// // // //                   borderRadius: 6,
// // // //                   overflow: "hidden",
// // // //                 }}
// // // //               >
// // // //                 <View
// // // //                   style={{
// // // //                     height: "100%",
// // // //                     width: `${getProgressPercentage()}%`,
// // // //                     backgroundColor: getProgressColor(),
// // // //                     borderRadius: 6,
// // // //                   }}
// // // //                 />
// // // //               </View>
// // // //               <View
// // // //                 style={{
// // // //                   flexDirection: "row",
// // // //                   justifyContent: "space-between",
// // // //                   marginTop: 8,
// // // //                 }}
// // // //               >
// // // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // //                   {MIN_UNITS} units
// // // //                 </Text>
// // // //                 <Text
// // // //                   style={{ fontSize: 12, fontWeight: "700", color: "#3B82F6" }}
// // // //                 >
// // // //                   {getProgressPercentage().toFixed(0)}%
// // // //                 </Text>
// // // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // // //                   {MAX_UNITS} units
// // // //                 </Text>
// // // //               </View>
// // // //             </View>
// // // //           )}

// // // //           {/* Validation Message */}
// // // //           {units && Number(units) < MIN_UNITS && (
// // // //             <View
// // // //               style={{
// // // //                 backgroundColor: "#FEF3C7",
// // // //                 borderRadius: 12,
// // // //                 padding: 12,
// // // //                 marginBottom: 16,
// // // //               }}
// // // //             >
// // // //               <Text style={{ color: "#92400E", fontSize: 13 }}>
// // // //                 ⚠️ Minimum purchase is {MIN_UNITS} units
// // // //               </Text>
// // // //             </View>
// // // //           )}

// // // //           <View>
// // // //             <Text
// // // //               style={{
// // // //                 fontSize: 13,
// // // //                 fontWeight: "600",
// // // //                 color: "#6B7280",
// // // //                 marginBottom: 10,
// // // //               }}
// // // //             >
// // // //               Quick Select:
// // // //             </Text>
// // // //             <View
// // // //               style={{
// // // //                 flexDirection: "row",
// // // //                 justifyContent: "space-between",
// // // //                 gap: 8,
// // // //               }}
// // // //             >
// // // //               {quickUnits.map((quickUnit) => (
// // // //                 <TouchableOpacity
// // // //                   key={quickUnit}
// // // //                   onPress={() => setUnits(quickUnit.toString())}
// // // //                   disabled={!meterInfo}
// // // //                   style={{
// // // //                     flex: 1,
// // // //                     backgroundColor:
// // // //                       units === quickUnit.toString() ? "#3B82F6" : "#F3F4F6",
// // // //                     borderRadius: 12,
// // // //                     paddingVertical: 12,
// // // //                     alignItems: "center",
// // // //                     opacity: !meterInfo ? 0.5 : 1,
// // // //                   }}
// // // //                 >
// // // //                   <Text
// // // //                     style={{
// // // //                       fontSize: 13,
// // // //                       fontWeight: "700",
// // // //                       color:
// // // //                         units === quickUnit.toString() ? "#fff" : "#374151",
// // // //                     }}
// // // //                   >
// // // //                     {quickUnit}
// // // //                   </Text>
// // // //                   <Text
// // // //                     style={{
// // // //                       fontSize: 10,
// // // //                       color:
// // // //                         units === quickUnit.toString() ? "#E0E7FF" : "#6B7280",
// // // //                       marginTop: 2,
// // // //                     }}
// // // //                   >
// // // //                     kWh
// // // //                   </Text>
// // // //                 </TouchableOpacity>
// // // //               ))}
// // // //             </View>
// // // //           </View>

// // // //           {/* Cost Breakdown */}
// // // //           {renderCostBreakdown()}
// // // //         </View>

// // // //         {/* Stats Cards */}
// // // //         {isValidUnits && (
// // // //           <View
// // // //             style={{
// // // //               flexDirection: "row",
// // // //               justifyContent: "space-between",
// // // //               marginBottom: 20,
// // // //               gap: 10,
// // // //             }}
// // // //           >
// // // //             <View
// // // //               style={{
// // // //                 flex: 1,
// // // //                 backgroundColor: "#EFF6FF",
// // // //                 borderRadius: 16,
// // // //                 padding: 16,
// // // //                 alignItems: "center",
// // // //               }}
// // // //             >
// // // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>⚡</Text>
// // // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // // //                 Units
// // // //               </Text>
// // // //               <Text
// // // //                 style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
// // // //               >
// // // //                 {breakdown.units} kWh
// // // //               </Text>
// // // //             </View>
// // // //             <View
// // // //               style={{
// // // //                 flex: 1,
// // // //                 backgroundColor: breakdown.usingCredit ? "#FEF3C7" : "#ECFDF5",
// // // //                 borderRadius: 16,
// // // //                 padding: 16,
// // // //                 alignItems: "center",
// // // //               }}
// // // //             >
// // // //               <Text style={{ fontSize: 24, marginBottom: 8 }}>
// // // //                 {breakdown.usingCredit ? "⚡" : "💵"}
// // // //               </Text>
// // // //               <Text style={{ fontSize: 11, color: "#6B7280", marginBottom: 4 }}>
// // // //                 {breakdown.usingCredit ? "Total (with credit)" : "You Pay"}
// // // //               </Text>
// // // //               <Text
// // // //                 style={{
// // // //                   fontSize: 14,
// // // //                   fontWeight: "700",
// // // //                   color: breakdown.usingCredit ? "#92400E" : "#059669",
// // // //                 }}
// // // //               >
// // // //                 ₦{breakdown.totalAmount.toLocaleString()}
// // // //               </Text>
// // // //             </View>
// // // //           </View>
// // // //         )}

// // // //         {/* Pay Button */}
// // // //         {meterInfo && isValidUnits && (
// // // //           <TouchableOpacity
// // // //             onPress={handlePayment}
// // // //             disabled={isProcessingPayment || !breakdown.canProceed}
// // // //             style={{
// // // //               backgroundColor:
// // // //                 isProcessingPayment || !breakdown.canProceed
// // // //                   ? "#9CA3AF"
// // // //                   : breakdown.usingCredit
// // // //                   ? "#F59E0B"
// // // //                   : "#3B82F6",
// // // //               borderRadius: 16,
// // // //               paddingVertical: 18,
// // // //               shadowColor: breakdown.usingCredit ? "#F59E0B" : "#3B82F6",
// // // //               shadowOffset: { width: 0, height: 4 },
// // // //               shadowOpacity: 0.3,
// // // //               shadowRadius: 8,
// // // //               elevation: 8,
// // // //             }}
// // // //           >
// // // //             {isProcessingPayment ? (
// // // //               <View
// // // //                 style={{
// // // //                   flexDirection: "row",
// // // //                   justifyContent: "center",
// // // //                   alignItems: "center",
// // // //                 }}
// // // //               >
// // // //                 <ActivityIndicator color="#fff" />
// // // //                 <Text
// // // //                   style={{
// // // //                     color: "#fff",
// // // //                     marginLeft: 10,
// // // //                     fontSize: 16,
// // // //                     fontWeight: "700",
// // // //                   }}
// // // //                 >
// // // //                   Processing...
// // // //                 </Text>
// // // //               </View>
// // // //             ) : (
// // // //               <View>
// // // //                 <Text
// // // //                   style={{
// // // //                     color: "#fff",
// // // //                     textAlign: "center",
// // // //                     fontSize: 18,
// // // //                     fontWeight: "700",
// // // //                   }}
// // // //                 >
// // // //                   {breakdown.canProceed
// // // //                     ? `⚡ Pay ₦${breakdown.totalAmount.toLocaleString()}`
// // // //                     : `❌ Insufficient Funds`}
// // // //                 </Text>
// // // //                 {breakdown.usingCredit && breakdown.canProceed && (
// // // //                   <Text
// // // //                     style={{
// // // //                       color: "#FEF3C7",
// // // //                       textAlign: "center",
// // // //                       fontSize: 11,
// // // //                       marginTop: 4,
// // // //                     }}
// // // //                   >
// // // //                     Includes ₦{breakdown.creditAmount.toLocaleString()}{" "}
// // // //                     emergency credit
// // // //                   </Text>
// // // //                 )}
// // // //               </View>
// // // //             )}
// // // //           </TouchableOpacity>
// // // //         )}

// // // //         {/* Helper Text */}
// // // //         {!meterInfo && (
// // // //           <View
// // // //             style={{
// // // //               backgroundColor: "#F9FAFB",
// // // //               borderRadius: 16,
// // // //               padding: 16,
// // // //               marginTop: 20,
// // // //             }}
// // // //           >
// // // //             <Text
// // // //               style={{
// // // //                 textAlign: "center",
// // // //                 color: "#6B7280",
// // // //                 fontSize: 13,
// // // //                 fontStyle: "italic",
// // // //               }}
// // // //             >
// // // //               💡 Enter your meter ID and verify to continue
// // // //             </Text>
// // // //           </View>
// // // //         )}

// // // //         {/* Footer Info */}
// // // //         <View style={{ marginTop: 20 }}>
// // // //           <Text
// // // //             style={{
// // // //               textAlign: "center",
// // // //               fontSize: 12,
// // // //               color: "#9CA3AF",
// // // //             }}
// // // //           >
// // // //             🔒 Secure payment • ⚡ Instant credit • 🎯 24/7 support
// // // //           </Text>
// // // //           <Text
// // // //             style={{
// // // //               textAlign: "center",
// // // //               fontSize: 11,
// // // //               color: "#9CA3AF",
// // // //               marginTop: 4,
// // // //             }}
// // // //           >
// // // //             Normal: ₦{NORMAL_PRICE_PER_UNIT}/unit • Emergency Credit: ₦
// // // //             {CREDIT_PRICE_PER_UNIT}/unit
// // // //           </Text>
// // // //         </View>
// // // //       </ScrollView>
// // // //     </ScreenWrapper>
// // // //   );
// // // // };

// // // // export default ElectricityPaymentScreen;

// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   View,
// // //   Text,
// // //   TextInput,
// // //   TouchableOpacity,
// // //   ActivityIndicator,
// // //   Alert,
// // //   ScrollView,
// // //   Animated,
// // // } from "react-native";
// // // import { useSelector } from "react-redux";
// // // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // // import { useNavigation } from "@react-navigation/native";
// // // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // // const ElectricityPaymentScreen = () => {
// // //   const { user_data } = useSelector((state) => state.AuthSlice);
// // //   const { userProfile_data } = useSelector((state) => state.ProfileSlice);
// // //   const navigation = useNavigation();

// // //   const [meterId, setMeterId] = useState("");
// // //   const [walletUnits, setWalletUnits] = useState("");
// // //   const [emergencyUnits, setEmergencyUnits] = useState("");
// // //   const [meterInfo, setMeterInfo] = useState(null);
// // //   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
// // //   const scaleAnim = useState(new Animated.Value(1))[0];

// // //   // Constants
// // //   const NORMAL_PRICE = 260;
// // //   const EMERGENCY_PRICE = 262;
// // //   const MIN_UNITS = 1;
// // //   const MAX_UNITS = 400;

// // //   // Fetch emergency status using useFetchData hook
// // //   const {
// // //     data: statusResponse,
// // //     isLoading: isLoadingStatus,
// // //     refetch: refetchStatus,
// // //   } = useFetchData("api/captainv4/emergency-status", "emergency-status");

// // //   // Extract status data from response
// // //   const statusData = statusResponse?.data || {
// // //     walletBalance: 0,
// // //     maxWalletUnits: 0,
// // //     normalPricePerUnit: 260,
// // //     isEligible: false,
// // //     hasAccount: false,
// // //     eligibilityProgress: {
// // //       current: 0,
// // //       required: 100000,
// // //       remaining: 100000,
// // //       percentage: 0,
// // //     },
// // //     emergency: null,
// // //   };

// // //   // Check meter mutation
// // //   const { mutate: checkMeter, isLoading: checkMeterIsPending } = useMutateData(
// // //     "api/captain/vend",
// // //     "POST",
// // //     "billpayment"
// // //   );

// // //   // Buy electricity mutation
// // //   const { mutate: buyElectricity, isLoading: isBuying } = useMutateData(
// // //     "api/captainv4/buy/v4",
// // //     "POST",
// // //     "buy-electricity"
// // //   );

// // //   // Calculate totals
// // //   const calculateTotals = () => {
// // //     const walletUnitsNum = Number(walletUnits) || 0;
// // //     const emergencyUnitsNum = Number(emergencyUnits) || 0;
// // //     const totalUnits = walletUnitsNum + emergencyUnitsNum;
// // //     const walletCost = walletUnitsNum * NORMAL_PRICE;
// // //     const emergencyCost = emergencyUnitsNum * EMERGENCY_PRICE;

// // //     return {
// // //       walletUnits: walletUnitsNum,
// // //       emergencyUnits: emergencyUnitsNum,
// // //       totalUnits,
// // //       walletCost,
// // //       emergencyCost,
// // //       totalCost: walletCost + emergencyCost,
// // //       payNow: walletCost,
// // //       oweAfter: emergencyCost,
// // //     };
// // //   };

// // //   const handleCheckMeter = async () => {
// // //     if (!meterId) {
// // //       Alert.alert("Error", "Please enter meter ID");
// // //       return;
// // //     }

// // //     if (meterId.length !== 11) {
// // //       Alert.alert("Error", "Meter ID must be exactly 11 digits");
// // //       return;
// // //     }

// // //     if (!/^\d+$/.test(meterId)) {
// // //       Alert.alert("Error", "Meter ID must contain only numbers");
// // //       return;
// // //     }

// // //     checkMeter(
// // //       { meterId },
// // //       {
// // //         onSuccess: (response) => {
// // //           if (!response?.data || !response.data[0]) {
// // //             Alert.alert("Error", "No meter information found for this ID");
// // //             return;
// // //           }
// // //           setMeterInfo(response.data[0]);
// // //           Animated.sequence([
// // //             Animated.timing(scaleAnim, {
// // //               toValue: 1.1,
// // //               duration: 200,
// // //               useNativeDriver: true,
// // //             }),
// // //             Animated.timing(scaleAnim, {
// // //               toValue: 1,
// // //               duration: 200,
// // //               useNativeDriver: true,
// // //             }),
// // //           ]).start();
// // //           Alert.alert("Success", "Meter verified successfully! ⚡");
// // //         },
// // //         onError: (error) => {
// // //           let errorMessage = "Failed to verify meter";
// // //           if (error?.message) {
// // //             errorMessage = error.message;
// // //           }
// // //           Alert.alert("Meter Verification Failed", errorMessage);
// // //           setMeterInfo(null);
// // //         },
// // //       }
// // //     );
// // //   };

// // //   const handlePayment = async () => {
// // //     const totals = calculateTotals();

// // //     if (!meterId || !meterInfo) {
// // //       Alert.alert("Error", "Please verify the meter first");
// // //       return;
// // //     }

// // //     if (totals.totalUnits < MIN_UNITS) {
// // //       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} unit`);
// // //       return;
// // //     }

// // //     if (totals.totalUnits > MAX_UNITS) {
// // //       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
// // //       return;
// // //     }

// // //     // Validate wallet units
// // //     if (totals.walletUnits > statusData.maxWalletUnits) {
// // //       Alert.alert(
// // //         "Error",
// // //         `You can only buy ${
// // //           statusData.maxWalletUnits
// // //         } units from wallet (₦${statusData.walletBalance.toLocaleString()} available)`
// // //       );
// // //       return;
// // //     }

// // //     // Validate emergency units
// // //     if (totals.emergencyUnits > 0) {
// // //       if (!statusData.emergency?.canUse) {
// // //         if (statusData.emergency?.hasDebt) {
// // //           Alert.alert(
// // //             "Emergency Units Locked",
// // //             `You have outstanding debt of ₦${statusData.emergency.outstandingDebt.toLocaleString()}. Clear your debt to use emergency units.`
// // //           );
// // //         } else if (!statusData.isEligible) {
// // //           Alert.alert(
// // //             "Not Eligible",
// // //             `Spend ₦${statusData.eligibilityProgress.remaining.toLocaleString()} more on electricity to unlock emergency units.`
// // //           );
// // //         }
// // //         return;
// // //       }

// // //       if (totals.emergencyUnits > statusData.emergency.availableUnits) {
// // //         Alert.alert(
// // //           "Error",
// // //           `Only ${statusData.emergency.availableUnits} emergency units available`
// // //         );
// // //         return;
// // //       }
// // //     }

// // //     // Build confirmation message
// // //     let confirmMessage = `Buy ${totals.totalUnits} units of electricity?\n\n`;

// // //     if (totals.walletUnits > 0) {
// // //       confirmMessage += `💰 Wallet: ${
// // //         totals.walletUnits
// // //       } units × ₦${NORMAL_PRICE} = ₦${totals.walletCost.toLocaleString()}\n`;
// // //     }

// // //     if (totals.emergencyUnits > 0) {
// // //       confirmMessage += `⚡ Emergency: ${
// // //         totals.emergencyUnits
// // //       } units × ₦${EMERGENCY_PRICE} = ₦${totals.emergencyCost.toLocaleString()} (owed)\n`;
// // //     }

// // //     confirmMessage += `\n━━━━━━━━━━━━━━━━━━━━\n`;
// // //     confirmMessage += `Pay Now: ₦${totals.payNow.toLocaleString()}\n`;

// // //     if (totals.emergencyUnits > 0) {
// // //       confirmMessage += `Will Owe: ₦${totals.oweAfter.toLocaleString()}\n`;
// // //       confirmMessage += `\n⚠️ Emergency debt auto-deducted on next funding.`;
// // //     }

// // //     Alert.alert("Confirm Purchase", confirmMessage, [
// // //       { text: "Cancel", style: "cancel" },
// // //       { text: "Confirm", onPress: () => processPayment(totals) },
// // //     ]);
// // //   };

// // //   const processPayment = async (totals) => {
// // //     const paymentData = {
// // //       meterId,
// // //       walletUnits: totals.walletUnits,
// // //       emergencyUnits: totals.emergencyUnits,
// // //     };

// // //     buyElectricity(paymentData, {
// // //       onSuccess: (data) => {
// // //         // Build success message
// // //         let successMessage = `Your electricity token is ready!\n\n`;
// // //         successMessage += `🔑 Token: ${data.data.token}\n`;
// // //         successMessage += `⚡ Units: ${data.data.totalUnits} kWh\n\n`;

// // //         if (data.data.walletUnits > 0) {
// // //           successMessage += `💰 Paid from wallet: ₦${data.data.walletAmountPaid.toLocaleString()}\n`;
// // //         }

// // //         if (data.data.emergencyUnits > 0) {
// // //           successMessage += `⚡ Emergency units used: ${data.data.emergencyUnits}\n`;
// // //           successMessage += `📋 Now owe: ₦${data.data.emergencyAmountOwed.toLocaleString()}\n`;
// // //         }

// // //         successMessage += `\n💰 Wallet balance: ₦${data.data.newWalletBalance.toLocaleString()}`;

// // //         Alert.alert("Payment Successful! 🎉", successMessage, [
// // //           { text: "OK", onPress: () => navigation.goBack() },
// // //         ]);

// // //         // Refresh status
// // //         refetchStatus();
// // //       },
// // //       onError: (error) => {
// // //         Alert.alert("Payment Failed", error.message || "Something went wrong");
// // //       },
// // //     });
// // //   };

// // //   const handleMeterIdChange = (text) => {
// // //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// // //     setMeterId(numericText);
// // //     if (meterInfo && text !== meterId) {
// // //       setMeterInfo(null);
// // //     }
// // //   };

// // //   const handleWalletUnitsChange = (text) => {
// // //     const numericText = text.replace(/[^0-9]/g, "");
// // //     const num = Number(numericText) || 0;
// // //     if (numericText === "" || num <= statusData.maxWalletUnits) {
// // //       setWalletUnits(numericText);
// // //     }
// // //   };

// // //   const handleEmergencyUnitsChange = (text) => {
// // //     const numericText = text.replace(/[^0-9]/g, "");
// // //     const num = Number(numericText) || 0;
// // //     const maxEmergency = statusData.emergency?.availableUnits || 0;
// // //     if (numericText === "" || num <= maxEmergency) {
// // //       setEmergencyUnits(numericText);
// // //     }
// // //   };

// // //   const totals = calculateTotals();
// // //   const isValidPurchase =
// // //     totals.totalUnits >= MIN_UNITS && totals.totalUnits <= MAX_UNITS;
// // //   const hasDebt = statusData.emergency?.hasDebt || false;
// // //   const canUseEmergency = statusData.emergency?.canUse || false;

// // //   // Render Debt Warning (blocks everything)
// // //   const renderDebtWarning = () => {
// // //     if (!hasDebt) return null;

// // //     const debt = statusData.emergency?.outstandingDebt || 0;
// // //     const shortfall = debt - statusData.walletBalance;

// // //     return (
// // //       <View
// // //         style={{
// // //           backgroundColor: "#FEE2E2",
// // //           borderRadius: 16,
// // //           padding: 20,
// // //           marginBottom: 20,
// // //           borderLeftWidth: 4,
// // //           borderLeftColor: "#DC2626",
// // //         }}
// // //       >
// // //         <View
// // //           style={{
// // //             flexDirection: "row",
// // //             alignItems: "center",
// // //             marginBottom: 12,
// // //           }}
// // //         >
// // //           <Text style={{ fontSize: 24, marginRight: 10 }}>🔒</Text>
// // //           <Text style={{ fontSize: 16, fontWeight: "700", color: "#DC2626" }}>
// // //             Purchases Locked
// // //           </Text>
// // //         </View>

// // //         <Text style={{ fontSize: 14, color: "#7F1D1D", marginBottom: 12 }}>
// // //           You have outstanding emergency debt that must be cleared before you
// // //           can buy electricity.
// // //         </Text>

// // //         <View
// // //           style={{
// // //             backgroundColor: "#FECACA",
// // //             borderRadius: 12,
// // //             padding: 12,
// // //             marginBottom: 12,
// // //           }}
// // //         >
// // //           <View
// // //             style={{
// // //               flexDirection: "row",
// // //               justifyContent: "space-between",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>
// // //               Outstanding Debt:
// // //             </Text>
// // //             <Text style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}>
// // //               ₦{debt.toLocaleString()}
// // //             </Text>
// // //           </View>
// // //           <View
// // //             style={{
// // //               flexDirection: "row",
// // //               justifyContent: "space-between",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>
// // //               Wallet Balance:
// // //             </Text>
// // //             <Text style={{ fontSize: 13, fontWeight: "700", color: "#7F1D1D" }}>
// // //               ₦{statusData.walletBalance.toLocaleString()}
// // //             </Text>
// // //           </View>
// // //           {shortfall > 0 && (
// // //             <View
// // //               style={{ flexDirection: "row", justifyContent: "space-between" }}
// // //             >
// // //               <Text style={{ fontSize: 13, color: "#7F1D1D" }}>
// // //                 Need to Fund:
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}
// // //               >
// // //                 ₦{shortfall.toLocaleString()}
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </View>

// // //         <Text style={{ fontSize: 12, color: "#7F1D1D", fontStyle: "italic" }}>
// // //           Fund your wallet with at least ₦{debt.toLocaleString()} to clear debt
// // //           and unlock purchases.
// // //         </Text>
// // //       </View>
// // //     );
// // //   };

// // //   // Render Wallet Card
// // //   const renderWalletCard = () => {
// // //     return (
// // //       <View
// // //         style={{
// // //           backgroundColor: "#EFF6FF",
// // //           borderRadius: 16,
// // //           padding: 16,
// // //           marginBottom: 20,
// // //         }}
// // //       >
// // //         <View
// // //           style={{
// // //             flexDirection: "row",
// // //             alignItems: "center",
// // //             justifyContent: "space-between",
// // //           }}
// // //         >
// // //           <View style={{ flexDirection: "row", alignItems: "center" }}>
// // //             <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
// // //             <View>
// // //               <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                 Wallet Balance
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 20, fontWeight: "700", color: "#1E40AF" }}
// // //               >
// // //                 ₦{(statusData.walletBalance || 0).toLocaleString()}
// // //               </Text>
// // //               <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                 Can buy {statusData.maxWalletUnits || 0} units @ ₦{NORMAL_PRICE}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           <TouchableOpacity
// // //             onPress={() => refetchStatus()}
// // //             style={{
// // //               backgroundColor: "#DBEAFE",
// // //               borderRadius: 8,
// // //               paddingHorizontal: 12,
// // //               paddingVertical: 8,
// // //             }}
// // //           >
// // //             <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
// // //               Refresh
// // //             </Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       </View>
// // //     );
// // //   };

// // //   // Render Emergency Status Card
// // //   const renderEmergencyStatusCard = () => {
// // //     if (isLoadingStatus) {
// // //       return (
// // //         <View
// // //           style={{
// // //             backgroundColor: "#F3F4F6",
// // //             borderRadius: 16,
// // //             padding: 20,
// // //             marginBottom: 20,
// // //             alignItems: "center",
// // //           }}
// // //         >
// // //           <ActivityIndicator size="small" color="#6B7280" />
// // //           <Text style={{ color: "#6B7280", marginTop: 8, fontSize: 12 }}>
// // //             Loading status...
// // //           </Text>
// // //         </View>
// // //       );
// // //     }

// // //     // Not eligible - show progress
// // //     if (!statusData.isEligible) {
// // //       const progress = statusData.eligibilityProgress;
// // //       return (
// // //         <View
// // //           style={{
// // //             backgroundColor: "#F3F4F6",
// // //             borderRadius: 16,
// // //             padding: 16,
// // //             marginBottom: 20,
// // //           }}
// // //         >
// // //           <View
// // //             style={{
// // //               flexDirection: "row",
// // //               alignItems: "center",
// // //               marginBottom: 12,
// // //             }}
// // //           >
// // //             <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
// // //             <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
// // //               Unlock Emergency Units
// // //             </Text>
// // //           </View>

// // //           <View
// // //             style={{
// // //               height: 10,
// // //               backgroundColor: "#E5E7EB",
// // //               borderRadius: 5,
// // //               overflow: "hidden",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             <View
// // //               style={{
// // //                 height: "100%",
// // //                 width: `${progress?.percentage || 0}%`,
// // //                 backgroundColor: "#3B82F6",
// // //                 borderRadius: 5,
// // //               }}
// // //             />
// // //           </View>

// // //           <View
// // //             style={{ flexDirection: "row", justifyContent: "space-between" }}
// // //           >
// // //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //               ₦{(progress?.current || 0).toLocaleString()}
// // //             </Text>
// // //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //               ₦{(progress?.required || 100000).toLocaleString()}
// // //             </Text>
// // //           </View>

// // //           <Text
// // //             style={{
// // //               fontSize: 12,
// // //               color: "#6B7280",
// // //               marginTop: 10,
// // //               textAlign: "center",
// // //             }}
// // //           >
// // //             Spend ₦{(progress?.remaining || 0).toLocaleString()} more to unlock
// // //             38 emergency units
// // //           </Text>
// // //         </View>
// // //       );
// // //     }

// // //     // Eligible - show emergency units status
// // //     const emergency = statusData.emergency;
// // //     return (
// // //       <View
// // //         style={{
// // //           backgroundColor: canUseEmergency ? "#ECFDF5" : "#FEF3C7",
// // //           borderRadius: 16,
// // //           padding: 16,
// // //           marginBottom: 20,
// // //           borderLeftWidth: 4,
// // //           borderLeftColor: canUseEmergency ? "#10B981" : "#F59E0B",
// // //         }}
// // //       >
// // //         <View
// // //           style={{
// // //             flexDirection: "row",
// // //             alignItems: "center",
// // //             marginBottom: 12,
// // //           }}
// // //         >
// // //           <Text style={{ fontSize: 20, marginRight: 8 }}>⚡</Text>
// // //           <Text
// // //             style={{
// // //               fontSize: 14,
// // //               fontWeight: "700",
// // //               color: canUseEmergency ? "#065F46" : "#92400E",
// // //             }}
// // //           >
// // //             Emergency Units {canUseEmergency ? "Available" : "Locked"}
// // //           </Text>
// // //         </View>

// // //         <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
// // //           <View>
// // //             <Text style={{ fontSize: 11, color: "#6B7280" }}>Available</Text>
// // //             <Text
// // //               style={{
// // //                 fontSize: 18,
// // //                 fontWeight: "700",
// // //                 color: "#059669",
// // //               }}
// // //             >
// // //               {emergency?.availableUnits || 0} units
// // //             </Text>
// // //           </View>

// // //           {emergency?.usedUnits > 0 && (
// // //             <View style={{ alignItems: "flex-end" }}>
// // //               <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                 Outstanding
// // //               </Text>
// // //               <Text
// // //                 style={{
// // //                   fontSize: 18,
// // //                   fontWeight: "700",
// // //                   color: "#DC2626",
// // //                 }}
// // //               >
// // //                 {emergency.usedUnits} units
// // //               </Text>
// // //               <Text style={{ fontSize: 11, color: "#DC2626" }}>
// // //                 ₦{(emergency.outstandingDebt || 0).toLocaleString()} owed
// // //               </Text>
// // //             </View>
// // //           )}
// // //         </View>

// // //         <Text
// // //           style={{
// // //             fontSize: 11,
// // //             color: "#6B7280",
// // //             marginTop: 10,
// // //           }}
// // //         >
// // //           Repayment rate: ₦{EMERGENCY_PRICE}/unit
// // //         </Text>
// // //       </View>
// // //     );
// // //   };

// // //   // Render Purchase Form
// // //   const renderPurchaseForm = () => {
// // //     if (hasDebt) return null;

// // //     return (
// // //       <>
// // //         {/* Meter Input Card */}
// // //         <View
// // //           style={{
// // //             backgroundColor: "white",
// // //             borderRadius: 20,
// // //             padding: 20,
// // //             marginBottom: 20,
// // //             shadowColor: "#000",
// // //             shadowOffset: { width: 0, height: 2 },
// // //             shadowOpacity: 0.1,
// // //             shadowRadius: 8,
// // //             elevation: 3,
// // //           }}
// // //         >
// // //           <Text
// // //             style={{
// // //               fontSize: 14,
// // //               fontWeight: "600",
// // //               color: "#374151",
// // //               marginBottom: 8,
// // //             }}
// // //           >
// // //             🔢 Meter ID
// // //           </Text>

// // //           <View style={{ flexDirection: "row", marginBottom: 8 }}>
// // //             <TextInput
// // //               value={meterId}
// // //               onChangeText={handleMeterIdChange}
// // //               placeholder="Enter 11-digit meter ID"
// // //               keyboardType="numeric"
// // //               maxLength={11}
// // //               style={{
// // //                 flex: 1,
// // //                 borderWidth: 2,
// // //                 borderColor: meterId.length === 11 ? "#3B82F6" : "#E5E7EB",
// // //                 borderRadius: 12,
// // //                 paddingHorizontal: 16,
// // //                 paddingVertical: 12,
// // //                 marginRight: 10,
// // //                 fontSize: 16,
// // //                 backgroundColor: meterInfo ? "#EFF6FF" : "#F9FAFB",
// // //               }}
// // //             />
// // //             {meterId.length === 11 && !meterInfo && (
// // //               <TouchableOpacity
// // //                 onPress={handleCheckMeter}
// // //                 disabled={checkMeterIsPending}
// // //                 style={{
// // //                   backgroundColor: checkMeterIsPending ? "#9CA3AF" : "#3B82F6",
// // //                   borderRadius: 12,
// // //                   paddingHorizontal: 16,
// // //                   justifyContent: "center",
// // //                 }}
// // //               >
// // //                 {checkMeterIsPending ? (
// // //                   <ActivityIndicator color="#fff" size="small" />
// // //                 ) : (
// // //                   <Text style={{ color: "#fff", fontWeight: "700" }}>
// // //                     Verify
// // //                   </Text>
// // //                 )}
// // //               </TouchableOpacity>
// // //             )}
// // //           </View>

// // //           {meterId.length > 0 && meterId.length !== 11 && (
// // //             <Text style={{ color: "#F59E0B", fontSize: 12 }}>
// // //               ⚠️ {meterId.length}/11 digits
// // //             </Text>
// // //           )}
// // //         </View>

// // //         {/* Meter Info */}
// // //         {meterInfo && (
// // //           <Animated.View
// // //             style={{
// // //               transform: [{ scale: scaleAnim }],
// // //               backgroundColor: "#ECFDF5",
// // //               borderRadius: 16,
// // //               padding: 16,
// // //               marginBottom: 20,
// // //               borderLeftWidth: 4,
// // //               borderLeftColor: "#10B981",
// // //             }}
// // //           >
// // //             <View style={{ flexDirection: "row", alignItems: "center" }}>
// // //               <View
// // //                 style={{
// // //                   width: 40,
// // //                   height: 40,
// // //                   borderRadius: 20,
// // //                   backgroundColor: "#10B981",
// // //                   justifyContent: "center",
// // //                   alignItems: "center",
// // //                   marginRight: 12,
// // //                 }}
// // //               >
// // //                 <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
// // //               </View>
// // //               <View style={{ flex: 1 }}>
// // //                 <Text
// // //                   style={{
// // //                     fontSize: 14,
// // //                     fontWeight: "700",
// // //                     color: "#065F46",
// // //                     marginBottom: 4,
// // //                   }}
// // //                 >
// // //                   Meter Verified!
// // //                 </Text>
// // //                 <Text style={{ fontSize: 13, color: "#374151" }}>
// // //                   {meterInfo?.Customer_name}
// // //                 </Text>
// // //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// // //                   {meterInfo?.Customer_address}
// // //                 </Text>
// // //               </View>
// // //             </View>
// // //           </Animated.View>
// // //         )}

// // //         {/* Units Input Card */}
// // //         {meterInfo && (
// // //           <View
// // //             style={{
// // //               backgroundColor: "white",
// // //               borderRadius: 20,
// // //               padding: 20,
// // //               marginBottom: 20,
// // //               shadowColor: "#000",
// // //               shadowOffset: { width: 0, height: 2 },
// // //               shadowOpacity: 0.1,
// // //               shadowRadius: 8,
// // //               elevation: 3,
// // //             }}
// // //           >
// // //             {/* Wallet Units Input */}
// // //             <View style={{ marginBottom: 20 }}>
// // //               <Text
// // //                 style={{
// // //                   fontSize: 14,
// // //                   fontWeight: "600",
// // //                   color: "#374151",
// // //                   marginBottom: 8,
// // //                 }}
// // //               >
// // //                 💰 Units from Wallet (₦{NORMAL_PRICE}/unit)
// // //               </Text>

// // //               <TextInput
// // //                 value={walletUnits}
// // //                 onChangeText={handleWalletUnitsChange}
// // //                 placeholder="0"
// // //                 keyboardType="numeric"
// // //                 style={{
// // //                   borderWidth: 2,
// // //                   borderColor: walletUnits ? "#3B82F6" : "#E5E7EB",
// // //                   borderRadius: 12,
// // //                   paddingHorizontal: 16,
// // //                   paddingVertical: 14,
// // //                   fontSize: 24,
// // //                   fontWeight: "bold",
// // //                   textAlign: "center",
// // //                   backgroundColor: "#F9FAFB",
// // //                 }}
// // //               />

// // //               <Text
// // //                 style={{
// // //                   fontSize: 11,
// // //                   color: "#6B7280",
// // //                   marginTop: 6,
// // //                   textAlign: "center",
// // //                 }}
// // //               >
// // //                 Max: {statusData.maxWalletUnits || 0} units (₦
// // //                 {(statusData.walletBalance || 0).toLocaleString()})
// // //               </Text>

// // //               {/* Quick select for wallet */}
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "space-between",
// // //                   marginTop: 10,
// // //                   gap: 8,
// // //                 }}
// // //               >
// // //                 {[5, 10, 20, statusData.maxWalletUnits || 0]
// // //                   .filter(
// // //                     (v, i, a) =>
// // //                       a.indexOf(v) === i &&
// // //                       v > 0 &&
// // //                       v <= (statusData.maxWalletUnits || 0)
// // //                   )
// // //                   .slice(0, 4)
// // //                   .map((unit) => (
// // //                     <TouchableOpacity
// // //                       key={unit}
// // //                       onPress={() => setWalletUnits(unit.toString())}
// // //                       style={{
// // //                         flex: 1,
// // //                         backgroundColor:
// // //                           walletUnits === unit.toString()
// // //                             ? "#3B82F6"
// // //                             : "#F3F4F6",
// // //                         borderRadius: 8,
// // //                         paddingVertical: 8,
// // //                         alignItems: "center",
// // //                       }}
// // //                     >
// // //                       <Text
// // //                         style={{
// // //                           fontSize: 12,
// // //                           fontWeight: "600",
// // //                           color:
// // //                             walletUnits === unit.toString()
// // //                               ? "#fff"
// // //                               : "#374151",
// // //                         }}
// // //                       >
// // //                         {unit}
// // //                       </Text>
// // //                     </TouchableOpacity>
// // //                   ))}
// // //               </View>
// // //             </View>

// // //             {/* Emergency Units Input */}
// // //             {statusData.isEligible && canUseEmergency && (
// // //               <View>
// // //                 <Text
// // //                   style={{
// // //                     fontSize: 14,
// // //                     fontWeight: "600",
// // //                     color: "#374151",
// // //                     marginBottom: 8,
// // //                   }}
// // //                 >
// // //                   ⚡ Emergency Units (₦{EMERGENCY_PRICE}/unit on repayment)
// // //                 </Text>

// // //                 <TextInput
// // //                   value={emergencyUnits}
// // //                   onChangeText={handleEmergencyUnitsChange}
// // //                   placeholder="0"
// // //                   keyboardType="numeric"
// // //                   style={{
// // //                     borderWidth: 2,
// // //                     borderColor: emergencyUnits ? "#F59E0B" : "#E5E7EB",
// // //                     borderRadius: 12,
// // //                     paddingHorizontal: 16,
// // //                     paddingVertical: 14,
// // //                     fontSize: 24,
// // //                     fontWeight: "bold",
// // //                     textAlign: "center",
// // //                     backgroundColor: "#FFFBEB",
// // //                   }}
// // //                 />

// // //                 <Text
// // //                   style={{
// // //                     fontSize: 11,
// // //                     color: "#6B7280",
// // //                     marginTop: 6,
// // //                     textAlign: "center",
// // //                   }}
// // //                 >
// // //                   Available: {statusData.emergency?.availableUnits || 0} units
// // //                 </Text>

// // //                 {/* Quick select for emergency */}
// // //                 <View
// // //                   style={{
// // //                     flexDirection: "row",
// // //                     justifyContent: "space-between",
// // //                     marginTop: 10,
// // //                     gap: 8,
// // //                   }}
// // //                 >
// // //                   {[5, 10, 20, statusData.emergency?.availableUnits || 0]
// // //                     .filter(
// // //                       (v, i, a) =>
// // //                         a.indexOf(v) === i &&
// // //                         v > 0 &&
// // //                         v <= (statusData.emergency?.availableUnits || 0)
// // //                     )
// // //                     .slice(0, 4)
// // //                     .map((unit) => (
// // //                       <TouchableOpacity
// // //                         key={unit}
// // //                         onPress={() => setEmergencyUnits(unit.toString())}
// // //                         style={{
// // //                           flex: 1,
// // //                           backgroundColor:
// // //                             emergencyUnits === unit.toString()
// // //                               ? "#F59E0B"
// // //                               : "#FEF3C7",
// // //                           borderRadius: 8,
// // //                           paddingVertical: 8,
// // //                           alignItems: "center",
// // //                         }}
// // //                       >
// // //                         <Text
// // //                           style={{
// // //                             fontSize: 12,
// // //                             fontWeight: "600",
// // //                             color:
// // //                               emergencyUnits === unit.toString()
// // //                                 ? "#fff"
// // //                                 : "#92400E",
// // //                           }}
// // //                         >
// // //                           {unit}
// // //                         </Text>
// // //                       </TouchableOpacity>
// // //                     ))}
// // //                 </View>
// // //               </View>
// // //             )}
// // //           </View>
// // //         )}

// // //         {/* Summary Card */}
// // //         {meterInfo && isValidPurchase && (
// // //           <View
// // //             style={{
// // //               backgroundColor: "#F8FAFC",
// // //               borderRadius: 16,
// // //               padding: 16,
// // //               marginBottom: 20,
// // //               borderWidth: 1,
// // //               borderColor: "#E2E8F0",
// // //             }}
// // //           >
// // //             <Text
// // //               style={{
// // //                 fontSize: 14,
// // //                 fontWeight: "700",
// // //                 color: "#374151",
// // //                 marginBottom: 12,
// // //               }}
// // //             >
// // //               Summary
// // //             </Text>

// // //             {totals.walletUnits > 0 && (
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "space-between",
// // //                   marginBottom: 8,
// // //                 }}
// // //               >
// // //                 <Text style={{ fontSize: 13, color: "#6B7280" }}>
// // //                   💰 Wallet: {totals.walletUnits} × ₦{NORMAL_PRICE}
// // //                 </Text>
// // //                 <Text
// // //                   style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}
// // //                 >
// // //                   ₦{totals.walletCost.toLocaleString()}
// // //                 </Text>
// // //               </View>
// // //             )}

// // //             {totals.emergencyUnits > 0 && (
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "space-between",
// // //                   marginBottom: 8,
// // //                 }}
// // //               >
// // //                 <Text style={{ fontSize: 13, color: "#F59E0B" }}>
// // //                   ⚡ Emergency: {totals.emergencyUnits} × ₦{EMERGENCY_PRICE}
// // //                 </Text>
// // //                 <Text
// // //                   style={{ fontSize: 13, fontWeight: "600", color: "#F59E0B" }}
// // //                 >
// // //                   ₦{totals.emergencyCost.toLocaleString()}
// // //                 </Text>
// // //               </View>
// // //             )}

// // //             <View
// // //               style={{
// // //                 height: 1,
// // //                 backgroundColor: "#E5E7EB",
// // //                 marginVertical: 10,
// // //               }}
// // //             />

// // //             <View
// // //               style={{
// // //                 flexDirection: "row",
// // //                 justifyContent: "space-between",
// // //                 marginBottom: 4,
// // //               }}
// // //             >
// // //               <Text
// // //                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
// // //               >
// // //                 Total Units:
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
// // //               >
// // //                 {totals.totalUnits} kWh
// // //               </Text>
// // //             </View>

// // //             <View
// // //               style={{
// // //                 flexDirection: "row",
// // //                 justifyContent: "space-between",
// // //                 marginBottom: 4,
// // //               }}
// // //             >
// // //               <Text
// // //                 style={{ fontSize: 14, fontWeight: "600", color: "#059669" }}
// // //               >
// // //                 Pay Now:
// // //               </Text>
// // //               <Text
// // //                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
// // //               >
// // //                 ₦{totals.payNow.toLocaleString()}
// // //               </Text>
// // //             </View>

// // //             {totals.emergencyUnits > 0 && (
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "space-between",
// // //                 }}
// // //               >
// // //                 <Text
// // //                   style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}
// // //                 >
// // //                   Will Owe:
// // //                 </Text>
// // //                 <Text
// // //                   style={{ fontSize: 14, fontWeight: "700", color: "#DC2626" }}
// // //                 >
// // //                   ₦{totals.oweAfter.toLocaleString()}
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </View>
// // //         )}

// // //         {/* Pay Button */}
// // //         {meterInfo && isValidPurchase && (
// // //           <TouchableOpacity
// // //             onPress={handlePayment}
// // //             disabled={isBuying}
// // //             style={{
// // //               backgroundColor: isBuying
// // //                 ? "#9CA3AF"
// // //                 : totals.emergencyUnits > 0
// // //                 ? "#F59E0B"
// // //                 : "#3B82F6",
// // //               borderRadius: 16,
// // //               paddingVertical: 18,
// // //               shadowColor: totals.emergencyUnits > 0 ? "#F59E0B" : "#3B82F6",
// // //               shadowOffset: { width: 0, height: 4 },
// // //               shadowOpacity: 0.3,
// // //               shadowRadius: 8,
// // //               elevation: 5,
// // //             }}
// // //           >
// // //             {isBuying ? (
// // //               <View
// // //                 style={{
// // //                   flexDirection: "row",
// // //                   justifyContent: "center",
// // //                   alignItems: "center",
// // //                 }}
// // //               >
// // //                 <ActivityIndicator color="#fff" />
// // //                 <Text
// // //                   style={{
// // //                     color: "#fff",
// // //                     marginLeft: 10,
// // //                     fontSize: 16,
// // //                     fontWeight: "700",
// // //                   }}
// // //                 >
// // //                   Processing...
// // //                 </Text>
// // //               </View>
// // //             ) : (
// // //               <View>
// // //                 <Text
// // //                   style={{
// // //                     color: "#fff",
// // //                     textAlign: "center",
// // //                     fontSize: 18,
// // //                     fontWeight: "700",
// // //                   }}
// // //                 >
// // //                   ⚡ Buy {totals.totalUnits} Units
// // //                 </Text>
// // //                 <Text
// // //                   style={{
// // //                     color: "rgba(255,255,255,0.8)",
// // //                     textAlign: "center",
// // //                     fontSize: 12,
// // //                     marginTop: 4,
// // //                   }}
// // //                 >
// // //                   Pay ₦{totals.payNow.toLocaleString()}
// // //                   {totals.emergencyUnits > 0 &&
// // //                     ` • Owe ₦${totals.oweAfter.toLocaleString()}`}
// // //                 </Text>
// // //               </View>
// // //             )}
// // //           </TouchableOpacity>
// // //         )}
// // //       </>
// // //     );
// // //   };

// // //   return (
// // //     <ScreenWrapper
// // //       title="Buy Electricity ⚡"
// // //       navigation={navigation}
// // //       headerStyle={{ backgroundColor: "white" }}
// // //     >
// // //       <ScrollView
// // //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// // //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// // //       >
// // //         {/* Wallet Card */}
// // //         {renderWalletCard()}

// // //         {/* Debt Warning (if any) */}
// // //         {renderDebtWarning()}

// // //         {/* Emergency Status Card */}
// // //         {renderEmergencyStatusCard()}

// // //         {/* Purchase Form (hidden if debt exists) */}
// // //         {renderPurchaseForm()}

// // //         {/* Helper Text */}
// // //         {!meterInfo && !hasDebt && (
// // //           <View
// // //             style={{
// // //               backgroundColor: "#F9FAFB",
// // //               borderRadius: 16,
// // //               padding: 16,
// // //               marginTop: 20,
// // //             }}
// // //           >
// // //             <Text
// // //               style={{
// // //                 textAlign: "center",
// // //                 color: "#6B7280",
// // //                 fontSize: 13,
// // //                 fontStyle: "italic",
// // //               }}
// // //             >
// // //               💡 Enter your meter ID and verify to continue
// // //             </Text>
// // //           </View>
// // //         )}

// // //         {/* Footer */}
// // //         <View style={{ marginTop: 20 }}>
// // //           <Text style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}>
// // //             Wallet: ₦{NORMAL_PRICE}/unit • Emergency: ₦{EMERGENCY_PRICE}/unit
// // //             (on repayment)
// // //           </Text>
// // //         </View>
// // //       </ScrollView>
// // //     </ScreenWrapper>
// // //   );
// // // };

// // // export default ElectricityPaymentScreen;

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
// //   Switch,
// // } from "react-native";
// // import { useSelector } from "react-redux";
// // import { useFetchData, useMutateData } from "../../../hooks/Request";
// // import { useNavigation } from "@react-navigation/native";
// // import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// // const ElectricityPaymentScreen = () => {
// //   const { user_data } = useSelector((state) => state.AuthSlice);
// //   const navigation = useNavigation();

// //   const [meterId, setMeterId] = useState("");
// //   const [walletUnits, setWalletUnits] = useState("");
// //   const [useEmergency, setUseEmergency] = useState(false); // Toggle instead of input
// //   const [meterInfo, setMeterInfo] = useState(null);
// //   const scaleAnim = useState(new Animated.Value(1))[0];

// //   // Constants
// //   const NORMAL_PRICE = 260;
// //   const EMERGENCY_UNITS = 38;
// //   const EMERGENCY_DEBT = 10000;
// //   const MIN_UNITS = 1;
// //   const MAX_UNITS = 500;

// //   // Fetch emergency status
// //   const {
// //     data: statusResponse,
// //     isLoading: isLoadingStatus,
// //     refetch: refetchStatus,
// //   } = useFetchData("api/captainv4/emergency-status", "emergency-status");

// //   const statusData = statusResponse?.data || {
// //     walletBalance: 0,
// //     maxWalletUnits: 0,
// //     normalPricePerUnit: 260,
// //     isEligible: false,
// //     hasAccount: false,
// //     eligibilityProgress: {
// //       current: 0,
// //       required: 100000,
// //       remaining: 100000,
// //       percentage: 0,
// //     },
// //     emergency: null,
// //   };

// //   // Mutations
// //   const { mutate: checkMeter, isLoading: checkMeterIsPending } = useMutateData(
// //     "api/captain/vend",
// //     "POST",
// //     "billpayment"
// //   );

// //   const { mutate: buyElectricity, isLoading: isBuying } = useMutateData(
// //     "api/captainv4/buy/v4",
// //     "POST",
// //     "buy-electricity"
// //   );

// //   // const { mutate: payDebt, isLoading: isPayingDebt } = useMutateData(
// //   //   "api/captainv4/paydebt",
// //   //   "GET",
// //   //   "pay-debt"
// //   // );

// //   // Calculate totals
// //   const calculateTotals = () => {
// //     const walletUnitsNum = Number(walletUnits) || 0;
// //     const emergencyUnitsNum = useEmergency ? EMERGENCY_UNITS : 0;
// //     const totalUnits = walletUnitsNum + emergencyUnitsNum;
// //     const walletCost = walletUnitsNum * NORMAL_PRICE;
// //     const emergencyCost = useEmergency ? EMERGENCY_DEBT : 0;

// //     return {
// //       walletUnits: walletUnitsNum,
// //       emergencyUnits: emergencyUnitsNum,
// //       totalUnits,
// //       walletCost,
// //       emergencyCost,
// //       payNow: walletCost,
// //       oweAfter: emergencyCost,
// //     };
// //   };

// //   const handleCheckMeter = () => {
// //     if (!meterId || meterId.length !== 11 || !/^\d+$/.test(meterId)) {
// //       Alert.alert("Error", "Please enter a valid 11-digit meter ID");
// //       return;
// //     }

// //     checkMeter(
// //       { meterId },
// //       {
// //         onSuccess: (response) => {
// //           if (!response?.data || !response.data[0]) {
// //             Alert.alert("Error", "No meter information found");
// //             return;
// //           }
// //           setMeterInfo(response.data[0]);
// //           Animated.sequence([
// //             Animated.timing(scaleAnim, {
// //               toValue: 1.1,
// //               duration: 200,
// //               useNativeDriver: true,
// //             }),
// //             Animated.timing(scaleAnim, {
// //               toValue: 1,
// //               duration: 200,
// //               useNativeDriver: true,
// //             }),
// //           ]).start();
// //           Alert.alert("Success", "Meter verified! ⚡");
// //         },
// //         onError: (error) => {
// //           Alert.alert("Error", error?.message || "Failed to verify meter");
// //           setMeterInfo(null);
// //         },
// //       }
// //     );
// //   };

// //   // In your component
// //   const [triggerPayDebt, setTriggerPayDebt] = useState(false);

// //   const {
// //     data: payDebtResponse,
// //     isLoading: isPayingDebt,
// //     refetch: refetchPayDebt,
// //   } = useFetchData(
// //     "api/captainv4/paydebt",
// //     "pay-debt",
// //     { enabled: false } // Don't auto-fetch
// //   );

// //   const handlePayDebt = () => {
// //     Alert.alert(
// //       "Pay Debt",
// //       `Deduct ₦${EMERGENCY_DEBT.toLocaleString()} from your wallet?`,
// //       [
// //         { text: "Cancel", style: "cancel" },
// //         {
// //           text: "Pay Now",
// //           style: "destructive",
// //           onPress: async () => {
// //             try {
// //               const result = await refetchPayDebt();
// //               if (result.data?.success) {
// //                 Alert.alert(
// //                   "Debt Paid! ✅",
// //                   `₦${result.data.data.debtPaid.toLocaleString()} deducted\n` +
// //                     `${result.data.data.unitsRepaid} units restored\n` +
// //                     `Wallet: ₦${result.data.data.newWalletBalance.toLocaleString()}`
// //                 );
// //                 refetchStatus();
// //               }
// //             } catch (error) {
// //               Alert.alert("Error", error.message || "Payment failed");
// //             }
// //           },
// //         },
// //       ]
// //     );
// //   };

// //   // const handlePayDebt = () => {
// //   //   Alert.alert(
// //   //     "Pay Debt",
// //   //     `Deduct ₦${EMERGENCY_DEBT.toLocaleString()} from your wallet to clear your debt?`,
// //   //     [
// //   //       { text: "Cancel", style: "cancel" },
// //   //       {
// //   //         text: "Pay Now",
// //   //         style: "destructive",
// //   //         onPress: () => {
// //   //           payDebt(
// //   //             {},
// //   //             {
// //   //               onSuccess: (data) => {
// //   //                 Alert.alert(
// //   //                   "Debt Paid! ✅",
// //   //                   `₦${data.data.debtPaid.toLocaleString()} deducted\n` +
// //   //                     `${data.data.unitsRepaid} emergency units restored\n` +
// //   //                     `Wallet: ₦${data.data.newWalletBalance.toLocaleString()}`
// //   //                 );
// //   //                 refetchStatus();
// //   //               },
// //   //               onError: (error) => {
// //   //                 Alert.alert("Error", error.message || "Payment failed");
// //   //               },
// //   //             }
// //   //           );
// //   //         },
// //   //       },
// //   //     ]
// //   //   );
// //   // };

// //   const handlePayment = () => {
// //     const totals = calculateTotals();

// //     if (!meterId || !meterInfo) {
// //       Alert.alert("Error", "Please verify the meter first");
// //       return;
// //     }

// //     if (totals.totalUnits < MIN_UNITS) {
// //       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} unit`);
// //       return;
// //     }

// //     if (totals.totalUnits > MAX_UNITS) {
// //       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
// //       return;
// //     }

// //     if (totals.walletUnits > statusData.maxWalletUnits) {
// //       Alert.alert("Error", `Max wallet units: ${statusData.maxWalletUnits}`);
// //       return;
// //     }

// //     let msg = `Buy ${totals.totalUnits} units?\n\n`;
// //     if (totals.walletUnits > 0) {
// //       msg += `💰 Wallet: ${
// //         totals.walletUnits
// //       } units = ₦${totals.walletCost.toLocaleString()}\n`;
// //     }
// //     if (useEmergency) {
// //       msg += `⚡ Emergency: ${EMERGENCY_UNITS} units = ₦${EMERGENCY_DEBT.toLocaleString()} (owed)\n`;
// //     }
// //     msg += `\nPay Now: ₦${totals.payNow.toLocaleString()}`;
// //     if (useEmergency) {
// //       msg += `\nWill Owe: ₦${totals.oweAfter.toLocaleString()}`;
// //     }

// //     Alert.alert("Confirm", msg, [
// //       { text: "Cancel", style: "cancel" },
// //       {
// //         text: "Buy",
// //         onPress: () => {
// //           buyElectricity(
// //             {
// //               meterId,
// //               units: totals.walletUnits,
// //               useEmergency: useEmergency,
// //             },
// //             {
// //               onSuccess: (data) => {
// //                 let successMsg = `Token: ${data.data.token}\nUnits: ${data.data.totalUnits} kWh`;
// //                 if (data.data.emergencyUnits > 0) {
// //                   successMsg += `\n\nDebt: ₦${data.data.emergencyAmountOwed.toLocaleString()}`;
// //                 }
// //                 successMsg += `\nWallet: ₦${data.data.newWalletBalance.toLocaleString()}`;

// //                 Alert.alert("Success! 🎉", successMsg, [
// //                   { text: "OK", onPress: () => navigation.goBack() },
// //                 ]);
// //                 refetchStatus();
// //               },
// //               onError: (error) => {
// //                 Alert.alert("Error", error.message || "Purchase failed");
// //               },
// //             }
// //           );
// //         },
// //       },
// //     ]);
// //   };

// //   const handleMeterIdChange = (text) => {
// //     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
// //     setMeterId(numericText);
// //     if (meterInfo) setMeterInfo(null);
// //   };

// //   const handleWalletUnitsChange = (text) => {
// //     const numericText = text.replace(/[^0-9]/g, "");
// //     const num = Number(numericText) || 0;
// //     if (numericText === "" || num <= statusData.maxWalletUnits) {
// //       setWalletUnits(numericText);
// //     }
// //   };

// //   const totals = calculateTotals();
// //   const isValidPurchase =
// //     totals.totalUnits >= MIN_UNITS && totals.totalUnits <= MAX_UNITS;
// //   const hasDebt = statusData.emergency?.hasDebt || false;
// //   const canUseEmergency = statusData.emergency?.canUse || false;
// //   const canPayDebt = hasDebt && statusData.walletBalance >= EMERGENCY_DEBT;

// //   // ==================== RENDER ====================

// //   const renderWalletCard = () => (
// //     <View
// //       style={{
// //         backgroundColor: "#EFF6FF",
// //         borderRadius: 16,
// //         padding: 16,
// //         marginBottom: 20,
// //       }}
// //     >
// //       <View
// //         style={{
// //           flexDirection: "row",
// //           alignItems: "center",
// //           justifyContent: "space-between",
// //         }}
// //       >
// //         <View style={{ flexDirection: "row", alignItems: "center" }}>
// //           <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
// //           <View>
// //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //               Wallet Balance
// //             </Text>
// //             <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E40AF" }}>
// //               ₦{(statusData.walletBalance || 0).toLocaleString()}
// //             </Text>
// //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //               Max {statusData.maxWalletUnits || 0} units
// //             </Text>
// //           </View>
// //         </View>
// //         <TouchableOpacity
// //           onPress={() => refetchStatus()}
// //           style={{
// //             backgroundColor: "#DBEAFE",
// //             borderRadius: 8,
// //             paddingHorizontal: 12,
// //             paddingVertical: 8,
// //           }}
// //         >
// //           <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
// //             Refresh
// //           </Text>
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );

// //   const renderDebtWarning = () => {
// //     if (!hasDebt) return null;
// //     const shortfall = EMERGENCY_DEBT - statusData.walletBalance;

// //     return (
// //       <View
// //         style={{
// //           backgroundColor: "#FEE2E2",
// //           borderRadius: 16,
// //           padding: 20,
// //           marginBottom: 20,
// //           borderLeftWidth: 4,
// //           borderLeftColor: "#DC2626",
// //         }}
// //       >
// //         <View
// //           style={{
// //             flexDirection: "row",
// //             alignItems: "center",
// //             marginBottom: 12,
// //           }}
// //         >
// //           <Text style={{ fontSize: 24, marginRight: 10 }}>🔒</Text>
// //           <Text style={{ fontSize: 16, fontWeight: "700", color: "#DC2626" }}>
// //             Purchases Locked
// //           </Text>
// //         </View>

// //         <Text style={{ fontSize: 14, color: "#7F1D1D", marginBottom: 12 }}>
// //           Clear your ₦{EMERGENCY_DEBT.toLocaleString()} debt to continue.
// //         </Text>

// //         <View
// //           style={{
// //             backgroundColor: "#FECACA",
// //             borderRadius: 12,
// //             padding: 12,
// //             marginBottom: 16,
// //           }}
// //         >
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               marginBottom: 8,
// //             }}
// //           >
// //             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Debt:</Text>
// //             <Text style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}>
// //               ₦{EMERGENCY_DEBT.toLocaleString()}
// //             </Text>
// //           </View>
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               marginBottom: shortfall > 0 ? 8 : 0,
// //             }}
// //           >
// //             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Wallet:</Text>
// //             <Text style={{ fontSize: 13, fontWeight: "700", color: "#7F1D1D" }}>
// //               ₦{statusData.walletBalance.toLocaleString()}
// //             </Text>
// //           </View>
// //           {shortfall > 0 && (
// //             <View
// //               style={{ flexDirection: "row", justifyContent: "space-between" }}
// //             >
// //               <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Need:</Text>
// //               <Text
// //                 style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}
// //               >
// //                 ₦{shortfall.toLocaleString()}
// //               </Text>
// //             </View>
// //           )}
// //         </View>

// //         {canPayDebt ? (
// //           <TouchableOpacity
// //             onPress={handlePayDebt}
// //             disabled={isPayingDebt}
// //             style={{
// //               backgroundColor: isPayingDebt ? "#9CA3AF" : "#059669",
// //               borderRadius: 12,
// //               paddingVertical: 14,
// //               alignItems: "center",
// //             }}
// //           >
// //             {isPayingDebt ? (
// //               <ActivityIndicator color="#fff" />
// //             ) : (
// //               <>
// //                 <Text
// //                   style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
// //                 >
// //                   ✓ Pay ₦{EMERGENCY_DEBT.toLocaleString()} Now
// //                 </Text>
// //                 <Text
// //                   style={{
// //                     color: "rgba(255,255,255,0.8)",
// //                     fontSize: 12,
// //                     marginTop: 2,
// //                   }}
// //                 >
// //                   Deduct from wallet
// //                 </Text>
// //               </>
// //             )}
// //           </TouchableOpacity>
// //         ) : (
// //           <View
// //             style={{
// //               backgroundColor: "#FCA5A5",
// //               borderRadius: 12,
// //               paddingVertical: 14,
// //               alignItems: "center",
// //             }}
// //           >
// //             <Text style={{ color: "#7F1D1D", fontWeight: "600", fontSize: 14 }}>
// //               ❌ Insufficient Balance
// //             </Text>
// //             <Text style={{ color: "#7F1D1D", fontSize: 12, marginTop: 2 }}>
// //               Fund ₦{shortfall.toLocaleString()} more
// //             </Text>
// //           </View>
// //         )}
// //       </View>
// //     );
// //   };

// //   const renderEmergencyStatusCard = () => {
// //     if (isLoadingStatus) {
// //       return (
// //         <View
// //           style={{
// //             backgroundColor: "#F3F4F6",
// //             borderRadius: 16,
// //             padding: 20,
// //             marginBottom: 20,
// //             alignItems: "center",
// //           }}
// //         >
// //           <ActivityIndicator size="small" color="#6B7280" />
// //         </View>
// //       );
// //     }

// //     if (!statusData.isEligible) {
// //       const progress = statusData.eligibilityProgress;
// //       return (
// //         <View
// //           style={{
// //             backgroundColor: "#F3F4F6",
// //             borderRadius: 16,
// //             padding: 16,
// //             marginBottom: 20,
// //           }}
// //         >
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               alignItems: "center",
// //               marginBottom: 12,
// //             }}
// //           >
// //             <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
// //             <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
// //               Unlock Emergency Units
// //             </Text>
// //           </View>
// //           <View
// //             style={{
// //               height: 10,
// //               backgroundColor: "#E5E7EB",
// //               borderRadius: 5,
// //               overflow: "hidden",
// //               marginBottom: 8,
// //             }}
// //           >
// //             <View
// //               style={{
// //                 height: "100%",
// //                 width: `${progress?.percentage || 0}%`,
// //                 backgroundColor: "#3B82F6",
// //                 borderRadius: 5,
// //               }}
// //             />
// //           </View>
// //           <View
// //             style={{ flexDirection: "row", justifyContent: "space-between" }}
// //           >
// //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //               ₦{(progress?.current || 0).toLocaleString()}
// //             </Text>
// //             <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //               ₦{(progress?.required || 100000).toLocaleString()}
// //             </Text>
// //           </View>
// //           <Text
// //             style={{
// //               fontSize: 12,
// //               color: "#6B7280",
// //               marginTop: 10,
// //               textAlign: "center",
// //             }}
// //           >
// //             Spend ₦{(progress?.remaining || 0).toLocaleString()} more to unlock
// //           </Text>
// //         </View>
// //       );
// //     }

// //     return (
// //       <View
// //         style={{
// //           backgroundColor: canUseEmergency ? "#ECFDF5" : "#FEF3C7",
// //           borderRadius: 16,
// //           padding: 16,
// //           marginBottom: 20,
// //           borderLeftWidth: 4,
// //           borderLeftColor: canUseEmergency ? "#10B981" : "#F59E0B",
// //         }}
// //       >
// //         <View
// //           style={{
// //             flexDirection: "row",
// //             alignItems: "center",
// //             marginBottom: 8,
// //           }}
// //         >
// //           <Text style={{ fontSize: 20, marginRight: 8 }}>⚡</Text>
// //           <Text
// //             style={{
// //               fontSize: 14,
// //               fontWeight: "700",
// //               color: canUseEmergency ? "#065F46" : "#92400E",
// //             }}
// //           >
// //             Emergency: {EMERGENCY_UNITS} units = ₦
// //             {EMERGENCY_DEBT.toLocaleString()}
// //           </Text>
// //         </View>
// //         <Text style={{ fontSize: 12, color: "#6B7280" }}>
// //           {canUseEmergency
// //             ? "Available to use"
// //             : "Currently in use (pay debt first)"}
// //         </Text>
// //       </View>
// //     );
// //   };

// //   const renderPurchaseForm = () => {
// //     if (hasDebt) return null;

// //     return (
// //       <>
// //         {/* Meter Input */}
// //         <View
// //           style={{
// //             backgroundColor: "white",
// //             borderRadius: 20,
// //             padding: 20,
// //             marginBottom: 20,
// //             elevation: 3,
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
// //             🔢 Meter ID
// //           </Text>
// //           <View style={{ flexDirection: "row", marginBottom: 8 }}>
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
// //                 disabled={checkMeterIsPending}
// //                 style={{
// //                   backgroundColor: checkMeterIsPending ? "#9CA3AF" : "#3B82F6",
// //                   borderRadius: 12,
// //                   paddingHorizontal: 16,
// //                   justifyContent: "center",
// //                 }}
// //               >
// //                 {checkMeterIsPending ? (
// //                   <ActivityIndicator color="#fff" size="small" />
// //                 ) : (
// //                   <Text style={{ color: "#fff", fontWeight: "700" }}>
// //                     Verify
// //                   </Text>
// //                 )}
// //               </TouchableOpacity>
// //             )}
// //           </View>
// //           {meterId.length > 0 && meterId.length !== 11 && (
// //             <Text style={{ color: "#F59E0B", fontSize: 12 }}>
// //               ⚠️ {meterId.length}/11 digits
// //             </Text>
// //           )}
// //         </View>

// //         {/* Meter Info */}
// //         {meterInfo && (
// //           <Animated.View
// //             style={{
// //               transform: [{ scale: scaleAnim }],
// //               backgroundColor: "#ECFDF5",
// //               borderRadius: 16,
// //               padding: 16,
// //               marginBottom: 20,
// //               borderLeftWidth: 4,
// //               borderLeftColor: "#10B981",
// //             }}
// //           >
// //             <View style={{ flexDirection: "row", alignItems: "center" }}>
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
// //                 <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
// //               </View>
// //               <View style={{ flex: 1 }}>
// //                 <Text
// //                   style={{
// //                     fontSize: 14,
// //                     fontWeight: "700",
// //                     color: "#065F46",
// //                     marginBottom: 4,
// //                   }}
// //                 >
// //                   Meter Verified!
// //                 </Text>
// //                 <Text style={{ fontSize: 13, color: "#374151" }}>
// //                   {meterInfo?.Customer_name}
// //                 </Text>
// //                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
// //                   {meterInfo?.Customer_address}
// //                 </Text>
// //               </View>
// //             </View>
// //           </Animated.View>
// //         )}

// //         {/* Units Input */}
// //         {meterInfo && (
// //           <View
// //             style={{
// //               backgroundColor: "white",
// //               borderRadius: 20,
// //               padding: 20,
// //               marginBottom: 20,
// //               elevation: 3,
// //             }}
// //           >
// //             {/* Wallet Units */}
// //             <View style={{ marginBottom: 20 }}>
// //               <Text
// //                 style={{
// //                   fontSize: 14,
// //                   fontWeight: "600",
// //                   color: "#374151",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 💰 Units from Wallet (₦{NORMAL_PRICE}/unit)
// //               </Text>
// //               <TextInput
// //                 value={walletUnits}
// //                 onChangeText={handleWalletUnitsChange}
// //                 placeholder="0"
// //                 keyboardType="numeric"
// //                 style={{
// //                   borderWidth: 2,
// //                   borderColor: walletUnits ? "#3B82F6" : "#E5E7EB",
// //                   borderRadius: 12,
// //                   paddingHorizontal: 16,
// //                   paddingVertical: 14,
// //                   fontSize: 24,
// //                   fontWeight: "bold",
// //                   textAlign: "center",
// //                   backgroundColor: "#F9FAFB",
// //                 }}
// //               />
// //               <Text
// //                 style={{
// //                   fontSize: 11,
// //                   color: "#6B7280",
// //                   marginTop: 6,
// //                   textAlign: "center",
// //                 }}
// //               >
// //                 Max: {statusData.maxWalletUnits || 0} units
// //               </Text>

// //               {/* Quick Select */}
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   marginTop: 10,
// //                   gap: 8,
// //                 }}
// //               >
// //                 {[5, 10, 20, statusData.maxWalletUnits || 0]
// //                   .filter(
// //                     (v, i, a) =>
// //                       a.indexOf(v) === i &&
// //                       v > 0 &&
// //                       v <= (statusData.maxWalletUnits || 0)
// //                   )
// //                   .slice(0, 4)
// //                   .map((unit) => (
// //                     <TouchableOpacity
// //                       key={unit}
// //                       onPress={() => setWalletUnits(unit.toString())}
// //                       style={{
// //                         flex: 1,
// //                         backgroundColor:
// //                           walletUnits === unit.toString()
// //                             ? "#3B82F6"
// //                             : "#F3F4F6",
// //                         borderRadius: 8,
// //                         paddingVertical: 8,
// //                         alignItems: "center",
// //                       }}
// //                     >
// //                       <Text
// //                         style={{
// //                           fontSize: 12,
// //                           fontWeight: "600",
// //                           color:
// //                             walletUnits === unit.toString()
// //                               ? "#fff"
// //                               : "#374151",
// //                         }}
// //                       >
// //                         {unit}
// //                       </Text>
// //                     </TouchableOpacity>
// //                   ))}
// //               </View>
// //             </View>

// //             {/* Emergency Toggle */}
// //             {statusData.isEligible && canUseEmergency && (
// //               <View
// //                 style={{
// //                   backgroundColor: useEmergency ? "#FEF3C7" : "#F9FAFB",
// //                   borderRadius: 12,
// //                   padding: 16,
// //                   borderWidth: 2,
// //                   borderColor: useEmergency ? "#F59E0B" : "#E5E7EB",
// //                 }}
// //               >
// //                 <View
// //                   style={{
// //                     flexDirection: "row",
// //                     alignItems: "center",
// //                     justifyContent: "space-between",
// //                   }}
// //                 >
// //                   <View style={{ flex: 1 }}>
// //                     <Text
// //                       style={{
// //                         fontSize: 14,
// //                         fontWeight: "600",
// //                         color: "#374151",
// //                       }}
// //                     >
// //                       ⚡ Add Emergency Units
// //                     </Text>
// //                     <Text
// //                       style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
// //                     >
// //                       {EMERGENCY_UNITS} units • ₦
// //                       {EMERGENCY_DEBT.toLocaleString()} debt
// //                     </Text>
// //                   </View>
// //                   <Switch
// //                     value={useEmergency}
// //                     onValueChange={setUseEmergency}
// //                     trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
// //                     thumbColor={useEmergency ? "#F59E0B" : "#9CA3AF"}
// //                   />
// //                 </View>
// //                 {useEmergency && (
// //                   <View
// //                     style={{
// //                       backgroundColor: "#FEF3C7",
// //                       borderRadius: 8,
// //                       padding: 8,
// //                       marginTop: 12,
// //                     }}
// //                   >
// //                     <Text style={{ fontSize: 11, color: "#92400E" }}>
// //                       ⚠️ Debt auto-deducted from wallet when you fund
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>
// //             )}
// //           </View>
// //         )}

// //         {/* Summary */}
// //         {meterInfo && isValidPurchase && (
// //           <View
// //             style={{
// //               backgroundColor: "#F8FAFC",
// //               borderRadius: 16,
// //               padding: 16,
// //               marginBottom: 20,
// //               borderWidth: 1,
// //               borderColor: "#E2E8F0",
// //             }}
// //           >
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "700",
// //                 color: "#374151",
// //                 marginBottom: 12,
// //               }}
// //             >
// //               Summary
// //             </Text>

// //             {totals.walletUnits > 0 && (
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 <Text style={{ fontSize: 13, color: "#6B7280" }}>
// //                   💰 {totals.walletUnits} × ₦{NORMAL_PRICE}
// //                 </Text>
// //                 <Text
// //                   style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}
// //                 >
// //                   ₦{totals.walletCost.toLocaleString()}
// //                 </Text>
// //               </View>
// //             )}

// //             {useEmergency && (
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 <Text style={{ fontSize: 13, color: "#F59E0B" }}>
// //                   ⚡ {EMERGENCY_UNITS} units
// //                 </Text>
// //                 <Text
// //                   style={{ fontSize: 13, fontWeight: "600", color: "#F59E0B" }}
// //                 >
// //                   ₦{EMERGENCY_DEBT.toLocaleString()}
// //                 </Text>
// //               </View>
// //             )}

// //             <View
// //               style={{
// //                 height: 1,
// //                 backgroundColor: "#E5E7EB",
// //                 marginVertical: 10,
// //               }}
// //             />

// //             <View
// //               style={{
// //                 flexDirection: "row",
// //                 justifyContent: "space-between",
// //                 marginBottom: 4,
// //               }}
// //             >
// //               <Text
// //                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
// //               >
// //                 Total:
// //               </Text>
// //               <Text
// //                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
// //               >
// //                 {totals.totalUnits} kWh
// //               </Text>
// //             </View>

// //             <View
// //               style={{
// //                 flexDirection: "row",
// //                 justifyContent: "space-between",
// //                 marginBottom: 4,
// //               }}
// //             >
// //               <Text
// //                 style={{ fontSize: 14, fontWeight: "600", color: "#059669" }}
// //               >
// //                 Pay Now:
// //               </Text>
// //               <Text
// //                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
// //               >
// //                 ₦{totals.payNow.toLocaleString()}
// //               </Text>
// //             </View>

// //             {useEmergency && (
// //               <View
// //                 style={{
// //                   flexDirection: "row",
// //                   justifyContent: "space-between",
// //                 }}
// //               >
// //                 <Text
// //                   style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}
// //                 >
// //                   Will Owe:
// //                 </Text>
// //                 <Text
// //                   style={{ fontSize: 14, fontWeight: "700", color: "#DC2626" }}
// //                 >
// //                   ₦{totals.oweAfter.toLocaleString()}
// //                 </Text>
// //               </View>
// //             )}
// //           </View>
// //         )}

// //         {/* Buy Button */}
// //         {meterInfo && isValidPurchase && (
// //           <TouchableOpacity
// //             onPress={handlePayment}
// //             disabled={isBuying}
// //             style={{
// //               backgroundColor: isBuying
// //                 ? "#9CA3AF"
// //                 : useEmergency
// //                 ? "#F59E0B"
// //                 : "#3B82F6",
// //               borderRadius: 16,
// //               paddingVertical: 18,
// //               elevation: 5,
// //             }}
// //           >
// //             {isBuying ? (
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
// //               <View>
// //                 <Text
// //                   style={{
// //                     color: "#fff",
// //                     textAlign: "center",
// //                     fontSize: 18,
// //                     fontWeight: "700",
// //                   }}
// //                 >
// //                   ⚡ Buy {totals.totalUnits} Units
// //                 </Text>
// //                 <Text
// //                   style={{
// //                     color: "rgba(255,255,255,0.8)",
// //                     textAlign: "center",
// //                     fontSize: 12,
// //                     marginTop: 4,
// //                   }}
// //                 >
// //                   Pay ₦{totals.payNow.toLocaleString()}
// //                   {useEmergency &&
// //                     ` • Owe ₦${totals.oweAfter.toLocaleString()}`}
// //                 </Text>
// //               </View>
// //             )}
// //           </TouchableOpacity>
// //         )}
// //       </>
// //     );
// //   };

// //   return (
// //     <ScreenWrapper
// //       title="Buy Electricity ⚡"
// //       navigation={navigation}
// //       headerStyle={{ backgroundColor: "white" }}
// //     >
// //       <ScrollView
// //         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
// //         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
// //       >
// //         {renderWalletCard()}
// //         {renderDebtWarning()}
// //         {renderEmergencyStatusCard()}
// //         {renderPurchaseForm()}

// //         {!meterInfo && !hasDebt && (
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
// //               💡 Enter meter ID to continue
// //             </Text>
// //           </View>
// //         )}

// //         <View style={{ marginTop: 20 }}>
// //           <Text style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}>
// //             Wallet: ₦{NORMAL_PRICE}/unit • Emergency: {EMERGENCY_UNITS} units =
// //             ₦{EMERGENCY_DEBT.toLocaleString()}
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
//   Switch,
// } from "react-native";
// import { useSelector } from "react-redux";
// import { useFetchData, useMutateData } from "../../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";
// import ScreenWrapper from "../../../components/shared/ScreenWrapper";

// const ElectricityPaymentScreen = () => {
//   const { user_data } = useSelector((state) => state.AuthSlice);
//   const navigation = useNavigation();

//   const [meterId, setMeterId] = useState("");
//   const [walletUnits, setWalletUnits] = useState("");
//   const [useEmergency, setUseEmergency] = useState(false);
//   const [meterInfo, setMeterInfo] = useState(null);
//   const scaleAnim = useState(new Animated.Value(1))[0];

//   // Constants
//   const NORMAL_PRICE = 260;
//   const EMERGENCY_UNITS = 38;
//   const EMERGENCY_DEBT = 10000;
//   const MIN_UNITS = 1;
//   const MAX_UNITS = 500;

//   // Service charge constants
//   const SERVICE_CHARGE = 200;
//   const SERVICE_CHARGE_DISCOUNT = 100; // 100% discount

//   // Fetch emergency status
//   const {
//     data: statusResponse,
//     isLoading: isLoadingStatus,
//     refetch: refetchStatus,
//   } = useFetchData("api/captainv4/emergency-status", "emergency-status");

//   const statusData = statusResponse?.data || {
//     walletBalance: 0,
//     maxWalletUnits: 0,
//     normalPricePerUnit: 260,
//     isEligible: false,
//     hasAccount: false,
//     eligibilityProgress: {
//       current: 0,
//       required: 100000,
//       remaining: 100000,
//       percentage: 0,
//     },
//     emergency: null,
//   };

//   // Mutations
//   const { mutate: checkMeter, isLoading: checkMeterIsPending } = useMutateData(
//     "api/captain/vend",
//     "POST",
//     "billpayment"
//   );

//   const { mutate: buyElectricity, isLoading: isBuying } = useMutateData(
//     "api/captainv4/buy/v4",
//     "POST",
//     "buy-electricity"
//   );

//   const [triggerPayDebt, setTriggerPayDebt] = useState(false);

//   const {
//     data: payDebtResponse,
//     isLoading: isPayingDebt,
//     refetch: refetchPayDebt,
//   } = useFetchData("api/captainv4/paydebt", "pay-debt", { enabled: false });

//   // Calculate totals
//   const calculateTotals = () => {
//     const walletUnitsNum = Number(walletUnits) || 0;
//     const emergencyUnitsNum = useEmergency ? EMERGENCY_UNITS : 0;
//     const totalUnits = walletUnitsNum + emergencyUnitsNum;
//     const walletCost = walletUnitsNum * NORMAL_PRICE;
//     const emergencyCost = useEmergency ? EMERGENCY_DEBT : 0;

//     // Service charge calculation
//     const serviceChargeOriginal = SERVICE_CHARGE;
//     const serviceChargeDiscount =
//       (SERVICE_CHARGE * SERVICE_CHARGE_DISCOUNT) / 100;
//     const serviceChargeFinal = serviceChargeOriginal - serviceChargeDiscount; // = 0

//     return {
//       walletUnits: walletUnitsNum,
//       emergencyUnits: emergencyUnitsNum,
//       totalUnits,
//       walletCost,
//       emergencyCost,
//       serviceChargeOriginal,
//       serviceChargeDiscount,
//       serviceChargeFinal,
//       payNow: walletCost + serviceChargeFinal, // Service charge is ₦0 after discount
//       oweAfter: emergencyCost,
//     };
//   };

//   const handleCheckMeter = () => {
//     if (!meterId || meterId.length !== 11 || !/^\d+$/.test(meterId)) {
//       Alert.alert("Error", "Please enter a valid 11-digit meter ID");
//       return;
//     }

//     checkMeter(
//       { meterId },
//       {
//         onSuccess: (response) => {
//           if (!response?.data || !response.data[0]) {
//             Alert.alert("Error", "No meter information found");
//             return;
//           }
//           setMeterInfo(response.data[0]);
//           Animated.sequence([
//             Animated.timing(scaleAnim, {
//               toValue: 1.1,
//               duration: 200,
//               useNativeDriver: true,
//             }),
//             Animated.timing(scaleAnim, {
//               toValue: 1,
//               duration: 200,
//               useNativeDriver: true,
//             }),
//           ]).start();
//           Alert.alert("Success", "Meter verified! ⚡");
//         },
//         onError: (error) => {
//           Alert.alert("Error", error?.message || "Failed to verify meter");
//           setMeterInfo(null);
//         },
//       }
//     );
//   };

//   const handlePayDebt = () => {
//     Alert.alert(
//       "Pay Debt",
//       `Deduct ₦${EMERGENCY_DEBT.toLocaleString()} from your wallet?`,
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Pay Now",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const result = await refetchPayDebt();
//               if (result.data?.success) {
//                 Alert.alert(
//                   "Debt Paid! ✅",
//                   `₦${result.data.data.debtPaid.toLocaleString()} deducted\n` +
//                     `${result.data.data.unitsRepaid} units restored\n` +
//                     `Wallet: ₦${result.data.data.newWalletBalance.toLocaleString()}`
//                 );
//                 refetchStatus();
//               }
//             } catch (error) {
//               Alert.alert("Error", error.message || "Payment failed");
//             }
//           },
//         },
//       ]
//     );
//   };

//   const handlePayment = () => {
//     const totals = calculateTotals();

//     if (!meterId || !meterInfo) {
//       Alert.alert("Error", "Please verify the meter first");
//       return;
//     }

//     if (totals.totalUnits < MIN_UNITS) {
//       Alert.alert("Error", `Minimum purchase is ${MIN_UNITS} unit`);
//       return;
//     }

//     if (totals.totalUnits > MAX_UNITS) {
//       Alert.alert("Error", `Maximum purchase is ${MAX_UNITS} units`);
//       return;
//     }

//     if (totals.walletUnits > statusData.maxWalletUnits) {
//       Alert.alert("Error", `Max wallet units: ${statusData.maxWalletUnits}`);
//       return;
//     }

//     let msg = `Buy ${totals.totalUnits} units?\n\n`;
//     if (totals.walletUnits > 0) {
//       msg += `💰 Wallet: ${
//         totals.walletUnits
//       } units = ₦${totals.walletCost.toLocaleString()}\n`;
//     }
//     if (useEmergency) {
//       msg += `⚡ Emergency: ${EMERGENCY_UNITS} units = ₦${EMERGENCY_DEBT.toLocaleString()} (owed)\n`;
//     }
//     msg += `🎁 Service Charge: ₦0 (100% OFF!)\n`;
//     msg += `\nPay Now: ₦${totals.payNow.toLocaleString()}`;
//     if (useEmergency) {
//       msg += `\nWill Owe: ₦${totals.oweAfter.toLocaleString()}`;
//     }

//     Alert.alert("Confirm", msg, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Buy",
//         onPress: () => {
//           buyElectricity(
//             {
//               meterId,
//               units: totals.walletUnits,
//               useEmergency: useEmergency,
//             },
//             {
//               onSuccess: (data) => {
//                 let successMsg = `Token: ${data.data.token}\nUnits: ${data.data.totalUnits} kWh`;
//                 if (data.data.emergencyUnits > 0) {
//                   successMsg += `\n\nDebt: ₦${data.data.emergencyAmountOwed.toLocaleString()}`;
//                 }
//                 successMsg += `\nWallet: ₦${data.data.newWalletBalance.toLocaleString()}`;

//                 Alert.alert("Success! 🎉", successMsg, [
//                   { text: "OK", onPress: () => navigation.goBack() },
//                 ]);
//                 refetchStatus();
//               },
//               onError: (error) => {
//                 Alert.alert("Error", error.message || "Purchase failed");
//               },
//             }
//           );
//         },
//       },
//     ]);
//   };

//   const handleMeterIdChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
//     setMeterId(numericText);
//     if (meterInfo) setMeterInfo(null);
//   };

//   const handleWalletUnitsChange = (text) => {
//     const numericText = text.replace(/[^0-9]/g, "");
//     const num = Number(numericText) || 0;
//     if (numericText === "" || num <= statusData.maxWalletUnits) {
//       setWalletUnits(numericText);
//     }
//   };

//   const totals = calculateTotals();
//   const isValidPurchase =
//     totals.totalUnits >= MIN_UNITS && totals.totalUnits <= MAX_UNITS;
//   const hasDebt = statusData.emergency?.hasDebt || false;
//   const canUseEmergency = statusData.emergency?.canUse || false;
//   const canPayDebt = hasDebt && statusData.walletBalance >= EMERGENCY_DEBT;

//   // ==================== RENDER ====================

//   const renderWalletCard = () => (
//     <View
//       style={{
//         backgroundColor: "#EFF6FF",
//         borderRadius: 16,
//         padding: 16,
//         marginBottom: 20,
//       }}
//     >
//       <View
//         style={{
//           flexDirection: "row",
//           alignItems: "center",
//           justifyContent: "space-between",
//         }}
//       >
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <Text style={{ fontSize: 24, marginRight: 12 }}>💰</Text>
//           <View>
//             <Text style={{ fontSize: 11, color: "#6B7280" }}>
//               Wallet Balance
//             </Text>
//             <Text style={{ fontSize: 20, fontWeight: "700", color: "#1E40AF" }}>
//               ₦{(statusData.walletBalance || 0).toLocaleString()}
//             </Text>
//             <Text style={{ fontSize: 11, color: "#6B7280" }}>
//               Max {statusData.maxWalletUnits || 0} units
//             </Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           onPress={() => refetchStatus()}
//           style={{
//             backgroundColor: "#DBEAFE",
//             borderRadius: 8,
//             paddingHorizontal: 12,
//             paddingVertical: 8,
//           }}
//         >
//           <Text style={{ fontSize: 12, color: "#1E40AF", fontWeight: "600" }}>
//             Refresh
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   const renderDebtWarning = () => {
//     if (!hasDebt) return null;
//     const shortfall = EMERGENCY_DEBT - statusData.walletBalance;

//     return (
//       <View
//         style={{
//           backgroundColor: "#FEE2E2",
//           borderRadius: 16,
//           padding: 20,
//           marginBottom: 20,
//           borderLeftWidth: 4,
//           borderLeftColor: "#DC2626",
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 12,
//           }}
//         >
//           <Text style={{ fontSize: 24, marginRight: 10 }}>🔒</Text>
//           <Text style={{ fontSize: 16, fontWeight: "700", color: "#DC2626" }}>
//             Purchases Locked
//           </Text>
//         </View>

//         <Text style={{ fontSize: 14, color: "#7F1D1D", marginBottom: 12 }}>
//           Clear your ₦{EMERGENCY_DEBT.toLocaleString()} debt to continue.
//         </Text>

//         <View
//           style={{
//             backgroundColor: "#FECACA",
//             borderRadius: 12,
//             padding: 12,
//             marginBottom: 16,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               marginBottom: 8,
//             }}
//           >
//             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Debt:</Text>
//             <Text style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}>
//               ₦{EMERGENCY_DEBT.toLocaleString()}
//             </Text>
//           </View>
//           <View
//             style={{
//               flexDirection: "row",
//               justifyContent: "space-between",
//               marginBottom: shortfall > 0 ? 8 : 0,
//             }}
//           >
//             <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Wallet:</Text>
//             <Text style={{ fontSize: 13, fontWeight: "700", color: "#7F1D1D" }}>
//               ₦{statusData.walletBalance.toLocaleString()}
//             </Text>
//           </View>
//           {shortfall > 0 && (
//             <View
//               style={{ flexDirection: "row", justifyContent: "space-between" }}
//             >
//               <Text style={{ fontSize: 13, color: "#7F1D1D" }}>Need:</Text>
//               <Text
//                 style={{ fontSize: 13, fontWeight: "700", color: "#DC2626" }}
//               >
//                 ₦{shortfall.toLocaleString()}
//               </Text>
//             </View>
//           )}
//         </View>

//         {canPayDebt ? (
//           <TouchableOpacity
//             onPress={handlePayDebt}
//             disabled={isPayingDebt}
//             style={{
//               backgroundColor: isPayingDebt ? "#9CA3AF" : "#059669",
//               borderRadius: 12,
//               paddingVertical: 14,
//               alignItems: "center",
//             }}
//           >
//             {isPayingDebt ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <>
//                 <Text
//                   style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}
//                 >
//                   ✓ Pay ₦{EMERGENCY_DEBT.toLocaleString()} Now
//                 </Text>
//                 <Text
//                   style={{
//                     color: "rgba(255,255,255,0.8)",
//                     fontSize: 12,
//                     marginTop: 2,
//                   }}
//                 >
//                   Deduct from wallet
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <View
//             style={{
//               backgroundColor: "#FCA5A5",
//               borderRadius: 12,
//               paddingVertical: 14,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ color: "#7F1D1D", fontWeight: "600", fontSize: 14 }}>
//               ❌ Insufficient Balance
//             </Text>
//             <Text style={{ color: "#7F1D1D", fontSize: 12, marginTop: 2 }}>
//               Fund ₦{shortfall.toLocaleString()} more
//             </Text>
//           </View>
//         )}
//       </View>
//     );
//   };

//   const renderEmergencyStatusCard = () => {
//     if (isLoadingStatus) {
//       return (
//         <View
//           style={{
//             backgroundColor: "#F3F4F6",
//             borderRadius: 16,
//             padding: 20,
//             marginBottom: 20,
//             alignItems: "center",
//           }}
//         >
//           <ActivityIndicator size="small" color="#6B7280" />
//         </View>
//       );
//     }

//     if (!statusData.isEligible) {
//       const progress = statusData.eligibilityProgress;
//       return (
//         <View
//           style={{
//             backgroundColor: "#F3F4F6",
//             borderRadius: 16,
//             padding: 16,
//             marginBottom: 20,
//           }}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               alignItems: "center",
//               marginBottom: 12,
//             }}
//           >
//             <Text style={{ fontSize: 20, marginRight: 8 }}>🔒</Text>
//             <Text style={{ fontSize: 14, fontWeight: "700", color: "#374151" }}>
//               Unlock Emergency Units
//             </Text>
//           </View>
//           <View
//             style={{
//               height: 10,
//               backgroundColor: "#E5E7EB",
//               borderRadius: 5,
//               overflow: "hidden",
//               marginBottom: 8,
//             }}
//           >
//             <View
//               style={{
//                 height: "100%",
//                 width: `${progress?.percentage || 0}%`,
//                 backgroundColor: "#3B82F6",
//                 borderRadius: 5,
//               }}
//             />
//           </View>
//           <View
//             style={{ flexDirection: "row", justifyContent: "space-between" }}
//           >
//             <Text style={{ fontSize: 11, color: "#6B7280" }}>
//               ₦{(progress?.current || 0).toLocaleString()}
//             </Text>
//             <Text style={{ fontSize: 11, color: "#6B7280" }}>
//               ₦{(progress?.required || 100000).toLocaleString()}
//             </Text>
//           </View>
//           <Text
//             style={{
//               fontSize: 12,
//               color: "#6B7280",
//               marginTop: 10,
//               textAlign: "center",
//             }}
//           >
//             Spend ₦{(progress?.remaining || 0).toLocaleString()} more to unlock
//           </Text>
//         </View>
//       );
//     }

//     return (
//       <View
//         style={{
//           backgroundColor: canUseEmergency ? "#ECFDF5" : "#FEF3C7",
//           borderRadius: 16,
//           padding: 16,
//           marginBottom: 20,
//           borderLeftWidth: 4,
//           borderLeftColor: canUseEmergency ? "#10B981" : "#F59E0B",
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             marginBottom: 8,
//           }}
//         >
//           <Text style={{ fontSize: 20, marginRight: 8 }}>⚡</Text>
//           <Text
//             style={{
//               fontSize: 14,
//               fontWeight: "700",
//               color: canUseEmergency ? "#065F46" : "#92400E",
//             }}
//           >
//             Emergency: {EMERGENCY_UNITS} units = ₦
//             {EMERGENCY_DEBT.toLocaleString()}
//           </Text>
//         </View>
//         <Text style={{ fontSize: 12, color: "#6B7280" }}>
//           {canUseEmergency
//             ? "Available to use"
//             : "Currently in use (pay debt first)"}
//         </Text>
//       </View>
//     );
//   };

//   const renderPurchaseForm = () => {
//     if (hasDebt) return null;

//     return (
//       <>
//         {/* Meter Input */}
//         <View
//           style={{
//             backgroundColor: "white",
//             borderRadius: 20,
//             padding: 20,
//             marginBottom: 20,
//             elevation: 3,
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
//             🔢 Meter ID
//           </Text>
//           <View style={{ flexDirection: "row", marginBottom: 8 }}>
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
//                 disabled={checkMeterIsPending}
//                 style={{
//                   backgroundColor: checkMeterIsPending ? "#9CA3AF" : "#3B82F6",
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   justifyContent: "center",
//                 }}
//               >
//                 {checkMeterIsPending ? (
//                   <ActivityIndicator color="#fff" size="small" />
//                 ) : (
//                   <Text style={{ color: "#fff", fontWeight: "700" }}>
//                     Verify
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             )}
//           </View>
//           {meterId.length > 0 && meterId.length !== 11 && (
//             <Text style={{ color: "#F59E0B", fontSize: 12 }}>
//               ⚠️ {meterId.length}/11 digits
//             </Text>
//           )}
//         </View>

//         {/* Meter Info */}
//         {meterInfo && (
//           <Animated.View
//             style={{
//               transform: [{ scale: scaleAnim }],
//               backgroundColor: "#ECFDF5",
//               borderRadius: 16,
//               padding: 16,
//               marginBottom: 20,
//               borderLeftWidth: 4,
//               borderLeftColor: "#10B981",
//             }}
//           >
//             <View style={{ flexDirection: "row", alignItems: "center" }}>
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
//                 <Text style={{ fontSize: 18, color: "#fff" }}>✓</Text>
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text
//                   style={{
//                     fontSize: 14,
//                     fontWeight: "700",
//                     color: "#065F46",
//                     marginBottom: 4,
//                   }}
//                 >
//                   Meter Verified!
//                 </Text>
//                 <Text style={{ fontSize: 13, color: "#374151" }}>
//                   {meterInfo?.Customer_name}
//                 </Text>
//                 <Text style={{ fontSize: 11, color: "#6B7280" }}>
//                   {meterInfo?.Customer_address}
//                 </Text>
//               </View>
//             </View>
//           </Animated.View>
//         )}

//         {/* Units Input */}
//         {meterInfo && (
//           <View
//             style={{
//               backgroundColor: "white",
//               borderRadius: 20,
//               padding: 20,
//               marginBottom: 20,
//               elevation: 3,
//             }}
//           >
//             {/* Wallet Units */}
//             <View style={{ marginBottom: 20 }}>
//               <Text
//                 style={{
//                   fontSize: 14,
//                   fontWeight: "600",
//                   color: "#374151",
//                   marginBottom: 8,
//                 }}
//               >
//                 💰 Units from Wallet (₦{NORMAL_PRICE}/unit)
//               </Text>
//               <TextInput
//                 value={walletUnits}
//                 onChangeText={handleWalletUnitsChange}
//                 placeholder="0"
//                 keyboardType="numeric"
//                 style={{
//                   borderWidth: 2,
//                   borderColor: walletUnits ? "#3B82F6" : "#E5E7EB",
//                   borderRadius: 12,
//                   paddingHorizontal: 16,
//                   paddingVertical: 14,
//                   fontSize: 24,
//                   fontWeight: "bold",
//                   textAlign: "center",
//                   backgroundColor: "#F9FAFB",
//                 }}
//               />
//               <Text
//                 style={{
//                   fontSize: 11,
//                   color: "#6B7280",
//                   marginTop: 6,
//                   textAlign: "center",
//                 }}
//               >
//                 Max: {statusData.maxWalletUnits || 0} units
//               </Text>

//               {/* Quick Select */}
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginTop: 10,
//                   gap: 8,
//                 }}
//               >
//                 {[5, 10, 20, statusData.maxWalletUnits || 0]
//                   .filter(
//                     (v, i, a) =>
//                       a.indexOf(v) === i &&
//                       v > 0 &&
//                       v <= (statusData.maxWalletUnits || 0)
//                   )
//                   .slice(0, 4)
//                   .map((unit) => (
//                     <TouchableOpacity
//                       key={unit}
//                       onPress={() => setWalletUnits(unit.toString())}
//                       style={{
//                         flex: 1,
//                         backgroundColor:
//                           walletUnits === unit.toString()
//                             ? "#3B82F6"
//                             : "#F3F4F6",
//                         borderRadius: 8,
//                         paddingVertical: 8,
//                         alignItems: "center",
//                       }}
//                     >
//                       <Text
//                         style={{
//                           fontSize: 12,
//                           fontWeight: "600",
//                           color:
//                             walletUnits === unit.toString()
//                               ? "#fff"
//                               : "#374151",
//                         }}
//                       >
//                         {unit}
//                       </Text>
//                     </TouchableOpacity>
//                   ))}
//               </View>
//             </View>

//             {/* Emergency Toggle */}
//             {statusData.isEligible && canUseEmergency && (
//               <View
//                 style={{
//                   backgroundColor: useEmergency ? "#FEF3C7" : "#F9FAFB",
//                   borderRadius: 12,
//                   padding: 16,
//                   borderWidth: 2,
//                   borderColor: useEmergency ? "#F59E0B" : "#E5E7EB",
//                 }}
//               >
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <View style={{ flex: 1 }}>
//                     <Text
//                       style={{
//                         fontSize: 14,
//                         fontWeight: "600",
//                         color: "#374151",
//                       }}
//                     >
//                       ⚡ Add Emergency Units
//                     </Text>
//                     <Text
//                       style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
//                     >
//                       {EMERGENCY_UNITS} units • ₦
//                       {EMERGENCY_DEBT.toLocaleString()} debt
//                     </Text>
//                   </View>
//                   <Switch
//                     value={useEmergency}
//                     onValueChange={setUseEmergency}
//                     trackColor={{ false: "#E5E7EB", true: "#FCD34D" }}
//                     thumbColor={useEmergency ? "#F59E0B" : "#9CA3AF"}
//                   />
//                 </View>
//                 {useEmergency && (
//                   <View
//                     style={{
//                       backgroundColor: "#FEF3C7",
//                       borderRadius: 8,
//                       padding: 8,
//                       marginTop: 12,
//                     }}
//                   >
//                     <Text style={{ fontSize: 11, color: "#92400E" }}>
//                       ⚠️ Debt auto-deducted from wallet when you fund
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             )}
//           </View>
//         )}

//         {/* Summary */}
//         {meterInfo && isValidPurchase && (
//           <View
//             style={{
//               backgroundColor: "#F8FAFC",
//               borderRadius: 16,
//               padding: 16,
//               marginBottom: 20,
//               borderWidth: 1,
//               borderColor: "#E2E8F0",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 14,
//                 fontWeight: "700",
//                 color: "#374151",
//                 marginBottom: 12,
//               }}
//             >
//               Summary
//             </Text>

//             {totals.walletUnits > 0 && (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginBottom: 8,
//                 }}
//               >
//                 <Text style={{ fontSize: 13, color: "#6B7280" }}>
//                   💰 {totals.walletUnits} × ₦{NORMAL_PRICE}
//                 </Text>
//                 <Text
//                   style={{ fontSize: 13, fontWeight: "600", color: "#374151" }}
//                 >
//                   ₦{totals.walletCost.toLocaleString()}
//                 </Text>
//               </View>
//             )}

//             {useEmergency && (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   marginBottom: 8,
//                 }}
//               >
//                 <Text style={{ fontSize: 13, color: "#F59E0B" }}>
//                   ⚡ {EMERGENCY_UNITS} units
//                 </Text>
//                 <Text
//                   style={{ fontSize: 13, fontWeight: "600", color: "#F59E0B" }}
//                 >
//                   ₦{EMERGENCY_DEBT.toLocaleString()}
//                 </Text>
//               </View>
//             )}

//             {/* Service Charge with Discount */}
//             <View
//               style={{
//                 backgroundColor: "#ECFDF5",
//                 borderRadius: 8,
//                 padding: 10,
//                 marginBottom: 8,
//                 borderWidth: 1,
//                 borderColor: "#A7F3D0",
//                 borderStyle: "dashed",
//               }}
//             >
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   alignItems: "center",
//                 }}
//               >
//                 <View style={{ flexDirection: "row", alignItems: "center" }}>
//                   <Text style={{ fontSize: 13, color: "#6B7280" }}>
//                     🎁 Service Charge
//                   </Text>
//                   <View
//                     style={{
//                       backgroundColor: "#10B981",
//                       borderRadius: 4,
//                       paddingHorizontal: 6,
//                       paddingVertical: 2,
//                       marginLeft: 8,
//                     }}
//                   >
//                     <Text
//                       style={{
//                         fontSize: 10,
//                         fontWeight: "700",
//                         color: "#fff",
//                       }}
//                     >
//                       100% OFF
//                     </Text>
//                   </View>
//                 </View>
//                 <View style={{ alignItems: "flex-end" }}>
//                   <Text
//                     style={{
//                       fontSize: 11,
//                       color: "#9CA3AF",
//                       textDecorationLine: "line-through",
//                     }}
//                   >
//                     ₦{SERVICE_CHARGE.toLocaleString()}
//                   </Text>
//                   <Text
//                     style={{
//                       fontSize: 13,
//                       fontWeight: "700",
//                       color: "#10B981",
//                     }}
//                   >
//                     ₦0
//                   </Text>
//                 </View>
//               </View>
//               <Text
//                 style={{
//                   fontSize: 10,
//                   color: "#059669",
//                   marginTop: 4,
//                   fontStyle: "italic",
//                 }}
//               >
//                 You save ₦{SERVICE_CHARGE.toLocaleString()}! 🎉
//               </Text>
//             </View>

//             <View
//               style={{
//                 height: 1,
//                 backgroundColor: "#E5E7EB",
//                 marginVertical: 10,
//               }}
//             />

//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginBottom: 4,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
//               >
//                 Total:
//               </Text>
//               <Text
//                 style={{ fontSize: 15, fontWeight: "700", color: "#1F2937" }}
//               >
//                 {totals.totalUnits} kWh
//               </Text>
//             </View>

//             <View
//               style={{
//                 flexDirection: "row",
//                 justifyContent: "space-between",
//                 marginBottom: 4,
//               }}
//             >
//               <Text
//                 style={{ fontSize: 14, fontWeight: "600", color: "#059669" }}
//               >
//                 Pay Now:
//               </Text>
//               <Text
//                 style={{ fontSize: 14, fontWeight: "700", color: "#059669" }}
//               >
//                 ₦{totals.payNow.toLocaleString()}
//               </Text>
//             </View>

//             {useEmergency && (
//               <View
//                 style={{
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <Text
//                   style={{ fontSize: 14, fontWeight: "600", color: "#DC2626" }}
//                 >
//                   Will Owe:
//                 </Text>
//                 <Text
//                   style={{ fontSize: 14, fontWeight: "700", color: "#DC2626" }}
//                 >
//                   ₦{totals.oweAfter.toLocaleString()}
//                 </Text>
//               </View>
//             )}
//           </View>
//         )}

//         {/* Buy Button */}
//         {meterInfo && isValidPurchase && (
//           <TouchableOpacity
//             onPress={handlePayment}
//             disabled={isBuying}
//             style={{
//               backgroundColor: isBuying
//                 ? "#9CA3AF"
//                 : useEmergency
//                 ? "#F59E0B"
//                 : "#3B82F6",
//               borderRadius: 16,
//               paddingVertical: 18,
//               elevation: 5,
//             }}
//           >
//             {isBuying ? (
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
//               <View>
//                 <Text
//                   style={{
//                     color: "#fff",
//                     textAlign: "center",
//                     fontSize: 18,
//                     fontWeight: "700",
//                   }}
//                 >
//                   ⚡ Buy {totals.totalUnits} Units
//                 </Text>
//                 <Text
//                   style={{
//                     color: "rgba(255,255,255,0.8)",
//                     textAlign: "center",
//                     fontSize: 12,
//                     marginTop: 4,
//                   }}
//                 >
//                   Pay ₦{totals.payNow.toLocaleString()}
//                   {useEmergency &&
//                     ` • Owe ₦${totals.oweAfter.toLocaleString()}`}
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         )}
//       </>
//     );
//   };

//   return (
//     <ScreenWrapper
//       title="Buy Electricity ⚡"
//       navigation={navigation}
//       headerStyle={{ backgroundColor: "white" }}
//     >
//       <ScrollView
//         style={{ flex: 1, backgroundColor: "#F8FAFC" }}
//         contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
//       >
//         {renderWalletCard()}
//         {renderDebtWarning()}
//         {renderEmergencyStatusCard()}
//         {renderPurchaseForm()}

//         {!meterInfo && !hasDebt && (
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
//               💡 Enter meter ID to continue
//             </Text>
//           </View>
//         )}

//         <View style={{ marginTop: 20 }}>
//           <Text style={{ textAlign: "center", fontSize: 11, color: "#9CA3AF" }}>
//             Wallet: ₦{NORMAL_PRICE}/unit • Emergency: {EMERGENCY_UNITS} units =
//             ₦{EMERGENCY_DEBT.toLocaleString()}
//           </Text>
//           <Text
//             style={{
//               textAlign: "center",
//               fontSize: 10,
//               color: "#10B981",
//               marginTop: 4,
//               fontWeight: "600",
//             }}
//           >
//             🎁 Service Charge: FREE (100% discount applied!)
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
  const [useEmergency, setUseEmergency] = useState(false);
  const [meterInfo, setMeterInfo] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Constants
  const NORMAL_PRICE = 260;
  const EMERGENCY_UNITS = 38;
  const EMERGENCY_DEBT = 10000;
  const MIN_UNITS = 1;
  const MAX_UNITS = 500;

  // Service charge constants
  const SERVICE_CHARGE = 250;
  const SERVICE_CHARGE_DISCOUNT = 100; // 100% discount

  // Fetch emergency status
  // Use both isLoading (first load) and isFetching (refetch) for spinner
  const {
    data: statusResponse,
    isLoading: isLoadingStatus,
    isFetching: isFetchingStatus,
    refetch: refetchStatus,
  } = useFetchData("api/captainv4/emergency-status", "emergency-status");

  // Combined loading state for status
  const isStatusLoading = isLoadingStatus || isFetchingStatus;

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

  // Mutations - use isPending (React Query v5) or isLoading (v4)
  const {
    mutate: checkMeter,
    isLoading: checkMeterLoading,
    isPending: checkMeterPending,
  } = useMutateData("api/captain/vend", "POST", "billpayment");
  const checkMeterIsPending = checkMeterPending ?? checkMeterLoading; // Support both v4 and v5

  const {
    mutate: buyElectricity,
    isLoading: buyLoading,
    isPending: buyPending,
  } = useMutateData("api/captainv4/buy/v4", "POST", "buy-electricity");
  const isBuying = buyPending ?? buyLoading; // Support both v4 and v5

  const {
    data: payDebtResponse,
    isLoading: payDebtLoading,
    isFetching: payDebtFetching,
    refetch: refetchPayDebt,
  } = useFetchData("api/captainv4/paydebt", "pay-debt", { enabled: false });
  const isPayingDebt = payDebtLoading || payDebtFetching;

  // Calculate totals
  const calculateTotals = () => {
    const walletUnitsNum = Number(walletUnits) || 0;
    const emergencyUnitsNum = useEmergency ? EMERGENCY_UNITS : 0;
    const totalUnits = walletUnitsNum + emergencyUnitsNum;
    const walletCost = walletUnitsNum * NORMAL_PRICE;
    const emergencyCost = useEmergency ? EMERGENCY_DEBT : 0;

    // Service charge calculation
    const serviceChargeOriginal = SERVICE_CHARGE;
    const serviceChargeDiscount =
      (SERVICE_CHARGE * SERVICE_CHARGE_DISCOUNT) / 100;
    const serviceChargeFinal = serviceChargeOriginal - serviceChargeDiscount; // = 0

    return {
      walletUnits: walletUnitsNum,
      emergencyUnits: emergencyUnitsNum,
      totalUnits,
      walletCost,
      emergencyCost,
      serviceChargeOriginal,
      serviceChargeDiscount,
      serviceChargeFinal,
      payNow: walletCost + serviceChargeFinal, // Service charge is ₦0 after discount
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
      }
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
                    `Wallet: ₦${result.data.data.newWalletBalance.toLocaleString()}`
                );
                refetchStatus();
              }
            } catch (error) {
              Alert.alert("Error", error.message || "Payment failed");
            }
          },
        },
      ]
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
    msg += `🎁 Service Charge: ₦0 (100% OFF!)\n`;
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
              units: totals.walletUnits,
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
            }
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
                  ₦{(statusData.walletBalance || 0).toLocaleString()}
                </Text>
                <Text style={{ fontSize: 11, color: "#6B7280" }}>
                  Max {statusData.maxWalletUnits || 0} units
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
                      v <= (statusData.maxWalletUnits || 0)
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

            {/* Service Charge with Discount */}
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
                      style={{
                        fontSize: 10,
                        fontWeight: "700",
                        color: "#fff",
                      }}
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
    </ScreenWrapper>
  );
};

export default ElectricityPaymentScreen;
