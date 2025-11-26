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
  // Added ActivityIndicator as it's common for mutations
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
import { All_service__data_Fun } from "../../Redux/UserSide/ServiceSlice";
import { useDispatch, useSelector } from "react-redux";

const VendorService = ({ navigation }) => {
  const item = useRoute().params?.item;
  console.log({
    ememe: item,
  });

  const dispatch = useDispatch();
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  // --- TanStack Query useMutation for Liking/Disliking Vendor Service ---
  const Like_Mutation = useMutation({
    mutationFn: () => {
      let url = `${API_BASEURL}services/vendors/like-dislike/${item?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      // This is a GET request used as a toggle endpoint
      return axios.get(url, config);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Like/Dislike successful", // Adjusted message for clarity
      });
      // Dispatch action to refresh the list of services/data
      dispatch(All_service__data_Fun());
    },
    onError: (error) => {
      console.log({
        jjjL: error?.response,
      });
      const errorMessage = error?.response?.data?.message || "Action failed";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // -------------------------------------------------------------------

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

  // Determine if the current user has liked the service (for heart icon color)
  const isLiked = item?.servicelikes?.includes(user_data?.user?._id);

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
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
                // Assuming 'item' passed to 'review' screen is the vendor ID
                navigation.navigate("review", { item: item?._id });
              }}
              style={{ alignItems: "center" }}
            >
              <Image
                source={require("../../assets/sevImg/revIcon.png")}
                style={{ marginBottom: 5 }}
              />
              <Text>Reviews</Text>
            </Pressable>
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => Like_Mutation.mutate()}
            disabled={Like_Mutation.isLoading}
          >
            {Like_Mutation.isLoading ? (
              <ActivityIndicator
                size="small"
                color="#04973C"
                style={{ paddingBottom: 5 }}
              />
            ) : (
              <Icon
                name="heart"
                size={20}
                // Change color based on like status
                color={isLiked ? "red" : "#04973C"}
                style={{ paddingBottom: 5 }}
              />
            )}

            <Text>{item?.servicelikes?.length || 0} Likes</Text>
          </TouchableOpacity>
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              // Assuming 'item' passed to 'review' screen is the vendor ID
              navigation.navigate("review", { item: item?._id });
            }}
          >
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              startingValue={item?.avgRating}
              ratingBackgroundColor="white"
              ratingColor="#04973C" // Consistent green color
              readonly
              style={{ paddingBottom: 5 }}
            />
            <Text>Rating</Text>
          </Pressable>
        </View>
      </View>
      <View style={{ padding: 30, flexGrow: 1 }}>
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
        <View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={makePhoneCall}
          >
            <Icon name="phone" size={25} color="white" style={styles.icon} />
            <Text style={styles.text}>Call Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F3FFF3",
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
    padding: 15,
    backgroundColor: "#04973C",
    borderRadius: 8,
    justifyContent: "center",
    marginTop: 40,
    paddingBottom: 15,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default VendorService;
