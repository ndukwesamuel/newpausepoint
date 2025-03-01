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
  get_all_clan_data: null,
  get_all_clan_isError: false,
  get_all_clan_isSuccess: false,
  get_all_clan_isLoading: false,
  get_all_clan_message: null,

  get_user_clan_data: null,
  get_user_clan_isError: false,
  get_user_clan_isSuccess: false,
  get_user_clan_isLoading: false,
  get_user_clan_message: null,

  get_all_clan_adminIN_data: null,
  get_all_clan_adminIN_isError: false,
  get_all_clan_adminIN_isSuccess: false,
  get_all_clan_adminIN_isLoading: false,
  get_all_clan_adminIN_message: null,

  get_Single_clan_data: null,
  get_Single_clan_isError: false,
  get_Single_clan_isSuccess: false,
  get_Single_clan_isLoading: false,
  get_Single_clan_message: null,

  admin_get_all_clan_memeber_data: null,
  admin_get_all_clan_memeber_isError: false,
  admin_get_all_clan_memeber_isSuccess: false,
  admin_get_all_clan_memeber_isLoading: false,
  admin_get_all_clan_memeber_message: null,

  admin_get_single_clan_memeber_data: null,
  admin_get_single_clan_memeber_isError: false,
  admin_get_single_clan_memeber_isSuccess: false,
  admin_get_single_clan_memeber_isLoading: false,
  admin_get_single_clan_memeber_message: null,
};

