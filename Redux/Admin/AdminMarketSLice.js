import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../shareApi";
import { API_CONFIG } from "../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;

const initialState = {
  Admin_Market_data: null,
  Admin_Market_isError: false,
  Admin_Market_isSuccess: false,
  Admin_Market_isLoading: false,
  Admin_Market_message: null,
};

// The admin's estate, from the profile (populated object or bare id).
export const adminClanIdFrom = (state) => {
  const clan =
    state?.UserProfileSlice?.get_user_profile_data?.data
      ?.AdmincurrentClanMeeting;
  return clan?._id || clan || null;
};

// Estate admin: every listing in the admin's estate (V2).
export const AdminMarket_data_Fun = createAsyncThunk(
  "AdminMarketSLice/AdminMarket_data_Fun",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const clanId = adminClanIdFrom(state);
      if (!clanId) {
        return thunkAPI.rejectWithValue("No estate selected");
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${state.authSlice?.userDatav2?.data?.token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}api/v1/marketRouter/admin/${clanId}?limit=100`,
        config
      );

      // Screens read { products }; V2 returns { data: [...] }.
      return { products: response.data?.data || [] };
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
    reset_ClanSlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(AdminMarket_data_Fun.pending, (state) => {
        state.Admin_Market_isLoading = true;
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
      });
  },
});

export const { reset_ClanSlice } = AdminMarketSLice.actions;

export default AdminMarketSLice.reducer;
