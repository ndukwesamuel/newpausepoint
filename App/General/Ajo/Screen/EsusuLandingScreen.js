import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchData } from "../../../../hooks/Request";

const EsusuLandingScreen = ({ navigation }) => {
  const { data, isLoading, error } = useFetchData(
    "api/v3/esusu/all",
    "allEsusuGroups"
  );

  const groups = data?.data || [];

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

  const renderGroup = ({ item }) => (
    <TouchableOpacity
      style={{
        padding: 16,
        backgroundColor: "white",
        borderRadius: 16,
        marginBottom: 14,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 3,
      }}
      onPress={() =>
        navigation.navigate("EsusuGroupDetailsScreen", { id: item._id })
      }
    >
      {/* Group Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F2937" }}>
            {item.name}
          </Text>
          <Text
            style={{ fontSize: 14, color: "#6B7280", marginTop: 4 }}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        </View>

        {/* Status Badge */}
        <View
          style={{
            backgroundColor: getStatusColor(item.status) + "20",
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: getStatusColor(item.status),
              textTransform: "capitalize",
            }}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Members</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            {item.members.length}/{item.maxMembers}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Amount/Cycle</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            ₦{item.amountPerCycle.toLocaleString()}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Current Cycle</Text>
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1F2937" }}>
            {item.currentCycle}/{item.cycles.length}
          </Text>
        </View>
      </View>

      {/* Next Payout / Completion */}
      {item.cycles[item.currentCycle - 1]?.status === "pending" && (
        <View
          style={{
            marginTop: 12,
            backgroundColor: "#F3F4F6",
            padding: 10,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="cash-outline" size={16} color="#6B7280" />
          <Text style={{ fontSize: 13, color: "#6B7280", marginLeft: 6 }}>
            Next payout: Cycle {item.currentCycle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7", padding: 16 }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 24, fontWeight: "700", color: "#1F2937" }}>
          My Esusu Groups
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("EsusuCreateGroupScreen")}
          style={{
            backgroundColor: "#8B5CF6",
            paddingVertical: 10,
            paddingHorizontal: 14,
            borderRadius: 12,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
              fontWeight: "600",
              marginLeft: 6,
            }}
          >
            Create
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {isLoading && <ActivityIndicator size="large" color="#8B5CF6" />}

      {/* Error */}
      {error && (
        <Text style={{ color: "red", fontSize: 16, marginBottom: 20 }}>
          {error.message}
        </Text>
      )}

      {/* Empty State */}
      {!isLoading && groups.length === 0 && (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 60,
          }}
        >
          <Ionicons name="people-outline" size={80} color="#D1D5DB" />
          <Text style={{ fontSize: 18, fontWeight: "600", marginTop: 16 }}>
            No Esusu Groups Yet
          </Text>
          <Text style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>
            Join or create a savings group to get started
          </Text>
        </View>
      )}

      {/* Groups List */}
      <FlatList
        data={groups}
        renderItem={renderGroup}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default EsusuLandingScreen;
