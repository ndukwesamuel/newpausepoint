import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  MOCK_MY_REPORTS,
  REPORT_STATUS_CONFIG,
  REPORT_STATUS,
} from "./amenityData";

const FILTERS = ["All", "Open", "In Progress", "Resolved"];

const MyReportsScreen = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = MOCK_MY_REPORTS.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Open") return r.status === REPORT_STATUS.OPEN;
    if (activeFilter === "In Progress")
      return r.status === REPORT_STATUS.IN_PROGRESS;
    if (activeFilter === "Resolved") return r.status === REPORT_STATUS.RESOLVED;
    return true;
  });

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: refetch from API
    setTimeout(() => setRefreshing(false), 800);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderReport = ({ item }) => {
    const cfg = REPORT_STATUS_CONFIG[item.status];

    return (
      <View style={styles.reportCard}>
        {/* Card header */}
        <View style={styles.reportCardHeader}>
          <View style={styles.amenityIconWrap}>
            <MaterialCommunityIcons
              name={item.amenity.iconName}
              size={18}
              color="#10B981"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.reportAmenityName}>{item.amenity.name}</Text>
            <Text style={styles.reportDate}>
              Submitted {formatDate(item.createdAt)}
            </Text>
          </View>
          {/* Status badge */}
          <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
            <MaterialCommunityIcons
              name={cfg.icon}
              size={13}
              color={cfg.text}
            />
            <Text style={[styles.statusText, { color: cfg.text }]}>
              {cfg.label}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.reportDescription} numberOfLines={3}>
          {item.description}
        </Text>

        {/* Timeline */}
        <View style={styles.timeline}>
          <TimelineDot
            done={true}
            label="Submitted"
            date={formatDate(item.createdAt)}
            color="#10B981"
          />
          <TimelineLine done={item.status !== REPORT_STATUS.OPEN} />
          <TimelineDot
            done={item.status !== REPORT_STATUS.OPEN}
            label="In Progress"
            date={
              item.status !== REPORT_STATUS.OPEN
                ? "Estate team notified"
                : "Pending"
            }
            color="#3B82F6"
          />
          <TimelineLine done={item.status === REPORT_STATUS.RESOLVED} />
          <TimelineDot
            done={item.status === REPORT_STATUS.RESOLVED}
            label="Resolved"
            date={
              item.resolvedAt
                ? formatDate(item.resolvedAt)
                : "Awaiting resolution"
            }
            color="#10B981"
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Header ──────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Reports</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* ── Summary row ─────────────────────── */}
      <View style={styles.summaryRow}>
        <SummaryCard
          count={
            MOCK_MY_REPORTS.filter((r) => r.status === REPORT_STATUS.OPEN)
              .length
          }
          label="Open"
          color="#EF4444"
          bg="#FEE2E2"
        />
        <SummaryCard
          count={
            MOCK_MY_REPORTS.filter(
              (r) => r.status === REPORT_STATUS.IN_PROGRESS,
            ).length
          }
          label="In Progress"
          color="#3B82F6"
          bg="#DBEAFE"
        />
        <SummaryCard
          count={
            MOCK_MY_REPORTS.filter((r) => r.status === REPORT_STATUS.RESOLVED)
              .length
          }
          label="Resolved"
          color="#10B981"
          bg="#D1FAE5"
        />
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

      {/* ── Reports list ─────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderReport}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
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
              name="clipboard-check-outline"
              size={56}
              color="#D1D5DB"
            />
            <Text style={styles.emptyTitle}>No reports here</Text>
            <Text style={styles.emptySub}>
              {activeFilter === "All"
                ? "You haven't submitted any reports yet"
                : `No ${activeFilter.toLowerCase()} reports`}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const SummaryCard = ({ count, label, color, bg }) => (
  <View style={[styles.summaryCard, { backgroundColor: bg }]}>
    <Text style={[styles.summaryCount, { color }]}>{count}</Text>
    <Text style={[styles.summaryLabel, { color }]}>{label}</Text>
  </View>
);

const TimelineDot = ({ done, label, date, color }) => (
  <View style={styles.timelineDotWrap}>
    <View
      style={[
        styles.timelineDot,
        done
          ? { backgroundColor: color, borderColor: color }
          : styles.timelineDotEmpty,
      ]}
    >
      {done && (
        <MaterialCommunityIcons name="check" size={10} color="#FFFFFF" />
      )}
    </View>
    <View style={{ marginLeft: 8, flex: 1 }}>
      <Text style={[styles.timelineLabel, done && { color: "#111827" }]}>
        {label}
      </Text>
      <Text style={styles.timelineDate}>{date}</Text>
    </View>
  </View>
);

const TimelineLine = ({ done }) => (
  <View style={[styles.timelineLine, done && styles.timelineLineDone]} />
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 44,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  // Summary
  summaryRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  summaryCount: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },

  // Filter
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  chipActive: { backgroundColor: "#10B981", borderColor: "#10B981" },
  chipText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  chipTextActive: { color: "#FFFFFF" },

  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 16,
  },

  // Report card
  reportCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  amenityIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  reportAmenityName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  reportDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },
  reportDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: "500",
  },

  // Timeline
  timeline: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  timelineDotWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  timelineDotEmpty: {
    backgroundColor: "#FFFFFF",
    borderColor: "#D1D5DB",
  },
  timelineLine: {
    width: 2,
    height: 16,
    backgroundColor: "#E5E7EB",
    marginLeft: 10,
    marginBottom: 4,
  },
  timelineLineDone: {
    backgroundColor: "#10B981",
  },
  timelineLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  timelineDate: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "400",
    marginTop: 1,
  },

  emptyWrap: {
    alignItems: "center",
    paddingTop: 60,
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
    textAlign: "center",
  },
});

export default MyReportsScreen;
