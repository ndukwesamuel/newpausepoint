import AsyncStorage from "@react-native-async-storage/async-storage";

// Expo-Go-safe version: no native modules at all (no expo-application,
// no react-native-device-info, no uuid/react-native-get-random-values).
// Those all require a custom dev build and will crash in plain Expo Go.
//
// Instead we just generate a random-enough ID ourselves in pure JS the
// first time this phone ever runs the app, and cache it in AsyncStorage.
// It doesn't need to be a "real" hardware ID — it just needs to be:
//   1. Different across different phones
//   2. The SAME value every time on the same phone
// A cached random string satisfies both, without touching native code.

const DEVICE_ID_KEY = "PP_DEVICE_ID";

const generateRandomId = () => {
  const random = Math.random().toString(36).slice(2);
  const random2 = Math.random().toString(36).slice(2);
  return `${Date.now()}-${random}-${random2}`;
};

export const getDeviceId = async () => {
  try {
    const cached = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (cached) return cached;

    const deviceId = generateRandomId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
    return deviceId;
  } catch (err) {
    console.error("getDeviceId failed:", err);
    // Won't persist correctly if storage itself is failing, but keeps
    // login from hard-crashing over this.
    return generateRandomId();
  }
};