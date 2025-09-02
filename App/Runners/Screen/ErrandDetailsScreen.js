// // import React, { useState } from "react";
// // import {
// //   View,
// //   Text,
// //   ScrollView,
// //   TouchableOpacity,
// //   StyleSheet,
// //   Alert,
// //   Linking,
// //   Image,
// //   FlatList,
// // } from "react-native";
// // import { SafeAreaView } from "react-native-safe-area-context";
// // import { useMutateData } from "../../../hooks/Request";
// // import Toast from "react-native-toast-message";
// // import { useNavigation } from "@react-navigation/native";

// // const ErrandDetailsScreen = ({ route }) => {
// //   const { errand } = route.params || {};
// //   const navigation = useNavigation();

// //   console.log({
// //     vvb: errand?._id,
// //   });

// //   const [errandStatus, setErrandStatus] = useState(errand?.status || "pending"); // pending, accepted, in_progress, completed
// //   const [currentStep, setCurrentStep] = useState(0);

// //   const steps = [
// //     { id: 1, title: "Errand Accepted", completed: errandStatus !== "pending" },
// //     {
// //       id: 2,
// //       title: "Heading to Pickup",
// //       completed: ["in_progress", "completed"].includes(errandStatus),
// //     },
// //     {
// //       id: 3,
// //       title: "At Pickup Location",
// //       completed: errandStatus === "completed",
// //     },
// //     {
// //       id: 4,
// //       title: "Heading to Delivery",
// //       completed: errandStatus === "completed",
// //     },
// //     {
// //       id: 5,
// //       title: "Errand Completed",
// //       completed: errandStatus === "completed",
// //     },
// //   ];

// //   const handleCallCustomer = () => {
// //     Alert.alert("Call Customer", `Call ${errand?.user?.name}?`, [
// //       { text: "Cancel", style: "cancel" },
// //       {
// //         text: "Call",
// //         onPress: () => Linking.openURL(`tel:${errand?.phoneNumber}`),
// //       },
// //     ]);
// //   };

// //   const handleNavigateToLocation = (address) => {
// //     const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
// //       address
// //     )}`;
// //     Linking.openURL(url);
// //   };

// //   const {
// //     mutate: assignedErrand,
// //     isLoading: assignedErrandispending,
// //     error: assignedErranderror,
// //   } = useMutateData("api/v1/runner/errands", "PATCH", "geterrandinfo");

// //   const handleUpdateStatus = (newStatus) => {
// //     let data = {
// //       status: newStatus,
// //       errandId: errand?._id,
// //     };

// //     console.log({
// //       gg: data,
// //     });

// //     assignedErrand(data, {
// //       onSuccess: (response) => {
// //         console.log({ jaja: response });

// //         // Show success alert
// //         Alert.alert("Success", "Status updated successfully", [{ text: "OK" }]);
// //         navigation.goBack();
// //       },
// //       onError: (error) => {
// //         console.log({ errorDetails: error?.response });

// //         const errorMessage =
// //           error.message ||
// //           error.response?.data?.message ||
// //           "Failed to update status";

// //         Alert.alert("Error", errorMessage, [{ text: "OK" }]);
// //       },
// //     });
// //   };

// //   const handleEmergency = () => {
// //     Alert.alert("Emergency", "What type of emergency?", [
// //       { text: "Cancel", style: "cancel" },
// //       {
// //         text: "Call Support",
// //         onPress: () => Linking.openURL("tel:+2341234567890"),
// //       },
// //       { text: "Call Emergency", onPress: () => Linking.openURL("tel:199") },
// //     ]);
// //   };

// //   const renderPickupLocation = ({ item }) => (
// //     <View style={styles.locationItem}>
// //       <View style={styles.locationHeader}>
// //         <Text style={styles.locationTitle}>📍 {item.name}</Text>
// //         <TouchableOpacity
// //           style={styles.navigateButton}
// //           onPress={() => handleNavigateToLocation(item.address)}
// //         >
// //           <Text style={styles.navigateText}>Navigate</Text>
// //         </TouchableOpacity>
// //       </View>
// //       <Text style={styles.locationAddress}>{item.address}</Text>

// //       <Text style={styles.sectionSubtitle}>Items to Pickup:</Text>

// //       <FlatList
// //         data={item.items}
// //         renderItem={renderItem}
// //         keyExtractor={(item, index) => index.toString()}
// //       />
// //     </View>
// //   );

// //   const renderItem = ({ item }) => (
// //     <View style={styles.itemRow}>
// //       <View style={styles.itemInfo}>
// //         <Text style={styles.itemName}>{item.name}</Text>
// //         <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
// //         {item.description && (
// //           <Text style={styles.itemNotes}>Note: {item.description}</Text>
// //         )}

// //         <Image
// //           source={{ uri: item?.images[0] }}
// //           style={{ width: 200, height: 200, resizeMode: "cover" }}
// //         />
// //       </View>

