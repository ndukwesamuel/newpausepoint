// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   TextInput,
// //   Switch,
// //   ActivityIndicator,
// //   Alert,
// //   Platform,
// // } from "react-native";
// // import { Ionicons } from "@expo/vector-icons";
// // import { useMutateData } from "../../../../hooks/Requestv2";
// // import DateTimePicker from "@react-native-community/datetimepicker";

// // const EsusuCreateGroupScreen = ({ navigation }) => {
// //   const [formData, setFormData] = useState({
// //     name: "",
// //     description: "",
// //     contributionAmount: "",
// //     frequency: "monthly",
// //     startDate: new Date(),
// //     duration: "",
// //     maxMembers: "",
// //     rules: "",
// //     settings: {
// //       autoStart: true,
// //       allowEarlyPayout: false,
// //       penaltyForMissedContribution: "",
// //       requireApprovalToJoin: false,
// //       shufflePositions: false,
// //     },
// //   });

// //   const [showDatePicker, setShowDatePicker] = useState(false);
// //   const [errors, setErrors] = useState({});

// //   const { mutate: createGroup, isLoading } = useMutateData(
// //     "api/v1/esusu/ajo/my-groups",
// //     "POST",
// //     "esusuGroups",
// //     {
// //       onSuccess: (data) => {
// //         Alert.alert("Success", "Group created successfully!", [
// //           {
// //             text: "OK",
// //             onPress: () => navigation.goBack(),
// //           },
// //         ]);
// //       },
// //       onError: (error) => {
// //         console.log("Full Error Object:", error);
// //         console.log("Error Data:", error.data);
// //         console.log(
// //           "Error Data Stringified:",
// //           JSON.stringify(error.data, null, 2)
// //         );

// //         // Format all errors into a single message
// //         let errorMessage = "Failed to create group";

// //         if (error.data?.errors && Array.isArray(error.data.errors)) {
// //           errorMessage = error.data.errors
// //             .map((err) => `• ${err.message}`)
// //             .join("\n");
// //         } else if (error.data?.message) {
// //           errorMessage = error.data.message;
// //         }

// //         Alert.alert("Validation Error", errorMessage);
// //       },
// //     }
// //   );
// //   //   ```

// //   //   Now the alert will show all errors at once like:
// //   //   ```
// //   //   Validation Error
// //   //   - Start date cannot be in the past
// //   //   - Minimum 3 members required

// //   const frequencyOptions = [
// //     { label: "Daily", value: "daily" },
// //     { label: "Weekly", value: "weekly" },
// //     { label: "Monthly", value: "monthly" },
// //   ];

// //   const validateForm = () => {
// //     const newErrors = {};

// //     if (!formData.name.trim()) {
// //       newErrors.name = "Group name is required";
// //     }

// //     if (!formData.description.trim()) {
// //       newErrors.description = "Description is required";
// //     }

// //     if (
// //       !formData.contributionAmount ||
// //       parseFloat(formData.contributionAmount) <= 0
// //     ) {
// //       newErrors.contributionAmount = "Valid contribution amount is required";
// //     }

// //     if (!formData.duration || parseInt(formData.duration) <= 0) {
// //       newErrors.duration = "Valid duration is required";
// //     }

// //     if (!formData.maxMembers || parseInt(formData.maxMembers) <= 0) {
// //       newErrors.maxMembers = "Valid max members is required";
// //     }

// //     setErrors(newErrors);
// //     return Object.keys(newErrors).length === 0;
// //   };

// //   const handleSubmit = () => {
// //     if (!validateForm()) {
// //       Alert.alert(
// //         "Validation Error",
// //         "Please fill all required fields correctly"
// //       );
// //       return;
// //     }

// //     const payload = {
// //       name: formData.name.trim(),
// //       description: formData.description.trim(),
// //       contributionAmount: parseFloat(formData.contributionAmount),
// //       frequency: formData.frequency,
// //       startDate: formData.startDate.toISOString(),
// //       duration: parseInt(formData.duration),
// //       maxMembers: parseInt(formData.maxMembers),
// //       rules: formData.rules.trim() || "No specific rules set",
// //       settings: {
// //         ...formData.settings,
// //         penaltyForMissedContribution: parseFloat(
// //           formData.settings.penaltyForMissedContribution || 0
// //         ),
// //       },
// //     };

