// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
//   TextInput,
//   ActivityIndicator,
//   Alert,
//   FlatList,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useNavigation } from "@react-navigation/native";
// import {
//   useMutateData_v2,
//   useFetchData_v2,
// } from "../../../../../hooks/Requestv2";

// // Nigerian States
// const NIGERIAN_STATES = [
//   "Abia",
//   "Adamawa",
//   "Akwa Ibom",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Cross River",
//   "Delta",
//   "Ebonyi",
//   "Edo",
//   "Ekiti",
//   "Rivers",
//   "Enugu",
//   "FCT",
//   "Gombe",
//   "Imo",
//   "Jigawa",
//   "Kaduna",
//   "Kano",
//   "Katsina",
//   "Kebbi",
//   "Kogi",
//   "Kwara",
//   "Lagos",
//   "Nasarawa",
//   "Niger",
//   "Ogun",
//   "Ondo",
//   "Osun",
//   "Oyo",
//   "Plateau",
//   "Sokoto",
//   "Taraba",
//   "Yobe",
//   "Zamfara",
// ];

// const CreateBankAccount = () => {
//   const navigation = useNavigation();
//   const [showModal, setShowModal] = useState(false);
//   const [showStatePicker, setShowStatePicker] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [formData, setFormData] = useState({
//     street: "",
//     city: "",
//     state: "",
//   });

//   // Fetch user data
//   const {
//     data: userData,
//     isLoading: isUserLoading,
//     refetch: refetchUser,
//   } = useFetchData_v2("api/v1/user", "userProfile");

//   // Update banking info mutation
//   const updateBankingInfo = useMutateData_v2(
//     "api/v1/user/updatebankingInfo",
//     "POST",
//     "userProfile"
//   );

//   // Create customer account mutation - CHANGED TO GET
//   const createCustomerAccount = useMutateData_v2(
//     "api/v1/bank/customerAccount",
//     "GET",
//     "userBankAccount"
//   );

//   // Check if user has required info
//   const hasRequiredInfo = () => {
//     if (!userData?.data) return false;

//     const { phoneNumber, address } = userData.data;

//     return phoneNumber && address?.street && address?.city && address?.state;
//   };

//   // Check and show modal on mount
//   useEffect(() => {
//     if (userData && !hasRequiredInfo()) {
//       setShowModal(true);
//     }
//   }, [userData]);

//   // Handle form input
//   const handleInputChange = (field: string, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // Handle state selection
//   const handleStateSelect = (state: string) => {
//     handleInputChange("state", state);
//     setShowStatePicker(false);
//     setShowModal(true); // Show the info modal again
//     setSearchQuery("");
//   };

//   // Filter states based on search
//   const filteredStates = NIGERIAN_STATES.filter((state) =>
//     state.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Handle update banking info
//   const handleUpdateInfo = async () => {
//     // Validation
//     if (!formData.street || !formData.city || !formData.state) {
//       Alert.alert("Error", "Please fill all required fields");
//       return;
//     }

//     try {
//       await updateBankingInfo.mutateAsync(formData);

//       // Refetch user data to check if info is complete
//       await refetchUser();

//       // Close modal
//       setShowModal(false);

//       Alert.alert("Success", "Information updated successfully");
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Failed to update information");
//     }
//   };

//   // Handle create bank account
//   const handleCreateAccount = async () => {
//     try {
//       // Call GET request to create customer account
//       await createCustomerAccount.mutateAsync({});

//       Alert.alert("Success", "Bank account created successfully!", [
//         {
//           text: "OK",
//           onPress: () => navigation.goBack(),
//         },
//       ]);
//     } catch (error: any) {
//       Alert.alert("Error", error.message || "Failed to create account");
//     }
//   };

//   if (isUserLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#10B981" />
//         <Text style={styles.loadingText}>Loading your information...</Text>
//       </View>
//     );
//   }

