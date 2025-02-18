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
  get_all_user_guest_data: null,
  get_all_user_guest_isError: false,
  get_all_user_guest_isSuccess: false,
  get_all_user_guest_isLoading: false,
  get_all_user_guest_message: null,

  get_user_guest_detail_data: null,
  get_user_guest_detail_isError: false,
  get_user_guest_detail_isSuccess: false,
  get_user_guest_detail_isLoading: false,
  get_user_guest_detail_message: null,

  get_all_domestic_data: null,
  get_all_domestic_isError: false,
  get_all_domestic_isSuccess: false,
  get_all_domestic_isLoading: false,
  get_all_domestic_message: null,
};

export const Get_All_User_Guest_Fun = createAsyncThunk(
  "GuestSlice/Get_All_User_Guest_Fun",
  async (_, thunkAPI) => {
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

      const response = await axios.get(`${API_BASEURL}visitor/invites`, config);

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

export const Get_All_Domestic_Fun = createAsyncThunk(
  "GuestSlice/Get_All_Domestic_Fun",
  async (_, thunkAPI) => {
    console.log({
      fggg: "this is working ",
    });
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

      const response = await axios.get(`${API_BASEURL}domesticstaff`, config);
      console.log({
        fff: response.data,
      });

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

export const Get__User_Guest_detail_Fun = createAsyncThunk(
  "GuestSlice/Get__User_Guest_detail_Fun",
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

      const response = await axios.get(`${API_BASEURL}visitor/${id}`, config);

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

export const GuestSlice = createSlice({
  name: "GuestSlice",
  initialState,
  reducers: {
    // reset_ForumSlice: (state) => initialState,
    // reset__single_forum: () => {
    //   (state.get_my_clan_single_forum_data = null),
    //     (state.get_my_clan_single_forum_isError = false),
    //     (state.get_my_clan_single_forum_isSuccess = false),
    //     (state.get_my_clan_single_forum_isLoading = false),
    //     (state.get_my_clan_single_forum_message = null);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(Get_All_User_Guest_Fun.pending, (state) => {
      state.get_all_user_guest_isLoading = true;
    });
    builder.addCase(Get_All_User_Guest_Fun.fulfilled, (state, action) => {
      state.get_all_user_guest_isLoading = false;
      state.get_all_user_guest_isSuccess = true;
      state.get_all_user_guest_data = action.payload;
      state.get_all_user_guest_message = null;
      state.get_all_user_guest_isError = false;
    });
    builder.addCase(Get_All_User_Guest_Fun.rejected, (state, action) => {
      state.get_all_user_guest_isLoading = false;
      state.get_all_user_guest_isError = true;
      state.get_all_user_guest_message = action.payload;
      state.get_all_user_guest_data = null;
      state.get_all_user_guest_isSuccess = false;
    });

    builder.addCase(Get__User_Guest_detail_Fun.pending, (state) => {
      state.get_user_guest_detail_isLoading = true;
    });
    builder.addCase(Get__User_Guest_detail_Fun.fulfilled, (state, action) => {
      state.get_user_guest_detail_isLoading = false;
      state.get_user_guest_detail_isSuccess = true;
      state.get_user_guest_detail_data = action.payload;
      state.get_user_guest_detail_message = null;
      state.get_user_guest_detail_isError = false;
    });
    builder.addCase(Get__User_Guest_detail_Fun.rejected, (state, action) => {
      state.get_user_guest_detail_isLoading = false;
      state.get_user_guest_detail_isError = true;
      state.get_user_guest_detail_message = action.payload;
      state.get_user_guest_detail_data = null;
      state.get_user_guest_detail_isSuccess = false;
    });

    builder.addCase(Get_All_Domestic_Fun.pending, (state) => {
      state.get_all_domestic_isLoading = true;
    });
    builder.addCase(Get_All_Domestic_Fun.fulfilled, (state, action) => {
      state.get_all_domestic_isLoading = false;
      state.get_all_domestic_isSuccess = true;
      state.get_all_domestic_data = action.payload;
      state.get_all_domestic_message = null;
      state.get_all_domestic_isError = false;
    });
    builder.addCase(Get_All_Domestic_Fun.rejected, (state, action) => {
      state.get_all_domestic_isLoading = false;
      state.get_all_domestic_isError = true;
      state.get_all_domestic_message = action.payload;
      state.get_user_guest_detail_data = null;
      state.get_all_domestic_isSuccess = false;
    });
  },
});

export const {} = GuestSlice.actions;

export default GuestSlice.reducer;