// //     createGroup(payload);
// //   };

// //   const updateFormData = (field, value) => {
// //     setFormData((prev) => ({ ...prev, [field]: value }));
// //     if (errors[field]) {
// //       setErrors((prev) => ({ ...prev, [field]: null }));
// //     }
// //   };

// //   const updateSettings = (field, value) => {
// //     setFormData((prev) => ({
// //       ...prev,
// //       settings: { ...prev.settings, [field]: value },
// //     }));
// //   };

// //   const onDateChange = (event, selectedDate) => {
// //     setShowDatePicker(Platform.OS === "ios");
// //     if (selectedDate) {
// //       updateFormData("startDate", selectedDate);
// //     }
// //   };

// //   const formatDate = (date) => {
// //     return date.toLocaleDateString("en-GB", {
// //       day: "2-digit",
// //       month: "short",
// //       year: "numeric",
// //     });
// //   };

// //   return (
// //     <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
// //       {/* Header */}
// //       <View
// //         style={{
// //           backgroundColor: "#8B5CF6",
// //           paddingTop: 60,
// //           paddingBottom: 20,
// //           paddingHorizontal: 20,
// //           flexDirection: "row",
// //           alignItems: "center",
// //         }}
// //       >
// //         <TouchableOpacity
// //           onPress={() => navigation.goBack()}
// //           style={{
// //             width: 40,
// //             height: 40,
// //             borderRadius: 20,
// //             backgroundColor: "rgba(255,255,255,0.2)",
// //             alignItems: "center",
// //             justifyContent: "center",
// //           }}
// //         >
// //           <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
// //         </TouchableOpacity>
// //         <Text
// //           style={{
// //             fontSize: 24,
// //             fontWeight: "bold",
// //             color: "#FFFFFF",
// //             marginLeft: 16,
// //           }}
// //         >
// //           Create New Group
// //         </Text>
// //       </View>

// //       <ScrollView
// //         style={{ flex: 1 }}
// //         contentContainerStyle={{
// //           paddingHorizontal: 20,
// //           paddingTop: 20,
// //           paddingBottom: 100,
// //         }}
// //       >
// //         {/* Basic Information Section */}
// //         <View
// //           style={{
// //             backgroundColor: "#FFFFFF",
// //             borderRadius: 16,
// //             padding: 20,
// //             marginBottom: 16,
// //             shadowColor: "#000",
// //             shadowOffset: { width: 0, height: 2 },
// //             shadowOpacity: 0.05,
// //             shadowRadius: 4,
// //             elevation: 2,
// //           }}
// //         >
// //           <Text
// //             style={{
// //               fontSize: 18,
// //               fontWeight: "700",
// //               color: "#1F2937",
// //               marginBottom: 16,
// //             }}
// //           >
// //             Basic Information
// //           </Text>

// //           {/* Group Name */}
// //           <View style={{ marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Group Name <Text style={{ color: "#EF4444" }}>*</Text>
// //             </Text>
// //             <TextInput
// //               value={formData.name}
// //               onChangeText={(text) => updateFormData("name", text)}
// //               placeholder="e.g., Friends Savings Circle"
// //               placeholderTextColor="#9CA3AF"
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: errors.name ? "#EF4444" : "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 fontSize: 16,
// //                 color: "#1F2937",
// //                 backgroundColor: "#FFFFFF",
// //               }}
// //             />
// //             {errors.name && (
// //               <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
// //                 {errors.name}
// //               </Text>
// //             )}
// //           </View>

// //           {/* Description */}
// //           <View style={{ marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Description <Text style={{ color: "#EF4444" }}>*</Text>
// //             </Text>
// //             <TextInput
// //               value={formData.description}
// //               onChangeText={(text) => updateFormData("description", text)}
// //               placeholder="Describe the purpose of this group"
// //               placeholderTextColor="#9CA3AF"
// //               multiline
// //               numberOfLines={3}
// //               textAlignVertical="top"
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: errors.description ? "#EF4444" : "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 fontSize: 16,
// //                 color: "#1F2937",
// //                 backgroundColor: "#FFFFFF",
// //                 minHeight: 80,
// //               }}
// //             />
// //             {errors.description && (
// //               <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
// //                 {errors.description}
// //               </Text>
// //             )}
// //           </View>