//   return (
//     <>
//       <ScrollView
//         style={styles.scrollView}
//         showsVerticalScrollIndicator={false}
//       >
//         {showModal ? (
//           <View style={styles.modalOverlay}>
//             <View style={styles.modalContainer}>
//               {/* Modal Header */}
//               <View style={styles.modalHeader}>
//                 <Text style={styles.modalTitle}>Complete Your Information</Text>
//                 <TouchableOpacity
//                   onPress={() =>
//                     !updateBankingInfo.isPending && setShowModal(false)
//                   }
//                   style={styles.closeButton}
//                   disabled={updateBankingInfo.isPending}
//                 >
//                   <MaterialCommunityIcons
//                     name="close"
//                     size={20}
//                     color="#6B7280"
//                   />
//                 </TouchableOpacity>
//               </View>

//               <Text style={styles.modalDescription}>
//                 We need a few more details to set up your bank account
//               </Text>

//               {/* Street Input */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>Street Address *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="123 Main Street, Apartment 4B"
//                   value={formData.street}
//                   onChangeText={(text) => handleInputChange("street", text)}
//                   editable={!updateBankingInfo.isPending}
//                 />
//               </View>

//               {/* City Input */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>City *</Text>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Lagos"
//                   value={formData.city}
//                   onChangeText={(text) => handleInputChange("city", text)}
//                   editable={!updateBankingInfo.isPending}
//                 />
//               </View>

//               {/* State Picker */}
//               <View style={styles.inputContainer}>
//                 <Text style={styles.inputLabel}>State *</Text>
//                 <TouchableOpacity
//                   style={styles.pickerButton}
//                   onPress={() => {
//                     setShowModal(false); // Hide info modal
//                     setShowStatePicker(true); // Show state picker
//                   }}
//                   disabled={updateBankingInfo.isPending}
//                   activeOpacity={0.7}
//                 >
//                   <Text
//                     style={[
//                       styles.pickerButtonText,
//                       !formData.state && styles.placeholderText,
//                     ]}
//                   >
//                     {formData.state || "Select State"}
//                   </Text>
//                   <MaterialCommunityIcons
//                     name="chevron-down"
//                     size={20}
//                     color="#6B7280"
//                   />
//                 </TouchableOpacity>
//               </View>

//               {/* Submit Button */}
//               <TouchableOpacity
//                 style={styles.submitButton}
//                 onPress={handleUpdateInfo}
//                 disabled={updateBankingInfo.isPending}
//                 activeOpacity={0.8}
//               >
//                 {updateBankingInfo.isPending ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <Text style={styles.submitButtonText}>Save Information</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         ) : (
//           <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//               <TouchableOpacity
//                 onPress={() => navigation.goBack()}
//                 style={styles.backButton}
//               >
//                 <MaterialCommunityIcons
//                   name="arrow-left"
//                   size={24}
//                   color="#111827"
//                 />
//               </TouchableOpacity>
//               <Text style={styles.headerTitle}>Create Bank Account</Text>
//               <View style={{ width: 24 }} />
//             </View>

//             {/* Hero Card */}
//             <View style={styles.heroCard}>
//               <View style={styles.decorativeCircle1} />
//               <View style={styles.decorativeCircle2} />

//               <View style={styles.iconContainerLarge}>
//                 <MaterialCommunityIcons name="bank" size={40} color="#FFFFFF" />
//               </View>

//               <Text style={styles.heroTitle}>Set Up Your Account</Text>
//               <Text style={styles.heroDescription}>
//                 Create your virtual bank account to start managing your finances
//               </Text>
//             </View>

//             {/* Info Card */}
//             <View style={styles.infoCard}>
//               <View style={styles.sectionHeader}>
//                 <MaterialCommunityIcons
//                   name="information"
//                   size={20}
//                   color="#10B981"
//                   style={{ marginRight: 8 }}
//                 />
//                 <Text style={styles.sectionTitle}>What You'll Get</Text>
//               </View>

