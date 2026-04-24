

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import { Forminput } from "../../../components/shared/InputForm";
// import AppScreen from "../../../components/shared/AppScreen";
// import Toast from "react-native-toast-message";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import { useMutateData_v2 } from "../../../hooks/Requestv2";
// import { useQueryClient } from "@tanstack/react-query";
// import { MaterialCommunityIcons } from "@expo/vector-icons";

// import * as Application from 'expo-application';

// console.log({
//   yuttttt:Application?.nativeApplicationVersion
// });


// // send with login request
// // appVersion: Application.nativeApplicationVersion // e.g "1.0.2"

// const CreateGuests = () => {
//   const queryClient = useQueryClient();
//   const route = useRoute();
//   const navigation = useNavigation();

//   const [selectedOption, setSelectedOption] = useState(1);
//   const [departureTouched, setDepartureTouched] = useState(false);

//   const [formData, setFormData] = useState({
//     visitation_id: "",
//     arrivalDate: new Date(),
//     departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
//     visitor_name: "",
//     gender: 1,
//     phone_number: "",
//     location: "",
//   });

//   const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
//   const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
//   const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
//   const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

//   const visitorMutation = useMutateData_v2(
//     "api/v1/visitor",
//     formData?.visitation_id ? "PATCH" : "POST",
//     ["visitors", "invites"],
//     {
//       onSuccess: () => {
//         Toast.show({
//           type: "success",
//           text1: formData?.visitation_id
//             ? "Guest updated successfully"
//             : "Guest invitation created successfully",
//         });
//         if (formData?.visitation_id) {
//           queryClient.invalidateQueries({
//             queryKey: [`userGuests-${formData.visitation_id}`],
//           });
//         }
//         queryClient.invalidateQueries({ queryKey: ["userGuests"] });
//         navigation.goBack();
//       },
//       onError: (error: any) => {
//         Toast.show({
//           type: "error",
//           text1: error?.data?.message || "Submission failed",
//         });
//       },
//     }
//   );

//   const handleInputChange = (field: string, value: string) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const showDatePickerModal = (field: string, type: string) => {
//     if (field === "arrivalDate") {
//       type === "date"
//         ? setShowArrivalDatePicker(true)
//         : setShowArrivalTimePicker(true);
//     } else {
//       type === "date"
//         ? setShowDepartureDatePicker(true)
//         : setShowDepartureTimePicker(true);
//     }
//   };

//   const handleDateChange = (
//     event: any,
//     selectedDate: Date | undefined,
//     field: string,
//     type: string
//   ) => {
//     if (field === "arrivalDate") {
//       type === "date"
//         ? setShowArrivalDatePicker(false)
//         : setShowArrivalTimePicker(false);
//     } else {
//       type === "date"
//         ? setShowDepartureDatePicker(false)
//         : setShowDepartureTimePicker(false);
//     }

//     if (selectedDate === undefined) return;

//     if (field === "arrivalDate") {
//       setFormData((prev) => {
//         const newArrival = new Date(prev.arrivalDate);
//         if (type === "date") {
//           newArrival.setFullYear(
//             selectedDate.getFullYear(),
//             selectedDate.getMonth(),
//             selectedDate.getDate()
//           );
//         } else {
//           newArrival.setHours(
//             selectedDate.getHours(),
//             selectedDate.getMinutes()
//           );
//         }

//         const newDeparture = departureTouched
//           ? prev.departureDate
//           : new Date(newArrival.getTime() + 24 * 60 * 60 * 1000);

//         return {
//           ...prev,
//           arrivalDate: newArrival,
//           departureDate: newDeparture,
//         };
//       });
//     } else {
//       setDepartureTouched(true);
//       setFormData((prev) => {
//         const newDeparture = new Date(prev.departureDate);
//         if (type === "date") {
//           newDeparture.setFullYear(
//             selectedDate.getFullYear(),
//             selectedDate.getMonth(),
//             selectedDate.getDate()
//           );
//         } else {
//           newDeparture.setHours(
//             selectedDate.getHours(),
//             selectedDate.getMinutes()
//           );
//         }
//         return { ...prev, departureDate: newDeparture };
//       });
//     }
//   };

//   const handleSubmit = () => {
//     const genderString = selectedOption === 1 ? "Male" : "Female";
//     const payload = {
//       arraval: formData?.arrivalDate,
//       expires: formData?.departureDate,
//       visitor_name: formData?.visitor_name,
//       gender: genderString,
//       phone_number: formData?.phone_number,
//       location: formData?.location,
//       ...(formData?.visitation_id && { visitorID: formData?.visitation_id }),
//     };
//     visitorMutation.mutate(payload);
//   };

