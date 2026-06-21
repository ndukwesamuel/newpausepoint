import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  TextInput,
  Platform,
  Linking,
  Image,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
// import { useFetchData_v2 } from "../../../hooks/Requestv2";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = 280;

const CATEGORIES = [
  "All",
  "Food",
  "Electronics",
  "Services",
  "Furniture",
  "Clothing",
  "Other",
];

const fmt = (n) => `₦${Number(n).toLocaleString()}`;

const fmtDate = (d) => {
  if (!d) return "";
  const now = new Date();
  const date = new Date(d);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

// seller initials from name
const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    : name.slice(0, 2).toUpperCase();
};

// category color
const categoryColor = (c) =>
  ({
    Food: { bg: "#FAEEDA", color: "#BA7517" },
    Electronics: { bg: "#EEEDFE", color: "#534AB7" },
    Services: { bg: "#E1F5EE", color: "#1D9E75" },
    Furniture: { bg: "#FAECE7", color: "#D85A30" },
    Clothing: { bg: "#FBEAF0", color: "#D4537E" },
    Other: { bg: "#F3F4F6", color: "#374151" },
  })[c] || { bg: "#F3F4F6", color: "#374151" };

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

// ─── LISTING DETAIL SCREEN ────────────────────────────────────────────────────
const ListingDetail = ({ listing, onBack }) => {
  const cat = categoryColor(listing.category);
  const initials = getInitials(listing.seller?.name);
  const isAvailable = listing.listingStatus === "available";

  const handleCall = () => Linking.openURL(`tel:${listing.contact}`);
  const handleWhatsApp = () => {
    const phone = listing.contact?.replace(/\D/g, "");
    const intl = phone?.startsWith("0") ? `234${phone.slice(1)}` : phone;
    Linking.openURL(`https://wa.me/${intl}`);
  };

  return (
    <View style={styles.detailContainer}>
      <StatusBar barStyle="light-content" />

      <View style={{ position: "relative" }}>
        <ImageCarousel images={listing.images} />

        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
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
        <View style={styles.detailBody}>
          <View style={[styles.categoryChip, { backgroundColor: cat.bg }]}>
            <Text style={[styles.categoryChipText, { color: cat.color }]}>
              {listing.category || "Other"}
            </Text>
          </View>

          <View style={styles.titlePriceRow}>
            <Text style={styles.detailTitle}>{listing.name}</Text>
            <Text style={styles.detailPrice}>{fmt(listing.price)}</Text>
          </View>

          <Text style={styles.postedAt}>{fmtDate(listing.createdAt)}</Text>

          <Text style={styles.detailDesc}>{listing.description}</Text>

          {/* Seller */}
          <View style={styles.sellerCard}>
            <View style={[styles.sellerAvatar, { backgroundColor: cat.bg }]}>
              <Text style={[styles.sellerAvatarText, { color: cat.color }]}>
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.sellerName}>{listing.seller?.name}</Text>
              <Text style={styles.sellerAddress}>{listing.seller?.email}</Text>
            </View>
            <MaterialCommunityIcons
              name="check-decagram"
              size={18}
              color="#10B981"
            />
          </View>

          {/* Phone */}
          <View style={styles.phoneRow}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.phoneText}>{listing.contact}</Text>
          </View>
        </View>
      </ScrollView>

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
};

