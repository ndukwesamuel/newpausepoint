import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import AuthSlice from "./AuthSlice";
import UserSlice from "./Admin/UserSlice";
import EventSlice from "./UserSide/EventSlice";
import ProfileSlice from "./ProfileSlice";
import ClanSlice from "./UserSide/ClanSlice";
import UserProfileSlice from "./UserSide/UserProfileSlice";
import  ForumSlice  from "./UserSide/ForumSlice";
import EmergencySlice from "./Admin/EmergencySlice";
import AdminForumSlice from "./Admin/AdminForumSlice";
import GuestSlice from "./UserSide/GuestSlice";
import PollSlice from "./UserSide/PollSlice";
import AdminGuestSlice from "./Admin/AdminGuestSlice";
import DontwantToResetSlice from "./DontwantToResetSlice";
import OnboardingSlice from "./OnboardingSlice";
import MainEventSlice from "./UserSide/MainEventSlice";
import AdminMainEventSlice from "./Admin/AdminMainEventSlice";
import ServiceSlice from "./UserSide/ServiceSlice";
import AdminServiceSlice from "./Admin/AdminServiceSlice";
import MarketSLice from "./UserSide/MarketSLice";
import AdminMarketSLice from "./Admin/AdminMarketSLice";
import socketSlice from "./socketSlice";
import UtilitisSlice from "./UtilitisSlice";

// import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from "redux-persist";

const reducers = combineReducers({
  OnboardingSlice:OnboardingSlice,
  AuthSlice : AuthSlice,
  UserSlice:UserSlice,
  EventSlice:EventSlice,
  ProfileSlice: ProfileSlice,
  ClanSlice:ClanSlice,
  UserProfileSlice: UserProfileSlice,
  ForumSlice:ForumSlice,
  EmergencySlice:EmergencySlice,
  AdminForumSlice:AdminForumSlice,
  GuestSlice:GuestSlice,
  PollSlice:PollSlice,
  AdminGuestSlice:AdminGuestSlice,
  DontwantToResetSlice:DontwantToResetSlice,
  MainEventSlice:MainEventSlice,
  AdminMainEventSlice:AdminMainEventSlice,
  AdminServiceSlice:AdminServiceSlice,
ServiceSlice:ServiceSlice,
MarketSLice:MarketSLice,
AdminMarketSLice:AdminMarketSLice,
UtilitisSlice:UtilitisSlice,
socketSlice:socketSlice
 
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["WalletSlice"],
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  // middleware option needs to be provided for avoiding the error. ref: https://redux-toolkit.js.org/usage/usage-guide#use-with-redux-persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },

      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
