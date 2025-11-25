// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   ScrollView,
// } from "react-native";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import { useMutation } from "react-query";
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useDispatch, useSelector } from "react-redux";
// import { All_serviceReview_data_Fun } from "../../Redux/UserSide/ServiceSlice";
// import CustomStarRating from "../../components/shared/CustomStarRating";

// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// const VendorReview = () => {
//   const [comment, setComment] = useState("");
//   const dispatch = useDispatch();
//   const [rating, setRating] = useState(0);
//   const { user_data } = useSelector((state) => state?.AuthSlice);
//   const navigation = useNavigation();
//   const { item } = useRoute().params;

//   const Review_Mutation = useMutation(
//     () => {
//       const url = `${API_BASEURL}services/vendors/review-rate-service`;
//       const data = {
//         vendorId: item,
//         rating,
//         comment,
//       };
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.post(url, data, config);
//     },
//     {
//       onSuccess: () => {
//         Toast.show({
//           type: "success",
//           text1: "Review submitted successfully!",
//         });
//         dispatch(All_serviceReview_data_Fun(item));
//         navigation.goBack();
//       },
//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: error?.response?.data?.message || "Error submitting review",
//         });
//       },
//     }
//   );

//   const handleSubmitReview = () => {
//     Review_Mutation.mutate();
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View style={styles.innerContainer}>
//         <Text>{item?.vendor?.FullName}</Text>
//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.textInput}
//             multiline={true}
//             numberOfLines={4}
//             placeholder="Write description..."
//             value={comment}
//             onChangeText={setComment}
//           />
//         </View>

//         <View style={styles.ratingContainer}>
//           <Text style={styles.text}>Select Star rating</Text>
//           <CustomStarRating maxStars={5} onRatingSelected={setRating} />
//         </View>

//         {Review_Mutation.isLoading ? (
//           <ActivityIndicator size="large" color="green" />
//         ) : (
//           <TouchableOpacity
//             style={styles.submitButton}
//             onPress={handleSubmitReview}
//           >
//             <Text style={styles.submitText}>Submit</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flexGrow: 1,
//     padding: 20,
//     backgroundColor: "white",
//   },
//   innerContainer: {
//     flex: 1,
//   },
//   inputContainer: {
//     width: "100%",
//     backgroundColor: "#F7F9FA",
//     borderColor: "gray",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//   },
//   textInput: {
//     minHeight: 80, // Set a minimum height
//     textAlignVertical: "top", // Ensures the text starts at the top
//   },
//   ratingContainer: {
//     marginBottom: 20,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "400",
//     paddingBottom: 10,
//   },
//   submitButton: {
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "green",
//     borderRadius: 5,
//   },
//   submitText: {
//     color: "white",
//     fontSize: 20,
//   },
// });

// export default VendorReview;

import { View, Text } from "react-native";
import React from "react";

export default function VendorReview() {
  return (
    <View>
      <Text>VendorReview</Text>
    </View>
  );
}
