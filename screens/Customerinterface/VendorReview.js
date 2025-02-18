// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Pressable,
//   TouchableOpacity,
//   TextInput,
//   ActivityIndicator,
//   ScrollView,
//   Button,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { Rating } from "react-native-elements";
// import { useNavigation, useRoute } from "@react-navigation/native";
// import LottieView from "lottie-react-native";
// import { useMutation } from "react-query";
// import { AirbnbRating } from "react-native-ratings";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useDispatch, useSelector } from "react-redux";
// import { All_serviceReview_data_Fun } from "../../Redux/UserSide/ServiceSlice";
// import CustomStarRating from "../../components/shared/CustomStarRating";

// const VendorReview = () => {
//   const [comment, setComment] = useState("");
//   const dispatch = useDispatch();

//   const [rating, setRating] = useState(0);
//   const { user_data } = useSelector((state) => state?.AuthSlice);
//   const navigation = useNavigation();

//   const { item } = useRoute().params;
//   console.log({
//     cry: rating,
//   });

//   let vendorId = item;

//   const Review_Mutation = useMutation(
//     (data_info) => {
//       let url = `${API_BASEURL}services/vendors/review-rate-service`;

//       let data = {
//         vendorId: item, //"66dd2bad6414556b14a212fa",
//         rating: userRating, // "4",
//         comment: comment, //"Cry me  a rive",
//       };
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           //   "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.post(url, data, config);
//     },
//     {
//       onSuccess: (success) => {
//         Toast.show({
//           type: "success",
//           text1: " successfully ",
//         });
//         // dispatch(AdminMarket_data_Fun());

//         dispatch(All_serviceReview_data_Fun(vendorId));

//         navigation.goBack();
//         // dispatch(Get_My_Clan_Forum_Fun());

//         // setTurnmodal(false);
//       },

//       onError: (error) => {
//         console.log({
//           error: error?.response?.data,
//         });
//         Toast.show({
//           type: "error",
//           text1: `${error?.response?.data?.message} `,
//           //   text2: ` ${error?.response?.data?.errorMsg} `,
//         });

//         // dispatch(Get_User_Clans_Fun());
//         // dispatch(Get_User_Profle_Fun());
//         // dispatch(Get_all_clan_User_Is_adminIN_Fun());
//       },
//     }
//   );

//   const handleSUbmitreview = () => {
//     let data = {
//       vendorId: item, //"66dd2bad6414556b14a212fa",
//       rating: rating, // "4",
//       comment: comment, //"Cry me  a rive",
//     };

//     console.log(data);
//   };

//   const [userRating, setUserRating] = useState(0); // Store the rating selected by the user

//   console.log({
//     kaka: userRating,
//   });
//   // This function will be passed as a prop to CustomStarRating
//   const handleRatingSelected = (rating) => {
//     setUserRating(rating); // Update the state with the selected rating
//   };

//   const submitReview = () => {
//     console.log("User rated:", userRating);
//     // Submit the review with the userRating value
//   };
//   return (
//     <ScrollView
//       contentContainerStyle={{ flexGrow: 1 }}
//       style={styles.container}
//     >
//       <View
//         style={{
//           flex: 1, // This will now take up the entire available space
//         }}
//       >
//         <Text>{item?.vendor?.FullName}</Text>
//         <View style={styles.input}>
//           <TextInput
//             multiline={true}
//             numberOfLines={4}
//             placeholder="Write description..."
//             value={comment}
//             onChangeText={setComment}
//           />
//         </View>

//         <View style={styles.input}>
//           <Text style={styles.text}>Select Star rating</Text>
//           <CustomStarRating
//             maxStars={5}
//             onRatingSelected={handleRatingSelected}
//           />
//         </View>

//         {Review_Mutation.isLoading ? (
//           <ActivityIndicator size="large" color="green" />
//         ) : (
//           <TouchableOpacity
//             style={{
//               alignItems: "center",
//               padding: 15,
//               backgroundColor: "green",
//               borderRadius: 5,
//             }}
//             onPress={() => Review_Mutation.mutate()}
//           >
//             <Text
//               style={{
//                 color: "white",
//                 fontSize: 20,
//               }}
//             >
//               Submit
//             </Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>