//   useEffect(() => {
//     const guestData = route.params?.itemdata;
//     if (guestData) {
//       setDepartureTouched(true);
//       setFormData({
//         visitation_id: guestData?._id,
//         arrivalDate: new Date(guestData.arraval || Date.now()),
//         departureDate: new Date(guestData.expires || Date.now()),
//         visitor_name: guestData.visitor_name || "",
//         gender: guestData.gender === "Male" ? 1 : 2,
//         phone_number: `${guestData.phone_number || ""}`,
//         location: guestData.location || "",
//       });
//       setSelectedOption(guestData.gender === "Male" ? 1 : 2);
//     }
//   }, [route.params?.itemdata]);

//   const getFormattedDateTime = (date: Date, mode: string) => {
//     if (!date) return "";
//     try {
//       const d = new Date(date);
//       return mode === "date"
//         ? d.toLocaleDateString()
//         : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
//     } catch (e) {
//       return mode === "date" ? "Select Date" : "Select Time";
//     }
//   };

//   const isEditing = !!formData.visitation_id;

//   // ── DateTimeBlock ──────────────────────────────────────────────────────────
//   const DateTimeBlock = ({
//     label,
//     icon,
//     field,
//     dateValue,
//     showDate,
//     showTime,
//     isAutoSet = false,
//   }: {
//     label: string;
//     icon: string;
//     field: string;
//     dateValue: Date;
//     showDate: boolean;
//     showTime: boolean;
//     isAutoSet?: boolean;
//   }) => (
//     <View style={styles.dateTimeCard}>
//       {/* Header */}
//       <View style={styles.dateTimeHeader}>
//         <View style={styles.dateTimeIconWrap}>
//           <MaterialCommunityIcons name={icon} size={16} color="#10B981" />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.dateTimeLabel}>{label}</Text>
//           {isAutoSet && (
//             <Text style={styles.autoSetBadge}>Auto • 24hr</Text>
//           )}
//         </View>
//       </View>

//       {/* Date row */}
//       <TouchableOpacity
//         style={styles.pickerRow}
//         onPress={() => showDatePickerModal(field, "date")}
//       >
//         <View style={styles.pickerIconWrap}>
//           <MaterialCommunityIcons
//             name="calendar-outline"
//             size={16}
//             color="#10B981"
//           />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.pickerRowLabel}>Date</Text>
//           <Text style={styles.pickerValue}>
//             {getFormattedDateTime(dateValue, "date")}
//           </Text>
//         </View>
//         <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
//       </TouchableOpacity>

//       {/* Time row */}
//       <TouchableOpacity
//         style={[styles.pickerRow, { marginTop: 8 }]}
//         onPress={() => showDatePickerModal(field, "time")}
//       >
//         <View style={styles.pickerIconWrap}>
//           <MaterialCommunityIcons
//             name="clock-outline"
//             size={16}
//             color="#10B981"
//           />
//         </View>
//         <View style={{ flex: 1 }}>
//           <Text style={styles.pickerRowLabel}>Time</Text>
//           <Text style={styles.pickerValue}>
//             {getFormattedDateTime(dateValue, "time")}
//           </Text>
//         </View>
//         <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
//       </TouchableOpacity>

//       {showDate && (
//         <DateTimePicker
//           value={dateValue}
//           mode="date"
//           display="default"
//           onChange={(event, selectedDate) =>
//             handleDateChange(event, selectedDate, field, "date")
//           }
//         />
//       )}
//       {showTime && (
//         <DateTimePicker
//           value={dateValue}
//           mode="time"
//           display="default"
//           onChange={(event, selectedDate) =>
//             handleDateChange(event, selectedDate, field, "time")
//           }
//         />
//       )}
//     </View>
//   );

//   return (
//     <View style={{
//       flex:1
//     }}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <ScrollView
//           showsVerticalScrollIndicator={false}
//           style={styles.scrollView}
//           contentContainerStyle={{ flexGrow: 1 }}
//         >
//           <View style={styles.container}>

