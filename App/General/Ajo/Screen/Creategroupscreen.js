// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   Switch,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import { Ionicons } from "@expo/vector-icons";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import axios from "axios";

// const CreateGroupScreen = () => {
//   const navigation = useNavigation();
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     goalAmount: "",
//     targetDate: new Date(),
//     frequency: "weekly",
//     hasTargetAmount: false,
//     hasTargetDate: false,
//     hasFrequency: false,
//   });
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const frequencies = [
//     { id: "daily", label: "Daily", icon: "today" },
//     { id: "weekly", label: "Weekly", icon: "calendar" },
//     { id: "monthly", label: "Monthly", icon: "calendar-outline" },
//   ];

//   const handleInputChange = (field, value) => {
//     setFormData({ ...formData, [field]: value });
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setFormData({ ...formData, targetDate: selectedDate });
//     }
//   };

//   const validateForm = () => {
//     if (!formData.name.trim()) {
//       Alert.alert("Error", "Please enter a group name");
//       return false;
//     }
//     if (!formData.description.trim()) {
//       Alert.alert("Error", "Please enter a description");
//       return false;
//     }

//     // Only validate goal amount if it's enabled
//     if (
//       formData.hasTargetAmount &&
//       (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0)
//     ) {
//       Alert.alert(
//         "Error",
//         "Please enter a valid goal amount or disable target amount"
//       );
//       return false;
//     }

//     // Only validate target date if it's enabled
//     if (formData.hasTargetDate && formData.targetDate <= new Date()) {
//       Alert.alert(
//         "Error",
//         "Target date must be in the future or disable target date"
//       );
//       return false;
//     }

//     return true;
//   };

//   const handleCreateGroup = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const groupData = {
//         name: formData.name,
//         description: formData.description,
//       };

//       // Only include optional fields if they're enabled
//       if (formData.hasTargetAmount) {
//         groupData.goalAmount = parseFloat(formData.goalAmount);
//       }

//       if (formData.hasTargetDate) {
//         groupData.targetDate = formData.targetDate;
//       }

//       if (formData.hasFrequency) {
//         groupData.frequency = formData.frequency;
//       }

//       const response = await axios.post("/api/groups/create", groupData);

//       Alert.alert("Success", "Saving group created successfully!", [
//         {
//           text: "OK",
//           onPress: () =>
//             navigation.navigate("GroupDetail", { groupId: response.data._id }),
//         },
//       ]);
//     } catch (error) {
//       Alert.alert(
//         "Error",
//         error.response?.data?.message || "Failed to create group"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatCurrency = (value) => {
//     const numValue = value.replace(/[^0-9]/g, "");
//     if (numValue) {
//       return parseFloat(numValue).toLocaleString("en-NG");
//     }
//     return "";
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//     >
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Basic Information</Text>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Group Name *</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="e.g., Family Vacation Fund"
//               value={formData.name}
//               onChangeText={(value) => handleInputChange("name", value)}
//               maxLength={50}
//             />
//           </View>

//           <View style={styles.inputContainer}>
//             <Text style={styles.label}>Description *</Text>
//             <TextInput
//               style={[styles.input, styles.textArea]}
//               placeholder="What are you saving for?"
//               value={formData.description}
//               onChangeText={(value) => handleInputChange("description", value)}
//               multiline
//               numberOfLines={4}
//               maxLength={200}
//             />
//             <Text style={styles.charCount}>
//               {formData.description.length}/200
//             </Text>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Saving Goal (Optional)</Text>

//           <View style={styles.toggleContainer}>
//             <View style={styles.toggleLeft}>
//               <Ionicons name="cash-outline" size={20} color="#6B7280" />
//               <Text style={styles.toggleLabel}>Set Target Amount</Text>
//             </View>
//             <Switch
//               value={formData.hasTargetAmount}
//               onValueChange={(value) =>
//                 handleInputChange("hasTargetAmount", value)
//               }
//               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
//               thumbColor={formData.hasTargetAmount ? "#8B5CF6" : "#F3F4F6"}
//             />
//           </View>

//           {formData.hasTargetAmount && (
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Target Amount (₦)</Text>
//               <View style={styles.currencyInput}>
//                 <Text style={styles.currencySymbol}>₦</Text>
//                 <TextInput
//                   style={styles.currencyField}
//                   placeholder="0.00"
//                   value={formatCurrency(formData.goalAmount)}
//                   onChangeText={(value) =>
//                     handleInputChange("goalAmount", value.replace(/,/g, ""))
//                   }
//                   keyboardType="numeric"
//                 />
//               </View>
//             </View>
//           )}

//           <View style={styles.toggleContainer}>
//             <View style={styles.toggleLeft}>
//               <Ionicons name="calendar-outline" size={20} color="#6B7280" />
//               <Text style={styles.toggleLabel}>Set Target Date</Text>
//             </View>
//             <Switch
//               value={formData.hasTargetDate}
//               onValueChange={(value) =>
//                 handleInputChange("hasTargetDate", value)
//               }
//               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
//               thumbColor={formData.hasTargetDate ? "#8B5CF6" : "#F3F4F6"}
//             />
//           </View>

//           {formData.hasTargetDate && (
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Target Date</Text>
//               <TouchableOpacity
//                 style={styles.dateButton}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Ionicons name="calendar-outline" size={20} color="#6B7280" />
//                 <Text style={styles.dateText}>
//                   {formData.targetDate.toLocaleDateString("en-NG", {
//                     day: "numeric",
//                     month: "long",
//                     year: "numeric",
//                   })}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {showDatePicker && (
//             <DateTimePicker
//               value={formData.targetDate}
//               mode="date"
//               minimumDate={new Date()}
//               onChange={handleDateChange}
//             />
//           )}
//         </View>

//         <View style={styles.section}>
//           <View style={styles.toggleContainer}>
//             <View style={styles.toggleLeft}>
//               <Ionicons name="sync-outline" size={20} color="#6B7280" />
//               <Text style={styles.toggleLabel}>Set Contribution Frequency</Text>
//             </View>
//             <Switch
//               value={formData.hasFrequency}
//               onValueChange={(value) =>
//                 handleInputChange("hasFrequency", value)
//               }
//               trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
//               thumbColor={formData.hasFrequency ? "#8B5CF6" : "#F3F4F6"}
//             />
//           </View>

//           {formData.hasFrequency && (
//             <>
//               <Text style={styles.sectionSubtitle}>Contribution Frequency</Text>
//               <View style={styles.frequencyContainer}>
//                 {frequencies.map((freq) => (
//                   <TouchableOpacity
//                     key={freq.id}
//                     style={[
//                       styles.frequencyButton,
//                       formData.frequency === freq.id &&
//                         styles.frequencyButtonActive,
//                     ]}
//                     onPress={() => handleInputChange("frequency", freq.id)}
//                   >
//                     <Ionicons
//                       name={freq.icon}
//                       size={24}
//                       color={
//                         formData.frequency === freq.id ? "#8B5CF6" : "#6B7280"
//                       }
//                     />
//                     <Text
//                       style={[
//                         styles.frequencyLabel,
//                         formData.frequency === freq.id &&
//                           styles.frequencyLabelActive,
//                       ]}
//                     >
//                       {freq.label}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}
//               </View>
//             </>
//           )}
//         </View>

//         <View style={styles.infoBox}>
//           <Ionicons name="information-circle" size={20} color="#8B5CF6" />
//           <Text style={styles.infoText}>
//             You'll become the admin of this group. Optional settings help
//             structure contributions, but members can contribute freely at any
//             time.
//           </Text>
//         </View>
//       </ScrollView>

//       <View style={styles.footer}>
//         <TouchableOpacity
//           style={[styles.createButton, loading && styles.createButtonDisabled]}
//           onPress={handleCreateGroup}
//           disabled={loading}
//         >
//           <Text style={styles.createButtonText}>
//             {loading ? "Creating..." : "Create Group"}
//           </Text>
//         </TouchableOpacity>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingHorizontal: 20,
//     paddingTop: 60,
//     paddingBottom: 16,
//     backgroundColor: "#FFFFFF",
//     borderBottomWidth: 1,
//     borderBottomColor: "#E5E7EB",
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//   },
//   scrollView: {
//     flex: 1,
//   },
//   content: {
//     padding: 20,
//   },
//   section: {
//     marginBottom: 24,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 16,
//   },
//   sectionSubtitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//     marginTop: 16,
//     marginBottom: 12,
//   },
//   inputContainer: {
//     marginBottom: 16,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#374151",
//     marginBottom: 8,
//   },
//   input: {
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     fontSize: 16,
//     color: "#111827",
//   },
//   textArea: {
//     height: 100,
//     textAlignVertical: "top",
//   },
//   charCount: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     textAlign: "right",
//     marginTop: 4,
//   },
//   toggleContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   toggleLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   toggleLabel: {
//     fontSize: 15,
//     color: "#111827",
//     fontWeight: "500",
//     marginLeft: 12,
//   },
//   currencyInput: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//   },
//   currencySymbol: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#6B7280",
//     marginRight: 8,
//   },
//   currencyField: {
//     flex: 1,
//     fontSize: 16,
//     color: "#111827",
//     paddingVertical: 12,
//   },
//   dateButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//   },
//   dateText: {
//     fontSize: 16,
//     color: "#111827",
//     marginLeft: 12,
//   },
//   frequencyContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   frequencyButton: {
//     flex: 1,
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     borderWidth: 1,
//     borderColor: "#D1D5DB",
//     borderRadius: 12,
//     paddingVertical: 16,
//     marginHorizontal: 4,
//   },
//   frequencyButtonActive: {
//     backgroundColor: "#EDE9FE",
//     borderColor: "#8B5CF6",
//   },
//   frequencyLabel: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginTop: 8,
//   },
//   frequencyLabelActive: {
//     color: "#8B5CF6",
//     fontWeight: "600",
//   },
//   infoBox: {
//     flexDirection: "row",
//     backgroundColor: "#EDE9FE",
//     borderRadius: 12,
//     padding: 16,
//     marginTop: 8,
//   },
//   infoText: {
//     flex: 1,
//     fontSize: 14,
//     color: "#6B21A8",
//     marginLeft: 12,
//     lineHeight: 20,
//   },
//   footer: {
//     padding: 20,
//     backgroundColor: "#FFFFFF",
//     borderTopWidth: 1,
//     borderTopColor: "#E5E7EB",
//   },
//   createButton: {
//     backgroundColor: "#8B5CF6",
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: "center",
//     shadowColor: "#8B5CF6",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   createButtonDisabled: {
//     backgroundColor: "#D1D5DB",
//   },
//   createButtonText: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#FFFFFF",
//   },
// });

// export default CreateGroupScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutateData } from "../../../../hooks/Requestv2";
import { useSelector } from "react-redux";

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const { user_data } = useSelector((state) => state.AuthSlice);
  const userId = user_data?.user?._id || "67fe7602ff5d9e29a8f31baf";

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    goalAmount: "",
    targetDate: new Date(),
    frequency: "weekly",
    hasTargetAmount: false,
    hasTargetDate: false,
    hasFrequency: false,
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Setup mutation hook
  const {
    mutate: createAjo,
    isLoading: loading,
    error,
  } = useMutateData(
    `api/v1/ajo/${userId}`,
    "POST",
    "errand", // This will invalidate the query to refresh the list
    {
      onSuccess: (data) => {
        console.log("Ajo created successfully:", data);
        Alert.alert("Success", "Saving group created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate to the group detail screen or back to list
              navigation.goBack();
            },
          },
        ]);
      },
      onError: (error) => {
        console.error("Create Ajo Error:", error);
        Alert.alert("Error", error?.message || "Failed to create saving group");
      },
    }
  );

  const frequencies = [
    { id: "daily", label: "Daily", icon: "today" },
    { id: "weekly", label: "Weekly", icon: "calendar" },
    { id: "monthly", label: "Monthly", icon: "calendar-outline" },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, targetDate: selectedDate });
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter a group name");
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return false;
    }

    // Only validate goal amount if it's enabled
    if (
      formData.hasTargetAmount &&
      (!formData.goalAmount || parseFloat(formData.goalAmount) <= 0)
    ) {
      Alert.alert(
        "Error",
        "Please enter a valid goal amount or disable target amount"
      );
      return false;
    }

    // Only validate target date if it's enabled
    if (formData.hasTargetDate && formData.targetDate <= new Date()) {
      Alert.alert(
        "Error",
        "Target date must be in the future or disable target date"
      );
      return false;
    }

    return true;
  };

  const handleCreateGroup = () => {
    if (!validateForm()) return;

    const groupData = {
      userId: userId,
      name: formData.name,
      description: formData.description,
    };

    // Only include optional fields if they're enabled
    if (formData.hasTargetAmount) {
      groupData.goalAmount = parseFloat(formData.goalAmount);
    }

    if (formData.hasTargetDate) {
      groupData.targetDate = formData.targetDate.toISOString();
    }

    if (formData.hasFrequency) {
      groupData.frequency = formData.frequency;
    }

    console.log("Creating Ajo with data:", groupData);
    createAjo(groupData);
  };

  const formatCurrency = (value) => {
    const numValue = value.replace(/[^0-9]/g, "");
    if (numValue) {
      return parseFloat(numValue).toLocaleString("en-NG");
    }
    return "";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Family Vacation Fund"
              value={formData.name}
              onChangeText={(value) => handleInputChange("name", value)}
              maxLength={50}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="What are you saving for?"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={4}
              maxLength={200}
              editable={!loading}
            />
            <Text style={styles.charCount}>
              {formData.description.length}/200
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saving Goal (Optional)</Text>

          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Ionicons name="cash-outline" size={20} color="#6B7280" />
              <Text style={styles.toggleLabel}>Set Target Amount</Text>
            </View>
            <Switch
              value={formData.hasTargetAmount}
              onValueChange={(value) =>
                handleInputChange("hasTargetAmount", value)
              }
              trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
              thumbColor={formData.hasTargetAmount ? "#8B5CF6" : "#F3F4F6"}
              disabled={loading}
            />
          </View>

          {formData.hasTargetAmount && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Amount (₦)</Text>
              <View style={styles.currencyInput}>
                <Text style={styles.currencySymbol}>₦</Text>
                <TextInput
                  style={styles.currencyField}
                  placeholder="0.00"
                  value={formatCurrency(formData.goalAmount)}
                  onChangeText={(value) =>
                    handleInputChange("goalAmount", value.replace(/,/g, ""))
                  }
                  keyboardType="numeric"
                  editable={!loading}
                />
              </View>
            </View>
          )}

          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Ionicons name="calendar-outline" size={20} color="#6B7280" />
              <Text style={styles.toggleLabel}>Set Target Date</Text>
            </View>
            <Switch
              value={formData.hasTargetDate}
              onValueChange={(value) =>
                handleInputChange("hasTargetDate", value)
              }
              trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
              thumbColor={formData.hasTargetDate ? "#8B5CF6" : "#F3F4F6"}
              disabled={loading}
            />
          </View>

          {formData.hasTargetDate && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Target Date</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
                disabled={loading}
              >
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={styles.dateText}>
                  {formData.targetDate.toLocaleDateString("en-NG", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {showDatePicker && (
            <DateTimePicker
              value={formData.targetDate}
              mode="date"
              minimumDate={new Date()}
              onChange={handleDateChange}
            />
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLeft}>
              <Ionicons name="sync-outline" size={20} color="#6B7280" />
              <Text style={styles.toggleLabel}>Set Contribution Frequency</Text>
            </View>
            <Switch
              value={formData.hasFrequency}
              onValueChange={(value) =>
                handleInputChange("hasFrequency", value)
              }
              trackColor={{ false: "#D1D5DB", true: "#C4B5FD" }}
              thumbColor={formData.hasFrequency ? "#8B5CF6" : "#F3F4F6"}
              disabled={loading}
            />
          </View>

          {formData.hasFrequency && (
            <>
              <Text style={styles.sectionSubtitle}>Contribution Frequency</Text>
              <View style={styles.frequencyContainer}>
                {frequencies.map((freq) => (
                  <TouchableOpacity
                    key={freq.id}
                    style={[
                      styles.frequencyButton,
                      formData.frequency === freq.id &&
                        styles.frequencyButtonActive,
                    ]}
                    onPress={() => handleInputChange("frequency", freq.id)}
                    disabled={loading}
                  >
                    <Ionicons
                      name={freq.icon}
                      size={24}
                      color={
                        formData.frequency === freq.id ? "#8B5CF6" : "#6B7280"
                      }
                    />
                    <Text
                      style={[
                        styles.frequencyLabel,
                        formData.frequency === freq.id &&
                          styles.frequencyLabelActive,
                      ]}
                    >
                      {freq.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#8B5CF6" />
          <Text style={styles.infoText}>
            You'll become the admin of this group. Optional settings help
            structure contributions, but members can contribute freely at any
            time.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, loading && styles.createButtonDisabled]}
          onPress={handleCreateGroup}
          disabled={loading}
        >
          <Text style={styles.createButtonText}>
            {loading ? "Creating..." : "Create Group"}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginTop: 16,
    marginBottom: 12,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleLabel: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
    marginLeft: 12,
  },
  currencyInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginRight: 8,
  },
  currencyField: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingVertical: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: "#111827",
    marginLeft: 12,
  },
  frequencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  frequencyButton: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 4,
  },
  frequencyButtonActive: {
    backgroundColor: "#EDE9FE",
    borderColor: "#8B5CF6",
  },
  frequencyLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
  },
  frequencyLabelActive: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#6B21A8",
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  createButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default CreateGroupScreen;
