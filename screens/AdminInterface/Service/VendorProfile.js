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
import { useMutation } from "react-query";
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

  const handleSave = () => {
    // Handle the saving of user data here (e.g., make API calls).
    const formData = new FormData();

    formData.append("FullName", FullName);
    formData.append("phone_number", phone_number);
    formData.append("years_of_experience", years_of_experience);
    formData.append("category", subCategoryValue);

    // formData.append("photo", description);
    formData.append("about_me", about_me);
    formData.append("address", address);
    // formData.append("gender", gender);
    formData.append("opens", opens);

    if (profileImage) {
      const uri = profileImage;
      const type = "image/jpeg"; // Adjust the type based on the file type
      const name = "photo.jpg"; // Adjust the name as needed
      formData.append("photo", { uri, type, name });
    }

    CreateVendor_Mutation.mutate(formData);
  };

  const CreateVendor_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}services/vendors/estate-admin`;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Event created successfully!",
        });

        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          fire: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
        });
      },
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView style={{ paddingTop: 20, paddingHorizontal: 20 }}>
        {/* <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/user.png")}
          style={styles.image}
        />
      </View> */}
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
              />
            </View>
            <View style={styles.column}>
              <Text style={styles.label}>Years of Experience</Text>
              <TextInput
                style={styles.smallInput}
                placeholder="Enter Years of Experience"
                value={years_of_experience}
                onChangeText={setyears_of_experience}
              />
            </View>
          </View>

          <View style={styles.row}>
            {/* <View style={styles.column}>
            <Text style={styles.label}>Category</Text>
            <DropDownPicker
              open={subCategoryOpen}
              value={subCategoryValue}
              items={formattedCategories}
              setOpen={setSubCategoryOpen}
              setValue={setSubCategoryValue}
              setItems={setSubCategories}
              placeholder="Select"
              style={styles.dropdown}
              containerStyle={{ height: 40 }}
              dropDownStyle={{ backgroundColor: "#eee" }}
            />
          </View> */}
            {/* <View style={styles.column}>
            <Text style={styles.label}>Sub-Category</Text>
            <DropDownPicker
              open={categoryOpen}
              value={categoryValue}
              items={categories}
              setOpen={setCategoryOpen}
              setValue={setCategoryValue}
              setItems={setCategories}
              placeholder="Select a category"
              style={styles.dropdown}
              containerStyle={{ height: 40 }}
              dropDownStyle={{ backgroundColor: "#fafafa" }}
            />
          </View> */}
          </View>

          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="55, Kennedy Lane, Whales Avenue, Lagos"
            value={address}
            onChangeText={setaddress}
          />

          <Text style={styles.label}>Service</Text>
          <TextInput
            style={styles.input}
            placeholder="Service to Render"
            value={about_me}
            onChangeText={setAbout_me}
          />

          <Text style={styles.label}>Working Hours</Text>
          <TextInput
            style={styles.largeInput}
            placeholder="Monday-Friday, 08:00am - 09:00pm"
            multiline
            value={opens}
            onChangeText={setopens}
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          // onPress={() => navigation.navigate("VendorList")}
          onPress={handleSave}
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
    // paddingHorizontal: 20,
    // paddingTop: 50,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  formContainer: {
    paddingHorizontal: 20,
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
  },
  input: {
    fontSize: 16,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#eee",
    marginBottom: 15,
  },
  smallInput: {
    fontSize: 16,
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#eee",
    marginBottom: 5,
  },
  largeInput: {
    fontSize: 16,
    padding: 15,
    borderRadius: 5,
    width: "100%",
    backgroundColor: "#eee",
    paddingVertical: 35,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    backgroundColor: "#04973C",
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

export default VendorProfile;