// //           {/* Rules */}
// //           <View>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Group Rules (Optional)
// //             </Text>
// //             <TextInput
// //               value={formData.rules}
// //               onChangeText={(text) => updateFormData("rules", text)}
// //               placeholder="e.g., Members must contribute on time..."
// //               placeholderTextColor="#9CA3AF"
// //               multiline
// //               numberOfLines={3}
// //               textAlignVertical="top"
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 fontSize: 16,
// //                 color: "#1F2937",
// //                 backgroundColor: "#FFFFFF",
// //                 minHeight: 80,
// //               }}
// //             />
// //           </View>
// //         </View>

// //         {/* Contribution Details Section */}
// //         <View
// //           style={{
// //             backgroundColor: "#FFFFFF",
// //             borderRadius: 16,
// //             padding: 20,
// //             marginBottom: 16,
// //             shadowColor: "#000",
// //             shadowOffset: { width: 0, height: 2 },
// //             shadowOpacity: 0.05,
// //             shadowRadius: 4,
// //             elevation: 2,
// //           }}
// //         >
// //           <Text
// //             style={{
// //               fontSize: 18,
// //               fontWeight: "700",
// //               color: "#1F2937",
// //               marginBottom: 16,
// //             }}
// //           >
// //             Contribution Details
// //           </Text>

// //           {/* Contribution Amount */}
// //           <View style={{ marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Contribution Amount (₦){" "}
// //               <Text style={{ color: "#EF4444" }}>*</Text>
// //             </Text>
// //             <TextInput
// //               value={formData.contributionAmount}
// //               onChangeText={(text) =>
// //                 updateFormData("contributionAmount", text)
// //               }
// //               placeholder="5000"
// //               placeholderTextColor="#9CA3AF"
// //               keyboardType="numeric"
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: errors.contributionAmount ? "#EF4444" : "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 fontSize: 16,
// //                 color: "#1F2937",
// //                 backgroundColor: "#FFFFFF",
// //               }}
// //             />
// //             {errors.contributionAmount && (
// //               <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
// //                 {errors.contributionAmount}
// //               </Text>
// //             )}
// //           </View>

// //           {/* Frequency */}
// //           <View style={{ marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Contribution Frequency <Text style={{ color: "#EF4444" }}>*</Text>
// //             </Text>
// //             <View style={{ flexDirection: "row", gap: 8 }}>
// //               {frequencyOptions.map((option) => (
// //                 <TouchableOpacity
// //                   key={option.value}
// //                   onPress={() => updateFormData("frequency", option.value)}
// //                   style={{
// //                     flex: 1,
// //                     paddingVertical: 14,
// //                     paddingHorizontal: 12,
// //                     borderRadius: 12,
// //                     borderWidth: 2,
// //                     borderColor:
// //                       formData.frequency === option.value
// //                         ? "#8B5CF6"
// //                         : "#E5E7EB",
// //                     backgroundColor:
// //                       formData.frequency === option.value
// //                         ? "#F3E8FF"
// //                         : "#FFFFFF",
// //                     alignItems: "center",
// //                   }}
// //                 >
// //                   <Text
// //                     style={{
// //                       fontSize: 14,
// //                       fontWeight: "600",
// //                       color:
// //                         formData.frequency === option.value
// //                           ? "#8B5CF6"
// //                           : "#6B7280",
// //                     }}
// //                   >
// //                     {option.label}
// //                   </Text>
// //                 </TouchableOpacity>
// //               ))}
// //             </View>
// //           </View>

// //           {/* Start Date */}
// //           <View style={{ marginBottom: 16 }}>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Start Date <Text style={{ color: "#EF4444" }}>*</Text>
// //             </Text>
// //             <TouchableOpacity
// //               onPress={() => setShowDatePicker(true)}
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 flexDirection: "row",
// //                 alignItems: "center",
// //                 justifyContent: "space-between",
// //                 backgroundColor: "#FFFFFF",
// //               }}
// //             >
// //               <Text style={{ fontSize: 16, color: "#1F2937" }}>
// //                 {formatDate(formData.startDate)}
// //               </Text>
// //               <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
// //             </TouchableOpacity>
// //           </View>

