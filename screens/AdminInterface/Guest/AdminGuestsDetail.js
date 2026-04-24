// // // import {
// // //   View,
// // //   Text,
// // //   TouchableOpacity,
// // //   ScrollView,
// // //   StyleSheet,
// // //   ActivityIndicator,
// // //   Image,
// // // } from "react-native";
// // // import React from "react";
// // // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // // import { useRoute, useNavigation } from "@react-navigation/native";
// // // import { formatDateandTime } from "../../../utils/DateTime";
// // // import { useMutateData_v2 } from "../../../hooks/Requestv2";
// // // import { Platform } from "react-native";

// // // const AdminGuestsDetail = () => {
// // //   const navigation = useNavigation();
// // //   const route = useRoute();
// // //   const { itemdata } = route.params;

// // //   console.log({
// // //     ioioioioi:itemdata
// // //   });

// // //   const confirmVisitorMutation = useMutateData_v2(
// // //     "api/v1/visitor/estateadmin",
// // //     "POST",
// // //     undefined,
// // //     {
// // //       onSuccess: (data) => {
// // //         Toast.show({
// // //           type: "success",
// // //           text1: data?.message || "Visitor confirmed!",
// // //         });
// // //         navigation.goBack();
// // //       },
// // //       onError: (error: any) => {
// // //         Toast.show({
// // //           type: "error",
// // //           text1: error?.data?.message || "Something went wrong",
// // //         });
// // //       },
// // //     }
// // //   );

// // //   const getStatusColor = (status) => {
// // //     switch (status) {
// // //       case "arrived":
// // //         return { bg: "#D1FAE5", text: "#065F46", label: "Arrived" };
// // //       case "pending":
// // //         return { bg: "#FEF3C7", text: "#92400E", label: "Pending" };
// // //       case "expired":
// // //         return { bg: "#FEE2E2", text: "#991B1B", label: "Expired" };
// // //       default:
// // //         return { bg: "#F3F4F6", text: "#374151", label: status || "Unknown" };
// // //     }
// // //   };

// // //   const statusInfo = getStatusColor(itemdata?.status);
// // //   const isArrived = itemdata?.status === "arrived";
// // //   const isExpired = new Date(itemdata?.expires) < new Date();

// // //   return (
// // //     <ScrollView
// // //       style={styles.container}
// // //       showsVerticalScrollIndicator={false}
// // //     >
// // //       <View style={styles.content}>
// // //         {/* Header with Back Button */}
// // //         {/* <TouchableOpacity
// // //           style={styles.backButton}
// // //           onPress={() => navigation.goBack()}
// // //         >
// // //           <MaterialCommunityIcons name="arrow-left" size={24} color="#111827" />
// // //         </TouchableOpacity> */}

// // //         {/* Status Badge */}
// // //         <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
// // //           <MaterialCommunityIcons
// // //             name={isArrived ? "check-circle" : "clock-outline"}
// // //             size={16}
// // //             color={statusInfo.text}
// // //           />
// // //           <Text style={[styles.statusText, { color: statusInfo.text }]}>
// // //             {statusInfo.label}
// // //           </Text>
// // //         </View>

// // //         {/* Visitor Avatar */}
// // //         <View style={styles.avatarContainer}>
// // //           <View style={styles.avatar}>
// // //             <Text style={styles.avatarText}>
// // //               {itemdata?.visitor_name?.charAt(0) || "V"}
// // //             </Text>
// // //           </View>
// // //         </View>

// // //         {
// // //           console.log({
// // // xcvbbb:itemdata
// // //           })
// // //         }

// // //         {/* Visitor Name */}
// // //         <Text style={styles.visitorName}>{itemdata?.visitor_name}</Text>
// // //         <Text style={styles.visitorRole}>Guest Visitor</Text>

// // //         {/* Details Card */}
// // //         <View style={styles.detailsCard}>
// // //           <View style={styles.cardHeader}>
// // //             <MaterialCommunityIcons name="information" size={20} color="#10B981" />
// // //             <Text style={styles.cardTitle}>Invitation Details</Text>
// // //           </View>

// // //           <View style={styles.detailsGrid}>
// // //             {/* Gender */}
// // //             <View style={styles.detailItem}>
// // //               <View style={[styles.detailIcon, { backgroundColor: "#DBEAFE" }]}>
// // //                 <MaterialCommunityIcons name="gender-male-female" size={18} color="#3B82F6" />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Gender</Text>
// // //                 <Text style={styles.detailValue}>{itemdata?.gender || "N/A"}</Text>
// // //               </View>
// // //             </View>

// // //             {/* Phone Number */}
// // //             <View style={styles.detailItem}>
// // //               <View style={[styles.detailIcon, { backgroundColor: "#D1FAE5" }]}>
// // //                 <MaterialCommunityIcons name="phone" size={18} color="#10B981" />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Phone Number</Text>
// // //                 <Text style={styles.detailValue}>{itemdata?.phone_number || "N/A"}</Text>
// // //               </View>
// // //             </View>

// // //             {/* Access Code */}
// // //             <View style={styles.detailItem}>
// // //               <View style={[styles.detailIcon, { backgroundColor: "#FEF3C7" }]}>
// // //                 <MaterialCommunityIcons name="qrcode" size={18} color="#F59E0B" />
// // //               </View>
// // //               <View>
// // //                 <Text style={styles.detailLabel}>Access Code</Text>
// // //                 <Text style={[styles.detailValue, styles.accessCode]}>
// // //                   {itemdata?.access_code}
// // //                 </Text>
// // //               </View>
// // //             </View>

// // //             {/* Address */}
// // //             <View style={styles.detailItem}>
// // //               <View style={[styles.detailIcon, { backgroundColor: "#EDE9FE" }]}>
// // //                 <MaterialCommunityIcons name="map-marker" size={18} color="#8B5CF6" />
// // //               </View>
// // //               <View style={{ flex: 1 }}>
// // //                 <Text style={styles.detailLabel}>Address</Text>
// // //                 <Text style={styles.detailValue}>{itemdata?.location || "N/A"}</Text>
// // //               </View>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Timeline Card */}
// // //         <View style={styles.timelineCard}>
// // //           <View style={styles.cardHeader}>
// // //             <MaterialCommunityIcons name="timeline-clock" size={20} color="#10B981" />
// // //             <Text style={styles.cardTitle}>Timeline</Text>
// // //           </View>