// //       {console.log({
// //         dddd: item,
// //       })}
// //       <View style={styles.itemCheckbox}>
// //         <Text style={styles.checkboxText}>₦{item?.price}</Text>
// //       </View>
// //     </View>
// //   );

// //   if (!errand) {
// //     return (
// //       <SafeAreaView style={styles.container}>
// //         <Text>No errand data available</Text>
// //       </SafeAreaView>
// //     );
// //   }

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <ScrollView>
// //         {/* Errand Overview */}
// //         <View style={styles.overviewCard}>
// //           <View style={styles.titleRow}>
// //             <Text style={styles.errandTitle}>{errand.title}</Text>
// //             <View style={styles.paymentContainer}>
// //               <Text style={styles.payment}>
// //                 ₦{errand.totalAmount?.toFixed(2)}
// //               </Text>
// //             </View>
// //           </View>
// //           <Text style={styles.description}>{errand.description}</Text>
// //           <View style={styles.errandMeta}>
// //             <Text style={styles.metaText}>
// //               🏷️ {errand.clan?.name || "No clan"}
// //             </Text>
// //             <Text style={styles.metaText}>
// //               ⏱️ {new Date(errand.createdAt).toLocaleString()}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Progress Tracker */}
// //         <View style={styles.progressCard}>
// //           <Text style={styles.cardTitle}>Progress </Text>
// //           {steps.map((step) => (
// //             <View key={step.id} style={styles.progressStep}>
// //               <View
// //                 style={[
// //                   styles.progressDot,
// //                   { backgroundColor: step.completed ? "#4CAF50" : "#ddd" },
// //                 ]}
// //               />
// //               <Text
// //                 style={[
// //                   styles.progressText,
// //                   { color: step.completed ? "#4CAF50" : "#666" },
// //                 ]}
// //               >
// //                 {step.title}
// //               </Text>
// //             </View>
// //           ))}
// //         </View>

// //         {/* Customer Information */}
// //         <View style={styles.customerCard}>
// //           <Text style={styles.cardTitle}>Customer Information</Text>
// //           <View style={styles.customerInfo}>
// //             <View style={styles.customerAvatar}>
// //               <Text style={styles.avatarText}>
// //                 {errand.user?.name
// //                   ?.split(" ")
// //                   .map((n) => n[0])
// //                   .join("")}
// //               </Text>
// //             </View>
// //             <View style={styles.customerDetails}>
// //               <Text style={styles.customerName}>{errand.user?.name}</Text>
// //               <Text style={styles.customerEmail}>{errand.user?.email}</Text>
// //               <Text style={styles.customerEmail}>{errand?.phoneNumber}</Text>
// //             </View>
// //             <TouchableOpacity
// //               style={styles.callButton}
// //               onPress={handleCallCustomer}
// //             >
// //               <Text style={styles.callButtonText}>📞 Call</Text>
// //             </TouchableOpacity>
// //           </View>
// //         </View>

// //         {errand.type === "shopping" && (
// //           <View style={styles.locationsCard}>
// //             <Text style={styles.cardTitle}>Pickup Locations </Text>
// //             <FlatList
// //               data={errand.pickupLocations}
// //               renderItem={renderPickupLocation}
// //               keyExtractor={(item, index) => index.toString()}
// //               scrollEnabled={false}
// //             />
// //           </View>
// //         )}

// //         {/* If pickup, show attached images (optional) */}
// //         {errand.type === "pickup" && errand.images?.length > 0 && (
// //           <View style={styles.locationsCard}>
// //             <Text style={styles.cardTitle}>Pickup Item</Text>
// //             {errand.images.map((img, idx) => (
// //               <Image
// //                 key={idx}
// //                 source={{ uri: img.url }}
// //                 style={{
// //                   width: "100%",
// //                   height: 200,
// //                   borderRadius: 10,
// //                   marginVertical: 10,
// //                 }}
// //                 resizeMode="cover"
// //               />
// //             ))}
// //             <Text style={styles.description}>{errand.description}</Text>
// //           </View>
// //         )}

// //         {/* Pickup Locations */}
// //         <View style={styles.locationsCard}>
// //           <Text style={styles.cardTitle}>Pickup Locations </Text>
// //           <FlatList
// //             data={errand.pickupLocations}
// //             renderItem={renderPickupLocation}
// //             keyExtractor={(item, index) => index.toString()}
// //             scrollEnabled={false}
// //           />
// //         </View>

// //         {/* Delivery Location */}
// //         <View style={styles.locationsCard}>
// //           <Text style={styles.cardTitle}>Delivery Location</Text>
// //           <View style={styles.locationItem}>
// //             <View style={styles.locationHeader}>
// //               <Text style={styles.locationTitle}>🎯 Delivery Address</Text>
// //               <TouchableOpacity
// //                 style={styles.navigateButton}
// //                 onPress={() => handleNavigateToLocation(errand.deliveryAddress)}
// //               >
// //                 <Text style={styles.navigateText}>Navigate</Text>
// //               </TouchableOpacity>
// //             </View>
// //             <Text style={styles.locationAddress}>{errand.deliveryAddress}</Text>
// //           </View>
// //         </View>

