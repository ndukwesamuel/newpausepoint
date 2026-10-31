// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_CONFIG } from "../../api";
const API_BASEURL = API_CONFIG?.BASE_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";
import { handleApiError } from "../shareApi";
import { Alert } from "react-native";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";

const initialState = {
  Admin_get_my_clan_Announcement_data: null,
  Admin_get_my_clan_Announcement_isError: false,
  Admin_get_my_clan_Announcement_isSuccess: false,
  Admin_get_my_clan_Announcement_isLoading: false,
  Admin_get_my_clan_Announcement_message: null,
};

export const Admin_Get_My_Clan_Announcement_Fun = createAsyncThunk(
  "AdminForumSlice/Admin_Get_My_Clan_Announcement_Fun",
  async (data, thunkAPI) => {
    try {
      // V2 resolves the estate from the admin's profile.
      let token_Data =
        thunkAPI.getState()?.authSlice?.userDatav2?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}api/v1/forum/announcements`,
        config
      );

      // Screens read { forums }; V2 returns { data: [...] }.
      return { forums: response.data?.data || [] };
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const AdminForumSlice = createSlice({
  name: "AdminForumSlice",
  initialState,
  reducers: {
    reset_AdminForumSlice: (state) => initialState,
    // reset__AdminForumSlice: () => {
    //   (state.get_my_clan_single_forum_data = null),
    //     (state.get_my_clan_single_forum_isError = false),
    //     (state.get_my_clan_single_forum_isSuccess = false),
    //     (state.get_my_clan_single_forum_isLoading = false),
    //     (state.get_my_clan_single_forum_message = null);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(Admin_Get_My_Clan_Announcement_Fun.pending, (state) => {
      state.Admin_get_my_clan_Announcement_isLoading = true;
    });
    builder.addCase(
      Admin_Get_My_Clan_Announcement_Fun.fulfilled,
      (state, action) => {
        state.Admin_get_my_clan_Announcement_isLoading = false;
        state.Admin_get_my_clan_Announcement_isSuccess = true;
        state.Admin_get_my_clan_Announcement_data = action.payload;
        state.Admin_get_my_clan_Announcement_message = null;
        state.Admin_get_my_clan_Announcement_isError = false;
      }
    );
    builder.addCase(
      Admin_Get_My_Clan_Announcement_Fun.rejected,
      (state, action) => {
        state.Admin_get_my_clan_Announcement_isLoading = false;
        state.Admin_get_my_clan_Announcement_isError = true;
        state.Admin_get_my_clan_Announcement_message = action.payload;
        state.Admin_get_my_clan_Announcement_data = null;
        state.Admin_get_my_clan_Announcement_isSuccess = false;
      }
    );
  },
});

export const { reset_ForumSlice, reset__single_forum } =
  AdminForumSlice.actions;

export default AdminForumSlice.reducer;
