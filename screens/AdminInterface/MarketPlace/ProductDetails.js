import { useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native"; // Not used directly
// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

const ProductDetails = ({ navigation }) => {
  const { item } = useRoute().params;
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  const { user_data } = useSelector((state) => state?.AuthSlice);

  // console.log({ ds: user_data?.token, ewe: item?._id }); // Commented out

  // --- TanStack Query useMutation for Approving/Declining Product ---
  const Aprove_Mutation = useMutation({
    mutationFn: (data_info) => {
      // 'mutationFn' replaces the function passed directly to useMutation
      let url = `${API_BASEURL}market/product/status/${item?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.put(url, data_info, config);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Status updated successfully",
      });
      // Re-fetch market data via Redux
      dispatch(AdminMarket_data_Fun());
      navigation.goBack();
    },
    onError: (error) => {
      console.log({
        error: error?.response?.data,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });
  // -------------------------------------------------------

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.carouselContainer}>
        {/* Custom Carousel Implementation */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} // To ensure smooth updates
        >
          {item?.images?.map((image, index) => (
            <View key={index} style={[styles.slide, { width: screenWidth }]}>
              <Image
                source={{ uri: image?.url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
        {/* End Custom Carousel Implementation */}

        <View style={styles.pagination}>
          {item?.images?.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeIndex === index ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.productTitle}>{item?.name}</Text>
            <Text style={styles.productCategory}>{item?.category?.name}</Text>
          </View>
          <View>
            <Text style={styles.productPrice}>₦{item?.price}</Text>
          </View>
        </View>
        <Text style={styles.description}>{item?.description}</Text>
      </View>
      <View style={styles.downContainer}>
        <Text style={styles.sellerTitle}>Seller Details</Text>
        <Text style={styles.sellerInfo}>
          <Icon name="user" size={20} color="black" />
          <Text
            style={{
              marginLeft: 10,
            }}
          >
            {item?.seller?.name}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {Aprove_Mutation?.isLoading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <>
            {/* Show Approve button if status is Decline or Pending */}
            {item?.status === "Decline" || item?.status === "Pending" ? (
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => {
                  Aprove_Mutation.mutate({
                    status: "Approve",
                  });
                }}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            ) : (
              // Show Decline button if status is Approve
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => {
                  Aprove_Mutation.mutate({
                    status: "Decline",
                  });
                }}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
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
    fontSize: 18,
    color: "gray",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
  },
  productStock: {
    fontSize: 18,
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
    fontWeight: "700",
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
    paddingTop: 60,
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

  carouselContainer: {
    position: "relative",
    height: 250,
  },
  slide: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
  },
});

export default ProductDetails;
