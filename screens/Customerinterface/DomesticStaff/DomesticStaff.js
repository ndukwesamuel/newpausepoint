import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  StatusBar,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import LottieView from "lottie-react-native";

import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { formatDate } from "../../../utils/DateTime";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const ROLE_COLORS = {
  Housekeeper: { bg: "#D1FAE5", text: "#065F46" },
  Driver: { bg: "#DBEAFE", text: "#1E40AF" },
  Cook: { bg: "#FEF3C7", text: "#92400E" },
  Gardener: { bg: "#FCE7F3", text: "#9D174D" },
  Security: { bg: "#FEE2E2", text: "#991B1B" },
  Nanny: { bg: "#EDE9FE", text: "#5B21B6" },
};

const getRoleStyle = (role) =>
  ROLE_COLORS[role] || { bg: "#F3F4F6", text: "#374151" };

const DomesticStaff = () => {
  const navigation = useNavigation();
  const animation = useRef(null);

  const {
    data: domesticData,
    isFetching,
    refetch,
  } = useFetchData_v2("api/v1/domestic", "domesticStaff");
  const [searchQuery, setSearchQuery] = useState("");

  console.log({
    yyy: domesticData,
  });

  const staffList = domesticData?.domesticStaff || [];
  const totalStaff = staffList.length;

  const filteredData = staffList.filter((item) =>
    item.staffName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // ── Staff card ───────────────────────────────────────────
  const StaffCard = ({ item }) => {
    const roleStyle = getRoleStyle(item.Role);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("domesticDetail", { itemdata: item })
        }
        activeOpacity={0.85}
      >
        {/* Left — avatar */}
        <View style={styles.avatarWrap}>
          <Image
            source={{ uri: item.photo }}
            style={styles.avatar}
            defaultSource={{
              uri: "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg",
            }}
          />
          {/* Gender dot */}
          <View
            style={[
              styles.genderDot,
              {
                backgroundColor:
                  item.gender === "Female" ? "#EC4899" : "#3B82F6",
              },
            ]}
          />
        </View>

        {/* Right — info */}
        <View style={styles.cardBody}>
          <View style={styles.cardTop}>
            <Text style={styles.staffName} numberOfLines={1}>
              {item.staffName}
            </Text>
            <View style={[styles.roleBadge, { backgroundColor: roleStyle.bg }]}>
              <Text style={[styles.roleBadgeText, { color: roleStyle.text }]}>
                {item.Role}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="phone-outline"
              size={13}
              color="#9CA3AF"
            />
            <Text style={styles.infoText}>{item.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color="#9CA3AF"
            />
            <Text style={styles.infoText}>{item.workingHours}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.codeWrap}>
              <MaterialCommunityIcons
                name="identifier"
                size={12}
                color="#6B7280"
              />
              <Text style={styles.codeText}>{item.staffCode}</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color="#D1D5DB"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Empty state ──────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyWrap}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.lottie}
        source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
      />
      <Text style={styles.emptyTitle}>
        {searchQuery ? "No results found" : "No staff records yet"}
      </Text>
      <Text style={styles.emptySub}>
        {searchQuery
          ? `No staff matching "${searchQuery}"`
          : "Tap + to add your first domestic staff"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Page header ─────────────────────── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Domestic Staff</Text>
          <Text style={styles.pageSub}>
            {totalStaff} staff member{totalStaff !== 1 ? "s" : ""} registered
          </Text>
        </View>
        <View style={styles.statBadge}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color="#10B981"
          />
          <Text style={styles.statBadgeText}>{totalStaff}</Text>
        </View>
      </View>

      {/* ── Search ──────────────────────────── */}
      <View style={styles.searchRow}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#9CA3AF"
          style={{ marginRight: 8 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color="#9CA3AF"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* ── List ────────────────────────────── */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <StaffCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      {/* ── FAB ─────────────────────────────── */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("creatdomestic")}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Header
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.4,
  },
  pageSub: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 2,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  statBadgeText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#065F46",
  },

  // Search
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
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

  listContent: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 120,
  },

  // Card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
  },
  genderDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  cardBody: {
    flex: 1,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  staffName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  infoText: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  codeWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  codeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.5,
  },

  // Empty
  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 21,
    fontWeight: "500",
  },

  // FAB
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default DomesticStaff;