//     // <ScrollView style={styles.container}>
//     //   <View
//     //     style={{
//     //       flex: 1,
//     //       borderWidth: 2,
//     //       borderColor: "red",
//     //       height: "auto",
//     //     }}
//     //   >
//     //     <Text>{item?.vendor?.FullName}</Text>
//     //     <View style={styles.input}>
//     //       <TextInput
//     //         multiline={true}
//     //         numberOfLines={4}
//     //         placeholder="Write description..."
//     //         value={comment}
//     //         onChangeText={setComment}
//     //       />
//     //     </View>

//     //     <View style={styles.input}>
//     //       <Text style={styles.text}>Select Star rating</Text>
//     //       <CustomStarRating
//     //         maxStars={5}
//     //         onRatingSelected={handleRatingSelected}
//     //       />
//     //     </View>

//     //     {Review_Mutation.isLoading ? (
//     //       <ActivityIndicator size="large" color="green" />
//     //     ) : (
//     //       <TouchableOpacity
//     //         style={{
//     //           alignItems: "center",
//     //           padding: 15,
//     //           backgroundColor: "green",
//     //           borderRadius: 5,
//     //         }}
//     //         onPress={() => Review_Mutation.mutate()}
//     //       >
//     //         <Text
//     //           style={{
//     //             color: "white",
//     //             fontSize: 20,
//     //           }}
//     //         >
//     //           Submit
//     //         </Text>
//     //       </TouchableOpacity>
//     //     )}
//     //   </View>
//     // </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     flex: 1,
//     backgroundColor: "white",
//   },
//   buttonContainer: {
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "green",
//     borderRadius: 5,
//     // marginTop: 180,
//   },

//   buttonText: {
//     fontSize: 16,
//     color: "white",
//   },
//   input: {
//     width: "100%",
//     shadowColor: "#F7F9FA",
//     backgroundColor: "#F7f9FA",
//     borderColor: "gray",
//     borderRadius: 5,
//     padding: 20,
//     height: "40%",
//   },
//   rating: {
//     marginTop: 30,
//   },
//   text: {
//     fontSize: 20,
//     fontWeight: "400",
//     paddingBottom: 10,
//     paddingTop: 10,
//   },
// });

// export default VendorReview;

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useMutation } from "react-query";
import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { All_serviceReview_data_Fun } from "../../Redux/UserSide/ServiceSlice";
import CustomStarRating from "../../components/shared/CustomStarRating";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

const VendorReview = () => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const { user_data } = useSelector((state) => state?.AuthSlice);
  const navigation = useNavigation();
  const { item } = useRoute().params;

  const Review_Mutation = useMutation(
    () => {
      const url = `${API_BASEURL}services/vendors/review-rate-service`;
      const data = {
        vendorId: item,
        rating,
        comment,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data, config);
    },
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Review submitted successfully!",
        });
        dispatch(All_serviceReview_data_Fun(item));
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.response?.data?.message || "Error submitting review",
        });
      },
    }
  );

  const handleSubmitReview = () => {
    Review_Mutation.mutate();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text>{item?.vendor?.FullName}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholder="Write description..."
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.text}>Select Star rating</Text>
          <CustomStarRating maxStars={5} onRatingSelected={setRating} />
        </View>

        {Review_Mutation.isLoading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "white",
  },
  innerContainer: {
    flex: 1,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#F7F9FA",
    borderColor: "gray",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  textInput: {
    minHeight: 80, // Set a minimum height
    textAlignVertical: "top", // Ensures the text starts at the top
  },
  ratingContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "400",
    paddingBottom: 10,
  },
  submitButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "green",
    borderRadius: 5,
  },
  submitText: {
    color: "white",
    fontSize: 20,
  },
});

export default VendorReview;
