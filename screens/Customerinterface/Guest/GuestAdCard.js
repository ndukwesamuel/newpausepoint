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

const GuestAdCard = ({ ad }) => {
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
      <View style={styles.sponsoredBadge}>
        <MaterialCommunityIcons
          name="bullhorn"
          size={10}
          color="#F59E0B"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.sponsoredText}>SPONSORED</Text>
      </View>

      {/* Ad Content Container */}
      <View style={styles.adContentContainer}>
        {/* Left Side - Icon and Text */}
        <View style={styles.adLeftSection}>
          <View style={styles.adIconContainer}>
            <MaterialCommunityIcons
              name={ad.iconName || "store"}
              size={24}
              color="#F59E0B"
            />
          </View>
          <View style={styles.adTextSection}>
            <Text style={styles.adTitle} numberOfLines={1}>
              {ad.title || "Featured Service"}
            </Text>
            <Text style={styles.adDescription} numberOfLines={2}>
              {ad.description || "Tap to learn more about this offer"}
            </Text>
            <View style={styles.adCtaContainer}>
              <Text style={styles.adCtaText}>Learn More</Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={14}
                color="#F59E0B"
              />
            </View>
          </View>
        </View>

        {/* Right Side - Image */}
        <View style={styles.adImageContainer}>
          <Image
            source={{ uri: ad.imageUrl }}
            style={styles.adImage}
            resizeMode="cover"
          />
          <View style={styles.adImageOverlay}>
            <MaterialCommunityIcons
              name="open-in-new"
              size={16}
              color="#FFFFFF"
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GuestAdCard;

const styles = StyleSheet.create({
  adCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#FEF3C7",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  sponsoredBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 10,
  },
  sponsoredText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#92400E",
    letterSpacing: 0.5,
  },
  adContentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  adLeftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  adIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  adTextSection: {
    flex: 1,
  },
  adTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  adDescription: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 16,
    marginBottom: 6,
  },
  adCtaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  adCtaText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F59E0B",
    marginRight: 4,
    letterSpacing: 0.3,
  },
  adImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  adImageOverlay: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
});