// //           {showDatePicker && (
// //             <DateTimePicker
// //               value={formData.startDate}
// //               mode="date"
// //               display="default"
// //               onChange={onDateChange}
// //               minimumDate={new Date()}
// //             />
// //           )}

// //           {/* Duration and Max Members Row */}
// //           <View style={{ flexDirection: "row", gap: 12 }}>
// //             {/* Duration */}
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{
// //                   fontSize: 14,
// //                   fontWeight: "600",
// //                   color: "#374151",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 Duration (Cycles) <Text style={{ color: "#EF4444" }}>*</Text>
// //               </Text>
// //               <TextInput
// //                 value={formData.duration}
// //                 onChangeText={(text) => updateFormData("duration", text)}
// //                 placeholder="10"
// //                 placeholderTextColor="#9CA3AF"
// //                 keyboardType="numeric"
// //                 style={{
// //                   borderWidth: 1,
// //                   borderColor: errors.duration ? "#EF4444" : "#E5E7EB",
// //                   borderRadius: 12,
// //                   paddingHorizontal: 16,
// //                   paddingVertical: 14,
// //                   fontSize: 16,
// //                   color: "#1F2937",
// //                   backgroundColor: "#FFFFFF",
// //                 }}
// //               />
// //               {errors.duration && (
// //                 <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
// //                   {errors.duration}
// //                 </Text>
// //               )}
// //             </View>

// //             {/* Max Members */}
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{
// //                   fontSize: 14,
// //                   fontWeight: "600",
// //                   color: "#374151",
// //                   marginBottom: 8,
// //                 }}
// //               >
// //                 Max Members <Text style={{ color: "#EF4444" }}>*</Text>
// //               </Text>
// //               <TextInput
// //                 value={formData.maxMembers}
// //                 onChangeText={(text) => updateFormData("maxMembers", text)}
// //                 placeholder="10"
// //                 placeholderTextColor="#9CA3AF"
// //                 keyboardType="numeric"
// //                 style={{
// //                   borderWidth: 1,
// //                   borderColor: errors.maxMembers ? "#EF4444" : "#E5E7EB",
// //                   borderRadius: 12,
// //                   paddingHorizontal: 16,
// //                   paddingVertical: 14,
// //                   fontSize: 16,
// //                   color: "#1F2937",
// //                   backgroundColor: "#FFFFFF",
// //                 }}
// //               />
// //               {errors.maxMembers && (
// //                 <Text style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>
// //                   {errors.maxMembers}
// //                 </Text>
// //               )}
// //             </View>
// //           </View>
// //         </View>

// //         {/* Settings Section */}
// //         <View
// //           style={{
// //             backgroundColor: "#FFFFFF",
// //             borderRadius: 16,
// //             padding: 20,
// //             marginBottom: 16,
// //             shadowColor: "#000",
// //             shadowOffset: { width: 0, height: 2 },
// //             shadowOpacity: 0.05,
// //             shadowRadius: 4,
// //             elevation: 2,
// //           }}
// //         >
// //           <Text
// //             style={{
// //               fontSize: 18,
// //               fontWeight: "700",
// //               color: "#1F2937",
// //               marginBottom: 16,
// //             }}
// //           >
// //             Group Settings
// //           </Text>

// //           {/* Auto Start */}
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginBottom: 16,
// //               paddingBottom: 16,
// //               borderBottomWidth: 1,
// //               borderBottomColor: "#F3F4F6",
// //             }}
// //           >
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}
// //               >
// //                 Auto Start
// //               </Text>
// //               <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
// //                 Group starts automatically when full
// //               </Text>
// //             </View>
// //             <Switch
// //               value={formData.settings.autoStart}
// //               onValueChange={(value) => updateSettings("autoStart", value)}
// //               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
// //               thumbColor={formData.settings.autoStart ? "#8B5CF6" : "#F3F4F6"}
// //             />
// //           </View>

// //           {/* Allow Early Payout */}
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginBottom: 16,
// //               paddingBottom: 16,
// //               borderBottomWidth: 1,
// //               borderBottomColor: "#F3F4F6",
// //             }}
// //           >
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}
// //               >
// //                 Allow Early Payout
// //               </Text>
// //               <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
// //                 Members can request early payout
// //               </Text>
// //             </View>
// //             <Switch
// //               value={formData.settings.allowEarlyPayout}
// //               onValueChange={(value) =>
// //                 updateSettings("allowEarlyPayout", value)
// //               }
// //               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
// //               thumbColor={
// //                 formData.settings.allowEarlyPayout ? "#8B5CF6" : "#F3F4F6"
// //               }
// //             />
// //           </View>