// //         {/* Payment Breakdown */}
// //         <View style={styles.instructionsCard}>
// //           <Text style={styles.cardTitle}>Payment Breakdown</Text>
// //           <View style={styles.paymentRow}>
// //             <Text style={styles.paymentLabel}>Items Total:</Text>
// //             <Text style={styles.paymentValue}>₦{errand.totalPrice}</Text>
// //           </View>
// //           <View style={styles.paymentRow}>
// //             <Text style={styles.paymentLabel}>Service Charge:</Text>
// //             <Text style={styles.paymentValue}>₦{errand.serviceCharge}</Text>
// //           </View>
// //           <View style={[styles.paymentRow, styles.totalPaymentRow]}>
// //             <Text style={[styles.paymentLabel, styles.totalPaymentLabel]}>
// //               Total:
// //             </Text>
// //             <Text style={[styles.paymentValue, styles.totalPaymentValue]}>
// //               ₦{errand.totalAmount}
// //             </Text>
// //           </View>
// //         </View>

// //         {/* Action Buttons */}
// //         <View style={styles.actionButtons}>
// //           {errandStatus === "pending" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("accepted")}
// //             >
// //               <Text style={styles.primaryButtonText}>Accept Errand</Text>
// //             </TouchableOpacity>
// //           )}

// //           {/* "pending",
// //         "assigned",
// //         "en_route",
// //         "picked_up",
// //         "delivered",
// //         "completed",
// //         "cancelled", */}

// //           {/* {errandStatus === "assigned" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("en_route")}
// //             >
// //               <Text style={styles.primaryButtonText}>Start Errand</Text>
// //             </TouchableOpacity>
// //           )}

// //           {errandStatus === "en_route" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("picked_up")}
// //             >
// //               <Text style={styles.primaryButtonText}>Complete Errand</Text>
// //             </TouchableOpacity>
// //           )} */}

// //           {/* Runner's status flow:
// //   "assigned" → "en_route" → "picked_up" → "delivered"
// //   */}

// //           {errandStatus === "assigned" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("en_route")}
// //             >
// //               <Text style={styles.primaryButtonText}>Start Trip to Pickup</Text>
// //             </TouchableOpacity>
// //           )}

// //           {errandStatus === "en_route" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("picked_up")}
// //             >
// //               <Text style={styles.primaryButtonText}>I've Picked Up Item</Text>
// //             </TouchableOpacity>
// //           )}

// //           {errandStatus === "picked_up" && (
// //             <TouchableOpacity
// //               style={styles.primaryButton}
// //               onPress={() => handleUpdateStatus("delivered")}
// //             >
// //               <Text style={styles.primaryButtonText}>Mark as Delivered</Text>
// //             </TouchableOpacity>
// //           )}

// //           <TouchableOpacity style={styles.secondaryButton}>
// //             <Text style={styles.secondaryButtonText}>Report Issue</Text>
// //           </TouchableOpacity>
// //         </View>
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: "#f5f5f5",
// //   },

