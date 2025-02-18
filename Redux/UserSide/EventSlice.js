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
  user_data: null,
  user_isError: false,
  user_isSuccess: false,
  user_isLoading: false,
  user_message: null,

  category_data: null,
  category_isError: false,
  category_isSuccess: false,
  category_isLoading: false,
  category_message: null,

  all_public_event_data: null,
  all_public_event_isError: false,
  all_public_event_isSuccess: false,
  all_public_event_isLoading: false,
  all_public_event_message: null,

  all_host_public_event: null,
  all_host_public_event_isError: false,
  all_host_public_event_isSuccess: false,
  all_host_public_event_isLoading: false,
  all_host_public_event_message: null,

  host_event: null,
  host_event_isError: false,
  host_event_isSuccess: false,
  host_event_isLoading: false,
  host_event_message: null,

  single_host_event: null,
  single_host_event_isError: false,
  single_host_event_isSuccess: false,
  single_host_event_isLoading: false,
  single_host_event_message: null,

  single_public_event: null,
  single_public_event_isError: false,
  single_public_event_isSuccess: false,
  single_public_event_isLoading: false,
  single_public_event_message: null,
};

export const Category_Fun = createAsyncThunk(
  "userEventSlice/Category_Fun",
  async (_, thunkAPI) => {
    try {
      let token = thunkAPI.getState().AuthSlice.user_data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${API_BASEURL}public-events/categories`,
        config
      );
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const All_Public_events_Fun = createAsyncThunk(
  "userEventSlice/All_Public_events_Fun",
  async (data, thunkAPI) => {
    try {
      let token = thunkAPI.getState().AuthSlice.user_data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${API_BASEURL}events/public?title=${data}`,
        config
      );
      console.log({
        result: response.data,
      });
      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const All_Host_Public_events_Fun = createAsyncThunk(
  "userEventSlice/All_Host_Public_events_Fun",
  async (data, thunkAPI) => {
    try {
      let token = thunkAPI.getState().AuthSlice.user_data?.token;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.get(
        `${API_BASEURL}public/host-events`,
        config
      );

      return response.data;
    } catch (error) {
      console.log({
        error: error?.response,
      });
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Host__events_Fun = createAsyncThunk(
  "userEventSlice/Host__events_Fun",
  async (data, thunkAPI) => {
    try {
      console.log({ data });
      let mydata = thunkAPI.getState().AuthSlice.user_data;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${mydata?.token}`,
        },
      };

      const response = await axios.get(
        `${API_BASEURL}host-events?title=${data}`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_Singel_Host__events_Fun = createAsyncThunk(
  "userEventSlice/Get_Singel_Host__events_Fun",
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

      const response = await axios.get(`${API_BASEURL}event/${data}`, config);

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const Get_Singel_Public__events_Fun = createAsyncThunk(
  "userEventSlice/Get_Singel_Public__events_Fun",
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
        `${API_BASEURL}public/event/${data}`,
        config
      );

      return response.data;
    } catch (error) {
      const errorMessage = handleApiError(error);
      return thunkAPI.rejectWithValue(errorMessage);
    }
  }
);

export const EventSlice = createSlice({
  name: "userEventSlice",
  initialState,
  reducers: {
    reset_EventSlice: (state) => initialState,

    reste_Get_Singel_Public__events_Fun: (state) => {
      state.single_public_event_isLoading = false;
      state.single_public_event_isError = false;
      state.single_public_event_message = null;
      state.single_public_event = null;
      state.single_public_event_isSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Category_Fun.pending, (state) => {
        state.category_isLoading = true;
      })
      .addCase(Category_Fun.fulfilled, (state, action) => {
        state.category_isLoading = false;
        state.category_isSuccess = true;
        state.category_isError = false;
        state.category_message = null;
        state.category_data = action.payload;
      })
      .addCase(Category_Fun.rejected, (state, action) => {
        state.category_isLoading = false;
        state.category_isError = true;
        state.category_message = action.payload;
        state.category_data = null;
        state.category_isSuccess = false;
      })
      .addCase(All_Public_events_Fun.pending, (state) => {
        state.all_public_event_isLoading = true;
      })
      .addCase(All_Public_events_Fun.fulfilled, (state, action) => {
        state.all_public_event_isLoading = false;
        state.all_public_event_isSuccess = true;
        state.all_public_event_isError = false;
        state.category_message = null;
        state.all_public_event_data = action.payload;
      })
      .addCase(All_Public_events_Fun.rejected, (state, action) => {
        state.all_public_event_isLoading = false;
        state.all_public_event_isError = true;
        state.all_public_event_message = action.payload;
        state.all_public_event_data = null;
        state.all_public_event_isSuccess = false;
      })
      .addCase(Host__events_Fun.pending, (state) => {
        state.host_event_isLoading = true;
      })
      .addCase(Host__events_Fun.fulfilled, (state, action) => {
        state.host_event_isLoading = false;
        state.host_event_isSuccess = true;
        state.host_event_isError = false;
        state.host_event_message = null;
        state.host_event = action.payload;
      })
      .addCase(Host__events_Fun.rejected, (state, action) => {
        state.host_event_isLoading = false;
        state.host_event_isError = true;
        state.host_event_message = action.payload;
        state.host_event = null;
        state.host_event_isSuccess = false;
      })
      .addCase(Get_Singel_Host__events_Fun.pending, (state) => {
        state.single_host_event_isLoading = true;
      })
      .addCase(Get_Singel_Host__events_Fun.fulfilled, (state, action) => {
        state.single_host_event_isLoading = false;
        state.single_host_event_isSuccess = true;
        state.single_host_event_isError = false;
        state.single_host_event_message = null;
        state.single_host_event = action.payload;
      })
      .addCase(Get_Singel_Host__events_Fun.rejected, (state, action) => {
        state.single_host_event_isLoading = false;
        state.single_host_event_isError = true;
        state.single_host_event_message = action.payload;
        state.single_host_event = null;
        state.single_host_event_isSuccess = false;
      })
      .addCase(Get_Singel_Public__events_Fun.pending, (state) => {
        state.single_public_event_isLoading = true;
      })
      .addCase(Get_Singel_Public__events_Fun.fulfilled, (state, action) => {
        state.single_public_event_isLoading = false;
        state.single_public_event_isSuccess = true;
        state.single_public_event_isError = false;
        state.single_public_event_message = null;

        state.single_public_event = action.payload;
      })
      .addCase(Get_Singel_Public__events_Fun.rejected, (state, action) => {
        state.single_public_event_isLoading = false;
        state.single_public_event_isError = true;
        state.single_public_event_message = action.payload;
        state.single_public_event = null;
        state.single_public_event_isSuccess = false;
      })
      .addCase(All_Host_Public_events_Fun.pending, (state) => {
        state.all_host_public_event_isLoading = true;
      })
      .addCase(All_Host_Public_events_Fun.fulfilled, (state, action) => {
        state.all_host_public_event_isLoading = false;
        state.all_host_public_event_isSuccess = true;
        state.all_host_public_event_isError = false;
        state.all_host_public_event_message = null;
        state.all_host_public_event = action.payload;
      })
      .addCase(All_Host_Public_events_Fun.rejected, (state, action) => {
        state.all_host_public_event_isLoading = false;
        state.all_host_public_event_isError = true;
        state.all_host_public_event_message = action.payload;
        state.all_host_public_event = null;
        state.all_host_public_event_isSuccess = false;
      });
  },
});

export const { reste_Get_Singel_Public__events_Fun, reset_EventSlice } =
  EventSlice.actions;

export default EventSlice.reducer;
