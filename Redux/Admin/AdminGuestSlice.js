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
  Admin_get_all_user_guest_data: null,
  Admin_get_all_user_guest_isError: false,
  Admin_get_all_user_guest_isSuccess: false,
  Admin_get_all_user_guest_isLoading: false,
  Admin_get_all_user_guest_message: null,

  get_user_guest_detail_data: null,
  get_user_guest_detail_isError: false,
  get_user_guest_detail_isSuccess: false,
  get_user_guest_detail_isLoading: false,
  get_user_guest_detail_message: null,

  Admin_get_all_domestic_staff_data: null,

  Admin_get_all_domestic_staff_isError: false,
  Admin_get_all_domestic_staff_isSuccess: false,
  Admin_get_all_domestic_staff_isLoading: false,
  Admin_get_all_domestic_staff_message: null,
};

export const Admin_Get_All_User_Guest_Fun = createAsyncThunk(
  "AdminGuestSlice/Admin_Get_All_User_Guest_Fun",
  async (_, thunkAPI) => {
    try {
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.AdmincurrentClanMeeting;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}visitor/invites/${clan_id}`,
        config
      );

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

export const Admin_Get_All_DomesticStaff_Fun = createAsyncThunk(
  "AdminGuestSlice/Admin_Get_All_DomesticStaff_Fun",
  async (_, thunkAPI) => {
    try {
      let token_Data = thunkAPI.getState()?.AuthSlice.user_data?.token;
      let clan_id =
        thunkAPI.getState()?.UserProfileSlice?.get_user_profile_data
          ?.AdmincurrentClanMeeting;
      console.log({
        fff: token_Data,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token_Data}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}domesticstaff/admin`,
        config
      );

      console.log({
        fff: response.data,
      });

      return response.data;
    } catch (error) {
      console.log({
        ggg: error?.response.data,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.error} `,
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

export const AdminGuestSlice = createSlice({
  name: "AdminGuestSlice",
  initialState,
  reducers: {
    reset_ForumSlice: (state) => initialState,
    // reset__single_forum: () => {
    //   (state.get_my_clan_single_forum_data = null),
    //     (state.get_my_clan_single_forum_isError = false),
    //     (state.get_my_clan_single_forum_isSuccess = false),
    //     (state.get_my_clan_single_forum_isLoading = false),
    //     (state.get_my_clan_single_forum_message = null);
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(Admin_Get_All_User_Guest_Fun.pending, (state) => {
      state.Admin_get_all_user_guest_isLoading = true;
    });
    builder.addCase(Admin_Get_All_User_Guest_Fun.fulfilled, (state, action) => {
      state.Admin_get_all_user_guest_isLoading = false;
      state.Admin_get_all_user_guest_isSuccess = true;
      state.Admin_get_all_user_guest_data = action.payload;
      state.Admin_get_all_user_guest_message = null;
      state.Admin_get_all_user_guest_isError = false;
    });
    builder.addCase(Admin_Get_All_User_Guest_Fun.rejected, (state, action) => {
      state.Admin_get_all_user_guest_isLoading = false;
      state.Admin_get_all_user_guest_isError = true;
      state.Admin_get_all_user_guest_message = action.payload;
      state.Admin_get_all_user_guest_data = null;
      state.Admin_get_all_user_guest_isSuccess = false;
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

    builder.addCase(Admin_Get_All_DomesticStaff_Fun.pending, (state) => {
      state.Admin_get_all_domestic_staff_isLoading = true;
    });
    builder.addCase(
      Admin_Get_All_DomesticStaff_Fun.fulfilled,
      (state, action) => {
        state.Admin_get_all_domestic_staff_isLoading = false;
        state.Admin_get_all_domestic_staff_isSuccess = true;
        state.Admin_get_all_domestic_staff_data = action.payload;
        state.Admin_get_all_domestic_staff_message = null;
        state.Admin_get_all_domestic_staff_isError = false;
      }
    );
    builder.addCase(
      Admin_Get_All_DomesticStaff_Fun.rejected,
      (state, action) => {
        state.Admin_get_all_domestic_staff_isLoading = false;
        state.Admin_get_all_domestic_staff_isError = true;
        state.Admin_get_all_domestic_staff_message = action.payload;
        state.Admin_get_all_domestic_staff_data = null;
        state.Admin_get_all_domestic_staff_isSuccess = false;
      }
    );
  },
});

export const {} = AdminGuestSlice.actions;

export default AdminGuestSlice.reducer;