// //           {/* Require Approval */}
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginBottom: 16,
// //               paddingBottom: 16,
// //               borderBottomWidth: 1,
// //               borderBottomColor: "#F3F4F6",
// //             }}
// //           >
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}
// //               >
// //                 Require Approval to Join
// //               </Text>
// //               <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
// //                 New members need admin approval
// //               </Text>
// //             </View>
// //             <Switch
// //               value={formData.settings.requireApprovalToJoin}
// //               onValueChange={(value) =>
// //                 updateSettings("requireApprovalToJoin", value)
// //               }
// //               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
// //               thumbColor={
// //                 formData.settings.requireApprovalToJoin ? "#8B5CF6" : "#F3F4F6"
// //               }
// //             />
// //           </View>

// //           {/* Shuffle Positions */}
// //           <View
// //             style={{
// //               flexDirection: "row",
// //               justifyContent: "space-between",
// //               alignItems: "center",
// //               marginBottom: 16,
// //               paddingBottom: 16,
// //               borderBottomWidth: 1,
// //               borderBottomColor: "#F3F4F6",
// //             }}
// //           >
// //             <View style={{ flex: 1 }}>
// //               <Text
// //                 style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}
// //               >
// //                 Shuffle Positions
// //               </Text>
// //               <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
// //                 Randomly assign payout positions
// //               </Text>
// //             </View>
// //             <Switch
// //               value={formData.settings.shufflePositions}
// //               onValueChange={(value) =>
// //                 updateSettings("shufflePositions", value)
// //               }
// //               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
// //               thumbColor={
// //                 formData.settings.shufflePositions ? "#8B5CF6" : "#F3F4F6"
// //               }
// //             />
// //           </View>

// //           {/* Penalty Amount */}
// //           <View>
// //             <Text
// //               style={{
// //                 fontSize: 14,
// //                 fontWeight: "600",
// //                 color: "#374151",
// //                 marginBottom: 8,
// //               }}
// //             >
// //               Penalty for Missed Contribution (₦)
// //             </Text>
// //             <TextInput
// //               value={formData.settings.penaltyForMissedContribution}
// //               onChangeText={(text) =>
// //                 updateSettings("penaltyForMissedContribution", text)
// //               }
// //               placeholder="500"
// //               placeholderTextColor="#9CA3AF"
// //               keyboardType="numeric"
// //               style={{
// //                 borderWidth: 1,
// //                 borderColor: "#E5E7EB",
// //                 borderRadius: 12,
// //                 paddingHorizontal: 16,
// //                 paddingVertical: 14,
// //                 fontSize: 16,
// //                 color: "#1F2937",
// //                 backgroundColor: "#FFFFFF",
// //               }}
// //             />
// //           </View>
// //         </View>
// //       </ScrollView>

// //       {/* Create Button */}
// //       <View
// //         style={{
// //           position: "absolute",
// //           bottom: 0,
// //           left: 0,
// //           right: 0,
// //           backgroundColor: "#FFFFFF",
// //           paddingHorizontal: 20,
// //           paddingVertical: 16,
// //           borderTopWidth: 1,
// //           borderTopColor: "#E5E7EB",
// //         }}
// //       >
// //         <TouchableOpacity
// //           onPress={handleSubmit}
// //           disabled={isLoading}
// //           style={{
// //             backgroundColor: isLoading ? "#D1D5DB" : "#8B5CF6",
// //             flexDirection: "row",
// //             alignItems: "center",
// //             justifyContent: "center",
// //             paddingVertical: 16,
// //             borderRadius: 12,
// //             shadowColor: "#8B5CF6",
// //             shadowOffset: { width: 0, height: 4 },
// //             shadowOpacity: 0.3,
// //             shadowRadius: 8,
// //             elevation: 8,
// //           }}
// //         >
// //           {isLoading ? (
// //             <ActivityIndicator color="#FFFFFF" />
// //           ) : (
// //             <>
// //               <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
// //               <Text
// //                 style={{
// //                   color: "#FFFFFF",
// //                   fontSize: 16,
// //                   fontWeight: "700",
// //                   marginLeft: 8,
// //                 }}
// //               >
// //                 Create Group
// //               </Text>
// //             </>
// //           )}
// //         </TouchableOpacity>
// //       </View>
// //     </View>
// //   );
// // };

