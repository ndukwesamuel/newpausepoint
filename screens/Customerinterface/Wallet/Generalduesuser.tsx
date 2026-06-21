import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatCurrency = (amount) => `₦${Number(amount || 0).toLocaleString()}`;

const formatDate = (dateString) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const categoryLabel = (c) =>
  ({
    annual_membership: "Annual Membership",
    monthly_membership: "Monthly Membership",
    monthly_fee: "Monthly Fee",
    maintenance: "Maintenance",
    security: "Security",
    development: "Development",
    event: "Event",
    special_levy: "Special Levy",
    other: "Other",
  })[c] || c?.replace(/_/g, " ");

const categoryColor = (c) =>
  ({
    annual_membership: { bg: "#DBEAFE", color: "#1E40AF" },
    monthly_membership: { bg: "#D1FAE5", color: "#065F46" },
    monthly_fee: { bg: "#D1FAE5", color: "#065F46" },
    maintenance: { bg: "#FEF3C7", color: "#92400E" },
    security: { bg: "#FEE2E2", color: "#991B1B" },
    development: { bg: "#E0E7FF", color: "#3730A3" },
    event: { bg: "#FCE7F3", color: "#9D174D" },
    special_levy: { bg: "#EDE9FE", color: "#6D28D9" },
  })[c] || { bg: "#F3F4F6", color: "#374151" };