// // //           {/* Arrived Date */}
// // //           <View style={styles.timelineItem}>
// // //             <View style={styles.timelineIconContainer}>
// // //               <View style={[styles.timelineIcon, { backgroundColor: "#D1FAE5" }]}>
// // //                 <MaterialCommunityIcons name="calendar-check" size={18} color="#10B981" />
// // //               </View>
// // //               {!isArrived && <View style={styles.timelineLine} />}
// // //             </View>
// // //             <View style={styles.timelineContent}>
// // //               <Text style={styles.timelineLabel}>Arrived Date</Text>
// // //               <Text style={styles.timelineValue}>
// // //                 {formatDateandTime(itemdata?.arrived_at) || "Not arrived yet"}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* Departure Date */}
// // //           <View style={styles.timelineItem}>
// // //             <View style={styles.timelineIconContainer}>
// // //               <View style={[styles.timelineIcon, { backgroundColor: "#FEE2E2" }]}>
// // //                 <MaterialCommunityIcons name="calendar-remove" size={18} color="#DC2626" />
// // //               </View>
// // //             </View>
// // //             <View style={styles.timelineContent}>
// // //               <Text style={styles.timelineLabel}>Departure Date</Text>
// // //               <Text style={styles.timelineValue}>
// // //                 {formatDateandTime(itemdata?.departed_at) || "Not departed yet"}
// // //               </Text>
// // //             </View>
// // //           </View>

// // //           {/* Expires Date */}
// // //           <View style={styles.timelineItem}>
// // //             <View style={styles.timelineIconContainer}>
// // //               <View style={[styles.timelineIcon, { backgroundColor: "#FEF3C7" }]}>
// // //                 <MaterialCommunityIcons name="calendar-alert" size={18} color="#F59E0B" />
// // //               </View>
// // //             </View>
// // //             <View style={styles.timelineContent}>
// // //               <Text style={styles.timelineLabel}>Expires Date</Text>
// // //               <Text style={[styles.timelineValue, isExpired && styles.expiredText]}>
// // //                 {formatDateandTime(itemdata?.expires)}
// // //                 {isExpired && " (Expired)"}
// // //               </Text>
// // //             </View>
// // //           </View>
// // //         </View>

// // //         {/* Action Button */}
// // //         <TouchableOpacity
// // //           style={[
// // //             styles.actionButton,
// // //             ( isExpired) && styles.actionButtonDisabled,
// // //           ]}
// // //           onPress={() => {
// // //             console.log({
// // //               ioooc:itemdata?.code
// // //             });

// // //             confirmVisitorMutation.mutate({
// // //               accessCode: itemdata?.code,
// // //             });
// // //           }}
// // //           disabled={confirmVisitorMutation.isPending || isArrived || isExpired}
// // //         >
// // //           {confirmVisitorMutation.isPending ? (
// // //             <ActivityIndicator size="small" color="#FFFFFF" />
// // //           ) : (
// // //             <>
// // //               <MaterialCommunityIcons
// // //                 name={isArrived ? "check-circle" : "account-check"}
// // //                 size={20}
// // //                 color="#FFFFFF"
// // //               />
// // //               <Text style={styles.actionButtonText}>
// // //                 {isArrived ? "Visitor Arrived" : isExpired ? "Invitation Expired" : "Confirm Visitor"}
// // //               </Text>
// // //             </>
// // //           )}
// // //         </TouchableOpacity>
// // //       </View>
// // //     </ScrollView>
// // //   );
// // // };

