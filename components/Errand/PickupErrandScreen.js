import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Image,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { formdatauseMutateData } from "../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
// import { useMutateData } from "../hooks/api"; // 👈 adjust path

// formdataapiRequest

const PickupErrandScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [isWithinEstate, setIsWithinEstate] = useState(false);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [images, setImages] = useState([]);

  // Use mutation hook
  const { mutate, isLoading } = formdatauseMutateData(
    "api/v1/general/pickUp",
    "POST",
    "errands"
  );

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      const selected = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: "image/jpeg",
      }));
      setImages([...images, ...selected]);
    }
  };

  const handleSubmit = () => {
    if (!title || !deliveryAddress || !pickUpAddress || !phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("deliveryAddress", deliveryAddress);
    formData.append("pickUpAddress", pickUpAddress);
    formData.append("isWithinEstate", isWithinEstate);
    formData.append("description", description);
    formData.append("phoneNumber", phoneNumber);

    console.log({
      fff: images,
    });

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        type: img.type || "image/jpeg", // make sure type exists
        name: img.name || `image_${index}.jpg`,
      });
    });

    mutate(formData, {
      onSuccess: () => {
        Alert.alert("Success", "Pickup Errand created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(), // navigate back
          },
        ]);
        // Alert.alert("Success", "Pickup Errand created successfully!");
        setTitle("");
        setDeliveryAddress("");
        setPickUpAddress("");
        setDescription("");
        setPhoneNumber("");
        setImages([]);
      },

      onError: (err) => {
        Alert.alert("Error", err.message || "Failed to create pickup errand");
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title *</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Pickup Address *</Text>
      <TextInput
        style={styles.input}
        value={pickUpAddress}
        onChangeText={setPickUpAddress}
      />

      <Text style={styles.label}>Delivery Address *</Text>
      <TextInput
        style={styles.input}
        value={deliveryAddress}
        onChangeText={setDeliveryAddress}
      />
      <Text style={styles.toggleLabel}>
        Errand Inside your Estate ? (₦500 fee)
      </Text>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Is within estate?</Text>
        <Switch value={isWithinEstate} onValueChange={setIsWithinEstate} />
      </View>

      <Text style={styles.deliveryFeeText}>
        Delivery Fee: ₦{isWithinEstate === true ? "500" : "1000"}
      </Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Text style={styles.label}>Phone Number *</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Upload Images</Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
        <Text style={styles.uploadText}>+ Pick Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((img, index) => (
          <Image
            key={index}
            source={{ uri: img.uri }}
            style={{ width: 80, height: 80, marginRight: 8, borderRadius: 8 }}
          />
        ))}
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitBtn, { opacity: isLoading ? 0.6 : 1 }]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.submitText}>
          {isLoading ? "Submitting..." : "Create Pickup Errand"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default PickupErrandScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "space-between",
  },
  uploadBtn: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  uploadText: { color: "#333", fontWeight: "600" },
  submitBtn: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
