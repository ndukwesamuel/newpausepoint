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
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Toast from "react-native-toast-message";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { useNavigation } from "@react-navigation/native";
import { authScreenChange } from "../Redux/OnboardingSlice";
import { setOtpEmail } from "../Redux/DontwantToResetSlice";

const ForgottenPasswod = ({}) => {
  const navigation = useNavigation();

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const [remember, setRemember] = useState(false);

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
    // Add your password change logic here, e.g., sending it to a server
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const Forget_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}forgot-password`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
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
          aaa: error?.response,
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
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <View style={{ flex: 1 }}>
            {/* <TouchableOpacity style={{ marginBottom: 30 }}
                            onPress={() => navigation.goBack()}> */}

            <TouchableOpacity
              style={{ marginBottom: 30 }}
              onPress={() => dispatch(authScreenChange("LOGIN"))}
            >
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>

            <RegistraionHeadersText data="Forgotten Passwod  " textStyle={{}} />

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
              <RegistraionParagraphText
                data="Please enter your email address below, we’ll send you a verification code."
                color="#8E8E8F"
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Email " />
              <Forminput
                placeholder="Enter your email"
                onChangeText={setEmail}
                value={email}
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
              onPress={() => {
                dispatch(setOtpEmail(email));

                Forget_Mutation.mutate({ email });
              }}
              isLoading={Forget_Mutation.isLoading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default ForgottenPasswod;

const styles = StyleSheet.create({});