// // // export default AdminGuestsDetail;

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: "#F9FAFB",
// // //   },
// // //   content: {
// // //     paddingHorizontal: 20,
// // //     paddingTop: 20,
// // //     paddingBottom: 40,
// // //   },
// // //   backButton: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     backgroundColor: "#FFFFFF",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     marginBottom: 20,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 8,
// // //     elevation: 3,
// // //   },
// // //   statusBadge: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     alignSelf: "flex-start",
// // //     paddingHorizontal: 12,
// // //     paddingVertical: 6,
// // //     borderRadius: 20,
// // //     gap: 6,
// // //     marginBottom: 20,
// // //   },
// // //   statusText: {
// // //     fontSize: 12,
// // //     fontWeight: "600",
// // //     letterSpacing: 0.3,
// // //   },
// // //   avatarContainer: {
// // //     alignItems: "center",
// // //     marginBottom: 16,
// // //   },
// // //   avatar: {
// // //     width: 100,
// // //     height: 100,
// // //     borderRadius: 50,
// // //     backgroundColor: "#10B981",
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     shadowColor: "#10B981",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 12,
// // //     elevation: 6,
// // //   },
// // //   avatarText: {
// // //     fontSize: 40,
// // //     fontWeight: "700",
// // //     color: "#FFFFFF",
// // //     letterSpacing: 0.3,
// // //   },
// // //   visitorName: {
// // //     fontSize: 24,
// // //     fontWeight: "700",
// // //     color: "#111827",
// // //     letterSpacing: 0.3,
// // //     textAlign: "center",
// // //     marginBottom: 4,
// // //   },
// // //   visitorRole: {
// // //     fontSize: 14,
// // //     fontWeight: "500",
// // //     color: "#6B7280",
// // //     letterSpacing: 0.3,
// // //     textAlign: "center",
// // //     marginBottom: 24,
// // //   },
// // //   detailsCard: {
// // //     backgroundColor: "#FFFFFF",
// // //     borderRadius: 20,
// // //     padding: 20,
// // //     marginBottom: 20,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 12,
// // //     elevation: 4,
// // //   },
// // //   timelineCard: {
// // //     backgroundColor: "#FFFFFF",
// // //     borderRadius: 20,
// // //     padding: 20,
// // //     marginBottom: 24,
// // //     shadowColor: "#000",
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.05,
// // //     shadowRadius: 12,
// // //     elevation: 4,
// // //   },
// // //   cardHeader: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     marginBottom: 20,
// // //     paddingBottom: 12,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: "#F3F4F6",
// // //   },
// // //   cardTitle: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: "#1F2937",
// // //     letterSpacing: 0.3,
// // //     marginLeft: 8,
// // //   },
// // //   detailsGrid: {
// // //     gap: 16,
// // //   },
// // //   detailItem: {
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     gap: 12,
// // //   },
// // //   detailIcon: {
// // //     width: 40,
// // //     height: 40,
// // //     borderRadius: 12,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //   },
// // //   detailLabel: {
// // //     fontSize: 12,
// // //     fontWeight: "500",
// // //     color: "#6B7280",
// // //     letterSpacing: 0.3,
// // //     marginBottom: 2,
// // //   },
// // //   detailValue: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: "#111827",
// // //     letterSpacing: 0.3,
// // //   },
// // //   accessCode: {
// // //     fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: "#10B981",
// // //   },
// // //   timelineItem: {
// // //     flexDirection: "row",
// // //     marginBottom: 16,
// // //   },
// // //   timelineIconContainer: {
// // //     alignItems: "center",
// // //     marginRight: 16,
// // //   },
// // //   timelineIcon: {
// // //     width: 36,
// // //     height: 36,
// // //     borderRadius: 18,
// // //     justifyContent: "center",
// // //     alignItems: "center",
// // //     zIndex: 1,
// // //   },
// // //   timelineLine: {
// // //     position: "absolute",
// // //     top: 36,
// // //     width: 2,
// // //     height: 40,
// // //     backgroundColor: "#E5E7EB",
// // //   },
// // //   timelineContent: {
// // //     flex: 1,
// // //     paddingBottom: 8,
// // //   },
// // //   timelineLabel: {
// // //     fontSize: 12,
// // //     fontWeight: "500",
// // //     color: "#6B7280",
// // //     letterSpacing: 0.3,
// // //     marginBottom: 4,
// // //   },
// // //   timelineValue: {
// // //     fontSize: 14,
// // //     fontWeight: "600",
// // //     color: "#111827",
// // //     letterSpacing: 0.3,
// // //   },
// // //   expiredText: {
// // //     color: "#DC2626",
// // //   },
// // //   actionButton: {
// // //     backgroundColor: "#10B981",
// // //     flexDirection: "row",
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     gap: 10,
// // //     paddingVertical: 16,
// // //     borderRadius: 16,
// // //     shadowColor: "#10B981",
// // //     shadowOffset: { width: 0, height: 4 },
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 12,
// // //     elevation: 6,
// // //   },
// // //   actionButtonDisabled: {
// // //     backgroundColor: "#9CA3AF",
// // //     shadowOpacity: 0,
// // //   },
// // //   actionButtonText: {
// // //     fontSize: 16,
// // //     fontWeight: "700",
// // //     color: "#FFFFFF",
// // //     letterSpacing: 0.3,
// // //   },
// // // });
// // import {
// //   View,
// //   Text,
// //   TouchableOpacity,
// //   ScrollView,
// //   StyleSheet,
// //   ActivityIndicator,
// //   Platform,
// // } from "react-native";
// // import React from "react";
// // import { MaterialCommunityIcons } from "@expo/vector-icons";
// // import { useRoute, useNavigation } from "@react-navigation/native";
// // import Toast from "react-native-toast-message";
// // import { formatDateandTime } from "../../../utils/DateTime";
// // import { useMutateData_v2 } from "../../../hooks/Requestv2";

// // const AdminGuestsDetail = () => {
// //   const navigation = useNavigation();
// //   const route = useRoute();
// //   const { itemdata } = route.params;

// //   console.log({
// //     ioio: route,
// //   });

// //   // ── Arrive mutation ───────────────────────────────────────────────────────
// //   const arriveMutation = useMutateData_v2(
// //     "api/v1/visitor/estateadmin",
// //     "POST",
// //     undefined,
// //     {
// //       onSuccess: (data) => {
// //         Toast.show({
// //           type: "success",
// //           text1: data?.message || "Visitor confirmed!",
// //         });
// //         navigation.goBack();
// //       },
// //       onError: (error) => {
// //         Toast.show({
// //           type: "error",
// //           text1: error?.data?.message || "Something went wrong",
// //         });
// //       },
// //     },
// //   );

// //   // ── Depart mutation ───────────────────────────────────────────────────────
// //   const departMutation = useMutateData_v2(
// //     "api/v1/visitor/estateadmin/depart",
// //     "POST",
// //     undefined,
// //     {
// //       onSuccess: (data) => {
// //         Toast.show({
// //           type: "success",
// //           text1: data?.message || "Visitor departed!",
// //         });
// //         navigation.goBack();
// //       },
// //       onError: (error) => {
// //         Toast.show({
// //           type: "error",
// //           text1: error?.data?.message || "Something went wrong",
// //         });
// //       },
// //     },
// //   );

// //   const isLoading = arriveMutation.isPending || departMutation.isPending;

// //   // ── Status config ─────────────────────────────────────────────────────────
// //   const getStatusConfig = (status) => {
// //     switch (status) {
// //       case "arrived":
// //         return { bg: "#D1FAE5", text: "#065F46", label: "Arrived" };
// //       case "pending":
// //         return { bg: "#FEF3C7", text: "#92400E", label: "Pending" };
// //       case "departed":
// //         return { bg: "#F3F4F6", text: "#374151", label: "Departed" };
// //       case "expired":
// //         return { bg: "#FEE2E2", text: "#991B1B", label: "Expired" };
// //       default:
// //         return { bg: "#F3F4F6", text: "#374151", label: status || "Unknown" };
// //     }
// //   };

// //   const statusInfo = getStatusConfig(itemdata?.status);
// //   const isArrived = itemdata?.status === "arrived";
// //   const isPending = itemdata?.status === "pending";
// //   const isExpired = new Date(itemdata?.expires) < new Date();
// //   const isDeparted = itemdata?.status === "departed";

// //   // ── Button config ─────────────────────────────────────────────────────────
// //   const getButtonConfig = () => {
// //     if (isExpired) {
// //       return {
// //         label: "Invitation Expired",
// //         icon: "calendar-remove",
// //         color: "#9CA3AF",
// //         disabled: true,
// //         action: null,
// //       };
// //     }
// //     if (isDeparted) {
// //       return {
// //         label: "Visitor Departed",
// //         icon: "check-circle",
// //         color: "#9CA3AF",
// //         disabled: true,
// //         action: null,
// //       };
// //     }
// //     if (isArrived) {
// //       return {
// //         label: "Mark as Departed",
// //         icon: "exit-run",
// //         color: "#DC2626",
// //         disabled: false,
// //         action: () =>
// //           arriveMutation.mutate({ accessCode: itemdata?.access_code }),
// //       };
// //     }
// //     // pending
// //     return {
// //       label: "Confirm Visitor Arrived",
// //       icon: "account-check",
// //       color: "#10B981",
// //       disabled: false,
// //       action: () =>
// //         arriveMutation.mutate({ accessCode: itemdata?.access_code }),
// //     };
// //   };

