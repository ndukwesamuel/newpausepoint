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
} from "react-native";
import { Rating } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
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
  const Like_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}services/vendors/like-dislike/${item?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.get(url, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: " successfully ",
        });
        dispatch(All_service__data_Fun());

        // setTurnmodal(false);
      },

      onError: (error) => {
        console.log({
          jjjL: error?.response,
        });
        Toast.show({
          type: "error",

          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const makePhoneCall = () => {
    // Alert.alert("Call Support", "Are you sure you want to call support?");
    // Linking.openURL(
    //   `${Admin_Get_Single_Emergency_Report?.userProfile?.phoneNumber} || 080`
    // );
    Linking.openURL(`tel:${item?.phone_number}`);
  };
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
                navigation.navigate("review", { item });
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
          </TouchableOpacity>
          <Pressable
            style={{ alignItems: "center" }}
            onPress={() => {
              navigation.navigate("review", { item });
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
        <View>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={makePhoneCall}
          >
            <Icon name="phone" size={30} color="white" style={styles.icon} />
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
    // height: "52%",
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
    paddingBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
});

export default VendorService;
