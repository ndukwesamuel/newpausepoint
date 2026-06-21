// import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

// import { MediumFontText } from "../../../components/shared/Paragrahp";
// import ApprovedGoods from "./ApprovedGoods";
// import PendingGoods from "./PendingGoods";
// import { useDispatch, useSelector } from "react-redux";
// import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Amenitity_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";
import {
  BottomModal,
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";

// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";
// --- If you were using useQuery for fetching, you would also import it here ---
// import { useQuery } from '@tanstack/react-query';
// -----------------------------------------------------------------------------------

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const Amenities = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation(); // Not used in the final return, but kept for context

  const [mainmodal, setMainmodal] = useState(false);
  const { amenitity_data } = useSelector((state) => state?.AdminMarketSLice);
  const [newAmenity, setNewAmenity] = useState("");
  const [amenityStatus, setAmenityStatus] = useState("");

  const { user_data } = useSelector((state) => state.AuthSlice);

  // In a real application using TanStack Query, you might use a useQuery hook here
  // to fetch the amenities data instead of the Redux action Amenitity_data_Fun.
  useEffect(() => {
    dispatch(Amenitity_data_Fun());
    return () => {};
  }, [dispatch]); // Added dispatch to dependency array for best practice

  // --- TanStack Query useMutation for Creating Amenity ---
  const CreateAmenties_Mutation = useMutation({
    mutationFn: (data_info) => {
      // 'mutationFn' replaces the function passed directly to useMutation
      let url = `${API_BASEURL}amenities`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Amenity created successfully",
      });
      setNewAmenity("");
      setAmenityStatus("");
      // Re-fetch data via Redux for simplicity, though in a full TQ setup, you'd use queryClient.invalidateQueries
      dispatch(Amenitity_data_Fun());
      setMainmodal(false);
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });
  // -------------------------------------------------------

  // --- TanStack Query useMutation for Deleting Amenity ---
  const DeleteAmenity_Mutation = useMutation({
    mutationFn: (amenityId) => {
      // 'mutationFn' replaces the function passed directly to useMutation
      let url = `${API_BASEURL}amenities/${amenityId}`;

      const config = {
        headers: {
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.delete(url, config);
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Amenity deleted successfully",
      });
      // Re-fetch data via Redux
      dispatch(Amenitity_data_Fun());
    },
    onError: (error) => {
      console.log({
        deleteError: error?.response?.data,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });
  // -------------------------------------------------------

  const handleAddAmenity = () => {
    if (newAmenity && amenityStatus) {
      CreateAmenties_Mutation.mutate({
        name: newAmenity,
        payment: amenityStatus,
      });
    }
  };

  const handleDeleteAmenity = (amenityId) => {
    DeleteAmenity_Mutation.mutate(amenityId);
  };

  const maoldaClose = () => {
    setMainmodal(false);
  };

  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", right: 50, top: 320, zIndex: 1 }}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setMainmodal(true)}
        >
          <MaterialIcons name="mode-edit" size={24} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={amenitity_data?.amenities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.amenityContainer}>
            <Text style={styles.amenityName}>{item.name}</Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text style={item.payment === "Free" ? styles.free : styles.paid}>
                {item.payment}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                // Check if the delete mutation is running for this specific item (not strictly necessary but can be useful)
                disabled={DeleteAmenity_Mutation.isLoading}
                onPress={() => handleDeleteAmenity(item?._id)}
              >
                {/* Optional: Show a small indicator when deleting an item */}
                {DeleteAmenity_Mutation.isLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <MaterialIcons name="delete" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* The main loading indicator when deleting any item */}
      {/* Note: This shows a full-screen indicator. You might prefer the in-list one above. */}
      {DeleteAmenity_Mutation.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )}

      {mainmodal && (
        <BottomModal onClose={maoldaClose}>
          <View style={{ margin: 10 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Amenity"
              value={newAmenity}
              onChangeText={setNewAmenity}
            />

            <TextInput
              style={styles.input}
              placeholder="Status (Free/Paid)"
              value={amenityStatus}
              onChangeText={setAmenityStatus}
            />
          </View>

          {CreateAmenties_Mutation?.isLoading ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <Button title="Add Amenity" onPress={handleAddAmenity} />
          )}
        </BottomModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  amenityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  amenityName: {
    fontSize: 16,
    color: "#000",
  },
  free: {
    color: "green",
  },
  paid: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Amenities;
