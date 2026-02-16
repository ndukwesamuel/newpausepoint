// import {
//   Button,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import AppScreen from "../components/shared/AppScreen";
// import {
//   RegistraionHeadersText,
//   RegistraionParagraphText,
// } from "../components/shared/Registraion";
// import {
//   FormLabel,
//   Formbutton,
//   Forminput,
//   Forminputpassword,
// } from "../components/shared/InputForm";
// import { AntDesign } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useMutation } from "@tanstack/react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
// import { useNavigation } from "@react-navigation/native";
// import { authScreenChange } from "../Redux/OnboardingSlice";
// import { setOtpEmail } from "../Redux/DontwantToResetSlice";

// const CreatePassword = ({}) => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   const { otpemail } = useSelector((state) => state.DontwantToResetSlice);

//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   const ResetPassword_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       // NOTE: The URL below seems hardcoded in the original request.
//       // In a production environment, you should use API_BASEURL or a configured endpoint.
//       let url =
//         "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/reset-forgotten-password";

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//         },
//       };

//       return axios.post(url, data_info, config);
//     },
//     onSuccess: (success) => {
//       Toast.show({
//         type: "success",
//         text1: `${success?.data?.data}`,
//       });

//       dispatch(authScreenChange("LOGIN"));
//       dispatch(setOtpEmail(null));
//     },
//     onError: (error) => {
//       Toast.show({
//         type: "error",
//         text1: `${error?.response?.data?.error || "Password reset failed"} `,
//       });
//     },
//   });

//   const handleSubmit = () => {
//     if (newPassword !== confirmPassword) {
//       Toast.show({
//         type: "error",
//         text1: "Passwords do not match",
//       });
//       return;
//     }

//     if (newPassword.length < 8) {
//       Toast.show({
//         type: "error",
//         text1: "Password must be at least 8 characters",
//       });
//       return;
//     }

//     console.log({
//       aaa: otpemail,
//       bbb: otp,
//       ccc: newPassword,
//       ddd: confirmPassword,
//     });

//     ResetPassword_Mutation.mutate({
//       email: otpemail,
//       otp,
//       passoword: newPassword,
//       password_confirmation: confirmPassword,
//     });
//   };

//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
//           <View style={{ flex: 1 }}>
//             <TouchableOpacity
//               style={{ marginBottom: 30 }}
//               onPress={() => {
//                 dispatch(authScreenChange("FORGOTTENPASSWOD"));
//               }}
//             >
//               <AntDesign name="arrowleft" size={28} color="black" />
//             </TouchableOpacity>

//             <RegistraionHeadersText
//               data="Create New Password"
//               textStyle={{}}
//             />

//             <RegistraionParagraphText
//               data="Please enter your new password, and ensure to keep it safe."
//               color="#8E8E8F"
//             />

//             <RegistraionParagraphText
//               data={otpemail}
//               color="#8E8E8F"
//               style={{ marginBottom: 20 }}
//             />

//             <View style={{ marginBottom: 15 }}>
//               <FormLabel data="Verification Code" />
//               <Forminput
//                 placeholder="Enter OTP code"
//                 onChangeText={setOtp}
//                 value={otp}
//                 keyboardType="numeric"
//               />
//             </View>

//             <View style={{ marginBottom: 15 }}>
//               <FormLabel data="New Password" />
//               <Forminputpassword
//                 placeholder="Enter new password"
//                 onChangeText={setNewPassword}
//                 value={newPassword}
//                 secureTextEntry={!isPasswordVisible}
//                 togglePasswordVisibility={togglePasswordVisibility}
//               />
//             </View>

//             <View style={{ marginBottom: 15 }}>
//               <FormLabel data="Confirm Password" />
//               <Forminputpassword
//                 placeholder="Confirm new password"
//                 onChangeText={setConfirmPassword}
//                 value={confirmPassword}
//                 secureTextEntry={!isPasswordVisible}
//                 togglePasswordVisibility={togglePasswordVisibility}
//               />
//             </View>
//           </View>

//           <View style={{}}>
//             <Formbutton
//               buttonStyle={{
//                 backgroundColor: "#04973C",
//                 paddingVertical: 14,
//                 alignItems: "center",
//                 borderRadius: 5,
//               }}
//               textStyle={{
//                 color: "white",
//                 fontWeight: "500",
//                 fontSize: 14,
//                 fontFamily: "RobotoSlab-Medium",
//               }}
//               data="Reset Password"
//               onPress={handleSubmit}
//               isLoading={ResetPassword_Mutation.isPending}
//             />
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default CreatePassword;

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
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
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
      let url =
        "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/reset-forgotten-password";

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
        text1: `${success?.data?.data}`,
      });

      dispatch(authScreenChange("LOGIN"));
      dispatch(setOtpEmail(null));
    },
    onError: (error) => {
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
      passoword: newPassword,
      password_confirmation: confirmPassword,
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
            {!ResetPassword_Mutation.isPending ? (
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