// //   const buttonConfig = getButtonConfig();

// //   return (
// //     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
// //       <View style={styles.content}>
// //         {/* ── Status badge ──────────────────────────────────────────────── */}
// //         <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
// //           <MaterialCommunityIcons
// //             name={
// //               isArrived
// //                 ? "check-circle"
// //                 : isDeparted
// //                   ? "exit-run"
// //                   : "clock-outline"
// //             }
// //             size={16}
// //             color={statusInfo.text}
// //           />
// //           <Text style={[styles.statusText, { color: statusInfo.text }]}>
// //             {statusInfo.label}
// //           </Text>
// //         </View>

// //         {/* ── Avatar ───────────────────────────────────────────────────── */}
// //         <View style={styles.avatarContainer}>
// //           <View style={styles.avatar}>
// //             <Text style={styles.avatarText}>
// //               {itemdata?.visitor_name?.charAt(0)?.toUpperCase() || "V"}
// //             </Text>
// //           </View>
// //         </View>

// //         <Text style={styles.visitorName}>{itemdata?.visitor_name}</Text>
// //         <Text style={styles.visitorRole}>Guest Visitor</Text>

// //         {/* ── Details card ──────────────────────────────────────────────── */}
// //         <View style={styles.card}>
// //           <View style={styles.cardHeader}>
// //             <MaterialCommunityIcons
// //               name="information"
// //               size={20}
// //               color="#10B981"
// //             />
// //             <Text style={styles.cardTitle}>Invitation Details</Text>
// //           </View>

// //           <View style={styles.detailsGrid}>
// //             <DetailItem
// //               icon="gender-male-female"
// //               iconBg="#DBEAFE"
// //               iconColor="#3B82F6"
// //               label="Gender"
// //               value={itemdata?.gender}
// //             />
// //             <DetailItem
// //               icon="phone"
// //               iconBg="#D1FAE5"
// //               iconColor="#10B981"
// //               label="Phone Number"
// //               value={itemdata?.phone_number}
// //             />
// //             <DetailItem
// //               icon="qrcode"
// //               iconBg="#FEF3C7"
// //               iconColor="#F59E0B"
// //               label="Access Code"
// //               value={itemdata?.access_code}
// //               mono
// //             />
// //             <DetailItem
// //               icon="map-marker"
// //               iconBg="#EDE9FE"
// //               iconColor="#8B5CF6"
// //               label="Address"
// //               value={itemdata?.location}
// //             />
// //           </View>
// //         </View>

// //         {/* ── Timeline card ─────────────────────────────────────────────── */}
// //         <View style={styles.card}>
// //           <View style={styles.cardHeader}>
// //             <MaterialCommunityIcons
// //               name="timeline-clock"
// //               size={20}
// //               color="#10B981"
// //             />
// //             <Text style={styles.cardTitle}>Timeline</Text>
// //           </View>

// //           <TimelineItem
// //             icon="calendar-check"
// //             iconBg="#D1FAE5"
// //             iconColor="#10B981"
// //             label="Arrived At"
// //             value={formatDateandTime(itemdata?.arrived_at) || "Not arrived yet"}
// //             showLine
// //           />
// //           <TimelineItem
// //             icon="exit-run"
// //             iconBg="#FEE2E2"
// //             iconColor="#DC2626"
// //             label="Departed At"
// //             value={
// //               formatDateandTime(itemdata?.departed_at) || "Not departed yet"
// //             }
// //             showLine
// //           />
// //           <TimelineItem
// //             icon="calendar-alert"
// //             iconBg="#FEF3C7"
// //             iconColor="#F59E0B"
// //             label="Expires At"
// //             value={`${formatDateandTime(itemdata?.expires)}${isExpired ? " (Expired)" : ""}`}
// //             valueColor={isExpired ? "#DC2626" : undefined}
// //           />
// //         </View>

// //         {/* ── Action button ─────────────────────────────────────────────── */}
// //         <TouchableOpacity
// //           style={[
// //             styles.actionButton,
// //             { backgroundColor: buttonConfig.color },
// //             buttonConfig.disabled && styles.actionButtonDisabled,
// //           ]}
// //           onPress={buttonConfig.action}
// //           disabled={buttonConfig.disabled || isLoading}
// //         >
// //           {isLoading ? (
// //             <ActivityIndicator size="small" color="#FFFFFF" />
// //           ) : (
// //             <>
// //               <MaterialCommunityIcons
// //                 name={buttonConfig.icon}
// //                 size={20}
// //                 color="#FFFFFF"
// //               />
// //               <Text style={styles.actionButtonText}>{buttonConfig.label}</Text>
// //             </>
// //           )}
// //         </TouchableOpacity>
// //       </View>
// //     </ScrollView>
// //   );
// // };

// // // ─── Detail item ──────────────────────────────────────────────────────────────
// // const DetailItem = ({ icon, iconBg, iconColor, label, value, mono }) => (
// //   <View style={styles.detailItem}>
// //     <View style={[styles.detailIcon, { backgroundColor: iconBg }]}>
// //       <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
// //     </View>
// //     <View style={{ flex: 1 }}>
// //       <Text style={styles.detailLabel}>{label}</Text>
// //       <Text style={[styles.detailValue, mono && styles.monoValue]}>
// //         {value || "N/A"}
// //       </Text>
// //     </View>
// //   </View>
// // );

