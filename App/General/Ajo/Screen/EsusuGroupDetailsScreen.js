import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useFetchData, useMutateData } from "../../../../hooks/Request";

export default function EsusuGroupDetailsScreen({ route }) {
  const { id: groupId } = route.params;

  console.log({
    tyui: groupId,
  });

  // FETCH GROUP DETAILS
  const { data, isLoading, isError } = useFetchData(
    `api/v3/esusu/${groupId}`,
    `group-${groupId}`
  );

  // CONTRIBUTION MUTATION
  const contributeMutation = useMutateData(
    `api/v3/esusu/${groupId}/contribute`,
    "POST",
    `group-${groupId}`
  );

  // ADD MEMBER MUTATION
  const addMemberMutation = useMutateData(
    "api/v3/esusu/addmember",
    "POST",
    `group-${groupId}`
  );

  const handleContribution = (num) => {
    contributeMutation.mutate(
      { cycleNumber: num }, // DEFAULT cycle 1 (you can change later)
      {
        onSuccess: () => alert("Contribution successful!"),
        onError: (err) =>
          alert(err?.response?.data?.message || "Contribution failed"),
      }
    );
  };

  const [memberEmail, setMemberEmail] = useState("");
  const [memberPosition, setMemberPosition] = useState("");

  const handleAddMember = () => {
    if (!memberEmail || !memberPosition) {
      alert("Please fill email and position");
      return;
    }

    addMemberMutation.mutate(
      {
        groupID: groupId,
        email: memberEmail,
        position: Number(memberPosition),
      },
      {
        onSuccess: () => {
          alert("Member added successfully!");
          setMemberEmail("");
          setMemberPosition("");
        },
        onError: (err) => {
          alert(err?.response?.data?.message || "Unable to add member");
        },
      }
    );
  };

  // LOADING UI
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ERROR UI
  if (isError || !data?.data) {
    return (
      <View style={{ padding: 20 }}>
        <Text>Unable to load group details.</Text>
      </View>
    );
  }

  const group = data.data;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      {/* GROUP NAME */}
      <Text style={{ fontSize: 26, fontWeight: "800", marginBottom: 10 }}>
        {group.name}
      </Text>

      {/* DESCRIPTION */}
      <Text style={{ fontSize: 16, marginBottom: 20, color: "#555" }}>
        {group.description}
      </Text>

      {/* BASIC INFO */}
      <View
        style={{
          marginBottom: 20,
          backgroundColor: "#f8f9fb",
          padding: 15,
          borderRadius: 12,
        }}
      >
        <Text style={{ fontSize: 15 }}>
          Amount Per Cycle: <Text>₦{group.amountPerCycle}</Text>
        </Text>
        <Text style={{ fontSize: 15 }}>Frequency: {group.frequency}</Text>
        <Text style={{ fontSize: 15 }}>
          Start Date: {new Date(group.startDate).toDateString()}
        </Text>
        <Text style={{ fontSize: 15 }}>Max Members: {group.maxMembers}</Text>
        <Text style={{ fontSize: 15 }}>
          Current Cycle: {group.currentCycle}
        </Text>
        <Text style={{ fontSize: 15, marginTop: 5 }}>
          Status: {group.status}
        </Text>
      </View>

      {/* CONTRIBUTION BUTTON */}

      {/* ADD MEMBER SECTION */}
      <View
        style={{
          marginBottom: 35,
          backgroundColor: "#f8f9fb",
          padding: 15,
          borderRadius: 12,
          borderColor: "#e5e7eb",
          borderWidth: 1,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 15 }}>
          Add Member
        </Text>

        <TextInput
          placeholder="Email Address"
          value={memberEmail}
          onChangeText={setMemberEmail}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#d1d5db",
            marginBottom: 12,
          }}
        />

        <TextInput
          placeholder="Position (1, 2, 3...)"
          keyboardType="numeric"
          value={memberPosition}
          onChangeText={setMemberPosition}
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#d1d5db",
            marginBottom: 12,
          }}
        />

        <TouchableOpacity
          onPress={handleAddMember}
          disabled={addMemberMutation.isLoading}
          style={{
            backgroundColor: "#1a73e8",
            paddingVertical: 12,
            borderRadius: 8,
            alignItems: "center",
          }}
        >
          {addMemberMutation.isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
              Add Member
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* MEMBERS */}
      <Text style={{ fontSize: 22, fontWeight: "800", marginBottom: 12 }}>
        Members ({group.members.length})
      </Text>

      {group.members.map((m, idx) => (
        <View
          key={idx}
          style={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{m.user.name}</Text>
          <Text style={{ fontSize: 14 }}>{m.user.email}</Text>
          <Text style={{ fontSize: 13, marginTop: 5, color: "#444" }}>
            Joined: {new Date(m.joinedAt).toLocaleString()}
          </Text>
        </View>
      ))}

      {/* CYCLES */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "800",
          marginTop: 20,
          marginBottom: 12,
        }}
      >
        Cycles ({group.cycles.length})
      </Text>

      {group.cycles.map((cycle, idx) => (
        <View
          key={idx}
          style={{
            padding: 15,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 12,
            marginBottom: 20,
          }}
        >
          {console.log({
            zxf: cycle.cycleNumber,
          })}
          <TouchableOpacity
            onPress={() => handleContribution(cycle.cycleNumber)}
            style={{
              backgroundColor: "#0066ff",
              paddingVertical: 14,
              borderRadius: 10,
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            {contributeMutation.isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700" }}>
                Contribute Now
              </Text>
            )}
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>
            Cycle {cycle.cycleNumber}
          </Text>

          <Text style={{ fontSize: 15, marginTop: 8 }}>
            Receiver:{" "}
            {cycle.receiver
              ? `${cycle.receiver.name} (${cycle.receiver.email})`
              : "Not Assigned"}
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              marginTop: 12,
              marginBottom: 6,
            }}
          >
            Contributors:
          </Text>

          {cycle.contributors.map((c, i) => (
            <View key={i} style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 14 }}>
                • {c.user.name} ({c.user.email})
              </Text>
              <Text style={{ fontSize: 13 }}>
                Status: {c.hasPaid ? "Paid" : "Not Paid"}
              </Text>
              <Text style={{ fontSize: 13 }}>Amount Paid: ₦{c.amountPaid}</Text>
              <Text style={{ fontSize: 13 }}>
                Paid At:{" "}
                {c.paidAt ? new Date(c.paidAt).toLocaleString() : "N/A"}
              </Text>
            </View>
          ))}

          <Text style={{ fontSize: 15, marginTop: 8 }}>
            Total Amount Paid: ₦{cycle.totalAmountPaid}
          </Text>
          <Text style={{ fontSize: 15 }}>Status: {cycle.status}</Text>
        </View>
      ))}

      {/* CREATED INFO */}
      <View style={{ marginTop: 20, marginBottom: 20 }}>
        <Text style={{ fontSize: 14 }}>
          Created At: {new Date(group.createdAt).toLocaleString()}
        </Text>
        <Text style={{ fontSize: 14 }}>
          Updated At: {new Date(group.updatedAt).toLocaleString()}
        </Text>
      </View>
    </ScrollView>
  );
}
