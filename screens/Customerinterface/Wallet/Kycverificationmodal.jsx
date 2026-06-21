import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  Forminput,
  FormLabel,
  Formbutton,
} from "../../../components/shared/InputForm";
import { useMutateData_v2 } from "../../../hooks/Requestv2";
import Toast from "react-native-toast-message";

const genderOptions = ["MALE", "FEMALE"];

const KYCVerificationModal = ({ visible, onClose, onSuccess }) => {
  const [bvn, setBvn] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState("MALE");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  // Dummy selfie URL
  const DUMMY_SELFIE_URL = "https://storage.example.com/selfies/user123.jpg";

  // KYC Submission Mutation
  const submitKYC = useMutateData_v2("api/v1/bank/kyc", "POST", "kyc");

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const calculateAge = (birthDate) => {
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

  const handleGenderSelect = (option) => {
    setGender(option);
    setShowGenderDropdown(false);
  };

  const handleSubmit = () => {
    // Validation
    if (!bvn || bvn.length !== 11) {
      Toast.show({
        type: "error",
        text1: "Invalid BVN",
        text2: "BVN must be exactly 11 digits",
      });
      return;
    }

    // Age validation - must be 18 or older
    const age = calculateAge(dateOfBirth);
    if (age < 18) {
      Toast.show({
        type: "error",
        text1: "Age Restriction",
        text2: "You must be at least 18 years old to complete KYC",
      });
      return;
    }

    const payload = {
      bvn: bvn.trim(),
      selfie: DUMMY_SELFIE_URL,
      dateOfBirth: formatDate(dateOfBirth),
      gender: gender,
    };

    console.log("KYC Payload:", payload);

    submitKYC.mutate(payload, {
      onSuccess: (response) => {
        Toast.show({
          type: "success",
          text1: "KYC Submitted Successfully! ✅",
          text2: "Your verification is being processed",
        });

        // Reset form
        setBvn("");
        setDateOfBirth(new Date());
        setGender("MALE");

        // Call onSuccess callback to refetch bank info
        onSuccess?.();

        // Close modal
        onClose();
      },
      onError: (error) => {
        const errorMessage =
          error?.data?.error ||
          error?.data?.message ||
          "Failed to submit KYC verification";
        Toast.show({
          type: "error",
          text1: "KYC Submission Failed",
          text2: errorMessage,
        });
      },
    });
  };

  const handleClose = () => {
    // Reset form on close
    setBvn("");
    setDateOfBirth(new Date());
    setGender("MALE");
    setShowGenderDropdown(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerTitleContainer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color="#F59E0B"
              />
              <Text style={styles.modalTitle}>KYC Verification</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* BVN Input */}
            <View style={styles.inputGroup}>
              <FormLabel data="Bank Verification Number (BVN)" />
              <Forminput
                placeholder="Enter 11-digit BVN"
                value={bvn}
                onChangeText={setBvn}
                keyboardType="number-pad"
                maxLength={11}
              />
              <Text style={styles.helperText}>
                Your BVN is required for identity verification
              </Text>
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <FormLabel data="Date of Birth" />
              <TouchableOpacity
                style={styles.datePickerTrigger}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.datePickerText}>
                  {formatDate(dateOfBirth)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={dateOfBirth}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                  minimumDate={new Date(1900, 0, 1)}
                />
              )}
              <Text style={styles.helperText}>
                You must be at least 18 years old
              </Text>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputGroup}>
              <FormLabel data="Gender" />
              <TouchableOpacity
                style={styles.genderTrigger}
                onPress={() => setShowGenderDropdown(!showGenderDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.genderText}>{gender}</Text>
                <MaterialCommunityIcons
                  name={showGenderDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {/* Inline Dropdown */}
              {showGenderDropdown && (
                <View style={styles.inlineDropdown}>
                  {genderOptions.map((option, index) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.dropdownItem,
                        gender === option && styles.selectedDropdownItem,
                        index === genderOptions.length - 1 &&
                          styles.lastDropdownItem,
                      ]}
                      onPress={() => handleGenderSelect(option)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dropdownItemText,
                          gender === option && styles.selectedDropdownText,
                        ]}
                      >
                        {option}
                      </Text>
                      {gender === option && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#10B981"
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color="#2563EB"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.infoText}>
                All information will be securely verified with your bank
                records. You must be 18 years or older to proceed.
              </Text>
            </View>

            {/* Submit Button */}
            <Formbutton
              buttonStyle={styles.submitButton}
              textStyle={styles.submitButtonText}
              data="Submit KYC Verification"
              onPress={handleSubmit}
              isLoading={submitKYC.isPending || submitKYC.isLoading}
            />

            {/* Extra padding at bottom for better scrolling */}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontStyle: "italic",
  },
  datePickerTrigger: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  genderTrigger: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genderText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  inlineDropdown: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  lastDropdownItem: {
    borderBottomWidth: 0,
  },
  selectedDropdownItem: {
    backgroundColor: "#D1FAE5",
  },
  dropdownItemText: {
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },
  selectedDropdownText: {
    color: "#065F46",
    fontWeight: "700",
  },
  infoBox: {
    backgroundColor: "#DBEAFE",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  infoText: {
    fontSize: 13,
    color: "#1E40AF",
    lineHeight: 18,
    flex: 1,
  },
  submitButton: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default KYCVerificationModal;
