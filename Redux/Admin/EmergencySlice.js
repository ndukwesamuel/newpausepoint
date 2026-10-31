import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../shareApi";
import { API_CONFIG } from "../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;

// V2 admin routes resolve the estate from the admin's profile.
const v2Config = (thunkAPI) => ({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${
      thunkAPI.getState().authSlice?.userDatav2?.data?.token
    }`,
  },
});

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
      const response = await axios.get(
        `${API_BASEURL}api/v1/Emergencyreport/admin/all`,
        v2Config(thunkAPI)
      );
      // V2 wraps as { data: { reports } }; screens read { reports }.
      return response.data?.data;
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
      const response = await axios.get(
        `${API_BASEURL}api/v1/Emergencyreport/admin/${data?._id}`,
        v2Config(thunkAPI)
      );
      // V2 wraps as { data: { report, userProfile } }.
      return response.data?.data;
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
