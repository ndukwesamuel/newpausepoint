


// import "react-native-gesture-handler";
// import { StatusBar } from "expo-status-bar";
// import {
//   Platform,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   Button,
//   AppState,
//   Alert,
// } from "react-native";
// import Onboading from "./components/Onboard/Onboading";
// import { useFonts } from "expo-font";
// import * as SplashScreen from "expo-splash-screen";
// import * as Notifications from "expo-notifications";

// import React, { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";

// import Constants from "expo-constants";
// import { useCallback } from "react";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { persistor, store } from "./Redux/store";
// import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import Onboarding from "./components/Onboard/Onboading";
// import {
//   NavigationContainer,
//   NavigationProp,
//   useNavigation,
// } from "@react-navigation/native";
// import Auth from "./screens/Auth";
// import Toast from "react-native-toast-message";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import CreatePassword from "./screens/CreatePassword";
// import UserTabNavigation from "./navigation/User/UserTabNavigation";
// import AdminTabNavigation from "./navigation/Admin/AdminTabNavigation";
// import Adminnaviagetion from "./navigation/Admin/Adminnaviagetion";
// import { Usernaviagetion } from "./navigation/User/Usernaviagetion";
// import { UserProfile_data_Fun } from "./Redux/ProfileSlice";
// import { Get_User_Profle_Fun } from "./Redux/UserSide/UserProfileSlice";
// import { notificationservicecode } from "./utils/notificationservice";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import { setOnlineUser, setSocketConnection } from "./Redux/socketSlice";
// import { Linking } from "react-native";
// import { pushtokendata, reset_login } from "./Redux/AuthSlice";

// import * as Device from "expo-device";
// import { API_CONFIG } from "./api";

// import "./hooks/axiosInterceptor";
// import AppAlert from "./navigation/AppAlert";

// // ── Fix: correct path to TermsScreen ─────────────────────────────────────────
// // import TermsScreen, { TERMS_KEY } from "./screens/TermsScreen";

// const queryClient = new QueryClient();
// const Stack = createNativeStackNavigator();

// SplashScreen.preventAutoHideAsync();

// // ── Notification handler — top level ONLY, never inside a component ──────────
// Notifications.setNotificationHandler({
//   handleNotification: async () => {
//     console.log("[NOTIF] Handler triggered — showing alert");
//     return {
//       shouldShowAlert: true,
//       shouldPlaySound: true,
//       shouldSetBadge: true,
//     };
//   },
// });

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     "RobotoSlab-SemiBold": require("./assets/font/RobotoSlab-SemiBold.ttf"),
//     "RobotoSlab-Medium": require("./assets/font/RobotoSlab-Medium.ttf"),
//     "RobotoSlab-Light": require("./assets/font/RobotoSlab-Light.ttf"),
//     "RobotoSlab-Regular": require("./assets/font/RobotoSlab-Regular.ttf"),
//     "Inter-Regular": require("./assets/font/Inter-Regular.ttf"),
//     "Inter-SemiBold": require("./assets/font/Inter-SemiBold.ttf"),
//   });

