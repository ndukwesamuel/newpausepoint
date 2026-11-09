import React, { useMemo, useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput,
  RefreshControl, Image, ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { AMENITY_PATH, AMENITY_STATUS_CONFIG, GREEN, formatDate, money } from "../../../components/Amenity/amenityApi";

const FILTERS = [
  { label: "All", value: null },
  { label: "Open", value: "open" },
  { label: "Closed", value: "closed" },
  { label: "Maintenance", value: "under_maintenance" },
];

export const AmenityImage = ({ amenity, style, iconSize = 48 }) =>
  amenity.image?.url ? (
    <Image source={{ uri: amenity.image.url }} style={style} resizeMode="cover" />
  ) : (
    <View style={[style, styles.placeholder]}>
      <MaterialCommunityIcons name={amenity.iconName || "office-building"} size={iconSize} color="#6EE7B7" />
    </View>
  );

const AmenitiesScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState(null);
  const { data, isLoading, isRefetching, refetch, error } = useFetchData_v2(AMENITY_PATH, "amenities");
  const amenities = data?.data?.amenities || [];

  const filtered = useMemo(
    () => amenities.filter((a) =>
      a.name.toLowerCase().includes(search.trim().toLowerCase()) && (!filter || a.status === filter)),
    [amenities, search, filter],
  );
  const openCount = amenities.filter((a) => a.status === "open").length;

  const renderCard = ({ item }) => {
    const cfg = AMENITY_STATUS_CONFIG[item.status] || AMENITY_STATUS_CONFIG.open;
    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.88} onPress={() => navigation.navigate("AmenityDetail", { amenity: item })}>
        <View>
          <AmenityImage amenity={item} style={styles.cardImage} />
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
            <Text style={[styles.statusText, { color: cfg.text }]}>{cfg.label}</Text>
          </View>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons name={item.iconName || "office-building"} size={20} color={GREEN} />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              {item.location ? (
                <View style={styles.row}>
                  <MaterialCommunityIcons name="map-marker-outline" size={13} color="#9CA3AF" />
                  <Text style={styles.muted} numberOfLines={1}>{item.location}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.priceTag, item.isPaid && styles.priceTagPaid]}>
              {item.isPaid ? (item.price ? money(item.price) : "Paid") : "Free"}
            </Text>
          </View>
          {item.description ? <Text style={styles.cardDescription} numberOfLines={2}>{item.description}</Text> : null}
          {item.operatingHours ? (
            <View style={styles.row}>
              <MaterialCommunityIcons name="clock-outline" size={13} color="#9CA3AF" />
              <Text style={styles.muted}>{item.operatingHours}</Text>
            </View>
          ) : null}
          {item.status === "under_maintenance" && item.estimatedReopenDate ? (
            <View style={styles.maintenanceBar}>
              <MaterialCommunityIcons name="wrench-outline" size={13} color="#92400E" />
              <Text style={styles.maintenanceText}>Reopens {formatDate(item.estimatedReopenDate)}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerSub}>
          {isLoading ? "Loading…" : `${openCount} of ${amenities.length} facilities open`}
        </Text>
        <TouchableOpacity style={styles.myReportsBtn} onPress={() => navigation.navigate("MyAmenityReports")}>
          <MaterialCommunityIcons name="clipboard-list-outline" size={18} color={GREEN} />
          <Text style={styles.myReportsBtnText}>My Reports</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <MaterialCommunityIcons name="magnify" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Search amenities..." placeholderTextColor="#9CA3AF" value={search} onChangeText={setSearch} />
        {search ? (
          <TouchableOpacity onPress={() => setSearch("")}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity key={f.label} style={[styles.chip, filter === f.value && styles.chipActive]} onPress={() => setFilter(f.value)}>
            <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator color={GREEN} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GREEN} />}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons name="office-building-remove" size={56} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>{error ? "Couldn't load amenities" : "No amenities found"}</Text>
              <Text style={styles.emptySub}>
                {error ? error.message : amenities.length ? "Try adjusting your search or filter" : "Your estate hasn't added any amenities yet"}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  topHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerSub: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  myReportsBtn: { flexDirection: "row", alignItems: "center", backgroundColor: "#D1FAE5", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, gap: 6 },
  myReportsBtnText: { fontSize: 13, fontWeight: "700", color: "#065F46" },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#FFFFFF", marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  searchInput: { flex: 1, fontSize: 15, color: "#111827", fontWeight: "500" },
  filterRow: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 20, marginBottom: 16, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E7EB" },
  chipActive: { backgroundColor: GREEN, borderColor: GREEN },
  chipText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  chipTextActive: { color: "#FFFFFF" },
  listContent: { paddingHorizontal: 20, paddingBottom: 100, gap: 16 },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden", elevation: 3, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } },
  cardImage: { width: "100%", height: 160, backgroundColor: "#F3F4F6" },
  placeholder: { justifyContent: "center", alignItems: "center", backgroundColor: "#ECFDF5" },
  statusBadge: { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: "700" },
  cardBody: { padding: 16, gap: 8 },
  cardTop: { flexDirection: "row", alignItems: "center" },
  iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center" },
  cardName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  row: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  muted: { fontSize: 13, color: "#9CA3AF", fontWeight: "500", flexShrink: 1 },
  priceTag: { fontSize: 12, fontWeight: "700", color: "#065F46", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: "hidden" },
  priceTagPaid: { color: "#92400E", backgroundColor: "#FEF3C7" },
  cardDescription: { fontSize: 14, color: "#6B7280", lineHeight: 20 },
  maintenanceBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#FEF3C7", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 6 },
  maintenanceText: { fontSize: 12, color: "#92400E", fontWeight: "600" },
  emptyWrap: { alignItems: "center", paddingTop: 80, gap: 8, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#374151" },
  emptySub: { fontSize: 14, color: "#9CA3AF", fontWeight: "500", textAlign: "center" },
});

export default AmenitiesScreen;
