

import axios from "axios";
import { store } from "../Redux/store";
import { reset_login } from "../Redux/AuthSlice";
// import { resetAuth } from "../Redux/AuthSlicev2"; // ← ADD
import { reset_isOnboarding } from "../Redux/OnboardingSlice";
import { reset_ClanSlice } from "../Redux/UserSide/ClanSlice";
import { reset_ForumSlice } from "../Redux/UserSide/ForumSlice";
import { reset_UserProfileSlice } from "../Redux/UserSide/UserProfileSlice";
import Toast from "react-native-toast-message";
import { reset_ProfileSlice } from "../Redux/ProfileSlice";
import { resetAuth } from "../Redux/v2/AuthSlicev2";

let isLoggingOut = false;

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isLoggingOut) {
      const errorMessage = error.response?.data?.message;
      const errorStatus = error.response?.data?.status;

      if (errorMessage === "Token Expired" || errorStatus === "Unauthorized") {
        isLoggingOut = true;

        console.log("🔴 Token Expired - Auto logging out user...");

        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please login again",
          visibilityTime: 3000,
          position: "top",
        });

        store.dispatch(reset_login());
        store.dispatch(resetAuth()); // ← ADD — clears userDatav2, triggers navigation
        store.dispatch(reset_isOnboarding());
        store.dispatch(reset_ClanSlice());
        store.dispatch(reset_ForumSlice());
        store.dispatch(reset_UserProfileSlice());
        store.dispatch(reset_ProfileSlice());

        console.log("✅ User logged out successfully");

        setTimeout(() => {
          isLoggingOut = false;
          console.log("🔄 Logout flag reset - ready for new session");
        }, 2000);
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
