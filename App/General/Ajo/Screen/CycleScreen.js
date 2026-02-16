

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useFetchData_v2, useMutateData } from "../../../../hooks/Requestv2";
import { useFetchData } from "../../../../hooks/Request";

const CycleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { _id: groupId, contributionAmount } = route.params.groupId;
  const maindata = route.params.groupId;

  console.log({
    jajakaka: maindata,
  });

  const { user_data } = useSelector((state) => state.AuthSlice);
  const currentUserId = user_data?.user?._id || user_data?._id;

  const [activeTab, setActiveTab] = useState("current");
  const [paymentModal, setPaymentModal] = useState(false);
  const [payoutModal, setPayoutModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current cycle
  const {
    data: currentCycleData,
    isLoading: loadingCurrentCycle,
    refetch: refetchCurrentCycle,
  } = useFetchData_v2(
    `api/v1/esusu/cycle/group/${groupId}/current`,
    `currentCycle-${groupId}`,
    {
      enabled: !!groupId,
    }
  );

  console.log({
    currentCycleResponse: currentCycleData,
  });

  // Fetch cycle history
  const {
    data: cycleHistoryData,
    isLoading: loadingHistory,
    refetch: refetchHistory,
  } = useFetchData_v2(
    `api/v1/esusu/cycle/group/${groupId}/history`,
    `cycleHistory-${groupId}`,
    {
      enabled: !!groupId,
    }
  );

  // Fetch wallet
  const {
    data: walletData,
    isLoading: loadingWallet,
    refetch: refetchWallet,
  } = useFetchData("wallet", "wallet");

  console.log({
    walletResponse: walletData,
  });

  const currentCycle = currentCycleData?.data;
  const cycleHistory = cycleHistoryData?.data || [];
  const userWallet = walletData?.data;
  const loading = loadingCurrentCycle || loadingHistory;

  // Payment mutation - only create if we have a cycle ID
  const paymentMutation = useMutateData(
    currentCycle?._id ? `api/v1/esusu/cycle/${currentCycle._id}/pay` : "dummy",
    "POST",
    [`currentCycle-${groupId}`, "wallet"],
    {
      onSuccess: () => {
        Alert.alert("Success", "Payment successful!", [
          {
            text: "OK",
            onPress: () => {
              refetchCurrentCycle();
              refetchWallet();
            },
          },
        ]);
      },
      onError: (error: any) => {
        console.error("Payment error:", error);
        Alert.alert(
          "Payment Failed",
          error?.data?.message || "Failed to process payment"
        );
      },
    }
  );

  // Payout mutation - only create if we have a cycle ID
  const payoutMutation = useMutateData(
    currentCycle?._id
      ? `api/v1/esusu/cycle/${currentCycle._id}/process-payout`
      : "dummy",
    "POST",
    [`currentCycle-${groupId}`, `cycleHistory-${groupId}`],
    {
      onSuccess: () => {
        Alert.alert(
          "Success",
          `Payout of ₦${formatAmount(currentCycle?.payoutAmount)} sent to ${
            currentCycle?.payoutRecipient?.name
          }!`,
          [
            {
              text: "OK",
              onPress: () => {
                refetchCurrentCycle();
                refetchHistory();
              },
            },
          ]
        );
      },
      onError: (error: any) => {
        console.error("Payout error:", error);
        Alert.alert(
          "Payout Failed",
          error?.data?.message || "Failed to process payout"
        );
      },
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCurrentCycle(),
      refetchHistory(),
      refetchWallet(),
    ]);
    setRefreshing(false);
  };

  const handlePayContribution = async () => {
    if (!currentCycle?._id) {
      Alert.alert("Error", "Unable to process payment. Please try again.");
      return;
    }

    setPaymentModal(false);
    setProcessingPayment(true);

    try {
      await paymentMutation.mutateAsync({
        paymentMethod: "wallet",
      });
    } catch (error) {
      console.error("Payment error:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const handleProcessPayout = async () => {
    if (!currentCycle?._id) {
      Alert.alert("Error", "Unable to process payout. Please try again.");
      return;
    }

    setPayoutModal(false);
    setProcessingPayment(true);

    try {
      await payoutMutation.mutateAsync({});
    } catch (error) {
      console.error("Payout error:", error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const formatAmount = (amount) => {
    return amount?.toLocaleString("en-NG") || "0";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateProgress = () => {
    if (!currentCycle) return 0;
    return Math.min(
      (currentCycle.totalCollected / currentCycle.totalExpected) * 100,
      100
    );
  };

  const getDaysRemaining = () => {
    if (!currentCycle) return 0;
    const today = new Date();
    const due = new Date(currentCycle.dueDate);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const isUserPaid = () => {
    if (!currentCycle || !currentUserId) return false;
    const userContribution = currentCycle.contributions.find(
      (c) => c.user._id === currentUserId
    );
    return userContribution?.paid || false;
  };

  const getUserContribution = () => {
    if (!currentCycle || !currentUserId) return null;
    return currentCycle.contributions.find((c) => c.user._id === currentUserId);
  };

  const isAdmin = () => {
    if (!maindata || !currentUserId) return false;
    return (
      maindata.creator?._id === currentUserId ||
      maindata.creator === currentUserId
    );
  };

  const renderPaymentModal = () => {
    const contribution = getUserContribution();
    if (!contribution) return null;

    const amountInNaira = contribution.amount;

    // ✅ Wallet balance is stored in kobo, convert to Naira
    const walletBalanceInKobo = userWallet?.balance || 0;
    const walletBalanceInNaira = walletBalanceInKobo / 100;

    const hasEnoughBalance = walletBalanceInNaira >= amountInNaira;

    console.log({
      contributionAmount: amountInNaira,
      walletBalanceKobo: walletBalanceInKobo,
      walletBalanceNaira: walletBalanceInNaira,
      hasEnoughBalance: hasEnoughBalance,
    });

    return (
      <Modal
        visible={paymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Pay Contribution</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Amount</Text>
              <Text style={styles.modalAmount}>
                ₦{formatAmount(amountInNaira)}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Payment Method</Text>
              <View style={styles.paymentMethodCard}>
                <Ionicons name="wallet" size={24} color="#8B5CF6" />
                <Text style={styles.paymentMethodText}>Wallet</Text>
              </View>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Wallet Balance</Text>
              <Text
                style={[
                  styles.modalBalance,
                  !hasEnoughBalance && styles.modalBalanceInsufficient,
                ]}
              >
                ₦{formatAmount(walletBalanceInNaira)}{" "}
                {hasEnoughBalance ? "✓" : "⚠️"}
              </Text>
            </View>

            {hasEnoughBalance && (
              <View style={styles.modalSection}>
                <Text style={styles.modalLabel}>After Payment</Text>
                <Text style={styles.modalBalanceAfter}>
                  ₦{formatAmount(walletBalanceInNaira - amountInNaira)}
                </Text>
              </View>
            )}

            {!hasEnoughBalance && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={20} color="#F59E0B" />
                <Text style={styles.warningText}>
                  Insufficient wallet balance. Please fund your wallet first.
                </Text>
              </View>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setPaymentModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPayButton,
                  (!hasEnoughBalance || processingPayment) &&
                    styles.modalPayButtonDisabled,
                ]}
                onPress={handlePayContribution}
                disabled={!hasEnoughBalance || processingPayment}
              >
                {processingPayment ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalPayText}>Pay Now</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderPayoutModal = () => {
    if (!currentCycle) return null;

    return (
      <Modal
        visible={payoutModal}
        transparent
        animationType="slide"
        onRequestClose={() => setPayoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Process Payout</Text>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Recipient</Text>
              <Text style={styles.modalRecipient}>
                {currentCycle.payoutRecipient.name}
              </Text>
              <Text style={styles.modalRecipientEmail}>
                {currentCycle.payoutRecipient.email}
              </Text>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalLabel}>Amount</Text>
              <Text style={styles.modalAmount}>
                ₦{formatAmount(currentCycle.payoutAmount)}
              </Text>
            </View>

            <View style={styles.warningBox}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
              <Text style={styles.warningText}>
                This action cannot be undone. The payout will be sent
                immediately.
              </Text>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setPayoutModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalPayoutButton,
                  processingPayment && styles.modalPayButtonDisabled,
                ]}
                onPress={handleProcessPayout}
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalPayText}>Process Payout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCurrentCycle = () => {
    if (!currentCycle) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No active cycle found</Text>
          <Text style={styles.emptySubtext}>
            The group hasn't started yet or all cycles are completed
          </Text>
        </View>
      );
    }

    const progress = calculateProgress();
    const paidCount = currentCycle.contributions.filter((c) => c.paid).length;
    const totalMembers = currentCycle.contributions.length;
    const userPaid = isUserPaid();
    const allPaid = paidCount === totalMembers;
    const isGroupAdmin = isAdmin();

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Cycle Header */}
        <View style={styles.cycleHeader}>
          <Text style={styles.cycleTitle}>
            Cycle {currentCycle.cycleNumber}
          </Text>
          <View
            style={[
              styles.statusBadge,
              currentCycle.status === "collecting" && styles.statusCollecting,
              currentCycle.status === "ready_for_payout" && styles.statusReady,
            ]}
          >
            <Text style={styles.statusText}>
              {currentCycle.status === "collecting"
                ? "Collecting"
                : "Ready for Payout"}
            </Text>
          </View>
        </View>

        {/* Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Collection Progress</Text>
            <Text style={styles.progressPercentage}>
              {progress.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressAmounts}>
            <Text style={styles.progressAmount}>
              ₦{formatAmount(currentCycle.totalCollected)}
            </Text>
            <Text style={styles.progressTotal}>
              {" "}
              / ₦{formatAmount(currentCycle.totalExpected)}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          <Text style={styles.progressMembers}>
            {paidCount} of {totalMembers} members paid
          </Text>
        </View>

        {/* Payout Info Card */}
        <View style={styles.payoutCard}>
          <Text style={styles.sectionTitle}>Next Payout</Text>
          <View style={styles.payoutInfo}>
            <View style={styles.payoutRecipientAvatar}>
              <Text style={styles.avatarText}>
                {currentCycle.payoutRecipient.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.payoutDetails}>
              <Text style={styles.payoutRecipientName}>
                {currentCycle.payoutRecipient.name}
              </Text>
              <Text style={styles.payoutAmount}>
                Will receive: ₦{formatAmount(currentCycle.payoutAmount)}
              </Text>
            </View>
          </View>
        </View>

        {/* Due Date Card */}
        <View style={styles.dueDateCard}>
          <View style={styles.dueDateInfo}>
            <Ionicons name="calendar" size={24} color="#6B7280" />
            <View style={styles.dueDateText}>
              <Text style={styles.dueDateLabel}>Due Date</Text>
              <Text style={styles.dueDateValue}>
                {formatDate(currentCycle.dueDate)}
              </Text>
            </View>
          </View>
          <View style={styles.daysRemaining}>
            <Text style={styles.daysNumber}>{getDaysRemaining()}</Text>
            <Text style={styles.daysLabel}>days left</Text>
          </View>
        </View>

        {/* Payment Status Section */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>Payment Status</Text>

          {currentCycle.contributions.map((contribution, index) => {
            const isCurrentUser = contribution.user._id === currentUserId;

            return (
              <View key={index} style={styles.contributionCard}>
                <View style={styles.contributionLeft}>
                  <View
                    style={[
                      styles.contributionAvatar,
                      contribution.paid && styles.contributionAvatarPaid,
                    ]}
                  >
                    <Text style={styles.contributionAvatarText}>
                      {contribution.user.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.contributionInfo}>
                    <View style={styles.contributionNameRow}>
                      <Text style={styles.contributionName}>
                        {isCurrentUser ? "You" : contribution.user.name}
                      </Text>
                      {isCurrentUser && (
                        <View style={styles.youBadge}>
                          <Text style={styles.youText}>You</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.contributionAmount}>
                      ₦{formatAmount(contribution.amount)}
                    </Text>
                    {contribution.paid && (
                      <Text style={styles.contributionDate}>
                        Paid on {formatDateTime(contribution.paidAt)}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={styles.contributionRight}>
                  {contribution.paid ? (
                    <View style={styles.paidBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color="#10B981"
                      />
                    </View>
                  ) : (
                    <View style={styles.unpaidBadge}>
                      <Ionicons name="close-circle" size={24} color="#EF4444" />
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          {!userPaid && !allPaid && (
            <TouchableOpacity
              style={styles.payButton}
              onPress={() => setPaymentModal(true)}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="card" size={24} color="#FFFFFF" />
                  <Text style={styles.payButtonText}>
                    Pay ₦{formatAmount(contributionAmount || 0)} Now
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {userPaid && !allPaid && (
            <View style={styles.paidNotice}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.paidNoticeText}>
                You've paid! Waiting for others...
              </Text>
            </View>
          )}

          {allPaid && isGroupAdmin && (
            <TouchableOpacity
              style={styles.payoutButton}
              onPress={() => setPayoutModal(true)}
              disabled={processingPayment}
            >
              {processingPayment ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cash" size={24} color="#FFFFFF" />
                  <Text style={styles.payoutButtonText}>
                    Process Payout to {currentCycle.payoutRecipient.name}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {allPaid && !isGroupAdmin && (
            <View style={styles.readyNotice}>
              <Ionicons name="hourglass" size={24} color="#F59E0B" />
              <Text style={styles.readyNoticeText}>
                All payments collected! Waiting for admin to process payout...
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  const renderHistory = () => {
    if (cycleHistory.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No cycle history yet</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.tabContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {cycleHistory.map((cycle, index) => {
          const isCompleted = cycle.status === "completed";
          const paidCount = cycle.contributions.filter((c) => c.paid).length;
          const totalMembers = cycle.contributions.length;

          return (
            <View key={cycle._id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyTitle}>
                  Cycle {cycle.cycleNumber}
                </Text>
                <View
                  style={[
                    styles.historyStatusBadge,
                    isCompleted
                      ? styles.historyStatusCompleted
                      : styles.historyStatusActive,
                  ]}
                >
                  <Text style={styles.historyStatusText}>
                    {isCompleted ? "Completed" : "Active"}
                  </Text>
                </View>
              </View>

              <View style={styles.historyDetails}>
                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Total Collected</Text>
                  <Text style={styles.historyValue}>
                    ₦{formatAmount(cycle.totalCollected)} / ₦
                    {formatAmount(cycle.totalExpected)}
                  </Text>
                </View>

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Members Paid</Text>
                  <Text style={styles.historyValue}>
                    {paidCount} / {totalMembers}
                  </Text>
                </View>

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Recipient</Text>
                  <Text style={styles.historyValue}>
                    {cycle.payoutRecipient.name}
                  </Text>
                </View>

                {isCompleted && cycle.payoutProcessedAt && (
                  <View style={styles.historyRow}>
                    <Text style={styles.historyLabel}>Payout Sent</Text>
                    <Text style={styles.historyValue}>
                      {formatDate(cycle.payoutProcessedAt)}
                    </Text>
                  </View>
                )}

                <View style={styles.historyRow}>
                  <Text style={styles.historyLabel}>Due Date</Text>
                  <Text style={styles.historyValue}>
                    {formatDate(cycle.dueDate)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  if (loading && !currentCycle) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading cycle data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "current" && styles.activeTab]}
          onPress={() => setActiveTab("current")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "current" && styles.activeTabText,
            ]}
          >
            Current
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "current" && renderCurrentCycle()}
      {activeTab === "history" && renderHistory()}

      {/* Modals */}
      {renderPaymentModal()}
      {renderPayoutModal()}
    </View>
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
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#8B5CF6",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  activeTabText: {
    color: "#8B5CF6",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
    paddingHorizontal: 40,
  },
  cycleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cycleTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusCollecting: {
    backgroundColor: "#FEF3C7",
  },
  statusReady: {
    backgroundColor: "#D1FAE5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  progressAmounts: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  progressAmount: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
  },
  progressTotal: {
    fontSize: 18,
    color: "#6B7280",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 6,
  },
  progressMembers: {
    fontSize: 14,
    color: "#6B7280",
  },
  payoutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  payoutInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  payoutRecipientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  payoutDetails: {
    flex: 1,
  },
  payoutRecipientName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  payoutAmount: {
    fontSize: 14,
    color: "#6B7280",
  },
  dueDateCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dueDateInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dueDateText: {
    marginLeft: 12,
  },
  dueDateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  dueDateValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  daysRemaining: {
    alignItems: "center",
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
  },
  daysNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  daysLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  statusSection: {
    marginBottom: 16,
  },
  contributionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contributionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contributionAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  contributionAvatarPaid: {
    backgroundColor: "#D1FAE5",
  },
  contributionAvatarText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6B7280",
  },
  contributionInfo: {
    flex: 1,
  },
  contributionNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  contributionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  youBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  youText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  contributionAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 2,
  },
  contributionDate: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  contributionRight: {
    marginLeft: 12,
  },
  paidBadge: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  unpaidBadge: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  actionSection: {
    marginBottom: 16,
  },
  payButton: {
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  paidNotice: {
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  paidNoticeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#065F46",
    marginLeft: 12,
  },
  payoutButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  payoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  readyNotice: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  readyNoticeText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#92400E",
    marginLeft: 12,
    flex: 1,
  },
  historyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  historyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  historyStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  historyStatusCompleted: {
    backgroundColor: "#E5E7EB",
  },
  historyStatusActive: {
    backgroundColor: "#FEF3C7",
  },
  historyStatusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  historyDetails: {
    gap: 12,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },
  paymentMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#8B5CF6",
  },
  paymentMethodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginLeft: 12,
  },
  modalBalance: {
    fontSize: 24,
    fontWeight: "600",
    color: "#10B981",
  },
  modalBalanceInsufficient: {
    color: "#EF4444",
  },
  modalBalanceAfter: {
    fontSize: 20,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalRecipient: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  modalRecipientEmail: {
    fontSize: 14,
    color: "#6B7280",
  },
  warningBox: {
    backgroundColor: "#FEF3C7",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  warningText: {
    fontSize: 14,
    color: "#92400E",
    marginLeft: 12,
    flex: 1,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalPayButton: {
    flex: 1,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalPayButtonDisabled: {
    backgroundColor: "#D1D5DB",
    opacity: 0.6,
  },
  modalPayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  modalPayoutButton: {
    flex: 1,
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
});

export default CycleScreen;