//             {/* ── Hero ─────────────────────────────────────── */}
//             <View style={styles.heroCard}>
//               <View style={styles.decorativeCircle1} />
//               <View style={styles.decorativeCircle2} />
//               <View style={styles.heroIconWrap}>
//                 <MaterialCommunityIcons
//                   name="account-plus"
//                   size={28}
//                   color="#FFFFFF"
//                 />
//               </View>
//               <Text style={styles.heroTitle}>
//                 {isEditing ? "Update Guest" : "Invite a Guest"}
//               </Text>
//               <Text style={styles.heroSubtitle}>
//                 {isEditing
//                   ? "Edit your visitor's details below"
//                   : "Set the visit schedule first, then fill in visitor details"}
//               </Text>
//             </View>

//             {/* ── 1. Visit Schedule ────────────────────────── */}
//             <View style={styles.sectionCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="calendar-clock"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>Visit Schedule</Text>
//               </View>

//               {/* Info pill — only when departure is still auto */}
//               {!departureTouched && (
//                 <View style={styles.infoPill}>
//                   <MaterialCommunityIcons
//                     name="information-outline"
//                     size={14}
//                     color="#2563EB"
//                   />
//                   <Text style={styles.infoPillText}>
//                     Departure auto-sets to 24 hrs after arrival. Tap departure
//                     to override.
//                   </Text>
//                 </View>
//               )}

//               {/* Side by side */}
//               <View style={styles.sideBySide}>
//                 <View style={{ flex: 1 }}>
//                   <DateTimeBlock
//                     label="Arrival"
//                     icon="login"
//                     field="arrivalDate"
//                     dateValue={formData.arrivalDate}
//                     showDate={showArrivalDatePicker}
//                     showTime={showArrivalTimePicker}
//                     isAutoSet={false}
//                   />
//                 </View>

//                 <View style={styles.sideDivider} />

//                 <View style={{ flex: 1 }}>
//                   <DateTimeBlock
//                     label="Departure"
//                     icon="logout"
//                     field="departureDate"
//                     dateValue={formData.departureDate}
//                     showDate={showDepartureDatePicker}
//                     showTime={showDepartureTimePicker}
//                     isAutoSet={!departureTouched}
//                   />
//                 </View>
//               </View>
//             </View>

//             {/* ── 2. Visitor Information ───────────────────── */}
//             <View style={styles.sectionCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="account-outline"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>Visitor Information</Text>
//               </View>

//               <Text style={styles.fieldLabel}>Full Name</Text>
//               <Forminput
//                 placeholder="Enter visitor's name"
//                 value={formData.visitor_name}
//                 onChangeText={(value) =>
//                   handleInputChange("visitor_name", value)
//                 }
//               />

//               <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
//                 Phone Number
//               </Text>
//               <Forminput
//                 placeholder="Enter phone number"
//                 value={formData.phone_number}
//                 onChangeText={(value) =>
//                   handleInputChange("phone_number", value)
//                 }
//                 keyboardType="numeric"
//               />

//               <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Gender</Text>
//               <View style={styles.genderRow}>
//                 <TouchableOpacity
//                   style={[
//                     styles.genderOption,
//                     selectedOption === 1 && styles.genderOptionActive,
//                   ]}
//                   onPress={() => setSelectedOption(1)}
//                 >
//                   <MaterialCommunityIcons
//                     name="gender-male"
//                     size={18}
//                     color={selectedOption === 1 ? "#10B981" : "#9CA3AF"}
//                   />
//                   <Text
//                     style={[
//                       styles.genderLabel,
//                       selectedOption === 1 && styles.genderLabelActive,
//                     ]}
//                   >
//                     Male
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.genderOption,
//                     selectedOption === 2 && styles.genderOptionActive,
//                   ]}
//                   onPress={() => setSelectedOption(2)}
//                 >
//                   <MaterialCommunityIcons
//                     name="gender-female"
//                     size={18}
//                     color={selectedOption === 2 ? "#10B981" : "#9CA3AF"}
//                   />
//                   <Text
//                     style={[
//                       styles.genderLabel,
//                       selectedOption === 2 && styles.genderLabelActive,
//                     ]}
//                   >
//                     Female
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>

//             {/* ── 3. Location ──────────────────────────────── */}
//             <View style={styles.sectionCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="map-marker-outline"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>Invite Location</Text>
//               </View>
//               <Text style={styles.fieldLabel}>Address (Optional)</Text>
//               <Forminput
//                 placeholder="Enter your address for invite"
//                 value={formData.location}
//                 onChangeText={(value) => handleInputChange("location", value)}
//               />
//             </View>