// // // ─── Timeline item ────────────────────────────────────────────────────────────
// // const TimelineItem = ({
// //   icon,
// //   iconBg,
// //   iconColor,
// //   label,
// //   value,
// //   showLine,
// //   valueColor,
// // }) => (
// //   <View style={styles.timelineItem}>
// //     <View style={styles.timelineIconContainer}>
// //       <View style={[styles.timelineIcon, { backgroundColor: iconBg }]}>
// //         <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
// //       </View>
// //       {showLine && <View style={styles.timelineLine} />}
// //     </View>
// //     <View style={styles.timelineContent}>
// //       <Text style={styles.timelineLabel}>{label}</Text>
// //       <Text style={[styles.timelineValue, valueColor && { color: valueColor }]}>
// //         {value}
// //       </Text>
// //     </View>
// //   </View>
// // );

// // export default AdminGuestsDetail;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#F9FAFB",
// //   },
// //   content: {
// //     paddingHorizontal: 20,
// //     paddingTop: 20,
// //     paddingBottom: 40,
// //   },
// //   statusBadge: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     alignSelf: "flex-start",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 20,
// //     gap: 6,
// //     marginBottom: 20,
// //   },
// //   statusText: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //     letterSpacing: 0.3,
// //   },
// //   avatarContainer: {
// //     alignItems: "center",
// //     marginBottom: 16,
// //   },
// //   avatar: {
// //     width: 100,
// //     height: 100,
// //     borderRadius: 50,
// //     backgroundColor: "#10B981",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     shadowColor: "#10B981",
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 12,
// //     elevation: 6,
// //   },
// //   avatarText: {
// //     fontSize: 40,
// //     fontWeight: "700",
// //     color: "#FFFFFF",
// //   },
// //   visitorName: {
// //     fontSize: 24,
// //     fontWeight: "700",
// //     color: "#111827",
// //     letterSpacing: 0.3,
// //     textAlign: "center",
// //     marginBottom: 4,
// //   },
// //   visitorRole: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //     color: "#6B7280",
// //     textAlign: "center",
// //     marginBottom: 24,
// //   },
// //   card: {
// //     backgroundColor: "#FFFFFF",
// //     borderRadius: 20,
// //     padding: 20,
// //     marginBottom: 20,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 12,
// //     elevation: 4,
// //   },
// //   cardHeader: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 20,
// //     paddingBottom: 12,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#F3F4F6",
// //   },
// //   cardTitle: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: "#1F2937",
// //     letterSpacing: 0.3,
// //     marginLeft: 8,
// //   },
// //   detailsGrid: {
// //     gap: 16,
// //   },
// //   detailItem: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     gap: 12,
// //   },
// //   detailIcon: {
// //     width: 40,
// //     height: 40,
// //     borderRadius: 12,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// //   detailLabel: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //     color: "#6B7280",
// //     marginBottom: 2,
// //   },
// //   detailValue: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: "#111827",
// //   },
// //   monoValue: {
// //     fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
// //     fontSize: 15,
// //     fontWeight: "700",
// //     color: "#10B981",
// //   },
// //   timelineItem: {
// //     flexDirection: "row",
// //     marginBottom: 16,
// //   },
// //   timelineIconContainer: {
// //     alignItems: "center",
// //     marginRight: 16,
// //   },
// //   timelineIcon: {
// //     width: 36,
// //     height: 36,
// //     borderRadius: 18,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     zIndex: 1,
// //   },
// //   timelineLine: {
// //     position: "absolute",
// //     top: 36,
// //     width: 2,
// //     height: 32,
// //     backgroundColor: "#E5E7EB",
// //   },
// //   timelineContent: {
// //     flex: 1,
// //     paddingBottom: 8,
// //   },
// //   timelineLabel: {
// //     fontSize: 12,
// //     fontWeight: "500",
// //     color: "#6B7280",
// //     marginBottom: 4,
// //   },
// //   timelineValue: {
// //     fontSize: 14,
// //     fontWeight: "600",
// //     color: "#111827",
// //   },
// //   actionButton: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     justifyContent: "center",
// //     gap: 10,
// //     paddingVertical: 16,
// //     borderRadius: 16,
// //     shadowOffset: { width: 0, height: 4 },
// //     shadowOpacity: 0.3,
// //     shadowRadius: 12,
// //     elevation: 6,
// //   },
// //   actionButtonDisabled: {
// //     backgroundColor: "#9CA3AF",
// //     shadowOpacity: 0,
// //     elevation: 0,
// //   },
// //   actionButtonText: {
// //     fontSize: 16,
// //     fontWeight: "700",
// //     color: "#FFFFFF",
// //     letterSpacing: 0.3,
// //   },
// // });

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   ActivityIndicator,
//   Platform,
// } from "react-native";
// import React from "react";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRoute, useNavigation } from "@react-navigation/native";
// import Toast from "react-native-toast-message";
// import { formatDateandTime } from "../../../utils/DateTime";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

// const AdminGuestsDetail = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { itemdata } = route.params;

//   // ── Detect where data is coming from ─────────────────────────────────────
//   // From scan:  { code: "QHQ979", name: "...", expires: "..." }
//   // From list:  { _id: "...", access_code: "QHQ979", visitor_name: "...", status: "...", ... }
//   const isFromScan = !!itemdata?.code && !itemdata?._id;
//   const accessCode = itemdata?.access_code || itemdata?.code;

//   // ── Fetch full record only when coming from scan ──────────────────────────
//   const {
//     data: fetchedResponse,
//     isLoading: isFetching,
//     isError: isFetchError,
//     refetch,
//   } = useFetchData_v2(
//     `api/v1/visitor/estateadmin?search=${accessCode}&page=1&limit=1`,
//     `guest-detail-${accessCode}`,
//     { enabled: isFromScan },
//   );

//   // ── Resolve final guest data ──────────────────────────────────────────────
//   // If from scan → use first result from search
//   // If from list → use itemdata directly
//   const guestData = isFromScan ? fetchedResponse?.userInvites?.[0] : itemdata;

//   // ── Loading state (only when fetching from scan) ──────────────────────────
//   if (isFromScan && isFetching) {
//     return (
//       <View style={styles.centered}>
//         <ActivityIndicator size="large" color="#10B981" />
//         <Text style={styles.loadingText}>Loading visitor details...</Text>
//       </View>
//     );
//   }

