// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";
import { handleApiError } from "../shareApi";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";

const initialState = {
  get_user_profile_data: null,
  get_user_profile_isError: false,
  get_user_profile_isSuccess: false,
  get_user_profile_isLoading: false,
  get_user_profile_message: null,

  get_all_user_data: null,
  get_all_user_isError: false,
  get_all_user_isSuccess: false,
  get_all_user_isLoading: false,
  get_all_user_message: null,
};

export const Get_User_Profle_Fun = createAsyncThunk(
  "UserProfileSlice/Get_User_Profle_Fun",
  async (_, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
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

export const Profle_Fun = createAsyncThunk(
  "UserProfileSlice/Profle_Fun",
  async (_, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          // Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(`https://102.89.43.151:5050`);
      console.log({
        uuuu: response,
      });

      return response.data;
    } catch (error) {
      console.log({
        eee: error,
      });
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_All_User_Profle_Fun = createAsyncThunk(
  "UserProfileSlice/Get_All_User_Profle_Fun",
  async (_, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}clan/usergetMember`,
        config
      );

      console.log({
        kff: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const UserProfileSlice = createSlice({
  name: "UserProfileSlice",
  initialState,
  reducers: {
    reset_UserProfileSlice: (state) => initialState,

    reste_Get_Singel_Public__events_Fun: (state) => {
      state.single_public_event_isLoading = false;
      state.single_public_event_isError = false;
      state.single_public_event_message = null;
      state.single_public_event = null;
      state.single_public_event_isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(Get_User_Profle_Fun.pending, (state) => {
        state.get_user_profile_isLoading = true;
      })
      .addCase(Get_User_Profle_Fun.fulfilled, (state, action) => {
        state.get_user_profile_isLoading = false;
        state.get_user_profile_isError = false;
        state.get_user_profile_message = null;
        state.get_user_profile_data = action.payload;
        state.get_user_profile_isSuccess = true;
      })
      .addCase(Get_User_Profle_Fun.rejected, (state, action) => {
        state.get_user_profile_isLoading = false;
        state.get_user_profile_isError = true;
        state.get_user_profile_message = action.payload;
        state.get_user_profile_data = null;
        state.get_user_profile_isSuccess = false;
      })
      .addCase(Get_All_User_Profle_Fun.pending, (state) => {
        state.get_all_user_isLoading = true;
      })
      .addCase(Get_All_User_Profle_Fun.fulfilled, (state, action) => {
        state.get_all_user_isLoading = false;
        state.get_all_user_isError = false;
        state.get_all_user_message = null;
        state.get_all_user_data = action.payload;
        state.get_all_user_isSuccess = true;
      })
      .addCase(Get_All_User_Profle_Fun.rejected, (state, action) => {
        state.get_all_user_isLoading = false;
        state.get_all_user_isError = true;
        state.get_all_user_message = action.payload;
        state.get_all_user_data = null;
        state.get_all_user_isSuccess = false;
      });
  },
});

export const { reset_UserProfileSlice } = UserProfileSlice.actions;

export default UserProfileSlice.reducer;
