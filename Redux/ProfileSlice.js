// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";
import { handleApiError } from "./shareApi";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";

const initialState = {
  userProfile_data: null,
  userProfile_isError: false,
  userProfile_isSuccess: false,
  userProfile_isLoading: false,
  userProfile_message: null,
};

export const UserProfile_data_Fun = createAsyncThunk(
  "userEventSlice/UserProfile_data_Fun",
  async (_, thunkAPI) => {
    try {
      let token = thunkAPI.getState().AuthSlice.user_data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(`${API_BASEURL}profile`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const ProfileSlice = createSlice({
  name: "ProfileSlice",
  initialState,
  reducers: {
    reset_ProfileSlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(UserProfile_data_Fun.pending, (state) => {
        state.userProfile_isLoading = true;
      })
      .addCase(UserProfile_data_Fun.fulfilled, (state, action) => {
        state.userProfile_isLoading = false;
        state.userProfile_isSuccess = true;
        state.userProfile_isError = false;
        state.userProfile_message = null;
        state.userProfile_data = action.payload;
      })
      .addCase(UserProfile_data_Fun.rejected, (state, action) => {
        state.userProfile_isLoading = false;
        state.userProfile_isError = true;
        state.userProfile_message = action.payload;
        state.userProfile_data = null;
        state.userProfile_isSuccess = false;
      });
  },
});

export const { reset_ProfileSlice } = ProfileSlice.actions;

export default ProfileSlice.reducer;
