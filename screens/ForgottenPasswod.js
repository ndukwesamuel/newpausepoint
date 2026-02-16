// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import AppScreen from "../components/shared/AppScreen";
// import RegHeaders from "../components/shared/RegHeaders";
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
// import { Ionicons, AntDesign } from "@expo/vector-icons";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import Toast from "react-native-toast-message";

// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import { useNavigation } from "@react-navigation/native";
// import { authScreenChange } from "../Redux/OnboardingSlice";
// import { setOtpEmail } from "../Redux/DontwantToResetSlice";
// // Import useMutation from TanStack Query
// import { useMutation } from "@tanstack/react-query";

// const ForgottenPasswod = ({}) => {
//   const navigation = useNavigation();

//   const dispatch = useDispatch();
//   const [inputValue, setInputValue] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const {
//     user_data,
//     // Removed unused user_isError, user_isSuccess, user_isLoading, user_message
//   } = useSelector((state) => state.AuthSlice);

//   const [remember, setRemember] = useState(false);

//   const [passwords, setPasswords] = useState({
//     mainPassword: "",
//     confirmPassword: "",
//   });

//   const handlePasswordChange = (field, text) => {
//     setPasswords((prevPasswords) => ({
//       ...prevPasswords,
//       [field]: text,
//     }));
//   };

//   const handleSubmit = () => {
//     console.log("Current Password:", passwords.mainPassword);
//     console.log("New Password:", passwords.confirmPassword);
//     // Add your password change logic here, e.g., sending it to a server
//   };

//   const handleInputChange = (text) => {
//     setInputValue(text);
//   };

//   // Convert to TanStack Query's object-based useMutation syntax
//   const Forget_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       let url = `${API_BASEURL}forgot-password`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       // Assuming data_info is { email: 'user@example.com' }
//       return axios.post(url, data_info, config);
//     },
//     onSuccess: (success) => {
//       Toast.show({
//         type: "success",
//         text1: `${success?.data?.message}`,
//       });

//       // Dispatch action to change screen after successful request
//       dispatch(authScreenChange("CREATEPASSWORD"));
//     },

//     onError: (error) => {
//       console.log({
//         nnnnnnn: error?.response?.data,
//       });
//       Toast.show({
//         type: "error",
//         text1: `${error?.response?.data?.error} `,
//       });
//     },
//   });

//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
//           <View style={{ flex: 1 }}>
//             {/* <TouchableOpacity style={{ marginBottom: 30 }}
//                             onPress={() => navigation.goBack()}> */}

//             <TouchableOpacity
//               style={{ marginBottom: 30 }}
//               onPress={() => dispatch(authScreenChange("LOGIN"))}
//             >
//               <AntDesign name="arrowleft" size={28} color="black" />
//             </TouchableOpacity>

//             <RegistraionHeadersText data="Forgotten Passwod" textStyle={{}} />

//             <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
//               <RegistraionParagraphText
//                 data="Please enter your email address below, we’ll send you a verification code."
//                 color="#8E8E8F"
//               />
//             </View>

//             <View style={{ marginBottom: 15 }}>
//               <FormLabel data="Email " />
//               <Forminput
//                 placeholder="Enter your email"
//                 onChangeText={setEmail}
//                 value={email}
//                 keyboardType="email-address" // Added keyboard type for email
//                 autoCapitalize="none" // Ensure email is not auto-capitalized
//               />
//             </View>
//           </View>

//           <View style={{ flex: 0.3 }}>
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
//               data="Submit"
//               onPress={() => {
//                 dispatch(setOtpEmail(email));

//                 // Call the mutation with the email
//                 Forget_Mutation.mutate({ email });
//               }}
//               isLoading={Forget_Mutation.isLoading}
//             />
//           </View>
//         </View>
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default ForgottenPasswod;

// const styles = StyleSheet.create({});

import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import {
  FormLabel,
  Formbutton,
  Forminput,
} from "../components/shared/InputForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useNavigation } from "@react-navigation/native";
import { authScreenChange } from "../Redux/OnboardingSlice";
import { setOtpEmail } from "../Redux/DontwantToResetSlice";
import { useMutation } from "@tanstack/react-query";
import { ActivityIndicator } from "react-native";

const ForgottenPassword = ({}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const { user_data } = useSelector((state) => state.AuthSlice);

  const Forget_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}forgot-password`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: `${success?.data?.message}`,
      });

      dispatch(authScreenChange("CREATEPASSWORD"));
    },
    onError: (error) => {
      console.log({
        error: error?.response?.data,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.error} `,
      });
    },
  });

  const handleSubmit = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter your email address",
      });
      return;
    }

    dispatch(setOtpEmail(email));
    Forget_Mutation.mutate({ email });
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
            {/* Section Header */}
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color="#10B981"
                style={styles.sectionIcon}
              />
              <Text style={styles.sectionTitle}>Email Address</Text>
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={styles.inputWrapper}>
                <Forminput
                  placeholder="Enter your email address"
                  onChangeText={setEmail}
                  value={email}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>
            </View>

            {/* Info Hint */}
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
              Forget_Mutation.isPending && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={Forget_Mutation.isPending}
            activeOpacity={0.8}
          >
            {Forget_Mutation.isPending ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="white" />
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

          {/* Back to Login Link */}
          <TouchableOpacity
            style={styles.backToLoginContainer}
            onPress={() => dispatch(authScreenChange("LOGIN"))}
            activeOpacity={0.7}
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
    marginBottom: 16,
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

  // Back to Login
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
