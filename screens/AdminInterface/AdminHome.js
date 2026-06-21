import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Get_Single_clan } from "../../Redux/UserSide/ClanSlice";
import Announcement from "./Announcement/Announcement";

export default function AdminHome() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useDispatch();

  const { get_user_profile_data, loading: profileLoading } = useSelector(
    (state) => state.UserProfileSlice || {},
  );

  // Extract the actual user data from the nested structure
  const userProfileData =
    get_user_profile_data?.data || get_user_profile_data || {};

  const { get_Single_clan_data, loading: clanLoading } = useSelector(
    (state) => state?.ClanSlice || {},
  );

  // Get the clan ID from the user profile data
  const clanId =
    userProfileData?.AdmincurrentClanMeeting?._id ||
    userProfileData?.AdmincurrentClanMeeting;

  useEffect(() => {
    if (clanId) {
      dispatch(Get_Single_clan(clanId));
    }
  }, [dispatch, clanId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (clanId) {
      dispatch(Get_Single_clan(clanId)).finally(() => setRefreshing(false));
    } else {
      setRefreshing(false);
    }
  }, [dispatch, clanId]);

  // Safe data extraction with null checks
  const clanData = get_user_profile_data?.data?.AdmincurrentClanMeeting; //get_Single_clan_data?.data || get_Single_clan_data || {};

  console.log({
    xtyyyy: clanData,
  });

  const members = clanData?.members || [];
  const totalUsers = members.length;

  function countUsersByStatus(users, status) {
    if (!users || !Array.isArray(users)) return 0;
    return users.filter((user) => user?.status === status).length;
  }

  const approvedCount = countUsersByStatus(members, "approved");
  const suspendCount = countUsersByStatus(members, "suspended");
  const pendingCount = countUsersByStatus(members, "pending");

  // Safe percentage calculations
  const approvedPercentage =
    totalUsers > 0
      ? parseFloat(((approvedCount / totalUsers) * 100).toFixed(2))
      : 0;
  const suspendPercentage =
    totalUsers > 0
      ? parseFloat(((suspendCount / totalUsers) * 100).toFixed(2))
      : 0;
  const pendingPercentage =
    totalUsers > 0
      ? parseFloat(((pendingCount / totalUsers) * 100).toFixed(2))
      : 0;

  // Modern quick action buttons data
  const quickActions = [
    // {
    //   id: 1,
    //   title: "Clan",
    //   icon: "account-group",
    //   color: "#10B981",
    //   bg: "#D1FAE5",
    //   screen: "AdminEmergencies",
    // },
    {
      id: 2,
      title: "My Clans",
      icon: "home-group",
      color: "#3B82F6",
      bg: "#DBEAFE",
      screen: "AdminMyclan",
    },
    // {
    //   id: 3,
    //   title: "Announcements",
    //   icon: "bullhorn",
    //   color: "#F59E0B",
    //   bg: "#FEF3C7",
    //   screen: "AdminAnnouncement",
    // },
    // {
    //   id: 4,
    //   title: "Guests",
    //   icon: "account-multiple",
    //   color: "#8B5CF6",
    //   bg: "#EDE9FE",
    //   screen: "AdminGuest",
    // },
    // {
    //   id: 5,
    //   title: "Service",
    //   icon: "wrench",
    //   color: "#EC4899",
    //   bg: "#FCE7F3",
    //   screen: "Service",
    // },
    // {
    //   id: 6,
    //   title: "MarketPlace",
    //   icon: "store",
    //   color: "#14B8A6",
    //   bg: "#CCFBF1",
    //   screen: "AdminMarketPlace",
    // },
    {
      id: 7,
      title: "QR Scanner",
      icon: "qrcode-scan",
      color: "#6366F1",
      bg: "#E0E7FF",
      screen: "scanner",
    },
    // {
    //   id: 8,
    //   title: "User Polls",
    //   icon: "poll",
    //   color: "#F97316",
    //   bg: "#FFEDD5",
    //   screen: "AdminUserPolls",
    // },
  ];

  // Loading state
  if (profileLoading || clanLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  // No clan associated state
  const hasNoClan = totalUsers === 0 && !clanLoading && clanId === undefined;

  if (hasNoClan) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.noClanContainer}>
          <View style={styles.noClanIconContainer}>
            <MaterialCommunityIcons
              name="home-group"
              size={64}
              color="#10B981"
            />
          </View>
          <Text style={styles.noClanTitle}>No Clan Associated</Text>
          <Text style={styles.noClanMessage}>
            You are not currently associated with any clan. Please contact your
            estate administrator or join a clan to access features.
          </Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              if (clanId) {
                dispatch(Get_Single_clan(clanId));
              }
            }}
          >
            <Text style={styles.refreshButtonText}>Refresh</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const clanName = clanData?.name || "Your Clan";
  const adminName =
    userProfileData?.user?.name || userProfileData?.name || "Admin";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#10B981"]}
          />
        }
      >
        <View style={styles.contentContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View>
              <Text style={styles.greetingText}>Welcome back,</Text>
              <Text style={styles.userNameText}>{adminName.split(" ")[0]}</Text>
              <View style={styles.clanBadge}>
                <MaterialCommunityIcons
                  name="home-group"
                  size={16}
                  color="#10B981"
                />
                <Text style={styles.clanBadgeText}>{clanName}</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards Row */}
          <View style={styles.statsContainer}>
            {/* Active Users Card */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#D1FAE5" },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-check"
                  size={24}
                  color="#10B981"
                />
              </View>
              <Text style={styles.statValue}>{approvedCount}</Text>
              <Text style={styles.statLabel}>Active Users</Text>
              <View style={styles.statTrend}>
                <MaterialCommunityIcons
                  name="trending-up"
                  size={12}
                  color="#10B981"
                />
                <Text style={[styles.statPercentage, { color: "#10B981" }]}>
                  {approvedPercentage}%
                </Text>
              </View>
            </View>

            {/* Suspended Users Card */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#FEE2E2" },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-off"
                  size={24}
                  color="#DC2626"
                />
              </View>
              <Text style={styles.statValue}>{suspendCount}</Text>
              <Text style={styles.statLabel}>Suspended</Text>
              <View style={styles.statTrend}>
                <MaterialCommunityIcons
                  name="trending-down"
                  size={12}
                  color="#DC2626"
                />
                <Text style={[styles.statPercentage, { color: "#DC2626" }]}>
                  {suspendPercentage}%
                </Text>
              </View>
            </View>

            {/* Pending Users Card */}
            <View style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: "#FEF3C7" },
                ]}
              >
                <MaterialCommunityIcons
                  name="account-clock"
                  size={24}
                  color="#F59E0B"
                />
              </View>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
              <View style={styles.statTrend}>
                <MaterialCommunityIcons
                  name="clock"
                  size={12}
                  color="#F59E0B"
                />
                <Text style={[styles.statPercentage, { color: "#F59E0B" }]}>
                  {pendingPercentage}%
                </Text>
              </View>
            </View>
          </View>

          {/* Total Members Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalCardContent}>
              <View style={styles.totalIconContainer}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={32}
                  color="#FFFFFF"
                />
              </View>
              <View>
                <Text style={styles.totalLabel}>Total Members</Text>
                <Text style={styles.totalValue}>{totalUsers}</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="lightning-bolt"
                size={22}
                color="#10B981"
              />
              <Text style={styles.sectionTitle}>Quick Actions</Text>
            </View>

            <View style={styles.quickActionsGrid}>
              {quickActions.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickActionItem}
                  onPress={() => navigation.navigate(item.screen)}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      { backgroundColor: item.bg },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={28}
                      color={item.color}
                    />
                  </View>
                  <Text style={styles.quickActionLabel}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Announcements Section */}
          {/* <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="bullhorn"
                size={22}
                color="#10B981"
              />
              <Text style={styles.sectionTitle}>Announcements</Text>
              <TouchableOpacity
                style={styles.seeAllButton}
                onPress={() => navigation.navigate("AdminAnnouncement")}
              >
                <Text style={styles.seeAllText}>See All</Text>
                <MaterialCommunityIcons
                  name="arrow-right"
                  size={16}
                  color="#10B981"
                />
              </TouchableOpacity>
            </View>
            <Announcement />
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  contentContainer: {
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 30,
  },
  noClanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    minHeight: Dimensions.get("window").height - 100,
  },
  noClanIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  noClanTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 12,
    textAlign: "center",
  },
  noClanMessage: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  refreshButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  // Header Styles
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  userNameText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  clanBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    alignSelf: "flex-start",
  },
  clanBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  profileButton: {
    position: "relative",
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#DC2626",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  // Stats Styles
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6B7280",
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  statTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statPercentage: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  // Total Card
  totalCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 10,
    padding: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  totalCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  totalIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.8)",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  // Section Styles
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
    marginLeft: 8,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  quickActionItem: {
    width: "22%",
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.3,
    textAlign: "center",
  },
});