//               <View style={styles.benefitItem}>
//                 <View
//                   style={[styles.benefitIcon, { backgroundColor: "#DBEAFE" }]}
//                 >
//                   <MaterialCommunityIcons
//                     name="wallet"
//                     size={20}
//                     color="#3B82F6"
//                   />
//                 </View>
//                 <View style={styles.benefitText}>
//                   <Text style={styles.benefitTitle}>Virtual Account</Text>
//                   <Text style={styles.benefitDescription}>
//                     Your own account number for transactions
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.benefitItem}>
//                 <View
//                   style={[styles.benefitIcon, { backgroundColor: "#FEF3C7" }]}
//                 >
//                   <MaterialCommunityIcons
//                     name="shield-check"
//                     size={20}
//                     color="#F59E0B"
//                   />
//                 </View>
//                 <View style={styles.benefitText}>
//                   <Text style={styles.benefitTitle}>Secure Transactions</Text>
//                   <Text style={styles.benefitDescription}>
//                     Bank-level security for all your transactions
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.benefitItem}>
//                 <View
//                   style={[styles.benefitIcon, { backgroundColor: "#D1FAE5" }]}
//                 >
//                   <MaterialCommunityIcons
//                     name="cash-multiple"
//                     size={20}
//                     color="#10B981"
//                   />
//                 </View>
//                 <View style={styles.benefitText}>
//                   <Text style={styles.benefitTitle}>Easy Savings</Text>
//                   <Text style={styles.benefitDescription}>
//                     Save and manage your money effortlessly
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             {/* Create Account Button - Only show if user has required info */}
//             {hasRequiredInfo() && (
//               <TouchableOpacity
//                 style={styles.createButton}
//                 onPress={handleCreateAccount}
//                 disabled={createCustomerAccount.isPending}
//                 activeOpacity={0.8}
//               >
//                 {createCustomerAccount.isPending ? (
//                   <ActivityIndicator size="small" color="#FFFFFF" />
//                 ) : (
//                   <>
//                     <Text style={styles.createButtonText}>
//                       Create Bank Account
//                     </Text>
//                     <MaterialCommunityIcons
//                       name="arrow-right"
//                       size={20}
//                       color="#FFFFFF"
//                     />
//                   </>
//                 )}
//               </TouchableOpacity>
//             )}

//             {/* Update Info Button - Show if missing info */}
//             {!hasRequiredInfo() && (
//               <TouchableOpacity
//                 style={styles.updateInfoButton}
//                 onPress={() => setShowModal(true)}
//                 activeOpacity={0.8}
//               >
//                 <MaterialCommunityIcons
//                   name="alert-circle"
//                   size={20}
//                   color="#F59E0B"
//                 />
//                 <Text style={styles.updateInfoButtonText}>
//                   Complete Your Information
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         )}
//       </ScrollView>

//       {/* State Picker Modal */}
//       <Modal
//         visible={showStatePicker}
//         transparent
//         animationType="slide"
//         onRequestClose={() => {
//           setShowStatePicker(false);
//           setShowModal(true); // Show info modal again when closing
//         }}
//       >
//         <View style={styles.modalOverlay}>
//           <View style={styles.pickerModalContainer}>
//             {/* Picker Header */}
//             <View style={styles.pickerHeader}>
//               <Text style={styles.pickerTitle}>Select State</Text>
//               <TouchableOpacity
//                 onPress={() => {
//                   setShowStatePicker(false);
//                   setShowModal(true); // Show info modal again
//                 }}
//                 style={styles.closeButton}
//               >
//                 <MaterialCommunityIcons
//                   name="close"
//                   size={20}
//                   color="#6B7280"
//                 />
//               </TouchableOpacity>
//             </View>

