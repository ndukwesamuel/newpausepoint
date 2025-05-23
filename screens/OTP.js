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
import React, { useEffect, useRef, useState } from "react";

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
  Otpinput,
} from "../components/shared/InputForm";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { reset_login } from "../Redux/AuthSlice";
import { authScreenChange, reset_isOnboarding } from "../Redux/OnboardingSlice";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const OTP = ({}) => {
  const [otpValue, setOTPValue] = useState("");
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { otpemail } = useSelector((state) => state.DontwantToResetSlice);
  console.log({
    eer: otpemail,
  });

  const handleLogout = async () => {
    dispatch(reset_login());
    // dispatch(reset_isOnboarding());

    // await AsyncStorage.removeItem("token");
    // await AsyncStorage.removeItem("userdata");log
    console.log("this is to logout");
  };

  const handleOTPChange = (otp) => {
    setOTPValue(otp);
  };

  console.log({ otpValue });

  const ResendOtp_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}send-otp`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          //   Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "OTP Sent successfully ",
        });
        // dispatch(Get_My_Clan_Forum_Fun());
        // setTurnmodal(false);
      },

      onError: (error) => {
        console.log({
          ff: error?.response,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  const SubmitOtp_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}verify-otp`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          //   Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "OTP Verified successfully ",
        });
        dispatch(authScreenChange("LOGIN"));

        // setTurnmodal(false);
      },

      onError: (error) => {
        console.log({
          ff: error?.response,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
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
            <TouchableOpacity
              style={{ marginBottom: 30 }}
              onPress={() => {
                dispatch(reset_login());
                dispatch(reset_isOnboarding());
                // dispatch(authScreenChange("LOGIN"));

                // navigation.goBack();
              }}
            >
              <AntDesign name="arrowleft" size={28} color="black" />
            </TouchableOpacity>

            <RegistraionHeadersText
              data="OTP Code Verification"
              textStyle={{}}
            />

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
              <RegistraionParagraphText
                data={`We have sent an OTP code to your email address  ${otpemail}. Enter the OTP code below to verify.`}
                color="#8E8E8F"
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <Otpinput
                onOTPChange={handleOTPChange}
                containerView={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
                inputStyle={{
                  width: 70,
                  height: 58,
                  textAlign: "center",
                  borderWidth: 1,

                  padding: 10,
                  borderRadius: 5,
                  fontSize: 16,
                  backgroundColor: "#F6F8FAE5",
                }}
              />
            </View>

            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "400",
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                {" "}
                Didn’t receive email?
              </Text>
              {/* <Text>You can resend code in 49 secs</Text> */}
            </View>

            {otpValue.length === 4 && (
              <Formbutton
                buttonStyle={{
                  backgroundColor: "white",
                  paddingVertical: 14,
                  alignItems: "center",
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#04973C",
                  marginBottom: 40,
                }}
                textStyle={{
                  color: "black",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
                data="Submit"
                isLoading_color="#04973C"
                isLoading={SubmitOtp_Mutation.isLoading}
                onPress={() => {
                  SubmitOtp_Mutation.mutate({
                    email: otpemail,
                    otp: otpValue,
                  });
                  //   navigation.navigate("CreatePassword");
                  //   console.log({
                  //     email: otpemail,
                  //     otpValue,
                  //   });
                  // ResendOtp_Mutation.
                  // Handle the button press here
                  console.log("Button pressed");
                  // You can call your custom function or navigate to another screen, etc.
                }}
              />
            )}

            <Formbutton
              buttonStyle={{
                backgroundColor: "white",
                paddingVertical: 14,
                alignItems: "center",
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#04973C",
              }}
              textStyle={{
                color: "black",
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
              }}
              data="Resend Code"
              isLoading={ResendOtp_Mutation.isLoading}
              isLoading_color="#04973C"
              onPress={() => {
                ResendOtp_Mutation.mutate({
                  email: otpemail,
                });
                // navigation.navigate("CreatePassword");
                // console.log({
                //   email: otpemail,
                //   otpValue,
                // });
                // ResendOtp_Mutation.
                // Handle the button press here
                // console.log("Button pressed");
                // You can call your custom function or navigate to another screen, etc.
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default OTP;

const styles = StyleSheet.create({});
