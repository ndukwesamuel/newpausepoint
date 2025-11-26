import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ErrandAdCard = ({ ad }) => {
  const handleAdPress = async () => {
    if (!ad.linkUrl) {
      Alert.alert("No Link", "This advertisement does not have a link.");
      return;
    }

    try {
      const supported = await Linking.canOpenURL(ad.linkUrl);
      if (supported) {
        await Linking.openURL(ad.linkUrl);
      } else {
        Alert.alert(
          "Cannot Open Link",
          `Could not open the ad link: ${ad.linkUrl}`
        );
      }
    } catch (error) {
      console.error("Failed to open ad link:", error);
      Alert.alert("Error", "An error occurred while opening the ad.");
    }
  };

  return (
    <TouchableOpacity
      style={styles.adCard}
      onPress={handleAdPress}
      activeOpacity={0.8}
    >
      {/* Sponsored Badge */}
      <View style={styles.sponsoredContainer}>
        <View style={styles.sponsoredBadge}>
          <MaterialCommunityIcons
            name="star"
            size={10}
            color="#8B5CF6"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.sponsoredText}>FEATURED SERVICE</Text>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.adContent}>
        {/* Left Section - Icon and Text */}
        <View style={styles.leftSection}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={ad.iconName || "shopping"}
              size={28}
              color="#8B5CF6"
            />
          </View>
          <View style={styles.textSection}>
            <Text style={styles.adTitle} numberOfLines={1}>
              {ad.title || "Featured Service"}
            </Text>
            <Text style={styles.adSubtitle} numberOfLines={1}>
              {ad.subtitle || "Special Offer"}
            </Text>
            <Text style={styles.adDescription} numberOfLines={2}>
              {ad.description || "Tap to learn more"}
            </Text>
          </View>
        </View>

        {/* Right Section - Image */}
        <View style={styles.imageSection}>
          <Image
            source={{ uri: ad.imageUrl }}
            style={styles.adImage}
            resizeMode="cover"
          />
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{ad.discount || "NEW"}</Text>
          </View>
          <View style={styles.linkBadge}>
            <MaterialCommunityIcons
              name="arrow-right"
              size={18}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaLeft}>
          <MaterialCommunityIcons
            name="clock-fast"
            size={14}
            color="#8B5CF6"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.ctaSubtext}>
            {ad.ctaSubtext || "Limited Time"}
          </Text>
        </View>
        <View style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Get Started</Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={16}
            color="#8B5CF6"
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ErrandAdCard;

const styles = StyleSheet.create({
  adCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: "#E9D5FF",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  sponsoredContainer: {
    marginBottom: 12,
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sponsoredText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#6B21A8",
    letterSpacing: 0.5,
  },
  adContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    marginRight: 12,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textSection: {
    flex: 1,
    justifyContent: "center",
  },
  adTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  adSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  adDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 16,
  },
  imageSection: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  linkBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
  },
  ctaSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  ctaLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  ctaSubtext: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  ctaButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8B5CF6",
    marginRight: 4,
    letterSpacing: 0.3,
  },
});
