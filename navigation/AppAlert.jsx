

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../hooks/Requestv2";

// ─── FRONTEND CONFIG (only used when API returns null + SHOW_DUMMY is true) ───
const ALERT_CONFIG = {
  // How many seconds after closing before dummy alert shows again
  RESHOW_AFTER_SECONDS: 30,

  // Delay before showing alert after app loads (in ms)
  SHOW_DELAY_MS: 500,

  // If false — only show alert if API returns real data, dummy never shows
  // If true  — show dummy fallback when API returns nothing
  SHOW_DUMMY: false,
};

// ─── DUMMY FALLBACK (only shown when SHOW_DUMMY is true and API has no data) ──
const DEFAULT_ALERT = {
  type: "info",
  title: "Welcome to PausePoint 👋",
  message:
    "Stay updated with your estate activities. Check your dues, electricity, visitors and more.",
  ctaText: "View Dues",
  ctaScreen: "HouseholdDues",
  // dummy uses ALERT_CONFIG.RESHOW_AFTER_SECONDS — not this field
  reshowAfterSeconds: null,
};

// ─── TYPE CONFIG ──────────────────────────────────────────────────────────────
const typeConfig = {
  info: {
    bg: "#EFF6FF",
    border: "#3B82F6",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    icon: "information",
    titleColor: "#1E40AF",
    btnBg: "#2563EB",
  },
  warning: {
    bg: "#FFFBEB",
    border: "#F59E0B",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    icon: "alert",
    titleColor: "#92400E",
    btnBg: "#F59E0B",
  },
  danger: {
    bg: "#FFF5F5",
    border: "#EF4444",
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    icon: "alert-circle",
    titleColor: "#991B1B",
    btnBg: "#DC2626",
  },
  success: {
    bg: "#F0FDF4",
    border: "#10B981",
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    icon: "check-circle",
    titleColor: "#065F46",
    btnBg: "#10B981",
  },
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const AppAlert = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const reshowTimer = useRef(null);
  const isFromAPI = useRef(false);

  const { data } = useFetchData_v2("api/v1/alertRouter/active", "activeAlert");


  

  const apiAlert = data?.data;

  // ── Decide what to show ────────────────────────────────────────────────────
  // API has data → use it (reshowAfterSeconds comes from backend)
  // API null + SHOW_DUMMY true → use dummy (reshowAfterSeconds from ALERT_CONFIG)
  // API null + SHOW_DUMMY false → show nothing
  const alertData = apiAlert
    ? apiAlert
    : ALERT_CONFIG.SHOW_DUMMY
    ? DEFAULT_ALERT
    : null;

  const animateIn = () => {
    slideAnim.setValue(300);
    opacityAnim.setValue(0);
    setVisible(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    if (!alertData) return;

    // Track if this is real API data or dummy
    isFromAPI.current = !!apiAlert;

    const initialTimer = setTimeout(() => {
      animateIn();
    }, ALERT_CONFIG.SHOW_DELAY_MS);

    return () => {
      clearTimeout(initialTimer);
      if (reshowTimer.current) clearTimeout(reshowTimer.current);
    };
  }, [alertData]);

  const scheduleReshow = () => {
    if (!alertData) return;

    // If real API data → use reshowAfterSeconds from backend
    // If dummy → use ALERT_CONFIG.RESHOW_AFTER_SECONDS
    const seconds = isFromAPI.current
      ? alertData.reshowAfterSeconds
      : ALERT_CONFIG.RESHOW_AFTER_SECONDS;

    if (seconds && seconds > 0) {
      reshowTimer.current = setTimeout(() => {
        animateIn();
      }, seconds * 1000);
    }
  };

  const animateOut = (callback?: () => void) => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setVisible(false);
      scheduleReshow();
      callback?.();
    });
  };

  const handleClose = () => {
    animateOut();
  };

  const handleCTA = () => {
    animateOut(() => {
      if (alertData?.ctaScreen) {
        navigation.navigate(alertData.ctaScreen);
      }
    });
  };

  if (!alertData) return null;

  const config = typeConfig[alertData?.type] || typeConfig.info;
  const hasCTA = alertData?.ctaText && alertData?.ctaScreen;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View style={[styles.backdrop, { opacity: opacityAnim }]}>
        {/* Tap backdrop to close */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />

        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: config.bg,
              borderLeftColor: config.border,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Close X */}
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <MaterialCommunityIcons name="close" size={18} color="#6B7280" />
          </TouchableOpacity>

          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: config.iconBg }]}>
            <MaterialCommunityIcons
              name={config.icon}
              size={32}
              color={config.iconColor}
            />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: config.titleColor }]}>
            {alertData?.title}
          </Text>

          {/* Message */}
          <Text style={styles.message}>{alertData?.message}</Text>

          {/* Buttons */}
          <View style={styles.btnRow}>
            {/* Always show dismiss button */}
            <TouchableOpacity
              style={[styles.dismissBtn, { borderColor: config.border }]}
              onPress={handleClose}
            >
              <Text style={[styles.dismissBtnText, { color: config.titleColor }]}>
                Got it
              </Text>
            </TouchableOpacity>

            {/* CTA button — only if ctaText + ctaScreen are set */}
            {hasCTA && (
              <TouchableOpacity
                style={[styles.ctaBtn, { backgroundColor: config.btnBg }]}
                onPress={handleCTA}
              >
                <Text style={styles.ctaBtnText}>{alertData.ctaText}</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color="white"
                />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    borderLeftWidth: 5,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(0,0,0,0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.2,
    paddingRight: 24,
  },
  message: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 20,
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
  },
  dismissBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: "center",
  },
  dismissBtnText: {
    fontSize: 14,
    fontWeight: "700",
  },
  ctaBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  ctaBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
});

export default AppAlert;