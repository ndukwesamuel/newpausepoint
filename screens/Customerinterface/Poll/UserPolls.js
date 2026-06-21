// export default UserPolls;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  StatusBar,
  Animated,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";

import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const UserPolls = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const animation = useRef(null);

  const { get_all_poll_data } = useSelector((state) => state?.PollSlice);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(Get_All_Polls_Fun());
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(Get_All_Polls_Fun()).finally(() => setRefreshing(false));
  };

  const filteredData = get_all_poll_data?.data?.filter((item) =>
    item?.question?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalPolls = get_all_poll_data?.data?.length || 0;

  // ── Poll card ────────────────────────────────────────────
  const PollCard = ({ item, index }) => {
    const isNew =
      new Date(item?.createdAt) >
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 2); // within 2 days


      console.log("Poll item:", item);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("estatepollsdetail", { itemdata: item })
        }
        activeOpacity={0.85}
      >
        {/* Card header */}
        <View style={styles.cardHeader}>
          <View style={styles.cardIconWrap}>
            <MaterialCommunityIcons name="poll" size={20} color="#10B981" />
          </View>
          <View style={styles.cardBadgeRow}>
            {isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            <View style={styles.pollBadge}>
              <Text style={styles.pollBadgeText}>Poll</Text>
            </View>
          </View>
        </View>

        {/* Question */}
        <View style={styles.cardBody}>
          <Text style={styles.questionLabel}>Question</Text>
          <Text style={styles.questionText} numberOfLines={3}>
            {item?.question}
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={13}
              color="#9CA3AF"
            />
            <Text style={styles.dateText}>
              {formatDateandTime(item?.createdAt)}
            </Text>
          </View>
          <View style={styles.viewBtn}>
            <Text style={styles.viewBtnText}>View</Text>
            <MaterialCommunityIcons
              name="arrow-right"
              size={14}
              color="#10B981"
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
        {searchQuery ? "No results found" : "No polls yet"}
      </Text>
      <Text style={styles.emptySub}>
        {searchQuery
          ? "Try a different search term"
          : "Pull down to refresh and check for new polls"}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ── Page header ─────────────────────── */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Estate Polls</Text>
          <Text style={styles.pageSub}>
            {totalPolls} poll{totalPolls !== 1 ? "s" : ""} from your estate
          </Text>
        </View>
        <View style={styles.statBadge}>
          <MaterialCommunityIcons name="poll" size={16} color="#10B981" />
          <Text style={styles.statBadgeText}>{totalPolls}</Text>
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
          placeholder="Search polls..."
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
        keyExtractor={(item, index) =>
          item?._id?.toString() || index.toString()
        }
        renderItem={({ item, index }) => <PollCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
        ListEmptyComponent={<EmptyState />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // Page header
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
    paddingBottom: 100,
  },

  // Poll card
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  cardBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  newBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#92400E",
    letterSpacing: 0.5,
  },
  pollBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pollBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#065F46",
  },

  cardBody: {
    marginBottom: 14,
  },
  questionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 23,
    letterSpacing: -0.2,
  },

  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
  },
  viewBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
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
});

export default UserPolls;
