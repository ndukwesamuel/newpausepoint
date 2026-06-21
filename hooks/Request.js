import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

console.log({
  apiUrl: apiUrl,
});

// ========================================
// AUTHENTICATED REQUESTS (with token)
// ========================================

// Function to fetch data
const fetchData = async ({ queryKey }) => {
  const [, url, token] = queryKey;

  try {
    const response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // ✅ Just throw the error - interceptor already handled 401/token expiration
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};

// Hook for fetching data
export const useFetchData = (url, queryKey, options = {}) => {
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const token = user_data?.token;

  return useQuery({
    queryKey: [queryKey, url, token],
    queryFn: fetchData,
    enabled: !!token,
    retry: false,
    ...options,
  });
};

// Function to handle API requests
const apiRequest = async ({ url, method, data, token }) => {
  if (!token) throw new Error("Token is missing");

  try {
    const response = await axios({
      url: `${apiUrl}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    // ✅ Just throw the error - interceptor already handled 401/token expiration
    throw new Error(
      error.response?.data.error ||
        error.response?.data?.message ||
        "API request failed",
    );
  }
};

// Hook for making API requests (POST, UPDATE, DELETE)
export const useMutateData = (url, method, queryKey) => {
  const { user_data } = useSelector((state) => state.AuthSlice);
  const token = user_data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiRequest({ url, method, data, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {},
  });
};

// Function to handle form data API requests
const formdataapiRequest = async ({ url, method, data, token }) => {
  if (!token) throw new Error("Token is missing");

  try {
    const response = await axios({
      url: `${apiUrl}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    // ✅ Just throw the error - interceptor already handled 401/token expiration
    throw new Error(error.response?.data?.message || "API request failed");
  }
};

// Hook for making API requests (POST, UPDATE, DELETE) with form data
export const formdatauseMutateData = (url, method, queryKey) => {
  const { user_data } = useSelector((state) => state.AuthSlice);
  const token = user_data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => formdataapiRequest({ url, method, data, token }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {},
  });
};

// ========================================
// PUBLIC REQUESTS (no token needed)
// ========================================

// ✅ Function for public API requests (no token)
const publicApiRequest = async ({ url, method, data }) => {
  try {
    const response = await axios({
      url: `${apiUrl}${url}`,
      method,
      data,
      headers: {
        "Content-Type": "application/json",
      },
      // No Authorization header
    });

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        "API request failed",
    );
  }
};

// ✅ Hook for public API requests (no token needed)
// Use for: login, register, forgot-password, verify-otp, reset-password
export const usePublicMutateData = (url, method, queryKey) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => publicApiRequest({ url, method, data }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      // Error handling is done in the component
    },
  });
};
