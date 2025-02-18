import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, Text, View } from "react-native";
import Onboading from "./components/Onboard/Onboading ";
import AppNavigation, { RootStackParamList } from "./navigation/AppNavigation";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

import Constants from "expo-constants";
import { useCallback } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { QueryClient, QueryClientProvider } from "react-query";
import Onboarding from "./components/Onboard/Onboading ";
import LoginScreen from "./screens/LoginScreen";
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import Auth from "./screens/Auth";
import Toast from "react-native-toast-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatePassword from "./screens/CreatePassword";
import UserTabNavigation from "./navigation/User/UserTabNavigation";
import AdminTabNavigation from "./navigation/Admin/AdminTabNavigation";
import Adminnaviagetion from "./navigation/Admin/Adminnaviagetion";
import { Usernaviagetion } from "./navigation/User/Usernaviagetion";
import { UserProfile_data_Fun } from "./Redux/ProfileSlice";
import { Get_User_Profle_Fun } from "./Redux/UserSide/UserProfileSlice";
import { notificationservicecode } from "./utils/notificationservice";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { setOnlineUser, setSocketConnection } from "./Redux/socketSlice";

const queryClient = new QueryClient();

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontsLoaded] = useFonts({
    "RobotoSlab-SemiBold": require("./assets/font/RobotoSlab-SemiBold.ttf"),
    "RobotoSlab-Medium": require("./assets/font/RobotoSlab-Medium.ttf"),
    "RobotoSlab-Light": require("./assets/font/RobotoSlab-Light.ttf"),
    "RobotoSlab-Regular": require("./assets/font/RobotoSlab-Regular.ttf"),
    "Inter-Regular": require("./assets/font/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./assets/font/Inter-SemiBold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <SafeAreaProvider style={styles.container}>
            <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
              <NavigationScreen />
            </View>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const StartScreen = ({}) => {
  const { isOnboarding } = useSelector((state) => state.OnboardingSlice);
  const navigation = useNavigation();

  return <>{isOnboarding ? <Auth /> : <Onboarding />}</>;
};

export const MainScreen = ({}) => {
  const { isOnboarding } = useSelector((state) => state.OnboardingSlice);
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);
  const datasss = useSelector((state) => state.UserProfileSlice);
  const isAdmin = user_data?.user?.roles?.includes("admin");

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  const [pushToken, setPushToken] = useState();

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    dispatch(Get_User_Profle_Fun());

    // async function getNotificationPermission() {
    //   const { status } = await Notifications.getPermissionsAsync();
    //   if (status !== "granted") {
    //     const { status } = await Notifications.requestPermissionsAsync();
    //   }
    //   if (status !== "granted") {
    //     // Handle the case where the user declines permission
    //     console.log("Failed to get push token for push notification!");
    //     return;
    //   }
    //   let token;
    //   token = (
    //     await Notifications.getExpoPushTokenAsync({
    //       projectId: Constants.expoConfig.extra.eas.projectId,
    //     })
    //   ).data;

    //   console.log({ first_token: token });
    //   // Permission granted, handle accordingly
    //   await AsyncStorage.setItem("PushToken", token);
    //   const value = await AsyncStorage.getItem("PushToken");

    //   console.log({ value });
    //   // setPushToken(value);
    // }

    // getNotificationPermission();
    // getNotificationPermission();
  }, [dispatch]);

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log({ response });

        const data = response.notification.request.content.data;
        // dispatch(NotificationDataModalFunC(true));

        // dispatch(NotificationDataFunC(response));
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        // console.log({ notification });
        // console.log({ yyynotification2: notification?.request });

        // console.log({ zzznotification2: notification?.request?.content?.data });

        // if (Platform.OS === "android") {
        //   console.log({ andriod: notification });
        //   emargencysong();
        // }

        notificationservicecode(notification?.request?.content?.data);

        // dispatch(NotificationDataModalFunC(true));
        // dispatch(NotificationDataFunC(notification));
      });

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  // console.log({
  //   ddd: user_data,
  //   API_BASEURL,
  // });

  useEffect(() => {
    const socketConnection = io(API_BASEURL, {
      auth: {
        token: user_data?.token,
      },
    });

    socketConnection.on("onlineUser", (data) => {
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, []);
  return (
    <Stack.Navigator
      initialRouteName="UserNavigation"
      screenOptions={{ headerShown: false }}
    >
      {/* <Stack.Screen name="Welcome" component={Onboarding} />
                <Stack.Screen name="Registraion" component={Registraion} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Forgotten" component={ForgottenPasswod} />
                <Stack.Screen name="OTP" component={OTP} />
                <Stack.Screen name="CreatePassword" component={CreatePassword} /> */}
      {/* <Stack.Screen name="usertab" component={UserTabNavigation} />
                <Stack.Screen name="PersonalInfo" component={EditPersonalInformation} />
                <Stack.Screen name="notificationsettings" component={NotificatioSettings} />
                <Stack.Screen name="ChangePassowrd" component={ChangePassowrd} />
                <Stack.Screen name="DeleteAccount" component={DeleteAccount} /> */}
      {/* 
      {isAdmin ?
        <Stack.Screen name="usertab" component={AdminTabNavigation} />
        : <Stack.Screen name="usertab" component={UserTabNavigation} />
      } */}
      {userProfile_data?.AdmincurrentClanMeeting && (
        <Stack.Screen name="AdminTab" component={Adminnaviagetion} />
      )}
      {!userProfile_data?.AdmincurrentClanMeeting && (
        <Stack.Screen name="UserNavigation" component={Usernaviagetion} />
      )}
      <Stack.Screen name="CreatePassword" component={CreatePassword} />
    </Stack.Navigator>
  );
};

export const NavigationScreen = () => {
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  const dispatch = useDispatch();

  console.log({
    ffggg: user_data,
  });

  useEffect(() => {
    // dispatch(UserProfile_data_Fun());
    // dispatch(Get_User_Profle_Fun());

    async function getNotificationPermission() {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
      }
      if (status !== "granted") {
        // Handle the case where the user declines permission
        // console.log("Failed to get push token for push notification!");
        return;
      }
      let token;
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig.extra.eas.projectId,
        })
      ).data;
      // token = (
      //   await Notifications.getExpoPushTokenAsync({
      //     projectId: Constants.expoConfig.extra.eas.projectId,
      //   })
      // ).data;

      // console.log({ first_token: token });
      // Permission granted, handle accordingly
      await AsyncStorage.setItem("PushToken", token);
      const value = await AsyncStorage.getItem("PushToken");

      // console.log({ value });
      // setPushToken(value);
    }

    getNotificationPermission();
    // getNotificationPermission();
  }, [dispatch]);

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log({ response });

        const data = response.notification.request.content.data;
        // dispatch(NotificationDataModalFunC(true));

        // dispatch(NotificationDataFunC(response));
      });

    const foregroundSubscription =
      Notifications.addNotificationReceivedListener((notification) => {
        // console.log({ notification });
        // dispatch(NotificationDataModalFunC(true));
        // dispatch(NotificationDataFunC(notification));
      });

    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  // console.log({ user_data });
  return (
    <NavigationContainer>
      {/* <StartScreen /> */}
      {user_data?.token && <MainScreen />}
      {!user_data?.token && <StartScreen />}
      <Toast />
    </NavigationContainer>
  );
};
