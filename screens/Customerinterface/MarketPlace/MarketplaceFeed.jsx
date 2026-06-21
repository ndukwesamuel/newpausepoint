import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Platform,
  Image,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import {
  fmt,
  fmtDate,
  getInitials,
  categoryColor,
  CATEGORIES,
} from "./marketplaceHelpers";

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

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
export default function MarketplaceFeed() {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data, isLoading, isError, refetch } = useFetchData_v2(
    "api/v1/marketRouter",
    "marketplace",
  );

  const allListings = data?.data || [];

  const filtered = allListings.filter((l) => {
    // if (l.status !== "Approve") return false;
    const matchCat = activeCategory === "All" || l.category === activeCategory;
    const matchSearch =
      !search.trim() ||
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
        <View style={styles.headerBtns}>
          <TouchableOpacity
            style={styles.myListingsBtn}
            onPress={() => navigation.navigate("MarketplaceMyListings")}
          >
            <MaterialCommunityIcons
              name="store-outline"
              size={18}
              color="#10B981"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("MarketplaceCreate")}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        </View>
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
            <ListingCard
              item={item}
              onPress={(listing) =>
                navigation.navigate("MarketplaceDetail", { listing })
              }
            />
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 20,
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
  headerBtns: { flexDirection: "row", gap: 8, alignItems: "center" },
  myListingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#D1FAE5",
  },
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
});
