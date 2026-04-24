// import axios from "axios";
// import { store } from "../Redux/store";
// import { reset_login } from "../Redux/AuthSlice";
// import { reset_isOnboarding } from "../Redux/OnboardingSlice";
// import { reset_Admin_Get_All_User } from "../Redux/Admin/UserSlice";
// import { reset_ClanSlice } from "../Redux/UserSide/ClanSlice";
// import { reset_EventSlice } from "../Redux/UserSide/EventSlice";
// import { reset_ForumSlice } from "../Redux/UserSide/ForumSlice";
// import { reset_UserProfileSlice } from "../Redux/UserSide/UserProfileSlice";

// import Toast from "react-native-toast-message";
// import { reset_ProfileSlice } from "../Redux/ProfileSlice";

// // Flag to prevent multiple logout attempts
// let isLoggingOut = false;

// // Setup response interceptor
// axios.interceptors.response.use(
//   // ✅ Success handler - just return the response
//   (response) => {
//     return response;
//   },

//   // ❌ Error handler - check for token expiration
//   (error) => {
//     // Check if it's a 401 error and we're not already logging out
//     if (error.response?.status === 401 && !isLoggingOut) {
//       const errorMessage = error.response?.data?.message;
//       const errorStatus = error.response?.data?.status;

//       // Check if it's specifically a token expiration error
//       if (errorMessage === "Token Expired" || errorStatus === "Unauthorized") {
//         // Set flag to prevent duplicate logout attempts
//         isLoggingOut = true;

//         console.log("🔴 Token Expired - Auto logging out user...");

//         // Show user-friendly toast notification
//         Toast.show({
//           type: "error",
//           text1: "Session Expired",
//           text2: "Please login again",
//           visibilityTime: 3000,
//           position: "top",
//         });

//         // Dispatch all reset actions to clear app state
//         store.dispatch(reset_login());
//         store.dispatch(reset_isOnboarding());
//         store.dispatch(reset_Admin_Get_All_User());
//         store.dispatch(reset_ClanSlice());
//         store.dispatch(reset_EventSlice());
//         store.dispatch(reset_ForumSlice());
//         store.dispatch(reset_UserProfileSlice());
//         store.dispatch(reset_ProfileSlice());

//         console.log("✅ User logged out successfully");

//         // Reset the flag after 2 seconds
//         setTimeout(() => {
//           isLoggingOut = false;
//           console.log("🔄 Logout flag reset - ready for new session");
//         }, 2000);
//       }
//     }

//     // Always reject the promise so the error can be handled by components if needed
//     return Promise.reject(error);
//   },
// );

// // Export axios so it can be used elsewhere if needed
// export default axios;

import axios from "axios";
import { store } from "../Redux/store";
import { reset_login } from "../Redux/AuthSlice";
// import { resetAuth } from "../Redux/AuthSlicev2"; // ← ADD
import { reset_isOnboarding } from "../Redux/OnboardingSlice";
import { reset_Admin_Get_All_User } from "../Redux/Admin/UserSlice";
import { reset_ClanSlice } from "../Redux/UserSide/ClanSlice";
import { reset_EventSlice } from "../Redux/UserSide/EventSlice";
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
        store.dispatch(reset_Admin_Get_All_User());
        store.dispatch(reset_ClanSlice());
        store.dispatch(reset_EventSlice());
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
