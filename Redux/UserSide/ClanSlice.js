import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../shareApi";
import { API_CONFIG } from "../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;

const initialState = {
  get_Single_clan_data: null,
  get_Single_clan_isError: false,
  get_Single_clan_isSuccess: false,
  get_Single_clan_isLoading: false,
  get_Single_clan_message: null,
};

// Estate admin screens: the estate with members' name/email populated.
// Accepts the clan id or the populated clan object from the profile.
export const Get_Single_clan = createAsyncThunk(
  "ClanSlice/Get_Single_clan",
  async (clan, thunkAPI) => {
    try {
      const clanId = clan?._id || clan;
      if (!clanId) {
        return thunkAPI.rejectWithValue("No estate selected");
      }

      const token = thunkAPI.getState().authSlice?.userDatav2?.data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}api/v1/clan/estate/${clanId}`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const ClanSlice = createSlice({
  name: "ClanSlice",
  initialState,
  reducers: {
    reset_ClanSlice: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(Get_Single_clan.pending, (state) => {
        state.get_Single_clan_isLoading = true;
      })
      .addCase(Get_Single_clan.fulfilled, (state, action) => {
        state.get_Single_clan_isLoading = false;
        state.get_Single_clan_isSuccess = true;
        state.get_Single_clan_isError = false;
        state.get_Single_clan_message = null;
        state.get_Single_clan_data = action.payload;
      })
      .addCase(Get_Single_clan.rejected, (state, action) => {
        state.get_Single_clan_isLoading = false;
        state.get_Single_clan_isError = true;
        state.get_Single_clan_message = action.payload;
        state.get_Single_clan_data = null;
        state.get_Single_clan_isSuccess = false;
      });
  },
});

export const { reset_ClanSlice } = ClanSlice.actions;

export default ClanSlice.reducer;
