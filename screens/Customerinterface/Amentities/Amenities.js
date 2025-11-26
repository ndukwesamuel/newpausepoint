import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

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

// Updated import to use the modern @tanstack/react-query
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const Amenities = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [mainmodal, setMainmodal] = useState(false);
  const { amenitity_data } = useSelector((state) => state?.AdminMarketSLice);
  const [newAmenity, setNewAmenity] = useState("");
  const [amenityStatus, setAmenityStatus] = useState("");

  const { user_data } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    // Dispatch action to fetch amenities data
    dispatch(Amenitity_data_Fun("all"));
    return () => {};
  }, []);

  // Refactored CreateAmenties_Mutation to use the modern object syntax
  const CreateAmenties_Mutation = useMutation({
    mutationFn: (data_info) => {
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

  // Refactored DeleteAmenity_Mutation to use the modern object syntax
  const DeleteAmenity_Mutation = useMutation({
    mutationFn: (amenityId) => {
      let url = `${API_BASEURL}amenities/${amenityId}`;

      console.log({
        url,
      });

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
      dispatch(Amenitity_data_Fun());
    },
    onError: (error) => {
      console.log({
        ssssss: error?.response?.data,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });

  const handleAddAmenity = () => {
    if (newAmenity && amenityStatus) {
      CreateAmenties_Mutation.mutate({
        name: newAmenity,
        payment: amenityStatus,
      });
    }
  };

  const handleDeleteAmenity = (amenityId) => {
    console.log({
      ddd: amenityId,
    });
    DeleteAmenity_Mutation.mutate(amenityId);
  };

  const maoldaClose = () => {
    setMainmodal(false);
  };

  return (
    <View style={styles.container}>
      {/* Floating Action Button to add new amenity */}
      <View style={{ position: "absolute", right: 20, bottom: 20, zIndex: 1 }}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setMainmodal(true)}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={amenitity_data?.amenities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.amenityContainer}>
            <View style={{ flex: 1 }}>
              <Text style={styles.amenityName}>{item.name}</Text>
            </View>
            <Text style={item.payment === "Free" ? styles.free : styles.paid}>
              {item.payment}
            </Text>
            {/* Delete Button for each amenity (assuming admin has permission) */}
            <TouchableOpacity
              onPress={() => handleDeleteAmenity(item._id)}
              style={styles.deleteButton}
              disabled={DeleteAmenity_Mutation.isLoading}
            >
              <MaterialIcons name="delete" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No amenities found.</Text>
        }
      />

      {DeleteAmenity_Mutation.isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#04973C" />
          <Text style={styles.loadingText}>Deleting Amenity...</Text>
        </View>
      )}

      {mainmodal && (
        <BottomModal onClose={maoldaClose}>
          <View style={{ margin: 10 }}>
            <Text style={styles.modalTitle}>Add New Amenity</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Amenity Name (e.g., Clubhouse)"
              value={newAmenity}
              onChangeText={setNewAmenity}
            />

            <TextInput
              style={styles.input}
              placeholder="Payment Status (e.g., Free or Paid)"
              value={amenityStatus}
              onChangeText={setAmenityStatus}
            />
          </View>

          {CreateAmenties_Mutation?.isLoading ? (
            <ActivityIndicator
              size="large"
              color="#04973C"
              style={{ marginVertical: 10 }}
            />
          ) : (
            <Button
              title="Add Amenity"
              onPress={handleAddAmenity}
              color="#04973C" // Changed button color for consistency
              disabled={!newAmenity || !amenityStatus}
            />
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
    backgroundColor: "#f5f5f5", // Light background for the screen
  },
  amenityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  amenityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  free: {
    color: "#04973C", // Brighter green for Free
    fontWeight: "700",
    marginRight: 10,
  },
  paid: {
    color: "#D9534F", // Red for Paid
    fontWeight: "700",
    marginRight: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "white",
  },
  editButton: {
    backgroundColor: "#04973C",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  deleteButton: {
    backgroundColor: "#D9534F",
    borderRadius: 50,
    width: 30,
    height: 30,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
});

export default Amenities;
