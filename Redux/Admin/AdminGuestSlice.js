import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import { API_CONFIG } from "../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;

const initialState = {
  Admin_get_all_domestic_staff_data: null,
  Admin_get_all_domestic_staff_isError: false,
  Admin_get_all_domestic_staff_isSuccess: false,
  Admin_get_all_domestic_staff_isLoading: false,
  Admin_get_all_domestic_staff_message: null,
};

// Estate admin: every resident's domestic staff in the estate (V2 resolves
// the estate from the admin's profile and returns { data: [...] }).
export const Admin_Get_All_DomesticStaff_Fun = createAsyncThunk(
  "AdminGuestSlice/Admin_Get_All_DomesticStaff_Fun",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState()?.authSlice?.userDatav2?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}api/v1/domestic/admin`,
        config
      );

      return response.data;
    } catch (error) {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Failed to load domestic staff"}`,
      });
      return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
  }
);

export const AdminGuestSlice = createSlice({
  name: "AdminGuestSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Admin_Get_All_DomesticStaff_Fun.pending, (state) => {
        state.Admin_get_all_domestic_staff_isLoading = true;
      })
      .addCase(Admin_Get_All_DomesticStaff_Fun.fulfilled, (state, action) => {
        state.Admin_get_all_domestic_staff_isLoading = false;
        state.Admin_get_all_domestic_staff_isSuccess = true;
        state.Admin_get_all_domestic_staff_isError = false;
        state.Admin_get_all_domestic_staff_message = null;
        state.Admin_get_all_domestic_staff_data = action.payload;
      })
      .addCase(Admin_Get_All_DomesticStaff_Fun.rejected, (state, action) => {
        state.Admin_get_all_domestic_staff_isLoading = false;
        state.Admin_get_all_domestic_staff_isError = true;
        state.Admin_get_all_domestic_staff_message = action.payload;
        state.Admin_get_all_domestic_staff_data = null;
        state.Admin_get_all_domestic_staff_isSuccess = false;
      });
  },
});

export default AdminGuestSlice.reducer;
