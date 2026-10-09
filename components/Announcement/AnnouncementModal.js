import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnnouncementMedia from "./AnnouncementMedia";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const AnnouncementModal = ({ announcement, visible, onClose, onCtaPress }) => {
  const insets = useSafeAreaInsets();

  if (!announcement) return null;

  const { layout = "card", title, body, media, cta } = announcement;

  const renderContent = (mediaHeight) => (
    <>
      <AnnouncementMedia
        type={media?.type}
        source={media?.source}
        height={mediaHeight}
      />

      <View style={styles.badge}>
        <Text style={styles.badgeText}>NEW</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      {!!body && <Text style={styles.body}>{body}</Text>}

      <TouchableOpacity style={styles.primaryButton} onPress={onCtaPress}>
        <Text style={styles.primaryButtonText}>{cta?.text || "Got it"}</Text>
      </TouchableOpacity>

      {/* "Maybe later" only makes sense when the main button opens a screen */}
      {!!cta?.route && (
        <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </TouchableOpacity>
      )}
    </>
  );

  const closeButton = (
    <TouchableOpacity
      style={styles.closeButton}
      onPress={onClose}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <MaterialCommunityIcons name="close" size={22} color="#6B7280" />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent={layout !== "fullscreen"}
      animationType={layout === "sheet" ? "slide" : "fade"}
      onRequestClose={onClose}
      statusBarTranslucent
      navigationBarTranslucent
    >
      {layout === "fullscreen" && (
        <View
          style={[
            styles.fullscreen,
            { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 24 },
          ]}
        >
          <View style={styles.fullscreenHeader}>{closeButton}</View>
          <View style={styles.fullscreenBody}>
            {renderContent(SCREEN_HEIGHT * 0.45)}
          </View>
        </View>
      )}

      {layout === "sheet" && (
        <View style={styles.sheetOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
          <View
            style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}
          >
            <View style={styles.sheetHandle} />
            {renderContent(200)}
          </View>
        </View>
      )}

      {layout === "card" && (
        <View style={styles.cardOverlay}>
          <View style={styles.card}>
            {closeButton}
            {renderContent(180)}
          </View>
        </View>
      )}
    </Modal>
  );
};

export default AnnouncementModal;

const styles = StyleSheet.create({
  // Card
  cardOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
  },

  // Bottom sheet
  sheetOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    alignItems: "center",
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginBottom: 16,
  },

  // Full screen
  fullscreen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
  },
  fullscreenHeader: {
    height: 40,
  },
  fullscreenBody: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Shared
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  badge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    marginTop: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    textAlign: "center",
    marginTop: 10,
  },
  body: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 8,
  },
  primaryButton: {
    alignSelf: "stretch",
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  secondaryButton: {
    paddingVertical: 12,
    marginTop: 4,
  },
  secondaryButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
});