// //   backButton: {
// //     fontSize: 16,
// //     color: "#4CAF50",
// //   },
// //   emergencyButton: {
// //     fontSize: 14,
// //     color: "#FF4444",
// //     fontWeight: "bold",
// //   },
// //   overviewCard: {
// //     backgroundColor: "white",
// //     marginHorizontal: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   titleRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   errandTitle: {
// //     fontSize: 20,
// //     fontWeight: "bold",
// //     color: "#333",
// //     flex: 1,
// //   },
// //   paymentContainer: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },
// //   payment: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     color: "#4CAF50",
// //   },
// //   description: {
// //     fontSize: 14,
// //     color: "#666",
// //     marginBottom: 10,
// //   },
// //   errandMeta: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //   },
// //   metaText: {
// //     fontSize: 12,
// //     color: "#888",
// //   },
// //   progressCard: {
// //     backgroundColor: "white",
// //     margin: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   cardTitle: {
// //     fontSize: 18,
// //     fontWeight: "bold",
// //     marginBottom: 15,
// //     color: "#333",
// //   },
// //   progressStep: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   progressDot: {
// //     width: 12,
// //     height: 12,
// //     borderRadius: 6,
// //     marginRight: 12,
// //   },
// //   progressText: {
// //     fontSize: 14,
// //   },
// //   customerCard: {
// //     backgroundColor: "white",
// //     margin: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   customerInfo: {
// //     flexDirection: "row",
// //     alignItems: "center",
// //   },
// //   customerAvatar: {
// //     width: 50,
// //     height: 50,
// //     borderRadius: 25,
// //     backgroundColor: "#4CAF50",
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginRight: 15,
// //   },
// //   avatarText: {
// //     color: "white",
// //     fontWeight: "bold",
// //     fontSize: 16,
// //   },
// //   customerDetails: {
// //     flex: 1,
// //   },
// //   customerName: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#333",
// //   },
// //   customerEmail: {
// //     fontSize: 12,
// //     color: "#666",
// //     marginTop: 2,
// //   },
// //   callButton: {
// //     backgroundColor: "#4CAF50",
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     borderRadius: 20,
// //   },
// //   callButtonText: {
// //     color: "white",
// //     fontWeight: "bold",
// //     fontSize: 12,
// //   },
// //   locationsCard: {
// //     backgroundColor: "white",
// //     margin: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   locationItem: {
// //     marginBottom: 20,
// //     paddingBottom: 20,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f0f0f0",
// //   },
// //   locationHeader: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 8,
// //   },
// //   locationTitle: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#333",
// //   },
// //   navigateButton: {
// //     backgroundColor: "#2196F3",
// //     paddingHorizontal: 12,
// //     paddingVertical: 6,
// //     borderRadius: 15,
// //   },
// //   navigateText: {
// //     color: "white",
// //     fontSize: 12,
// //     fontWeight: "bold",
// //   },
// //   locationAddress: {
// //     fontSize: 14,
// //     color: "#666",
// //     marginBottom: 5,
// //   },
// //   sectionSubtitle: {
// //     fontSize: 14,
// //     fontWeight: "bold",
// //     color: "#333",
// //     marginTop: 10,
// //     marginBottom: 5,
// //   },
// //   itemsCard: {
// //     backgroundColor: "white",
// //     margin: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   itemRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     paddingVertical: 10,
// //     borderBottomWidth: 1,
// //     borderBottomColor: "#f0f0f0",
// //   },
// //   itemInfo: {
// //     flex: 1,
// //   },
// //   itemName: {
// //     fontSize: 14,
// //     fontWeight: "bold",
// //     color: "#333",
// //   },
// //   itemQuantity: {
// //     fontSize: 12,
// //     color: "#666",
// //     marginTop: 2,
// //   },
// //   itemNotes: {
// //     fontSize: 12,
// //     color: "#888",
// //     marginTop: 2,
// //     fontStyle: "italic",
// //   },
// //   itemCheckbox: {
// //     padding: 5,
// //   },
// //   checkboxText: {
// //     fontSize: 18,
// //   },
// //   instructionsCard: {
// //     backgroundColor: "white",
// //     margin: 10,
// //     padding: 20,
// //     borderRadius: 12,
// //     elevation: 2,
// //     shadowColor: "#000",
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   paymentRow: {
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     marginBottom: 8,
// //   },
// //   paymentLabel: {
// //     fontSize: 14,
// //     color: "#666",
// //   },
// //   paymentValue: {
// //     fontSize: 14,
// //     fontWeight: "bold",
// //     color: "#333",
// //   },
// //   totalPaymentRow: {
// //     marginTop: 10,
// //     paddingTop: 10,
// //     borderTopWidth: 1,
// //     borderTopColor: "#eee",
// //   },
// //   totalPaymentLabel: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   totalPaymentValue: {
// //     fontSize: 16,
// //     fontWeight: "bold",
// //     color: "#4CAF50",
// //   },
// //   actionButtons: {
// //     margin: 10,
// //     marginBottom: 30,
// //   },
// //   primaryButton: {
// //     backgroundColor: "#4CAF50",
// //     paddingVertical: 15,
// //     borderRadius: 8,
// //     alignItems: "center",
// //     marginBottom: 10,
// //   },
// //   primaryButtonText: {
// //     color: "white",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// //   secondaryButton: {
// //     backgroundColor: "white",
// //     paddingVertical: 15,
// //     borderRadius: 8,
// //     alignItems: "center",
// //     borderWidth: 1,
// //     borderColor: "#ddd",
// //   },
// //   secondaryButtonText: {
// //     color: "#666",
// //     fontSize: 16,
// //     fontWeight: "bold",
// //   },
// // });

// // export default ErrandDetailsScreen;

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Linking,
//   Image,
//   FlatList,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useMutateData } from "../../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";

// const ErrandDetailsScreen = ({ route }) => {
//   const { errand } = route.params || {};
//   const navigation = useNavigation();

//   const [errandStatus, setErrandStatus] = useState(errand?.status || "pending");

//   // Progress steps differ by type
//   const steps =
//     errand.type === "shopping"
//       ? [
//           {
//             id: 1,
//             title: "Errand Assigned",
//             completed: errandStatus !== "pending",
//           },
//           {
//             id: 2,
//             title: "Heading to Pickup",
//             completed: ["en_route", "picked_up", "delivered"].includes(
//               errandStatus
//             ),
//           },
//           {
//             id: 3,
//             title: "Picked Up Items",
//             completed: ["picked_up", "delivered"].includes(errandStatus),
//           },
//           {
//             id: 4,
//             title: "Delivered",
//             completed: errandStatus === "delivered",
//           },
//         ]
//       : [
//           {
//             id: 1,
//             title: "Errand Assigned",
//             completed: errandStatus !== "pending",
//           },
//           {
//             id: 2,
//             title: "Heading to Pickup",
//             completed: ["en_route", "picked_up", "delivered"].includes(
//               errandStatus
//             ),
//           },
//           {
//             id: 3,
//             title: "Picked Up Package",
//             completed: ["picked_up", "delivered"].includes(errandStatus),
//           },
//           {
//             id: 4,
//             title: "Delivered",
//             completed: errandStatus === "delivered",
//           },
//         ];

//   const {
//     mutate: assignedErrand,
//     isLoading: assignedErrandispending,
//     error: assignedErranderror,
//   } = useMutateData("api/v1/runner/errands", "PATCH", "geterrandinfo");

//   const handleUpdateStatus = (newStatus) => {
//     let data = {
//       status: newStatus,
//       errandId: errand?._id,
//     };

//     assignedErrand(data, {
//       onSuccess: (response) => {
//         Alert.alert("Success", "Status updated successfully", [{ text: "OK" }]);
//         navigation.goBack();
//       },
//       onError: (error) => {
//         const errorMessage =
//           error.message ||
//           error.response?.data?.message ||
//           "Failed to update status";
//         Alert.alert("Error", errorMessage, [{ text: "OK" }]);
//       },
//     });
//   };

//   const handleCallCustomer = () => {
//     Alert.alert("Call Customer", `Call ${errand?.user?.name}?`, [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Call",
//         onPress: () => Linking.openURL(`tel:${errand?.phoneNumber}`),
//       },
//     ]);
//   };

//   const handleNavigateToLocation = (address) => {
//     const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
//       address
//     )}`;
//     Linking.openURL(url);
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.itemRow}>
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
//         {item.description && (
//           <Text style={styles.itemNotes}>Note: {item.description}</Text>
//         )}
//         {item?.images?.length > 0 && (
//           <Image
//             source={{ uri: item.images[0] }}
//             style={{
//               width: 200,
//               height: 200,
//               resizeMode: "cover",
//               borderRadius: 10,
//               marginTop: 8,
//             }}
//           />
//         )}
//       </View>
//       <View style={styles.itemCheckbox}>
//         <Text style={styles.checkboxText}>₦{item?.price}</Text>
//       </View>
//     </View>
//   );

