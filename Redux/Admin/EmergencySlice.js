// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";
import { handleApiError } from "../shareApi";
import { LogBox } from "react-native";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";

const initialState = {
  Admin_Get_ALl_Emergency_Report: null,
  Admin_Get_ALl_Emergency_Report_isError: false,
  Admin_Get_ALl_Emergency_Report_isSuccess: false,
  Admin_Get_ALl_Emergency_Report_isLoading: false,
  Admin_Get_ALl_Emergency_Report_message: null,

  Admin_Get_Single_Emergency_Report: null,
  Admin_Get_Single_Emergency_Report_isError: false,
  Admin_Get_Single_Emergency_Report_isSuccess: false,
  Admin_Get_Single_Emergency_Report_isLoading: false,
  Admin_Get_Single_Emergency_Report_message: null,
};

export const Admin_Get_ALl_Emergency_Report_Fun = createAsyncThunk(
  "EmergencySlice/Admin_Get_ALl_Emergency_Report_Fun",
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

      const response = await axios.get(`${API_BASEURL}emargencyreport`, config);
      console.log({
        asas: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Admin_Get_Single_Emergency_Report_Fun = createAsyncThunk(
  "EmergencySlice/Admin_Get_Single_Emergency_Report_Fun",
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

      const response = await axios.get(
        `${API_BASEURL}emargencyreport/${data?._id}`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const EmergencySlice = createSlice({
  name: "EmergencySlice",
  initialState,
  reducers: {
    reset_EmergencySlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(
      Admin_Get_ALl_Emergency_Report_Fun.pending,
      (state, action) => {
        state.Admin_Get_ALl_Emergency_Report_isLoading = true;
        state.Admin_Get_ALl_Emergency_Report_isSuccess = false;
        state.Admin_Get_ALl_Emergency_Report_isError = false;
        state.Admin_Get_ALl_Emergency_Report_message = null;
      }
    );
    builder.addCase(
      Admin_Get_ALl_Emergency_Report_Fun.fulfilled,
      (state, action) => {
        state.Admin_Get_ALl_Emergency_Report = action?.payload;
        state.Admin_Get_ALl_Emergency_Report_isLoading = false;
        state.Admin_Get_ALl_Emergency_Report_isSuccess = true;
        state.Admin_Get_ALl_Emergency_Report_isError = false;
        state.Admin_Get_ALl_Emergency_Report_message = null;
      }
    );
    builder
      .addCase(Admin_Get_ALl_Emergency_Report_Fun.rejected, (state, action) => {
        state.Admin_Get_ALl_Emergency_Report_isLoading = false;
        state.Admin_Get_ALl_Emergency_Report_isError = true;
        state.Admin_Get_ALl_Emergency_Report_message = action?.payload;
        state.Admin_Get_ALl_Emergency_Report = null;
        state.Admin_Get_ALl_Emergency_Report_isSuccess = false;
      })
      .addCase(Admin_Get_Single_Emergency_Report_Fun.pending, (state) => {
        state.Admin_Get_Single_Emergency_Report_isLoading = true;
      })
      .addCase(
        Admin_Get_Single_Emergency_Report_Fun.fulfilled,
        (state, action) => {
          state.Admin_Get_Single_Emergency_Report = action?.payload;
          state.Admin_Get_Single_Emergency_Report_isLoading = false;
          state.Admin_Get_Single_Emergency_Report_isSuccess = true;
          state.Admin_Get_Single_Emergency_Report_isError = false;
          state.Admin_Get_Single_Emergency_Report_message = null;
        }
      )
      .addCase(
        Admin_Get_Single_Emergency_Report_Fun.rejected,
        (state, action) => {
          state.Admin_Get_Single_Emergency_Report_isLoading = false;
          state.Admin_Get_Single_Emergency_Report_isError = true;
          state.Admin_Get_Single_Emergency_Report_message = action?.payload;
          state.Admin_Get_Single_Emergency_Report = null;
          state.Admin_Get_Single_Emergency_Report_isSuccess = false;
        }
      );
  },
});

export const { reset_EmergencySlice } = EmergencySlice.actions;

export default EmergencySlice.reducer;
