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
  get_my_clan_forum_data: null,
  get_my_clan_forum_isError: false,
  get_my_clan_forum_isSuccess: false,
  get_my_clan_forum_isLoading: false,
  get_my_clan_forum_message: null,

  get_my_clan_single_forum_data: null,
  get_my_clan_single_forum_isError: false,
  get_my_clan_single_forum_isSuccess: false,
  get_my_clan_single_forum_isLoading: false,
  get_my_clan_single_forum_message: null,
};

export const Get_My_Clan_Single_Forum_Fun = createAsyncThunk(
  "ForumSlice/Get_My_Clan_Single_Forum_Fun",
  async (data_id, thunkAPI) => {
    try {
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.currentClanMeeting?._id;

      let url = `${API_BASEURL}forum/user/${data_id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };

      const response = await axios.get(url, config);

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

export const Get_My_Clan_Forum_Fun = createAsyncThunk(
  "ForumSlice/Get_My_Clan_Forum_Fun",
  async (data, thunkAPI) => {
    try {
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.currentClanMeeting?._id;

      if (clan_id) {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token_Data}`,
          },
        };

        const response = await axios.get(`${API_BASEURL}forum`, config);
        // console.log({
        //   hghg: response?.data,
        // });
        return response.data;
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const ForumSlice = createSlice({
  name: "ForumSlice",
  initialState,
  reducers: {
    reset_ForumSlice: (state) => initialState,
    reset__single_forum: () => {
      (state.get_my_clan_single_forum_data = null),
        (state.get_my_clan_single_forum_isError = false),
        (state.get_my_clan_single_forum_isSuccess = false),
        (state.get_my_clan_single_forum_isLoading = false),
        (state.get_my_clan_single_forum_message = null);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(Get_My_Clan_Forum_Fun.pending, (state) => {
      state.get_my_clan_forum_isLoading = true;
    });
    builder.addCase(Get_My_Clan_Forum_Fun.fulfilled, (state, action) => {
      state.get_my_clan_forum_isLoading = false;
      state.get_my_clan_forum_isSuccess = true;
      state.get_my_clan_forum_data = action.payload;
      state.get_my_clan_forum_message = null;
      state.get_my_clan_forum_isError = false;
    });
    builder.addCase(Get_My_Clan_Forum_Fun.rejected, (state, action) => {
      state.get_my_clan_forum_isLoading = false;
      state.get_my_clan_forum_isError = true;
      state.get_my_clan_forum_message = action.payload;
      state.get_my_clan_forum_data = null;
      state.get_my_clan_forum_isSuccess = false;
    });

    builder.addCase(Get_My_Clan_Single_Forum_Fun.pending, (state) => {
      state.get_my_clan_single_forum_isLoading = true;
    });
    builder.addCase(Get_My_Clan_Single_Forum_Fun.fulfilled, (state, action) => {
      state.get_my_clan_single_forum_isLoading = false;
      state.get_my_clan_single_forum_isSuccess = true;
      state.get_my_clan_single_forum_data = action.payload;
      state.get_my_clan_single_forum_message = null;
      state.get_my_clan_single_forum_isError = false;
    });
    builder.addCase(Get_My_Clan_Single_Forum_Fun.rejected, (state, action) => {
      state.get_my_clan_single_forum_isLoading = false;
      state.get_my_clan_single_forum_isError = true;
      state.get_my_clan_single_forum_message = action.payload;
      state.get_my_clan_single_forum_data = null;
      state.get_my_clan_single_forum_isSuccess = false;
    });
  },
});

export const { reset_ForumSlice, reset__single_forum } = ForumSlice.actions;

export default ForumSlice.reducer;