//   const renderPickupLocation = ({ item }) => (
//     <View style={styles.locationItem}>
//       <View style={styles.locationHeader}>
//         <Text style={styles.locationTitle}>📍 {item.name}</Text>
//         <TouchableOpacity
//           style={styles.navigateButton}
//           onPress={() => handleNavigateToLocation(item.address)}
//         >
//           <Text style={styles.navigateText}>Navigate</Text>
//         </TouchableOpacity>
//       </View>
//       <Text style={styles.locationAddress}>{item.address}</Text>

//       {item.items?.length > 0 && (
//         <>
//           <Text style={styles.sectionSubtitle}>Items to Pickup:</Text>
//           <FlatList
//             data={item.items}
//             renderItem={renderItem}
//             keyExtractor={(itm, index) => index.toString()}
//             scrollEnabled={false}
//           />
//         </>
//       )}
//     </View>
//   );

//   if (!errand) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <Text>No errand data available</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView>
//         {/* Overview */}
//         <View style={styles.overviewCard}>
//           <View style={styles.titleRow}>
//             <Text style={styles.errandTitle}>{errand.title}</Text>
//             <View style={styles.paymentContainer}>
//               <Text style={styles.payment}>
//                 ₦{errand.totalAmount?.toFixed(2)}
//               </Text>
//             </View>
//           </View>
//           <Text style={styles.description}>{errand.description}</Text>
//           <Text style={styles.metaText}>
//             ⏱️ {new Date(errand.createdAt).toLocaleString()}
//           </Text>
//         </View>

//         {/* Progress */}
//         <View style={styles.progressCard}>
//           <Text style={styles.cardTitle}>Progress</Text>
//           {steps.map((step) => (
//             <View key={step.id} style={styles.progressStep}>
//               <View
//                 style={[
//                   styles.progressDot,
//                   { backgroundColor: step.completed ? "#4CAF50" : "#ddd" },
//                 ]}
//               />
//               <Text
//                 style={[
//                   styles.progressText,
//                   { color: step.completed ? "#4CAF50" : "#666" },
//                 ]}
//               >
//                 {step.title}
//               </Text>
//             </View>
//           ))}
//         </View>

//         {/* Customer Info */}
//         <View style={styles.customerCard}>
//           <Text style={styles.cardTitle}>Customer Information</Text>
//           <View style={styles.customerInfo}>
//             <View style={styles.customerAvatar}>
//               <Text style={styles.avatarText}>
//                 {errand.user?.name
//                   ?.split(" ")
//                   .map((n) => n[0])
//                   .join("")}
//               </Text>
//             </View>
//             <View style={styles.customerDetails}>
//               <Text style={styles.customerName}>{errand.user?.name}</Text>
//               <Text style={styles.customerEmail}>{errand.user?.email}</Text>
//               <Text style={styles.customerEmail}>{errand?.phoneNumber}</Text>
//             </View>
//             <TouchableOpacity
//               style={styles.callButton}
//               onPress={handleCallCustomer}
//             >
//               <Text style={styles.callButtonText}>📞 Call</Text>
//             </TouchableOpacity>
//           </View>
//         </View>