//             {/* ── Submit ───────────────────────────────────── */}
//             <TouchableOpacity
//               style={[
//                 styles.submitButton,
//                 visitorMutation.isPending && { opacity: 0.7 },
//               ]}
//               onPress={handleSubmit}
//               disabled={visitorMutation.isPending}
//               activeOpacity={0.85}
//             >
//               <MaterialCommunityIcons
//                 name={isEditing ? "content-save-outline" : "send-outline"}
//                 size={20}
//                 color="#FFFFFF"
//                 style={{ marginRight: 8 }}
//               />
//               <Text style={styles.submitButtonText}>
//                 {visitorMutation.isPending
//                   ? "Submitting..."
//                   : isEditing
//                   ? "Update Guest"
//                   : "Send Invitation"}
//               </Text>
//             </TouchableOpacity>

//             <View style={{ height: 40 }} />
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </View>
//   );
// };

// export default CreateGuests;



// // axiosInstance.defaults.headers['x-app-version'] = version;
// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   container: {
//     flex: 1,
//     paddingHorizontal: 16,
//     // paddingVertical: 20,
//   },

//   // ── Hero ──────────────────────────────────────────
//   heroCard: {
//     backgroundColor: "#10B981",
//     borderRadius: 20,
//     padding: 24,
//     marginBottom: 16,
//     overflow: "hidden",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   decorativeCircle1: {
//     position: "absolute",
//     top: -30,
//     right: -30,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   decorativeCircle2: {
//     position: "absolute",
//     bottom: -20,
//     left: -20,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(255,255,255,0.08)",
//   },
//   heroIconWrap: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "rgba(255,255,255,0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   heroTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//     marginBottom: 4,
//   },
//   heroSubtitle: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "rgba(255,255,255,0.8)",
//     lineHeight: 18,
//   },

//   // ── Section Cards ──────────────────────────────────
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },

//   // ── Info Pill ──────────────────────────────────────
//   infoPill: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     gap: 6,
//     backgroundColor: "#DBEAFE",
//     borderRadius: 10,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     marginBottom: 12,
//   },
//   infoPillText: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#1D4ED8",
//     flex: 1,
//     lineHeight: 17,
//   },

//   // ── Side by side ───────────────────────────────────
//   sideBySide: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//   },
//   sideDivider: {
//     width: 1,
//     backgroundColor: "#F3F4F6",
//     marginHorizontal: 12,
//     alignSelf: "stretch",
//   },

//   // ── Date Time Block ────────────────────────────────
//   dateTimeCard: {
//     flex: 1,
//   },
//   dateTimeHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 12,
//     gap: 6,
//   },
//   dateTimeIconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: "#D1FAE5",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dateTimeLabel: {
//     fontSize: 15,
//     fontWeight: "800",
//     color: "#111827",
//     letterSpacing: 0.4,
//   },
//   autoSetBadge: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#10B981",
//     letterSpacing: 0.3,
//     marginTop: 2,
//   },
//   pickerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   pickerIconWrap: {
//     width: 32,
//     height: 32,
//     borderRadius: 8,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   pickerRowLabel: {
//     fontSize: 10,
//     fontWeight: "600",
//     color: "#9CA3AF",
//     letterSpacing: 0.5,
//     textTransform: "uppercase",
//     marginBottom: 2,
//   },
//   pickerValue: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#111827",
//   },

//   // ── Field Labels ───────────────────────────────────
//   fieldLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },

//   // ── Gender ─────────────────────────────────────────
//   genderRow: {
//     flexDirection: "row",
//     gap: 12,
//   },
//   genderOption: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//     paddingVertical: 12,
//     borderRadius: 12,
//     backgroundColor: "#F9FAFB",
//     borderWidth: 1.5,
//     borderColor: "#E5E7EB",
//   },
//   genderOptionActive: {
//     backgroundColor: "#D1FAE5",
//     borderColor: "#10B981",
//   },
//   genderLabel: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#9CA3AF",
//     letterSpacing: 0.3,
//   },
//   genderLabelActive: {
//     color: "#10B981",
//   },

