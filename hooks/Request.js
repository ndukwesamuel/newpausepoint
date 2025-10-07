import { useQuery } from "react-query";
import axios from "axios";
import { useSelector } from "react-redux";

import { useMutation, useQueryClient } from "react-query";
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

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
  //   const { user } = useSelector((state) => state?.reducer?.AuthSlice);

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

  return useQuery([queryKey, url, token], fetchData, {
    enabled: !!token, // Prevent query from running without a token
    retry: false, // Prevent endless retries if there's an error
    ...options,
  });
};

// import axios from "axios";
// import { useSelector } from "react-redux";

// const apiUrl = process.env.EXPO_PUBLIC_API_URL;

// Function to handle API requests
const apiRequest = async ({ url, method, data, token }) => {
  if (!token) throw new Error("Token is missing");

  // console.log({ccc: url, method, data, token});

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
    console.error("API Errorss:", error.response);
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

  return useMutation((data) => apiRequest({ url, method, data, token }), {
    onSuccess: (data) => {
      console.log("Mutation Successful", { data });
      queryClient.invalidateQueries(queryKey); // Refresh data
    },
    onError: (error) => {
      console.log({
        fadafada: error.message,
      });

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

  return useMutation(
    (data) => formdataapiRequest({ url, method, data, token }),
    {
      onSuccess: (data) => {
        console.log("Mutation Successful", { data });
        queryClient.invalidateQueries(queryKey); // Refresh data
      },
      onError: (error) => {
        console.error("Mutation Error:", error.message);
      },
    }
  );
};
