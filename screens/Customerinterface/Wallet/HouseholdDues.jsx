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
import {
  MaterialCommunityIcons,
  Ionicons,
  AntDesign,
} from "@expo/vector-icons";
import {
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const HouseholdDues = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState("myDues"); // "myDues" or "details"
  const [activeTab, setActiveTab] = useState("all");
  const [selectedDue, setSelectedDue] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Fetch dues data using the v2 hook
  const {
    data: duesResponse,
    isLoading,
    error,
    refetch,
  } = useFetchData_v2("api/v1/householdDue/user", "getUserHouseholdDues");

  const duesData = duesResponse;

  // Payment mutation
  const payDues = useMutateData_v2(
    "api/v1/householdDue/user",
    "POST",
    "getUserHouseholdDues",
  );

  const navigateToDetails = (due) => {
    setSelectedDue(due);
    setCurrentScreen("details");
  };

  const handlePayment = async () => {
    if (!selectedDue) return;

    // Get the household from duesData
    const household = duesData.households?.[0];

    const paymentData = {
      duesId: selectedDue._id,
      householdId: household?.household?._id || household?._id,
    };

    try {
      setIsProcessingPayment(true);

      await payDues.mutateAsync(paymentData);

      Alert.alert(
        "Payment Successful",
        "Your payment has been processed successfully.",
        [
          {
            text: "OK",
            onPress: () => {
              // Refetch the dues data to update the list
              refetch();
              // Navigate back to My Dues
              navigateToMyDues();
            },
          },
        ],
      );
    } catch (error) {
      // Show error message
      Alert.alert(
        "Payment Failed",
        error?.message || "Unable to process payment. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const navigateToMyDues = () => {
    setCurrentScreen("myDues");
    setSelectedDue(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return { bg: "#D1FAE5", color: "#065F46", icon: "check-circle" };
      case "unpaid":
        return { bg: "#FEF3C7", color: "#92400E", icon: "clock" };
      case "overdue":
        return { bg: "#FEE2E2", color: "#991B1B", icon: "alert-circle" };
      case "waived":
        return { bg: "#E0E7FF", color: "#3730A3", icon: "x-circle" };
      default:
        return { bg: "#F3F4F6", color: "#6B7280", icon: "help-circle" };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "annual_levy":
        return "calendar";
      case "security":
        return "shield-check";
      case "development":
        return "hammer";
      case "maintenance":
        return "tools";
      case "special_assessment":
        return "star";
      default:
        return "file-document";
    }
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ============================================
  // REUSABLE COMPONENTS
  // ============================================

  const TabButton = ({ title, count, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.tabButtonActive]}
      onPress={onPress}
    >
      <Text
        style={[styles.tabButtonText, isActive && styles.tabButtonTextActive]}
      >
        {title}
      </Text>
      {count > 0 && (
        <View style={[styles.tabBadge, isActive && styles.tabBadgeActive]}>
          <Text
            style={[styles.tabBadgeText, isActive && styles.tabBadgeTextActive]}
          >
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const SummaryCard = ({ title, value, icon, bgColor, textColor }) => (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIconContainer, { backgroundColor: bgColor }]}>
        <MaterialCommunityIcons name={icon} size={24} color={textColor} />
      </View>
      <View style={styles.summaryContent}>
        <RegularFontText data={title} textstyle={styles.summaryLabel} />
        <SemiBoldFontText data={value} textstyle={styles.summaryValue} />
      </View>
    </View>
  );

  const DueCard = ({ due, onPress }) => {
    const statusStyle = getStatusColor(due.status);
    const categoryIcon = getCategoryIcon(due.category);
    const isOverdue = due.isOverdue;

    return (
      <TouchableOpacity
        style={styles.dueCard}
        onPress={() => onPress(due)}
        activeOpacity={0.7}
      >
        <View style={styles.dueCardHeader}>
          <View style={styles.dueCardTitleContainer}>
            <MaterialCommunityIcons
              name={categoryIcon}
              size={20}
              color="#10B981"
            />
            <SemiBoldFontText
              data={due.title}
              textstyle={styles.dueCardTitle}
            />
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Ionicons
              name={statusStyle.icon}
              size={14}
              color={statusStyle.color}
            />
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {due.status}
            </Text>
          </View>
        </View>

        {due.description && (
          <RegularFontText
            data={due.description}
            textstyle={styles.dueDescription}
          />
        )}

        <View style={styles.dueCardDetails}>
          <View style={styles.dueDetailItem}>
            <MaterialCommunityIcons
              name="currency-ngn"
              size={16}
              color="#6B7280"
            />
            <Text style={styles.dueDetailLabel}>Amount Due:</Text>
            <Text style={styles.dueDetailValue}>
              {formatCurrency(due.amountDue)}
            </Text>
          </View>

          {due.amountPaid > 0 && (
            <View style={styles.dueDetailItem}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#10B981"
              />
              <Text style={styles.dueDetailLabel}>Paid:</Text>
              <Text style={[styles.dueDetailValue, { color: "#10B981" }]}>
                {formatCurrency(due.amountPaid)}
              </Text>
            </View>
          )}

          <View style={styles.dueDetailItem}>
            <MaterialCommunityIcons
              name="calendar"
              size={16}
              color={isOverdue ? "#DC2626" : "#6B7280"}
            />
            <Text style={styles.dueDetailLabel}>Due Date:</Text>
            <Text
              style={[
                styles.dueDetailValue,
                isOverdue && { color: "#DC2626", fontWeight: "700" },
              ]}
            >
              {formatDate(due.dueDate)}
            </Text>
          </View>
        </View>

        {isOverdue && (
          <View style={styles.overdueWarning}>
            <Ionicons name="alert-circle" size={16} color="#DC2626" />
            <Text style={styles.overdueText}>This payment is overdue</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // ============================================
  // MY DUES SCREEN (Main Screen)
  // ============================================

  const MyDuesScreen = () => {
    const household = duesData.households?.[0];
    const dues = household?.dues || {};
    const currentDues = dues[activeTab] || [];

    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={refetch} />
        }
      >
        {/* Overall Summary */}
        <View style={styles.summarySection}>
          <SemiBoldFontText data="Overview" textstyle={styles.sectionTitle} />
          <View style={styles.summaryGrid}>
            <SummaryCard
              title="Total Dues"
              value={duesData.overallSummary.totalDues.toString()}
              icon="file-document-multiple"
              bgColor="#DBEAFE"
              textColor="#3B82F6"
            />
            <SummaryCard
              title="Unpaid"
              value={formatCurrency(duesData.overallSummary.totalUnpaidAmount)}
              icon="alert-circle"
              bgColor="#FEE2E2"
              textColor="#DC2626"
            />
            <SummaryCard
              title="Paid"
              value={formatCurrency(duesData.overallSummary.totalPaidAmount)}
              icon="check-circle"
              bgColor="#D1FAE5"
              textColor="#10B981"
            />
          </View>
        </View>

        {/* Household Info */}
        {household && (
          <View style={styles.householdCard}>
            <View style={styles.householdHeader}>
              <MaterialCommunityIcons name="home" size={24} color="#10B981" />
              <View style={styles.householdInfo}>
                <SemiBoldFontText
                  data={household.household.name}
                  textstyle={styles.householdName}
                />
                <RegularFontText
                  data={household.household.type}
                  textstyle={styles.householdType}
                />
              </View>
              {household.household.isLeader && (
                <View style={styles.leaderBadge}>
                  <MaterialCommunityIcons
                    name="crown"
                    size={16}
                    color="#F59E0B"
                  />
                  <Text style={styles.leaderText}>Leader</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}
          >
            <TabButton
              title="All"
              count={dues.all?.length || 0}
              isActive={activeTab === "all"}
              onPress={() => setActiveTab("all")}
            />
            <TabButton
              title="Unpaid"
              count={dues.unpaid?.length || 0}
              isActive={activeTab === "unpaid"}
              onPress={() => setActiveTab("unpaid")}
            />
            <TabButton
              title="Paid"
              count={dues.paid?.length || 0}
              isActive={activeTab === "paid"}
              onPress={() => setActiveTab("paid")}
            />
            <TabButton
              title="Overdue"
              count={dues.overdue?.length || 0}
              isActive={activeTab === "overdue"}
              onPress={() => setActiveTab("overdue")}
            />
            <TabButton
              title="Exempted"
              count={dues.exempted?.length || 0}
              isActive={activeTab === "exempted"}
              onPress={() => setActiveTab("exempted")}
            />
          </ScrollView>
        </View>

        {/* Dues List */}
        <View style={styles.duesSection}>
          {currentDues.length > 0 ? (
            currentDues.map((due) => (
              <DueCard key={due._id} due={due} onPress={navigateToDetails} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={64}
                color="#D1D5DB"
              />
              <Text style={styles.emptyStateText}>
                No {activeTab} dues found
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  // ============================================
  // DETAILS SCREEN
  // ============================================

  const DetailsScreen = () => {
    if (!selectedDue) return null;

    const statusStyle = getStatusColor(selectedDue.status);
    const categoryIcon = getCategoryIcon(selectedDue.category);
    const balance = selectedDue.amountDue - selectedDue.amountPaid;

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.detailsHeader}>
          <View style={styles.detailsTitleContainer}>
            <MaterialCommunityIcons
              name={categoryIcon}
              size={28}
              color="#10B981"
            />
            <SemiBoldFontText
              data={selectedDue.title}
              textstyle={styles.detailsTitle}
            />
          </View>

          {/* Status Badge */}
          <View style={styles.detailsStatusContainer}>
            <View
              style={[
                styles.detailsStatusBadge,
                { backgroundColor: statusStyle.bg },
              ]}
            >
              <Ionicons
                name={statusStyle.icon}
                size={20}
                color={statusStyle.color}
              />
              <Text
                style={[styles.detailsStatusText, { color: statusStyle.color }]}
              >
                {selectedDue.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        {selectedDue.description && (
          <View style={styles.detailsSection}>
            <RegularFontText
              data="Description"
              textstyle={styles.detailsSectionLabel}
            />
            <RegularFontText
              data={selectedDue.description}
              textstyle={styles.detailsSectionValue}
            />
          </View>
        )}

        {console.log({
          xc: selectedDue,
        })}
        {/* Financial Details */}
        <View style={styles.detailsSection}>
          <RegularFontText
            data="Financial Details"
            textstyle={styles.detailsSectionLabel}
          />
          <View style={styles.financialGrid}>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Amount Due</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(selectedDue.amountDue)}
              </Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Amount Paid</Text>
              <Text style={[styles.financialValue, { color: "#10B981" }]}>
                {formatCurrency(selectedDue.amountPaid)}
              </Text>
            </View>
            <View style={styles.financialItem}>
              <Text style={styles.financialLabel}>Balance</Text>
              <Text
                style={[
                  styles.financialValue,
                  {
                    color: balance > 0 ? "#DC2626" : "#10B981",
                  },
                ]}
              >
                {formatCurrency(balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Due Information */}
        <View style={styles.detailsSection}>
          <RegularFontText
            data="Due Information"
            textstyle={styles.detailsSectionLabel}
          />

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="tag" size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Category</Text>
              <Text style={styles.infoValue}>
                {selectedDue.category.replace(/_/g, " ")}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Due Date</Text>
              <Text
                style={[
                  styles.infoValue,
                  selectedDue.isOverdue && { color: "#DC2626" },
                ]}
              >
                {formatDate(selectedDue.dueDate)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#6B7280"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Assigned Date</Text>
              <Text style={styles.infoValue}>
                {formatDate(selectedDue.assignedAt)}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="office-building"
              size={20}
              color="#6B7280"
            />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Estate</Text>
              <Text style={styles.infoValue}>{selectedDue.clan.name}</Text>
            </View>
          </View>
        </View>

        {/* Overdue Warning */}
        {selectedDue.isOverdue && (
          <View style={styles.detailsOverdueWarning}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <View style={{ flex: 1 }}>
              <Text style={styles.detailsOverdueTitle}>Payment Overdue</Text>
              <Text style={styles.detailsOverdueText}>
                This payment is past the due date. Please make payment as soon
                as possible.
              </Text>
            </View>
          </View>
        )}

        {/* Payment Summary & Action Button */}
        {selectedDue.status === "unpaid" && balance > 0 && (
          <View style={styles.detailsActions}>
            {/* Payment Summary Card */}
            <View style={styles.paymentSummaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryRowLabel}>Amount to Pay</Text>
                <Text style={styles.summaryRowValue}>
                  {formatCurrency(balance)}
                </Text>
              </View>
            </View>

            {/* Pay Now Button */}
            <TouchableOpacity
              style={[
                styles.payButton,
                isProcessingPayment && styles.payButtonDisabled,
              ]}
              onPress={handlePayment}
              disabled={isProcessingPayment}
              activeOpacity={0.8}
            >
              {isProcessingPayment ? (
                <>
                  <ActivityIndicator size="small" color="white" />
                  <Text style={styles.payButtonText}>Processing...</Text>
                </>
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="credit-card"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.payButtonText}>Pay Now</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Security Notice */}
            <View style={styles.securityNotice}>
              <MaterialCommunityIcons
                name="shield-check"
                size={16}
                color="#10B981"
              />
              <Text style={styles.securityText}>Secure payment processing</Text>
            </View>
          </View>
        )}
      </ScrollView>
    );
  };

  // ============================================
  // LOADING & ERROR STATES
  // ============================================

  if (isLoading) {
    return (
      <ScreenWrapper
        title="My Dues"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading your dues...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !duesData) {
    return (
      <ScreenWrapper
        title="My Dues"
        navigation={navigation}
        headerStyle={{ backgroundColor: "white" }}
      >
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={48}
            color="#DC2626"
          />
          <Text style={styles.errorText}>Failed to load dues</Text>
          <Text style={styles.errorSubText}>
            {error?.message || "Please try again"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  // ============================================
  // SCREEN TITLE & BACK HANDLER LOGIC
  // ============================================

  const getScreenTitle = () => {
    if (currentScreen === "details") {
      return "Due Details";
    }
    return "My Dues";
  };

  const handleBackPress = () => {
    if (currentScreen === "details") {
      // From Details -> go back to My Dues screen
      navigateToMyDues();
    }
  };

  // Only show custom back handler when on details screen
  const shouldShowCustomBack = currentScreen === "details";

  return (
    <ScreenWrapper
      title={getScreenTitle()}
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
      onBackPress={shouldShowCustomBack ? handleBackPress : undefined}
    >
      {currentScreen === "myDues" && <MyDuesScreen />}
      {currentScreen === "details" && <DetailsScreen />}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#DC2626",
    fontWeight: "600",
  },
  errorSubText: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  summarySection: {
    padding: 16,
    backgroundColor: "white",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
    color: "#111827",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  summaryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryContent: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 14,
    color: "#111827",
  },
  householdCard: {
    backgroundColor: "white",
    padding: 16,
    marginBottom: 8,
  },
  householdHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  householdInfo: {
    flex: 1,
  },
  householdName: {
    fontSize: 16,
    color: "#111827",
  },
  householdType: {
    fontSize: 13,
    color: "#6B7280",
  },
  leaderBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#FEF3C7",
    borderRadius: 6,
  },
  leaderText: {
    fontSize: 12,
    color: "#92400E",
    fontWeight: "600",
  },
  tabsContainer: {
    backgroundColor: "white",
    paddingVertical: 12,
    marginBottom: 8,
  },
  tabsContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#D1FAE5",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  tabButtonTextActive: {
    color: "#10B981",
  },
  tabBadge: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "#10B981",
  },
  tabBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
  },
  tabBadgeTextActive: {
    color: "white",
  },
  duesSection: {
    padding: 16,
    gap: 12,
  },
  dueCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  dueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  dueCardTitleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dueCardTitle: {
    fontSize: 16,
    color: "#111827",
    flex: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  dueDescription: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  dueCardDetails: {
    gap: 8,
  },
  dueDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dueDetailLabel: {
    fontSize: 13,
    color: "#6B7280",
  },
  dueDetailValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
    fontFamily: "monospace",
  },
  overdueWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  overdueText: {
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },

  // ============================================
  // DETAILS SCREEN STYLES
  // ============================================

  detailsHeader: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 8,
  },
  detailsTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 20,
    color: "#111827",
    flex: 1,
  },
  detailsStatusContainer: {
    alignItems: "center",
  },
  detailsStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  detailsStatusText: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  detailsSection: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 8,
  },
  detailsSectionLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    fontWeight: "600",
  },
  detailsSectionValue: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 22,
  },
  financialGrid: {
    flexDirection: "row",
    gap: 12,
  },
  financialItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 8,
  },
  financialLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
  },
  financialValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    fontFamily: "monospace",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  detailsOverdueWarning: {
    margin: 16,
    padding: 16,
    backgroundColor: "#FEE2E2",
    borderRadius: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  detailsOverdueTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
    marginBottom: 4,
  },
  detailsOverdueText: {
    fontSize: 13,
    color: "#991B1B",
    lineHeight: 18,
  },
  detailsActions: {
    padding: 20,
    backgroundColor: "white",
    marginTop: 8,
  },
  paymentSummaryCard: {
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryRowLabel: {
    fontSize: 14,
    color: "#065F46",
    fontWeight: "600",
  },
  summaryRowValue: {
    fontSize: 24,
    color: "#10B981",
    fontWeight: "700",
    fontFamily: "monospace",
  },
  payButton: {
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
  payButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
  },
  securityText: {
    fontSize: 12,
    color: "#6B7280",
  },
});

export default HouseholdDues;