//   // ── Submit ─────────────────────────────────────────
//   submitButton: {
//     backgroundColor: "#10B981",
//     paddingVertical: 16,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//     marginTop: 4,
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },
// });

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Forminput } from "../../../components/shared/InputForm";
import Toast from "react-native-toast-message";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useMutateData_v2 } from "../../../hooks/Requestv2";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const CreateGuests = () => {
  const queryClient = useQueryClient();
  const route = useRoute();
  const navigation = useNavigation();

  // ── Active tab ────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("single"); // "single" | "multi"

  // ── Single entry state ────────────────────────────────────────────────────
  const [selectedOption, setSelectedOption] = useState(1);
  const [departureTouched, setDepartureTouched] = useState(false);
  const [formData, setFormData] = useState({
    visitation_id: "",
    arrivalDate: new Date(),
    departureDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    visitor_name: "",
    gender: 1,
    phone_number: "",
    location: "",
  });
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

  // ── Multi entry state ─────────────────────────────────────────────────────
  const [multiForm, setMultiForm] = useState({
    visitor_name: "",
    gender: 1,
    phone_number: "",
    location: "",
    note: "",
  });
  const [multiGender, setMultiGender] = useState(1);

  // ── Mutations ─────────────────────────────────────────────────────────────
  const singleMutation = useMutateData_v2(
    "api/v1/visitor",
    formData?.visitation_id ? "PATCH" : "POST",
    ["visitors", "invites"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: formData?.visitation_id
            ? "Guest updated successfully"
            : "Guest invitation created successfully",
        });
        if (formData?.visitation_id) {
          queryClient.invalidateQueries({
            queryKey: [`userGuests-${formData.visitation_id}`],
          });
        }
        queryClient.invalidateQueries({ queryKey: ["userGuests"] });
        navigation.goBack();
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Submission failed",
        });
      },
    },
  );

  const multiMutation = useMutateData_v2(
    "api/v1/visitor/multiEntry",
    "POST",
    ["visitors", "invites"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Multi entry invitation created! Valid for 30 days.",
        });
        queryClient.invalidateQueries({ queryKey: ["userGuests"] });
        navigation.goBack();
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Submission failed",
        });
      },
    },
  );

  // ── Single entry handlers ─────────────────────────────────────────────────
  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const showDatePickerModal = (field: string, type: string) => {
    if (field === "arrivalDate") {
      type === "date"
        ? setShowArrivalDatePicker(true)
        : setShowArrivalTimePicker(true);
    } else {
      type === "date"
        ? setShowDepartureDatePicker(true)
        : setShowDepartureTimePicker(true);
    }
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    field: string,
    type: string,
  ) => {
    if (field === "arrivalDate") {
      type === "date"
        ? setShowArrivalDatePicker(false)
        : setShowArrivalTimePicker(false);
    } else {
      type === "date"
        ? setShowDepartureDatePicker(false)
        : setShowDepartureTimePicker(false);
    }

    if (selectedDate === undefined) return;

    if (field === "arrivalDate") {
      setFormData((prev) => {
        const newArrival = new Date(prev.arrivalDate);
        if (type === "date") {
          newArrival.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
        } else {
          newArrival.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
          );
        }
        const newDeparture = departureTouched
          ? prev.departureDate
          : new Date(newArrival.getTime() + 24 * 60 * 60 * 1000);
        return { ...prev, arrivalDate: newArrival, departureDate: newDeparture };
      });
    } else {
      setDepartureTouched(true);
      setFormData((prev) => {
        const newDeparture = new Date(prev.departureDate);
        if (type === "date") {
          newDeparture.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
          );
        } else {
          newDeparture.setHours(
            selectedDate.getHours(),
            selectedDate.getMinutes(),
          );
        }
        return { ...prev, departureDate: newDeparture };
      });
    }
  };

  const handleSingleSubmit = () => {
    const genderString = selectedOption === 1 ? "Male" : "Female";
    const payload = {
      arraval: formData?.arrivalDate,
      expires: formData?.departureDate,
      visitor_name: formData?.visitor_name,
      gender: genderString,
      phone_number: formData?.phone_number,
      location: formData?.location,
      ...(formData?.visitation_id && { visitorID: formData?.visitation_id }),
    };
    singleMutation.mutate(payload);
  };

  const handleMultiSubmit = () => {
    if (!multiForm.visitor_name.trim()) {
      Toast.show({ type: "error", text1: "Visitor name is required" });
      return;
    }
    const payload = {
      visitor_name: multiForm.visitor_name.trim(),
      gender: multiGender === 1 ? "Male" : "Female",
      phone_number: multiForm.phone_number
        ? Number(multiForm.phone_number)
        : undefined,
      location: multiForm.location || undefined,
      note: multiForm.note || undefined,
    };
    multiMutation.mutate(payload);
  };

  useEffect(() => {
    const guestData = route.params?.itemdata;
    if (guestData) {
      setDepartureTouched(true);
      setFormData({
        visitation_id: guestData?._id,
        arrivalDate: new Date(guestData.arraval || Date.now()),
        departureDate: new Date(guestData.expires || Date.now()),
        visitor_name: guestData.visitor_name || "",
        gender: guestData.gender === "Male" ? 1 : 2,
        phone_number: `${guestData.phone_number || ""}`,
        location: guestData.location || "",
      });
      setSelectedOption(guestData.gender === "Male" ? 1 : 2);
      // If editing, stay on single tab
      setActiveTab("single");
    }
  }, [route.params?.itemdata]);

  const getFormattedDateTime = (date: Date, mode: string) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return mode === "date"
        ? d.toLocaleDateString()
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return mode === "date" ? "Select Date" : "Select Time";
    }
  };

  const isEditing = !!formData.visitation_id;

  // ── DateTimeBlock ─────────────────────────────────────────────────────────
  const DateTimeBlock = ({
    label,
    icon,
    field,
    dateValue,
    showDate,
    showTime,
    isAutoSet = false,
  }: any) => (
    <View style={styles.dateTimeCard}>
      <View style={styles.dateTimeHeader}>
        <View style={styles.dateTimeIconWrap}>
          <MaterialCommunityIcons name={icon} size={16} color="#10B981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.dateTimeLabel}>{label}</Text>
          {isAutoSet && <Text style={styles.autoSetBadge}>Auto • 24hr</Text>}
        </View>
      </View>

      <TouchableOpacity
        style={styles.pickerRow}
        onPress={() => showDatePickerModal(field, "date")}
      >
        <View style={styles.pickerIconWrap}>
          <MaterialCommunityIcons name="calendar-outline" size={16} color="#10B981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pickerRowLabel}>Date</Text>
          <Text style={styles.pickerValue}>
            {getFormattedDateTime(dateValue, "date")}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.pickerRow, { marginTop: 8 }]}
        onPress={() => showDatePickerModal(field, "time")}
      >
        <View style={styles.pickerIconWrap}>
          <MaterialCommunityIcons name="clock-outline" size={16} color="#10B981" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.pickerRowLabel}>Time</Text>
          <Text style={styles.pickerValue}>
            {getFormattedDateTime(dateValue, "time")}
          </Text>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={16} color="#9CA3AF" />
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={dateValue}
          mode="date"
          display="default"
          onChange={(event: any, selectedDate: any) =>
            handleDateChange(event, selectedDate, field, "date")
          }
        />
      )}
      {showTime && (
        <DateTimePicker
          value={dateValue}
          mode="time"
          display="default"
          onChange={(event: any, selectedDate: any) =>
            handleDateChange(event, selectedDate, field, "time")
          }
        />
      )}
    </View>
  );

  // ── Gender selector (reusable) ────────────────────────────────────────────
  const GenderSelector = ({ value, onChange }: any) => (
    <View style={styles.genderRow}>
      <TouchableOpacity
        style={[styles.genderOption, value === 1 && styles.genderOptionActive]}
        onPress={() => onChange(1)}
      >
        <MaterialCommunityIcons
          name="gender-male"
          size={18}
          color={value === 1 ? "#10B981" : "#9CA3AF"}
        />
        <Text
          style={[styles.genderLabel, value === 1 && styles.genderLabelActive]}
        >
          Male
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.genderOption, value === 2 && styles.genderOptionActive]}
        onPress={() => onChange(2)}
      >
        <MaterialCommunityIcons
          name="gender-female"
          size={18}
          color={value === 2 ? "#10B981" : "#9CA3AF"}
        />
        <Text
          style={[styles.genderLabel, value === 2 && styles.genderLabelActive]}
        >
          Female
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.container}>

            {/* ── Hero ────────────────────────────────────── */}
            <View style={styles.heroCard}>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />
              <View style={styles.heroIconWrap}>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={28}
                  color="#FFFFFF"
                />
              </View>
              <Text style={styles.heroTitle}>
                {isEditing ? "Update Guest" : "Invite a Guest"}
              </Text>
              <Text style={styles.heroSubtitle}>
                {activeTab === "multi"
                  ? "Frequent visitor — valid for 30 days, reusable code"
                  : isEditing
                  ? "Edit your visitor's details below"
                  : "One-time visit with arrival and departure schedule"}
              </Text>
            </View>

            {/* ── Tabs — hidden when editing ───────────────── */}
            {!isEditing && (
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "single" && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab("single")}
                >
                  <MaterialCommunityIcons
                    name="account-clock"
                    size={16}
                    color={activeTab === "single" ? "#10B981" : "#9CA3AF"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "single" && styles.tabTextActive,
                    ]}
                  >
                    Single Visit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tab,
                    activeTab === "multi" && styles.tabActive,
                  ]}
                  onPress={() => setActiveTab("multi")}
                >
                  <MaterialCommunityIcons
                    name="account-reactivate"
                    size={16}
                    color={activeTab === "multi" ? "#10B981" : "#9CA3AF"}
                    style={{ marginRight: 6 }}
                  />
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === "multi" && styles.tabTextActive,
                    ]}
                  >
                    Multi Entry
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* ════════════════════════════════════════════════
                SINGLE ENTRY FORM
            ════════════════════════════════════════════════ */}
            {activeTab === "single" && (
              <>
                {/* Visit Schedule */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                      name="calendar-clock"
                      size={20}
                      color="#10B981"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>Visit Schedule</Text>
                  </View>

                  {!departureTouched && (
                    <View style={styles.infoPill}>
                      <MaterialCommunityIcons
                        name="information-outline"
                        size={14}
                        color="#2563EB"
                      />
                      <Text style={styles.infoPillText}>
                        Departure auto-sets to 24 hrs after arrival. Tap
                        departure to override.
                      </Text>
                    </View>
                  )}

                  <View style={styles.sideBySide}>
                    <View style={{ flex: 1 }}>
                      <DateTimeBlock
                        label="Arrival"
                        icon="login"
                        field="arrivalDate"
                        dateValue={formData.arrivalDate}
                        showDate={showArrivalDatePicker}
                        showTime={showArrivalTimePicker}
                        isAutoSet={false}
                      />
                    </View>
                    <View style={styles.sideDivider} />
                    <View style={{ flex: 1 }}>
                      <DateTimeBlock
                        label="Departure"
                        icon="logout"
                        field="departureDate"
                        dateValue={formData.departureDate}
                        showDate={showDepartureDatePicker}
                        showTime={showDepartureTimePicker}
                        isAutoSet={!departureTouched}
                      />
                    </View>
                  </View>
                </View>

                {/* Visitor Info */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={20}
                      color="#10B981"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>Visitor Information</Text>
                  </View>

                  <Text style={styles.fieldLabel}>Full Name</Text>
                  <Forminput
                    placeholder="Enter visitor's name"
                    value={formData.visitor_name}
                    onChangeText={(value) =>
                      handleInputChange("visitor_name", value)
                    }
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Phone Number
                  </Text>
                  <Forminput
                    placeholder="Enter phone number"
                    value={formData.phone_number}
                    onChangeText={(value) =>
                      handleInputChange("phone_number", value)
                    }
                    keyboardType="numeric"
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Gender
                  </Text>
                  <GenderSelector
                    value={selectedOption}
                    onChange={setSelectedOption}
                  />
                </View>

                {/* Location */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                      name="map-marker-outline"
                      size={20}
                      color="#10B981"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>Invite Location</Text>
                  </View>
                  <Text style={styles.fieldLabel}>Address (Optional)</Text>
                  <Forminput
                    placeholder="Enter your address for invite"
                    value={formData.location}
                    onChangeText={(value) =>
                      handleInputChange("location", value)
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    singleMutation.isPending && { opacity: 0.7 },
                  ]}
                  onPress={handleSingleSubmit}
                  disabled={singleMutation.isPending}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name={isEditing ? "content-save-outline" : "send-outline"}
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.submitButtonText}>
                    {singleMutation.isPending
                      ? "Submitting..."
                      : isEditing
                      ? "Update Guest"
                      : "Send Invitation"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ════════════════════════════════════════════════
                MULTI ENTRY FORM
            ════════════════════════════════════════════════ */}
            {activeTab === "multi" && (
              <>
                {/* Info card */}
                <View style={styles.multiInfoCard}>
                  <View style={styles.multiInfoRow}>
                    <View style={[styles.multiInfoIcon, { backgroundColor: "#D1FAE5" }]}>
                      <MaterialCommunityIcons name="refresh" size={18} color="#10B981" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.multiInfoTitle}>Reusable Code</Text>
                      <Text style={styles.multiInfoText}>
                        Code resets after each visit — visitor can use it again
                      </Text>
                    </View>
                  </View>
                  <View style={styles.multiInfoRow}>
                    <View style={[styles.multiInfoIcon, { backgroundColor: "#DBEAFE" }]}>
                      <MaterialCommunityIcons name="calendar-range" size={18} color="#3B82F6" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.multiInfoTitle}>30 Day Window</Text>
                      <Text style={styles.multiInfoText}>
                        Code is valid for 30 days from today
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.multiInfoRow, { marginBottom: 0 }]}>
                    <View style={[styles.multiInfoIcon, { backgroundColor: "#FEF3C7" }]}>
                      <MaterialCommunityIcons name="history" size={18} color="#F59E0B" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.multiInfoTitle}>Visit History</Text>
                      <Text style={styles.multiInfoText}>
                        Every visit is logged automatically
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Visitor Info */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={20}
                      color="#10B981"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>Visitor Information</Text>
                  </View>

                  <Text style={styles.fieldLabel}>Full Name *</Text>
                  <Forminput
                    placeholder="Enter visitor's name"
                    value={multiForm.visitor_name}
                    onChangeText={(value) =>
                      setMultiForm({ ...multiForm, visitor_name: value })
                    }
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Phone Number
                  </Text>
                  <Forminput
                    placeholder="Enter phone number"
                    value={multiForm.phone_number}
                    onChangeText={(value) =>
                      setMultiForm({ ...multiForm, phone_number: value })
                    }
                    keyboardType="numeric"
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Gender
                  </Text>
                  <GenderSelector
                    value={multiGender}
                    onChange={setMultiGender}
                  />
                </View>

                {/* Note + Location */}
                <View style={styles.sectionCard}>
                  <View style={styles.sectionHeader}>
                    <MaterialCommunityIcons
                      name="note-outline"
                      size={20}
                      color="#10B981"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.sectionTitle}>Additional Details</Text>
                  </View>

                  <Text style={styles.fieldLabel}>Note (Optional)</Text>
                  <Forminput
                    placeholder="e.g. My cleaner, Yoga instructor, Family friend"
                    value={multiForm.note}
                    onChangeText={(value) =>
                      setMultiForm({ ...multiForm, note: value })
                    }
                  />

                  <Text style={[styles.fieldLabel, { marginTop: 12 }]}>
                    Location (Optional)
                  </Text>
                  <Forminput
                    placeholder="Enter address for invite"
                    value={multiForm.location}
                    onChangeText={(value) =>
                      setMultiForm({ ...multiForm, location: value })
                    }
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: "#3B82F6" },
                    multiMutation.isPending && { opacity: 0.7 },
                  ]}
                  onPress={handleMultiSubmit}
                  disabled={multiMutation.isPending}
                  activeOpacity={0.85}
                >
                  <MaterialCommunityIcons
                    name="account-reactivate"
                    size={20}
                    color="#FFFFFF"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.submitButtonText}>
                    {multiMutation.isPending
                      ? "Creating..."
                      : "Create Multi Entry Pass"}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={{ height: 40 }} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default CreateGuests;

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#F9FAFB" },
  container: { flex: 1, paddingHorizontal: 16 },

  // ── Hero ──
  heroCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
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
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    lineHeight: 18,
  },

  // ── Tabs ──
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: "#D1FAE5",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: "#10B981",
  },

  // ── Section cards ──
  sectionCard: {
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // ── Multi info card ──
  multiInfoCard: {
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
  multiInfoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  multiInfoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  multiInfoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  multiInfoText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 17,
  },

  // ── Info pill ──
  infoPill: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#DBEAFE",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  infoPillText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1D4ED8",
    flex: 1,
    lineHeight: 17,
  },

  // ── Side by side ──
  sideBySide: { flexDirection: "row", alignItems: "flex-start" },
  sideDivider: {
    width: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 12,
    alignSelf: "stretch",
  },

  // ── Date time block ──
  dateTimeCard: { flex: 1 },
  dateTimeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 6,
  },
  dateTimeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  dateTimeLabel: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.4,
  },
  autoSetBadge: {
    fontSize: 10,
    fontWeight: "600",
    color: "#10B981",
    letterSpacing: 0.3,
    marginTop: 2,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  pickerIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerRowLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#9CA3AF",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  pickerValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
  },

  // ── Fields ──
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  // ── Gender ──
  genderRow: { flexDirection: "row", gap: 12 },
  genderOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  genderOptionActive: { backgroundColor: "#D1FAE5", borderColor: "#10B981" },
  genderLabel: { fontSize: 14, fontWeight: "600", color: "#9CA3AF", letterSpacing: 0.3 },
  genderLabelActive: { color: "#10B981" },

  // ── Submit ──
  submitButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});