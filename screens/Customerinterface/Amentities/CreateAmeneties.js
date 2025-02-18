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
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";
const ProductDetails = ({ navigation }) => {
  const { item } = useRoute().params;
  const dispatch = useDispatch();

  const { user_data } = useSelector((state) => state?.AuthSlice);

  console.log({
    ds: user_data?.token,
    ewe: item?._id,
  });
  const Aprove_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}market/product/status/${item?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.put(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: " successfully ",
        });
        dispatch(AdminMarket_data_Fun());

        navigation.goBack();
        // dispatch(Get_My_Clan_Forum_Fun());

        // setTurnmodal(false);
      },

      onError: (error) => {
        console.log({
          error: error?.response?.data,
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
            <Text> Jide Kosoko </Text>
          </Text>
          <Text style={styles.sellerInfo}>
            <Icon name="home" size={20} color="black" />
            <Text> House 24, Tinubu estate</Text>
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          {Aprove_Mutation?.isLoading ? (
            <ActivityIndicator size="large" color="white" />
          ) : (
            <>
              {item?.status === "Pending" ? (
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
                <TouchableOpacity
                  style={styles.declineButton}
                  onPress={() => {
                    Aprove_Mutation.mutate({
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
