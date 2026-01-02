import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useMutateData_v2 } from "../../../../../hooks/Requestv2";
// import { useMutateData_v2 } from "../../../../../hooks/Requestv2";
// useMutateData_v2;
const GENDER_OPTIONS = ["MALE", "FEMALE"];
const DEFAULT_SELFIE = "https://storage.example.com/selfies/user123.jpg";

const KYCForm = () => {
  const navigation = useNavigation();
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    bvn: "",
    dateOfBirth: new Date(),
    gender: "",
    selfie: DEFAULT_SELFIE,
  });

  // Submit KYC mutation
  const submitKYC = useMutateData_v2(
    "api/v1/bank/kyc",
    "POST",
    "userBankAccount"
  );

  // Calculate age
  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Validate BVN
  const validateBVN = (bvn: string) => {
    return /^\d{11}$/.test(bvn);
  };

  // Handle BVN input
  const handleBVNChange = (text: string) => {
    // Only allow numbers and limit to 11 digits
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, bvn: numericText }));
  };

  // Handle Date Change
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setFormData((prev) => ({ ...prev, dateOfBirth: selectedDate }));
    }
  };

  // Handle Gender Selection
  const handleGenderSelect = (gender: string) => {
    setFormData((prev) => ({ ...prev, gender }));
    setShowGenderPicker(false);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Validate form
  const validateForm = () => {
    // Check BVN
    if (!formData.bvn) {
      Alert.alert("Error", "Please enter your BVN");
      return false;
    }

    if (!validateBVN(formData.bvn)) {
      Alert.alert("Error", "BVN must be exactly 11 digits");
      return false;
    }

    // Check Age
    const age = calculateAge(formData.dateOfBirth);
    if (age < 18) {
      Alert.alert("Error", "You must be at least 18 years old");
      return false;
    }

    // Check Gender
    if (!formData.gender) {
      Alert.alert("Error", "Please select your gender");
      return false;
    }

    return true;
  };

  // Handle Submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        bvn: formData.bvn,
        selfie: formData.selfie,
        dateOfBirth: formatDateForAPI(formData.dateOfBirth),
        gender: formData.gender,
      };

      await submitKYC.mutateAsync(payload);

      Alert.alert("Success", "KYC submitted successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to submit KYC");
    }
  };

  const age = calculateAge(formData.dateOfBirth);

  return (
    <>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.headerTitle}>KYC Verification</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Hero Card */}
          <View style={styles.heroCard}>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.iconContainerLarge}>
              <MaterialCommunityIcons
                name="account-check"
                size={40}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.heroTitle}>Verify Your Identity</Text>
            <Text style={styles.heroDescription}>
              Complete your KYC to unlock all features and start saving
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="form-textbox"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {/* BVN Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>
                Bank Verification Number (BVN) *
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 11-digit BVN"
                value={formData.bvn}
                onChangeText={handleBVNChange}
                keyboardType="number-pad"
                maxLength={11}
                editable={!submitKYC.isPending}
              />
              <Text style={styles.helperText}>
                {formData.bvn.length}/11 digits
                {formData.bvn.length === 11 && " ✓"}
              </Text>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date of Birth *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowDatePicker(true)}
                disabled={submitKYC.isPending}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#6B7280"
                />
                <Text style={styles.pickerButtonText}>
                  {formatDate(formData.dateOfBirth)}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.helperText,
                  age < 18 && { color: "#DC2626" },
                  age >= 18 && { color: "#10B981" },
                ]}
              >
                {age < 18
                  ? `Age: ${age} years (Must be 18+)`
                  : `Age: ${age} years ✓`}
              </Text>
            </View>

            {/* Gender Picker */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Gender *</Text>
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowGenderPicker(true)}
                disabled={submitKYC.isPending}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons
                  name="gender-male-female"
                  size={20}
                  color="#6B7280"
                />
                <Text
                  style={[
                    styles.pickerButtonText,
                    !formData.gender && styles.placeholderText,
                  ]}
                >
                  {formData.gender || "Select Gender"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Info Notice */}
            <View style={styles.infoNotice}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color="#3B82F6"
              />
              <Text style={styles.infoNoticeText}>
                Your information is encrypted and secure. We use it only for
                verification purposes.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={submitKYC.isPending}
              activeOpacity={0.8}
            >
              {submitKYC.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit KYC</Text>
                  <MaterialCommunityIcons
                    name="check"
                    size={20}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Requirements Card */}
          <View style={styles.requirementsCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="clipboard-check"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Requirements</Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialCommunityIcons
                name={
                  validateBVN(formData.bvn)
                    ? "check-circle"
                    : "checkbox-blank-circle-outline"
                }
                size={20}
                color={validateBVN(formData.bvn) ? "#10B981" : "#9CA3AF"}
              />
              <Text style={styles.requirementText}>Valid 11-digit BVN</Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialCommunityIcons
                name={
                  age >= 18 ? "check-circle" : "checkbox-blank-circle-outline"
                }
                size={20}
                color={age >= 18 ? "#10B981" : "#9CA3AF"}
              />
              <Text style={styles.requirementText}>
                Must be 18 years or older
              </Text>
            </View>

            <View style={styles.requirementItem}>
              <MaterialCommunityIcons
                name={
                  formData.gender
                    ? "check-circle"
                    : "checkbox-blank-circle-outline"
                }
                size={20}
                color={formData.gender ? "#10B981" : "#9CA3AF"}
              />
              <Text style={styles.requirementText}>Gender selected</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.dateOfBirth}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      {/* Gender Picker Modal */}
      <Modal
        visible={showGenderPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pickerModalContainer}>
            {/* Picker Header */}
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>Select Gender</Text>
              <TouchableOpacity
                onPress={() => setShowGenderPicker(false)}
                style={styles.closeButton}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Gender List */}
            <FlatList
              data={GENDER_OPTIONS}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.genderItem}
                  onPress={() => handleGenderSelect(item)}
                  activeOpacity={0.6}
                >
                  <MaterialCommunityIcons
                    name={item === "MALE" ? "gender-male" : "gender-female"}
                    size={24}
                    color={item === "MALE" ? "#3B82F6" : "#EC4899"}
                  />
                  <Text style={styles.genderItemText}>
                    {item === "MALE" ? "Male" : "Female"}
                  </Text>
                  {formData.gender === item && (
                    <MaterialCommunityIcons
                      name="check"
                      size={20}
                      color="#10B981"
                    />
                  )}
                </TouchableOpacity>
              )}
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
    backgroundColor: "#6366F1",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#6366F1",
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

  // Form Card
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
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
    alignItems: "center",
    gap: 12,
  },
  pickerButtonText: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#9CA3AF",
  },

  // Info Notice
  infoNotice: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  infoNoticeText: {
    flex: 1,
    fontSize: 12,
    color: "#1E40AF",
    lineHeight: 18,
    fontWeight: "500",
  },

  // Submit Button
  submitButton: {
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Requirements Card
  requirementsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  pickerModalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "50%",
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  genderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  genderItemText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
});

export default KYCForm;
