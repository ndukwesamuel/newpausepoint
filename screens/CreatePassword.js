import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import RegHeaders from "../components/shared/RegHeaders";
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

import axios from "axios";
import Toast from "react-native-toast-message";
import { authScreenChange } from "../Redux/OnboardingSlice";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

const CreatePassword = ({ navigation }) => {
  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const { otpemail } = useSelector((state) => state?.DontwantToResetSlice);
  console.log({
    otpemail,
  });

  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [privacypolicy, setPrivacypolicy] = useState(false);
  const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

  const [passwords, setPasswords] = useState({
    mainPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, text) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  const handleSubmit = () => {
    console.log("Current Password:", passwords.mainPassword);
    console.log("New Password:", passwords.confirmPassword);
    console.log({
      otp,
    });

    let data = {
      email: otpemail,
      otp: otp,
      passoword: passwords?.mainPassword,
    };

    CreatePassword_Mutation.mutate(data);
    // Add your password change logic here, e.g., sending it to a server
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const CreatePassword_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}reset-forgotten-password`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          // Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info);
    },
    {
      onSuccess: (success) => {
        console.log({
          aaa: success?.data,
        });
        Toast.show({
          type: "success",
          text1: `${success?.data?.message}`,
        });

        dispatch(authScreenChange("CREATEPASSWORD"));
      },

      onError: (error) => {
        console.log({
          aaa: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error} `,
        });
      },
    }
  );
  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <TouchableOpacity
            style={{ marginBottom: 30 }}
            onPress={() => dispatch(authScreenChange("LOGIN"))}
          >
            <AntDesign name="arrowleft" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <RegistraionHeadersText data="Create New Password " textStyle={{}} />

          <RegistraionParagraphText
            data="Please enter your new password, and ensure to keep it safe."
            color="#8E8E8F"
          />

          <RegistraionParagraphText data={otpemail} color="#8E8E8F" />

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="OTP " />
              <Forminput
                placeholder="Enter your email"
                onChangeText={setOtp}
                value={otp}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <FormLabel data="Password " />

              <Forminputpassword
                placeholder="Enter your password"
                onChangeText={(text) =>
                  handlePasswordChange("mainPassword", text)
                }
                value={passwords.mainPassword}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <FormLabel data="Confirm Password " />

              <Forminputpassword
                placeholder="Enter your password"
                onChangeText={(text) =>
                  handlePasswordChange("confirmPassword", text)
                }
                value={passwords.confirmPassword}
              />
            </View>
          </View>

          <View style={{ flex: 0.3 }}>
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
              data="Submit"
              onPress={handleSubmit}
              isLoading={CreatePassword_Mutation.isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  customInput: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f6f8fa",
    // opacity: 0.4
  },
});
