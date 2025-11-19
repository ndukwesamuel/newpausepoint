import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
// import { useFetchData_v2 } from "./path-to-your-api-hook";
import { Ionicons } from "@expo/vector-icons";
import { useFetchData_v2 } from "../../../../hooks/Requestv2";
// useFetchData_v2
const EsusuLandingScreen = ({ navigation }) => {
  const {
    data: groupsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData_v2("api/v1/esusu/ajo/my-groups", "esusuGroups");

  const formatCurrency = (amount) => {
    return `₦${amount?.toLocaleString() || 0}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "completed":
        return "#6B7280";
      default:
        return "#6B7280";
    }
  };

  const getFrequencyLabel = (frequency) => {
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: "#6B7280" }}>
          Loading your groups...
        </Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
          padding: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text
          style={{
            marginTop: 16,
            fontSize: 18,
            fontWeight: "600",
            color: "#1F2937",
          }}
        >
          Error Loading Groups
        </Text>
        <Text
          style={{
            marginTop: 8,
            fontSize: 14,
            color: "#6B7280",
            textAlign: "center",
          }}
        >
          {error?.message || "Something went wrong"}
        </Text>
        <TouchableOpacity
          onPress={() => refetch()}
          style={{
            marginTop: 20,
            backgroundColor: "#8B5CF6",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "600" }}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const groups = groupsData?.data || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#8B5CF6",
          //   paddingTop: 60,
          paddingBottom: 50,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "#FFFFFF",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          Esusu Groups
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 16,
            color: "#E9D5FF",
          }}
        >
          Manage your savings circles
        </Text>
      </View>

      {/* Stats Card */}
      <View
        style={{
          marginHorizontal: 20,
          marginTop: -30,
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#1F2937" }}
            >
              {groups.length}
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              Total Groups
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#10B981" }}
            >
              {groups.filter((g) => g.status === "active").length}
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              Active
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#F59E0B" }}
            >
              {groups.filter((g) => g.status === "pending").length}
            </Text>
            <Text style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}>
              Pending
            </Text>
          </View>
        </View>
      </View>

      {/* Groups List */}
      <ScrollView
        style={{ flex: 1, marginTop: 20 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#8B5CF6"]}
          />
        }
      >
        {groups.length === 0 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 60,
            }}
          >
            <Ionicons name="people-outline" size={80} color="#D1D5DB" />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#6B7280",
                marginTop: 16,
              }}
            >
              No Groups Yet
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#9CA3AF",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              Join or create a savings group to get started
            </Text>
          </View>
        ) : (
          groups.map((group) => (
            <TouchableOpacity
              key={group._id}
              onPress={() =>
                navigation.navigate("EsusuGroupDetailsScreen", {
                  groupId: group._id,
                })
              }
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {/* Group Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      color: "#1F2937",
                    }}
                  >
                    {group.name}
                  </Text>
                  <Text
                    style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}
                    numberOfLines={2}
                  >
                    {group.description}
                  </Text>
                </View>
                <View
                  style={{
                    backgroundColor: getStatusColor(group.status) + "20",
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 12,
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: getStatusColor(group.status),
                      textTransform: "capitalize",
                    }}
                  >
                    {group.status}
                  </Text>
                </View>
              </View>

              {/* Group Stats */}
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 16,
                  paddingTop: 16,
                  borderTopWidth: 1,
                  borderTopColor: "#F3F4F6",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Contribution
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1F2937",
                      marginTop: 4,
                    }}
                  >
                    {formatCurrency(group.contributionAmount)}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                  >
                    {getFrequencyLabel(group.frequency)}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                    Members
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <Ionicons name="people" size={16} color="#8B5CF6" />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: "#1F2937",
                        marginLeft: 4,
                      }}
                    >
                      {group.members.length}/{group.maxMembers}
                    </Text>
                  </View>
                  {group.isFull && (
                    <Text
                      style={{ fontSize: 12, color: "#10B981", marginTop: 2 }}
                    >
                      Full
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Cycle</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: "#1F2937",
                      marginTop: 4,
                    }}
                  >
                    {group.currentCycle}/{group.totalCycles}
                  </Text>
                  <Text
                    style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}
                  >
                    {((group.currentCycle / group.totalCycles) * 100).toFixed(
                      0
                    )}
                    %
                  </Text>
                </View>
              </View>

              {/* Next Payout */}
              {group.nextPayoutDate && (
                <View
                  style={{
                    marginTop: 12,
                    backgroundColor: "#F3F4F6",
                    padding: 12,
                    borderRadius: 8,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                  <Text
                    style={{ fontSize: 13, color: "#6B7280", marginLeft: 8 }}
                  >
                    Next payout: {formatDate(group.nextPayoutDate)}
                  </Text>
                </View>
              )}

              {/* Your Position */}
              <View
                style={{
                  marginTop: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#8B5CF6",
                      marginRight: 8,
                    }}
                  />
                  <Text style={{ fontSize: 13, color: "#6B7280" }}>
                    Your position: #{group.members[0]?.position || "N/A"}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Create Group Button */}
      <View
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("EsusuCreateGroupScreen")}
          style={{
            backgroundColor: "#8B5CF6",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            borderRadius: 12,
            shadowColor: "#8B5CF6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: "700",
              marginLeft: 8,
            }}
          >
            Create New Group
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EsusuLandingScreen;
