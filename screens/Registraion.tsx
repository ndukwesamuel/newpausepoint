import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { authScreenChange } from "../Redux/OnboardingSlice";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
const API_BASEURL_v2 = process.env.EXPO_PUBLIC_API_URL_v2;

interface Registraionprops {
  mainPassword: string;
  confirmPassword: string;
}

const Registration = () => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwords, setPasswords] = useState<Registraionprops>({
    mainPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (
    field: keyof Registraionprops,
    text: string,
  ) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  // Validate Nigerian phone number
  const validateNigerianPhoneNumber = (phone: string): boolean => {
    const cleanedPhone = phone.replace(/\s+/g, "");

    if (cleanedPhone.length !== 11) {
      setPhoneNumberError("Phone number must be 11 digits");
      return false;
    }

    if (!cleanedPhone.startsWith("0")) {
      setPhoneNumberError("Phone number must start with 0");
      return false;
    }

    const prefix = cleanedPhone.substring(0, 2);
    if (prefix !== "07" && prefix !== "08" && prefix !== "09") {
      setPhoneNumberError("Phone number must start with 07, 08, or 09");
      return false;
    }

    if (!/^\d+$/.test(cleanedPhone)) {
      setPhoneNumberError("Phone number must contain only digits");
      return false;
    }

    setPhoneNumberError("");
    return true;
  };

  const handlePhoneNumberChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "").substring(0, 11);
    setPhoneNumber(cleaned);

    if (phoneNumberError) {
      setPhoneNumberError("");
    }
  };

  const RegistrationMutation = useMutation({
    mutationFn: (_) => {
      let joinurl = `${API_BASEURL_v2}api/v1/auth/signup`;

      let data = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        password: passwords.mainPassword,
      };

      console.log({ data });

      return axios.post(joinurl, data);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Registration successful!",
      });
      dispatch(authScreenChange("LOGIN"));
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });

  const handleSubmit = () => {
    if (!validateNigerianPhoneNumber(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: phoneNumberError || "Invalid phone number",
      });
      return;
    }

    if (!firstName.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your first name",
      });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your last name",
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your email",
      });
      return;
    }

    if (!passwords.mainPassword) {
      Toast.show({
        type: "error",
        text1: "Please enter a password",
      });
      return;
    }

    if (passwords.mainPassword !== passwords.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    RegistrationMutation.mutate();
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View
          style={{
            flex: 1,
            marginTop: 60,
          }}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerSubtitle}>
              Join PausePoint and start your financial journey
            </Text>
          </View>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={styles.signInText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => dispatch(authScreenChange("LOGIN"))}
              >
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              {/* Name Fields Row */}
              <View style={styles.nameRow}>
                {/* First Name */}
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>First Name</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account"
                      size={20}
                      color="#6B7280"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="First Name"
                      placeholderTextColor="#9CA3AF"
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>

                {/* Last Name */}
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Last Name</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account"
                      size={20}
                      color="#6B7280"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Last Name"
                      placeholderTextColor="#9CA3AF"
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="email-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Phone Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="phone"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="08012345678"
                    placeholderTextColor="#9CA3AF"
                    value={phoneNumber}
                    onChangeText={handlePhoneNumberChange}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>
                {phoneNumberError ? (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={14}
                      color="#DC2626"
                    />
                    <Text style={styles.errorText}>{phoneNumberError}</Text>
                  </View>
                ) : null}
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#9CA3AF"
                    value={passwords.mainPassword}
                    onChangeText={(text) =>
                      handlePasswordChange("mainPassword", text)
                    }
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <MaterialCommunityIcons
                    name="lock-outline"
                    size={20}
                    color="#6B7280"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm your password"
                    placeholderTextColor="#9CA3AF"
                    value={passwords.confirmPassword}
                    onChangeText={(text) =>
                      handlePasswordChange("confirmPassword", text)
                    }
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeIcon}
                  >
                    <MaterialCommunityIcons
                      name={
                        showConfirmPassword ? "eye-outline" : "eye-off-outline"
                      }
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  RegistrationMutation.isPending && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={RegistrationMutation.isPending}
                activeOpacity={0.8}
              >
                {RegistrationMutation.isPending ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <>
                    <Text style={styles.submitButtonText}>Create Account</Text>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color="#FFFFFF"
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Footer Info */}
            <View style={styles.footer}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color="#6B7280"
              />
              <Text style={styles.footerText}>
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </Text>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Registration;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",

    lineHeight: 22,
  },
  signInContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },
  signInLink: {
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 20,
  },
  nameRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  halfInput: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    padding: 0,
  },
  eyeIcon: {
    padding: 4,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#DC2626",
  },
  submitButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  footerText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 18,
  },
});
