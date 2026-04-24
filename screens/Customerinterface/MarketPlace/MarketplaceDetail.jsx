import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  Platform,
  Linking,
  Image,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import { fmt, fmtDate, getInitials, categoryColor } from "./marketplaceHelpers";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 300;

// ─── IMAGE CAROUSEL ───────────────────────────────────────────────────────────
const ImageCarousel = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <View style={styles.noImageBox}>
        <MaterialCommunityIcons
          name="image-off-outline"
          size={36}
          color="#9CA3AF"
        />
        <Text style={styles.noImageText}>No images added</Text>
      </View>
    );
  }

  const onScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={{ height: IMAGE_HEIGHT }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        style={{ height: IMAGE_HEIGHT }}
      >
        {images.map((img, i) => (
          <Image
            key={i}
            source={{ uri: img.url }}
            style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {images.length > 1 && (
        <View style={styles.dotsRow}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex ? "white" : "rgba(255,255,255,0.4)",
                  width: i === activeIndex ? 16 : 6,
                },
              ]}
            />
          ))}
        </View>
      )}

      <View style={styles.imageCountBadge}>
        <MaterialCommunityIcons name="image-multiple" size={12} color="white" />
        <Text style={styles.imageCountText}>
          {activeIndex + 1}/{images.length}
        </Text>
      </View>
    </View>
  );
};

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MarketplaceDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const listing = route.params?.listing;

  console.log({
    uuiii: listing,
  });

  if (!listing) {
    return (
      <View style={styles.centerState}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={48}
          color="#D1D5DB"
        />
        <Text style={styles.centerStateText}>Listing not found</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const cat = categoryColor(listing.category);
  const initials = getInitials(listing.seller?.name);
  const isAvailable = listing.listingStatus === "available";

  const handleCall = () => Linking.openURL(`tel:${listing.phone}`);
  const handleWhatsApp = () => {
    const phone = listing.contact?.replace(/\D/g, "");
    const intl = phone?.startsWith("0") ? `234${phone.slice(1)}` : phone;
    Linking.openURL(`https://wa.me/${intl}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Image carousel */}
      <View style={{ position: "relative" }}>
        <ImageCarousel images={listing.images} />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
        </TouchableOpacity>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isAvailable ? "#10B981" : "#E24B4A" },
          ]}
        >
          <Text style={styles.statusBadgeText}>
            {listing.listingStatus === "sold"
              ? "Sold"
              : listing.listingStatus === "reserved"
                ? "Reserved"
                : "Available"}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.body}>
          {/* Category chip */}
          <View style={[styles.categoryChip, { backgroundColor: cat.bg }]}>
            <Text style={[styles.categoryChipText, { color: cat.color }]}>
              {listing.category || "Other"}
            </Text>
          </View>

          {/* Title + Price */}
          <View style={styles.titlePriceRow}>
            <Text style={styles.title}>{listing.name}</Text>
            <Text style={styles.price}>{fmt(listing.price)}</Text>
          </View>

          <Text style={styles.postedAt}>{fmtDate(listing.createdAt)}</Text>

          {/* Description */}
          <Text style={styles.description}>{listing.description}</Text>

          {/* Seller */}
          <View style={styles.sellerCard}>
            <View style={[styles.sellerAvatar, { backgroundColor: cat.bg }]}>
              <Text style={[styles.sellerAvatarText, { color: cat.color }]}>
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{listing.seller?.name}</Text>
              <Text style={styles.sellerEmail}>{listing.seller?.email}</Text>
            </View>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#10B981"
            />
          </View>
          {console.log({
            vgg: listing,
          })}

          {/* Phone */}
          <View style={styles.phoneRow}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.phoneText}>{listing.phone}</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      {isAvailable && (
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.callBtn} onPress={handleCall}>
            <Ionicons name="call" size={18} color="white" />
            <Text style={styles.callBtnText}>Call Seller</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.whatsappBtn} onPress={handleWhatsApp}>
            <MaterialCommunityIcons name="whatsapp" size={22} color="#10B981" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  centerStateText: { fontSize: 14, color: "#9CA3AF" },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },

  backBtn: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  statusBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    zIndex: 10,
  },
  statusBadgeText: { color: "white", fontSize: 12, fontWeight: "700" },
  noImageBox: {
    height: IMAGE_HEIGHT,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  noImageText: { fontSize: 14, color: "#9CA3AF" },
  dotsRow: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    zIndex: 10,
  },
  dot: { height: 6, borderRadius: 99 },
  imageCountBadge: {
    position: "absolute",
    top: Platform.OS === "ios" ? 52 : 16,
    left: 62,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    zIndex: 10,
  },
  imageCountText: { color: "white", fontSize: 11, fontWeight: "600" },
  body: { padding: 20 },
  categoryChip: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 99,
    marginBottom: 10,
  },
  categoryChipText: { fontSize: 12, fontWeight: "600" },
  titlePriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    marginRight: 12,
  },
  price: { fontSize: 20, fontWeight: "800", color: "#10B981" },
  postedAt: { fontSize: 12, color: "#9CA3AF", marginBottom: 14 },
  description: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 22,
    marginBottom: 20,
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
  },
  sellerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sellerAvatarText: { fontSize: 14, fontWeight: "700" },
  sellerName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  sellerEmail: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
  },
  phoneText: { fontSize: 14, color: "#374151", fontWeight: "500" },
  ctaRow: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 0.5,
    borderTopColor: "#F3F4F6",
  },
  callBtn: {
    flex: 1,
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callBtnText: { color: "white", fontSize: 15, fontWeight: "700" },
  whatsappBtn: {
    width: 52,
    backgroundColor: "#F0FDF4",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#D1FAE5",
  },
});
