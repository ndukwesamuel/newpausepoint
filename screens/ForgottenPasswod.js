// import {
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import React, { useState } from "react";
// import AppScreen from "../components/shared/AppScreen";
// import { Forminput } from "../components/shared/InputForm";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useDispatch } from "react-redux";
// import Toast from "react-native-toast-message";
// import { authScreenChange } from "../Redux/OnboardingSlice";
// import { setOtpEmail } from "../Redux/DontwantToResetSlice";
// import { usePublicMutateData } from "../hooks/Request";

// // ✅ Import the new public hook
// // import { usePublicMutateData } from "../hook/Request";

// // usePublicMutateData
// const ForgottenPassword = () => {
//   const dispatch = useDispatch();
//   const [email, setEmail] = useState("");

//   // ✅ Use public hook (no token required)
//   const forgetPasswordMutation = usePublicMutateData(
//     "forgot-password",
//     "POST",
//     "forgot-password",
//   );

//   const handleSubmit = () => {
//     // Validation: Check if email is empty
//     if (!email) {
//       Toast.show({
//         type: "error",
//         text1: "Email Required",
//         text2: "Please enter your email address",
//       });
//       return;
//     }

//     // Validation: Check email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       Toast.show({
//         type: "error",
//         text1: "Invalid Email",
//         text2: "Please enter a valid email address",
//       });
//       return;
//     }

//     // Save email to Redux for OTP screen
//     dispatch(setOtpEmail(email));

//     // ✅ Call mutation with email
//     forgetPasswordMutation.mutate(
//       { email },
//       {
//         onSuccess: (data) => {
//           console.log("Forgot password success:", data);

//           Toast.show({
//             type: "success",
//             text1: "Code Sent!",
//             text2: data?.message || "Verification code sent to your email",
//           });

//           // Navigate to OTP/Create Password screen
//           dispatch(authScreenChange("CREATEPASSWORD"));
//         },
//         onError: (error) => {
//           console.log("Forgot password error:", error);

//           Toast.show({
//             type: "error",
//             text1: "Error",
//             text2: error?.message || "Failed to send verification code",
//           });
//         },
//       },
//     );
//   };

//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={styles.keyboardAvoidingView}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
//       >
//         <ScrollView
//           style={styles.scrollView}
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//           keyboardShouldPersistTaps="handled"
//         >
//           {/* Back Button */}
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => dispatch(authScreenChange("LOGIN"))}
//             activeOpacity={0.7}
//             disabled={forgetPasswordMutation.isPending}
//           >
//             <View style={styles.backButtonContainer}>
//               <MaterialCommunityIcons
//                 name="arrow-left"
//                 size={24}
//                 color="#374151"
//               />
//             </View>
//           </TouchableOpacity>

//           {/* Header Section */}
//           <View style={styles.headerSection}>
//             {/* Icon Container */}
//             <View style={styles.headerIconContainer}>
//               <MaterialCommunityIcons
//                 name="lock-question"
//                 size={32}
//                 color="#F59E0B"
//               />
//             </View>

//             <Text style={styles.headerTitle}>Forgot Password?</Text>
//             <Text style={styles.headerSubtitle}>
//               No worries! Enter your email address below and we'll send you a
//               verification code to reset your password.
//             </Text>
//           </View>

//           {/* Form Card */}
//           <View style={styles.formCard}>
//             {/* Section Header */}
//             <View style={styles.sectionHeader}>
//               <MaterialCommunityIcons
//                 name="email-outline"
//                 size={20}
//                 color="#10B981"
//                 style={styles.sectionIcon}
//               />
//               <Text style={styles.sectionTitle}>Email Address</Text>
//             </View>

//             {/* Email Input */}
//             <View style={styles.inputGroup}>
//               <Text style={styles.inputLabel}>Email</Text>
//               <View style={styles.inputWrapper}>
//                 <Forminput
//                   placeholder="Enter your email address"
//                   onChangeText={setEmail}
//                   value={email}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   autoCorrect={false}
//                   style={styles.input}
//                   editable={!forgetPasswordMutation.isPending}
//                 />
//               </View>
//             </View>