//             {/* Search Input */}
//             <View style={styles.searchContainer}>
//               <MaterialCommunityIcons
//                 name="magnify"
//                 size={20}
//                 color="#6B7280"
//               />
//               <TextInput
//                 style={styles.searchInput}
//                 placeholder="Search state..."
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//               />
//               {searchQuery.length > 0 && (
//                 <TouchableOpacity onPress={() => setSearchQuery("")}>
//                   <MaterialCommunityIcons
//                     name="close-circle"
//                     size={20}
//                     color="#9CA3AF"
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>

//             {/* States List */}
//             <FlatList
//               data={filteredStates}
//               keyExtractor={(item) => item}
//               showsVerticalScrollIndicator={false}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={styles.stateItem}
//                   onPress={() => handleStateSelect(item)}
//                   activeOpacity={0.6}
//                 >
//                   <Text style={styles.stateItemText}>{item}</Text>
//                   {formData.state === item && (
//                     <MaterialCommunityIcons
//                       name="check"
//                       size={20}
//                       color="#10B981"
//                     />
//                   )}
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <View style={styles.emptyContainer}>
//                   <MaterialCommunityIcons
//                     name="map-marker-off"
//                     size={40}
//                     color="#D1D5DB"
//                   />
//                   <Text style={styles.emptyText}>No states found</Text>
//                 </View>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   container: {
//     flex: 1,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: "#6B7280",
//     fontWeight: "500",
//   },

//   // Header
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 24,
//   },
//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//   },

//   // Hero Card
//   heroCard: {
//     backgroundColor: "#10B981",
//     borderRadius: 20,
//     padding: 32,
//     marginBottom: 24,
//     alignItems: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//     overflow: "hidden",
//   },
//   decorativeCircle1: {
//     position: "absolute",
//     top: -30,
//     right: -30,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(255, 255, 255, 0.1)",
//   },
//   decorativeCircle2: {
//     position: "absolute",
//     bottom: -20,
//     left: -20,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(255, 255, 255, 0.08)",
//   },
//   iconContainerLarge: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(255, 255, 255, 0.2)",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   heroTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   heroDescription: {
//     fontSize: 14,
//     color: "rgba(255, 255, 255, 0.9)",
//     textAlign: "center",
//     fontWeight: "500",
//     lineHeight: 20,
//   },

//   // Info Card
//   infoCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 24,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },
//   benefitItem: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 16,
//   },
//   benefitIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   benefitText: {
//     flex: 1,
//   },
//   benefitTitle: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 2,
//   },
//   benefitDescription: {
//     fontSize: 13,
//     color: "#6B7280",
//     fontWeight: "500",
//     lineHeight: 18,
//   },

//   // Buttons
//   createButton: {
//     backgroundColor: "#10B981",
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//     gap: 8,
//   },
//   createButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },
//   updateInfoButton: {
//     backgroundColor: "#FEF3C7",
//     paddingVertical: 16,
//     paddingHorizontal: 24,
//     borderRadius: 16,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     gap: 8,
//   },
//   updateInfoButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#92400E",
//     letterSpacing: 0.3,
//   },

//   // Modal
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     justifyContent: "flex-end",
//   },
//   modalContainer: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     maxHeight: "85%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   modalHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 8,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//   },
//   closeButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#F3F4F6",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalDescription: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 24,
//     fontWeight: "500",
//     lineHeight: 20,
//   },