//   const onLayoutRootView = useCallback(async () => {
//     if (fontsLoaded) {
//       await SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <>
//       <QueryClientProvider client={queryClient}>
//         <Provider store={store}>
//           <PersistGate persistor={persistor}>
//             <SafeAreaProvider style={styles.container}>
//               <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
//                 <NavigationScreen />
//               </View>
//             </SafeAreaProvider>
//           </PersistGate>
//         </Provider>
//       </QueryClientProvider>
//       <Toast />
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export const StartScreen = ({}) => {
//   const { isOnboarding } = useSelector((state) => state.OnboardingSlice);
//   const navigation = useNavigation();
//   return <>{isOnboarding ? <Auth /> : <Onboarding />}</>;
// };

// export const NavigationScreen = () => {
//   const { userDatav2 } = useSelector((state) => state.authSlice);
//   const dispatch = useDispatch();

//   const MainScreen = ({}) => {
//     const navigation = useNavigation();
//     const dispatch = useDispatch();

//     const { userDatav2 } = useSelector((state) => state.authSlice);
//     const { get_user_profile_data } = useSelector(
//       (state) => state.UserProfileSlice,
//     );

//     // ── Terms acceptance state ────────────────────────────────────────────────
//     const [termsChecked, setTermsChecked] = useState(false);
//     const [termsAccepted, setTermsAccepted] = useState(false);

//     useEffect(() => {
//       dispatch(Get_User_Profle_Fun());
//     }, [dispatch]);

//     // ── Notification listeners ────────────────────────────────────────────────
//     useEffect(() => {
//       const backgroundSubscription =
//         Notifications.addNotificationResponseReceivedListener((response) => {
//           console.log("┌─────────────────────────────────────────");
//           console.log("│ [NOTIF] User tapped notification");
//           console.log(`│ Title : ${response.notification.request.content.title}`);
//           console.log(`│ Body  : ${response.notification.request.content.body}`);
//           console.log(`│ Data  : ${JSON.stringify(response.notification.request.content.data)}`);
//           console.log("└─────────────────────────────────────────");
//           const data = response.notification.request.content.data;
//           notificationservicecode(data);
//         });

//       const foregroundSubscription =
//         Notifications.addNotificationReceivedListener(async (notification) => {
//           console.log("┌─────────────────────────────────────────");
//           console.log("│ [NOTIF] Received in foreground");
//           console.log(`│ Title : ${notification.request.content.title}`);
//           console.log(`│ Body  : ${notification.request.content.body}`);
//           console.log(`│ Data  : ${JSON.stringify(notification.request.content.data)}`);
//           console.log("└─────────────────────────────────────────");
//           notificationservicecode(notification?.request?.content?.data);
//         });

//       return () => {
//         backgroundSubscription.remove();
//         foregroundSubscription.remove();
//       };
//     }, []);

//     // ── Check AsyncStorage for terms on mount ─────────────────────────────────
//     useEffect(() => {
//       const checkTerms = async () => {
//         try {
//           const stored = await AsyncStorage.getItem(TERMS_KEY);
//           if (stored) {
//             const parsed = JSON.parse(stored);
//             if (parsed?.accepted) {
//               setTermsAccepted(true);
//             }
//           }
//         } catch (err) {
//           console.error("Error reading terms from storage:", err);
//         } finally {
//           setTermsChecked(true);
//         }
//       };
//       checkTerms();
//     }, []);

//     if (!termsChecked) {
//       return null;
//     }

//     // if (!termsAccepted) {
//     //   return <TermsScreen onAccept={() => setTermsAccepted(true)} />;
//     // }

//     return (
//       <Stack.Navigator
//         initialRouteName="UserNavigation"
//         screenOptions={{ headerShown: false }}
//       >
//         {get_user_profile_data?.data?.AdmincurrentClanMeeting && (
//           <Stack.Screen name="AdminTab" component={Adminnaviagetion} />
//         )}
//         {!get_user_profile_data?.data?.AdmincurrentClanMeeting && (
//           <Stack.Screen name="UserNavigation" component={Usernaviagetion} />
//         )}
//         <Stack.Screen name="CreatePassword" component={CreatePassword} />
//       </Stack.Navigator>
//     );
//   };

//   const { updateInfo } = useUpdateChecker();
//   let forceUpdate = updateInfo?.clientVersion < updateInfo?.currentVersion;

//   return (
//     <NavigationContainer>
//       <AppNotification />
//       <AppAlert />
//       {forceUpdate ? (
//         <UpdateScreen message={updateInfo?.message} />
//       ) : (
//         <>{userDatav2?.data?.token ? <MainScreen /> : <StartScreen />}</>
//       )}
//     </NavigationContainer>
//   );
// };

// export const UpdateScreen = ({ message }) => {
//   const handleUpdate = () => {
//     const url =
//       Platform.OS === "ios"
//         ? "https://apps.apple.com/ng/app/pausepoint/id6739864683"
//         : "https://play.google.com/store/apps/details?id=com.pause_point.PausePoint&hl=en";

//     Linking.openURL(url).catch((err) =>
//       console.error("An error occurred while opening the store link", err),
//     );
//   };

//   return (
//     <View style={updateStyles.container}>
//       <View style={updateStyles.decorativeCircle1} />
//       <View style={updateStyles.decorativeCircle2} />
//       <View style={updateStyles.decorativeCircle3} />
//       <View style={updateStyles.contentCard}>
//         <View style={updateStyles.iconContainer}>
//           <View style={updateStyles.iconInnerCircle}>
//             <Text style={updateStyles.iconEmoji}>🚀</Text>
//           </View>
//         </View>
//         <View style={updateStyles.titleSection}>
//           <Text style={updateStyles.title}>Update Required</Text>
//           <Text style={updateStyles.subtitle}>New version available</Text>
//         </View>
//         <View style={updateStyles.versionBadge}>
//           <View style={updateStyles.versionIcon}>
//             <Text style={updateStyles.versionEmoji}>✨</Text>
//           </View>
//           <Text style={updateStyles.versionText}>Latest Features Inside</Text>
//         </View>
//         <View style={updateStyles.messageSection}>
//           <Text style={updateStyles.messageText}>
//             {message ||
//               "We've added exciting new features and improvements to enhance your experience. Update now to enjoy the latest version!"}
//           </Text>
//         </View>
//         <View style={updateStyles.featuresList}>
//           <View style={updateStyles.featureItem}>
//             <View style={updateStyles.featureBullet}>
//               <Text style={updateStyles.featureBulletText}>✓</Text>
//             </View>
//             <Text style={updateStyles.featureText}>Enhanced Performance</Text>
//           </View>
//           <View style={updateStyles.featureItem}>
//             <View style={updateStyles.featureBullet}>
//               <Text style={updateStyles.featureBulletText}>✓</Text>
//             </View>
//             <Text style={updateStyles.featureText}>New Features & Tools</Text>
//           </View>
//           <View style={updateStyles.featureItem}>
//             <View style={updateStyles.featureBullet}>
//               <Text style={updateStyles.featureBulletText}>✓</Text>
//             </View>
//             <Text style={updateStyles.featureText}>Security Improvements</Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           style={updateStyles.updateButton}
//           onPress={handleUpdate}
//           activeOpacity={0.8}
//         >
//           <Text style={updateStyles.updateButtonText}>Update Now</Text>
//           <View style={updateStyles.updateButtonIcon}>
//             <Text style={updateStyles.updateButtonArrow}>→</Text>
//           </View>
//         </TouchableOpacity>
//         <Text style={updateStyles.footerNote}>
//           This update is required to continue using the app
//         </Text>
//       </View>
//       <View style={updateStyles.bottomDecor}>
//         <View style={updateStyles.decorativeDot1} />
//         <View style={updateStyles.decorativeDot2} />
//         <View style={updateStyles.decorativeDot3} />
//       </View>
//     </View>
//   );
// };

// const updateStyles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, position: "relative" },
//   decorativeCircle1: { position: "absolute", top: 60, right: 30, width: 140, height: 140, borderRadius: 70, backgroundColor: "#D1FAE5", opacity: 0.4 },
//   decorativeCircle2: { position: "absolute", bottom: 100, left: 20, width: 100, height: 100, borderRadius: 50, backgroundColor: "#DBEAFE", opacity: 0.4 },
//   decorativeCircle3: { position: "absolute", top: "40%", left: 10, width: 60, height: 60, borderRadius: 30, backgroundColor: "#FEF3C7", opacity: 0.5 },
//   contentCard: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 32, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, maxWidth: 440, width: "100%", zIndex: 1 },
//   iconContainer: { marginBottom: 24 },
//   iconInnerCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "#10B981" },
//   iconEmoji: { fontSize: 48 },
//   titleSection: { alignItems: "center", marginBottom: 20 },
//   title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8, letterSpacing: 0.3, textAlign: "center" },
//   subtitle: { fontSize: 15, fontWeight: "600", color: "#10B981", letterSpacing: 0.3 },
//   versionBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginBottom: 24 },
//   versionIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginRight: 10 },
//   versionEmoji: { fontSize: 16 },
//   versionText: { fontSize: 14, fontWeight: "700", color: "#92400E", letterSpacing: 0.3 },
//   messageSection: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: "#10B981" },
//   messageText: { fontSize: 14, fontWeight: "500", color: "#374151", lineHeight: 22, textAlign: "center" },
//   featuresList: { width: "100%", marginBottom: 28, gap: 12 },
//   featureItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12 },
//   featureBullet: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", marginRight: 12 },
//   featureBulletText: { fontSize: 14, fontWeight: "700", color: "#10B981" },
//   featureText: { fontSize: 14, fontWeight: "600", color: "#374151", letterSpacing: 0.3 },
//   updateButton: { backgroundColor: "#10B981", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, shadowColor: "#10B981", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8, marginBottom: 16, width: "100%" },
//   updateButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3, marginRight: 12 },
//   updateButtonIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
//   updateButtonArrow: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
//   footerNote: { fontSize: 12, fontWeight: "500", color: "#9CA3AF", textAlign: "center", lineHeight: 18 },
//   bottomDecor: { position: "absolute", bottom: 40, flexDirection: "row", gap: 12 },
//   decorativeDot1: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981", opacity: 0.6 },
//   decorativeDot2: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6", opacity: 0.6 },
//   decorativeDot3: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#F59E0B", opacity: 0.6 },
// });

// export const useUpdateChecker = (checkInterval = 60000) => {
//   const [forceUpdate, setForceUpdate] = useState(false);
//   const [updateInfo, setUpdateInfo] = useState(null);

//   const version = Constants.expoConfig?.version;
//   let url = `${API_BASEURL}checkversion?version=${version}`;

//   const checkForUpdates = async () => {
//     try {
//       const response = await fetch(url);
//       const data = await response.json();
//       setUpdateInfo(data);
//     } catch (error) {
//       console.error("Error checking for updates:", error);
//     }
//   };

//   useEffect(() => {
//     checkForUpdates();
//     const interval = setInterval(checkForUpdates, checkInterval);
//     return () => clearInterval(interval);
//   }, [checkInterval]);

//   return { updateInfo };
// };

// // ── Notification handler must be at top level — already set above ─────────────

// export function AppNotification() {
//   const dispatch = useDispatch();
//   const [expoPushToken, setExpoPushToken] = useState("");
//   const [notification, setNotification] = useState(undefined);
//   const notificationListener = useRef();
//   const responseListener = useRef();
//   const appState = useRef(AppState.currentState);

//   const storePushToken = async (token) => {
//     try {
//       await AsyncStorage.setItem("PushToken", token);
//       console.log("[NOTIF] Push token saved to AsyncStorage");
//     } catch (error) {
//       console.error("[NOTIF] Error saving push token:", error);
//     }
//   };

//   useEffect(() => {
//     console.log("[NOTIF] Registering for push notifications...");

//     const registerPushNotifications = async () => {
//       const token = await registerForPushNotificationsAsync();

//       if (token) {
//         storePushToken(token);
//         setExpoPushToken(token);
//         dispatch(pushtokendata(token));
//       }

//       console.log("┌─────────────────────────────────────────");
//       console.log("│ [NOTIF] Push Token Registration");
//       console.log(`│ Token   : ${token || "FAILED — no token"}`);
//       console.log(`│ Device  : ${Device.modelName || "Unknown"}`);
//       console.log(`│ OS      : ${Platform.OS} ${Platform.Version}`);
//       console.log(`│ Physical: ${Device.isDevice}`);
//       console.log("└─────────────────────────────────────────");
//     };

//     registerPushNotifications();

//     const appStateSubscription = AppState.addEventListener(
//       "change",
//       (nextAppState) => {
//         console.log(`[NOTIF] App state: ${appState.current} → ${nextAppState}`);
//         appState.current = nextAppState;
//       },
//     );

//     notificationListener.current =
//       Notifications.addNotificationReceivedListener((notification) => {
//         console.log("┌─────────────────────────────────────────");
//         console.log("│ [NOTIF] Notification received (foreground)");
//         console.log(`│ Title : ${notification.request.content.title}`);
//         console.log(`│ Body  : ${notification.request.content.body}`);
//         console.log(`│ Data  : ${JSON.stringify(notification.request.content.data)}`);
//         console.log(`│ ID    : ${notification.request.identifier}`);
//         console.log("└─────────────────────────────────────────");
//         setNotification(notification);
//       });

//     responseListener.current =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         console.log("┌─────────────────────────────────────────");
//         console.log("│ [NOTIF] User tapped notification");
//         console.log(`│ Title : ${response.notification.request.content.title}`);
//         console.log(`│ Body  : ${response.notification.request.content.body}`);
//         console.log(`│ Data  : ${JSON.stringify(response.notification.request.content.data)}`);
//         console.log(`│ Action: ${response.actionIdentifier}`);
//         console.log("└─────────────────────────────────────────");
//       });

//     return () => {
//       // ── Fix: use .remove() instead of Notifications.removeNotificationSubscription ──
//       if (notificationListener.current) notificationListener.current.remove();
//       if (responseListener.current) responseListener.current.remove();
//       if (appStateSubscription) appStateSubscription.remove();
//     };
//   }, [dispatch]);

//   return null;
// }

// async function registerForPushNotificationsAsync() {
//   let token;

//   if (Platform.OS === "android") {
//     console.log("[NOTIF] Setting up Android notification channel...");
//     await Notifications.setNotificationChannelAsync("default", {
//       name: "Default Channel",
//       importance: Notifications.AndroidImportance.MAX,
//       vibrationPattern: [0, 250, 250, 250],
//       lightColor: "#FF231F7C",
//     });
//     console.log("[NOTIF] Android channel created");
//   }

//   if (Device.isDevice) {
//     console.log("[NOTIF] Physical device detected — checking permissions...");
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     console.log(`[NOTIF] Current permission status: ${existingStatus}`);

//     let finalStatus = existingStatus;
//     if (existingStatus !== "granted") {
//       console.log("[NOTIF] Requesting permission...");
//       const { status } = await Notifications.requestPermissionsAsync({
//         ios: {
//           allowAlert: true,
//           allowBadge: true,
//           allowSound: true,
//           allowAnnouncements: true,
//         },
//       });
//       finalStatus = status;
//       console.log(`[NOTIF] Permission result: ${finalStatus}`);
//     }

//     if (finalStatus !== "granted") {
//       console.error("[NOTIF] Permission NOT granted");
//       Alert.alert(
//         "Notifications Disabled",
//         "Please enable notifications in your device settings to receive important updates.",
//       );
//       return;
//     }

//     console.log("[NOTIF] Permission granted — getting push token...");
//     try {
//       const projectId =
//         Constants?.expoConfig?.extra?.eas?.projectId ??
//         Constants?.easConfig?.projectId;

//       if (!projectId) {
//         throw new Error("Project ID not found in app config");
//       }

//       console.log(`[NOTIF] Project ID: ${projectId}`);

//       token = (
//         await Notifications.getExpoPushTokenAsync({ projectId })
//       ).data;

//       console.log("[NOTIF] Token acquired successfully");
//     } catch (e) {
//       console.error("┌─────────────────────────────────────────");
//       console.error("│ [NOTIF] Failed to get push token");
//       console.error(`│ Error: ${e.message || e}`);
//       console.error("└─────────────────────────────────────────");
//       token = `${e}`;
//     }
//   } else {
//     console.warn("[NOTIF] Not a physical device — push notifications unavailable");
//     Alert.alert(
//       "Physical Device Required",
//       "Push notifications only work on physical devices, not simulators.",
//     );
//   }

//   return token;
// }



import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  AppState,
  Alert,
} from "react-native";
import Onboading from "./components/Onboard/Onboading";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";

