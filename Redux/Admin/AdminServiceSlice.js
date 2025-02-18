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
  get_all_admin_Service_data: null,
  get_all_admin_Service_isError: false,
  get_all_admin_Service_isSuccess: false,
  get_all_admin_Service_isLoading: false,
  get_all_admin_Service_message: null,

  categoryes_data: null,
  categories_isError: false,
  categories_isSuccess: false,
  categories_isLoading: false,
  categories_message: null,
};

export const Get_all_admin_Service__Fun = createAsyncThunk(
  "AdminServiceSlice/Get_all_admin_Service__Fun",
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
        `${API_BASEURL}services/vendors/estate-admin`,
        config
      );
      console.log({sss:response.data})
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_all_Categoryes__Fun = createAsyncThunk(
  "AdminServiceSlice/Get_all_Categoryes__Fun",
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
        `${API_BASEURL}services/vendors/category`,
        config
      );

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

export const AdminServiceSlice = createSlice({
  name: "AdminServiceSlice",
  initialState,
  reducers: {
    reset_EmergencySlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(Get_all_admin_Service__Fun.pending, (state, action) => {
      state.get_all_admin_Service_isLoading = true;
    });
    builder.addCase(Get_all_admin_Service__Fun.fulfilled, (state, action) => {
      state.get_all_admin_Service_isLoading = false;
      state.get_all_admin_Service_isError = false;
      state.get_all_admin_Service_isSuccess = true;
      state.get_all_admin_Service_data = action?.payload;
      state.get_all_admin_Service_message = null;
    });
    builder
      .addCase(Get_all_admin_Service__Fun.rejected, (state, action) => {
        state.get_all_admin_Service_isLoading = false;
        state.get_all_admin_Service_isError = true;
        state.get_all_admin_Service_message = action?.payload;
        state.get_all_admin_Service_data = null;
        state.get_all_admin_Service_isSuccess = false;
      })
      .addCase(Get_all_Categoryes__Fun.pending, (state) => {
        state.categories_isLoading = true;
      })
      .addCase(Get_all_Categoryes__Fun.fulfilled, (state, action) => {
        state.categories_isLoading = false;
        state.categories_isError = false;
        state.categories_isSuccess = true;
        state.categoryes_data = action?.payload;
        state.categories_message = null;
      })
      .addCase(Get_all_Categoryes__Fun.rejected, (state, action) => {
        state.categories_isLoading = false;
        state.categories_isError = true;
        state.categories_message = action?.payload;
        state.categoryes_data = null;
        state.categories_isSuccess = false;
      });
  },
});

export const { reset_EmergencySlice } = AdminServiceSlice.actions;

export default AdminServiceSlice.reducer;
