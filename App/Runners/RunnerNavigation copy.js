import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RunnerNavigation() {
  return <RunnerDashboard />;
}

const RunnerDashboard = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [availableErrands, setAvailableErrands] = useState([]);
  const [activeErrand, setActiveErrand] = useState(null);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0 });
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with actual API calls
  const mockErrands = [
    {
      id: "1",
      title: "Grocery Shopping",
      description: "Buy groceries from Shoprite, Victoria Island",
      payment: 2500,
      distance: "2.3 km",
      estimatedTime: "45 min",
      priority: "high",
      customer: "Sarah Johnson",
    },
    {
      id: "2",
      title: "Document Pickup",
      description: "Pick up documents from Bank, Ikoyi",
      payment: 1800,
      distance: "1.5 km",
      estimatedTime: "30 min",
      priority: "medium",
      customer: "Michael Adebayo",
    },
    {
      id: "3",
      title: "Food Delivery",
      description: "Deliver lunch from KFC to office building",
      payment: 1200,
      distance: "3.1 km",
      estimatedTime: "25 min",
      priority: "urgent",
      customer: "Company Ltd",
    },
  ];

  useEffect(() => {
    loadErrands();
    loadEarnings();
  }, []);

  const loadErrands = () => {
    // Simulate API call
    setTimeout(() => {
      setAvailableErrands(mockErrands);
    }, 500);
  };

  const loadEarnings = () => {
    // Simulate API call
    setEarnings({
      today: 8500,
      week: 45200,
      total: 234500,
    });
  };

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    if (!isOnline) {
      Alert.alert(
        "Status Changed",
        "You are now online and can receive errand requests"
      );
    } else {
      Alert.alert("Status Changed", "You are now offline");
    }
  };

  const acceptErrand = (errand) => {
    Alert.alert(
      "Accept Errand",
      `Accept "${errand.title}" for ₦${errand.payment}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Accept",
          onPress: () => {
            setActiveErrand(errand);
            setAvailableErrands((prev) =>
              prev.filter((e) => e.id !== errand.id)
            );
            Alert.alert("Errand Accepted", "Navigate to pickup location");
          },
        },
      ]
    );
  };

  const completeErrand = () => {
    if (activeErrand) {
      Alert.alert("Complete Errand", "Mark this errand as completed?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Complete",
          onPress: () => {
            setEarnings((prev) => ({
              ...prev,
              today: prev.today + activeErrand.payment,
            }));
            setActiveErrand(null);
            Alert.alert(
              "Errand Completed",
              `₦${activeErrand.payment} added to your earnings`
            );
          },
        },
      ]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadErrands();
    loadEarnings();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#FF4444";
      case "high":
        return "#FF8800";
      case "medium":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={isOnline ? "#4CAF50" : "#666"} />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, Runner!</Text>
          <TouchableOpacity
            style={[
              styles.statusButton,
              { backgroundColor: isOnline ? "#4CAF50" : "#666" },
            ]}
            onPress={toggleOnlineStatus}
          >
            <Text style={styles.statusText}>
              {isOnline ? "ONLINE" : "OFFLINE"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.cardTitle}>Earnings Summary</Text>
          <View style={styles.earningsRow}>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>
                ₦{earnings.today.toLocaleString()}
              </Text>
              <Text style={styles.earningLabel}>Today</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>
                ₦{earnings.week.toLocaleString()}
              </Text>
              <Text style={styles.earningLabel}>This Week</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningAmount}>
                ₦{earnings.total.toLocaleString()}
              </Text>
              <Text style={styles.earningLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Active Errand */}
        {activeErrand && (
          <View style={styles.activeErrandCard}>
            <Text style={styles.cardTitle}>Active Errand</Text>
            <View style={styles.errandItem}>
              <View style={styles.errandHeader}>
                <Text style={styles.errandTitle}>{activeErrand.title}</Text>
                <Text style={styles.errandPayment}>
                  ₦{activeErrand.payment}
                </Text>
              </View>
              <Text style={styles.errandDescription}>
                {activeErrand.description}
              </Text>
              <View style={styles.errandDetails}>
                <Text style={styles.errandDetail}>
                  👤 {activeErrand.customer}
                </Text>
                <Text style={styles.errandDetail}>
                  📍 {activeErrand.distance}
                </Text>
                <Text style={styles.errandDetail}>
                  ⏱️ {activeErrand.estimatedTime}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={completeErrand}
              >
                <Text style={styles.completeButtonText}>Mark as Completed</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Available Errands */}
        <View style={styles.availableErrandsCard}>
          <Text style={styles.cardTitle}>
            Available Errands ({availableErrands.length})
          </Text>
          {!isOnline && (
            <View style={styles.offlineMessage}>
              <Text style={styles.offlineText}>
                Go online to see available errands
              </Text>
            </View>
          )}
          {isOnline && availableErrands.length === 0 && (
            <View style={styles.noErrandsMessage}>
              <Text style={styles.noErrandsText}>
                No errands available right now
              </Text>
              <Text style={styles.noErrandsSubtext}>Pull down to refresh</Text>
            </View>
          )}
          {isOnline &&
            availableErrands.map((errand) => (
              <View key={errand.id} style={styles.errandItem}>
                <View style={styles.errandHeader}>
                  <Text style={styles.errandTitle}>{errand.title}</Text>
                  <View style={styles.paymentContainer}>
                    <View
                      style={[
                        styles.priorityDot,
                        { backgroundColor: getPriorityColor(errand.priority) },
                      ]}
                    />
                    <Text style={styles.errandPayment}>₦{errand.payment}</Text>
                  </View>
                </View>
                <Text style={styles.errandDescription}>
                  {errand.description}
                </Text>
                <View style={styles.errandDetails}>
                  <Text style={styles.errandDetail}>👤 {errand.customer}</Text>
                  <Text style={styles.errandDetail}>📍 {errand.distance}</Text>
                  <Text style={styles.errandDetail}>
                    ⏱️ {errand.estimatedTime}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptErrand(errand)}
                >
                  <Text style={styles.acceptButtonText}>Accept Errand</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>📊</Text>
              <Text style={styles.quickActionText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>💬</Text>
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionIcon}>⚙️</Text>
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statusButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  earningsCard: {
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
  earningsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  earningItem: {
    alignItems: "center",
  },
  earningAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  earningLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  activeErrandCard: {
    backgroundColor: "#E8F5E8",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#4CAF50",
  },
  availableErrandsCard: {
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
  errandItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 15,
  },
  errandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  errandTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  errandPayment: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  errandDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  errandDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  errandDetail: {
    fontSize: 12,
    color: "#888",
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  completeButton: {
    backgroundColor: "#2196F3",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  offlineMessage: {
    alignItems: "center",
    paddingVertical: 30,
  },
  offlineText: {
    fontSize: 16,
    color: "#666",
  },
  noErrandsMessage: {
    alignItems: "center",
    paddingVertical: 30,
  },
  noErrandsText: {
    fontSize: 16,
    color: "#666",
  },
  noErrandsSubtext: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  quickActionsCard: {
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
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    alignItems: "center",
    flex: 1,
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: "#666",
  },
});
