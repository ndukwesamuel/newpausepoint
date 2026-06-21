import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { useSelector } from "react-redux";
import { API_CONFIG } from "../api";

// Types
interface AuthState {
  user_data: {
    token: string;
  } | null;
  user_isError: boolean;
  user_isSuccess: boolean;
  user_isLoading: boolean;
  user_message: string;
}

interface authState {
  user_data: {
    token: string;
  } | null;
  user_isError: boolean;
  user_isSuccess: boolean;
  user_isLoading: boolean;
  user_message: string;
}

interface RootState {
  AuthSlice: AuthState;
  authSlice: authState;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

interface ApiRequestParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  token: string;
}

// Constants
const API_URL = API_CONFIG.BASE_URL;

console.log({ apiUrl: API_URL });

// Fetch function for GET requests
const fetchData = async ({ queryKey }: any) => {
  const [, url, token] = queryKey;

  try {
    const response = await axios.get(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error(
      "API Fetch Error:",
      axiosError.response?.data || axiosError.message,
    );

    // ✅ Just throw the error - interceptor already handled 401/token expiration
    throw new Error(
      axiosError.response?.data?.message || "Failed to fetch data",
    );
  }
};

// Hook for fetching data (GET requests)
export const useFetchData_v2 = (
  url: string,
  queryKey: string,
  options: Omit<UseQueryOptions<any, Error>, "queryKey" | "queryFn"> = {},
) => {
  const { userDatav2: user_data } = useSelector(
    (state: RootState) => state.authSlice,
  );

  const token = user_data?.data?.token || "";

  return useQuery({
    queryKey: [queryKey, url, token],
    queryFn: fetchData,
    enabled: !!token,
    retry: false,
    ...options,
  });
};

// API request function for mutations
const apiRequest = async ({ url, method, data, token }: ApiRequestParams) => {
  if (!token) throw new Error("Token is missing");

  try {
    const config: AxiosRequestConfig = {
      url: `${API_URL}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    const response = await axios(config);
    console.log("API Response:", response.data);
    return response.data;
    // }

  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorData = axiosError.response?.data;
    const err: any = new Error(
      errorData?.error || errorData?.message || "API request failed",
    );
    err.data = errorData;
    throw err;
  }
};

// Hook for mutations (POST, PUT, PATCH, DELETE)
export const useMutateData_v2 = (
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" | "GET",
  queryKey?: string | string[],
  options?: Omit<UseMutationOptions<any, Error, any>, "mutationFn">,
) => {
  const { userDatav2: user_data } = useSelector(
    (state: RootState) => state.authSlice,
  );
  const token = user_data?.data?.token || "";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => apiRequest({ url, method, data, token }),
    onSuccess: (data) => {
      console.log("Mutation Successful", { data });
      if (queryKey) {
        const invalidateKey =
          typeof queryKey === "string" ? [queryKey] : queryKey;
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
    },
    onError: (error) => {
      console.error("Mutation Error:", error.message);
    },
    ...options,
  });
};

// FormData API request function
const formDataApiRequest = async ({
  url,
  method,
  data,
  token,
}: ApiRequestParams) => {
  if (!token) throw new Error("Token is missing");

  try {
    const config: AxiosRequestConfig = {
      url: `${API_URL}${url}`,
      method,
      data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    console.error(
      "API Error:",
      axiosError.response?.data || axiosError.message,
    );

    // ✅ Just throw the error - interceptor already handled 401/token expiration
    throw new Error(axiosError.response?.data?.message || "API request failed");
  }
};

// Hook for FormData mutations
export const useFormDataMutate = (
  url: string,
  method: "POST" | "PUT" | "PATCH",
  queryKey?: string | string[],
  options?: Omit<UseMutationOptions<any, Error, any>, "mutationFn">,
) => {
  const { userDatav2: user_data } = useSelector(
    (state: RootState) => state.authSlice,
  );
  const token = user_data?.data?.token || "";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => formDataApiRequest({ url, method, data, token }),
    onSuccess: (data) => {
      console.log("Mutation Successful", { data });
      if (queryKey) {
        const invalidateKey =
          typeof queryKey === "string" ? [queryKey] : queryKey;
        queryClient.invalidateQueries({ queryKey: invalidateKey });
      }
    },
    onError: (error) => {
      console.error("Mutation Error:", error.message);
    },
    ...options,
  });
};