import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

import Constants from "expo-constants";
import { useCallback } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Redux/store";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Onboarding from "./components/Onboard/Onboading";
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
import { Linking } from "react-native";
import { pushtokendata, reset_login } from "./Redux/AuthSlice";

import * as Device from "expo-device";
import { API_CONFIG } from "./api";

import "./hooks/axiosInterceptor";
import AppAlert from "./navigation/AppAlert";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync();

// ── Notification handler — top level only ────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log("[NOTIF] Handler triggered — showing alert");
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

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
    <>
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
      <Toast />
    </>
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

export const NavigationScreen = () => {
  const { userDatav2 } = useSelector((state) => state.authSlice);
  const dispatch = useDispatch();

  const MainScreen = ({}) => {
    const dispatch = useDispatch();
    const { get_user_profile_data } = useSelector(
      (state) => state.UserProfileSlice,
    );

    useEffect(() => {
      dispatch(Get_User_Profle_Fun());
    }, [dispatch]);

    // ── Notification listeners ────────────────────────────────────────────────
    useEffect(() => {
      const backgroundSubscription =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log("┌─────────────────────────────────────────");
          console.log("│ [NOTIF] User tapped notification");
          console.log(`│ Title : ${response.notification.request.content.title}`);
          console.log(`│ Body  : ${response.notification.request.content.body}`);
          console.log(`│ Data  : ${JSON.stringify(response.notification.request.content.data)}`);
          console.log("└─────────────────────────────────────────");
          const data = response.notification.request.content.data;
          notificationservicecode(data);
        });

      const foregroundSubscription =
        Notifications.addNotificationReceivedListener(async (notification) => {
          console.log("┌─────────────────────────────────────────");
          console.log("│ [NOTIF] Received in foreground");
          console.log(`│ Title : ${notification.request.content.title}`);
          console.log(`│ Body  : ${notification.request.content.body}`);
          console.log(`│ Data  : ${JSON.stringify(notification.request.content.data)}`);
          console.log("└─────────────────────────────────────────");
          notificationservicecode(notification?.request?.content?.data);
        });

      return () => {
        backgroundSubscription.remove();
        foregroundSubscription.remove();
      };
    }, []);

    return (
      <Stack.Navigator
        initialRouteName="UserNavigation"
        screenOptions={{ headerShown: false }}
      >
        {get_user_profile_data?.data?.AdmincurrentClanMeeting && (
          <Stack.Screen name="AdminTab" component={Adminnaviagetion} />
        )}
        {!get_user_profile_data?.data?.AdmincurrentClanMeeting && (
          <Stack.Screen name="UserNavigation" component={Usernaviagetion} />
        )}
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
      </Stack.Navigator>
    );
  };

  const { updateInfo } = useUpdateChecker();
  let forceUpdate = updateInfo?.clientVersion < updateInfo?.currentVersion;

  return (
    <NavigationContainer>
      <AppNotification />
      <AppAlert />
      {forceUpdate ? (
        <UpdateScreen message={updateInfo?.message} />
      ) : (
        <>{userDatav2?.data?.token ? <MainScreen /> : <StartScreen />}</>
      )}
    </NavigationContainer>
  );
};

