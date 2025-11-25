import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

console.log({
  tytyy: apiUrl,
});

console.log({
  uuuuu: apiUrl,
});

// Function to fetch data
const fetchData = async ({ queryKey }) => {
  const [, url, token] = queryKey;
  // if (!token) throw new Error("Token is missing");

  try {
    console.log({
      jfjf: `${apiUrl}${url}`,
    });
    const response = await axios.get(`${apiUrl}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log("API Response:", response); // 🔥 Debugging Log
    return response.data;
  } catch (error) {
    console.error("API Fetch Error:", error.response?.data || error.message);
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

  console.log({
    token,
    url,
  });

  return useQuery({
    queryKey: [queryKey, url, token],
    queryFn: fetchData,
    enabled: !!token, // Prevent query from running without a token
    retry: false, // Prevent endless retries if there's an error
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

    console.log("API Response:", response.data); // 🔥 Debugging Log
    return response.data;
  } catch (error) {
    console.error("API Errorss:", error.response.data);
    throw new Error(
      error.response?.data.error ||
        error.response?.data?.message ||
        "API request failed"
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
      console.log("Mutation Successful", { data });
      queryClient.invalidateQueries({ queryKey: [queryKey] }); // Refresh data
    },
    onError: (error) => {
      console.error("Mutation Error:", error);
    },
  });
};

const formdataapiRequest = async ({ url, method, data, token }) => {
  if (!token) throw new Error("Token is missing");

  try {
    const response = await axios({
      url: `${apiUrl}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // 👈 force multipart
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "API request failed");
  }
};

// Hook for making API requests (POST, UPDATE, DELETE)
export const formdatauseMutateData = (url, method, queryKey) => {
  const { user_data } = useSelector((state) => state.AuthSlice);
  const token = user_data?.token;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => formdataapiRequest({ url, method, data, token }),
    onSuccess: (data) => {
      console.log("Mutation Successful", { data });
      queryClient.invalidateQueries({ queryKey: [queryKey] }); // Refresh data
    },
    onError: (error) => {
      console.error("Mutation Error:", error.message);
    },
  });
};
