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
// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";
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
  const { item } = useRoute().params; // 'item' is the vendorId here

  // --- TanStack Query useMutation for Review Submission ---
  const Review_Mutation = useMutation({
    mutationFn: () => {
      const url = `${API_BASEURL}services/vendors/review-rate-service`;
      const data = {
        vendorId: item, // Assuming 'item' is the vendorId passed via route params
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
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Review submitted successfully!",
      });
      // Assuming All_serviceReview_data_Fun is a Redux thunk/action
      // that fetches and updates the reviews list for this vendor (item)
      dispatch(All_serviceReview_data_Fun(item));
      navigation.goBack();
    },
    onError: (error) => {
      // Safely access the error message from the Axios error response
      const errorMessage =
        error?.response?.data?.message || "Error submitting review";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // -------------------------------------------------------

  const handleSubmitReview = () => {
    // Basic validation check before mutating
    if (rating === 0) {
      Toast.show({
        type: "error",
        text1: "Please select a star rating.",
      });
      return;
    }
    Review_Mutation.mutate();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        {/* Note: The 'item' from route params seems to be the ID, 
            but the original code tries to access 'item?.vendor?.FullName'.
            If 'item' is just the ID, this line should be adjusted or removed 
            if the vendor name is not passed in the route params. 
            Keeping the original structure for conversion purposes, but noting potential issue.
        */}
        <Text style={styles.vendorNamePlaceholder}>Vendor ID: {item}</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            multiline={true}
            numberOfLines={4}
            placeholder="Write your comment here..."
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <View style={styles.ratingContainer}>
          <Text style={styles.text}>Select Star rating</Text>
          {/* CustomStarRating should call setRating with the selected value */}
          <CustomStarRating maxStars={5} onRatingSelected={setRating} />
        </View>

        {Review_Mutation.isLoading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
            disabled={Review_Mutation.isLoading} // Disable button while loading
          >
            <Text style={styles.submitText}>Submit Review</Text>
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
  vendorNamePlaceholder: {
    fontSize: 16,
    marginBottom: 15,
    fontWeight: "500",
    color: "#333",
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
    minHeight: 80,
    textAlignVertical: "top",
  },
  ratingContainer: {
    marginBottom: 20,
  },
  text: {
    fontSize: 16, // Reduced font size for better fit
    fontWeight: "600",
    paddingBottom: 10,
    color: "#000",
  },
  submitButton: {
    alignItems: "center",
    padding: 15,
    backgroundColor: "#04973C", // Used a clear green color
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default VendorReview;