export const UpdateScreen = ({ message }) => {
  const handleUpdate = () => {
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/ng/app/pausepoint/id6739864683"
        : "https://play.google.com/store/apps/details?id=com.pause_point.PausePoint&hl=en";
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred while opening the store link", err),
    );
  };

  return (
    <View style={updateStyles.container}>
      <View style={updateStyles.decorativeCircle1} />
      <View style={updateStyles.decorativeCircle2} />
      <View style={updateStyles.decorativeCircle3} />
      <View style={updateStyles.contentCard}>
        <View style={updateStyles.iconContainer}>
          <View style={updateStyles.iconInnerCircle}>
            <Text style={updateStyles.iconEmoji}>🚀</Text>
          </View>
        </View>
        <View style={updateStyles.titleSection}>
          <Text style={updateStyles.title}>Update Required</Text>
          <Text style={updateStyles.subtitle}>New version available</Text>
        </View>
        <View style={updateStyles.versionBadge}>
          <View style={updateStyles.versionIcon}>
            <Text style={updateStyles.versionEmoji}>✨</Text>
          </View>
          <Text style={updateStyles.versionText}>Latest Features Inside</Text>
        </View>
        <View style={updateStyles.messageSection}>
          <Text style={updateStyles.messageText}>
            {message ||
              "We've added exciting new features and improvements to enhance your experience. Update now to enjoy the latest version!"}
          </Text>
        </View>
        <View style={updateStyles.featuresList}>
          <View style={updateStyles.featureItem}>
            <View style={updateStyles.featureBullet}>
              <Text style={updateStyles.featureBulletText}>✓</Text>
            </View>
            <Text style={updateStyles.featureText}>Enhanced Performance</Text>
          </View>
          <View style={updateStyles.featureItem}>
            <View style={updateStyles.featureBullet}>
              <Text style={updateStyles.featureBulletText}>✓</Text>
            </View>
            <Text style={updateStyles.featureText}>New Features & Tools</Text>
          </View>
          <View style={updateStyles.featureItem}>
            <View style={updateStyles.featureBullet}>
              <Text style={updateStyles.featureBulletText}>✓</Text>
            </View>
            <Text style={updateStyles.featureText}>Security Improvements</Text>
          </View>
        </View>
        <TouchableOpacity
          style={updateStyles.updateButton}
          onPress={handleUpdate}
          activeOpacity={0.8}
        >
          <Text style={updateStyles.updateButtonText}>Update Now</Text>
          <View style={updateStyles.updateButtonIcon}>
            <Text style={updateStyles.updateButtonArrow}>→</Text>
          </View>
        </TouchableOpacity>
        <Text style={updateStyles.footerNote}>
          This update is required to continue using the app
        </Text>
      </View>
      <View style={updateStyles.bottomDecor}>
        <View style={updateStyles.decorativeDot1} />
        <View style={updateStyles.decorativeDot2} />
        <View style={updateStyles.decorativeDot3} />
      </View>
    </View>
  );
};

const updateStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", paddingHorizontal: 20, position: "relative" },
  decorativeCircle1: { position: "absolute", top: 60, right: 30, width: 140, height: 140, borderRadius: 70, backgroundColor: "#D1FAE5", opacity: 0.4 },
  decorativeCircle2: { position: "absolute", bottom: 100, left: 20, width: 100, height: 100, borderRadius: 50, backgroundColor: "#DBEAFE", opacity: 0.4 },
  decorativeCircle3: { position: "absolute", top: "40%", left: 10, width: 60, height: 60, borderRadius: 30, backgroundColor: "#FEF3C7", opacity: 0.5 },
  contentCard: { backgroundColor: "#FFFFFF", borderRadius: 24, padding: 32, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10, maxWidth: 440, width: "100%", zIndex: 1 },
  iconContainer: { marginBottom: 24 },
  iconInnerCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", borderWidth: 4, borderColor: "#10B981" },
  iconEmoji: { fontSize: 48 },
  titleSection: { alignItems: "center", marginBottom: 20 },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8, letterSpacing: 0.3, textAlign: "center" },
  subtitle: { fontSize: 15, fontWeight: "600", color: "#10B981", letterSpacing: 0.3 },
  versionBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 16, marginBottom: 24 },
  versionIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#FFFFFF", justifyContent: "center", alignItems: "center", marginRight: 10 },
  versionEmoji: { fontSize: 16 },
  versionText: { fontSize: 14, fontWeight: "700", color: "#92400E", letterSpacing: 0.3 },
  messageSection: { backgroundColor: "#F9FAFB", padding: 16, borderRadius: 12, marginBottom: 24, borderLeftWidth: 4, borderLeftColor: "#10B981" },
  messageText: { fontSize: 14, fontWeight: "500", color: "#374151", lineHeight: 22, textAlign: "center" },
  featuresList: { width: "100%", marginBottom: 28, gap: 12 },
  featureItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#F9FAFB", padding: 12, borderRadius: 12 },
  featureBullet: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center", marginRight: 12 },
  featureBulletText: { fontSize: 14, fontWeight: "700", color: "#10B981" },
  featureText: { fontSize: 14, fontWeight: "600", color: "#374151", letterSpacing: 0.3 },
  updateButton: { backgroundColor: "#10B981", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16, shadowColor: "#10B981", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8, marginBottom: 16, width: "100%" },
  updateButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700", letterSpacing: 0.3, marginRight: 12 },
  updateButtonIcon: { width: 32, height: 32, borderRadius: 16, backgroundColor: "rgba(255, 255, 255, 0.2)", justifyContent: "center", alignItems: "center" },
  updateButtonArrow: { color: "#FFFFFF", fontSize: 20, fontWeight: "700" },
  footerNote: { fontSize: 12, fontWeight: "500", color: "#9CA3AF", textAlign: "center", lineHeight: 18 },
  bottomDecor: { position: "absolute", bottom: 40, flexDirection: "row", gap: 12 },
  decorativeDot1: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#10B981", opacity: 0.6 },
  decorativeDot2: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6", opacity: 0.6 },
  decorativeDot3: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#F59E0B", opacity: 0.6 },
});