//             {/* Info Hint */}
//             <View style={styles.hintContainer}>
//               <MaterialCommunityIcons
//                 name="information-outline"
//                 size={16}
//                 color="#6B7280"
//               />
//               <Text style={styles.hintText}>
//                 We'll send a 6-digit code to this email
//               </Text>
//             </View>
//           </View>

//           {/* Submit Button */}
//           <TouchableOpacity
//             style={[
//               styles.submitButton,
//               forgetPasswordMutation.isPending && styles.submitButtonDisabled,
//             ]}
//             onPress={handleSubmit}
//             disabled={forgetPasswordMutation.isPending}
//             activeOpacity={0.8}
//           >
//             {forgetPasswordMutation.isPending ? (
//               <View style={styles.buttonContent}>
//                 <ActivityIndicator color="white" size="small" />
//                 <Text style={styles.submitButtonText}>Sending...</Text>
//               </View>
//             ) : (
//               <View style={styles.buttonContent}>
//                 <MaterialCommunityIcons
//                   name="email-fast-outline"
//                   size={20}
//                   color="#FFFFFF"
//                 />
//                 <Text style={styles.submitButtonText}>
//                   Send Verification Code
//                 </Text>
//               </View>
//             )}
//           </TouchableOpacity>

//           {/* Back to Login Link */}
//           <TouchableOpacity
//             style={styles.backToLoginContainer}
//             onPress={() => dispatch(authScreenChange("LOGIN"))}
//             activeOpacity={0.7}
//             disabled={forgetPasswordMutation.isPending}
//           >
//             <MaterialCommunityIcons
//               name="arrow-left"
//               size={18}
//               color="#10B981"
//             />
//             <Text style={styles.backToLoginText}>Back to Login</Text>
//           </TouchableOpacity>

//           {/* Security Note */}
//           <View style={styles.securityNote}>
//             <MaterialCommunityIcons
//               name="shield-check-outline"
//               size={20}
//               color="#10B981"
//             />
//             <Text style={styles.securityNoteText}>
//               Your account security is our priority
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default ForgottenPassword;

// const styles = StyleSheet.create({
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 16,
//     paddingVertical: 20,
//     paddingBottom: 40,
//   },

//   // Back Button
//   backButton: {
//     marginBottom: 24,
//   },
//   backButtonContainer: {
//     width: 44,
//     height: 44,
//     borderRadius: 12,
//     backgroundColor: "#FFFFFF",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },

//   // Header Section
//   headerSection: {
//     alignItems: "center",
//     marginBottom: 32,
//   },
//   headerIconContainer: {
//     width: 72,
//     height: 72,
//     borderRadius: 20,
//     backgroundColor: "#FEF3C7",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 20,
//     shadowColor: "#F59E0B",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.15,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   headerTitle: {
//     fontSize: 24,
//     fontWeight: "700",
//     color: "#111827",
//     letterSpacing: 0.3,
//     marginBottom: 12,
//     textAlign: "center",
//   },
//   headerSubtitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#6B7280",
//     textAlign: "center",
//     lineHeight: 22,
//     paddingHorizontal: 16,
//   },

//   // Form Card
//   formCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
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
//   sectionIcon: {
//     marginRight: 8,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },

//   // Input Groups
//   inputGroup: {
//     marginBottom: 16,
//   },
//   inputLabel: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 8,
//     letterSpacing: 0.3,
//   },
//   inputWrapper: {
//     // Wrapper for any additional styling if needed
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

//   // Hint
//   hintContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F3F4F6",
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     marginTop: 4,
//   },
//   hintText: {
//     fontSize: 12,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginLeft: 8,
//   },