//         {/* Shopping Errand → show pickup locations */}
//         {errand.type === "shopping" && (
//           <View style={styles.locationsCard}>
//             <Text style={styles.cardTitle}>Pickup Locations</Text>
//             <FlatList
//               data={errand.pickupLocations}
//               renderItem={renderPickupLocation}
//               keyExtractor={(item, index) => index.toString()}
//               scrollEnabled={false}
//             />
//           </View>
//         )}

//         {/* Pickup Errand → show images + description */}
//         {errand.type === "pickup" && errand.images?.length > 0 && (
//           <View style={styles.locationsCard}>
//             <Text style={styles.cardTitle}>Pickup Item</Text>
//             {errand.images.map((img, idx) => (
//               <Image
//                 key={idx}
//                 source={{ uri: img.url }}
//                 style={{
//                   width: "100%",
//                   height: 200,
//                   borderRadius: 10,
//                   marginVertical: 10,
//                 }}
//                 resizeMode="cover"
//               />
//             ))}
//             <Text style={styles.description}>{errand.description}</Text>
//           </View>
//         )}

//         {/* Delivery */}
//         <View style={styles.locationsCard}>
//           <Text style={styles.cardTitle}>Delivery Location</Text>
//           <View style={styles.locationItem}>
//             <View style={styles.locationHeader}>
//               <Text style={styles.locationTitle}>🎯 Delivery Address</Text>
//               <TouchableOpacity
//                 style={styles.navigateButton}
//                 onPress={() => handleNavigateToLocation(errand.deliveryAddress)}
//               >
//                 <Text style={styles.navigateText}>Navigate</Text>
//               </TouchableOpacity>
//             </View>
//             <Text style={styles.locationAddress}>{errand.deliveryAddress}</Text>
//           </View>
//         </View>

//         {/* Payment Breakdown */}
//         <View style={styles.instructionsCard}>
//           <Text style={styles.cardTitle}>Payment Breakdown</Text>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Items Total:</Text>
//             <Text style={styles.paymentValue}>₦{errand.totalPrice}</Text>
//           </View>
//           <View style={styles.paymentRow}>
//             <Text style={styles.paymentLabel}>Service Charge:</Text>
//             <Text style={styles.paymentValue}>₦{errand.serviceCharge}</Text>
//           </View>
//           <View style={[styles.paymentRow, styles.totalPaymentRow]}>
//             <Text style={[styles.paymentLabel, styles.totalPaymentLabel]}>
//               Total:
//             </Text>
//             <Text style={[styles.paymentValue, styles.totalPaymentValue]}>
//               ₦{errand.totalAmount}
//             </Text>
//           </View>
//         </View>

//         {/* Action Buttons */}
//         <View style={styles.actionButtons}>
//           {errandStatus === "assigned" && (
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => handleUpdateStatus("en_route")}
//             >
//               <Text style={styles.primaryButtonText}>Start Trip to Pickup</Text>
//             </TouchableOpacity>
//           )}
//           {errandStatus === "en_route" && (
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => handleUpdateStatus("picked_up")}
//             >
//               <Text style={styles.primaryButtonText}>I've Picked Up</Text>
//             </TouchableOpacity>
//           )}
//           {errandStatus === "picked_up" && (
//             <TouchableOpacity
//               style={styles.primaryButton}
//               onPress={() => handleUpdateStatus("delivered")}
//             >
//               <Text style={styles.primaryButtonText}>Mark as Delivered</Text>
//             </TouchableOpacity>
//           )}

