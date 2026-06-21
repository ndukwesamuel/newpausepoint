import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppScreen from "../../../components/shared/AppScreen";
import { useMutateData_v2 } from "../../../hooks/Requestv2";
import DuesReceiptPDF from "./DuesReceiptPDF";

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

// ─── InfoRow ──────────────────────────────────────────────────────────────────

const InfoRow = ({ icon, label, value, valueColor, last, capitalize }) => (
  <View style={[infoStyles.row, !last && infoStyles.border]}>
    <View style={infoStyles.iconBox}>
      <Ionicons name={icon} size={16} color="#9CA3AF" />
    </View>
    <Text style={infoStyles.label}>{label}</Text>
    <Text
      style={[
        infoStyles.value,
        capitalize && infoStyles.capitalize,
        valueColor && { color: valueColor },
      ]}
      numberOfLines={2}
    >
      {value}
    </Text>
  </View>
);

const infoStyles = StyleSheet.create({
  row:        { flexDirection: "row", alignItems: "center", paddingVertical: 14, gap: 10 },
  border:     { borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  iconBox:    { width: 28, alignItems: "center" },
  label:      { fontSize: 13, color: "#9CA3AF", fontWeight: "500", width: 90 },
  value:      { flex: 1, fontSize: 14, color: "#111827", fontWeight: "600", textAlign: "right" },
  capitalize: { textTransform: "capitalize" },
});

// ─── Main Component ───────────────────────────────────────────────────────────

const HouseholdDueDetail = ({ route, navigation }) => {
  const { due, householdId } = route.params;
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);


  console.log({
    uuyuyu:due,
    aaaa:householdId
  });
  

  const status   = getStatusConfig(due.status);
  const category = getCategoryConfig(due.category);
  const balance  = (due.amountDue || 0) - (due.amountPaid || 0);

  const payDues = useMutateData_v2(
    "api/v1/householdDue/user",
    "POST",
    "getUserHouseholdDues",
  );

  const handlePayment = async () => {
    try {
      setIsProcessingPayment(true);
      await payDues.mutateAsync({
        duesId:      due._id,
        householdId: householdId,
      });
      Alert.alert(
        "Payment Successful! 🎉",
        "Your payment has been processed successfully.",
        [{ text: "OK", onPress: () => navigation.goBack() }],
      );
    } catch (err) {
      Alert.alert(
        "Payment Failed",
        err?.message || "Unable to process payment. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <AppScreen>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#F8FAFC" }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero ── */}
        <View style={styles.hero}>
          <View style={[styles.heroIcon, { backgroundColor: category.bg }]}>
            <Ionicons name={category.icon} size={32} color={category.color} />
          </View>
          <Text style={styles.heroTitle}>{due.title}</Text>
          <Text style={styles.heroCategory}>{category.label}</Text>
          <View style={[styles.heroStatus, { backgroundColor: status.bg, borderColor: status.border }]}>
            <Ionicons name={status.icon} size={16} color={status.color} />
            <Text style={[styles.heroStatusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* ── Financial Summary ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.financialRow}>
            <View style={[styles.financialCard, { backgroundColor: "#FFFBEB" }]}>
              <Text style={styles.financialLabel}>Amount Due</Text>
              <Text style={[styles.financialValue, { color: "#D97706" }]}>
                {formatCurrency(due.amountDue)}
              </Text>
            </View>
            <View style={[styles.financialCard, { backgroundColor: "#ECFDF5" }]}>
              <Text style={styles.financialLabel}>Paid</Text>
              <Text style={[styles.financialValue, { color: "#10B981" }]}>
                {formatCurrency(due.amountPaid)}
              </Text>
            </View>
            <View style={[styles.financialCard, { backgroundColor: balance > 0 ? "#FEF2F2" : "#ECFDF5" }]}>
              <Text style={styles.financialLabel}>Balance</Text>
              <Text style={[styles.financialValue, { color: balance > 0 ? "#DC2626" : "#10B981" }]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* ── Details ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          <View style={styles.infoCard}>
            {due.description ? (
              <InfoRow icon="document-text-outline" label="Description" value={due.description} />
            ) : null}
            <InfoRow icon="pricetag-outline"   label="Category"  value={due.category?.replace(/_/g, " ")} capitalize />
            <InfoRow
              icon="calendar-outline"
              label="Due Date"
              value={formatDate(due.dueDate)}
              valueColor={due.isOverdue ? "#DC2626" : undefined}
            />
            <InfoRow icon="time-outline"       label="Assigned"  value={formatDate(due.assignedAt)} />
            <InfoRow icon="business-outline"   label="Estate"    value={due.clan?.name} last />
          </View>
        </View>

        {/* ── Overdue Warning ── */}
        {due.isOverdue && (
          <View style={styles.overdueCard}>
            <Ionicons name="warning" size={22} color="#DC2626" />
            <View style={{ flex: 1 }}>
              <Text style={styles.overdueTitle}>Payment Overdue</Text>
              <Text style={styles.overdueBody}>
                This payment is past its due date. Please settle it as soon as possible.
              </Text>
            </View>
          </View>
        )}

        {/* ── Pay Now ── */}
        {due.status === "unpaid" && balance > 0 && (
          <View style={styles.paySection}>
            <View style={styles.payAmountRow}>
              <Text style={styles.payAmountLabel}>Amount to Pay</Text>
              <Text style={styles.payAmountValue}>{formatCurrency(balance)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.payBtn, isProcessingPayment && styles.payBtnDisabled]}
              onPress={handlePayment}
              disabled={isProcessingPayment}
              activeOpacity={0.85}
            >
              {isProcessingPayment ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.payBtnText}>Processing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="card" size={20} color="white" />
                  <Text style={styles.payBtnText}>Pay Now</Text>
                </>
              )}
            </TouchableOpacity>

            <View style={styles.secureRow}>
              <Ionicons name="shield-checkmark" size={14} color="#10B981" />
              <Text style={styles.secureText}>Secure payment processing</Text>
            </View>
          </View>
        )}

        {/* ── Receipt ── */}
{due.status === "paid" && (
  <View style={{ margin: 16, marginTop: 12 }}>
    <DuesReceiptPDF due={due} />
  </View>
)}

        <View style={{ height: 40 }} />
      </ScrollView>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  hero:               { backgroundColor: "white", padding: 28, alignItems: "center", marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  heroIcon:           { width: 72, height: 72, borderRadius: 20, justifyContent: "center", alignItems: "center", marginBottom: 12 },
  heroTitle:          { fontSize: 22, fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: 4, letterSpacing: -0.3 },
  heroCategory:       { fontSize: 13, color: "#9CA3AF", fontWeight: "500", marginBottom: 14, textTransform: "capitalize" },
  heroStatus:         { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1.5 },
  heroStatusText:     { fontSize: 13, fontWeight: "700" },
  section:            { margin: 16, marginBottom: 0 },
  sectionTitle:       { fontSize: 12, fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  financialRow:       { flexDirection: "row", gap: 10 },
  financialCard:      { flex: 1, borderRadius: 14, padding: 14, alignItems: "center" },
  financialLabel:     { fontSize: 10, color: "#6B7280", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 4 },
  financialValue:     { fontSize: 16, fontWeight: "800" },
  infoCard:           { backgroundColor: "white", borderRadius: 16, paddingHorizontal: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  overdueCard:        { flexDirection: "row", gap: 12, margin: 16, marginBottom: 0, padding: 16, backgroundColor: "#FEF2F2", borderRadius: 14, alignItems: "flex-start" },
  overdueTitle:       { fontSize: 14, fontWeight: "700", color: "#DC2626", marginBottom: 2 },
  overdueBody:        { fontSize: 12, color: "#991B1B", lineHeight: 18 },
  paySection:         { margin: 16, marginTop: 20 },
  payAmountRow:       { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "white", borderRadius: 14, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 1 },
  payAmountLabel:     { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  payAmountValue:     { fontSize: 22, fontWeight: "800", color: "#111827" },
  payBtn:             { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, backgroundColor: "#111827", padding: 18, borderRadius: 16, shadowColor: "#111827", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.25, shadowRadius: 12, elevation: 6 },
  payBtnDisabled:     { backgroundColor: "#9CA3AF", shadowOpacity: 0 },
  payBtnText:         { fontSize: 16, fontWeight: "800", color: "white", letterSpacing: 0.3 },
  secureRow:          { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 12 },
  secureText:         { fontSize: 12, color: "#9CA3AF" },
});

export default HouseholdDueDetail;