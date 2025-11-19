import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
// import { useFetchData_v2 } from "../../../../hooks/Requestv2";
import { useSelector } from "react-redux";
import { useFetchData_v2 } from "../../../../hooks/Requestv2";

const Ajo = () => {
  const navigation = useNavigation();

  // const qqqq = useSelector((state) => state.authSlice);
  // console.log({
  //   emek: qqqq,
  // });

  const { userData } = useSelector((state) => state.authSlice);
  console.log({
    emek: userData,
  });

  const {
    data: getALlAjo,
    isLoading: isLoadinggetALlAjo,
    error: iserrorgetALlAjo,
    isFetching,
    refetch,
  } = useFetchData_v2(`api/v1/ajo/67fe7602ff5d9e29a8f31baf/`, "errand");

  // Extract groups from the response
  const groups = getALlAjo || [];
  const loading = isLoadinggetALlAjo;
  const refreshing = isFetching && !isLoadinggetALlAjo;

  const onRefresh = () => {
    refetch();
  };

  const calculateProgress = (totalSaved, goalAmount) => {
    return Math.min((totalSaved / goalAmount) * 100, 100);
  };

  const formatCurrency = (amount) => {
    return `₦${amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "completed":
        return "#3B82F6";
      case "withdrawn":
        return "#6B7280";
      default:
        return "#10B981";
    }
  };

  const renderGroupCard = ({ item }) => {
    const progress = calculateProgress(item.totalSaved, item.goalAmount);
    const myContribution =
      item.members.find((m) => m.user._id === "67fe7602ff5d9e29a8f31baf")
        ?.totalContributed || 0;

    return (
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => navigation.navigate("GroupDetail", { item: item })}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.groupName}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(item.status) },
              ]}
            >
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#6B7280" />
        </View>

        <Text style={styles.groupDescription} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.amountContainer}>
          <View>
            <Text style={styles.amountLabel}>Saved</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(item.totalSaved)}
            </Text>
          </View>
          <View>
            <Text style={styles.amountLabel}>Goal</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(item.goalAmount)}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress.toFixed(1)}%</Text>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Ionicons name="people" size={16} color="#6B7280" />
            <Text style={styles.footerText}>{item.members.length} members</Text>
          </View>
          <View style={styles.footerItem}>
            <Ionicons name="wallet" size={16} color="#6B7280" />
            <Text style={styles.footerText}>
              You: {formatCurrency(myContribution)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
      </View>
    );
  }

  if (iserrorgetALlAjo) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
        <Text style={styles.emptyTitle}>Error Loading Groups</Text>
        <Text style={styles.emptyText}>
          {iserrorgetALlAjo?.message || "Something went wrong"}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Savings Groups</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => navigation.navigate("MyStats")}
        >
          <Ionicons name="stats-chart" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {groups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={80} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Saving Groups Yet</Text>
          <Text style={styles.emptyText}>
            Create or join a group to start saving together
          </Text>
        </View>
      ) : (
        <FlatList
          data={groups}
          renderItem={renderGroupCard}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("CreateGroup")}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
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
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
  },
  iconButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  groupDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginRight: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#8B5CF6",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8B5CF6",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#8B5CF6",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Ajo;
