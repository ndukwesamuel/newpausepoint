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
} from "react-native";
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
  const [images, setImages] = useState([]); // Changed from profileImage to images array
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

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true, // Enable multiple selection
    });

    if (!result.canceled) {
      // Add new images to existing ones
      setImages([...images, ...result.assets]);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);
    formData.append("contact", contact);
    formData.append("clanId", userProfile_data?.currentClanMeeting?._id);

    // Append each image to the formData
    images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: image.mimeType || "image/jpeg",
        name: `image_${index}.jpg`,
      });
    });

    CreateVendor_Mutation.mutate(formData);
  };

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
          text1: "Product created successfully!",
        });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error || "An error occurred"}`,
        });
      },
    }
  );

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

        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Description</Text>
          <CustomTextArea
            placeholder="Write description..."
            value={description}
            onChangeText={setDescription}
            style={styles.largeInput}
            inputStyle={{
              textAlignVertical: "top",
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#F6F8FAE5",
              paddingHorizontal: 10,
              height: 100,
              borderRadius: 6,
              fontSize: 16,
            }}
          />
        </View>

        {/* Image Upload Section */}
        <View style={styles.imageUploadContainer}>
          <Text style={styles.label}>Product Images</Text>
          <TouchableOpacity
            onPress={pickImages}
            style={styles.imageUploadButton}
          >
            <Text>Select Images</Text>
          </TouchableOpacity>

          {/* Display selected images */}
          <FlatList
            horizontal
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: item.uri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.buttonContainer} onPress={handleSave}>
        {CreateVendor_Mutation.isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Create Product</Text>
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
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
  },
  imageUploadContainer: {
    marginTop: 15,
  },
  imageUploadButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 10,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeImageButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CreateProduct;
