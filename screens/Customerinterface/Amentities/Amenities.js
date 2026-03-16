import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  RefreshControl,
  StatusBar,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
// import { Image } from "expo-image";
// import ScreenWrapper from "../../components/shared/ScreenWrapper";
import { MOCK_AMENITIES, STATUS_CONFIG, AMENITY_STATUS } from "./amenityData";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const FILTERS = ["All", "Open", "Closed", "Maintenance"];

const AmenitiesListScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  // ── Filter logic ──────────────────────────────────────────
  const filtered = MOCK_AMENITIES.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    if (activeFilter === "All") return matchSearch;
    if (activeFilter === "Open")
      return matchSearch && a.status === AMENITY_STATUS.OPEN;
    if (activeFilter === "Closed")
      return matchSearch && a.status === AMENITY_STATUS.CLOSED;
    if (activeFilter === "Maintenance")
      return matchSearch && a.status === AMENITY_STATUS.UNDER_MAINTENANCE;
    return matchSearch;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: refetch from API
    setTimeout(() => setRefreshing(false), 1000);
  };

  // ── Header shrink animation ──────────────────────────────
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [100, 60],
    extrapolate: "clamp",
  });
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // ── Amenity card ─────────────────────────────────────────
  const renderCard = ({ item, index }) => {
    const statusCfg = STATUS_CONFIG[item.status];

    return (
      <TouchableOpacity
        style={styles.card}
        // onPress={() => navigation.navigate("AmenityDetail", { amenity: item })}
        activeOpacity={0.88}
      >
        {/* Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.cardImage}
            contentFit="cover"
            transition={300}
          />
          {/* Status badge overlay */}
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <View
              style={[styles.statusDot, { backgroundColor: statusCfg.dot }]}
            />
            <Text style={[styles.statusText, { color: statusCfg.text }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Info */}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <View style={styles.iconWrap}>
              <MaterialCommunityIcons
                name={item.iconName}
                size={20}
                color="#10B981"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={styles.locationRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={13}
                  color="#9CA3AF"
                />
                <Text style={styles.locationText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#D1D5DB"
            />
          </View>

          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.cardFooter}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color="#9CA3AF"
            />
            <Text style={styles.hoursText}>{item.operatingHours}</Text>
          </View>

          {/* Maintenance notice */}
          {item.status === AMENITY_STATUS.UNDER_MAINTENANCE &&
            item.estimatedReopenDate && (
              <View style={styles.maintenanceBar}>
                <MaterialCommunityIcons
                  name="wrench-outline"
                  size={13}
                  color="#92400E"
                />
                <Text style={styles.maintenanceText}>
                  Reopens{" "}
                  {new Date(item.estimatedReopenDate).toLocaleDateString(
                    undefined,
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                </Text>
              </View>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper title="Amenities" navigation={navigation} showHeader={false}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      <View style={styles.container}>
        {/* ── Top header ───────────────────────── */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.headerTitle}>Amenities</Text>
            <Text style={styles.headerSub}>
              {
                MOCK_AMENITIES.filter((a) => a.status === AMENITY_STATUS.OPEN)
                  .length
              }{" "}
              of {MOCK_AMENITIES.length} facilities open
            </Text>
          </View>
          {/* <TouchableOpacity
            style={styles.myReportsBtn}
            onPress={() => navigation.navigate("MyReports")}
          >
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={20}
              color="#10B981"
            />
            <Text style={styles.myReportsBtnText}>My Reports</Text>
          </TouchableOpacity> */}
        </View>

        {/* ── Search ───────────────────────────── */}
        <View style={styles.searchRow}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#9CA3AF"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search amenities..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={18}
                color="#9CA3AF"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ── Filter chips ─────────────────────── */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.chip, activeFilter === f && styles.chipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text
                style={[
                  styles.chipText,
                  activeFilter === f && styles.chipTextActive,
                ]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── List ─────────────────────────────── */}
        <Animated.FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <MaterialCommunityIcons
                name="office-building-remove"
                size={56}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No amenities found</Text>
              <Text style={styles.emptySub}>
                Try adjusting your search or filter
              </Text>
            </View>
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#F9FAFB",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  myReportsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  myReportsBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#F3F4F6",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  cardBody: {
    padding: 16,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  cardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.2,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    flex: 1,
  },
  cardDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 10,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  hoursText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  maintenanceBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
  },
  maintenanceText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },

  emptyWrap: {
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

export default AmenitiesListScreen;
