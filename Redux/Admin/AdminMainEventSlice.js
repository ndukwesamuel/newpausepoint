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
  Adminuserevent_data: null,
  Adminuserevent_isError: false,
  Adminuserevent_isSuccess: false,
  Adminuserevent_isLoading: false,
  Adminuserevent_message: null,

  AdminsingleEvent_Data: null,
  AdminsingleEvent_isError: false,
  AdminsingleEvent_isSuccess: false,
  AdminsingleEvent_isLoading: false,
  AdminsingleEvent_message: null,
};

export const Get_UserEvent_Fun = createAsyncThunk(
  "MainEventSlice/Get_UserEvent_Fun",
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

      const response = await axios.get(`${API_BASEURL}resident-event`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_Single_UserEvent_Fun = createAsyncThunk(
  "MainEventSlice/Get_Single_UserEvent_Fun",
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
        `${API_BASEURL}resident-event/${id}`,
        config
      );
      console.log({
        hh: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_GeneralEvent_Fun = createAsyncThunk(
  "MainEventSlice/Get_GeneralEvent_Fun",
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
        `${API_BASEURL}resident-event/generalevent`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const AdminMainEventSlice = createSlice({
  name: "AdminMainEventSlice",
  initialState,
  reducers: {
    reset_MainEventSlice: (state) => initialState,
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(Get_UserEvent_Fun.pending, (state) => {
  //       state.userevent_isLoading = true;
  //     })
  //     .addCase(Get_UserEvent_Fun.fulfilled, (state, action) => {
  //       state.userevent_isLoading = false;
  //       state.userevent_isSuccess = true;
  //       state.userevent_isError = false;
  //       state.userevent_message = null;
  //       state.userevent_data = action.payload;
  //     })
  //     .addCase(Get_UserEvent_Fun.rejected, (state, action) => {
  //       state.userevent_isLoading = false;
  //       state.userevent_isError = true;
  //       state.userevent_message = action.payload;
  //       state.userevent_data = null;
  //       state.userevent_isSuccess = false;
  //     })
  //     .addCase(Get_GeneralEvent_Fun.pending, (state) => {
  //       state.generalevent_isLoading = true;
  //     })
  //     .addCase(Get_GeneralEvent_Fun.fulfilled, (state, action) => {
  //       state.generalevent_isLoading = false;
  //       state.generalevent_isSuccess = true;
  //       state.generalevent_isError = false;
  //       state.generalevent_message = null;
  //       state.generalevent_data = action.payload;
  //     })
  //     .addCase(Get_GeneralEvent_Fun.rejected, (state, action) => {
  //       state.generalevent_isLoading = false;
  //       state.generalevent_isError = true;
  //       state.generalevent_message = action.payload;
  //       state.generalevent_data = null;
  //       state.generalevent_isSuccess = false;
  //     })
  //     .addCase(Get_Single_UserEvent_Fun.pending, (state) => {
  //       state.singleEvent_isLoading = true;
  //     })
  //     .addCase(Get_Single_UserEvent_Fun.fulfilled, (state, action) => {
  //       state.singleEvent_isLoading = false;
  //       state.singleEvent_isSuccess = true;
  //       state.singleEvent_isError = false;
  //       state.singleEvent_message = null;
  //       state.singleEvent_Data = action.payload;
  //     })
  //     .addCase(Get_Single_UserEvent_Fun.rejected, (state, action) => {
  //       state.singleEvent_isLoading = false;
  //       state.singleEvent_isError = true;
  //       state.singleEvent_message = action.payload;
  //       state.singleEvent_Data = null;
  //       state.singleEvent_isSuccess = false;
  //     });
  // },
});

export const { reset_MainEventSlice } = AdminMainEventSlice.actions;

export default AdminMainEventSlice.reducer;
