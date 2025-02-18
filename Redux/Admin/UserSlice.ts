// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { handleApiError } from "../shareApi";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { AnyIfEmpty } from "react-redux";
import Toast from "react-native-toast-message";

// import { Alert } from "react-native";

// let userAPi = process.env.APIBASEURL + "user/login";


const initialState: {
    Alluser_data: any; // Change 'any' to the actual type of user_data if possible
    Alluser_data_isError: boolean;
    Alluser_data_isSuccess: boolean;
    Alluser_data_isLoading: boolean;
    Alluser_data_message: any // Change 'string' to the actual type of user_message if possible
    
    
    Singleuser_data : any
    Singleuser_data_isError: boolean
    Singleuser_data_isSuccess: boolean
    Singleuser_data_isLoading: boolean
    Singleuser_data_message: any

} = {
    Alluser_data: null,
    Alluser_data_isError: false,
    Alluser_data_isSuccess: false,
    Alluser_data_isLoading: false,
    Alluser_data_message: null,


    Singleuser_data: null,
    Singleuser_data_isError: false,
    Singleuser_data_isSuccess: false,
    Singleuser_data_isLoading: false,
    Singleuser_data_message: null,
};



const Admin_Get_Single_User_Fun_Service = async (id : any,  token: any) => {
    let url = `${API_BASEURL}user/${id}`;
    console.log({url});
    

    try {
   
          const config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
        };
        const response = await axios.get(url, config);
        

        return response.data;
    } catch (error) {
        // console.log({ error: error?.response });

        throw error;
    }

};


export const Admin_Get_Single_User_Fun = createAsyncThunk(
    "UserSlice/Admin_Get_Single_User_Fun",
    async (data : any, thunkAPI: any) => {
        try {
            let token = thunkAPI.getState().AuthSlice?.user_data?.token ;


            
            

            return await Admin_Get_Single_User_Fun_Service(data?.user?._id , token);

        } catch (error) {
            const errorMessage = handleApiError(error);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);



const Admin_Get_All_User_Fun_Service = async (token: any) => {
    let url = `${API_BASEURL}users`;

    try {
   
          const config = {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
        };
        const response = await axios.get(url, config);

        return response.data;
    } catch (error) {
        // console.log({ error: error?.response });

        throw error;
    }

};

export const Admin_Get_All_User_Fun = createAsyncThunk(
    "UserSlice/Admin_Get_All_User_Fun",
    async (_, thunkAPI: any) => {
        try {
            let token = thunkAPI.getState().AuthSlice?.user_data?.token ;


            console.log({token});
            

            return await Admin_Get_All_User_Fun_Service(token);

        } catch (error) {
            const errorMessage = handleApiError(error);
            return thunkAPI.rejectWithValue(errorMessage);
        }
    }
);

export const UserSlice = createSlice({
    name: "UserSlice",
    initialState,
    reducers: {
        reset_Admin_Get_All_User: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(Admin_Get_All_User_Fun.pending, (state) => {
                state.Alluser_data_isLoading = true;
            })
            .addCase(Admin_Get_All_User_Fun.fulfilled, (state, action) => {
                state.Alluser_data_isLoading = false;
                state.Alluser_data_isSuccess = true;
                state.Alluser_data_isError = false;
                state.Alluser_data_message = null;
                state.Alluser_data = action.payload;

           
            })
            .addCase(Admin_Get_All_User_Fun.rejected, (state, action) => {
                state.Alluser_data_isLoading = false;
                state.Alluser_data_isError = true;
                state.Alluser_data_message = action.payload;
                state.Alluser_data = null;
                state.Alluser_data_isSuccess = false;

            }).addCase(Admin_Get_Single_User_Fun.pending, (state) => {
                state.Singleuser_data_isLoading = true;
            })
            .addCase(Admin_Get_Single_User_Fun.fulfilled, (state, action) => {
                state.Singleuser_data_isLoading = false;
                state.Singleuser_data_isSuccess = true;
                state.Singleuser_data_isError = false;
                state.Singleuser_data_message = null;
                state.Singleuser_data = action.payload;
            })
            .addCase(Admin_Get_Single_User_Fun.rejected, (state, action) => {
                state.Singleuser_data_isLoading = false;
                state.Singleuser_data_isError = true;
                state.Singleuser_data_message = action.payload;
                state.Singleuser_data = null;
                state.Singleuser_data_isSuccess = false;
            });
    },
});

export const { reset_Admin_Get_All_User } = UserSlice.actions;

export default UserSlice.reducer;
