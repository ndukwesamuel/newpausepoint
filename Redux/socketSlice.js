import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

let main_url = process.env.REACT_APP_Url;
const initialState = {
  onlineUser: [],
  socketConnection: null,
};

export const socketSlice = createSlice({
  name: "socketSlice",
  initialState,
  reducers: {
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
    setSocketConnection: (state, action) => {
      state.socketConnection = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setOnlineUser, setSocketConnection } = socketSlice.actions;

export default socketSlice.reducer;
