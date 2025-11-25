import {
  Button,
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
      // NOTE: The URL below seems hardcoded in the original request.
      // In a production environment, you should use API_BASEURL or a configured endpoint.
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

    console.log({
      aaa: otpemail,
      bbb: otp,
      ccc: newPassword,
      ddd: confirmPassword,
    });

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
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ marginBottom: 30 }}
              onPress={() => {
                dispatch(authScreenChange("FORGOTTENPASSWOD"));
              }}
            >
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>

            <RegistraionHeadersText
              data="Create New Password "
              textStyle={{}}
            />

            <RegistraionParagraphText
              data="Please enter your new password, and ensure to keep it safe."
              color="#8E8E8F"
            />

            <RegistraionParagraphText
              data={otpemail}
              color="#8E8E8F"
              style={{ marginBottom: 20 }}
            />

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Verification Code" />
              <Forminput
                placeholder="Enter OTP code"
                onChangeText={setOtp}
                value={otp}
                keyboardType="numeric"
              />
            </View>

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
              isLoading={ResetPassword_Mutation.isPending}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({});
