// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { useFetchData, useMutateData } from "../../../hooks/Request";
// // import { useMutateData } from "../../../hooks/Request";

// const DueDetails = () => {
//   const navigation = useNavigation();
//   const route = useRoute();
//   const { data } = route.params; // Get the due ID from the navigation params

//   const { user_data } = useSelector((state) => state.AuthSlice);

//   const [dueDetails, setDueDetails] = useState(null);

//   const {
//     mutate: deleteDue,
//     isLoading: isDeleting,
//     error: deleteError,
//   } = useMutateData(`wallet/clan-due/${data?._id}`, "DELETE", "clan-due");

//   //   const {
//   //     mutate: createDue,
//   //     isLoading: ispending,
//   //     error,
//   //   } = useMutateData("wallet/clan-due", "POST", "clan-due");

//   // Fetch due details (replace with your API call)
//   //   useEffect(() => {
//   //     const fetchDueDetails = async () => {
//   //       try {
//   //         const response = await fetch(
//   //           `http://localhost:8070/api/v1/wallet/clan-due/${dueId}`
//   //         );
//   //         const data = await response.json();
//   //         setDueDetails(data.due);
//   //       } catch (error) {
//   //         console.error("Error fetching due details:", error);
//   //       }
//   //     };

//   //     fetchDueDetails();
//   //   }, [dueId]);

//   // Handle delete due
//   const handleDeleteDue = () => {
//     Alert.alert("Delete Due", "Are you sure you want to delete this due?", [
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//       {
//         text: "Delete",
//         onPress: () => {
//           deleteDue(
//             {},
//             {
//               onSuccess: () => {
//                 navigation.goBack(); // Navigate back after deletion
//               },
//               onError: (error) => {
//                 console.error("Error deleting due:", error.message);
//               },
//             }
//           );
//         },
//       },
//     ]);
//   };

//   // Handle update due
//   const handleUpdateDue = () => {

//     let url = `wallet/pay-due/${data?._id}`;
//     console.log({
//       url: url,
//     });
//   };

//   // let url = `wallet/pay-due/${data?._id}`;
//   // // navigation.navigate("UpdateDue", { dueId });

//   // };

//   //   if (!dueDetails) {
//   //     return (
//   //       <View style={styles.container}>
//   //         <Text>Loading...</Text>
//   //       </View>
//   //     );
//   //   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Due Details</Text>

//       <View style={styles.detailSection}>
//         <Text style={styles.label}>Service Name:</Text>
//         <Text style={styles.value}>{data?.serviceName}</Text>
//       </View>

//       <View style={styles.detailSection}>
//         <Text style={styles.label}>Service Details:</Text>
//         <Text style={styles.value}>{data?.serviceDetails}</Text>
//       </View>

//       <View style={styles.detailSection}>
//         <Text style={styles.label}>Amount:</Text>
//         <Text style={styles.value}>{data?.amount}</Text>
//       </View>

//       <View style={styles.detailSection}>
//         <Text style={styles.label}>Due Date:</Text>
//         <Text style={styles.value}>
//           {new Date(data?.dueDate).toLocaleDateString()}
//         </Text>
//       </View>

//       <Text style={styles.subTitle}>Members to Pay:</Text>
//       {data.membersToPay.map((member) => (
//         <View key={member._id} style={styles.memberItem}>
//           {console.log({
//             member: member?._id,
//             user: user_data?.user?.id,
//           })}
//           <Text style={styles.memberName}>{member.user.name}</Text>
//           <Text style={styles.memberStatus}>{member.status}</Text>
//         </View>
//       ))}

//       <TouchableOpacity style={styles.updateButton} onPress={handleUpdateDue}>
//         <Text style={styles.buttonText}> Make Payment </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: "#F5F5F5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   detailSection: {
//     marginBottom: 15,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   value: {
//     fontSize: 16,
//     color: "#666",
//     marginTop: 5,
//   },
//   subTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   memberItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#CCCCCC",
//     backgroundColor: "#FFF",
//     marginBottom: 5,
//   },
//   memberName: {
//     fontSize: 16,
//   },
//   memberStatus: {
//     fontSize: 16,
//     color: "#007BFF",
//   },
//   updateButton: {
//     backgroundColor: "#28A745",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   deleteButton: {
//     backgroundColor: "#DC3545",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// export default DueDetails;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { useSelector } from "react-redux";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DueDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params; // Get the due data from the navigation params
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const navigatation = useNavigation();

  const [isMakingPayment, setIsMakingPayment] = useState(false); // State to track payment loading

  // Handle the "Make Payment" button click
  const handleMakePayment = async () => {
    setIsMakingPayment(true); // Show loading state

    let url = `${apiUrl}wallet/pay-due/${data?._id}`;

    console.log({
      ooo: url,
    });

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user_data?.token}`,
        },
      });
      // Make a GET request to the payment endpoint
      // const response = await axios.get(
      //   `http://localhost:8070/api/v1/wallet/pay-due/${data?._id}`
      // );
      // // Handle successful payment
      console.log("Payment Successful:", response.data);
      Alert.alert("Success", "Payment was successful!");
      navigation.goBack(); // Navigate back to the previous screen
    } catch (error) {
      // Handle payment error
      console.error({
        error: error?.response?.data?.message,
      });
      Alert.alert("Error", `${error?.response?.data?.message}`);
    } finally {
      setIsMakingPayment(false); // Hide loading state
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Due Details</Text>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Service Name:</Text>
        <Text style={styles.value}>{data?.serviceName}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Service Details:</Text>
        <Text style={styles.value}>{data?.serviceDetails}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{data?.amount}</Text>
      </View>

      <View style={styles.detailSection}>
        <Text style={styles.label}>Due Date:</Text>
        <Text style={styles.value}>
          {new Date(data?.dueDate).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.subTitle}>Members to Pay:</Text>
      {data.membersToPay.map((member) => (
        <View key={member._id} style={styles.memberItem}>
          <Text style={styles.memberName}>{member.user.name}</Text>
          <Text style={styles.memberStatus}>{member.status}</Text>
        </View>
      ))}

      {/* Make Payment Button */}
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleMakePayment}
        disabled={isMakingPayment} // Disable button while loading
      >
        {isMakingPayment ? (
          <ActivityIndicator color="#FFF" /> // Show loading indicator
        ) : (
          <Text style={styles.buttonText}>Make Payment</Text>
        )}
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  detailSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    backgroundColor: "#FFF",
    marginBottom: 5,
  },
  memberName: {
    fontSize: 16,
  },
  memberStatus: {
    fontSize: 16,
    color: "#007BFF",
  },
  updateButton: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DueDetails;
