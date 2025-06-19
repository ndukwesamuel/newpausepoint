// import {
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
// import { useMutation } from "react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
// import { useNavigation } from "@react-navigation/native";
// import { authScreenChange } from "../Redux/OnboardingSlice";
// import { setOtpEmail } from "../Redux/DontwantToResetSlice";

// const CreatePassword = ({}) => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   // Get the email from Redux store that was set in the previous step
//   const { otpemail } = useSelector((state) => state.DontwantToResetSlice);

//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };

//   const ResetPassword_Mutation = useMutation(
//     (data_info) => {
//       let url = `${API_BASEURL}reset-password`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           // Authorization: `Bearer ${user_data?.token}`, // Remove if not needed for password reset
//         },
//       };

//       return axios.post(url, data_info, config);
//     },
//     {
//       onSuccess: (success) => {
//         Toast.show({
//           type: "success",
//           text1: `${success?.data?.message}`,
//         });

//         // Navigate to login screen after successful password reset
//         dispatch(authScreenChange("LOGIN"));
//       },

//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: `${error?.response?.data?.error || "Password reset failed"} `,
//         });
//       },
//     }
//   );

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

//     ResetPassword_Mutation.mutate({
//       email: otpemail,
//       otp,
//       password: newPassword,
//       password_confirmation: confirmPassword,
//     });
//   };

//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "padding"}
//         style={{ flex: 1 }}
//       >
//         <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
//           <View style={{ flex: 1 }}>
//             <TouchableOpacity
//               style={{ marginBottom: 30 }}
//               onPress={() => dispatch(authScreenChange("LOGIN"))}
//             >
//               <AntDesign name="arrowleft" size={28} color="black" />
//             </TouchableOpacity>

//             <RegistraionHeadersText data="Create New Password" textStyle={{}} />

//             <RegistraionParagraphText
//               data="Please enter your new password, and ensure to keep it safe."
//               color="#8E8E8F"
//             />

//             <RegistraionParagraphText
//               data={otpemail}
//               color="#8E8E8F"
//               style={{ marginBottom: 20 }}
//             />

//             {/* OTP Input */}
//             <View style={{ marginBottom: 15 }}>
//               <FormLabel data="Verification Code" />
//               <Forminput
//                 placeholder="Enter OTP code"
//                 onChangeText={setOtp}
//                 value={otp}
//                 keyboardType="numeric"
//               />
//             </View>

//             {/* New Password Input */}
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

//             {/* Confirm Password Input */}
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
//               isLoading={ResetPassword_Mutation.isLoading}
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
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import {
  RegistraionHeadersText,
  RegistraionParagraphText,
} from "../components/shared/Registraion";
import {
  FormLabel,
  Formbutton,
  Forminput,
  Forminputpassword,
} from "../components/shared/InputForm";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
import { useNavigation } from "@react-navigation/native"; // Although useNavigation is here, we are using Redux for Auth flow
import { authScreenChange } from "../Redux/OnboardingSlice";
import { setOtpEmail } from "../Redux/DontwantToResetSlice";

const CreatePassword = ({}) => {
  const navigation = useNavigation(); // This is for react-navigation stacks, not directly controlling Auth screen state
  const dispatch = useDispatch();

  // Get the email from Redux store that was set in the previous step
  const { otpemail } = useSelector((state) => state.DontwantToResetSlice);

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const ResetPassword_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}reset-password`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: `${success?.data?.message}`,
        });

        // On successful password reset, navigate to the LOGIN screen
        dispatch(authScreenChange("LOGIN"));
        // Potentially clear the otpemail from state if it's no longer needed
        dispatch(setOtpEmail(null));
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error || "Password reset failed"} `,
        });
      },
    }
  );

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

    console.log({
      aaa: otpemail,
      bbb: otp,
      ccc: newPassword,
      ddd: confirmPassword,
    });

    ResetPassword_Mutation.mutate({
      email: otpemail,
      otp,
      password: newPassword,
      password_confirmation: confirmPassword,
    });
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"} // Use "height" for Android typically
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flex: 1 }}>
            {/* Back button */}
            <TouchableOpacity
              style={{ marginBottom: 30 }}
              onPress={() => {
                // When going back, navigate to the FORGOTTENPASSWOD screen
                // or directly to LOGIN if that's the desired flow.
                // Assuming you might want to go back to ForgottenPassword to re-enter email/OTP if needed.
                dispatch(authScreenChange("FORGOTTENPASSWOD"));
              }}
            >
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>

            <RegistraionHeadersText data="Create New Password" textStyle={{}} />

            <RegistraionParagraphText
              data="Please enter your new password, and ensure to keep it safe."
              color="#8E8E8F"
            />

            {/* Displaying email - useful for context */}
            <RegistraionParagraphText
              data={otpemail}
              color="#8E8E8F"
              style={{ marginBottom: 20 }}
            />

            {/* OTP Input */}
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Verification Code" />
              <Forminput
                placeholder="Enter OTP code"
                onChangeText={setOtp}
                value={otp}
                keyboardType="numeric"
              />
            </View>

            {/* New Password Input */}
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="New Password" />
              <Forminputpassword
                placeholder="Enter new password"
                onChangeText={setNewPassword}
                value={newPassword}
                secureTextEntry={!isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            </View>

            {/* Confirm Password Input */}
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Confirm Password" />
              <Forminputpassword
                placeholder="Confirm new password"
                onChangeText={setConfirmPassword}
                value={confirmPassword}
                secureTextEntry={!isPasswordVisible}
                togglePasswordVisibility={togglePasswordVisibility}
              />
            </View>
          </View>

          {/* Reset Password Button */}
          <View style={{}}>
            <Formbutton
              buttonStyle={{
                backgroundColor: "#04973C",
                paddingVertical: 14,
                alignItems: "center",
                borderRadius: 5,
              }}
              textStyle={{
                color: "white",
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
              }}
              data="Reset Password"
              onPress={handleSubmit}
              isLoading={ResetPassword_Mutation.isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({});
