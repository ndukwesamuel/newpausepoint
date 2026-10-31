import React, { useRef, useEffect } from "react";
import { View, Text, StyleSheet, Animated, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../shared/ScreenWrapper";

const { width } = Dimensions.get("window");

const ErrandsScreen = () => {
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const iconFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating icon animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(iconFloat, {
          toValue: -10,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(iconFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Staggered pulse rings
    const startPulse = (anim, delay) => {
      setTimeout(() => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 1.8,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ).start();
      }, delay);
    };

    startPulse(pulse1, 0);
    startPulse(pulse2, 600);
    startPulse(pulse3, 1200);
  }, []);

  const pulse1Opacity = pulse1.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0.35, 0],
  });
  const pulse2Opacity = pulse2.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0.25, 0],
  });
  const pulse3Opacity = pulse3.interpolate({
    inputRange: [1, 1.8],
    outputRange: [0.15, 0],
  });

  return (
    <ScreenWrapper
      title="Errands"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
      showHeader={false}
    >
      <View style={styles.container}>
        {/* Top decorative strip */}
        <View style={styles.topStrip}>
          {[...Array(8)].map((_, i) => (
            <View key={i} style={styles.stripDot} />
          ))}
        </View>

        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Icon with pulse rings */}
          <View style={styles.iconWrapper}>
            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulse3 }], opacity: pulse3Opacity },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseRing,
                styles.pulseRingMid,
                { transform: [{ scale: pulse2 }], opacity: pulse2Opacity },
              ]}
            />
            <Animated.View
              style={[
                styles.pulseRing,
                styles.pulseRingInner,
                { transform: [{ scale: pulse1 }], opacity: pulse1Opacity },
              ]}
            />

            <Animated.View
              style={[
                styles.iconContainer,
                {
                  transform: [{ translateY: iconFloat }, { scale: scaleAnim }],
                },
              ]}
            >
              <View style={styles.iconBg}>
                <MaterialCommunityIcons
                  name="moped-electric-outline"
                  size={52}
                  color="#10B981"
                />
              </View>
            </Animated.View>
          </View>

          {/* Text block */}
          <View style={styles.textBlock}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <MaterialCommunityIcons
                  name="clock-fast"
                  size={12}
                  color="#065F46"
                />
                <Text style={styles.badgeText}>COMING SOON</Text>
              </View>
            </View>

            <Text style={styles.headline}>Errands,{"\n"}delivered.</Text>

            <Text style={styles.subtext}>
              We're building something to make your daily runs effortless —
              grocery pickups, package deliveries, and more, all from within
              PausePoint.
            </Text>
          </View>

          {/* Feature pills */}
          <View style={styles.pillsRow}>
            {[
              { icon: "cart-outline", label: "Groceries" },
              { icon: "package-variant", label: "Packages" },
              { icon: "medical-bag", label: "Pharmacy" },
            ].map((item, i) => (
              <View key={i} style={styles.pill}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={15}
                  color="#10B981"
                />
                <Text style={styles.pillText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* Divider with label */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerLabel}>notify me</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Notification nudge */}
          <View style={styles.notifyCard}>
            <View style={styles.notifyIconWrap}>
              <MaterialCommunityIcons
                name="bell-ring-outline"
                size={20}
                color="#10B981"
              />
            </View>
            <Text style={styles.notifyText}>
              We'll let you know once it's live in your estate.
            </Text>
          </View>
        </Animated.View>

        {/* Bottom decorative strip */}
        <View style={styles.bottomStrip} />
      </View>
    </ScreenWrapper>
  );
};

const PULSE_SIZE = 220;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0FDF9",
  },
  topStrip: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingTop: 20,
    paddingBottom: 4,
  },
  stripDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#A7F3D0",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 24,
  },

  // Pulse / Icon
  iconWrapper: {
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  pulseRing: {
    position: "absolute",
    width: PULSE_SIZE,
    height: PULSE_SIZE,
    borderRadius: PULSE_SIZE / 2,
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "transparent",
  },
  pulseRingMid: {
    width: PULSE_SIZE * 0.75,
    height: PULSE_SIZE * 0.75,
    borderRadius: (PULSE_SIZE * 0.75) / 2,
  },
  pulseRingInner: {
    width: PULSE_SIZE * 0.55,
    height: PULSE_SIZE * 0.55,
    borderRadius: (PULSE_SIZE * 0.55) / 2,
  },
  iconContainer: {
    zIndex: 10,
  },
  iconBg: {
    width: 100,
    height: 100,
    borderRadius: 32,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "#D1FAE5",
  },

  // Text
  textBlock: {
    alignItems: "center",
    marginBottom: 28,
  },
  badgeRow: {
    marginBottom: 12,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#065F46",
    letterSpacing: 1.5,
  },
  headline: {
    fontSize: 38,
    fontWeight: "900",
    color: "#064E3B",
    textAlign: "center",
    lineHeight: 44,
    letterSpacing: -1,
    marginBottom: 14,
  },
  subtext: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "400",
    maxWidth: 300,
  },

  // Pills
  pillsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 28,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D1FAE5",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  pillText: {
    fontSize: 13,
    color: "#065F46",
    fontWeight: "600",
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1FAE5",
  },
  dividerLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  // Notify card
  notifyCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#D1FAE5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  notifyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  notifyText: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    lineHeight: 19,
    fontWeight: "500",
  },

  bottomStrip: {
    height: 6,
    backgroundColor: "#10B981",
    opacity: 0.15,
  },
});

export default ErrandsScreen;
