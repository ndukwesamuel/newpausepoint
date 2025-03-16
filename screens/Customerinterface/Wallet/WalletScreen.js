// // Enhanced WalletScreen.js
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   RefreshControl,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useFetchData } from "../../../hooks/Request";
// import { FlatList } from "react-native";
// // import { useFetchData } from "../../../hooks/Request";

// const WalletScreen = ({ navigation }) => {
//   //   const { data: weeklyincomeData } = useFetchData(
//   //     "/BusinessAdvisorySBU/weekly-income",
//   //     "weekly-income"
//   //   );
//   const { data, isLoading, error } = useFetchData("wallet", "wallet");
//   const {
//     data: allmydues,
//     isLoading: ispending,
//     error: isError,
//   } = useFetchData("wallet/pay-due", "pay-due");

//   console.log({
//     cccc: allmydues?.dues,
//   });

//   const handleCreateUser = () => {
//     createUser({ name: "John Doe", email: "john@example.com" });
//   };

//   if (isLoading) return <Text>Loading...</Text>;
//   if (error) {
//     console.error("Fetch Error:", error.message);
//     return <Text>Error: {error.message}</Text>;
//   }

//   console.log({
//     fg: data,
//   });
//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     // Set the refreshing state to true
//     setRefreshing(true);
//     // dispatch(Get_My_Clan_Forum_Fun());

//     // Wait for 2 seconds
//     setRefreshing(false);
//   };
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Wallet</Text>
//       <View style={styles.balanceContainer}>
//         <Icon name="account-balance-wallet" size={30} color="#4CAF50" />
//         <Text style={styles.balance}>
//           {data?.balance} {data?.currency}
//         </Text>
//       </View>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={() => navigation.navigate("FundWallet")}
//       >
//         <Icon name="add" size={20} color="#FFF" />
//         <Text style={styles.buttonText}>Fund Wallet</Text>
//       </TouchableOpacity>
//       <Text style={styles.subTitle}>Invoices due</Text>

//       <FlatList
//         data={allmydues?.dues}
//         renderItem={({ item }) => <Item item={item} navigation={navigation} />}
//         keyExtractor={(item) => item._id}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//       />
//       {/* <TouchableOpacity
//         style={styles.invoiceItem}
//         onPress={() =>
//           navigation.navigate("InvoiceDetail", { type: "Electricity" })
//         }
//       >
//         <Icon name="flash-on" size={20} color="#FFA000" />
//         <Text style={styles.invoiceText}>Electricity</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.invoiceItem}
//         onPress={() =>
//           navigation.navigate("InvoiceDetail", { type: "Security Levy" })
//         }
//       >
//         <Icon name="security" size={20} color="#2196F3" />
//         <Text style={styles.invoiceText}>Security Levy</Text>
//       </TouchableOpacity> */}
//     </View>
//   );
// };

// const Item = ({ item, navigation }) => (
//   <TouchableOpacity
//     onPress={() => navigation.navigate("duedetails", { data: item })}
//     style={styles.item}
//   >
//     <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//       <Icon name="security" size={20} color="#2196F3" />
//       <View>
//         <Text
//           style={{
//             fontSize: 18,
//           }}
//         >
//           {item?.serviceName}
//         </Text>
//         <Text style={styles.description}>{item?.serviceDetails}</Text>
//         <Text style={styles.description}>Amount: {item?.amount} NGN</Text>
//         <DueDateChecker dueDate={item?.dueDate} />
//       </View>
//     </View>
//   </TouchableOpacity>
// );

// const DueDateChecker = ({ dueDate }) => {
//   const dueDateObj = new Date(dueDate);
//   const currentDate = new Date();
//   const timeDifference = dueDateObj - currentDate;

//   let statusMessage;
//   if (timeDifference > 0) {
//     const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
//     statusMessage = `Due in ${daysDifference} days.`;
//   } else if (timeDifference === 0) {
//     statusMessage = "Due today!";
//   } else {
//     statusMessage = "Due date has passed.";
//   }

//   return <Text>{statusMessage}</Text>;
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F5F5F5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   balanceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   balance: {
//     fontSize: 18,
//     marginLeft: 10,
//   },
//   button: {
//     flexDirection: "row",
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 20,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     marginLeft: 10,
//   },
//   subTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   invoiceItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFF",
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//     elevation: 2,
//   },
//   invoiceText: {
//     marginLeft: 10,
//   },
//   item: {
//     backgroundColor: "#FFF",
//     padding: 20,
//     marginVertical: 8,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   description: { fontSize: 14, color: "#666", marginTop: 5 },
// });

// export default WalletScreen;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFetchData } from "../../../hooks/Request";

const WalletScreen = ({ navigation }) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData("wallet", "wallet");
  const {
    data: allmydues,
    isLoading: ispending,
    error: isError,
    refetch: refetchDues, // Add refetch function for dues
  } = useFetchData("wallet/pay-due", "pay-due");

  const [refreshing, setRefreshing] = useState(false);

  // Handle refresh action
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Refetch both wallet and dues data
      await refetchWallet();
      await refetchDues();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading || ispending) return <Text>Loading...</Text>;
  if (error || isError) {
    console.error("Fetch Error:", error?.message || isError?.message);
    return <Text>Error: {error?.message || isError?.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <View style={styles.balanceContainer}>
        <Icon name="account-balance-wallet" size={30} color="#4CAF50" />
        <Text style={styles.balance}>
          {data?.balance} {data?.currency}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("FundWallet")}
      >
        <Icon name="add" size={20} color="#FFF" />
        <Text style={styles.buttonText}>Fund Wallet</Text>
      </TouchableOpacity>
      <Text style={styles.subTitle}>Invoices due</Text>

      <FlatList
        data={allmydues?.dues}
        renderItem={({ item }) => <Item item={item} navigation={navigation} />}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

const Item = ({ item, navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("duedetails", { data: item })}
    style={styles.item}
  >
    {console.log({
      fdf: item?.membersToPay[0],
    })}
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <Icon name="security" size={20} color="#2196F3" />
      <View>
        <Text style={{ fontSize: 18 }}>{item?.serviceName}</Text>
        <Text style={styles.description}>{item?.serviceDetails}</Text>
        <Text style={styles.description}>Amount: {item?.amount} </Text>
        <Text style={styles.description}>
          My Status: {item?.membersToPay[0].status} NGN
        </Text>
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  balance: {
    fontSize: 18,
    marginLeft: 10,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
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
