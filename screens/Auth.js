import { View, Text, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import LoginScreen from "./LoginScreen";
import Registraion from "./Registraion";
import ForgottenPasswod from "./ForgottenPasswod";
import Toast from "react-native-toast-message";
import { reset_isOnboardings } from "../Redux/DontwantToResetSlice";
import { useDispatch, useSelector } from "react-redux";
import { reset_login } from "../Redux/AuthSlice";
import OTP from "./OTP";
import { authScreenChange } from "../Redux/OnboardingSlice";
import CreatePassword from "./CreatePassword";

const Auth = () => {
  const { userlogin } = useSelector((state) => state?.OnboardingSlice);
  const ss = useSelector((state) => state.DontwantToResetSlice);
  // console.log({ data });OnboardingSlice
  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    if (user_message === "Email Not Verified") {
      dispatch(authScreenChange("OTP"));
    }
    return () => {};
  }, [user_data, user_message]);

  return (
    <View style={{ flex: 1 }}>
      {/* <Button
                title="Show Toast"
                // onPress={() => Toast.show({
                //     type: 'success',
                //     text1: 'Hello World',
                //     text2: 'Toast message',

                // })}

                // style={{ backgroundColor: 'red' }}
                onPress={() => console.log("skdjskjd")}
                color="red"

            /> */}

      {/* <TouchableOpacity
                style={{ backgroundColor: 'red', marginTop: 100 }}
                // onPress={() => console.log("skdjskjd")}

                onPress={() => Toast.show({
                    type: 'success',
                    text1: 'best',
                    text2: 'Toast message',

                })}
            >
                <Text>sam</Text>

            </TouchableOpacity> */}

      {userlogin === "LOGIN" && <LoginScreen />}
      {userlogin === "OTP" && <OTP />}

      {userlogin === "REGISTER" && <Registraion />}

      {userlogin === "FORGOTTENPASSWOD" && <ForgottenPasswod />}
      {userlogin === "CREATEPASSWORD" && <CreatePassword />}
    </View>
  );
};

export default Auth;
