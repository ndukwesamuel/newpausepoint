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

// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
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

  // console.log({ // Commented out to reduce console noise
  //   nnn: photo,
  // });

  const { user_data } = useSelector((state) => state.AuthSlice);
  const navigation = useNavigation();

  const dispatch = useDispatch();

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***

  /**
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const deleteDomesticStaffRequest = async () => {
    let url = `${API_BASEURL}domesticstaff/${_id}`;

    // console.log({ // Commented out to reduce console noise
    //   fff: url,
    // });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    return axios.delete(url, config);
  };

  const Delete_Mutation = useMutation({
    mutationFn: deleteDomesticStaffRequest,
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Staff Deleted successfully",
      });
      // Refresh the staff list in the previous screen
      dispatch(Get_All_Domestic_Fun());

      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.message || "Failed to delete staff.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 30,
        }}
      >
        <Image
          source={{
            uri:
              photo ||
              "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSO9Xd_NJYU1FU2u886CDMp-pX-nffkmg_h0yhAKgLWCltFmAbQnt_nGdpEPgQZMZzw1k_pGxWjlD3U_Yk", // Fallback image
          }}
          style={styles.profileImage}
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

      <View style={styles.actionContainer}>
        {Delete_Mutation.isPending ? ( // Use isPending for TanStack Query v5
          <ActivityIndicator size="small" color="red" />
        ) : (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => Delete_Mutation.mutate()}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default DomesticDetail;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  item: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingTop: 30,
  },
  deleteButton: {
    backgroundColor: "red",
    width: "40%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
});