// // export default EsusuCreateGroupScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   ScrollView,
//   SafeAreaView,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Picker } from "@react-native-picker/picker";
// import axios from "axios";

// const EsusuCreateGroupScreen = ({ navigation }) => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [amountPerCycle, setAmountPerCycle] = useState("");
//   const [frequency, setFrequency] = useState("daily");
//   const [startDate, setStartDate] = useState(new Date());
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [maxMembers, setMaxMembers] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleCreateGroup = async () => {
//     // Basic validation
//     if (!name.trim()) return Alert.alert("Error", "Group name is required");
//     if (!description.trim())
//       return Alert.alert("Error", "Description is required");
//     if (!amountPerCycle || Number(amountPerCycle) <= 0)
//       return Alert.alert("Error", "Amount per cycle must be greater than 0");
//     if (!maxMembers || Number(maxMembers) <= 1)
//       return Alert.alert("Error", "Max members must be greater than 1");

//     const payload = {
//       name,
//       description,
//       amountPerCycle: Number(amountPerCycle),
//       frequency,
//       startDate,
//       maxMembers: Number(maxMembers),
//     };

//     try {
//       setLoading(true);
//       const response = await axios.post(
//         "http://localhost:5050/api/v3/esusu/create",
//         payload
//       );
//       setLoading(false);

//       if (response.data?.status) {
//         Alert.alert("Success", "Group created successfully!");
//         navigation.goBack(); // Go back to dashboard
//       } else {
//         Alert.alert("Error", response.data?.message || "Something went wrong");
//       }
//     } catch (error) {
//       setLoading(false);
//       Alert.alert("Error", error.message || "Server error");
//     }
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
//       <ScrollView contentContainerStyle={{ padding: 16 }}>
//         <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
//           Create Esusu Group
//         </Text>

//         {/* Group Name */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>Group Name</Text>
//         <TextInput
//           value={name}
//           onChangeText={setName}
//           placeholder="Enter group name"
//           style={{
//             backgroundColor: "white",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//             borderWidth: 1,
//             borderColor: "#ddd",
//           }}
//         />

//         {/* Description */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>Description</Text>
//         <TextInput
//           value={description}
//           onChangeText={setDescription}
//           placeholder="Enter group description"
//           multiline
//           style={{
//             backgroundColor: "white",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//             borderWidth: 1,
//             borderColor: "#ddd",
//             height: 80,
//             textAlignVertical: "top",
//           }}
//         />

//         {/* Amount per Cycle */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>
//           Amount Per Cycle
//         </Text>
//         <TextInput
//           value={amountPerCycle}
//           onChangeText={setAmountPerCycle}
//           placeholder="₦0"
//           keyboardType="numeric"
//           style={{
//             backgroundColor: "white",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//             borderWidth: 1,
//             borderColor: "#ddd",
//           }}
//         />

//         {/* Frequency */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>Frequency</Text>
//         <View
//           style={{
//             backgroundColor: "white",
//             borderRadius: 8,
//             borderWidth: 1,
//             borderColor: "#ddd",
//             marginBottom: 16,
//           }}
//         >
//           <Picker
//             selectedValue={frequency}
//             onValueChange={(itemValue) => setFrequency(itemValue)}
//           >
//             <Picker.Item label="Daily" value="daily" />
//             <Picker.Item label="Weekly" value="weekly" />
//             <Picker.Item label="Monthly" value="monthly" />
//           </Picker>
//         </View>

//         {/* Start Date */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>Start Date</Text>
//         <TouchableOpacity
//           onPress={() => setShowDatePicker(true)}
//           style={{
//             backgroundColor: "white",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//             borderWidth: 1,
//             borderColor: "#ddd",
//           }}
//         >
//           <Text>{startDate.toDateString()}</Text>
//         </TouchableOpacity>
//         {showDatePicker && (
//           <DateTimePicker
//             value={startDate}
//             mode="date"
//             display="default"
//             onChange={(_, date) => {
//               setShowDatePicker(false);
//               if (date) setStartDate(date);
//             }}
//           />
//         )}

//         {/* Max Members */}
//         <Text style={{ marginBottom: 6, fontWeight: "600" }}>Max Members</Text>
//         <TextInput
//           value={maxMembers}
//           onChangeText={setMaxMembers}
//           placeholder="Enter maximum number of members"
//           keyboardType="numeric"
//           style={{
//             backgroundColor: "white",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 24,
//             borderWidth: 1,
//             borderColor: "#ddd",
//           }}
//         />

//         {/* Submit Button */}
//         <TouchableOpacity
//           onPress={handleCreateGroup}
//           disabled={loading}
//           style={{
//             backgroundColor: "#007AFF",
//             paddingVertical: 16,
//             borderRadius: 12,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
//               Create Group
//             </Text>
//           )}
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default EsusuCreateGroupScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useMutateData } from "../../../../hooks/Request"; // your hook

const CreateEsusuGroupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [amountPerCycle, setAmountPerCycle] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [startDate, setStartDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [maxMembers, setMaxMembers] = useState("");

  // Use your mutation hook
  const createGroupMutation = useMutateData(
    "api/v3/esusu/create", // URL
    "POST", // method
    "allEsusuGroups" // query key to invalidate on success
  );

  const handleCreateGroup = () => {
    // Validation
    if (!name.trim()) return Alert.alert("Error", "Group name is required");
    if (!description.trim())
      return Alert.alert("Error", "Description is required");
    if (!amountPerCycle || Number(amountPerCycle) <= 0)
      return Alert.alert("Error", "Amount per cycle must be greater than 0");
    if (!maxMembers || Number(maxMembers) <= 1)
      return Alert.alert("Error", "Max members must be greater than 1");

    const payload = {
      name,
      description,
      amountPerCycle: Number(amountPerCycle),
      frequency,
      startDate,
      maxMembers: Number(maxMembers),
    };

    createGroupMutation.mutate(payload, {
      onSuccess: (data) => {
        Alert.alert("Success", "Group created successfully!");
        navigation.goBack(); // go back to dashboard
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to create group");
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 20 }}>
          Create Esusu Group
        </Text>

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Group Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter group description"
          multiline
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#ddd",
            height: 80,
            textAlignVertical: "top",
          }}
        />

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>
          Amount Per Cycle
        </Text>
        <TextInput
          value={amountPerCycle}
          onChangeText={setAmountPerCycle}
          placeholder="₦0"
          keyboardType="numeric"
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Frequency</Text>
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#ddd",
            marginBottom: 16,
          }}
        >
          <Picker
            selectedValue={frequency}
            onValueChange={(itemValue) => setFrequency(itemValue)}
          >
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
            <Picker.Item label="Monthly" value="monthly" />
          </Picker>
        </View>

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Start Date</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        >
          <Text>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(_, date) => {
              setShowDatePicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}

        <Text style={{ marginBottom: 6, fontWeight: "600" }}>Max Members</Text>
        <TextInput
          value={maxMembers}
          onChangeText={setMaxMembers}
          placeholder="Enter maximum number of members"
          keyboardType="numeric"
          style={{
            backgroundColor: "white",
            padding: 12,
            borderRadius: 8,
            marginBottom: 24,
            borderWidth: 1,
            borderColor: "#ddd",
          }}
        />

        <TouchableOpacity
          onPress={handleCreateGroup}
          disabled={createGroupMutation.isLoading}
          style={{
            backgroundColor: "#007AFF",
            paddingVertical: 16,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {createGroupMutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "white", fontWeight: "700", fontSize: 16 }}>
              Create Group
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateEsusuGroupScreen;
