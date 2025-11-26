import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const VendorProfile = ({ navigation }) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [categories, setCategories] = useState([
    { label: "Category 1", value: "category1" },
    { label: "Category 2", value: "category2" },
    { label: "Category 3", value: "category3" },
  ]);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [subCategories, setSubCategories] = useState([
    { label: "Sub-Category 1", value: "subcategory1" },
    { label: "Sub-Category 2", value: "subcategory2" },
    { label: "Sub-Category 3", value: "subcategory3" },
  ]);
  const [profileImage, setProfileImage] = useState(
    "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg"
  ); // Replace with the user's actual data

  const { get_all_admin_Service_data, categoryes_data } = useSelector(
    (state) => state.AdminServiceSlice
  );
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  console.log({
    f: user_data,
  });
  const formattedCategories = categoryes_data.map((category) => ({
    label: category.name,
    value: category._id,
  }));

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const [FullName, setFullName] = useState("");
  const [phone_number, setphone_number] = useState("");
  const [years_of_experience, setyears_of_experience] = useState("");
  const [address, setaddress] = useState("");
  const [opens, setopens] = useState("");

  const [about_me, setAbout_me] = useState("");

  // --- TanStack Query useMutation for Creating Vendor Profile ---
  const CreateVendor_Mutation = useMutation({
    mutationFn: (data_info) => {
      // data_info is the formData passed to mutate()
      let url = `${API_BASEURL}services/vendors/estate-admin`;

      const config = {
        headers: {
          // Note: When using FormData, axios automatically sets the correct boundary for multipart/form-data.
          // Setting the Content-Type header explicitly can sometimes cause issues,
          // but keeping it here as it was in the original file, though usually not needed.
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Vendor profile created successfully!",
      });
      navigation.goBack();
    },
    onError: (error) => {
      console.log({
        fire: error?.response?.data,
      });
      const errorMessage =
        error?.response?.data?.error || "Vendor creation failed";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // ------------------------------------------------------------------

  const handleSave = () => {
    // Basic validation
    if (
      !FullName ||
      !phone_number ||
      !years_of_experience ||
      !address ||
      !about_me ||
      !opens
    ) {
      Toast.show({ type: "error", text1: "Please fill all required fields." });
      return;
    }

    const formData = new FormData();

    formData.append("FullName", FullName);
    formData.append("phone_number", phone_number);
    formData.append("years_of_experience", years_of_experience);
    // formData.append("category", subCategoryValue); // Ensure this is the correct field name

    formData.append("about_me", about_me);
    formData.append("address", address);
    formData.append("opens", opens);

    if (profileImage) {
      const uri = profileImage;
      // Using platform-specific path helpers might be necessary in a real React Native/Expo app
      const uriParts = uri.split("/");
      const fileName = uriParts[uriParts.length - 1];
      const type = "image/" + fileName.split(".").pop(); // Simple attempt to derive mime type

      formData.append("photo", { uri, name: fileName, type });
    }

    CreateVendor_Mutation.mutate(formData);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ paddingTop: 20, paddingHorizontal: 20 }}>
        <TouchableOpacity
          onPress={pickImage}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{ uri: profileImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        </TouchableOpacity>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Full Name"
            value={FullName}
            onChangeText={setFullName}
          />

          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="Enter Phone Number"
                value={phone_number}
                onChangeText={setphone_number}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="Enter Years of Experience"
                value={years_of_experience}
                onChangeText={setyears_of_experience}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Category Dropdowns commented out in original code */}
          {/* <View style={styles.row}>
            ... DropDownPicker components ...
          </View> */}

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="55, Kennedy Lane, Whales Avenue, Lagos"
            value={address}
            onChangeText={setaddress}
          />

          <Text style={styles.label}>Service (About Me)</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe the service you render"
            value={about_me}
            onChangeText={setAbout_me}
            multiline
          />

          <Text style={styles.label}>Working Hours</Text>
          <TextInput
            style={styles.largeInput}
            placeholder="Monday-Friday, 08:00am - 09:00pm"
            multiline
            value={opens}
            onChangeText={setopens}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={handleSave}
          disabled={CreateVendor_Mutation.isLoading}
        >
          {CreateVendor_Mutation.isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Vendor Profile </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Added flex to ensure scroll view works correctly
  },
  formContainer: {
    paddingHorizontal: 0, // Removed redundant horizontal padding here since ScrollView has it
  },
  dropdown: {
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 15,
    borderColor: "transparent",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: "600",
  },
  input: {
    fontSize: 16,
    padding: 15,
    borderRadius: 8, // Slightly larger radius
    width: "100%",
    backgroundColor: "#F0F0F0", // Lighter background
    marginBottom: 15,
  },
  smallInput: {
    fontSize: 16,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginBottom: 5,
  },
  largeInput: {
    fontSize: 16,
    padding: 15,
    borderRadius: 8,
    width: "100%",
    backgroundColor: "#F0F0F0",
    paddingVertical: 15, // Reduced padding for multiline input
    minHeight: 100, // Added minHeight for better display
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    gap: 10, // Added gap for spacing
  },
  column: {
    flex: 1,
    marginHorizontal: 0, // Removed margin as gap handles spacing
  },
  buttonContainer: {
    backgroundColor: "#04973C",
    padding: 18, // Increased padding
    alignItems: "center",
    borderRadius: 10, // Larger radius
    marginTop: 30, // Increased margin
    marginBottom: 50, // Increased margin
    elevation: 5, // Subtle shadow
  },
  buttonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default VendorProfile;
