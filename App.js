import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  AppState,
  Modal,
} from "react-native";
import Onboading from "./components/Onboard/Onboading";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import React, { useEffect, useState, useRef, useCallback } from "react";

import Constants from "expo-constants";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./Redux/store";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Onboarding from "./components/Onboard/Onboading";
import {
  NavigationContainer,
  useNavigation,
} from "@react-navigation/native";
import Auth from "./screens/Auth";
import Toast from "react-native-toast-message";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatePassword from "./screens/CreatePassword";
import Adminnaviagetion from "./navigation/Admin/Adminnaviagetion";
import { Usernaviagetion } from "./navigation/User/Usernaviagetion";
import { Get_User_Profle_Fun } from "./Redux/UserSide/UserProfileSlice";
import { notificationservicecode } from "./utils/notificationservice";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import { Linking } from "react-native";
import { pushtokendata, reset_login } from "./Redux/AuthSlice";
import * as Device from "expo-device";
import { API_CONFIG } from "./api";

import "./hooks/axiosInterceptor";
import AppAlert from "./navigation/AppAlert";

const queryClient = new QueryClient();
const Stack = createNativeStackNavigator();
const TERMS_KEY = "pausepoint_terms_accepted_v1";

SplashScreen.preventAutoHideAsync();

// ── Notification handler ───────────────────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ── Terms Screen ───────────────────────────────────────────────────────────
const TERMS_TEXT = `PAUSEPOINT APP – TERMS AND CONDITIONS
Effective Date: April 2026

Welcome to the Pausepoint App ("App"), a proptech platform operated by PG Works Services Ltd trading as Pausepoint ("Pausepoint", "we", "us", or "our").

By downloading, installing, registering an account, or using the Pausepoint mobile application and any related services (collectively the "Service"), you agree to be legally bound by these Terms and Conditions. If you do not agree, you must not use the Service.

1. ACCEPTANCE OF TERMS
These Terms constitute a legally binding agreement between you and Pausepoint. Your continued use of the Service after any updates means you accept the revised Terms.

2. DESCRIPTION OF THE SERVICE
Pausepoint is an all-in-one estate management platform for gated residential communities. The Service includes, but is not limited to:
• Visitor access code generation (including multi-entry codes)
• Compulsory user profile pictures for identity verification
• Electronic payments for estate dues, electricity, and other bills
• Emergency Alerts
• Service requests for verified artisans
• Community announcements and emergency alerts
• Access and visitor history logs
• Household grouping for dues collection
• Errand services (using Pausepoint-provided bicycles)
• Amenities booking (e.g., hall, gym, pool, etc.)
• Marketplace for goods and services within the estate
• Domestic staff registration and permanent access codes
• Polls and community voting
• Any additional or future features we may introduce

3. ACCOUNT CREATION AND ESTATE VERIFICATION
Anyone may download and create a basic account. However, full access to estate-specific features is restricted until you join your estate and the administrator approves your request.

4. VISITOR ACCESS CODES AND GUEST LIABILITY
When you generate and share any visitor access code, you take full and sole responsibility for every person you invite into the estate. Pausepoint, the estate management, and security personnel shall not be liable for any actions, damage, loss, injury, theft, or incident caused by your guest. Multi-entry codes expire after 7 days.

5. DOMESTIC STAFF REGISTRATION AND PERMANENT CODES
By registering domestic staff and issuing a permanent code, you confirm that you take full responsibility for the conduct and actions of such staff while inside the estate.

6. ERRAND SERVICES
Pausepoint only facilitates the connection and provides the bicycle. We are not responsible for the quality, timeliness, outcome of the errand, or for any loss, damage, or injury arising from the errand service.

7. OTHER FEATURES
• Amenities Booking: Subject to availability and estate rules.
• Marketplace: All transactions occur directly between users. Pausepoint is not responsible for quality, safety, delivery, or disputes.
• Artisan Services: Pausepoint only facilitates the connection. We do not employ artisans and are not responsible for their work.
• Polls and Announcements: Content you post must be lawful and respectful.

8. PRICING AND SUBSCRIPTION
Subscription fees and payment terms are determined by agreement between Pausepoint and each individual estate.

9. PAYMENTS AND BILL COLLECTION
Pausepoint acts only as a payment facilitator. Any dispute regarding amounts owed must be resolved directly with the estate management or relevant provider.

10. DATA PROTECTION AND PRIVACY
We are registered with the Nigeria Data Protection Commission (NDPC) and process your personal data in accordance with the Nigeria Data Protection Act 2023.

11. USER CONDUCT AND PROHIBITED ACTIVITIES
You agree not to misuse the App, generate codes for unlawful purposes, post harmful content, or interfere with the Service.

12. INTELLECTUAL PROPERTY
All rights in the Pausepoint App and its content belong to PG Works Services Ltd.

13. LIMITATION OF LIABILITY
To the fullest extent permitted by law, Pausepoint shall not be liable for any indirect, consequential, or punitive damages arising from your use of the Service.

14. TERMINATION
You may stop using the Service at any time. We may suspend or terminate your access for breach of these Terms.

15. CHANGES TO TERMS OR SERVICE
We may modify these Terms at any time. Continued use after notification constitutes acceptance.

16. GOVERNING LAW
These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State.

17. CONTACT US
Kazeem Oyelakin – CEO
Pausepoint (PG Works Services Ltd)
Phone: +234 901 926 9787 | +234 813 167 7842
Website: www.pausepoint.net`;