//   // Submit Button
//   submitButton: {
//     backgroundColor: "#10B981",
//     paddingVertical: 16,
//     borderRadius: 16,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   submitButtonDisabled: {
//     backgroundColor: "#6EE7B7",
//     shadowOpacity: 0.15,
//   },
//   buttonContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   submitButtonText: {
//     color: "#FFFFFF",
//     fontSize: 16,
//     fontWeight: "700",
//     letterSpacing: 0.3,
//     marginLeft: 8,
//   },

//   // Back to Login
//   backToLoginContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//     marginBottom: 16,
//   },
//   backToLoginText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#10B981",
//     marginLeft: 6,
//   },

//   // Security Note
//   securityNote: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 12,
//   },
//   securityNoteText: {
//     fontSize: 13,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginLeft: 8,
//   },
// });

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
import { Forminput } from "../components/shared/InputForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Toast from "react-native-toast-message";
import { authScreenChange } from "../Redux/OnboardingSlice";
import { setOtpEmail } from "../Redux/DontwantToResetSlice";

// ✅ Same pattern as CreatePassword - raw axios + useMutation
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const ForgottenPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  // ✅ Exact same pattern as CreatePassword
  const forgetPasswordMutation = useMutation({
    mutationFn: (data_info) => {
      let url =
        "https://uneven-tarrah-pausepoint-950a7a7b.koyeb.app/forgot-password";

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      console.log("Forgot password success:", success?.data);

      Toast.show({
        type: "success",
        text1: "Code Sent!",
        text2: success?.data?.message || "Verification code sent to your email",
      });

      dispatch(authScreenChange("CREATEPASSWORD"));
    },
    onError: (error) => {
      console.log("Forgot password error:", error);

      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "Failed to send verification code",
      });
    },
  });

  const handleSubmit = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Email Required",
        text2: "Please enter your email address",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address",
      });
      return;
    }

    // Save email to Redux for OTP screen
    dispatch(setOtpEmail(email));

    // ✅ Same as CreatePassword - just pass the data
    forgetPasswordMutation.mutate({ email });
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
            onPress={() => dispatch(authScreenChange("LOGIN"))}
            activeOpacity={0.7}
            disabled={forgetPasswordMutation.isPending}
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
            <View style={styles.headerIconContainer}>
              <MaterialCommunityIcons
                name="lock-question"
                size={32}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.headerTitle}>Forgot Password?</Text>
            <Text style={styles.headerSubtitle}>
              No worries! Enter your email address below and we'll send you a
              verification code to reset your password.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#10B981"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Email Address</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Forminput
                  placeholder="Enter your email address"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!forgetPasswordMutation.isPending}
                />
              </View>
            </View>

            <View style={styles.hintContainer}>
              <MaterialCommunityIcons
                name="information-outline"
                size={16}
                color="#6B7280"
              />
              <Text style={styles.hintText}>
                We'll send a 6-digit code to this email
              </Text>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              forgetPasswordMutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={forgetPasswordMutation.isPending}
            activeOpacity={0.8}
          >
            {forgetPasswordMutation.isPending ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitButtonText}>Sending...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <MaterialCommunityIcons
                  name="email-fast-outline"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitButtonText}>
                  Send Verification Code
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Back to Login */}
          <TouchableOpacity
            style={styles.backToLoginContainer}
            onPress={() => dispatch(authScreenChange("LOGIN"))}
            activeOpacity={0.7}
            disabled={forgetPasswordMutation.isPending}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={18}
              color="#10B981"
            />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Security Note */}
          <View style={styles.securityNote}>
            <MaterialCommunityIcons
              name="shield-check-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.securityNoteText}>
              Your account security is our priority
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default ForgottenPassword;

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
  headerSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#F59E0B",
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
    marginBottom: 12,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
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
  inputWrapper: {},
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
  backToLoginContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginBottom: 16,
  },
  backToLoginText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10B981",
    marginLeft: 6,
  },
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
