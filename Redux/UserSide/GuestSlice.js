import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../shareApi";
import { API_CONFIG } from "../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;

const initialState = {
  get_all_user_guest_data: null,
  get_all_user_guest_isError: false,
  get_all_user_guest_isSuccess: false,
  get_all_user_guest_isLoading: false,
  get_all_user_guest_message: null,
};

// The resident's own invitations in their current estate (V2 returns
// { userInvites }, the shape the history screen reads).
export const Get_All_User_Guest_Fun = createAsyncThunk(
  "GuestSlice/Get_All_User_Guest_Fun",
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

      const response = await axios.get(`${API_BASEURL}api/v1/visitor`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const GuestSlice = createSlice({
  name: "GuestSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(Get_All_User_Guest_Fun.pending, (state) => {
        state.get_all_user_guest_isLoading = true;
      })
      .addCase(Get_All_User_Guest_Fun.fulfilled, (state, action) => {
        state.get_all_user_guest_isLoading = false;
        state.get_all_user_guest_isSuccess = true;
        state.get_all_user_guest_isError = false;
        state.get_all_user_guest_message = null;
        state.get_all_user_guest_data = action.payload;
      })
      .addCase(Get_All_User_Guest_Fun.rejected, (state, action) => {
        state.get_all_user_guest_isLoading = false;
        state.get_all_user_guest_isError = true;
        state.get_all_user_guest_message = action.payload;
        state.get_all_user_guest_data = null;
        state.get_all_user_guest_isSuccess = false;
      });
  },
});

export default GuestSlice.reducer;
