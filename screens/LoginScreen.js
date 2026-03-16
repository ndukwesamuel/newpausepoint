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
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { Login_Fun, reset_other_login } from "../Redux/AuthSlice";
import { authScreenChange } from "../Redux/OnboardingSlice";
import {
  remeberUSerPassword,
  setOtpEmail,
} from "../Redux/DontwantToResetSlice";
import { loginUser } from "../Redux/v2/AuthSlicev2";

const LoginScreen = () => {
  const { localremember } = useSelector((state) => state?.DontwantToResetSlice);
  const dispatch = useDispatch();
  const { isLoading: user_isLoading, usesrData2 } = useSelector(
    (state) => state.authSlice,
  );

  console.log({
    yuu: usesrData2,
  });

  const [email, setEmail] = useState(localremember?.email || "");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    mainPassword: localremember?.password || "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, text) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  const handleLogin = async () => {
    // Validate inputs
    if (!email.trim()) {
      return;
    }

    if (!passwords.mainPassword) {
      return;
    }

    const value = await AsyncStorage.getItem("PushToken");

    let data = {
      email: email,
      password: passwords.mainPassword,
      pushToken: value,
    };

    if (remember) {
      dispatch(
        remeberUSerPassword({
          remember,
          email: email,
          password: passwords.mainPassword,
        }),
      );
    }

    dispatch(setOtpEmail(email));
    // dispatch(Login_Fun(data));
    dispatch(loginUser(data));
  };

  useEffect(() => {
    return () => {
      dispatch(reset_other_login());
    };
  }, []);

  return (
    <View style={styles.container}>
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
          {/* Header Section */}
          <View style={styles.headerSection}>
            {/* Logo/Icon Container */}
            <View style={styles.logoContainer}>
              <View style={styles.logoIcon}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={40}
                  color="#10B981"
                />
              </View>
            </View>

            <Text style={styles.headerTitle}>Welcome Back</Text>
            <Text style={styles.headerSubtitle}>
              Sign in to continue to your account
            </Text>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => dispatch(authScreenChange("REGISTER"))}
            >
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Email Input */}
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
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
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

            {/* Remember Me & Forgot Password Row */}
            <View style={styles.optionsRow}>
              {/* Remember Me */}
              <TouchableOpacity
                onPress={() => setRemember(!remember)}
                style={styles.rememberContainer}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkbox, remember && styles.checkboxActive]}
                >
                  {remember && (
                    <MaterialCommunityIcons
                      name="check"
                      size={16}
                      color="#FFFFFF"
                    />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity
                onPress={() => dispatch(authScreenChange("FORGOTTENPASSWOD"))}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                user_isLoading && styles.signInButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={user_isLoading}
              activeOpacity={0.8}
            >
              {user_isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Text style={styles.signInButtonText}>Sign In</Text>
                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={20}
                    color="#FFFFFF"
                  />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => dispatch(authScreenChange("REGISTER"))}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.secondaryButtonText}>Create New Account</Text>
          </TouchableOpacity>

          {/* Footer Info */}
          <View style={styles.footer}>
            <MaterialCommunityIcons
              name="shield-lock"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.footerText}>
              Your data is secure and encrypted
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

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
    paddingTop: 40,
    paddingBottom: 40,
    flexGrow: 1,
    justifyContent: "center",
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 12,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
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
    marginBottom: 24,
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
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  rememberText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
  },
  forgotText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  signInButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  signInButtonDisabled: {
    opacity: 0.7,
  },
  signInButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    marginBottom: 20,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
});