//   // ── Error or not found ────────────────────────────────────────────────────
//   if (isFromScan && (isFetchError || !guestData)) {
//     return (
//       <View style={styles.centered}>
//         <MaterialCommunityIcons
//           name="alert-circle-outline"
//           size={48}
//           color="#EF4444"
//         />
//         <Text style={styles.errorText}>
//           Could not find visitor with code "{accessCode}"
//         </Text>
//         <TouchableOpacity style={styles.retryButton} onPress={refetch}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   // ── Mutations ─────────────────────────────────────────────────────────────
//   // Single endpoint handles both arrive and depart based on current status
//   const visitorMutation = useMutateData_v2(
//     "api/v1/visitor/estateadmin",
//     "POST",
//     undefined,
//     {
//       onSuccess: (data) => {
//         Toast.show({
//           type: "success",
//           text1: data?.message || "Status updated!",
//         });
//         if (isFromScan) {
//           refetch();
//         } else {
//           navigation.goBack();
//         }
//       },
//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: error?.data?.message || "Something went wrong",
//         });
//       },
//     },
//   );

//   // ── Status config ─────────────────────────────────────────────────────────
//   const getStatusConfig = (status) => {
//     switch (status) {
//       case "arrived":
//         return { bg: "#D1FAE5", text: "#065F46", label: "Arrived" };
//       case "pending":
//         return { bg: "#FEF3C7", text: "#92400E", label: "Pending" };
//       case "departed":
//         return { bg: "#F3F4F6", text: "#374151", label: "Departed" };
//       default:
//         return { bg: "#F3F4F6", text: "#374151", label: status || "Unknown" };
//     }
//   };

//   const status = guestData?.status || "pending";
//   const statusInfo = getStatusConfig(status);
//   const isArrived = status === "arrived";
//   const isDeparted = status === "departed";
//   const isExpired = new Date(guestData?.expires) < new Date();

//   // ── Button config ─────────────────────────────────────────────────────────
//   const getButtonConfig = () => {
//     if (isExpired && !isArrived) {
//       return {
//         label: "Invitation Expired",
//         icon: "calendar-remove",
//         color: "#9CA3AF",
//         disabled: true,
//       };
//     }
//     if (isDeparted) {
//       return {
//         label: "Visitor Departed",
//         icon: "check-circle",
//         color: "#9CA3AF",
//         disabled: true,
//       };
//     }
//     if (isArrived) {
//       return {
//         label: "Mark as Departed",
//         icon: "exit-run",
//         color: "#DC2626",
//         disabled: false,
//       };
//     }
//     return {
//       label: "Confirm Visitor Arrived",
//       icon: "account-check",
//       color: "#10B981",
//       disabled: false,
//     };
//   };

//   const buttonConfig = getButtonConfig();

//   const handleAction = () => {
//     visitorMutation.mutate({ accessCode: guestData?.access_code });
//   };

//   return (
//     <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
//       <View style={styles.content}>
//         {/* ── Status badge ──────────────────────────────────────────────── */}
//         <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
//           <MaterialCommunityIcons
//             name={
//               isArrived
//                 ? "check-circle"
//                 : isDeparted
//                   ? "exit-run"
//                   : "clock-outline"
//             }
//             size={16}
//             color={statusInfo.text}
//           />
//           <Text style={[styles.statusText, { color: statusInfo.text }]}>
//             {statusInfo.label}
//           </Text>
//         </View>

//         {/* ── Avatar ───────────────────────────────────────────────────── */}
//         <View style={styles.avatarContainer}>
//           <View style={styles.avatar}>
//             <Text style={styles.avatarText}>
//               {guestData?.visitor_name?.charAt(0)?.toUpperCase() || "V"}
//             </Text>
//           </View>
//         </View>

//         <Text style={styles.visitorName}>{guestData?.visitor_name}</Text>
//         <Text style={styles.visitorRole}>Guest Visitor</Text>

//         {/* ── Details card ──────────────────────────────────────────────── */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialCommunityIcons
//               name="information"
//               size={20}
//               color="#10B981"
//             />
//             <Text style={styles.cardTitle}>Invitation Details</Text>
//           </View>
//           <View style={styles.detailsGrid}>
//             <DetailItem
//               icon="gender-male-female"
//               iconBg="#DBEAFE"
//               iconColor="#3B82F6"
//               label="Gender"
//               value={guestData?.gender}
//             />
//             <DetailItem
//               icon="phone"
//               iconBg="#D1FAE5"
//               iconColor="#10B981"
//               label="Phone Number"
//               value={guestData?.phone_number?.toString()}
//             />
//             <DetailItem
//               icon="qrcode"
//               iconBg="#FEF3C7"
//               iconColor="#F59E0B"
//               label="Access Code"
//               value={guestData?.access_code}
//               mono
//             />
//             <DetailItem
//               icon="map-marker"
//               iconBg="#EDE9FE"
//               iconColor="#8B5CF6"
//               label="Address"
//               value={guestData?.location}
//             />
//           </View>
//         </View>

//         {/* ── Timeline card ─────────────────────────────────────────────── */}
//         <View style={styles.card}>
//           <View style={styles.cardHeader}>
//             <MaterialCommunityIcons
//               name="timeline-clock"
//               size={20}
//               color="#10B981"
//             />
//             <Text style={styles.cardTitle}>Timeline</Text>
//           </View>
//           <TimelineItem
//             icon="calendar-check"
//             iconBg="#D1FAE5"
//             iconColor="#10B981"
//             label="Arrived At"
//             value={
//               formatDateandTime(guestData?.arrived_at) || "Not arrived yet"
//             }
//             showLine
//           />
//           <TimelineItem
//             icon="exit-run"
//             iconBg="#FEE2E2"
//             iconColor="#DC2626"
//             label="Departed At"
//             value={
//               formatDateandTime(guestData?.departed_at) || "Not departed yet"
//             }
//             showLine
//           />
//           <TimelineItem
//             icon="calendar-alert"
//             iconBg="#FEF3C7"
//             iconColor="#F59E0B"
//             label="Expires At"
//             value={`${formatDateandTime(guestData?.expires)}${isExpired ? " (Expired)" : ""}`}
//             valueColor={isExpired ? "#DC2626" : undefined}
//           />
//         </View>