const TermsScreen = ({ onAccept }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isAtBottom) setScrolledToBottom(true);
  };

  return (
    <View style={termsStyles.container}>
      <View style={termsStyles.header}>
        <View style={termsStyles.logoWrap}>
          <MaterialCommunityIcons name="shield-check" size={32} color="#10B981" />
        </View>
        <Text style={termsStyles.headerTitle}>Terms & Conditions</Text>
        <Text style={termsStyles.headerSubtitle}>
          Please read and accept before continuing
        </Text>
      </View>

      {!scrolledToBottom && (
        <View style={termsStyles.scrollHint}>
          <MaterialCommunityIcons name="arrow-down" size={14} color="#92400E" />
          <Text style={termsStyles.scrollHintText}>
            Scroll to the bottom to accept
          </Text>
        </View>
      )}

      <ScrollView
        style={termsStyles.scrollView}
        contentContainerStyle={termsStyles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={true}
      >
        <Text style={termsStyles.termsText}>{TERMS_TEXT}</Text>
      </ScrollView>

      <View style={termsStyles.footer}>
        <TouchableOpacity
          style={[
            termsStyles.acceptButton,
            !scrolledToBottom && termsStyles.acceptButtonDisabled,
          ]}
          onPress={onAccept}
          disabled={!scrolledToBottom}
          activeOpacity={0.85}
        >
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={termsStyles.acceptButtonText}>
            {scrolledToBottom
              ? "I Accept the Terms & Conditions"
              : "Read all terms to continue"}
          </Text>
        </TouchableOpacity>
        <Text style={termsStyles.footerNote}>
          By accepting you agree to be bound by these terms. This cannot be
          undone without reinstalling the app.
        </Text>
      </View>
    </View>
  );
};

const termsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    elevation: 3,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    paddingVertical: 8,
  },
  scrollHintText: { fontSize: 12, fontWeight: "600", color: "#92400E" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  termsText: { fontSize: 13, color: "#374151", lineHeight: 22 },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    elevation: 5,
  },
  acceptButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 4,
  },
  acceptButtonDisabled: { backgroundColor: "#9CA3AF", elevation: 0 },
  acceptButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700", letterSpacing: 0.3 },
  footerNote: { fontSize: 11, color: "#9CA3AF", textAlign: "center", lineHeight: 16 },
});

// ── App ────────────────────────────────────────────────────────────────────
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
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

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

const styles = StyleSheet.create({ container: { flex: 1 } });

