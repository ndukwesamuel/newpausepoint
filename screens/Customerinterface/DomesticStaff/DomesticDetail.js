import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import AppScreen from "../../../components/shared/AppScreen";
import { formatDate } from "../../../utils/DateTime";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { Get_All_Domestic_Fun } from "../../../Redux/UserSide/GuestSlice";
import { Image } from "react-native";

const DomesticDetail = ({ route }) => {
  const {
    _id,
    staffName,
    gender,
    phone,
    dateOfBirth,
    homeAddress,
    Role,
    workingHours,
    staffCode,
    createdAt,
    updatedAt,
    photo,
  } = route?.params?.itemdata;

  console.log({
    nnn: photo,
  });

  const { user_data } = useSelector((state) => state.AuthSlice);
  const navigation = useNavigation();

  const dispatch = useDispatch();
  // const { itemdata } = route.params;

  // Format the dates to a readable format

  const Delete_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}domesticstaff/${_id}`;

      console.log({
        fff: url,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.delete(url, config);
    },
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Staff Deleted successfully",
        });
        dispatch(Get_All_Domestic_Fun());

        navigation.goBack();
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message}`,
        });
      },
    }
  );

  return (
    // <AppScreen>
    <ScrollView contentContainerStyle={styles.container}>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Image
          source={{ uri: photo || "" }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{staffName}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{gender === "1" ? "Male" : "Female"}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{phone}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Date of Birth:</Text>
        <Text style={styles.value}>{formatDate(dateOfBirth)}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Home Address:</Text>
        <Text style={styles.value}>{homeAddress}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{Role}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Working Hours:</Text>
        <Text style={styles.value}>{workingHours}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Staff Code:</Text>
        <Text style={styles.value}>{staffCode}</Text>
      </View>

      <View style={styles.item}>
        <Text style={styles.label}>Created At:</Text>
        <Text style={styles.value}>{formatDate(createdAt)}</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          paddingTop: 30,
        }}
      >
        {/* <TouchableOpacity
          style={{
            backgroundColor: "green",
            width: "40%",
            paddingVertical: 5,
            borderRadius: 5,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "white",
            }}
          >
            Updated
          </Text>
        </TouchableOpacity> */}

        {Delete_Mutation?.isLoading ? (
          <ActivityIndicator size="small" color="green" />
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              width: "40%",
              paddingVertical: 5,
              borderRadius: 5,
            }}
            onPress={() => Delete_Mutation.mutate()}
          >
            <Text
              style={{
                textAlign: "center",
                color: "white",
              }}
            >
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
    // </AppScreen>
  );
};

export default DomesticDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  item: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },
});