//         {/* ── Action button ─────────────────────────────────────────────── */}
//         <TouchableOpacity
//           style={[
//             styles.actionButton,
//             { backgroundColor: buttonConfig.color },
//             buttonConfig.disabled && styles.actionButtonDisabled,
//           ]}
//           onPress={handleAction}
//           disabled={buttonConfig.disabled || visitorMutation.isPending}
//         >
//           {visitorMutation.isPending ? (
//             <ActivityIndicator size="small" color="#FFFFFF" />
//           ) : (
//             <>
//               <MaterialCommunityIcons
//                 name={buttonConfig.icon}
//                 size={20}
//                 color="#FFFFFF"
//               />
//               <Text style={styles.actionButtonText}>{buttonConfig.label}</Text>
//             </>
//           )}
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// // ─── Detail item ──────────────────────────────────────────────────────────────
// const DetailItem = ({ icon, iconBg, iconColor, label, value, mono }) => (
//   <View style={styles.detailItem}>
//     <View style={[styles.detailIcon, { backgroundColor: iconBg }]}>
//       <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
//     </View>
//     <View style={{ flex: 1 }}>
//       <Text style={styles.detailLabel}>{label}</Text>
//       <Text style={[styles.detailValue, mono && styles.monoValue]}>
//         {value || "N/A"}
//       </Text>
//     </View>
//   </View>
// );

// // ─── Timeline item ────────────────────────────────────────────────────────────
// const TimelineItem = ({
//   icon,
//   iconBg,
//   iconColor,
//   label,
//   value,
//   showLine,
//   valueColor,
// }) => (
//   <View style={styles.timelineItem}>
//     <View style={styles.timelineIconContainer}>
//       <View style={[styles.timelineIcon, { backgroundColor: iconBg }]}>
//         <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
//       </View>
//       {showLine && <View style={styles.timelineLine} />}
//     </View>
//     <View style={styles.timelineContent}>
//       <Text style={styles.timelineLabel}>{label}</Text>
//       <Text style={[styles.timelineValue, valueColor && { color: valueColor }]}>
//         {value}
//       </Text>
//     </View>
//   </View>
// );

