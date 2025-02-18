// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";
import { handleApiError } from "../shareApi";
import { Alert } from "react-native";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";

const initialState = {
  get_all_poll_data: null,
  get_all_poll_isError: false,
  get_all_poll_isSuccess: false,
  get_all_poll_isLoading: false,
  get_all_poll_message: null,

  get_single_poll_data: null,
  get_single_poll_isError: false,
  get_single_poll_isSuccess: false,
  get_single_poll_isLoading: false,
  get_single_poll_message: null,
};

export const Get_All_Polls_Fun = createAsyncThunk(
  "PollSlice/Get_All_Polls_Fun",
  async (_, thunkAPI) => {
    try {
      let clan_id_admin =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.AdmincurrentClanMeeting;
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.currentClanMeeting?._id;

      console.log({
        ddf: clan_id_admin,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };

      let response;

      if (clan_id_admin) {
        response = await axios.get(`${API_BASEURL}poll`, config);
      } else {
        response = await axios.get(`${API_BASEURL}poll/user`, config);
      }

      return response.data;
    } catch (error) {
      console.log({
        error: error?.response,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const Get_Single_Polls_Fun = createAsyncThunk(
  "PollSlice/Get_Single_Polls_Fun",
  async (id, thunkAPI) => {
    try {
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.currentClanMeeting?._id;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };
      const response = await axios.get(`${API_BASEURL}poll/${id}`, config);

      return response.data;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const PollSlice = createSlice({
  name: "PollSlice",
  initialState,
  reducers: {
    reset_PollSlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Get_All_Polls_Fun.pending, (state) => {
        state.get_all_poll_isLoading = true;
      })
      .addCase(Get_All_Polls_Fun.fulfilled, (state, action) => {
        state.get_all_poll_isLoading = false;
        state.get_all_poll_isError = false;
        state.get_all_poll_message = null;
        state.get_all_poll_data = action.payload;
        state.get_all_poll_isSuccess = true;
      })
      .addCase(Get_All_Polls_Fun.rejected, (state, action) => {
        state.get_all_poll_isLoading = false;
        state.get_all_poll_isError = true;
        state.get_all_poll_message = action.payload;
        state.get_all_poll_data = null;
        state.get_all_poll_isSuccess = false;
      })
      .addCase(Get_Single_Polls_Fun.pending, (state) => {
        state.get_single_poll_isLoading = true;
      })
      .addCase(Get_Single_Polls_Fun.fulfilled, (state, action) => {
        state.get_single_poll_isLoading = false;
        state.get_single_poll_isError = false;
        state.get_single_poll_message = null;
        state.get_single_poll_data = action.payload;
        state.get_single_poll_isSuccess = true;
      })
      .addCase(Get_Single_Polls_Fun.rejected, (state, action) => {
        state.get_single_poll_isLoading = false;
        state.get_single_poll_isError = true;
        state.get_single_poll_message = action.payload;
        state.get_single_poll_data = null;
        state.get_single_poll_isSuccess = false;
      });
  },
});

export const { reset_PollSlice } = PollSlice.actions;

export default PollSlice.reducer;
