import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Rating } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { Get_all_admin_Service__Fun } from "../../../Redux/Admin/AdminServiceSlice";

const VendorListDetails = ({ navigation }) => {
  const item = useRoute().params?.item;
  console.log({
    kaka2: item,
  });

  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const makePhoneCall = () => {
    // Safely open URL for phone call
    if (item?.phone_number) {
      Linking.openURL(`tel:${item.phone_number}`);
    } else {
      Toast.show({
        type: "error",
        text1: "Phone number not available.",
      });
    }
  };

  // --- TanStack Query useMutation for Deleting Vendor ---
  const Delete_Mutation = useMutation({
    mutationFn: () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      // Construct the URL with the vendorId as a query parameter
      let url = `${API_BASEURL}services/vendors/estate-admin?vendorId=${item?._id}`;

      return axios.delete(url, config);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Vendor deleted successfully",
      });
      // Dispatch Redux action to refresh the vendor list
      dispatch(Get_all_admin_Service__Fun());
      navigation.goBack();
    },
    onError: (error) => {
      // Safely access the error message
      const errorMessage = error?.response?.data?.message || "Deletion failed";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // -------------------------------------------------------

  return (
    <ScrollView style={{ backgroundColor: "white", paddingBottom: 20 }}>
      <View style={styles.container}>
        <View style={styles.container1}>
          <Image
            source={{ uri: item?.photo?.url }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text style={{ paddingTop: 10, fontWeight: "bold", fontSize: 20 }}>
            {item?.FullName}
          </Text>
          <Text style={{}}>{item?.about_me}</Text>

          <Text>{item?.years_of_experience} years of experience</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            paddingTop: 15,
          }}
        >
          <View>
            <Pressable
              onPress={() => {
                // Pass the necessary item data for the review screen
                navigation.navigate("VendortDetailsReview", {
                  item: item?._id,
                });
              }}
              style={{ alignItems: "center" }}
            >
              <Image
                source={require("../../../assets/sevImg/revIcon.png")}
                style={{ marginBottom: 5 }}
              />
              <Text>Reviews</Text>
            </Pressable>
          </View>

          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              navigation.navigate("VendortDetailsReview", { item: item?._id });
            }}
          >
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              startingValue={item?.avgRating}
              ratingBackgroundColor="white"
              ratingColor="#04973C" // Use theme color for consistency
              readonly
              style={{ paddingBottom: 5 }}
            />

            <Text>Rating</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ padding: 30, height: "50%" }}>
        <View style={styles.downContainer}>
          <Text style={{ fontSize: 20, fontWeight: "600", paddingBottom: 5 }}>
            Contact
          </Text>
          <Text
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 5,
            }}
          >
            <Icon name="phone" size={20} color="#04973C" />
            <Text style={{ marginLeft: 10 }}> {item?.phone_number} </Text>
          </Text>

          <Text style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="map-marker" size={20} color="#04973C" />
            <Text style={{ marginLeft: 10 }}>{item?.address}</Text>
          </Text>
        </View>
        <View
          style={{
            paddingBottom: 20,
            paddingTop: 25,
            borderBottomWidth: 1,
            borderBottomColor: "#F6F6F6",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "600", paddingBottom: 5 }}>
            Working Time
          </Text>
          <Text>{item?.opens}</Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <View
            style={{
              width: "50%",
            }}
          >
            {Delete_Mutation.isLoading ? (
              <ActivityIndicator
                color="red"
                size="large"
                style={{ marginTop: 40, marginBottom: 40 }}
              />
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 12,
                  backgroundColor: "red",
                  borderRadius: 8,
                  justifyContent: "center",
                  marginTop: 40,
                  marginBottom: 40,
                }}
                onPress={() => Delete_Mutation.mutate()}
                disabled={Delete_Mutation.isLoading}
              >
                <Text style={styles.text}>Delete</Text>
              </TouchableOpacity>
            )}
          </View>
          <View
            style={{
              width: "50%",
            }}
          >
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={makePhoneCall}
            >
              <Icon name="phone" size={20} color="white" style={styles.icon} />
              <Text style={styles.text}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3FFF3",
    // Note: '52%' height might be problematic on different screens,
    // consider using flex or dynamic calculation if possible
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  container1: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DEF6E3",
  },
  downContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12, // Increased padding
    backgroundColor: "#04973C",
    borderRadius: 8, // Increased border radius
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});
export default VendorListDetails;