export const useUpdateChecker = (checkInterval = 60000) => {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [updateInfo, setUpdateInfo] = useState(null);
  const version = Constants.expoConfig?.version;
  let url = `${API_BASEURL}checkversion?version=${version}`;

  const checkForUpdates = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      setUpdateInfo(data);
    } catch (error) {
      console.error("Error checking for updates:", error);
    }
  };

  useEffect(() => {
    checkForUpdates();
    const interval = setInterval(checkForUpdates, checkInterval);
    return () => clearInterval(interval);
  }, [checkInterval]);

  return { updateInfo };
};

export function AppNotification() {
  const dispatch = useDispatch();
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(undefined);
  const notificationListener = useRef();
  const responseListener = useRef();
  const appState = useRef(AppState.currentState);

  const storePushToken = async (token) => {
    try {
      await AsyncStorage.setItem("PushToken", token);
      console.log("[NOTIF] Push token saved to AsyncStorage");
    } catch (error) {
      console.error("[NOTIF] Error saving push token:", error);
    }
  };

  useEffect(() => {
    console.log("[NOTIF] Registering for push notifications...");

    const registerPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        storePushToken(token);
        setExpoPushToken(token);
        dispatch(pushtokendata(token));
      }
      console.log("┌─────────────────────────────────────────");
      console.log("│ [NOTIF] Push Token Registration");
      console.log(`│ Token   : ${token || "FAILED — no token"}`);
      console.log(`│ Device  : ${Device.modelName || "Unknown"}`);
      console.log(`│ OS      : ${Platform.OS} ${Platform.Version}`);
      console.log(`│ Physical: ${Device.isDevice}`);
      console.log("└─────────────────────────────────────────");
    };

    registerPushNotifications();

    const appStateSubscription = AppState.addEventListener(
      "change",
      (nextAppState) => {
        console.log(`[NOTIF] App state: ${appState.current} → ${nextAppState}`);
        appState.current = nextAppState;
      },
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("┌─────────────────────────────────────────");
        console.log("│ [NOTIF] Notification received (foreground)");
        console.log(`│ Title : ${notification.request.content.title}`);
        console.log(`│ Body  : ${notification.request.content.body}`);
        console.log(`│ Data  : ${JSON.stringify(notification.request.content.data)}`);
        console.log(`│ ID    : ${notification.request.identifier}`);
        console.log("└─────────────────────────────────────────");
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("┌─────────────────────────────────────────");
        console.log("│ [NOTIF] User tapped notification");
        console.log(`│ Title : ${response.notification.request.content.title}`);
        console.log(`│ Body  : ${response.notification.request.content.body}`);
        console.log(`│ Data  : ${JSON.stringify(response.notification.request.content.data)}`);
        console.log(`│ Action: ${response.actionIdentifier}`);
        console.log("└─────────────────────────────────────────");
      });

    return () => {
      if (notificationListener.current) notificationListener.current.remove();
      if (responseListener.current) responseListener.current.remove();
      if (appStateSubscription) appStateSubscription.remove();
    };
  }, [dispatch]);

  return null;
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    console.log("[NOTIF] Setting up Android notification channel...");
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
    console.log("[NOTIF] Android channel created");
  }

  if (Device.isDevice) {
    console.log("[NOTIF] Physical device detected — checking permissions...");
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log(`[NOTIF] Current permission status: ${existingStatus}`);

    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      console.log("[NOTIF] Requesting permission...");
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      finalStatus = status;
      console.log(`[NOTIF] Permission result: ${finalStatus}`);
    }

    if (finalStatus !== "granted") {
      console.error("[NOTIF] Permission NOT granted");
      Alert.alert(
        "Notifications Disabled",
        "Please enable notifications in your device settings to receive important updates.",
      );
      return;
    }

    console.log("[NOTIF] Permission granted — getting push token...");
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;

      if (!projectId) {
        throw new Error("Project ID not found in app config");
      }

      console.log(`[NOTIF] Project ID: ${projectId}`);

      token = (
        await Notifications.getExpoPushTokenAsync({ projectId })
      ).data;

      console.log("[NOTIF] Token acquired successfully");
    } catch (e) {
      console.error("┌─────────────────────────────────────────");
      console.error("│ [NOTIF] Failed to get push token");
      console.error(`│ Error: ${e.message || e}`);
      console.error("└─────────────────────────────────────────");
      token = `${e}`;
    }
  } else {
    console.warn("[NOTIF] Not a physical device — push notifications unavailable");
    Alert.alert(
      "Physical Device Required",
      "Push notifications only work on physical devices, not simulators.",
    );
  }

  return token;
}