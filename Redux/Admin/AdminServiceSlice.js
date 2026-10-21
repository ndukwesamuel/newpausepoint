import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { handleApiError } from "../shareApi";

// Vendor thunks were removed when admin services moved to V2 artisans; only
// this emergency lookup (still on the old server) remains here.

const initialState = {};

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
});

export const { reset_EmergencySlice } = AdminServiceSlice.actions;

export default AdminServiceSlice.reducer;
