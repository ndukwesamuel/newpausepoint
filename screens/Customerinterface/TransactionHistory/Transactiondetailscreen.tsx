import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

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

interface TransactionDetailScreenProps {
  route: {
    params: {
      transaction: Transaction;
    };
  };
  navigation: any;
}

const TransactionDetailScreen: React.FC<TransactionDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { transaction } = route.params;

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

  // Format date and time
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const dateStr = date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    return { date: dateStr, time: timeStr };
  };

  const { date, time } = formatDateTime(transaction.createdAt);

  // Copy to clipboard
  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert("Copied!", `${label} copied to clipboard`);
  };

  // Share transaction
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Transaction Receipt\n\nReference: ${
          transaction.reference
        }\nAmount: ${formatAmount(
          transaction.amount,
          transaction.currency
        )}\nType: ${transaction.type.toUpperCase()}\nStatus: ${transaction.status.toUpperCase()}\nDate: ${date} at ${time}\n\nDetails: ${
          transaction.details
        }`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  // Get icon for transaction type
  const getTransactionIcon = (type: string, details: string) => {
    if (details?.toLowerCase().includes("contribution")) {
      return { name: "hand-coin", color: "#F59E0B", bg: "#FEF3C7" };
    }
    if (details?.toLowerCase().includes("transfer")) {
      return { name: "bank-transfer", color: "#3B82F6", bg: "#DBEAFE" };
    }
    if (type === "credit") {
      return { name: "arrow-down-circle", color: "#10B981", bg: "#D1FAE5" };
    }
    return { name: "arrow-up-circle", color: "#DC2626", bg: "#FEE2E2" };
  };

  const iconData = getTransactionIcon(transaction.type, transaction.details);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Hero Card - Transaction Status */}
          <View
            style={[
              styles.heroCard,
              {
                backgroundColor:
                  transaction.status === "completed"
                    ? "#10B981"
                    : transaction.status === "pending"
                    ? "#F59E0B"
                    : "#DC2626",
                shadowColor:
                  transaction.status === "completed"
                    ? "#10B981"
                    : transaction.status === "pending"
                    ? "#F59E0B"
                    : "#DC2626",
              },
            ]}
          >
            <View style={styles.decorativeCircle1} />
            <View style={styles.decorativeCircle2} />

            <View style={styles.heroIconContainer}>
              <MaterialCommunityIcons
                name={
                  transaction.status === "completed"
                    ? "check-circle"
                    : transaction.status === "pending"
                    ? "clock-outline"
                    : "close-circle"
                }
                size={56}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.heroTitle}>
              {transaction.status === "completed"
                ? "Transaction Successful"
                : transaction.status === "pending"
                ? "Transaction Pending"
                : "Transaction Failed"}
            </Text>

            <Text style={styles.heroAmount}>
              {transaction.type === "credit" ? "+" : "-"}
              {formatAmount(transaction.amount, transaction.currency)}
            </Text>

            <View style={styles.heroDate}>
              <MaterialCommunityIcons
                name="calendar-clock"
                size={16}
                color="rgba(255, 255, 255, 0.9)"
              />
              <Text style={styles.heroDateText}>
                {date} at {time}
              </Text>
            </View>
          </View>

          {/* Transaction Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="information"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Transaction Details</Text>
            </View>

            {/* Type */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View
                  style={[styles.detailIcon, { backgroundColor: iconData.bg }]}
                >
                  <MaterialCommunityIcons
                    name={iconData.name as any}
                    size={20}
                    color={iconData.color}
                  />
                </View>
                <Text style={styles.detailLabel}>Type</Text>
              </View>
              <View style={styles.detailRight}>
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor:
                        transaction.type === "credit" ? "#D1FAE5" : "#FEE2E2",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.typeBadgeText,
                      {
                        color:
                          transaction.type === "credit" ? "#065F46" : "#991B1B",
                      },
                    ]}
                  >
                    {transaction.type === "credit" ? "Money In" : "Money Out"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Status */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="checkbox-marked-circle"
                    size={20}
                    color="#3B82F6"
                  />
                </View>
                <Text style={styles.detailLabel}>Status</Text>
              </View>
              <View style={styles.detailRight}>
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
                      styles.statusBadgeText,
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
                    {transaction.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="text"
                    size={20}
                    color="#6366F1"
                  />
                </View>
                <Text style={styles.detailLabel}>Description</Text>
              </View>
            </View>
            <Text style={styles.descriptionText}>{transaction.details}</Text>

            {/* Reference */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="tag"
                    size={20}
                    color="#8B5CF6"
                  />
                </View>
                <Text style={styles.detailLabel}>Reference</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() =>
                  copyToClipboard(transaction.reference, "Reference")
                }
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.referenceText}>{transaction.reference}</Text>

            {/* Transaction ID */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.detailIcon}>
                  <MaterialCommunityIcons
                    name="identifier"
                    size={20}
                    color="#EC4899"
                  />
                </View>
                <Text style={styles.detailLabel}>Transaction ID</Text>
              </View>
              <TouchableOpacity
                style={styles.copyButton}
                onPress={() =>
                  copyToClipboard(transaction._id, "Transaction ID")
                }
              >
                <MaterialCommunityIcons
                  name="content-copy"
                  size={16}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.referenceText}>{transaction._id}</Text>
          </View>

          {/* User Information Card */}
          <View style={styles.userCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>User Information</Text>
            </View>

            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitials}>
                  {transaction.user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{transaction.user.name}</Text>
                <Text style={styles.userEmail}>{transaction.user.email}</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <MaterialCommunityIcons
                name="share-variant"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.shareButtonText}>Share Receipt</Text>
            </TouchableOpacity>
          </View>

          {/* Help Section */}
          <View style={styles.helpCard}>
            <MaterialCommunityIcons
              name="help-circle"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.helpText}>
              Need help with this transaction? Contact our support team.
            </Text>
          </View>
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
  heroCard: {
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
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
  heroIconContainer: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  heroDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  heroDateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  detailRight: {
    marginLeft: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  descriptionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 20,
    marginBottom: 16,
    paddingLeft: 52,
  },
  copyButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  referenceText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    paddingLeft: 52,
    marginBottom: 16,
    lineHeight: 18,
  },
  userCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userInitials: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  actionButtons: {
    marginBottom: 16,
  },
  shareButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  helpCard: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  helpText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    lineHeight: 18,
  },
});

export default TransactionDetailScreen;
