import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Admin_Get_All_Clan_Memeber_Fun } from "../../../Redux/UserSide/ClanSlice";
import { useMutateData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const CreateDueScreen = () => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDetails, setServiceDetails] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignAll, setAssignAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]); // State to store members with selection status
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { admin_get_all_clan_memeber_data } = useSelector(
    (state) => state?.ClanSlice
  );

  // Fetch members on component mount
  useEffect(() => {
    dispatch(Admin_Get_All_Clan_Memeber_Fun());
  }, []);

  const {
    mutate: createDue,
    isLoading: ispending,
    error,
  } = useMutateData("wallet/clan-due", "POST", "clan-due");

  // Update members state when data is fetched
  useEffect(() => {
    if (admin_get_all_clan_memeber_data?.data) {
      const membersWithSelection = admin_get_all_clan_memeber_data.data.map(
        (member) => ({
          ...member,
          selected: false, // Initialize selection status
        })
      );
      setMembers(membersWithSelection);
    }
  }, [admin_get_all_clan_memeber_data]);

  // Filter members based on search query
  const filteredMembers = members.filter((member) =>
    member?.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle member selection
  const handleMemberSelection = (id) => {
    setMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.user._id === id
          ? { ...member, selected: !member.selected }
          : member
      )
    );
  };

  // Handle "Assign All" functionality
  const handleAssignAll = () => {
    setAssignAll(!assignAll);
    setMembers((prevMembers) =>
      prevMembers.map((member) => ({ ...member, selected: !assignAll }))
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    const selectedMembers = assignAll
      ? members.map((member) => member.user._id)
      : members
          .filter((member) => member.selected)
          .map((member) => member.user._id);

    const due = {
      serviceName,
      serviceDetails,
      amount: parseFloat(amount),
      dueDate,
      members: selectedMembers,
    };

    createDue(
      due,
      {
        onSuccess: (response) => {
          console.log({
            jaja: response,
          });

          navigation.goBack();
        },
      },
      {
        onError: (error) => {
          console.error("Mutation Error:", error.message);
        },
      }
    );
  };

  // Render each member item
  const renderMemberItem = ({ item }) => (
    <TouchableOpacity
      style={styles.memberItem}
      onPress={() => handleMemberSelection(item.user._id)}
    >
      <View style={styles.checkbox}>
        {item.selected && <Text style={styles.checkboxIcon}>✓</Text>}
      </View>
      <Text style={styles.memberName}>{item?.user?.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Service Name</Text>
      <TextInput
        style={styles.input}
        value={serviceName}
        onChangeText={setServiceName}
        placeholder="Enter service name"
      />

      <Text style={styles.label}>Service Details</Text>
      <TextInput
        style={styles.input}
        value={serviceDetails}
        onChangeText={setServiceDetails}
        placeholder="Enter service details"
        multiline
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        placeholder="Enter amount"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Due Date</Text>
      <TextInput
        style={styles.input}
        value={dueDate}
        onChangeText={setDueDate}
        placeholder="Enter due date (YYYY-MM-DD)"
      />

      <Text style={styles.label}>Assign to Members</Text>
      <TouchableOpacity
        style={styles.assignAllButton}
        onPress={handleAssignAll}
      >
        <Text style={styles.assignAllButtonText}>
          {assignAll ? "Unassign All" : "Assign All"}
        </Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search members..."
      />

      {/* Member List */}
      <FlatList
        data={filteredMembers}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.user._id}
        initialNumToRender={20} // Optimize performance for large lists
        maxToRenderPerBatch={20}
        windowSize={10}
        style={styles.memberList}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {ispending ? "Loading" : "Create Due"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#FFF",
  },
  assignAllButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  assignAllButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  memberList: {
    maxHeight: 300, // Limit height for better UX
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    backgroundColor: "#FFF",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#007BFF",
    borderRadius: 3,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxIcon: {
    color: "#007BFF",
    fontSize: 14,
  },
  memberName: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateDueScreen;