export const Admin_Get_All_Clan_Memeber_Fun = createAsyncThunk(
  "ClanSlice/Admin_Get_All_Clan_Memeber_Fun",
  async (data, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(`${API_BASEURL}clan/getMember`, config);

      return response.data;
    } catch (error) {
      console.log({
        opo: error?.response?.data,
      });

      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Admin_Get_Single_Clan_Memeber_Fun = createAsyncThunk(
  "ClanSlice/Admin_Get_Single_Clan_Memeber_Fun",
  async (id, thunkAPI) => {
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
        `${API_BASEURL}clan/getMember/${id}`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);
export const Get_ALl_Clan_Fun = createAsyncThunk(
  "ClanSlice/Get_ALl_Clan_Fun",
  async (data, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(`${API_BASEURL}clan`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_User_Clans_Fun = createAsyncThunk(
  "ClanSlice/Get_User_Clans_Fun",
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
        `${API_BASEURL}clan/getuserclans`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_all_clan_User_Is_adminIN_Fun = createAsyncThunk(
  "ClanSlice/Get_all_clan_User_Is_adminIN_Fun",
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
        `${API_BASEURL}clan/Admingetuserclans`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_Single_clan = createAsyncThunk(
  "ClanSlice/Get_Single_clan",
  async (id, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(`${API_BASEURL}clan/${id}`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const ClanSlice = createSlice({
  name: "ClanSlice",
  initialState,
  reducers: {
    reset_ClanSlice: (state) => initialState,

    // reste_Get_Singel_Public__events_Fun: (state) => {
    //   state.single_public_event_isLoading = false;
    //   state.single_public_event_isError = false;
    //   state.single_public_event_message = null;
    //   state.single_public_event = null;
    //   state.single_public_event_isSuccess = false;
    // },
  },
  extraReducers: (builder) => {
    builder

      .addCase(Get_ALl_Clan_Fun.pending, (state) => {
        state.get_all_clan_isLoading = true;
      })
      .addCase(Get_ALl_Clan_Fun.fulfilled, (state, action) => {
        state.get_all_clan_isLoading = false;
        state.get_all_clan_isSuccess = true;
        state.get_all_clan_isError = false;
        state.get_all_clan_message = null;
        state.get_all_clan_data = action.payload;
      })
      .addCase(Get_ALl_Clan_Fun.rejected, (state, action) => {
        state.get_all_clan_isLoading = false;
        state.get_all_clan_isError = true;
        state.get_all_clan_message = action.payload;
        state.get_all_clan_data = null;
        state.get_all_clan_isSuccess = false;
      })
      .addCase(Get_User_Clans_Fun.pending, (state) => {
        state.get_user_clan_isLoading = true;
      })
      .addCase(Get_User_Clans_Fun.fulfilled, (state, action) => {
        state.get_user_clan_isLoading = false;
        state.get_user_clan_isSuccess = true;
        state.get_user_clan_isError = false;
        state.get_user_clan_message = null;
        state.get_user_clan_data = action.payload;
      })
      .addCase(Get_User_Clans_Fun.rejected, (state, action) => {
        state.get_user_clan_isLoading = false;
        state.get_user_clan_isError = true;
        state.get_user_clan_message = action.payload;
        state.get_user_clan_data = null;
        state.get_user_clan_isSuccess = false;
      })
      .addCase(Get_all_clan_User_Is_adminIN_Fun.pending, (state) => {
        state.get_all_clan_adminIN_isLoading = true;
      })
      .addCase(Get_all_clan_User_Is_adminIN_Fun.fulfilled, (state, action) => {
        state.get_all_clan_adminIN_isLoading = false;
        state.get_all_clan_adminIN_isSuccess = true;
        state.get_all_clan_adminIN_isError = false;
        state.get_all_clan_adminIN_message = null;
        state.get_all_clan_adminIN_data = action.payload;
      })
      .addCase(Get_all_clan_User_Is_adminIN_Fun.rejected, (state, action) => {
        state.get_all_clan_adminIN_isLoading = false;
        state.get_all_clan_adminIN_isError = true;
        state.get_all_clan_adminIN_message = action.payload;
        state.get_all_clan_adminIN_data = null;
        state.get_all_clan_adminIN_isSuccess = false;
      })
      .addCase(Get_Single_clan.pending, (state) => {
        state.get_Single_clan_isLoading = true;
      })
      .addCase(Get_Single_clan.fulfilled, (state, action) => {
        state.get_Single_clan_isLoading = false;
        state.get_Single_clan_isSuccess = true;
        state.get_Single_clan_isError = false;
        state.get_Single_clan_message = null;
        state.get_Single_clan_data = action.payload;
      })
      .addCase(Get_Single_clan.rejected, (state, action) => {
        state.get_Single_clan_isLoading = false;
        state.get_Single_clan_isError = true;
        state.get_Single_clan_message = action.payload;
        state.get_Single_clan_data = null;
        state.get_Single_clan_isSuccess = false;
      })
      .addCase(Admin_Get_All_Clan_Memeber_Fun.pending, (state) => {
        state.admin_get_all_clan_memeber_isLoading = true;
      })
      .addCase(Admin_Get_All_Clan_Memeber_Fun.fulfilled, (state, action) => {
        state.admin_get_all_clan_memeber_isLoading = false;
        state.admin_get_all_clan_memeber_isSuccess = true;
        state.admin_get_all_clan_memeber_isError = false;
        state.admin_get_all_clan_memeber_message = null;
        state.admin_get_all_clan_memeber_data = action.payload;
      })
      .addCase(Admin_Get_All_Clan_Memeber_Fun.rejected, (state, action) => {
        state.admin_get_all_clan_memeber_isLoading = false;
        state.admin_get_all_clan_memeber_isError = true;
        state.admin_get_all_clan_memeber_message = action.payload;
        state.admin_get_all_clan_memeber_data = null;
        state.admin_get_all_clan_memeber_isSuccess = false;
      })
      .addCase(Admin_Get_Single_Clan_Memeber_Fun.pending, (state) => {
        state.admin_get_single_clan_memeber_isLoading = true;
      })
      .addCase(Admin_Get_Single_Clan_Memeber_Fun.fulfilled, (state, action) => {
        state.admin_get_single_clan_memeber_isLoading = false;
        state.admin_get_single_clan_memeber_isSuccess = true;
        state.admin_get_single_clan_memeber_isError = false;
        state.admin_get_single_clan_memeber_message = null;
        state.admin_get_single_clan_memeber_data = action.payload;
      })
      .addCase(Admin_Get_Single_Clan_Memeber_Fun.rejected, (state, action) => {
        state.admin_get_single_clan_memeber_isLoading = false;
        state.admin_get_single_clan_memeber_isError = true;
        state.admin_get_single_clan_memeber_message = action.payload;
        state.admin_get_single_clan_memeber_data = null;
        state.admin_get_single_clan_memeber_isSuccess = false;
      });
  },
});

export const { reset_ClanSlice } = ClanSlice.actions;

export default ClanSlice.reducer;
