// import { View, Text, Button, TouchableOpacity } from "react-native";
// import React, { useEffect, useState } from "react";
// import LoginScreen from "./LoginScreen";
// import Registraion from "./Registraion";
// import ForgottenPasswod from "./ForgottenPasswod";
// import Toast from "react-native-toast-message";
// import { reset_isOnboardings } from "../Redux/DontwantToResetSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { reset_login } from "../Redux/AuthSlice";
// import OTP from "./OTP";
// import { authScreenChange } from "../Redux/OnboardingSlice";
// import CreatePassword from "./CreatePassword";

// const Auth = () => {
//   const { userlogin } = useSelector((state) => state?.OnboardingSlice);
//   const ss = useSelector((state) => state.DontwantToResetSlice);
//   // console.log({ data });OnboardingSlice
//   const dispatch = useDispatch();
//   const {
//     user_data,
//     user_isError,
//     user_isSuccess,
//     user_isLoading,
//     user_message,
//   } = useSelector((state) => state.AuthSlice);

//   useEffect(() => {
//     if (user_message === "Email Not Verified") {
//       dispatch(authScreenChange("OTP"));
//     }
//     return () => {};
//   }, [user_data, user_message]);

//   return (
//     <View style={{ flex: 1 }}>
//       {userlogin === "LOGIN" && <LoginScreen />}
//       {userlogin === "OTP" && <OTP />}

//       {userlogin === "REGISTER" && <Registraion />}

//       {userlogin === "FORGOTTENPASSWOD" && <ForgottenPasswod />}
//       {userlogin === "CREATEPASSWORD" && <CreatePassword />}
//     </View>
//   );
// };

// export default Auth;

// Auth.js
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native"; // Import StyleSheet
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
  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    // This effect ensures OTP screen is shown if login failed due to unverified email.
    // Ensure user_message is cleared/reset appropriately after handling.
    if (user_message === "Email Not Verified") {
      dispatch(authScreenChange("OTP"));
      // Consider dispatching an action here to clear user_message in AuthSlice
      // to prevent this effect from re-firing unnecessarily if user_data changes.
    }
  }, [user_data, user_message, dispatch]); // Added dispatch to dependencies

  return (
    <View style={styles.container}>
      {/* Login Screen */}
      <View
        style={[
          styles.screenOverlay,
          userlogin === "LOGIN" && styles.visibleScreen,
        ]}
      >
        <LoginScreen />
      </View>

      {/* OTP Screen */}
      <View
        style={[
          styles.screenOverlay,
          userlogin === "OTP" && styles.visibleScreen,
        ]}
      >
        <OTP />
      </View>

      {/* Registration Screen */}
      <View
        style={[
          styles.screenOverlay,
          userlogin === "REGISTER" && styles.visibleScreen,
        ]}
      >
        <Registraion />
      </View>

      {/* Forgot Password Screen */}
      <View
        style={[
          styles.screenOverlay,
          userlogin === "FORGOTTENPASSWOD" && styles.visibleScreen,
        ]}
      >
        <ForgottenPasswod />
      </View>

      {/* Create Password Screen */}
      <View
        style={[
          styles.screenOverlay,
          userlogin === "CREATEPASSWORD" && styles.visibleScreen,
        ]}
      >
        <CreatePassword />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject, // Covers the entire parent
    opacity: 0, // Hidden by default
    zIndex: 0, // Behind other elements
    // Add any necessary styling for child screens that need to stretch
    // width: '100%',
    // height: '100%',
  },
  visibleScreen: {
    opacity: 1, // Visible when active
    zIndex: 1, // Brought to front when active
  },
});

export default Auth;
