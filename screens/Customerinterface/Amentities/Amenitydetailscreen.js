import React, { useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
// import { Image } from "expo-image";
import { STATUS_CONFIG, AMENITY_STATUS } from "./amenityData";
import { Image } from "react-native";

const IMAGE_HEIGHT = 280;
const HEADER_THRESHOLD = 200;

const AmenityDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { amenity } = route.params;

  const scrollY = useRef(new Animated.Value(0)).current;
  const statusCfg = STATUS_CONFIG[amenity.status];

  // Parallax image
  const imageTranslate = scrollY.interpolate({
    inputRange: [-100, 0, IMAGE_HEIGHT],
    outputRange: [-40, 0, IMAGE_HEIGHT * 0.4],
    extrapolate: "clamp",
  });

  // Nav bar opacity
  const navBarOpacity = scrollY.interpolate({
    inputRange: [HEADER_THRESHOLD - 40, HEADER_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const navBarBg = scrollY.interpolate({
    inputRange: [HEADER_THRESHOLD - 40, HEADER_THRESHOLD],
    outputRange: ["rgba(249,250,251,0)", "rgba(249,250,251,1)"],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ── Sticky animated nav bar ────────────── */}
      <Animated.View style={[styles.navBar, { backgroundColor: navBarBg }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <Animated.Text
          style={[styles.navTitle, { opacity: navBarOpacity }]}
          numberOfLines={1}
        >
          {amenity.name}
        </Animated.Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {/* Back button always visible over image */}
      <TouchableOpacity
        style={styles.backBtnOverlay}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Animated.ScrollView
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero image ───────────────────────── */}
        <View style={styles.imageContainer}>
          <Animated.View
            style={{ transform: [{ translateY: imageTranslate }] }}
          >
            <Image
              source={{ uri: amenity.image }}
              style={styles.heroImage}
              contentFit="cover"
              transition={300}
            />
          </Animated.View>
          {/* gradient overlay */}
          <View style={styles.imageGradient} />
          {/* status badge on image */}
          <View style={[styles.imageBadge, { backgroundColor: statusCfg.bg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusCfg.dot }]}
            />
            <Text style={[styles.imageBadgeText, { color: statusCfg.text }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* ── Content card ─────────────────────── */}
        <View style={styles.contentCard}>
          {/* Name + icon */}
          <View style={styles.nameRow}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={amenity.iconName}
                size={24}
                color="#10B981"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.amenityName}>{amenity.name}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.description}>{amenity.description}</Text>

          {/* Info rows */}
          <View style={styles.infoSection}>
            <InfoRow
              icon="map-marker-outline"
              label="Location"
              value={amenity.location}
            />
            <InfoRow
              icon="clock-outline"
              label="Hours"
              value={amenity.operatingHours}
            />
            <InfoRow
              icon="flag-outline"
              label="Status"
              value={statusCfg.label}
              valueColor={statusCfg.text}
            />
            {amenity.status === AMENITY_STATUS.UNDER_MAINTENANCE &&
              amenity.estimatedReopenDate && (
                <InfoRow
                  icon="calendar-clock"
                  label="Reopens"
                  value={new Date(
                    amenity.estimatedReopenDate,
                  ).toLocaleDateString(undefined, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  valueColor="#92400E"
                />
              )}
          </View>

          {/* Maintenance banner */}
          {amenity.status === AMENITY_STATUS.UNDER_MAINTENANCE && (
            <View style={styles.maintenanceBanner}>
              <MaterialCommunityIcons name="wrench" size={18} color="#92400E" />
              <Text style={styles.maintenanceBannerText}>
                This facility is currently under maintenance and unavailable for
                use.
              </Text>
            </View>
          )}

          {/* Rules */}
          {amenity.rules?.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>Rules & Guidelines</Text>
              <View style={styles.rulesCard}>
                {amenity.rules.map((rule, i) => (
                  <View
                    key={i}
                    style={[
                      styles.ruleRow,
                      i < amenity.rules.length - 1 && styles.ruleRowBorder,
                    ]}
                  >
                    <View style={styles.ruleBullet} />
                    <Text style={styles.ruleText}>{rule}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Report issue CTA */}
          <TouchableOpacity
            style={styles.reportBtn}
            onPress={() => navigation.navigate("ReportIssue", { amenity })}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.reportBtnText}>Report an Issue</Text>
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const InfoRow = ({ icon, label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIconWrap}>
      <MaterialCommunityIcons name={icon} size={16} color="#10B981" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  // Nav bar
  navBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 52 : 40,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  backBtnOverlay: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 40,
    left: 16,
    zIndex: 20,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Hero
  imageContainer: {
    height: IMAGE_HEIGHT,
    overflow: "hidden",
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: IMAGE_HEIGHT + 60,
    backgroundColor: "#E5E7EB",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    background: "transparent",
    // Simulated gradient via opacity
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  imageBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Content
  contentCard: {
    backgroundColor: "#F9FAFB",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 28,
    minHeight: 500,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  amenityName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },

  description: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 24,
  },

  // Info section
  infoSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },

  // Maintenance
  maintenanceBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 20,
  },
  maintenanceBannerText: {
    flex: 1,
    fontSize: 14,
    color: "#92400E",
    fontWeight: "600",
    lineHeight: 20,
  },

  // Rules
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  rulesCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    gap: 12,
  },
  ruleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  ruleBullet: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#10B981",
    marginTop: 7,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
    fontWeight: "500",
  },

  // Report button
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  reportBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default AmenityDetailScreen;