const statusStyle = (s) =>
  ({
    paid: { bg: "#D1FAE5", color: "#065F46", icon: "check-circle" },
    unpaid: { bg: "#FEF3C7", color: "#92400E", icon: "clock" },
    overdue: { bg: "#FEE2E2", color: "#991B1B", icon: "alert-circle" },
    waived: { bg: "#E0E7FF", color: "#3730A3", icon: "minus-circle" },
    manual: { bg: "#F3F4F6", color: "#374151", icon: "pencil-circle" },
  })[s] || { bg: "#F3F4F6", color: "#374151", icon: "help-circle" };

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const GeneralDuesUser = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState("list"); // "list" | "detail"
  const [selectedDue, setSelectedDue] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const {
    data: duesResponse,
    isLoading,
    error,
    refetch,
  } = useFetchData_v2("api/v1/generalDuesRouter/my-dues", "myGeneralDues");

  const allDues = duesResponse?.data || [];

  // ── Pay mutation ───────────────────────────────────────────────────────────
  const payMutation = useMutateData_v2(
    "api/v1/generalDuesRouter/pay",
    "POST",
    "myGeneralDues",
    {
      onError: (error) => {
        Alert.alert(
          "Payment Failed",
          error?.data?.message ||
            "Unable to process payment. Please try again.",
          [{ text: "OK" }],
        );
      },
    },
  );

  // ── Filtered tabs ──────────────────────────────────────────────────────────
  const filteredDues = allDues.filter((d) => {
    if (activeTab === "all") return true;
    return d.myPayment?.status === activeTab;
  });

  const countByStatus = (status) =>
    allDues.filter((d) => d.myPayment?.status === status).length;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleViewDetail = (due) => {
    setSelectedDue(due);
    setCurrentScreen("detail");
  };

  const handleBack = () => {
    setCurrentScreen("list");
    setSelectedDue(null);
  };

  const handlePayment = async () => {
    if (!selectedDue) return;
    setIsProcessingPayment(true);
    try {
      await payMutation.mutateAsync({ duesId: selectedDue._id });
      Alert.alert(
        "Payment Successful",
        "Your dues payment has been processed successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              refetch();
              handleBack();
            },
          },
        ],
      );
    } catch (err) {
      // handled in onError
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ScreenWrapper
        title="General Dues"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your dues...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <ScreenWrapper
        title="General Dues"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.centerContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color="#D1D5DB"
          />
          <Text style={styles.emptyTitle}>Failed to load dues</Text>
          <Text style={styles.emptySubtitle}>
            {error?.message || "Please try again"}
          </Text>
          <TouchableOpacity style={styles.retryBtn} onPress={refetch}>
            <Text style={styles.retryBtnText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ── DETAIL SCREEN ──────────────────────────────────────────────────────────
  if (currentScreen === "detail" && selectedDue) {
    const ss = statusStyle(selectedDue.myPayment?.status);
    const cat = categoryColor(selectedDue.category);
    const balance =
      (selectedDue.myPayment?.amountDue || 0) -
      (selectedDue.myPayment?.amountPaid || 0);
    const isOverdue =
      new Date(selectedDue.dueDate) < new Date() &&
      selectedDue.myPayment?.status !== "paid";

    return (
      <ScreenWrapper
        title="Due Details"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
        onBackPress={handleBack}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.detailHeader}>
            <View style={styles.detailTitleRow}>
              <View style={[styles.catBadge, { backgroundColor: cat.bg }]}>
                <Text style={[styles.catBadgeText, { color: cat.color }]}>
                  {categoryLabel(selectedDue.category)}
                </Text>
              </View>
              {isOverdue && (
                <View style={[styles.catBadge, { backgroundColor: "#FEE2E2" }]}>
                  <Text style={[styles.catBadgeText, { color: "#991B1B" }]}>
                    OVERDUE
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.detailTitle}>{selectedDue.title}</Text>
            {selectedDue.description ? (
              <Text style={styles.detailDesc}>{selectedDue.description}</Text>
            ) : null}
            <View style={[styles.statusPill, { backgroundColor: ss.bg }]}>
              <Ionicons name={ss.icon} size={16} color={ss.color} />
              <Text style={[styles.statusPillText, { color: ss.color }]}>
                {selectedDue.myPayment?.status?.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Financial breakdown */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Financial Details</Text>
            <View style={styles.financialGrid}>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Amount Due</Text>
                <Text style={styles.financialValue}>
                  {formatCurrency(selectedDue.myPayment?.amountDue)}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Amount Paid</Text>
                <Text style={[styles.financialValue, { color: "#10B981" }]}>
                  {formatCurrency(selectedDue.myPayment?.amountPaid)}
                </Text>
              </View>
              <View style={styles.financialItem}>
                <Text style={styles.financialLabel}>Balance</Text>
                <Text
                  style={[
                    styles.financialValue,
                    { color: balance > 0 ? "#DC2626" : "#10B981" },
                  ]}
                >
                  {formatCurrency(balance)}
                </Text>
              </View>
            </View>
          </View>

          {/* Due info */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Due Information</Text>
            {[
              {
                icon: "calendar",
                label: "Due Date",
                value: formatDate(selectedDue.dueDate),
                valueStyle: isOverdue ? { color: "#DC2626" } : {},
              },
              {
                icon: "clock-outline",
                label: "Assigned At",
                value: formatDate(selectedDue.myPayment?.assignedAt),
                valueStyle: {},
              },
              {
                icon: "tag-outline",
                label: "Category",
                value: categoryLabel(selectedDue.category),
                valueStyle: {},
              },
            ].map((row) => (
              <View key={row.label} style={styles.infoRow}>
                <MaterialCommunityIcons
                  name={row.icon}
                  size={20}
                  color="#6B7280"
                />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>{row.label}</Text>
                  <Text style={[styles.infoValue, row.valueStyle]}>
                    {row.value}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Overdue warning */}
          {isOverdue && (
            <View style={styles.overdueWarningLarge}>
              <Ionicons name="alert-circle" size={22} color="#DC2626" />
              <View style={{ flex: 1 }}>
                <Text style={styles.overdueWarningTitle}>Payment Overdue</Text>
                <Text style={styles.overdueWarningText}>
                  This payment is past the due date. Please pay as soon as
                  possible.
                </Text>
              </View>
            </View>
          )}

          {/* Pay button */}
          {selectedDue.myPayment?.status === "unpaid" && balance > 0 && (
            <View style={styles.paySection}>
              <View style={styles.payCard}>
                <Text style={styles.payCardLabel}>Amount to Pay</Text>
                <Text style={styles.payCardAmount}>
                  {formatCurrency(balance)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.payBtn,
                  isProcessingPayment && styles.payBtnDisabled,
                ]}
                onPress={handlePayment}
                disabled={isProcessingPayment}
                activeOpacity={0.8}
              >
                {isProcessingPayment ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text style={styles.payBtnText}>Processing...</Text>
                  </>
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name="credit-card"
                      size={20}
                      color="white"
                    />
                    <Text style={styles.payBtnText}>Pay Now</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.secureRow}>
                <MaterialCommunityIcons
                  name="shield-check"
                  size={14}
                  color="#10B981"
                />
                <Text style={styles.secureText}>Secure payment processing</Text>
              </View>
            </View>
          )}

          <View style={{ height: 60 }} />
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // ── LIST SCREEN ────────────────────────────────────────────────────────────
  const unpaidTotal = allDues
    .filter((d) => d.myPayment?.status === "unpaid")
    .reduce((s, d) => s + (d.myPayment?.amountDue || 0), 0);

  const paidTotal = allDues
    .filter((d) => d.myPayment?.status === "paid")
    .reduce((s, d) => s + (d.myPayment?.amountPaid || 0), 0);

  return (
    <ScreenWrapper
      title="General Dues"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Summary cards */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.summaryRow}>
            {[
              {
                label: "Total Dues",
                value: allDues.length.toString(),
                bg: "#DBEAFE",
                color: "#3B82F6",
                icon: "file-document-multiple",
              },
              {
                label: "Unpaid",
                value: formatCurrency(unpaidTotal),
                bg: "#FEE2E2",
                color: "#DC2626",
                icon: "alert-circle",
              },
              {
                label: "Paid",
                value: formatCurrency(paidTotal),
                bg: "#D1FAE5",
                color: "#10B981",
                icon: "check-circle",
              },
            ].map((s) => (
              <View key={s.label} style={styles.summaryCard}>
                <View style={[styles.summaryIcon, { backgroundColor: s.bg }]}>
                  <MaterialCommunityIcons
                    name={s.icon}
                    size={20}
                    color={s.color}
                  />
                </View>
                <Text style={styles.summaryCardValue}>{s.value}</Text>
                <Text style={styles.summaryCardLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            {[
              { key: "all", label: "All", count: allDues.length },
              {
                key: "unpaid",
                label: "Unpaid",
                count: countByStatus("unpaid"),
              },
              { key: "paid", label: "Paid", count: countByStatus("paid") },
              {
                key: "overdue",
                label: "Overdue",
                count: countByStatus("overdue"),
              },
              {
                key: "waived",
                label: "Waived",
                count: countByStatus("waived"),
              },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab.key && styles.tabTextActive,
                  ]}
                >
                  {tab.label}
                </Text>
                {tab.count > 0 && (
                  <View
                    style={[
                      styles.tabBadge,
                      activeTab === tab.key && styles.tabBadgeActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabBadgeText,
                        activeTab === tab.key && styles.tabBadgeTextActive,
                      ]}
                    >
                      {tab.count}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dues list */}
        <View style={styles.listSection}>
          {filteredDues.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={64}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No {activeTab} dues found</Text>
            </View>
          ) : (
            filteredDues.map((due) => {
              const ss = statusStyle(due.myPayment?.status);
              const cat = categoryColor(due.category);
              const isOverdue =
                new Date(due.dueDate) < new Date() &&
                due.myPayment?.status !== "paid";

              return (
                <TouchableOpacity
                  key={due._id}
                  style={styles.dueCard}
                  onPress={() => handleViewDetail(due)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dueCardTop}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.dueCardTitle} numberOfLines={1}>
                        {due.title}
                      </Text>
                      <View style={styles.dueCardBadges}>
                        <View
                          style={[styles.catBadge, { backgroundColor: cat.bg }]}
                        >
                          <Text
                            style={[styles.catBadgeText, { color: cat.color }]}
                          >
                            {categoryLabel(due.category)}
                          </Text>
                        </View>
                        {isOverdue && (
                          <View
                            style={[
                              styles.catBadge,
                              { backgroundColor: "#FEE2E2" },
                            ]}
                          >
                            <Text
                              style={[
                                styles.catBadgeText,
                                { color: "#991B1B" },
                              ]}
                            >
                              OVERDUE
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={[styles.statusPill, { backgroundColor: ss.bg }]}
                    >
                      <Ionicons name={ss.icon} size={12} color={ss.color} />
                      <Text
                        style={[
                          styles.statusPillText,
                          { color: ss.color, fontSize: 11 },
                        ]}
                      >
                        {due.myPayment?.status?.toUpperCase()}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.dueCardFooter}>
                    <View style={styles.dueCardStat}>
                      <MaterialCommunityIcons
                        name="currency-ngn"
                        size={14}
                        color="#6B7280"
                      />
                      <Text style={styles.dueCardStatLabel}>Due:</Text>
                      <Text style={styles.dueCardStatValue}>
                        {formatCurrency(due.myPayment?.amountDue)}
                      </Text>
                    </View>
                    <View style={styles.dueCardStat}>
                      <MaterialCommunityIcons
                        name="calendar"
                        size={14}
                        color={isOverdue ? "#DC2626" : "#6B7280"}
                      />
                      <Text
                        style={[
                          styles.dueCardStatValue,
                          isOverdue && { color: "#DC2626" },
                        ]}
                      >
                        {formatDate(due.dueDate)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 80,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginTop: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 6,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },

  // Summary
  summarySection: { backgroundColor: "white", padding: 16, marginBottom: 8 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCardValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  summaryCardLabel: {
    fontSize: 11,
    color: "#6B7280",
    fontWeight: "500",
    textAlign: "center",
  },

  // Tabs
  tabsContainer: {
    backgroundColor: "white",
    paddingVertical: 10,
    marginBottom: 8,
  },
  tabsContent: { paddingHorizontal: 16, gap: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 6,
  },
  tabActive: { backgroundColor: "#D1FAE5" },
  tabText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  tabTextActive: { color: "#10B981" },
  tabBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabBadgeActive: { backgroundColor: "#10B981" },
  tabBadgeText: { fontSize: 11, fontWeight: "700", color: "#6B7280" },
  tabBadgeTextActive: { color: "white" },

  // List
  listSection: { padding: 16, gap: 12 },
  emptyState: { alignItems: "center", paddingVertical: 60 },

  dueCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 10,
  },
  dueCardTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  dueCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  dueCardBadges: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  dueCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dueCardStat: { flexDirection: "row", alignItems: "center", gap: 4 },
  dueCardStatLabel: { fontSize: 12, color: "#6B7280" },
  dueCardStatValue: { fontSize: 12, fontWeight: "600", color: "#111827" },

  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  catBadgeText: { fontSize: 11, fontWeight: "600" },

  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusPillText: { fontSize: 12, fontWeight: "700" },

  // Detail
  detailHeader: { backgroundColor: "white", padding: 20, marginBottom: 8 },
  detailTitleRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  detailDesc: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 14,
  },

  section: { backgroundColor: "white", padding: 20, marginBottom: 8 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  financialGrid: { flexDirection: "row", gap: 10 },
  financialItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    padding: 12,
  },
  financialLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 4 },
  financialValue: { fontSize: 15, fontWeight: "700", color: "#111827" },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 2 },
  infoValue: { fontSize: 15, color: "#111827", fontWeight: "600" },

  overdueWarningLarge: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  overdueWarningTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 4,
  },
  overdueWarningText: { fontSize: 13, color: "#991B1B", lineHeight: 18 },

  // Pay
  paySection: { padding: 20, backgroundColor: "white", marginTop: 8 },
  payCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payCardLabel: { fontSize: 14, fontWeight: "600", color: "#065F46" },
  payCardAmount: { fontSize: 22, fontWeight: "800", color: "#10B981" },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#10B981",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payBtnDisabled: { backgroundColor: "#9CA3AF", shadowOpacity: 0.1 },
  payBtnText: { fontSize: 16, fontWeight: "700", color: "white" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  secureText: { fontSize: 12, color: "#6B7280" },
});

export default GeneralDuesUser;
