import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  FlatList,
  Modal,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { Market_Category_Fun } from "../../../Redux/UserSide/MarketSLice";
import { CustomTextArea } from "../../../components/shared/InputForm";

const CreateProduct = ({ navigation }) => {
  const dispatch = useDispatch();
  const { marketcategory__data } = useSelector((state) => state.MarketSLice);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryValue, setCategoryValue] = useState(null);
  const [subCategoryOpen, setSubCategoryOpen] = useState(false);
  const [subCategoryValue, setSubCategoryValue] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState("");

  useEffect(() => {
    dispatch(Market_Category_Fun());
  }, [dispatch]);

  const { user_data } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const formattedCategories = marketcategory__data?.map((category) => ({
    label: category?.name,
    value: category._id,
  }));

  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { label: "Category 1", value: "cat1" },
    { label: "Category 2", value: "cat2" },
    { label: "Category 3", value: "cat3" },
  ];

  console.log({
    formattedCategories: selectedCategory,
  });
  const pickImage = async () => {
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

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
  ]);

  console.log({
    name: name,
    price: price,
    quantity: quantity,
    category: value,
    description: description,
    id: userProfile_data?.currentClanMeeting?._id,
  });

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("contact", contact);
    formData.append("clanId", userProfile_data?.currentClanMeeting?._id);

    if (profileImage) {
      const uri = profileImage;
      const type = "image/jpeg";
      const name = "photo.jpg";
      formData.append("images", { uri, type, name });
    }

    CreateVendor_Mutation.mutate(formData);
  };

  console.log({
    rr: user_data?.token,
  });

  const CreateVendor_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}market/product/create`;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Event created successfully!",
        });
        navigation.goBack();
      },
      onError: (error) => {
        console.log({
          error: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
        });
      },
    }
  );

  console.log({
    value: value,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter Price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              style={styles.smallInput}
              placeholder="Enter Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Phone Number</Text>

            <TextInput
              style={styles.smallInput}
              placeholder="Enter Phone Number"
              value={contact}
              onChangeText={setContact}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={{ marginTop: 10, zIndex: -10000 }}>
          <Text style={styles.label}>Description</Text>

          <CustomTextArea
            placeholder="Write description..."
            value={description}
            onChangeText={setDescription}
            style={styles.largeInput}
            inputStyle={{
              textAlignVertical: "top", // Ensures text starts from the top
              paddingTop: 10, // Add paddingTop to control vertical padding
              paddingBottom: 10, // Add paddingBottom to balance padding
              backgroundColor: "#F6F8FAE5",
              paddingHorizontal: 10,
              paddingTop: 10, // Add paddingTop to control the vertical padding
              paddingBottom: 10, // Add paddingBottom to balance the padding
              height: 100,
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={pickImage}
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "gray",
            borderRadius: 10,
            padding: 10,
            marginTop: 10,
            marginBottom: 20,
          }}
        >
          {profileImage ? (
            <Image
              source={{ uri: profileImage }}
              style={{ width: 100, height: 100 }}
            />
          ) : (
            <Text>Input Product Image</Text>
          )}
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
        {CreateVendor_Mutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Vendor Profile</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  dropdown: {
    backgroundColor: "#eee",
    borderRadius: 5,
    marginBottom: 15,
    borderColor: "transparent",
    zIndex: 100,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
    backgroundColor: "#eee",
    paddingVertical: 35,
    marginBottom: 15,
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
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
});

export default CreateProduct;

const CustomDropdown = ({ items, selectedValue, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(selectedValue);

  const handleSelect = (item) => {
    setValue(item);
    onValueChange(item);
    setIsOpen(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 5,
          padding: 10,
          backgroundColor: "#fff",
        }}
        onPress={() => setIsOpen(!isOpen)}
      >
        <Text style={{ fontSize: 16 }}>
          {value ? value.label : "Select an option"}
        </Text>
      </TouchableOpacity>
      {isOpen && (
        <Modal
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsOpen(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#fff",
                borderRadius: 10,
                width: "80%",
                maxHeight: "50%",
                padding: 10,
              }}
            >
              <FlatList
                data={items}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      padding: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                    }}
                    onPress={() => handleSelect(item)}
                  >
                    <Text>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};
