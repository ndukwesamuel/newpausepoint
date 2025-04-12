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
import React, { useEffect, useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import RegHeaders from "../components/shared/RegHeaders";
import axios from "axios";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import {
  AAchangeauthscreen,
  authscreensatet,
  remeberUSerPassword,
  setOtpEmail,
} from "../Redux/DontwantToResetSlice";
import { useDispatch, useSelector } from "react-redux";
import { Login_Fun, reset_other_login } from "../Redux/AuthSlice";
import { authScreenChange, changeauthscreen } from "../Redux/OnboardingSlice";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = ({}) => {
  const { localremember } = useSelector((state) => state?.DontwantToResetSlice);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState(localremember?.email || "");

  const [remember, setRemember] = useState(false);

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

  const handleInputChange = (text) => {
    setInputValue(text);
  };

  const handleLogin = async () => {
    // const value = await AsyncStorage.getItem("PushToken");
    const value = await AsyncStorage.getItem("PushToken");
    let mobile = true;
    let data = {
      email: email,
      password: passwords.mainPassword,
      tokenNotification: value,
      mobile,
    };

    if (remember) {
      dispatch(
        remeberUSerPassword({
          remember,
          email: email,
          password: passwords.mainPassword,
        })
      );
    }

    dispatch(setOtpEmail(email));

    dispatch(Login_Fun(data));
    // fetchData();
  };

  useEffect(() => {
    return () => {
      dispatch(reset_other_login());
    };
  }, []);

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 20,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <RegistraionHeadersText data="Welcome back" textStyle={{}} />

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
            <RegistraionParagraphText
              data="Don’t have an account? "
              color="#8E8E8F"
            />

            <TouchableOpacity
              onPress={() => dispatch(authScreenChange("REGISTER"))}
            >
              <RegistraionParagraphText data="Sign Up" color="#04973C" />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Email " />
            <Forminput
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
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

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <Ionicons
                name={`${
                  remember
                    ? "checkmark-circle-sharp"
                    : "checkmark-circle-outline"
                }`}
                size={24}
                color={`${remember ? "green" : "gray"}`}
              />

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  fontFamily: "RobotoSlab-Regular",
                }}
              >
                Remember me
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRemember(!remember)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => dispatch(authScreenChange("FORGOTTENPASSWOD"))}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "RobotoSlab-Regular",
                  }}
                >
                  Forgot password ?
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

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
            data="Sign in"
            onPress={handleLogin}
            isLoading={user_isLoading}
          />

          <View
            style={{ height: 20, alignItems: "center", marginVertical: 15 }}
          >
            <Image
              source={require("../assets/images/or.png")}
              style={{ width: "80%", flex: 1 }}
            />
          </View>

          <Formbutton
            buttonStyle={{
              borderWidth: 1,
              borderColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
            textStyle={{
              color: "#454343",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Sign Up"
            onPress={() => dispatch(authScreenChange("REGISTER"))}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
