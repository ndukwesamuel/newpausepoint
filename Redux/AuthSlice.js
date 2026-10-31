import { createSlice } from "@reduxjs/toolkit";

// Legacy auth state. Sign-in now goes through Redux/v2/AuthSlicev2
// (signin-v2); this slice only keeps the push token and the reset actions
// that logout and the axios interceptor call.
const initialState = {
  user_data: null,
  user_isError: false,
  user_isSuccess: false,
  user_isLoading: false,
  user_message: null,
  pushtokendata: null,
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset_login: (state) => initialState,
    reset_other_login: (state) => {
      state.user_isError = false;
      state.user_isLoading = false;
      state.user_isSuccess = false;
      state.user_message = null;
    },
    pushtokendata: (state, action) => {
      state.pushtokendata = action.payload;
    },
  },
});

export const { reset_login, reset_other_login, pushtokendata } =
  AuthSlice.actions;

export default AuthSlice.reducer;
