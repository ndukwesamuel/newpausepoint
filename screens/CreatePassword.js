

// const styles = StyleSheet.create({});

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import {
  FormLabel,
  Formbutton,
  Forminput,
  Forminputpassword,
} from "../components/shared/InputForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useMutation } from "@tanstack/react-query";
import { API_CONFIG } from "../hooks/api";
import { useNavigation } from "@react-navigation/native";
import { authScreenChange } from "../Redux/OnboardingSlice";
import { setOtpEmail } from "../Redux/DontwantToResetSlice";

const CreatePassword = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { otpemail } = useSelector((state) => state.DontwantToResetSlice);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const ResetPassword_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_CONFIG.BASE_URL}api/v1/auth/reset-password`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: success?.data?.message || "Password Updated",
      });

      dispatch(authScreenChange("LOGIN"));
      dispatch(setOtpEmail(null));
    },
    onError: (error) => {

      console.log("Reset Password Error:", error?.response);
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.error || "Password reset failed"} `,
      });
    },
  });

  const handleSubmit = () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    if (newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "Password must be at least 8 characters",
      });
      return;
    }

    ResetPassword_Mutation.mutate({
      email: otpemail,
      otp,
      password: newPassword,
    });
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              dispatch(authScreenChange("FORGOTTENPASSWOD"));
            }}
            activeOpacity={0.7}
          >
            <View style={styles.backButtonContainer}>
              <MaterialCommunityIcons
                name="arrow-left"
                size={24}
                color="#374151"
              />
            </View>
          </TouchableOpacity>

          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Icon Container */}
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="lock-reset"
                size={32}
                color="#10B981"
              />
            </View>

            <Text style={styles.headerTitle}>Create New Password </Text>
            <Text style={styles.headerSubtitle}>
              Please enter your new password, and ensure to keep it safe.
            </Text>

            {/* Email Badge */}
            {otpemail && (
              <View style={styles.emailBadge}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={16}
                  color="#10B981"
                />
                <Text style={styles.emailText}>{otpemail}</Text>
              </View>
            )}
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="form-textbox-password"
                size={20}
                color="#10B981"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Reset Details</Text>
            </View>

            {/* OTP Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Verification Code</Text>
              <View style={styles.inputWrapper}>
                <Forminput
                  placeholder="Enter OTP code"
                  onChangeText={setOtp}
                  value={otp}
                  keyboardType="numeric"
                  style={styles.input}
                />
              </View>
            </View>

            {/* New Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>New Password</Text>
              <View style={styles.inputWrapper}>
                <Forminputpassword
                  placeholder="Enter new password"
                  onChangeText={setNewPassword}
                  value={newPassword}
                  secureTextEntry={!isPasswordVisible}
                  togglePasswordVisibility={togglePasswordVisibility}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Forminputpassword
                  placeholder="Confirm new password"
                  onChangeText={setConfirmPassword}
                  value={confirmPassword}
                  secureTextEntry={!isPasswordVisible}
                  togglePasswordVisibility={togglePasswordVisibility}
                  style={styles.input}
                />
              </View>
            </View>

            {/* Password Requirements Hint */}
            <View style={styles.hintContainer}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color="#6B7280"
              />
              <Text style={styles.hintText}>
                Password must be at least 8 characters
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              ResetPassword_Mutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={ResetPassword_Mutation.isPending}
            activeOpacity={0.8}
          >
            {ResetPassword_Mutation.isPending ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="white" />
                <Text style={styles.submitButtonText}>Resetting...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons
                  name="lock-check"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>Reset Password</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.securityNoteText}>
              Your password is encrypted and secure
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingBottom: 40,
  },

  // Back Button
  backButton: {
    marginBottom: 24,
  },
  backButtonContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // Header Section
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  emailBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  emailText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
    marginLeft: 8,
  },

  // Form Card
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
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
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Input Groups
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputWrapper: {
    // Wrapper for any additional styling if needed
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

  // Hint
  hintContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
  },

  // Submit Button
  submitButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#6EE7B7",
    shadowOpacity: 0.15,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginLeft: 8,
  },

  // Security Note
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  securityNoteText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
  },
});
