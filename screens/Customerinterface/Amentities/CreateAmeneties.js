import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";

// *** CHANGE: Import from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
// Assuming AdminMarket_data_Fun is the function that fetches the market data
import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

// Define the shape of the data being passed to the mutation for clarity
// In a real project, you might define this in a separate types file
/**
 * @typedef {('Approve' | 'Pending')} ProductStatus
 * @typedef {{ status: ProductStatus }} ProductStatusUpdateData
 * @typedef {import('axios').AxiosResponse} MutationSuccessResponse
 * @typedef {import('axios').AxiosError} MutationError
 */

const ProductDetails = ({ navigation }) => {
  const { item } = useRoute().params;
  const dispatch = useDispatch();

  const { user_data } = useSelector((state) => state?.AuthSlice);

  // You can remove this console log in production code
  console.log({
    ds: user_data?.token,
    ewe: item?._id,
  });

  /**
   * Mutation function to update the product status.
   * @param {ProductStatusUpdateData} data_info - The status update object (e.g., { status: 'Approve' }).
   * @returns {Promise<MutationSuccessResponse>} The Axios response.
   */
  const updateProductStatus = async (data_info) => {
    let url = `${API_BASEURL}market/product/status/${item?._id}`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    return axios.put(url, data_info, config);
  };

  // Renamed to be more descriptive (e.g., useUpdateProductStatus)
  const productStatusMutation = useMutation({
    mutationFn: updateProductStatus, // The function that performs the API call

    // Success handler
    onSuccess: (success) => {
      // The `success` parameter is the result of the `mutationFn` (AxiosResponse)
      Toast.show({
        type: "success",
        text1: "Status updated successfully", // Better message
      });

      // Dispatch action to refresh the market data list
      dispatch(AdminMarket_data_Fun());

      // Navigate back after successful update
      navigation.goBack();
    },

    // Error handler
    onError: (error) => {
      // The `error` parameter is the result of the `mutationFn` rejection (AxiosError)
      /** @type {MutationError} */
      const axiosError = error;

      console.log({
        error: axiosError?.response?.data,
      });

      // Display specific error message from the API response
      const errorMessage =
        axiosError?.response?.data?.message || "An unknown error occurred.";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });

  // Destructure for cleaner usage in the JSX
  const { isLoading, mutate } = productStatusMutation;

  return (
    <>
      <View>
        <Image
          source={{
            uri: item.images[0]?.url,
          }}
          style={{
            width: "100%",
            height: 250,
          }}
        />
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <View>
              <Text style={styles.productTitle}>{item?.name}</Text>
              <Text style={styles.productCategory}>{item?.category?.name}</Text>
            </View>
            <View>
              <Text style={styles.productPrice}>₦{item?.price}</Text>
              <Text style={styles.productStock}>{item?.quantity} Quantity</Text>
            </View>
          </View>
          <Text style={styles.description}>{item?.description}</Text>
        </View>
        <View style={styles.downContainer}>
          <Text style={styles.sellerTitle}>Seller Details</Text>
          <Text style={styles.sellerInfo}>
            <Icon name="user" size={20} color="black" />
            {/* The space inside Text is a little brittle, better to use padding/margin */}
            <Text> Jide Kosoko </Text>
          </Text>
          <Text style={styles.sellerInfo}>
            <Icon name="home" size={20} color="black" />
            <Text> House 24, Tinubu estate</Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {isLoading ? ( // Use the destructured `isLoading`
            <ActivityIndicator size="large" color="green" /> // Changed color for visibility on white background
          ) : (
            <>
              {item?.status === "Pending" ? (
                <TouchableOpacity
                  style={styles.approveButton}
                  onPress={() => {
                    mutate({
                      // Use the destructured `mutate`
                      status: "Approve",
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Approve</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {
                    mutate({
                      // Use the destructured `mutate`
                      status: "Pending",
                    });
                  }}
                >
                  <Text style={styles.buttonText}>Decline</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </View>
    </>
  );
};

// ... Styles remain the same
const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
  contentContainer: {
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 14,
    color: "gray",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productStock: {
    fontSize: 14,
    color: "gray",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "gray",
  },
  downContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
    paddingHorizontal: 20,
  },
  sellerTitle: {
    fontSize: 20,
    fontWeight: "400",
    paddingBottom: 5,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  approveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  declineButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProductDetails;