// ── StartScreen ────────────────────────────────────────────────────────────
export const StartScreen = () => {
  const { isOnboarding } = useSelector((state) => state.OnboardingSlice);
  return <>{isOnboarding ? <Auth /> : <Onboarding />}</>;
};

// ── MainScreen ─────────────────────────────────────────────────────────────
export const MainScreen = () => {
  const dispatch = useDispatch();
  const { get_user_profile_data } = useSelector((state) => state.UserProfileSlice);
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    dispatch(Get_User_Profle_Fun());
  }, [dispatch]);

  useEffect(() => {
    const checkTerms = async () => {
      try {
        const value = await AsyncStorage.getItem(TERMS_KEY);
        setTermsAccepted(value === "true");
      } catch {
        setTermsAccepted(false);
      } finally {
        setTermsChecked(true);
      }
    };
    checkTerms();
  }, []);

  const handleAcceptTerms = async () => {
    await AsyncStorage.setItem(TERMS_KEY, "true");
    setTermsAccepted(true);
  };

  useEffect(() => {
    const backgroundSubscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
      });
    const foregroundSubscription =
      Notifications.addNotificationReceivedListener(async (notification) => {
        notificationservicecode(notification?.request?.content?.data);
      });
    return () => {
      backgroundSubscription.remove();
      foregroundSubscription.remove();
    };
  }, []);

  if (!termsChecked) return null;

  if (!termsAccepted) {
    return <TermsScreen onAccept={handleAcceptTerms} />;
  }

  return (
    <Stack.Navigator
      initialRouteName="UserNavigation"
      screenOptions={{ headerShown: false }}
    >
      {get_user_profile_data?.data?.AdmincurrentClanMeeting ? (
        <Stack.Screen name="AdminTab" component={Adminnaviagetion} />
      ) : (
        <Stack.Screen name="UserNavigation" component={Usernaviagetion} />
      )}
      <Stack.Screen name="CreatePassword" component={CreatePassword} />
    </Stack.Navigator>
  );
};

// ── NavigationScreen ───────────────────────────────────────────────────────
export const NavigationScreen = () => {
  const { userDatav2 } = useSelector((state) => state.authSlice);
  const { updateInfo } = useUpdateChecker();
  const forceUpdate = updateInfo?.clientVersion < updateInfo?.currentVersion;

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

// ── UpdateScreen ───────────────────────────────────────────────────────────
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
            {message || "We've added exciting new features and improvements to enhance your experience. Update now to enjoy the latest version!"}
          </Text>
        </View>
        <View style={updateStyles.featuresList}>
          {["Enhanced Performance", "New Features & Tools", "Security Improvements"].map((f) => (
            <View key={f} style={updateStyles.featureItem}>
              <View style={updateStyles.featureBullet}>
                <Text style={updateStyles.featureBulletText}>✓</Text>
              </View>
              <Text style={updateStyles.featureText}>{f}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={updateStyles.updateButton} onPress={handleUpdate} activeOpacity={0.8}>
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

// ── useUpdateChecker ───────────────────────────────────────────────────────
export const useUpdateChecker = (checkInterval = 60000) => {
  const [updateInfo, setUpdateInfo] = useState(null);
  const version = Constants.expoConfig?.version;
  const url = `${API_BASEURL}checkversion?version=${version}`;

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

// ── AppNotification ────────────────────────────────────────────────────────
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
    } catch (error) {
      console.error("Error saving push token:", error);
    }
  };

  useEffect(() => {
    const registerPushNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        storePushToken(token);
        setExpoPushToken(token);
        dispatch(pushtokendata(token));
      }
    };

    registerPushNotifications();

    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      appState.current = nextAppState;
    });

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("User interacted with notification:", response);
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
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default Channel",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true, allowAnnouncements: true },
      });
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) throw new Error("Project ID not found");
      token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    } catch (e) {
      console.error("Error getting push token:", e);
      token = `${e}`;
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}