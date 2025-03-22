import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFetchData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";

const WalletScreen = ({ navigation }) => {
  const { data, isLoading, error } = useFetchData(
    "wallet/clan-wallet",
    "clan-wallet"
  );
  const {
    data: clandue,
    isLoading: clandueIspending,
    error: clandueerror,
  } = useFetchData("wallet/clan-due", "clan-due");

  if (isLoading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  console.log({
    ooo: clandue,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <View style={styles.balanceContainer}>
        <Icon name="account-balance-wallet" size={30} color="#4CAF50" />
        <Text style={styles.balance}>
          {data?.clan?.balance} {data?.clan?.currency}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("createdue")}
      >
        <Icon name="add" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Create Due</Text>
      </TouchableOpacity>

      <Text style={styles.subTitle}>Invoices due</Text>

      <FlatList
        data={clandue?.dues}
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const Item = ({ item, navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("duedetails", { data: item })}
    style={styles.item}
  >
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Icon name="security" size={20} color="#2196F3" />
      <View>
        <Text
          style={{
            fontSize: 18,
          }}
        >
          {item?.serviceName}
        </Text>
        <Text style={styles.description}>{item?.serviceDetails}</Text>
        <DueDateChecker dueDate={item?.dueDate} />
      </View>
    </View>
  </TouchableOpacity>
);

const DueDateChecker = ({ dueDate }) => {
  const dueDateObj = new Date(dueDate);
  const currentDate = new Date();
  const timeDifference = dueDateObj - currentDate;

  let statusMessage;
  if (timeDifference > 0) {
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    statusMessage = `Due in ${daysDifference} days.`;
  } else if (timeDifference === 0) {
    statusMessage = "Due today!";
  } else {
    statusMessage = "Due date has passed.";
  }

  return <Text>{statusMessage}</Text>;
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5F5F5" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  balance: { fontSize: 18, marginLeft: 10 },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: { color: "#FFF", fontSize: 16, marginLeft: 10 },
  subTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  item: {
    backgroundColor: "#FFF",
    padding: 20,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 2,
  },
  description: { fontSize: 14, color: "#666", marginTop: 5 },
});

export default WalletScreen;