// ─── LISTING CARD ─────────────────────────────────────────────────────────────
const ListingCard = ({ item, onPress }) => {
  const cat = categoryColor(item.category);
  const initials = getInitials(item.seller?.name);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardImageBox}>
        {item.images?.length > 0 ? (
          <Image
            source={{ uri: item.images[0].url }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                backgroundColor: cat.bg,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <MaterialCommunityIcons
              name="image-outline"
              size={36}
              color={cat.color}
            />
          </View>
        )}

        {item.images?.length > 1 && (
          <View style={styles.cardImageCount}>
            <MaterialCommunityIcons
              name="image-multiple"
              size={11}
              color="white"
            />
            <Text style={styles.cardImageCountText}>{item.images.length}</Text>
          </View>
        )}

        {item.listingStatus === "sold" && (
          <View style={styles.soldOverlay}>
            <Text style={styles.soldText}>SOLD</Text>
          </View>
        )}
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardDesc} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.cardPrice}>{fmt(item.price)}</Text>
        <View style={styles.cardFooter}>
          <View style={[styles.cardAvatar, { backgroundColor: cat.bg }]}>
            <Text style={[styles.cardAvatarText, { color: cat.color }]}>
              {initials.charAt(0)}
            </Text>
          </View>
          <Text style={styles.cardSeller} numberOfLines={1}>
            {item.seller?.name}
          </Text>
          <Text style={styles.cardTime}>{fmtDate(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// ─── CREATE LISTING SCREEN ────────────────────────────────────────────────────
const CreateListing = ({ onBack }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "Other",
    description: "",
    contact: "",
  });

  return (
    <View style={styles.createContainer}>
      <View style={styles.createHeader}>
        <TouchableOpacity onPress={onBack} style={styles.createBackBtn}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.createHeaderTitle}>New Listing</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        <Text style={styles.inputLabel}>Photos (max 4)</Text>
        <View style={styles.photoGrid}>
          {[0, 1, 2, 3].map((i) => (
            <TouchableOpacity key={i} style={styles.photoBox}>
              <MaterialCommunityIcons
                name="camera-plus-outline"
                size={22}
                color="#9CA3AF"
              />
              {i === 0 && <Text style={styles.photoBoxLabel}>Main</Text>}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. iPhone 12 64GB"
            placeholderTextColor="#9CA3AF"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Price (₦) *</Text>
            <TextInput
              style={styles.input}
              placeholder="50000"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              value={form.price}
              onChangeText={(t) => setForm({ ...form, price: t })}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.inputLabel}>Contact *</Text>
            <TextInput
              style={styles.input}
              placeholder="08012345678"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              value={form.contact}
              onChangeText={(t) => setForm({ ...form, contact: t })}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Description *</Text>
          <TextInput
            style={[
              styles.input,
              { height: 100, textAlignVertical: "top", paddingTop: 12 },
            ]}
            placeholder="Describe your item or service..."
            placeholderTextColor="#9CA3AF"
            multiline
            value={form.description}
            onChangeText={(t) => setForm({ ...form, description: t })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {[
                "Food",
                "Electronics",
                "Services",
                "Furniture",
                "Clothing",
                "Other",
              ].map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setForm({ ...form, category: c })}
                  style={[
                    styles.catPill,
                    form.category === c && { backgroundColor: "#10B981" },
                  ]}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      form.category === c && { color: "white" },
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Post Listing</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

// ─── MAIN MARKETPLACE SCREEN ──────────────────────────────────────────────────
export default function MarketplaceScreen() {
  const [screen, setScreen] = useState("feed");
  const [selectedListing, setSelectedListing] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, isLoading, isError, refetch } = useFetchData_v2(
    "api/v1/marketRouter",
    "marketplace",
  );

  const allListings = data?.data || [];

  const filtered = allListings.filter((l) => {
    // only show approved listings
    if (l.status !== "Approve") return false;
    const matchCat = activeCategory === "All" || l.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleView = (item) => {
    setSelectedListing(item);
    setScreen("detail");
  };

  if (screen === "detail" && selectedListing) {
    return (
      <ListingDetail
        listing={selectedListing}
        onBack={() => setScreen("feed")}
      />
    );
  }

  if (screen === "create") {
    return <CreateListing onBack={() => setScreen("feed")} />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Marketplace</Text>
          <Text style={styles.headerSub}>
            {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setScreen("create")}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Feather
          name="search"
          size={16}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search listings..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryRow}
      >
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[
              styles.catChip,
              activeCategory === cat && styles.catChipActive,
            ]}
          >
            <Text
              style={[
                styles.catChipText,
                activeCategory === cat && styles.catChipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.centerStateText}>Loading listings...</Text>
        </View>
      ) : isError ? (
        <View style={styles.centerState}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={48}
            color="#D1D5DB"
          />
          <Text style={styles.centerStateText}>Failed to load</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ListingCard item={item} onPress={handleView} />
          )}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="store-off-outline"
                size={56}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No listings found</Text>
              <Text style={styles.emptySub}>
                Try a different search or category
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10, //.. Platform.OS === "ios" ? 56 : 20,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.3,
  },
  headerSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },

  categoryRow: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  catChipActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  catChipText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  catChipTextActive: { color: "white" },

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

  card: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 0.5,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageBox: {
    height: 180,
    backgroundColor: "#F3F4F6",
    position: "relative",
  },
  cardImageCount: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 99,
  },
  cardImageCountText: { fontSize: 11, color: "white", fontWeight: "600" },
  soldOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  soldText: {
    color: "white",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 3,
  },
  cardBody: { padding: 14 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardDesc: { fontSize: 12, color: "#9CA3AF", marginBottom: 8 },
  cardPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#10B981",
    marginBottom: 10,
  },
  cardFooter: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardAvatar: {
    width: 20,
    height: 20,
    borderRadius: 99,
    justifyContent: "center",
    alignItems: "center",
  },
  cardAvatarText: { fontSize: 10, fontWeight: "700" },
  cardSeller: { flex: 1, fontSize: 11, color: "#6B7280", fontWeight: "500" },
  cardTime: { fontSize: 11, color: "#D1D5DB" },

  emptyState: { alignItems: "center", paddingVertical: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: "#374151" },
  emptySub: { fontSize: 13, color: "#9CA3AF" },

  // Detail
  detailContainer: { flex: 1, backgroundColor: "#F9FAFB" },
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
  detailBody: { padding: 20 },
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
  detailTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    marginRight: 12,
  },
  detailPrice: { fontSize: 20, fontWeight: "800", color: "#10B981" },
  postedAt: { fontSize: 12, color: "#9CA3AF", marginBottom: 14 },
  detailDesc: {
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
  sellerAddress: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
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

  // Create
  createContainer: { flex: 1, backgroundColor: "#F9FAFB" },
  createHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
    paddingBottom: 16,
    backgroundColor: "white",
    borderBottomWidth: 0.5,
    borderBottomColor: "#F3F4F6",
  },
  createBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  createHeaderTitle: { fontSize: 17, fontWeight: "700", color: "#111827" },
  photoGrid: { flexDirection: "row", gap: 10, marginBottom: 20, marginTop: 6 },
  photoBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  photoBoxLabel: { fontSize: 10, color: "#9CA3AF", fontWeight: "600" },
  inputGroup: { marginBottom: 14 },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  catPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
  },
  catPillText: { fontSize: 12, color: "#6B7280", fontWeight: "500" },
  submitBtn: {
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
