import React, { useEffect, useRef } from "react";
import { Animated, Easing, Image, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const GREEN = "#0E9B4A";
const GREEN_SOFT = "#E7F6EC";
const YELLOW = "#F5C518";
const RED = "#C0202F";
const INK = "#111827";
const MUTED = "#6B7280";

const FEATURES = [
  { icon: "lightning-bolt", color: GREEN, bg: GREEN_SOFT, title: "Pay in a tap", copy: "Settle payments straight from your PausePoint wallet." },
  { icon: "account-group", color: "#B7860B", bg: "#FEF6D8", title: "Pay your estate", copy: "Send money to people and services around you." },
  { icon: "shield-check", color: RED, bg: "#FCE8EA", title: "Safe and secure", copy: "Every payment is protected and easy to track." },
];

// A ring that grows and fades behind the logo, on a loop.
const PulseRing = ({ delay }) => {
  const progress = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(progress, { toValue: 1, duration: 2400, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, progress]);

  const scale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 1.7] });
  const opacity = progress.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] });
  return <Animated.View style={[styles.ring, { transform: [{ scale }], opacity }]} />;
};

const PausePayComingSoon = () => {
  const navigation = useNavigation();
  const enter = useRef(new Animated.Value(0)).current;
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(enter, { toValue: 1, duration: 600, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(float, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(float, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [enter, float]);

  const rise = (offset) => ({
    opacity: enter,
    transform: [{ translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] }) }],
  });
  const floatY = float.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.hero}>
        <View style={[styles.blob, styles.blobYellow]} />
        <View style={[styles.blob, styles.blobRed]} />

        <View style={styles.logoStage}>
          <PulseRing delay={0} />
          <PulseRing delay={1200} />
          <Animated.View style={[styles.logoCard, { transform: [{ translateY: floatY }] }]}>
            <Image source={require("../../../assets/pausepay-logo.jpg")} style={styles.logo} resizeMode="contain" />
          </Animated.View>
        </View>

        <Animated.View style={[styles.pill, rise(12)]}>
          <View style={styles.pillDot} />
          <Text style={styles.pillText}>COMING SOON</Text>
        </Animated.View>

        <Animated.Text style={[styles.title, rise(16)]}>
          Pause<Text style={{ color: GREEN }}>Pay</Text>
        </Animated.Text>
        <Animated.Text style={[styles.subtitle, rise(20)]}>
          A faster way to pay, right inside PausePoint. We're putting the finishing touches on it.
        </Animated.Text>
      </View>

      <Animated.View style={[styles.card, rise(28)]}>
        <Text style={styles.cardHeading}>What to expect</Text>
        {FEATURES.map((f, i) => (
          <View key={f.title} style={[styles.feature, i > 0 && styles.featureDivider]}>
            <View style={[styles.featureIcon, { backgroundColor: f.bg }]}>
              <MaterialCommunityIcons name={f.icon} size={22} color={f.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureCopy}>{f.copy}</Text>
            </View>
          </View>
        ))}
      </Animated.View>

      <Animated.View style={[styles.note, rise(32)]}>
        <MaterialCommunityIcons name="bell-ring-outline" size={18} color={GREEN} />
        <Text style={styles.noteText}>We'll let you know in the app as soon as PausePay is live.</Text>
      </Animated.View>

      <Pressable
        onPress={() => navigation.goBack()}
        style={({ pressed }) => [styles.button, pressed && { opacity: 0.85 }]}
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Got it</Text>
      </Pressable>
    </ScrollView>
  );
};

export default PausePayComingSoon;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F7FAF8" },
  content: { padding: 20, paddingBottom: 40 },

  hero: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  blob: { position: "absolute", width: 160, height: 160, borderRadius: 80 },
  blobYellow: { backgroundColor: YELLOW, opacity: 0.12, top: -50, right: -40 },
  blobRed: { backgroundColor: RED, opacity: 0.07, bottom: -70, left: -50 },

  logoStage: { width: 150, height: 150, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  ring: { position: "absolute", width: 130, height: 130, borderRadius: 65, borderWidth: 2, borderColor: GREEN },
  logoCard: {
    width: 130,
    height: 130,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: GREEN,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 8,
  },
  logo: { width: 104, height: 104 },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: GREEN_SOFT,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 12,
  },
  pillDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: GREEN, marginRight: 7 },
  pillText: { fontSize: 11, fontWeight: "800", letterSpacing: 1.4, color: GREEN },

  title: { fontSize: 34, fontWeight: "800", color: INK, letterSpacing: -0.5, marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 22, color: MUTED, textAlign: "center", maxWidth: 300 },

  card: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeading: { fontSize: 16, fontWeight: "700", color: INK, marginBottom: 6 },
  feature: { flexDirection: "row", alignItems: "center", paddingVertical: 12 },
  featureDivider: { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#E5E7EB" },
  featureIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", marginRight: 14 },
  featureTitle: { fontSize: 15, fontWeight: "700", color: INK, marginBottom: 2 },
  featureCopy: { fontSize: 13, lineHeight: 18, color: MUTED },

  note: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    padding: 14,
    borderRadius: 16,
    backgroundColor: GREEN_SOFT,
  },
  noteText: { flex: 1, marginLeft: 10, fontSize: 13, lineHeight: 18, color: "#14532D" },

  button: {
    marginTop: 20,
    backgroundColor: GREEN,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
