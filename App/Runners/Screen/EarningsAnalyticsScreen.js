import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const EarningsAnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [selectedTab, setSelectedTab] = useState("earnings");

  const periods = [
    { key: "day", label: "Today" },
    { key: "week", label: "This Week" },
    { key: "month", label: "This Month" },
    { key: "year", label: "This Year" },
  ];

  const earningsData = {
    day: { total: 8500, errands: 6, hours: 8, average: 1417 },
    week: { total: 45200, errands: 28, hours: 42, average: 1614 },
    month: { total: 180500, errands: 124, hours: 186, average: 1456 },
    year: { total: 2100000, errands: 1450, hours: 2180, average: 1448 },
  };

  const performanceData = {
    completionRate: 96.5,
    customerRating: 4.8,
    onTimeDelivery: 94.2,
    responseTime: 2.3, // minutes
  };

  const weeklyData = [
    { day: "Mon", earnings: 6500, errands: 4 },
    { day: "Tue", earnings: 8200, errands: 6 },
    { day: "Wed", earnings: 5800, errands: 3 },
    { day: "Thu", earnings: 7400, errands: 5 },
    { day: "Fri", earnings: 9200, errands: 7 },
    { day: "Sat", earnings: 4500, errands: 2 },
    { day: "Sun", earnings: 3600, errands: 1 },
  ];

  const achievements = [
    {
      title: "Speed Demon",
      description: "100 errands completed in under 30 mins",
      earned: true,
      icon: "⚡",
    },
    {
      title: "Customer Favorite",
      description: "Maintain 4.8+ rating for 30 days",
      earned: true,
      icon: "⭐",
    },
    {
      title: "Weekend Warrior",
      description: "Complete 50 weekend errands",
      earned: false,
      icon: "🏆",
    },
    {
      title: "Early Bird",
      description: "Complete 25 errands before 9 AM",
      earned: false,
      icon: "🌅",
    },
  ];

  const currentData = earningsData[selectedPeriod];
  const maxEarnings = Math.max(...weeklyData.map((d) => d.earnings));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Analytics</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "earnings" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("earnings")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "earnings" && styles.activeTabText,
                ]}
              >
                Earnings
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === "performance" && styles.activeTab,
              ]}
              onPress={() => setSelectedTab("performance")}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "performance" && styles.activeTabText,
                ]}
              >
                Performance
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {selectedTab === "earnings" && (
          <>
            {/* Period Selector */}
            <View style={styles.periodSelector}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period.key}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period.key && styles.activePeriodButton,
                  ]}
                  onPress={() => setSelectedPeriod(period.key)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period.key &&
                        styles.activePeriodButtonText,
                    ]}
                  >
                    {period.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Earnings Overview */}
            <View style={styles.overviewCard}>
              <Text style={styles.cardTitle}>Earnings Overview</Text>
              <View style={styles.overviewGrid}>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewAmount}>
                    ₦{currentData.total.toLocaleString()}
                  </Text>
                  <Text style={styles.overviewLabel}>Total Earnings</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewAmount}>
                    {currentData.errands}
                  </Text>
                  <Text style={styles.overviewLabel}>Errands Completed</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewAmount}>
                    {currentData.hours}h
                  </Text>
                  <Text style={styles.overviewLabel}>Hours Worked</Text>
                </View>
                <View style={styles.overviewItem}>
                  <Text style={styles.overviewAmount}>
                    ₦{currentData.average}
                  </Text>
                  <Text style={styles.overviewLabel}>Avg per Errand</Text>
                </View>
              </View>
            </View>

            {/* Weekly Chart */}
            <View style={styles.chartCard}>
              <Text style={styles.cardTitle}>Daily Breakdown (This Week)</Text>
              <View style={styles.chart}>
                {weeklyData.map((data, index) => {
                  const barHeight = (data.earnings / maxEarnings) * 100;
                  return (
                    <View key={index} style={styles.chartBar}>
                      <View style={styles.barContainer}>
                        <View
                          style={[styles.bar, { height: `${barHeight}%` }]}
                        />
                        <Text style={styles.barAmount}>
                          ₦{(data.earnings / 1000).toFixed(1)}k
                        </Text>
                      </View>
                      <Text style={styles.barLabel}>{data.day}</Text>
                      <Text style={styles.barErrands}>
                        {data.errands} errands
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Earnings Breakdown */}
            <View style={styles.breakdownCard}>
              <Text style={styles.cardTitle}>Earnings Breakdown</Text>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Base Earnings</Text>
                <Text style={styles.breakdownAmount}>
                  ₦{(currentData.total * 0.8).toLocaleString()}
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Tips & Bonuses</Text>
                <Text style={styles.breakdownAmount}>
                  ₦{(currentData.total * 0.15).toLocaleString()}
                </Text>
              </View>
              <View style={styles.breakdownItem}>
                <Text style={styles.breakdownLabel}>Peak Hour Bonus</Text>
                <Text style={styles.breakdownAmount}>
                  ₦{(currentData.total * 0.05).toLocaleString()}
                </Text>
              </View>
              <View style={[styles.breakdownItem, styles.totalItem]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ₦{currentData.total.toLocaleString()}
                </Text>
              </View>
            </View>
          </>
        )}

        {selectedTab === "performance" && (
          <>
            {/* Performance Metrics */}
            <View style={styles.performanceCard}>
              <Text style={styles.cardTitle}>Performance Metrics</Text>
              <View style={styles.metricItem}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Completion Rate</Text>
                  <Text style={styles.metricValue}>
                    {performanceData.completionRate}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      { width: `${performanceData.completionRate}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Customer Rating</Text>
                  <Text style={styles.metricValue}>
                    ⭐ {performanceData.customerRating}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      {
                        width: `${(performanceData.customerRating / 5) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>On-Time Delivery</Text>
                  <Text style={styles.metricValue}>
                    {performanceData.onTimeDelivery}%
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progress,
                      { width: `${performanceData.onTimeDelivery}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricInfo}>
                  <Text style={styles.metricLabel}>Avg Response Time</Text>
                  <Text style={styles.metricValue}>
                    {performanceData.responseTime} min
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progress, { width: "85%" }]} />
                </View>
              </View>
            </View>

            {/* Achievements */}
            <View style={styles.achievementsCard}>
              <Text style={styles.cardTitle}>Achievements</Text>
              {achievements.map((achievement, index) => (
                <View
                  key={index}
                  style={[
                    styles.achievementItem,
                    !achievement.earned && styles.lockedAchievement,
                  ]}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <View style={styles.achievementInfo}>
                    <Text
                      style={[
                        styles.achievementTitle,
                        !achievement.earned && styles.lockedText,
                      ]}
                    >
                      {achievement.title}
                    </Text>
                    <Text
                      style={[
                        styles.achievementDescription,
                        !achievement.earned && styles.lockedText,
                      ]}
                    >
                      {achievement.description}
                    </Text>
                  </View>
                  {achievement.earned && (
                    <Text style={styles.earnedBadge}>✓</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Performance Tips */}
            <View style={styles.tipsCard}>
              <Text style={styles.cardTitle}>Performance Tips</Text>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>💡</Text>
                <Text style={styles.tipText}>
                  Accept errands during peak hours (11AM-2PM, 6PM-9PM) for bonus
                  earnings
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>📱</Text>
                <Text style={styles.tipText}>
                  Respond to errand requests within 2 minutes to improve your
                  response time
                </Text>
              </View>
              <View style={styles.tipItem}>
                <Text style={styles.tipIcon}>⭐</Text>
                <Text style={styles.tipText}>
                  Maintain communication with customers to boost your rating
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "white",
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: "white",
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#4CAF50",
    fontWeight: "bold",
  },
  periodSelector: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    minWidth: 70,
    alignItems: "center",
  },
  activePeriodButton: {
    backgroundColor: "#4CAF50",
  },
  periodButtonText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  activePeriodButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  overviewCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  overviewGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  overviewItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 15,
  },
  overviewAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  overviewLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  chartCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
  },
  chartBar: {
    alignItems: "center",
    flex: 1,
  },
  barContainer: {
    height: 100,
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  bar: {
    width: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    minHeight: 10,
  },
  barAmount: {
    fontSize: 8,
    color: "#666",
    marginTop: 2,
  },
  barLabel: {
    fontSize: 12,
    color: "#333",
    fontWeight: "bold",
  },
  barErrands: {
    fontSize: 8,
    color: "#999",
  },
  breakdownCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  breakdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  breakdownLabel: {
    fontSize: 14,
    color: "#666",
  },
  breakdownAmount: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  totalItem: {
    borderBottomWidth: 0,
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: "#4CAF50",
  },
  totalLabel: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  performanceCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  metricItem: {
    marginBottom: 20,
  },
  metricInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  metricValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  achievementsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  lockedAchievement: {
    opacity: 0.5,
  },
  achievementIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  achievementDescription: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  lockedText: {
    color: "#999",
  },
  earnedBadge: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "bold",
  },
  tipsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 30,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    flex: 1,
    lineHeight: 20,
  },
});

export default EarningsAnalyticsScreen;
