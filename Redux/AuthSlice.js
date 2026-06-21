// // import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { handleApiError } from "./shareApi";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import { AnyIfEmpty } from "react-redux";
// import Toast from "react-native-toast-message";

// const initialState = {
//   user_data: null,
//   user_isError: false,
//   user_isSuccess: false,
//   user_isLoading: false,
//   user_message: null,

//   pushtokendata: null,
// };

// const Login_Fun_Service = async (data) => {
//   console.log({
//     oopp: data,
//   });

//   let url = `${API_BASEURL}api/v1/user/login`;
//   // let url = `${API_BASEURL}login`;

//   try {
//     const response = await axios.post(url, data);

//     return response.data;
//   } catch (error) {
//     console.log({
//       iii: error.response.data.error,
//     });

//     throw error.response.data.error;
//   }
// };

// export const Login_Fun = createAsyncThunk(
//   "auth/Login_Fun",
//   async (data, thunkAPI) => {
//     try {
//       return await Login_Fun_Service(data);
//     } catch (error) {
//       console.log({
//         fgfgg: error,
//       });
//       Toast.show({
//         type: "error",
//         text1: `${error}`,
//       });
//       return thunkAPI.rejectWithValue(error);
//     }
//   }
// );

// export const AuthSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     reset_login: (state) => initialState,
//     reset_other_login: (state) => {
//       (state.user_isError = false),
//         (state.user_isLoading = false),
//         (state.user_isSuccess = false),
//         (state.user_message = null);
//     },

//     pushtokendata: (state, action) => {
//       state.pushtokendata = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(Login_Fun.pending, (state) => {
//         state.user_isLoading = true;
//       })
//       .addCase(Login_Fun.fulfilled, (state, action) => {
//         state.user_isLoading = false;
//         state.user_isSuccess = true;
//         state.user_isError = false;
//         state.user_message = null;
//         state.user_data = action.payload;
//       })
//       .addCase(Login_Fun.rejected, (state, action) => {
//         state.user_isLoading = false;
//         state.user_isError = true;
//         state.user_message = action.payload;
//         state.user_data = null;
//         state.user_isSuccess = false;
//       });
//   },
// });

// export const { reset_login, reset_other_login, pushtokendata } =
//   AuthSlice.actions;

// export default AuthSlice.reducer;

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

const initialState = {
  user_data: null,
  user_isError: false,
  user_isSuccess: false,
  user_isLoading: false,
  user_message: null,
  pushtokendata: null,
};

const Login_Fun_Service = async (data) => {
  console.log({
    oopp: data,
  });

  let url = `${API_BASEURL}api/v1/user/login`;

  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.log({
      iii: error.response?.data?.error || error.message,
    });

    // Extract error message
    const errorMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Login failed";

    throw errorMessage;
  }
};

export const Login_Fun = createAsyncThunk(
  "auth/Login_Fun",
  async (data, thunkAPI) => {
    try {
      return await Login_Fun_Service(data);
    } catch (error) {
      console.log({
        fgfgg: error,
      });

      // Show toast immediately with proper error handling
      setTimeout(() => {
        Toast.show({
          type: "error",
          text1: "Login Error",
          text2: String(error),
          visibilityTime: 4000,
          position: "top",
          topOffset: 50,
        });
      }, 100);

      return thunkAPI.rejectWithValue(error);
    }
  },
);

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset_login: (state) => initialState,
    reset_other_login: (state) => {
      state.user_isError = false;
      state.user_isLoading = false;
      state.user_isSuccess = false;
      state.user_message = null;
    },
    pushtokendata: (state, action) => {
      state.pushtokendata = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(Login_Fun.pending, (state) => {
        state.user_isLoading = true;
        state.user_isError = false;
        state.user_message = null;
      })
      .addCase(Login_Fun.fulfilled, (state, action) => {
        state.user_isLoading = false;
        state.user_isSuccess = true;
        state.user_isError = false;
        state.user_message = null;
        state.user_data = action.payload;
      })
      .addCase(Login_Fun.rejected, (state, action) => {
        state.user_isLoading = false;
        state.user_isError = true;
        state.user_message = action.payload;
        state.user_data = null;
        state.user_isSuccess = false;
      });
  },
});

export const { reset_login, reset_other_login, pushtokendata } =
  AuthSlice.actions;

export default AuthSlice.reducer;
