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
  Admin_Market_data: null,
  Admin_Market_isError: false,
  Admin_Market_isSuccess: false,
  Admin_Market_isLoading: false,
  Admin_Market_message: null,

  amenitity_data: null,
  amenitity_isError: false,
  amenitity_isSuccess: false,
  amenitity_isLoading: false,
  amenitity_message: null,
};

export const Amenitity_data_Fun = createAsyncThunk(
  "AdminMarketSLice/Amenitity_data_Fun",
  async (data, thunkAPI) => {
    console.log({
      jjkjk: data,
    });
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;
      let clan_id =
        thunkAPI.getState()?.ProfileSlice?.userProfile_data
          ?.AdmincurrentClanMeeting;
      console.log({
        fdfdf: clan_id,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      if (data === "all") {
        const response = await axios.get(`${API_BASEURL}amenities/all`, config);
        return response.data;
      } else {
        const response = await axios.get(`${API_BASEURL}amenities`, config);
        return response.data;
      }
    } catch (error) {
      console.log({
        jiiiii: error?.response,
      });
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const AdminMarket_data_Fun = createAsyncThunk(
  "AdminMarketSLice/AdminMarket_data_Fun",
  async (data, thunkAPI) => {
    try {
      let mydata = thunkAPI.getState().AuthSlice.user_data;
      let clan_id =
        thunkAPI.getState()?.ProfileSlice?.userProfile_data
          ?.AdmincurrentClanMeeting;
      console.log({
        fdfdf: clan_id,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}market/allclanproducts`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const AdminMarketSLice = createSlice({
  name: "AdminMarketSLice",
  initialState,
  reducers: {
    MarketSLice: (state) => initialState,

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

      .addCase(AdminMarket_data_Fun.pending, (state) => {
        state.Admin_Market_isLoading = true;
        state.Admin_Market_isError = false;
        state.Admin_Market_isSuccess = false;
        state.Admin_Market_message = null;
        state.Admin_Market_data = null;
      })
      .addCase(AdminMarket_data_Fun.fulfilled, (state, action) => {
        state.Admin_Market_isLoading = false;
        state.Admin_Market_isError = false;
        state.Admin_Market_isSuccess = true;
        state.Admin_Market_message = null;
        state.Admin_Market_data = action.payload;
      })
      .addCase(AdminMarket_data_Fun.rejected, (state, action) => {
        state.Admin_Market_isLoading = false;
        state.Admin_Market_isError = true;
        state.Admin_Market_message = action.payload;
        state.Admin_Market_data = null;
        state.Admin_Market_isSuccess = false;
      })
      .addCase(Amenitity_data_Fun.pending, (state) => {
        state.amenitity_isLoading = true;
      })
      .addCase(Amenitity_data_Fun.fulfilled, (state, action) => {
        state.amenitity_isLoading = false;
        state.amenitity_isError = false;
        state.amenitity_isSuccess = true;
        state.amenitity_message = null;
        state.amenitity_data = action.payload;
      })
      .addCase(Amenitity_data_Fun.rejected, (state, action) => {
        state.amenitity_isLoading = false;
        state.amenitity_isError = true;
        state.amenitity_message = action.payload;
        state.amenitity_data = null;
        state.amenitity_isSuccess = false;
      });
  },
});

export const { reset_ClanSlice } = AdminMarketSLice.actions;

export default AdminMarketSLice.reducer;