//   // Form Inputs
//   inputContainer: {
//     marginBottom: 20,
//   },
//   inputLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   pickerButton: {
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   pickerButtonText: {
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   placeholderText: {
//     color: "#9CA3AF",
//   },
//   submitButton: {
//     backgroundColor: "#10B981",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 8,
//     marginBottom: 20,
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   submitButtonText: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },

//   // State Picker Modal
//   pickerModalContainer: {
//     backgroundColor: "#FFFFFF",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     maxHeight: "80%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   pickerHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   pickerTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F9FAFB",
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     paddingHorizontal: 12,
//     marginBottom: 16,
//     gap: 8,
//   },
//   searchInput: {
//     flex: 1,
//     paddingVertical: 12,
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   stateItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   stateItemText: {
//     fontSize: 15,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   emptyContainer: {
//     alignItems: "center",
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: "#9CA3AF",
//     marginTop: 12,
//     fontWeight: "500",
//   },
// });

// export default CreateBankAccount;

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  useMutateData_v2,
  useFetchData_v2,
} from "../../../../../hooks/Requestv2";

// Nigerian States
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Rivers",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const CreateBankAccount = () => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);
  const [showStatePicker, setShowStatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    state: "",
  });

  // Fetch user data
  const {
    data: userData,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useFetchData_v2("api/v1/user", "userProfile");

  // Update banking info mutation
  const updateBankingInfo = useMutateData_v2(
    "api/v1/user/updatebankingInfo",
    "POST",
    "userProfile"
  );

  // Create customer account - CHANGED TO useFetchData_v2 with manual trigger
  const {
    refetch: createCustomerAccount,
    isLoading: isCreatingAccount,
    isSuccess: accountCreated,
  } = useFetchData_v2("api/v1/bank/customerAccount", "createCustomerAccount", {
    enabled: false, // Don't fetch automatically
  });

  // Check if user has required info
  const hasRequiredInfo = () => {
    if (!userData?.data) return false;

    const { phoneNumber, address } = userData.data;

    return phoneNumber && address?.street && address?.city && address?.state;
  };

  // Check and show modal on mount
  useEffect(() => {
    if (userData && !hasRequiredInfo()) {
      setShowModal(true);
    }
  }, [userData]);

  // Handle successful account creation
  useEffect(() => {
    if (accountCreated) {
      Alert.alert("Success", "Bank account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [accountCreated]);

  // Handle form input
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle state selection
  const handleStateSelect = (state: string) => {
    handleInputChange("state", state);
    setShowStatePicker(false);
    setShowModal(true); // Show the info modal again
    setSearchQuery("");
  };

  // Filter states based on search
  const filteredStates = NIGERIAN_STATES.filter((state) =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle update banking info
  const handleUpdateInfo = async () => {
    // Validation
    if (!formData.street || !formData.city || !formData.state) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    try {
      await updateBankingInfo.mutateAsync(formData);

      // Refetch user data to check if info is complete
      await refetchUser();

      // Close modal
      setShowModal(false);

      Alert.alert("Success", "Information updated successfully");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update information");
    }
  };

  // Handle create bank account
  const handleCreateAccount = async () => {
    try {
      // Trigger the GET request
      await createCustomerAccount();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to create account");
    }
  };

  if (isUserLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading your information...</Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {showModal ? (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Complete Your Information</Text>
                <TouchableOpacity
                  onPress={() =>
                    !updateBankingInfo.isPending && setShowModal(false)
                  }
                  style={styles.closeButton}
                  disabled={updateBankingInfo.isPending}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                We need a few more details to set up your bank account
              </Text>

              {/* Street Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Street Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123 Main Street, Apartment 4B"
                  value={formData.street}
                  onChangeText={(text) => handleInputChange("street", text)}
                  editable={!updateBankingInfo.isPending}
                />
              </View>

              {/* City Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>City *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Lagos"
                  value={formData.city}
                  onChangeText={(text) => handleInputChange("city", text)}
                  editable={!updateBankingInfo.isPending}
                />
              </View>

              {/* State Picker */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>State *</Text>
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => {
                    setShowModal(false); // Hide info modal
                    setShowStatePicker(true); // Show state picker
                  }}
                  disabled={updateBankingInfo.isPending}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.pickerButtonText,
                      !formData.state && styles.placeholderText,
                    ]}
                  >
                    {formData.state || "Select State"}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleUpdateInfo}
                disabled={updateBankingInfo.isPending}
                activeOpacity={0.8}
              >
                {updateBankingInfo.isPending ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Information</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color="#111827"
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create Bank Account</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Hero Card */}
            <View style={styles.heroCard}>
              <View style={styles.decorativeCircle1} />
              <View style={styles.decorativeCircle2} />

              <View style={styles.iconContainerLarge}>
                <MaterialCommunityIcons name="bank" size={40} color="#FFFFFF" />
              </View>

              <Text style={styles.heroTitle}>Set Up Your Account</Text>
              <Text style={styles.heroDescription}>
                Create your virtual bank account to start managing your finances
              </Text>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="information"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>What You'll Get</Text>
              </View>

              <View style={styles.benefitItem}>
                <View
                  style={[styles.benefitIcon, { backgroundColor: "#DBEAFE" }]}
                >
                  <MaterialCommunityIcons
                    name="wallet"
                    size={20}
                    color="#3B82F6"
                  />
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Virtual Account</Text>
                  <Text style={styles.benefitDescription}>
                    Your own account number for transactions
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View
                  style={[styles.benefitIcon, { backgroundColor: "#FEF3C7" }]}
                >
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={20}
                    color="#F59E0B"
                  />
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Secure Transactions</Text>
                  <Text style={styles.benefitDescription}>
                    Bank-level security for all your transactions
                  </Text>
                </View>
              </View>

              <View style={styles.benefitItem}>
                <View
                  style={[styles.benefitIcon, { backgroundColor: "#D1FAE5" }]}
                >
                  <MaterialCommunityIcons
                    name="cash-multiple"
                    size={20}
                    color="#10B981"
                  />
                </View>
                <View style={styles.benefitText}>
                  <Text style={styles.benefitTitle}>Easy Savings</Text>
                  <Text style={styles.benefitDescription}>
                    Save and manage your money effortlessly
                  </Text>
                </View>
              </View>
            </View>

            {/* Create Account Button - Only show if user has required info */}
            {hasRequiredInfo() && (
              <TouchableOpacity
                style={styles.createButton}
                onPress={handleCreateAccount}
                disabled={isCreatingAccount}
                activeOpacity={0.8}
              >
                {isCreatingAccount ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Text style={styles.createButtonText}>
                      Create Bank Account
                    </Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Update Info Button - Show if missing info */}
            {!hasRequiredInfo() && (
              <TouchableOpacity
                style={styles.updateInfoButton}
                onPress={() => setShowModal(true)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color="#F59E0B"
                />
                <Text style={styles.updateInfoButtonText}>
                  Complete Your Information
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* State Picker Modal */}
      <Modal
        visible={showStatePicker}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowStatePicker(false);
          setShowModal(true); // Show info modal again when closing
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContainer}>
            {/* Picker Header */}
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select State</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowStatePicker(false);
                  setShowModal(true); // Show info modal again
                }}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#6B7280"
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search state..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              )}
            </View>

            {/* States List */}
            <FlatList
              data={filteredStates}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.stateItem}
                  onPress={() => handleStateSelect(item)}
                  activeOpacity={0.6}
                >
                  <Text style={styles.stateItemText}>{item}</Text>
                  {formData.state === item && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#10B981"
                    />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <MaterialCommunityIcons
                    name="map-marker-off"
                    size={40}
                    color="#D1D5DB"
                  />
                  <Text style={styles.emptyText}>No states found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
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
  iconContainerLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  heroDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
  },

  // Buttons
  createButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  updateInfoButton: {
    backgroundColor: "#FEF3C7",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  updateInfoButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#92400E",
    letterSpacing: 0.3,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
    fontWeight: "500",
    lineHeight: 20,
  },

  // Form Inputs
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  pickerButton: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pickerButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  submitButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // State Picker Modal
  pickerModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  stateItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  stateItemText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 12,
    fontWeight: "500",
  },
});

export default CreateBankAccount;
