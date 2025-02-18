import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOnboarding: false,
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

    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reset_isOnboarding, checkOnboarding } = OnboardingSlice.actions;
export default OnboardingSlice.reducer;
