import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Share,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const GroupDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { item } = route.params;

  const [group, setGroup] = useState(item);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh - in production you'd fetch updated data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join my savings group "${group.name}"! 
Goal: ₦${group.goalAmount.toLocaleString("en-NG")}
Invite Code: ${group.inviteCode}`,
        title: "Join ColaSave Group",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleWithdraw = () => {
    const isAdmin = group.createdBy._id === group.members[0]?.user._id;

    if (!isAdmin) {
      Alert.alert("Error", "Only the group admin can initiate withdrawals");
      return;
    }

    const canWithdraw =
      group.totalSaved >= group.goalAmount ||
      new Date(group.targetDate) <= new Date();

    if (!canWithdraw) {
      Alert.alert(
        "Cannot Withdraw",
        "Withdrawal is only allowed when the goal is reached or target date has passed"
      );
      return;
    }

    navigation.navigate("Withdrawal", { groupId: group._id });
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateProgress = () => {
    return Math.min((group.totalSaved / group.goalAmount) * 100, 100);
  };

  const getDaysRemaining = () => {
    const today = new Date();
    const target = new Date(group.targetDate);
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="wallet" size={32} color="#8B5CF6" />
          <Text style={styles.statValue}>
            {formatCurrency(group.totalSaved)}
          </Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="flag" size={32} color="#10B981" />
          <Text style={styles.statValue}>
            {formatCurrency(group.goalAmount)}
          </Text>
          <Text style={styles.statLabel}>Goal</Text>
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressPercentage}>
            {calculateProgress().toFixed(1)}%
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${calculateProgress()}%` }]}
          />
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Target Date</Text>
          <Text style={styles.infoValue}>{formatDate(group.targetDate)}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Days Left</Text>
          <Text style={styles.infoValue}>{getDaysRemaining()} days</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="repeat" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Frequency</Text>
          <Text style={styles.infoValue}>{group.frequency}</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="people" size={20} color="#6B7280" />
          <Text style={styles.infoLabel}>Members</Text>
          <Text style={styles.infoValue}>{group.members.length}</Text>
        </View>
      </View>

      <View style={styles.infoItem}>
        <Ionicons name="key" size={20} color="#6B7280" />
        <Text style={styles.infoLabel}>Invite Code</Text>
        <Text style={styles.infoValue}>{group.inviteCode}</Text>
      </View>

      <View style={styles.descriptionCard}>
        <Text style={styles.descriptionTitle}>About</Text>
        <Text style={styles.descriptionText}>{group.description}</Text>
      </View>
    </View>
  );

  const renderMembers = () => (
    <View style={styles.tabContent}>
      {group.members.map((member) => (
        <View key={member.user._id} style={styles.memberCard}>
          <View style={styles.memberInfo}>
            <View style={styles.memberAvatar}>
              <Text style={styles.memberAvatarText}>
                {member.user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles.memberDetails}>
              <View style={styles.memberNameRow}>
                <Text style={styles.memberName}>{member.user.name}</Text>
                {member.user._id === group.createdBy._id && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminText}>Admin</Text>
                  </View>
                )}
              </View>
              <Text style={styles.memberDate}>
                Joined {formatDate(member.joinedAt)}
              </Text>
            </View>
          </View>
          <View style={styles.memberContribution}>
            <Text style={styles.memberAmount}>
              {formatCurrency(member.totalContributed)}
            </Text>
            {group.totalSaved > 0 && (
              <Text style={styles.memberPercentage}>
                {((member.totalContributed / group.totalSaved) * 100).toFixed(
                  1
                )}
                %
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );

  const renderTransactions = () => (
    <View style={styles.tabContent}>
      {!group.contributions || group.contributions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyText}>No transactions yet</Text>
        </View>
      ) : (
        group.contributions.map((contribution, index) => (
          <View key={index} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <Ionicons name="arrow-down" size={20} color="#10B981" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionUser}>
                {contribution.user?.name || "Unknown User"}
              </Text>
              <Text style={styles.transactionDate}>
                {formatDate(contribution.date || contribution.createdAt)}
              </Text>
            </View>
            <Text style={[styles.transactionAmount, { color: "#10B981" }]}>
              +{formatCurrency(contribution.amount)}
            </Text>
          </View>
        ))
      )}
    </View>
  );

  if (!group) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "overview" && styles.activeTab]}
          onPress={() => setActiveTab("overview")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "overview" && styles.activeTabText,
            ]}
          >
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "members" && styles.activeTab]}
          onPress={() => setActiveTab("members")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "members" && styles.activeTabText,
            ]}
          >
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "transactions" && styles.activeTab]}
          onPress={() => setActiveTab("transactions")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "transactions" && styles.activeTabText,
            ]}
          >
            Transactions
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.headerTitle}>{group.name}</Text>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && renderOverview()}
        {activeTab === "members" && renderMembers()}
        {activeTab === "transactions" && renderTransactions()}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.contributeButton}
          onPress={() =>
            navigation.navigate("CycleScreen", { groupId: group._id })
          }
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.contributeButtonText}>Contribute</Text>
        </TouchableOpacity>

        {group.createdBy._id === group.members[0]?.user._id && (
          <TouchableOpacity
            style={styles.withdrawButton}
            onPress={handleWithdraw}
          >
            <Ionicons name="cash" size={24} color="#8B5CF6" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
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
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 12,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  progressSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 6,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  infoItem: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  memberCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  memberInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  memberAvatarText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  memberDetails: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginRight: 8,
  },
  adminBadge: {
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  adminText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  memberDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  memberContribution: {
    alignItems: "flex-end",
  },
  memberAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  memberPercentage: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionUser: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  transactionDate: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 16,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  contributeButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    paddingVertical: 16,
    marginRight: 8,
  },
  contributeButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  withdrawButton: {
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EDE9FE",
    borderRadius: 12,
  },
});

export default GroupDetailScreen;
