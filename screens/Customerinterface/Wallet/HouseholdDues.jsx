import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import {
  RegularFontText,
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";
import AppScreen from "../../../components/shared/AppScreen";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatCurrency = (amount) =>
  `₦${(amount || 0).toLocaleString("en-NG")}`;

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusConfig = (status) => {
  switch (status) {
    case "paid":    return { bg: "#ECFDF5", color: "#059669", border: "#6EE7B7", icon: "checkmark-circle", label: "Paid" };
    case "unpaid":  return { bg: "#FFFBEB", color: "#D97706", border: "#FCD34D", icon: "time",             label: "Unpaid" };
    case "overdue": return { bg: "#FEF2F2", color: "#DC2626", border: "#FCA5A5", icon: "alert-circle",     label: "Overdue" };
    case "waived":  return { bg: "#EEF2FF", color: "#6366F1", border: "#A5B4FC", icon: "close-circle",     label: "Waived" };
    case "manual":  return { bg: "#EFF6FF", color: "#3B82F6", border: "#93C5FD", icon: "cash",             label: "Cash Paid" };
    default:        return { bg: "#F9FAFB", color: "#6B7280", border: "#E5E7EB", icon: "help-circle",      label: status };
  }
};

const getCategoryConfig = (category) => {
  switch (category) {
    case "annual_levy":        return { icon: "calendar-outline",      color: "#8B5CF6", bg: "#F5F3FF", label: "Annual Levy" };
    case "security":           return { icon: "shield-checkmark",      color: "#10B981", bg: "#ECFDF5", label: "Security" };
    case "development":        return { icon: "construct-outline",     color: "#F59E0B", bg: "#FFFBEB", label: "Development" };
    case "maintenance":        return { icon: "build-outline",         color: "#3B82F6", bg: "#EFF6FF", label: "Maintenance" };
    case "special_assessment": return { icon: "star-outline",          color: "#EC4899", bg: "#FDF2F8", label: "Special" };
    default:                   return { icon: "document-text-outline", color: "#6B7280", bg: "#F9FAFB", label: "Other" };
  }
};

// ─── StatPill ─────────────────────────────────────────────────────────────────

const StatPill = ({ label, value, color, bg }) => (
  <View style={[statStyles.pill, { backgroundColor: bg }]}>
    <Text style={[statStyles.value, { color }]}>{value}</Text>
    <Text style={statStyles.label}>{label}</Text>
  </View>
);

const statStyles = StyleSheet.create({
  pill:  { flex: 1, borderRadius: 16, padding: 16, alignItems: "center" },
  value: { fontSize: 18, fontWeight: "800", marginBottom: 2 },
  label: { fontSize: 10, color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
});

// ─── TabPill ──────────────────────────────────────────────────────────────────

const TabPill = ({ title, count, isActive, onPress }) => (
  <TouchableOpacity
    style={[tabStyles.pill, isActive && tabStyles.pillActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[tabStyles.text, isActive && tabStyles.textActive]}>{title}</Text>
    {count > 0 && (
      <View style={[tabStyles.badge, isActive && tabStyles.badgeActive]}>
        <Text style={[tabStyles.badgeText, isActive && tabStyles.badgeTextActive]}>
          {count}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const tabStyles = StyleSheet.create({
  pill:            { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#F3F4F6", gap: 6 },
  pillActive:      { backgroundColor: "#111827" },
  text:            { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  textActive:      { color: "white" },
  badge:           { backgroundColor: "#E5E7EB", paddingHorizontal: 7, paddingVertical: 1, borderRadius: 10, minWidth: 20, alignItems: "center" },
  badgeActive:     { backgroundColor: "rgba(255,255,255,0.25)" },
  badgeText:       { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  badgeTextActive: { color: "white" },
});

// ─── DueCard ──────────────────────────────────────────────────────────────────

const DueCard = ({ due, onPress }) => {
  const status   = getStatusConfig(due.status);
  const category = getCategoryConfig(due.category);

  return (
    <TouchableOpacity
      style={cardStyles.card}
      onPress={() => onPress(due)}
      activeOpacity={0.8}
    >
      <View style={cardStyles.topRow}>
        <View style={[cardStyles.iconBox, { backgroundColor: category.bg }]}>
          <Ionicons name={category.icon} size={22} color={category.color} />
        </View>
        <View style={cardStyles.titleBox}>
          <Text style={cardStyles.title} numberOfLines={1}>{due.title}</Text>
          <Text style={cardStyles.categoryLabel}>{category.label}</Text>
        </View>
        <View style={[cardStyles.statusBadge, { backgroundColor: status.bg, borderColor: status.border }]}>
          <Ionicons name={status.icon} size={12} color={status.color} />
          <Text style={[cardStyles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={cardStyles.divider} />

      <View style={cardStyles.bottomRow}>
        <View>
          <Text style={cardStyles.amountLabel}>Amount Due</Text>
          <Text style={cardStyles.amountValue}>{formatCurrency(due.amountDue)}</Text>
        </View>
        {due.amountPaid > 0 && (
          <View>
            <Text style={cardStyles.amountLabel}>Paid</Text>
            <Text style={[cardStyles.amountValue, { color: "#10B981" }]}>
              {formatCurrency(due.amountPaid)}
            </Text>
          </View>
        )}
        <View style={cardStyles.dateBlock}>
          <Ionicons name="calendar-outline" size={13} color={due.isOverdue ? "#DC2626" : "#9CA3AF"} />
          <Text style={[cardStyles.dateText, due.isOverdue && { color: "#DC2626" }]}>
            {formatDate(due.dueDate)}
          </Text>
        </View>
      </View>

      {due.isOverdue && (
        <View style={cardStyles.overdueBar}>
          <Ionicons name="warning" size={13} color="#DC2626" />
          <Text style={cardStyles.overdueText}>Payment overdue</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const cardStyles = StyleSheet.create({
  card:          { backgroundColor: "white", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
  topRow:        { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox:       { width: 44, height: 44, borderRadius: 12, justifyContent: "center", alignItems: "center" },
  titleBox:      { flex: 1 },
  title:         { fontSize: 15, fontWeight: "700", color: "#111827", marginBottom: 2 },
  categoryLabel: { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  statusBadge:   { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  statusText:    { fontSize: 11, fontWeight: "700" },
  divider:       { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
  bottomRow:     { flexDirection: "row", alignItems: "center", gap: 16 },
  amountLabel:   { fontSize: 10, color: "#9CA3AF", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 2 },
  amountValue:   { fontSize: 15, fontWeight: "800", color: "#111827" },
  dateBlock:     { flexDirection: "row", alignItems: "center", gap: 4, marginLeft: "auto" },
  dateText:      { fontSize: 12, color: "#9CA3AF", fontWeight: "500" },
  overdueBar:    { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: "#FEF2F2", borderRadius: 8 },
  overdueText:   { fontSize: 12, color: "#DC2626", fontWeight: "600" },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const HouseholdDues = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("all");

  const {
    data: duesResponse,
    isLoading,
    error,
    refetch,
  } = useFetchData_v2("api/v1/householdDue/user", "getUserHouseholdDues");


  console.log({
    hhhff:duesResponse
  });
  

  // ── Parse — handle both array and object shape ──
  const overallSummary = duesResponse?.overallSummary || {};
  const householdsRaw  = duesResponse?.households;
  const householdEntry = Array.isArray(householdsRaw) ? householdsRaw[0] : householdsRaw;
  const householdInfo  = householdEntry?.household || {};
  const dues           = householdEntry?.dues || { all: [], unpaid: [], paid: [], overdue: [], exempted: [] };
  const currentDues    = dues[activeTab] || [];

  const handleDuePress = (due) => {
    navigation.navigate("HouseholdDueDetail", {
      due,
      householdId: householdInfo?._id,
    });
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your dues...</Text>
        </View>
      </AppScreen>
    );
  }

  // ── Error ──
  if (error || !duesResponse) {
    const noHousehold = error?.message?.includes("don't belong to any household");
    return (
      <AppScreen>
        <View style={styles.centered}>
          {noHousehold ? (
            <>
              <TouchableOpacity style={styles.errorIconBox}
              onPress={
                () =>navigation.goBack()

                
              }
              >
                <Ionicons name="home-outline" size={40} color="#D1D5DB" />
              </TouchableOpacity>
              <Text style={styles.errorTitle}>Not in a household yet</Text>
              <Text style={styles.errorBody}>
                You need to be added to a household before you can view dues.
                Contact your estate admin.
              </Text>
            </>
          ) : (
            <>
              <View style={[styles.errorIconBox, { backgroundColor: "#FEF2F2" }]}>
                <Ionicons name="alert-circle-outline" size={40} color="#DC2626" />
              </View>
              <Text style={styles.errorTitle}>Failed to load dues</Text>
              <Text style={styles.errorBody}>{error?.message || "Please try again"}</Text>
              <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>

            <View style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#E5E7EB",
              marginBottom: 8,
            }}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  style={styles.backButton}
                >
                  <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>

              </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F8FAFC" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor="#10B981" />
        }
      >
        {/* ── Hero Card ── */}
        <View style={styles.heroCard}>
          {householdInfo?._id && (
            <View style={styles.householdRow}>
              <View style={styles.homeIconBox}>
                <Ionicons name="home" size={16} color="#10B981" />
              </View>
              <Text style={styles.householdName}>{householdInfo.name}</Text>
              <Text style={styles.householdType}>{householdInfo.type}</Text>
              {householdInfo.isLeader && (
                <View style={styles.leaderBadge}>
                  <MaterialCommunityIcons name="crown" size={12} color="#F59E0B" />
                  <Text style={styles.leaderText}>Leader</Text>
                </View>
              )}
            </View>
          )}

          <Text style={styles.heroHeading}>My Dues</Text>

          <View style={styles.statsRow}>
            <StatPill
              label="Total"
              value={(overallSummary?.totalDues ?? 0).toString()}
              color="#3B82F6"
              bg="rgba(59,130,246,0.1)"
            />
            <View style={styles.statsDivider} />
            <StatPill
              label="Unpaid"
              value={formatCurrency(overallSummary?.totalUnpaidAmount ?? 0)}
              color="#DC2626"
              bg="rgba(220,38,38,0.08)"
            />
            <View style={styles.statsDivider} />
            <StatPill
              label="Paid"
              value={formatCurrency(overallSummary?.totalPaidAmount ?? 0)}
              color="#10B981"
              bg="rgba(16,185,129,0.08)"
            />
          </View>
        </View>

        {/* ── Tabs ── */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TabPill title="All"      count={dues.all?.length      || 0} isActive={activeTab === "all"}      onPress={() => setActiveTab("all")} />
            <TabPill title="Unpaid"   count={dues.unpaid?.length   || 0} isActive={activeTab === "unpaid"}   onPress={() => setActiveTab("unpaid")} />
            <TabPill title="Paid"     count={dues.paid?.length     || 0} isActive={activeTab === "paid"}     onPress={() => setActiveTab("paid")} />
            <TabPill title="Overdue"  count={dues.overdue?.length  || 0} isActive={activeTab === "overdue"}  onPress={() => setActiveTab("overdue")} />
            <TabPill title="Exempted" count={dues.exempted?.length || 0} isActive={activeTab === "exempted"} onPress={() => setActiveTab("exempted")} />
          </ScrollView>
        </View>

        {/* ── List ── */}
        <View style={styles.listContainer}>
          {currentDues.length > 0 ? (
            currentDues.map((due) => (
              <DueCard key={due._id} due={due} onPress={handleDuePress} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconBox}>
                <Ionicons name="document-text-outline" size={40} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No {activeTab} dues</Text>
              <Text style={styles.emptyBody}>
                {activeTab === "all"
                  ? "You have no dues assigned yet"
                  : `You have no ${activeTab} dues at this time`}
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  centered:      { flex: 1, justifyContent: "center", alignItems: "center", padding: 32 },
  loadingText:   { marginTop: 12, fontSize: 14, color: "#6B7280", fontWeight: "500" },
  errorIconBox:  { width: 80, height: 80, borderRadius: 40, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  errorTitle:    { fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 8, textAlign: "center" },
  errorBody:     { fontSize: 14, color: "#6B7280", textAlign: "center", lineHeight: 20 },
  retryBtn:      { marginTop: 20, paddingHorizontal: 28, paddingVertical: 12, backgroundColor: "#111827", borderRadius: 12 },
  retryText:     { color: "white", fontSize: 14, fontWeight: "700" },
  heroCard:      { margin: 16, backgroundColor: "white", borderRadius: 20, padding: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 4 },
  householdRow:  { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  homeIconBox:   { width: 28, height: 28, borderRadius: 8, backgroundColor: "#ECFDF5", justifyContent: "center", alignItems: "center" },
  householdName: { fontSize: 14, fontWeight: "700", color: "#111827", flex: 1 },
  householdType: { fontSize: 12, color: "#9CA3AF", fontWeight: "500", textTransform: "capitalize" },
  leaderBadge:   { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: "#FEF3C7", borderRadius: 6 },
  leaderText:    { fontSize: 11, color: "#92400E", fontWeight: "700" },
  heroHeading:   { fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 16, letterSpacing: -0.5 },
  statsRow:      { flexDirection: "row", alignItems: "stretch" },
  statsDivider:  { width: 1, backgroundColor: "#F3F4F6", marginVertical: 4 },
  tabsContainer: { paddingVertical: 12 },
  tabsContent:   { paddingHorizontal: 16, gap: 8 },
  listContainer: { padding: 16 },
  emptyState:    { alignItems: "center", paddingVertical: 60 },
  emptyIconBox:  { width: 80, height: 80, borderRadius: 40, backgroundColor: "#F9FAFB", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  emptyTitle:    { fontSize: 16, fontWeight: "700", color: "#374151", marginBottom: 6 },
  emptyBody:     { fontSize: 13, color: "#9CA3AF", textAlign: "center" },
});

export default HouseholdDues;