import AsyncStorage from "@react-native-async-storage/async-storage";
import axios, { AxiosError } from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";

// ============================================================================
// CONSTANTS
// ============================================================================
const API_BASE_URL = "https://communist-carla-pausepoint-fb082012.koyeb.app/"; //process.env.EXPO_PUBLIC_API_URL;
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
  deviceId: string; // ← NEW: required by /signin-v2
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

    console.log({
      cccvv: axiosError.response?.data,
    });

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

// Device-lock errors (pause/freeze) get their own modal in the UI —
// showing a toast on top of that modal would be redundant/confusing,
// so the thunk skips the toast for these specific messages.
const isDeviceLockMessage = (message?: string | null): boolean => {
  if (!message) return false;
  return (
    message.includes("temporarily paused") ||
    message.includes("frozen due to multiple device changes")
  );
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
// API SERVICE
// ============================================================================

const loginService = async (
  credentials: LoginCredentials,
): Promise<userDatav2> => {
  // ── Switched to the v2 login route, which requires deviceId ──
  const url = `${API_BASE_URL}api/v1/auth/signin-v2`;

  console.log({
    rty: url,
    ccf: credentials,
  });

  try {
    const response = await axios.post<userDatav2>(
      url,
      {
        email: credentials.email,
        password: credentials.password,
        deviceId: credentials.deviceId, // ← NEW
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.token) {
      await AsyncStorage.setItem("userToken", response.data.token);
      await AsyncStorage.setItem("userDatav2", JSON.stringify(response.data));
    }

    return response.data;
  } catch (error) {
    throw error;
  }
};

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
    const message = error.response?.data?.message;

    // Device-lock errors are shown via a dedicated modal in the UI instead
    // of a toast — see LoginScreen.jsx.
    if (!isDeviceLockMessage(message)) {
      showErrorToast(message);
    }

    return thunkAPI.rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
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
      // Login
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

      // Logout
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