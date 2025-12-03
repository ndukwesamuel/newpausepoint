import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useFetchData_v2 } from "./hooks/useApi";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
interface Transaction {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  reference: string;
  amount: number;
  currency: string;
  type: "debit" | "credit";
  status: "completed" | "pending" | "failed";
  details: string;
  createdAt: string;
  updatedAt: string;
}

const TransactionHistoryScreen = () => {
  const navigation = useNavigation();
  const [filterType, setFilterType] = useState<"all" | "credit" | "debit">(
    "all"
  );

  const {
    data: transactions,
    isError,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useFetchData_v2("api/v1/user/all-transaction-history", "wallet");

  console.log({
    tyuu: transactions,
  });

  // Filter transactions
  const filteredTransactions = transactions.transactions?.filter(
    (transaction) => {
      if (filterType === "all") return true;
      return transaction.type === filterType;
    }
  );

  // let filteredTransactions = [];

  // Group transactions by date
  const groupedTransactions = filteredTransactions?.reduce(
    (groups: any, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    },
    {}
  );

  // Format amount
  const formatAmount = (amount: number, currency: string = "NGN") => {
    return `${currency === "NGN" ? "₦" : currency}${amount.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  // Format time
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string, details: string) => {
    if (details.toLowerCase().includes("contribution")) {
      return { name: "hand-coin", color: "#F59E0B", bg: "#FEF3C7" };
    }
    if (details.toLowerCase().includes("transfer")) {
      return { name: "bank-transfer", color: "#3B82F6", bg: "#DBEAFE" };
    }
    if (type === "credit") {
      return { name: "arrow-down-circle", color: "#10B981", bg: "#D1FAE5" };
    }
    return { name: "arrow-up-circle", color: "#DC2626", bg: "#FEE2E2" };
  };

  // Navigate to detail screen
  const handleTransactionPress = (transaction: Transaction) => {
    navigation.navigate("TransactionDetail", { transaction });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading transactions...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={56} color="#DC2626" />
        <Text style={styles.errorText}>Failed to load transactions</Text>
        <Text style={styles.errorSubtext}>{error?.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      >
        <View style={styles.content}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.summaryHeader}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.summaryTitle}>Transaction Summary</Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredTransactions?.filter((t) => t.type === "credit")
                    .length || 0}
                </Text>
                <Text style={styles.statLabel}>Credits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredTransactions?.filter((t) => t.type === "debit")
                    .length || 0}
                </Text>
                <Text style={styles.statLabel}>Debits</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {filteredTransactions?.length || 0}
                </Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>

          {/* Filter Section */}
          <View style={styles.filterCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="filter-variant"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Filter Transactions</Text>
            </View>

            <View style={styles.filterButtons}>
              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterType === "all" && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType("all")}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === "all" && styles.filterButtonTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterType === "credit" && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType("credit")}
              >
                <MaterialCommunityIcons
                  name="arrow-down-circle"
                  size={16}
                  color={filterType === "credit" ? "#FFFFFF" : "#10B981"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === "credit" && styles.filterButtonTextActive,
                  ]}
                >
                  Credits
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.filterButton,
                  filterType === "debit" && styles.filterButtonActive,
                ]}
                onPress={() => setFilterType("debit")}
              >
                <MaterialCommunityIcons
                  name="arrow-up-circle"
                  size={16}
                  color={filterType === "debit" ? "#FFFFFF" : "#10B981"}
                  style={{ marginRight: 4 }}
                />
                <Text
                  style={[
                    styles.filterButtonText,
                    filterType === "debit" && styles.filterButtonTextActive,
                  ]}
                >
                  Debits
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Transactions List */}
          {!filteredTransactions || filteredTransactions.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="inbox" size={80} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>No Transactions Found</Text>
              <Text style={styles.emptyStateText}>
                {filterType !== "all"
                  ? `You don't have any ${filterType} transactions yet`
                  : "You don't have any transactions yet"}
              </Text>
            </View>
          ) : (
            Object.entries(groupedTransactions || {}).map(
              ([date, dayTransactions]: [string, any]) => (
                <View key={date} style={styles.transactionGroup}>
                  {/* Date Header */}
                  <Text style={styles.dateHeader}>{date}</Text>

                  {/* Transactions */}
                  {dayTransactions.map((transaction: Transaction) => {
                    const iconData = getTransactionIcon(
                      transaction.type,
                      transaction.details
                    );
                    return (
                      <TouchableOpacity
                        key={transaction._id}
                        style={styles.transactionCard}
                        onPress={() => handleTransactionPress(transaction)}
                        activeOpacity={0.7}
                      >
                        <View style={styles.transactionLeft}>
                          <View
                            style={[
                              styles.transactionIcon,
                              { backgroundColor: iconData.bg },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name={iconData.name as any}
                              size={24}
                              color={iconData.color}
                            />
                          </View>

                          <View style={styles.transactionInfo}>
                            <Text
                              style={styles.transactionTitle}
                              numberOfLines={1}
                            >
                              {transaction.details}
                            </Text>
                            <View style={styles.transactionMeta}>
                              <Text style={styles.transactionTime}>
                                {formatTime(transaction.createdAt)}
                              </Text>
                              <View style={styles.metaDot} />
                              <View
                                style={[
                                  styles.statusBadge,
                                  {
                                    backgroundColor:
                                      transaction.status === "completed"
                                        ? "#D1FAE5"
                                        : transaction.status === "pending"
                                        ? "#FEF3C7"
                                        : "#FEE2E2",
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.statusText,
                                    {
                                      color:
                                        transaction.status === "completed"
                                          ? "#065F46"
                                          : transaction.status === "pending"
                                          ? "#92400E"
                                          : "#991B1B",
                                    },
                                  ]}
                                >
                                  {transaction.status}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>

                        <View style={styles.transactionRight}>
                          <Text
                            style={[
                              styles.transactionAmount,
                              {
                                color:
                                  transaction.type === "credit"
                                    ? "#10B981"
                                    : "#DC2626",
                              },
                            ]}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                            {formatAmount(
                              transaction.amount,
                              transaction.currency
                            )}
                          </Text>
                          <MaterialCommunityIcons
                            name="chevron-right"
                            size={20}
                            color="#9CA3AF"
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  errorSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  summaryCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    marginLeft: 12,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  filterCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 8,
  },
  filterButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10B981",
    backgroundColor: "#FFFFFF",
  },
  filterButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  transactionGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  transactionMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionTime: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },
  transactionRight: {
    alignItems: "flex-end",
    flexDirection: "row",
    alignItems: "center",
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: "700",
    marginRight: 4,
    letterSpacing: 0.3,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    paddingHorizontal: 32,
    lineHeight: 20,
  },
});

export default TransactionHistoryScreen;
