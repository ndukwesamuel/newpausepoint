

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AppScreen from "../../../components/shared/AppScreen";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

const { height } = Dimensions.get("window");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDateTime = (dateString) => {
  if (!dateString) return { date: "N/A", time: "N/A" };
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

const getResultConfig = (result) => {
  switch (result) {
    case "granted":
      return { color: "#059669", bg: "#ECFDF5", icon: "checkmark-circle", label: "Access Granted" };
    case "denied":
      return { color: "#DC2626", bg: "#FEF2F2", icon: "close-circle", label: "Access Denied" };
    default:
      return { color: "#6B7280", bg: "#F9FAFB", icon: "help-circle", label: result };
  }
};

// ─── History Detail Modal ──────────────────────────────────────────────────────

const HistoryDetailModal = ({ item, visible, onClose }) => {
  if (!item) return null;

  const result = getResultConfig(item.result);
  const { date, time } = formatDateTime(item.accessed_at);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableOpacity
        style={modalStyles.backdrop}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <View style={modalStyles.sheet}>
        <View style={modalStyles.handle} />

        {/* Result Hero */}
        <View style={[modalStyles.hero, { backgroundColor: result.bg }]}>
          <Ionicons name={result.icon} size={48} color={result.color} />
          <Text style={[modalStyles.heroLabel, { color: result.color }]}>
            {result.label}
          </Text>
        </View>

        {/* Details */}
        <View style={modalStyles.detailsCard}>

          <View style={modalStyles.row}>
            <View style={modalStyles.rowIcon}>
              <Ionicons name="finger-print-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={modalStyles.rowLabel}>Card UID</Text>
            <Text style={modalStyles.rowValue}>{item.uid}</Text>
          </View>

          <View style={modalStyles.row}>
            <View style={modalStyles.rowIcon}>
              <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={modalStyles.rowLabel}>Date</Text>
            <Text style={modalStyles.rowValue}>{date}</Text>
          </View>

          <View style={modalStyles.row}>
            <View style={modalStyles.rowIcon}>
              <Ionicons name="time-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={modalStyles.rowLabel}>Time</Text>
            <Text style={[modalStyles.rowValue, { color: result.color }]}>{time}</Text>
          </View>

          <View style={modalStyles.row}>
            <View style={modalStyles.rowIcon}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={modalStyles.rowLabel}>Result</Text>
            <Text style={[modalStyles.rowValue, { color: result.color, fontWeight: "800" }]}>
              {item.result?.toUpperCase()}
            </Text>
          </View>

          {item.deny_reason ? (
            <View style={modalStyles.row}>
              <View style={modalStyles.rowIcon}>
                <Ionicons name="alert-circle-outline" size={16} color="#9CA3AF" />
              </View>
              <Text style={modalStyles.rowLabel}>Reason</Text>
              <Text style={[modalStyles.rowValue, { color: "#DC2626" }]}>
                {item.deny_reason}
              </Text>
            </View>
          ) : null}

          <View style={[modalStyles.row, { borderBottomWidth: 0 }]}>
            <View style={modalStyles.rowIcon}>
              <Ionicons name="receipt-outline" size={16} color="#9CA3AF" />
            </View>
            <Text style={modalStyles.rowLabel}>Record ID</Text>
            <Text style={modalStyles.rowValue}>#{item.id}</Text>
          </View>

        </View>

        {/* Close Button */}
        <TouchableOpacity style={modalStyles.closeBtn} onPress={onClose}>
          <Text style={modalStyles.closeBtnText}>Close</Text>
        </TouchableOpacity>

        <View style={{ height: 20 }} />
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
  backdrop: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  hero: {
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  heroLabel: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 0.3,
  },
  detailsCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 10,
  },
  rowIcon: {
    width: 28,
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
    width: 80,
  },
  rowValue: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    textAlign: "right",
  },
  closeBtn: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  closeBtnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "700",
  },
});

// ─── Card Widget ──────────────────────────────────────────────────────────────

const CardWidget = ({ card }) => {
  const isActive = card?.status === "active";

  return (
    <View style={cardStyles.card}>
      <View style={cardStyles.circle1} />
      <View style={cardStyles.circle2} />

      <View style={cardStyles.topRow}>
        <View style={cardStyles.chipContainer}>
          <MaterialCommunityIcons name="integrated-circuit-chip" size={32} color="#F59E0B" />
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: isActive ? "#10B981" : "#EF4444" }]}>
          <View style={cardStyles.statusDot} />
          <Text style={cardStyles.statusText}>{isActive ? "ACTIVE" : "INACTIVE"}</Text>
        </View>
      </View>

      <Text style={cardStyles.uidLabel}>Card UID</Text>
      <Text style={cardStyles.uid}>{card?.uid || "N/A"}</Text>

      <View style={cardStyles.bottomRow}>
        <View>
          <Text style={cardStyles.smallLabel}>VALID FROM</Text>
          <Text style={cardStyles.smallValue}>{card?.start_date || "N/A"}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={cardStyles.smallLabel}>VALID TO</Text>
          <Text style={cardStyles.smallValue}>{card?.end_date || "N/A"}</Text>
        </View>
      </View>

      <View style={cardStyles.brandRow}>
        <MaterialCommunityIcons name="shield-check" size={16} color="rgba(255,255,255,0.6)" />
        <Text style={cardStyles.brandText}>PausePoint Access Card</Text>
      </View>
    </View>
  );
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    minHeight: 200,
    overflow: "hidden",
    shadowColor: "#111827",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
    position: "relative",
  },
  circle1: {
    position: "absolute", top: -40, right: -40,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  circle2: {
    position: "absolute", bottom: -30, left: -20,
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "rgba(16,185,129,0.12)",
  },
  topRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 24,
  },
  chipContainer: {
    width: 48, height: 36, backgroundColor: "rgba(245,158,11,0.15)",
    borderRadius: 8, justifyContent: "center", alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, gap: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "white" },
  statusText: { color: "white", fontSize: 11, fontWeight: "800", letterSpacing: 0.8 },
  uidLabel: {
    color: "rgba(255,255,255,0.5)", fontSize: 11,
    fontWeight: "600", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4,
  },
  uid: {
    color: "#FFFFFF", fontSize: 22, fontWeight: "700",
    letterSpacing: 3, marginBottom: 24,
  },
  bottomRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  smallLabel: {
    color: "rgba(255,255,255,0.4)", fontSize: 10,
    fontWeight: "600", letterSpacing: 0.8, marginBottom: 2,
  },
  smallValue: { color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: "600" },
  brandRow: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.08)", paddingTop: 12,
  },
  brandText: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "500" },
});

