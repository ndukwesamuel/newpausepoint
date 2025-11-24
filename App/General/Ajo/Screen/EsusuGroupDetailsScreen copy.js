import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchData_v2, useMutateData } from "../../../../hooks/Requestv2";

const EsusuGroupDetailsScreen = ({ navigation, route }) => {
  const { groupId } = route.params;
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState("");
  const [memberPosition, setMemberPosition] = useState("");

  const {
    data: groupData,
    isLoading,
    isError,
    error,
    refetch,
  } = useFetchData_v2(`api/v1/esusu/ajo/${groupId}`, `esusuGroup-${groupId}`);

  const { mutate: addMember, isLoading: isAddingMember } = useMutateData(
    "api/v1/esusu/ajo/addMember",
    "POST",
    `esusuGroup-${groupId}`,
    {
      onSuccess: (data) => {
        Alert.alert("Success", "Member added successfully!");
        setShowAddMemberModal(false);
        setMemberEmail("");
        setMemberPosition("");
        refetch();
      },
      onError: (error) => {
        console.log("Add Member Error:", error.data);

        let errorMessage = "Failed to add member";
        if (error.data?.errors && Array.isArray(error.data.errors)) {
          errorMessage = error.data.errors
            .map((err) => `• ${err.message}`)
            .join("\n");
        } else if (error.data?.message) {
          errorMessage = error.data.message;
        }

        Alert.alert("Error", errorMessage);
      },
    }
  );

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

  const handleAddMember = () => {
    if (!memberEmail.trim()) {
      Alert.alert("Validation Error", "Please enter member's email");
      return;
    }

    if (!memberPosition || parseInt(memberPosition) <= 0) {
      Alert.alert("Validation Error", "Please enter a valid position");
      return;
    }

    const payload = {
      groupId: groupId,
      email: memberEmail.trim(),
      position: parseInt(memberPosition),
    };

    addMember(payload);
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
          Loading group details...
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
          Error Loading Group
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

  const group = groupData?.data;

  if (!group) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
        }}
      >
        <Text style={{ fontSize: 16, color: "#6B7280" }}>Group not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#8B5CF6",
          paddingTop: 60,
          paddingBottom: 20,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginRight: 12,
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: "#FFFFFF",
              }}
            >
              {group.name}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: getStatusColor(group.status) + "40",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#FFFFFF",
                textTransform: "capitalize",
              }}
            >
              {group.status}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 14, color: "#E9D5FF" }}>
          {group.description}
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            colors={["#8B5CF6"]}
          />
        }
      >
        {/* Group Wallet Card */}
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
          <Text
            style={{
              fontSize: 14,
              color: "#6B7280",
              marginBottom: 8,
              textAlign: "center",
            }}
          >
            Group Wallet Balance
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#8B5CF6",
              textAlign: "center",
              marginBottom: 16,
            }}
          >
            {formatCurrency(group.groupWallet.balance)}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: "#F3F4F6",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                Total Collected
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#10B981",
                  marginTop: 4,
                }}
              >
                {formatCurrency(group.groupWallet.totalCollected)}
              </Text>
            </View>
            <View style={{ width: 1, backgroundColor: "#E5E7EB" }} />
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                Total Paid Out
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#EF4444",
                  marginTop: 4,
                }}
              >
                {formatCurrency(group.groupWallet.totalPaidOut)}
              </Text>
            </View>
          </View>
        </View>

        {/* Contribution Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 16,
            }}
          >
            Contribution Details
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Amount</Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginTop: 4,
                }}
              >
                {formatCurrency(group.contributionAmount)}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                {getFrequencyLabel(group.frequency)}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                Expected Per Cycle
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginTop: 4,
                }}
              >
                {formatCurrency(group.totalExpectedPerCycle)}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>
                Total from all members
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#F9FAFB",
              padding: 12,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="calendar-outline" size={16} color="#6B7280" />
                <Text style={{ fontSize: 13, color: "#6B7280", marginLeft: 8 }}>
                  Next Contribution
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#1F2937" }}
              >
                {formatDate(group.nextContributionDate)}
              </Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: "#FEF3C7",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="wallet-outline" size={16} color="#D97706" />
                <Text style={{ fontSize: 13, color: "#D97706", marginLeft: 8 }}>
                  Next Payout
                </Text>
              </View>
              <Text
                style={{ fontSize: 14, fontWeight: "600", color: "#92400E" }}
              >
                {formatDate(group.nextPayoutDate)}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 16,
            }}
          >
            Group Progress
          </Text>

          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>
                Current Cycle
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#8B5CF6",
                  marginTop: 4,
                }}
              >
                {group.currentCycle}/{group.totalCycles}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Members</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <Ionicons name="people" size={20} color="#8B5CF6" />
                <Text
                  style={{
                    fontSize: 28,
                    fontWeight: "700",
                    color: "#1F2937",
                    marginLeft: 8,
                  }}
                >
                  {group.members.length}/{group.maxMembers}
                </Text>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, color: "#9CA3AF" }}>Duration</Text>
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: "#1F2937",
                  marginTop: 4,
                }}
              >
                {group.duration}
              </Text>
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                {getFrequencyLabel(group.frequency)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: "#6B7280" }}>
                Cycle Progress
              </Text>
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: "#8B5CF6" }}
              >
                {((group.currentCycle / group.totalCycles) * 100).toFixed(0)}%
              </Text>
            </View>
            <View
              style={{
                height: 8,
                backgroundColor: "#E5E7EB",
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${(group.currentCycle / group.totalCycles) * 100}%`,
                  backgroundColor: "#8B5CF6",
                  borderRadius: 4,
                }}
              />
            </View>
          </View>
        </View>

        {/* Members List */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1F2937",
              }}
            >
              Members ({group.members.length})
            </Text>
          </View>

          {group.members.map((member, index) => (
            <View
              key={member.user.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 12,
                borderBottomWidth: index < group.members.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
            >
              {/* Position Badge */}
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: "#8B5CF6",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#FFFFFF" }}
                >
                  #{member.position}
                </Text>
              </View>

              {/* Member Info */}
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 16, fontWeight: "600", color: "#1F2937" }}
                >
                  {member.user.name}
                </Text>
                <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                  {member.user.email}
                </Text>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                  Joined: {formatDate(member.joinedAt)}
                </Text>
              </View>

              {/* Stats */}
              <View style={{ alignItems: "flex-end" }}>
                <View
                  style={{
                    backgroundColor:
                      member.status === "active" ? "#D1FAE5" : "#FEE2E2",
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: member.status === "active" ? "#065F46" : "#991B1B",
                      textTransform: "capitalize",
                    }}
                  >
                    {member.status}
                  </Text>
                </View>
                <Text style={{ fontSize: 12, color: "#6B7280" }}>
                  Contributed: {formatCurrency(member.totalContributed)}
                </Text>
                {member.missedContributions > 0 && (
                  <Text
                    style={{ fontSize: 11, color: "#EF4444", marginTop: 2 }}
                  >
                    Missed: {member.missedContributions}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Group Info */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 16,
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#1F2937",
              marginBottom: 16,
            }}
          >
            Group Information
          </Text>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
              Created By
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937" }}>
              {group.creator.name}
            </Text>
            <Text style={{ fontSize: 13, color: "#9CA3AF" }}>
              {group.creator.email}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
              Start Date
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1F2937" }}>
              {formatDate(group.startDate)}
            </Text>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 4 }}>
              Group Rules
            </Text>
            <Text style={{ fontSize: 15, color: "#1F2937", lineHeight: 22 }}>
              {group.rules}
            </Text>
          </View>

          <View>
            <Text style={{ fontSize: 13, color: "#6B7280", marginBottom: 8 }}>
              Settings
            </Text>
            <View style={{ gap: 8 }}>
              {group.settings.autoStart && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text
                    style={{ fontSize: 14, color: "#1F2937", marginLeft: 8 }}
                  >
                    Auto-start when full
                  </Text>
                </View>
              )}
              {group.settings.allowEarlyPayout && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text
                    style={{ fontSize: 14, color: "#1F2937", marginLeft: 8 }}
                  >
                    Early payout allowed
                  </Text>
                </View>
              )}
              {group.settings.requireApprovalToJoin && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text
                    style={{ fontSize: 14, color: "#1F2937", marginLeft: 8 }}
                  >
                    Requires approval to join
                  </Text>
                </View>
              )}
              {group.settings.shufflePositions && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text
                    style={{ fontSize: 14, color: "#1F2937", marginLeft: 8 }}
                  >
                    Shuffled positions
                  </Text>
                </View>
              )}
              {group.settings.penaltyForMissedContribution > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="alert-circle" size={16} color="#F59E0B" />
                  <Text
                    style={{ fontSize: 14, color: "#1F2937", marginLeft: 8 }}
                  >
                    Penalty:{" "}
                    {formatCurrency(
                      group.settings.penaltyForMissedContribution
                    )}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            // console.log({
            //   gtyy: group._id,
            // })

            navigation.navigate("CycleScreen", { groupId: group })
          }
          // onPress={() =>
          //   Alert.alert("Contribute", "Contribution feature coming soon!")
          // }
          style={{
            flex: 1,
            backgroundColor: "#8B5CF6",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 14,
            borderRadius: 12,
          }}
        >
          <Ionicons name="wallet" size={20} color="#FFFFFF" />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: "700",
              marginLeft: 8,
            }}
          >
            Contribute
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowAddMemberModal(true)}
          style={{
            backgroundColor: "#F3F4F6",
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowAddMemberModal(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "flex-end",
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
              style={{
                backgroundColor: "#FFFFFF",
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                paddingHorizontal: 20,
                paddingTop: 20,
                paddingBottom: 40,
                maxHeight: "80%",
              }}
            >
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "700",
                    color: "#1F2937",
                  }}
                >
                  Add Member
                </Text>
                <TouchableOpacity
                  onPress={() => setShowAddMemberModal(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F3F4F6",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Email Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Member Email <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <TextInput
                    value={memberEmail}
                    onChangeText={setMemberEmail}
                    placeholder="e.g., john@example.com"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={{
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      marginTop: 6,
                    }}
                  >
                    Enter the email address of the person you want to add
                  </Text>
                </View>

                {/* Position Input */}
                <View style={{ marginBottom: 20 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#374151",
                      marginBottom: 8,
                    }}
                  >
                    Position in Queue{" "}
                    <Text style={{ color: "#EF4444" }}>*</Text>
                  </Text>
                  <TextInput
                    value={memberPosition}
                    onChangeText={setMemberPosition}
                    placeholder="e.g., 3"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      borderColor: "#E5E7EB",
                      borderRadius: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      fontSize: 16,
                      color: "#1F2937",
                      backgroundColor: "#FFFFFF",
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#6B7280",
                      marginTop: 6,
                    }}
                  >
                    Position determines when this member will receive payout (1
                    = first)
                  </Text>
                </View>

                {/* Info Card */}
                <View
                  style={{
                    backgroundColor: "#EFF6FF",
                    padding: 16,
                    borderRadius: 12,
                    marginBottom: 20,
                    flexDirection: "row",
                  }}
                >
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#3B82F6"
                    style={{ marginRight: 12, marginTop: 2 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#1E40AF",
                        lineHeight: 20,
                      }}
                    >
                      The member will be notified via email and can join the
                      group. Available positions: {group.members.length + 1} -{" "}
                      {group.maxMembers}
                    </Text>
                  </View>
                </View>

                {/* Add Button */}
                <TouchableOpacity
                  onPress={handleAddMember}
                  disabled={isAddingMember}
                  style={{
                    backgroundColor: isAddingMember ? "#D1D5DB" : "#8B5CF6",
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
                  {isAddingMember ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="person-add" size={20} color="#FFFFFF" />
                      <Text
                        style={{
                          color: "#FFFFFF",
                          fontSize: 16,
                          fontWeight: "700",
                          marginLeft: 8,
                        }}
                      >
                        Add Member
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default EsusuGroupDetailsScreen;
