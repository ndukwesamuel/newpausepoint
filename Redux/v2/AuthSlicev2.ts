

import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

// ============================================================================
// CONSTANTS
// ============================================================================
const API_BASE_URL = "https://communist-carla-pausepoint-fb082012.koyeb.app/";
const TOAST_DELAY_MS = 100;
const TOAST_DURATION_MS = 4000;
const TOAST_TOP_OFFSET = 50;

// ============================================================================
// TYPES
// ============================================================================
interface userDatav2 {
  id: string;
  email: string;
  name?: string;
  token?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  userDatav2: userDatav2 | null;
  isError: boolean;
  isSuccess: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  pushToken: string | null;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

// ============================================================================
// INITIAL STATE
// ============================================================================
const initialState: AuthState = {
  userDatav2: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  errorMessage: null,
  pushToken: null,
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const extractErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.log({ cccvv: axiosError.response?.data });
    return (
      axiosError.response?.data?.message ||
      axiosError.response?.data?.error ||
      axiosError.message ||
      "Login failed. Please try again."
    );
  }
  return error instanceof Error
    ? error.message
    : "An unexpected error occurred";
};

const showErrorToast = (message: string): void => {
  setTimeout(() => {
    Toast.show({
      type: "error",
      text1: "Login Error",
      text2: message,
      visibilityTime: TOAST_DURATION_MS,
      position: "top",
      topOffset: TOAST_TOP_OFFSET,
    });
  }, TOAST_DELAY_MS);
};

const showSuccessToast = (message: string = "Login successful"): void => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    visibilityTime: 3000,
    position: "top",
    topOffset: TOAST_TOP_OFFSET,
  });
};

// ============================================================================
// PUSH TOKEN — fire and forget, never breaks login
// ============================================================================
const sendPushTokenToBackend = (jwtToken: string): void => {
  AsyncStorage.getItem("PushToken")
    .then((pushToken) => {
      if (!pushToken) {
        console.log("[PUSH] No push token in AsyncStorage — skipping");
        return;
      }
      console.log("[PUSH] Sending push token to backend...");
      axios
        .post(
          `${API_BASE_URL}api/v1/user/push-token`,
          { token: pushToken },
          {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
            timeout: 10000,
          },
        )
        .then(() => console.log("[PUSH] Token sent to backend successfully"))
        .catch((err) => console.log("[PUSH] Failed (non-blocking):", err.message));
    })
    .catch(() => console.log("[PUSH] Failed to read AsyncStorage (non-blocking)"));
};

// ============================================================================
// API SERVICE
// ============================================================================
const loginService = async (
  credentials: LoginCredentials,
): Promise<userDatav2> => {
  const url = `${API_BASE_URL}api/v1/auth/signin`;


  try {
    const response = await axios.post<any>(
      url,
      {
        email: credentials.email,
        password: credentials.password,
      },
      {
        timeout: 10000,
        headers: { "Content-Type": "application/json" },
      },
    );

    console.log({ responseData: response.data });

    // ── Fix: token is at response.data.data.token ──
    const jwtToken = response.data?.data?.token || response.data?.token;

    console.log({ ememka: jwtToken });
  

    if (jwtToken) {
      await AsyncStorage.setItem("userToken", jwtToken);
      await AsyncStorage.setItem("userDatav2", JSON.stringify(response.data));

      // Fire and forget — send push token to backend
      sendPushTokenToBackend(jwtToken);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

// ============================================================================
// THUNKS
// ============================================================================
export const loginUser = createAsyncThunk<
  userDatav2,
  LoginCredentials,
  { rejectValue: string }
>("AuthSlicev2/loginUser", async (credentials, thunkAPI) => {
  try {
    const userDatav2 = await loginService(credentials);
    showSuccessToast("Welcome back!");
    return userDatav2;
  } catch (error) {
    showErrorToast(error.response?.data?.message);
    return thunkAPI.rejectWithValue(error.response?.data?.message);
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  // Clear push token from backend — fire and forget
  try {
    const userToken = await AsyncStorage.getItem("userToken");
    if (userToken) {
      axios
        .delete(`${API_BASE_URL}api/v1/general/push-token`, {
          headers: { Authorization: `Bearer ${userToken}` },
          timeout: 5000,
        })
        .then(() => console.log("[PUSH] Token cleared on logout"))
        .catch(() => console.log("[PUSH] Failed to clear token (non-blocking)"));
    }
  } catch {}

  await AsyncStorage.multiRemove(["userToken", "userDatav2"]);
});

// ============================================================================
// SLICE
// ============================================================================
export const AuthSlicev2 = createSlice({
  name: "AuthSlicev2",
  initialState,
  reducers: {
    resetAuth: () => initialState,

    resetAuthStatus: (state) => {
      state.isError = false;
      state.isLoading = false;
      state.isSuccess = false;
      state.errorMessage = null;
    },

    setPushToken: (state, action: PayloadAction<string>) => {
      state.pushToken = action.payload;
    },

    setUserFromStorage: (state, action: PayloadAction<userDatav2>) => {
      state.userDatav2 = action.payload;
      state.isSuccess = true;
    },

    clearError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.errorMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.userDatav2 = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload || "Login failed";
      })
      .addCase(logoutUser.fulfilled, () => initialState);
  },
});

// ============================================================================
// EXPORTS
// ============================================================================
export const {
  resetAuth,
  resetAuthStatus,
  setPushToken,
  setUserFromStorage,
  clearError,
} = AuthSlicev2.actions;

export default AuthSlicev2.reducer;