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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const RunnerDashboard = ({}) => {
  const navigation = useNavigation();
  const [isOnline, setIsOnline] = useState(true);
  const [availableErrands, setAvailableErrands] = useState([]);
  const [activeErrand, setActiveErrand] = useState(null);
  const [earnings, setEarnings] = useState({ today: 0, week: 0, total: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: errandsData,
    isLoading: isErrandsLoading,
    error: errandsError,
    refetch: refetchErrands,
  } = useFetchData(`api/v1/runner/errands`, "geterrandinfo");

  const {
    mutate: assignedErrand,
    isLoading: assignedErrandispending,
    error: assignedErranderror,
  } = useMutateData("api/v1/runner/errands", "PATCH", "geterrandinfo");

  const loadEarnings = () => {
    // Simulate API call
    setEarnings({
      today: 8500,
      week: 45200,
      total: 234500,
    });
  };

  const toggleOnlineStatus = () => {};

  // const acceptErrand = (errand) => {
  //   let data = {
  //     status: "assigned",
  //     errandId: errand?._id, //"6852b976b4b9a6dd9ec41d13",
  //   };

  //   //  "assignedTo": null,
  //   //  "status": "pending",

  //   console.log({
  //     errand,
  //     mine: errand?._id,
  //     mine2: errand?.assignedTo,
  //     mine3: errand?.status,
  //   });

  //   Alert.alert(
  //     "Accept Errand",
  //     `Accept "${errand.title}" for ₦${errand.totalAmount}?`,
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       {
  //         text: "Accept",
  //         onPress: () => {
  //           setActiveErrand(errand);
  //           setAvailableErrands((prev) =>
  //             prev.filter((e) => e._id !== errand._id)
  //           );
  //           Alert.alert("Errand Accepted", "Navigate to pickup location");
  //         },
  //       },
  //     ]
  //   );
  // };

  const acceptErrand = (errand) => {
    // Check if errand is already assigned or not in pending status
    if (errand?.assignedTo !== null && errand?.status !== "assigned") {
      Alert.alert(
        "Errand Unavailable",
        // "This errand has already been assigned to another runner or is no longer available.",
        [{ text: "OK", style: "default" }]
      );
      return;
    }

    let data = {
      status: "en_route",
      errandId: errand?._id,
    };

    assignedErrand(
      data,
      {
        onSuccess: (response) => {
          console.log({
            jaja: response,
          });

          navigation.navigate("TaskScreen");
        },
      },
      {
        onError: (error) => {
          console.error("Mutation Error:", error.message);
        },
      }
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
              today: prev.today + activeErrand.totalAmount,
            }));
            setActiveErrand(null);
            Alert.alert(
              "Errand Completed",
              `₦${activeErrand.totalAmount} added to your earnings`
            );
          },
        },
      ]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    refetchErrands().finally(() => setRefreshing(false));
  };

  const getPriorityColor = (status) => {
    switch (status) {
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

  const formatAddress = (address) => {
    if (!address) return "Address not specified";
    return address.length > 30 ? `${address.substring(0, 30)}...` : address;
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

        {/* Available Errands */}
        <View style={styles.availableErrandsCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.cardTitle}>
              Available Errands ({errandsData?.data?.length || 0})
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "green",
                padding: 5,
                borderRadius: 5,
              }}
              onPress={() => navigation.navigate("TaskScreen")}
            >
              <Text style={{ color: "white" }}>View All</Text>
            </TouchableOpacity>
          </View>

          {!isOnline && (
            <View style={styles.offlineMessage}>
              <Text style={styles.offlineText}>
                Go online to see available errands
              </Text>
            </View>
          )}
          {isOnline && errandsData?.data.length === 0 && (
            <View style={styles.noErrandsMessage}>
              <Text style={styles.noErrandsText}>
                No errands available right now
              </Text>
              <Text style={styles.noErrandsSubtext}>Pull down to refresh</Text>
            </View>
          )}
          {isOnline &&
            errandsData?.data.map((errand) => (
              <View key={errand._id} style={styles.errandItem}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("ErrandDetailsScreen", {
                      errand,
                    })
                  }
                >
                  <View style={styles.errandHeader}>
                    <Text style={styles.errandTitle}>{errand.title}</Text>
                    <View style={styles.paymentContainer}>
                      <View
                        style={[
                          styles.priorityDot,
                          { backgroundColor: getPriorityColor(errand.status) },
                        ]}
                      />
                      <Text style={styles.errandPayment}>
                        ₦{errand.totalAmount?.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.errandDescription}>
                    {errand.description}
                  </Text>
                  <View style={styles.errandDetails}>
                    <Text style={styles.errandDetail}>
                      👤 {errand.user?.name || "Customer"}
                    </Text>
                    <Text style={styles.errandDetail}>
                      📍 {formatAddress(errand.deliveryAddress)}
                    </Text>
                    <Text style={styles.errandDetail}>
                      🏷️ {errand.clan?.name || "No clan"}
                    </Text>
                  </View>
                  <View style={styles.errandDetails}>
                    <Text style={styles.errandDetail}>
                      🛒 {errand.pickupLocations?.length || 0} stores
                    </Text>
                    <Text style={styles.errandDetail}>
                      ⏱️ {new Date(errand.createdAt).toLocaleTimeString()}
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptErrand(errand)}
                >
                  <Text style={styles.acceptButtonText}>Accept Errand</Text>
                </TouchableOpacity>
              </View>
            ))}
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
    marginBottom: 8,
    flexWrap: "wrap",
  },
  errandDetail: {
    fontSize: 12,
    color: "#888",
    marginRight: 10,
  },
  acceptButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
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
    marginTop: 10,
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

export default RunnerDashboard;
