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

const ForumAdCard = ({ ad }) => {
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
    <View style={styles.adContainer}>
      {/* Sponsored Badge */}
      <View style={styles.sponsoredBadge}>
        <MaterialCommunityIcons
          name="bullhorn"
          size={12}
          color="#F59E0B"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.sponsoredText}>SPONSORED</Text>
      </View>

      <TouchableOpacity
        style={styles.adCard}
        onPress={handleAdPress}
        activeOpacity={0.8}
      >
        {/* Ad Image */}
        <View style={styles.adImageContainer}>
          <Image
            source={{ uri: ad.imageUrl }}
            style={styles.adImage}
            resizeMode="cover"
          />
          {/* Gradient Overlay */}
          <View style={styles.gradientOverlay} />

          {/* External Link Badge */}
          <View style={styles.externalLinkBadge}>
            <MaterialCommunityIcons
              name="open-in-new"
              size={16}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Ad Content */}
        <View style={styles.adContent}>
          <View style={styles.adHeader}>
            <View style={styles.adIconContainer}>
              <MaterialCommunityIcons name="store" size={20} color="#F59E0B" />
            </View>
            <View style={styles.adTextContainer}>
              <Text style={styles.adTitle} numberOfLines={1}>
                {ad.title || "Featured Advertisement"}
              </Text>
              <Text style={styles.adSubtitle} numberOfLines={1}>
                {ad.subtitle || "Tap to learn more"}
              </Text>
            </View>
          </View>

          {ad.description && (
            <Text style={styles.adDescription} numberOfLines={2}>
              {ad.description}
            </Text>
          )}

          {/* Call to Action Button */}
          <View style={styles.ctaButton}>
            <Text style={styles.ctaText}>Learn More</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={16}
              color="#F59E0B"
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ForumAdCard;

const styles = StyleSheet.create({
  adContainer: {
    marginBottom: 16,
    position: "relative",
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginBottom: -4,
    marginLeft: 16,
    zIndex: 1,
  },
  sponsoredText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#92400E",
    letterSpacing: 0.5,
  },
  adCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  adImageContainer: {
    width: "100%",
    height: 180,
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  externalLinkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  adContent: {
    padding: 16,
  },
  adHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  adIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  adTextContainer: {
    flex: 1,
  },
  adTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  adSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  adDescription: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 20,
    marginBottom: 12,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEF3C7",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F59E0B",
    marginRight: 6,
    letterSpacing: 0.3,
  },
});
