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
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
// import { All_service__data_Fun } from "../../Redux/UserSide/ServiceSlice";
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
    // Alert.alert("Call Support", "Are you sure you want to call support?");
    // Linking.openURL(
    //   `${Admin_Get_Single_Emergency_Report?.userProfile?.phoneNumber} || 080`
    // );
    Linking.openURL(`tel:${item?.phone_number}`);
  };

  console.log({
    fghhh: user_data?.token,
  });
  const Delete_Mutation = useMutation(
    (data_info) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url = `${API_BASEURL}services/vendors/estate-admin?vendorId=${item?._id}`;

      return axios.delete(url, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "successfully ",
        });
        dispatch(Get_all_admin_Service__Fun());

        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          jjjjj: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );
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
                navigation.navigate("VendortDetailsReview", { item });
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
          {/* <TouchableOpacity
            style={{ alignItems: "center" }}
            // onPress={() => Like_Mutation.mutate()}
          >
            <Icon
              name="heart"
              size={20}
              color="#04973C"
              style={{ paddingBottom: 5 }}
            />
            <Text>
              {item?.servicelikes?.length}
              Likes
            </Text>
          </TouchableOpacity> */}
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              navigation.navigate("VendortDetailsReview", { item });
            }}
          >
            <Rating
              type="custom"
              ratingCount={5}
              imageSize={20}
              // startingValue={0}
              startingValue={item?.avgRating} // Use item.avgRating for the rating value
              ratingBackgroundColor="white"
              ratingColor="green"
              value={3}
              readonly
              style={{ paddingBottom: 5 }}
            />

            {/* <Rating
              readonly
              startingValue={item?.avgRating} // Use item.avgRating for the rating value
              imageSize={17}
              fractions={5}
            /> */}

            <Text>Rating</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ padding: 30, height: "50%" }}>
        <View style={styles.downContainer}>
          <Text style={{ fontSize: 20, fontWeight: "400", paddingBottom: 5 }}>
            Contact
          </Text>
          <Text>
            <Icon name="phone" size={20} color="green" />
            <Text> {item?.phone_number} </Text>
          </Text>

          <Text>
            <Icon name="map-marker" size={20} color="green" />
            <Text>{item?.address}</Text>
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
          <Text style={{ fontSize: 20, fontWeight: "400", paddingBottom: 5 }}>
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
              <ActivityIndicator color="green" size="large" />
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 10,
                  backgroundColor: "red",
                  borderRadius: 5,
                  justifyContent: "center",
                  marginTop: 40,
                  marginBottom: 40,
                }}
                onPress={() => Delete_Mutation.mutate()}
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
              <Icon name="phone" size={30} color="white" style={styles.icon} />
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
    height: "52%",
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
    padding: 10,
    backgroundColor: "#04973C",
    borderRadius: 5,
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
  },
});
export default VendorListDetails;