//           <TouchableOpacity style={styles.secondaryButton}>
//             <Text style={styles.secondaryButtonText}>Report Issue</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#f5f5f5" },
//   overviewCard: {
//     backgroundColor: "white",
//     margin: 10,
//     padding: 20,
//     borderRadius: 12,
//     elevation: 2,
//   },
//   titleRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   errandTitle: { fontSize: 20, fontWeight: "bold", flex: 1 },
//   payment: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
//   progressCard: {
//     backgroundColor: "white",
//     margin: 10,
//     padding: 15,
//     borderRadius: 12,
//   },
//   progressStep: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginVertical: 5,
//   },
//   progressDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
//   progressText: { fontSize: 14 },
//   customerCard: {
//     backgroundColor: "white",
//     margin: 10,
//     padding: 15,
//     borderRadius: 12,
//   },
//   customerInfo: { flexDirection: "row", alignItems: "center" },
//   customerAvatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: "#ddd",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   avatarText: { fontWeight: "bold" },
//   customerDetails: { flex: 1, marginHorizontal: 10 },
//   callButton: { padding: 8, backgroundColor: "#4CAF50", borderRadius: 8 },
//   callButtonText: { color: "white" },
//   locationsCard: {
//     backgroundColor: "white",
//     margin: 10,
//     padding: 15,
//     borderRadius: 12,
//   },
//   locationItem: { marginBottom: 15 },
//   locationHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   locationTitle: { fontWeight: "bold" },
//   locationAddress: { color: "#666", marginBottom: 5 },
//   sectionSubtitle: { fontWeight: "600", marginTop: 8 },
//   itemRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 12,
//   },
//   itemInfo: { flex: 1 },
//   itemName: { fontWeight: "bold" },
//   itemQuantity: { color: "#666" },
//   itemNotes: { fontStyle: "italic", color: "#888" },
//   itemCheckbox: { justifyContent: "center", marginLeft: 10 },
//   checkboxText: { fontWeight: "bold" },
//   instructionsCard: {
//     backgroundColor: "white",
//     margin: 10,
//     padding: 15,
//     borderRadius: 12,
//   },
//   paymentRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 4,
//   },
//   totalPaymentRow: { borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 6 },
//   totalPaymentLabel: { fontWeight: "bold" },
//   totalPaymentValue: { fontWeight: "bold", color: "#4CAF50" },
//   actionButtons: { margin: 15 },
//   primaryButton: {
//     backgroundColor: "#4CAF50",
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   primaryButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   secondaryButton: {
//     backgroundColor: "#eee",
//     padding: 15,
//     borderRadius: 10,
//     marginVertical: 5,
//   },
//   secondaryButtonText: { textAlign: "center", color: "#444" },
// });

// export default ErrandDetailsScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const ErrandDetailsScreen = ({ route }) => {
  const { errand } = route.params || {};
  const navigation = useNavigation();

  const [errandStatus, setErrandStatus] = useState(errand?.status || "pending");

  // Progress steps differ by type
  const steps =
    errand.type === "shopping"
      ? [
          {
            id: 1,
            title: "Errand Assigned",
            completed: errandStatus !== "pending",
          },
          {
            id: 2,
            title: "Heading to Pickup",
            completed: ["en_route", "picked_up", "delivered"].includes(
              errandStatus
            ),
          },
          {
            id: 3,
            title: "Picked Up Items",
            completed: ["picked_up", "delivered"].includes(errandStatus),
          },
          {
            id: 4,
            title: "Delivered",
            completed: errandStatus === "delivered",
          },
        ]
      : [
          {
            id: 1,
            title: "Errand Assigned",
            completed: errandStatus !== "pending",
          },
          {
            id: 2,
            title: "Heading to Pickup",
            completed: ["en_route", "picked_up", "delivered"].includes(
              errandStatus
            ),
          },
          {
            id: 3,
            title: "Picked Up Package",
            completed: ["picked_up", "delivered"].includes(errandStatus),
          },
          {
            id: 4,
            title: "Delivered",
            completed: errandStatus === "delivered",
          },
        ];

  const {
    mutate: assignedErrand,
    isLoading: assignedErrandispending,
    error: assignedErranderror,
  } = useMutateData("api/v1/runner/errands", "PATCH", "geterrandinfo");

  const handleUpdateStatus = (newStatus) => {
    let data = {
      status: newStatus,
      errandId: errand?._id,
    };

    assignedErrand(data, {
      onSuccess: (response) => {
        Alert.alert("Success", "Status updated successfully", [{ text: "OK" }]);
        navigation.goBack();
      },
      onError: (error) => {
        const errorMessage =
          error.message ||
          error.response?.data?.message ||
          "Failed to update status";
        Alert.alert("Error", errorMessage, [{ text: "OK" }]);
      },
    });
  };

  const handleCallCustomer = () => {
    Alert.alert("Call Customer", `Call ${errand?.user?.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${errand?.phoneNumber}`),
      },
    ]);
  };

  const handleNavigateToLocation = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
        {item.description && (
          <Text style={styles.itemNotes}>Note: {item.description}</Text>
        )}
        {item?.images?.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            style={{
              width: 200,
              height: 200,
              resizeMode: "cover",
              borderRadius: 10,
              marginTop: 8,
            }}
          />
        )}
      </View>
      <View style={styles.itemCheckbox}>
        <Text style={styles.checkboxText}>₦{item?.price}</Text>
      </View>
    </View>
  );

  const renderPickupLocation = ({ item }) => (
    <View style={styles.locationItem}>
      <View style={styles.locationHeader}>
        <Text style={styles.locationTitle}>📍 {item.name}</Text>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={() => handleNavigateToLocation(item.address)}
        >
          <Text style={styles.navigateText}>Navigate</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.locationAddress}>{item.address}</Text>

      {item.items?.length > 0 && (
        <>
          <Text style={styles.sectionSubtitle}>Items to Pickup:</Text>
          <FlatList
            data={item.items}
            renderItem={renderItem}
            keyExtractor={(itm, index) => index.toString()}
            scrollEnabled={false}
          />
        </>
      )}
    </View>
  );

  if (!errand) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>No errand data available</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.titleRow}>
            <Text style={styles.errandTitle}>{errand.title}</Text>
            <View style={styles.paymentContainer}>
              <Text style={styles.payment}>
                ₦{errand.totalAmount?.toFixed(2)}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{errand.description}</Text>
          <Text style={styles.metaText}>
            ⏱️ {new Date(errand.createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progress</Text>
          {steps.map((step) => (
            <View key={step.id} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  { backgroundColor: step.completed ? "#4CAF50" : "#ddd" },
                ]}
              />
              <Text
                style={[
                  styles.progressText,
                  { color: step.completed ? "#4CAF50" : "#666" },
                ]}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {errand.user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>{errand.user?.name}</Text>
              <Text style={styles.customerEmail}>{errand.user?.email}</Text>
              <Text style={styles.customerEmail}>{errand?.phoneNumber}</Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallCustomer}
            >
              <Text style={styles.callButtonText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Shopping Errand → show pickup locations */}
        {errand.type === "shopping" && (
          <View style={styles.locationsCard}>
            <Text style={styles.cardTitle}>Pickup Locations</Text>
            <FlatList
              data={errand.pickupLocations}
              renderItem={renderPickupLocation}
              keyExtractor={(item, index) => index.toString()}
              scrollEnabled={false}
            />
          </View>
        )}

        {/* Pickup Errand → show images + description */}
        {errand.type === "pickup" && errand.images?.length > 0 && (
          <View style={styles.locationsCard}>
            <Text style={styles.cardTitle}>Pickup Item</Text>
            {errand.images.map((img, idx) => (
              <Image
                key={idx}
                source={{ uri: img.url }}
                style={{
                  width: "100%",
                  height: 200,
                  borderRadius: 10,
                  marginVertical: 10,
                }}
                resizeMode="cover"
              />
            ))}
            <Text style={styles.description}>{errand.description}</Text>
          </View>
        )}

        {/* Delivery */}
        <View style={styles.locationsCard}>
          <Text style={styles.cardTitle}>Delivery Location</Text>
          <View style={styles.locationItem}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>🎯 Delivery Address</Text>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigateToLocation(errand.deliveryAddress)}
              >
                <Text style={styles.navigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.locationAddress}>{errand.deliveryAddress}</Text>
          </View>
        </View>

        {/* Payment Breakdown */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>Payment Breakdown</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Items Total:</Text>
            <Text style={styles.paymentValue}>₦{errand.totalPrice}</Text>
          </View>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Service Charge:</Text>
            <Text style={styles.paymentValue}>₦{errand.serviceCharge}</Text>
          </View>
          <View style={[styles.paymentRow, styles.totalPaymentRow]}>
            <Text style={[styles.paymentLabel, styles.totalPaymentLabel]}>
              Total:
            </Text>
            <Text style={[styles.paymentValue, styles.totalPaymentValue]}>
              ₦{errand.totalAmount}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {errandStatus === "assigned" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("en_route")}
            >
              <Text style={styles.primaryButtonText}>Start Trip to Pickup</Text>
            </TouchableOpacity>
          )}
          {errandStatus === "en_route" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("picked_up")}
            >
              <Text style={styles.primaryButtonText}>I've Picked Up</Text>
            </TouchableOpacity>
          )}
          {errandStatus === "picked_up" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("delivered")}
            >
              <Text style={styles.primaryButtonText}>Mark as Delivered</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  overviewCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errandTitle: { fontSize: 20, fontWeight: "bold", flex: 1 },
  payment: { fontSize: 18, fontWeight: "bold", color: "#4CAF50" },
  progressCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  progressDot: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  progressText: { fontSize: 14 },
  customerCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  customerInfo: { flexDirection: "row", alignItems: "center" },
  customerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontWeight: "bold" },
  customerDetails: { flex: 1, marginHorizontal: 10 },
  callButton: { padding: 8, backgroundColor: "#4CAF50", borderRadius: 8 },
  callButtonText: { color: "white" },
  locationsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  locationItem: { marginBottom: 15 },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationTitle: { fontWeight: "bold" },
  locationAddress: { color: "#666", marginBottom: 5 },
  sectionSubtitle: { fontWeight: "600", marginTop: 8 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: "bold" },
  itemQuantity: { color: "#666" },
  itemNotes: { fontStyle: "italic", color: "#888" },
  itemCheckbox: { justifyContent: "center", marginLeft: 10 },
  checkboxText: { fontWeight: "bold" },
  instructionsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 15,
    borderRadius: 12,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  totalPaymentRow: { borderTopWidth: 1, borderTopColor: "#ddd", paddingTop: 6 },
  totalPaymentLabel: { fontWeight: "bold" },
  totalPaymentValue: { fontWeight: "bold", color: "#4CAF50" },
  actionButtons: { margin: 15 },
  primaryButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  secondaryButton: {
    backgroundColor: "#eee",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  secondaryButtonText: { textAlign: "center", color: "#444" },
});

export default ErrandDetailsScreen;