// ─── History Item ─────────────────────────────────────────────────────────────

const HistoryItem = ({ item, isLast, onPress }) => {
  const result = getResultConfig(item.result);
  const { date, time } = formatDateTime(item.accessed_at);

  return (
    <TouchableOpacity
      style={[histStyles.item, !isLast && histStyles.border]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}
    >
      <View style={[histStyles.iconBox, { backgroundColor: result.bg }]}>
        <Ionicons name={result.icon} size={20} color={result.color} />
      </View>

      <View style={histStyles.info}>
        <Text style={histStyles.resultText}>{result.label}</Text>
        <Text style={histStyles.dateText}>{date}</Text>
      </View>

      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <Text style={[histStyles.time, { color: result.color }]}>{time}</Text>
        <Ionicons name="chevron-forward" size={14} color="#D1D5DB" />
      </View>
    </TouchableOpacity>
  );
};

const histStyles = StyleSheet.create({
  item: {
    flexDirection: "row", alignItems: "center",
    paddingVertical: 14, gap: 12,
  },
  border: { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  iconBox: {
    width: 40, height: 40, borderRadius: 12,
    justifyContent: "center", alignItems: "center",
  },
  info: { flex: 1 },
  resultText: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 2 },
  dateText: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  time: { fontSize: 13, fontWeight: "700" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const UserCardScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data, isLoading, isError, refetch } = useFetchData_v2(
    "api/v1/cardreader/Usercard",
    "userCard"
  );

  const card = data?.data?.[0];
  const history = data?.history || [];
  const historyCount = data?.historyCount || 0;

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleHistoryPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  if (isLoading && !refreshing) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.loadingText}>Loading your card...</Text>
        </View>
      </AppScreen>
    );
  }

  if (isError || !card) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <MaterialCommunityIcons name="card-off-outline" size={64} color="#D1D5DB" />
          <Text style={styles.errorTitle}>No Card Found</Text>
          <Text style={styles.errorSub}>You don't have an access card assigned yet.</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#111827" />
        }
      >
        <CardWidget card={card} />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{historyCount}</Text>
            <Text style={styles.statLabel}>Total Access</Text>
          </View>
          <View style={styles.statCard}>
            {/* <Text style={[styles.statValue, { color: "#059669" }]}>
              {history.filter((h) => h.result === "granted").length}
            </Text> */}
            <Text style={styles.statLabel}>Granted</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: "#DC2626" }]}>
              {history.filter((h) => h.result === "denied").length}
            </Text>
            <Text style={styles.statLabel}>Denied</Text>
          </View>
        </View>

        {/* History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="history" size={18} color="#10B981" />
            <Text style={styles.sectionTitle}>Access History</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{historyCount}</Text>
            </View>
          </View>

          <View style={styles.historyCard}>
            {history.length === 0 ? (
              <View style={styles.emptyHistory}>
                <MaterialCommunityIcons name="clock-outline" size={40} color="#D1D5DB" />
                <Text style={styles.emptyText}>No access history yet</Text>
              </View>
            ) : (
              history.map((item, index) => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  isLast={index === history.length - 1}
                  onPress={handleHistoryPress}
                />
              ))
            )}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Detail Modal */}
      <HistoryDetailModal
        item={selectedItem}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedItem(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1, justifyContent: "center",
    alignItems: "center", paddingHorizontal: 32,
  },
  loadingText: { marginTop: 12, fontSize: 14, color: "#6B7280", fontWeight: "500" },
  errorTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginTop: 16 },
  errorSub: { fontSize: 14, color: "#9CA3AF", textAlign: "center", marginTop: 8 },
  retryBtn: {
    marginTop: 20, backgroundColor: "#111827",
    paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12,
  },
  retryText: { color: "white", fontWeight: "700", fontSize: 14 },
  statsRow: {
    flexDirection: "row", marginHorizontal: 16, marginTop: 16, gap: 10,
  },
  statCard: {
    flex: 1, backgroundColor: "white", borderRadius: 14,
    padding: 16, alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  statValue: { fontSize: 24, fontWeight: "800", color: "#111827" },
  statLabel: {
    fontSize: 11, color: "#9CA3AF", fontWeight: "600",
    marginTop: 2, textTransform: "uppercase", letterSpacing: 0.4,
  },
  section: { margin: 16, marginTop: 20 },
  sectionHeader: {
    flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827", flex: 1 },
  countBadge: {
    backgroundColor: "#111827", paddingHorizontal: 10,
    paddingVertical: 3, borderRadius: 20,
  },
  countText: { color: "white", fontSize: 12, fontWeight: "700" },
  historyCard: {
    backgroundColor: "white", borderRadius: 16, paddingHorizontal: 16,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  emptyHistory: { paddingVertical: 32, alignItems: "center", gap: 8 },
  emptyText: { fontSize: 14, color: "#9CA3AF", fontWeight: "500" },
});

export default UserCardScreen;