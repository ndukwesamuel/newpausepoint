import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// const apiUrl = import.meta.env.VITE_API_URL;
const initialState = {
  shareLink: createDefaultState(),
};

function createDefaultState() {
  return {
    data: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: null,
  };
}

function getAxiosConfig(token) {
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
}

function getToken(thunkAPI) {
  return thunkAPI.getState()?.AuthSlice.user_data?.token;
}

export const getSShareLink = createAsyncThunk(
  "UtilitisSlice/getSShareLink",
  async (_, thunkAPI) => {
    try {
      const url = `${API_BASEURL}other/share-link-to-app`;
      const token = getToken(thunkAPI);

      const response = await axios.get(url, getAxiosConfig(token));
      console.log({
        response: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const UtilitisSlice = createSlice({
  name: "UtilitisSlice",
  initialState,
  reducers: {
    reset_UtilitisSlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSShareLink.pending, (state) => {
        state.shareLink.isLoading = true;
      })
      .addCase(getSShareLink.fulfilled, (state, action) => {
        state.shareLink.isLoading = false;
        state.shareLink.isSuccess = true;
        state.shareLink.isError = false;
        state.shareLink.message = null;
        state.shareLink.data = action.payload;
      })
      .addCase(getSShareLink.rejected, (state, action) => {
        state.shareLink.isLoading = false;
        state.shareLink.isError = true;
        state.shareLink.message = action.error.message;
        state.shareLink.data = null;
        state.shareLink.isSuccess = false;
      });
  },
});

export const { reset_data } = UtilitisSlice.actions;

export default UtilitisSlice.reducer;