// export default AdminGuestsDetail;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB" },
//   content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
//   centered: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//     marginTop: 100,
//   },
//   loadingText: { marginTop: 12, color: "#6B7280", fontSize: 14 },
//   errorText: {
//     color: "#EF4444",
//     marginTop: 12,
//     marginBottom: 16,
//     fontSize: 14,
//     textAlign: "center",
//   },
//   retryButton: {
//     backgroundColor: "#10B981",
//     paddingHorizontal: 24,
//     paddingVertical: 10,
//     borderRadius: 10,
//   },
//   retryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
//   statusBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     alignSelf: "flex-start",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     gap: 6,
//     marginBottom: 20,
//   },
//   statusText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
//   avatarContainer: { alignItems: "center", marginBottom: 16 },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     backgroundColor: "#10B981",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   avatarText: { fontSize: 40, fontWeight: "700", color: "#FFFFFF" },
//   visitorName: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//     textAlign: "center",
//     marginBottom: 4,
//   },
//   visitorRole: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//     textAlign: "center",
//     marginBottom: 24,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//     marginLeft: 8,
//   },
//   detailsGrid: { gap: 16 },
//   detailItem: { flexDirection: "row", alignItems: "center", gap: 12 },
//   detailIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   detailLabel: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginBottom: 2,
//   },
//   detailValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
//   monoValue: {
//     fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
//     fontSize: 15,
//     fontWeight: "700",
//     color: "#10B981",
//   },
//   timelineItem: { flexDirection: "row", marginBottom: 16 },
//   timelineIconContainer: { alignItems: "center", marginRight: 16 },
//   timelineIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 1,
//   },
//   timelineLine: {
//     position: "absolute",
//     top: 36,
//     width: 2,
//     height: 32,
//     backgroundColor: "#E5E7EB",
//   },
//   timelineContent: { flex: 1, paddingBottom: 8 },
//   timelineLabel: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginBottom: 4,
//   },
//   timelineValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
//   actionButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 10,
//     paddingVertical: 16,
//     borderRadius: 16,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 6,
//   },
//   actionButtonDisabled: {
//     backgroundColor: "#9CA3AF",
//     shadowOpacity: 0,
//     elevation: 0,
//   },
//   actionButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },
// });

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { formatDateandTime } from "../../../utils/DateTime";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const AdminGuestsDetail = () => {
  // ── ALL HOOKS FIRST — no early returns before this point ─────────────────
  const navigation = useNavigation();
  const route = useRoute();
  const { itemdata } = route.params;

  // Detect source
  const isFromScan = !!itemdata?.code && !itemdata?._id;
  const accessCode = itemdata?.access_code || itemdata?.code;

  // Always call useFetchData_v2 — disabled when not from scan
  const {
    data: fetchedResponse,
    isLoading: isFetching,
    isError: isFetchError,
    refetch,
  } = useFetchData_v2(
    `api/v1/visitor/estateadmin?search=${accessCode}&page=1&limit=1`,
    `guest-detail-${accessCode}`,
    { enabled: isFromScan },
  );

  // Always call useMutateData_v2
  const visitorMutation = useMutateData_v2(
    "api/v1/visitor/estateadmin",
    "POST",
    undefined,
    {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: data?.message || "Status updated!",
        });
        if (isFromScan) {
          refetch();
        } else {
          navigation.goBack();
        }
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Something went wrong",
        });
      },
    },
  );

  // ── All hooks done — now safe to do conditional rendering ─────────────────

  // Resolve final data
  const guestData = isFromScan ? fetchedResponse?.userInvites?.[0] : itemdata;

  const status = guestData?.status || "pending";
  const isArrived = status === "arrived";
  const isDeparted = status === "departed";
  const isExpired = guestData?.expires
    ? new Date(guestData.expires) < new Date()
    : false;

  const getStatusConfig = (s) => {
    switch (s) {
      case "arrived":
        return { bg: "#D1FAE5", text: "#065F46", label: "Arrived" };
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E", label: "Pending" };
      case "departed":
        return { bg: "#F3F4F6", text: "#374151", label: "Departed" };
      default:
        return { bg: "#F3F4F6", text: "#374151", label: s || "Unknown" };
    }
  };

  const statusInfo = getStatusConfig(status);

  const getButtonConfig = () => {
    if (isExpired && !isArrived) {
      return {
        label: "Invitation Expired",
        icon: "calendar-remove",
        color: "#9CA3AF",
        disabled: true,
      };
    }
    if (isDeparted) {
      return {
        label: "Visitor Departed",
        icon: "check-circle",
        color: "#9CA3AF",
        disabled: true,
      };
    }
    if (isArrived) {
      return {
        label: "Mark as Departed",
        icon: "exit-run",
        color: "#DC2626",
        disabled: false,
      };
    }
    return {
      label: "Confirm Visitor Arrived",
      icon: "account-check",
      color: "#10B981",
      disabled: false,
    };
  };

  const buttonConfig = getButtonConfig();

  const handleAction = () => {
    visitorMutation.mutate({ accessCode: guestData?.access_code });
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isFromScan && isFetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading visitor details...</Text>
      </View>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (isFromScan && (isFetchError || !guestData)) {
    return (
      <View style={styles.centered}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color="#EF4444"
        />
        <Text style={styles.errorText}>
          Could not find visitor with code "{accessCode}"
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* ── Status badge ──────────────────────────────────────────────── */}
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <MaterialCommunityIcons
            name={
              isArrived
                ? "check-circle"
                : isDeparted
                  ? "exit-run"
                  : "clock-outline"
            }
            size={16}
            color={statusInfo.text}
          />
          <Text style={[styles.statusText, { color: statusInfo.text }]}>
            {statusInfo.label}
          </Text>
        </View>

        {/* ── Avatar ───────────────────────────────────────────────────── */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {guestData?.visitor_name?.charAt(0)?.toUpperCase() || "V"}
            </Text>
          </View>
        </View>

        <Text style={styles.visitorName}>{guestData?.visitor_name}</Text>
        <Text style={styles.visitorRole}>Guest Visitor</Text>

        {/* ── Details card ──────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#10B981"
            />
            <Text style={styles.cardTitle}>Invitation Details</Text>
          </View>
          <View style={styles.detailsGrid}>
            <DetailItem
              icon="gender-male-female"
              iconBg="#DBEAFE"
              iconColor="#3B82F6"
              label="Gender"
              value={guestData?.gender}
            />
            <DetailItem
              icon="phone"
              iconBg="#D1FAE5"
              iconColor="#10B981"
              label="Phone Number"
              value={guestData?.phone_number?.toString()}
            />
            <DetailItem
              icon="qrcode"
              iconBg="#FEF3C7"
              iconColor="#F59E0B"
              label="Access Code"
              value={guestData?.access_code}
              mono
            />
            <DetailItem
              icon="map-marker"
              iconBg="#EDE9FE"
              iconColor="#8B5CF6"
              label="Address"
              value={guestData?.location}
            />
          </View>
        </View>

        {/* ── Timeline card ─────────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons
              name="timeline-clock"
              size={20}
              color="#10B981"
            />
            <Text style={styles.cardTitle}>Timeline</Text>
          </View>
          <TimelineItem
            icon="calendar-check"
            iconBg="#D1FAE5"
            iconColor="#10B981"
            label="Arrived At"
            value={
              formatDateandTime(guestData?.arrived_at) || "Not arrived yet"
            }
            showLine
          />
          <TimelineItem
            icon="exit-run"
            iconBg="#FEE2E2"
            iconColor="#DC2626"
            label="Departed At"
            value={
              formatDateandTime(guestData?.departed_at) || "Not departed yet"
            }
            showLine
          />
          <TimelineItem
            icon="calendar-alert"
            iconBg="#FEF3C7"
            iconColor="#F59E0B"
            label="Expires At"
            value={`${formatDateandTime(guestData?.expires)}${isExpired ? " (Expired)" : ""}`}
            valueColor={isExpired ? "#DC2626" : undefined}
          />
        </View>

        {/* ── Action button ─────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: buttonConfig.color },
            buttonConfig.disabled && styles.actionButtonDisabled,
          ]}
          onPress={handleAction}
          disabled={buttonConfig.disabled || visitorMutation.isPending}
        >
          {visitorMutation.isPending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons
                name={buttonConfig.icon}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.actionButtonText}>{buttonConfig.label}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ─── Detail item ──────────────────────────────────────────────────────────────
const DetailItem = ({ icon, iconBg, iconColor, label, value, mono }) => (
  <View style={styles.detailItem}>
    <View style={[styles.detailIcon, { backgroundColor: iconBg }]}>
      <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, mono && styles.monoValue]}>
        {value || "N/A"}
      </Text>
    </View>
  </View>
);

// ─── Timeline item ────────────────────────────────────────────────────────────
const TimelineItem = ({
  icon,
  iconBg,
  iconColor,
  label,
  value,
  showLine,
  valueColor,
}) => (
  <View style={styles.timelineItem}>
    <View style={styles.timelineIconContainer}>
      <View style={[styles.timelineIcon, { backgroundColor: iconBg }]}>
        <MaterialCommunityIcons name={icon} size={18} color={iconColor} />
      </View>
      {showLine && <View style={styles.timelineLine} />}
    </View>
    <View style={styles.timelineContent}>
      <Text style={styles.timelineLabel}>{label}</Text>
      <Text style={[styles.timelineValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  </View>
);

export default AdminGuestsDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 100,
  },
  loadingText: { marginTop: 12, color: "#6B7280", fontSize: 14 },
  errorText: {
    color: "#EF4444",
    marginTop: 12,
    marginBottom: 16,
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 20,
  },
  statusText: { fontSize: 12, fontWeight: "600", letterSpacing: 0.3 },
  avatarContainer: { alignItems: "center", marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarText: { fontSize: 40, fontWeight: "700", color: "#FFFFFF" },
  visitorName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    textAlign: "center",
    marginBottom: 4,
  },
  visitorRole: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  detailsGrid: { gap: 16 },
  detailItem: { flexDirection: "row", alignItems: "center", gap: 12 },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 2,
  },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  monoValue: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
  },
  timelineItem: { flexDirection: "row", marginBottom: 16 },
  timelineIconContainer: { alignItems: "center", marginRight: 16 },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  timelineLine: {
    position: "absolute",
    top: 36,
    width: 2,
    height: 32,
    backgroundColor: "#E5E7EB",
  },
  timelineContent: { flex: 1, paddingBottom: 8 },
  timelineLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  timelineValue: { fontSize: 14, fontWeight: "600", color: "#111827" },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  actionButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});
