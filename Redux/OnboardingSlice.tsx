import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnboarding: false,
  value: 0,
  userlogin: "LOGIN",
  localremember: null
};

export const OnboardingSlice = createSlice({
  name: "OnboardingSlice",
  initialState,
  reducers: {
    reset_isOnboarding: (state) => initialState,

    increment: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },

    checkOnboarding: (state) => {
      state.isOnboarding = !state.isOnboarding;
      // Toggle the value (true becomes false, false becomes true)
    },



    authScreenChange: (state, action) => {
      console.log({
        payload: action.payload
      });

      state.userlogin = action.payload; // or action.type, depending on what you need
      // console.log("this is userlogin", state.userlogin);

    },

    remeberUSerPassword: (state, action) => {
      state.localremember = action.payload; // or action.type, depending on what you need

    },

    changeauthscreen: (state, action) => {
      console.log({
        payload: action.payload
      });
      // state.localremember = action.payload; // or action.type, depending on what you need

    },


    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeauthscreen, remeberUSerPassword, reset_isOnboarding, checkOnboarding, authScreenChange } = OnboardingSlice.actions;
export default OnboardingSlice.reducer;
