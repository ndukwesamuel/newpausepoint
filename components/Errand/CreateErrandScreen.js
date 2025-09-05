import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMutateData } from "../../hooks/Request";
import ScreenWrapper from "../shared/ScreenWrapper";
import { Switch } from "react-native";
import PickupErrandScreen from "./PickupErrandScreen";

const ShoppingCreateErrandScreen = () => {
  const navigation = useNavigation();
  const [uploadingImages, setUploadingImages] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    deliveryAddress: "",
    description: "",
    phoneNumber: "",
    isWithinEstate: false,
    pickupLocations: [
      {
        name: "",
        address: "",
        items: [
          {
            name: "",
            description: "",
            quantity: "",
            price: "",
            images: [],
          },
        ],
      },
    ],
  });

  // Cloudinary configuration - Replace with your actual values
  const CLOUDINARY_CLOUD_NAME = "dkzds0azx";
  const CLOUDINARY_UPLOAD_PRESET = "ydnmnjxq";

  // Upload single image to Cloudinary
  const uploadToCloudinary = async (imageUri) => {
    try {
      const formData = new FormData();

      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "image.jpg",
      });

      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          url: data.secure_url,
          publicId: data.public_id,
        };
      } else {
        throw new Error(data.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // Upload all images in the form data
  const uploadAllImages = async () => {
    setUploadingImages(true);

    try {
      const updatedPickupLocations = await Promise.all(
        formData.pickupLocations.map(async (location) => {
          const updatedItems = await Promise.all(
            location.items.map(async (item) => {
              if (item.images.length === 0) {
                return item;
              }

              // Upload all images for this item
              const uploadPromises = item.images.map((imageUri) =>
                uploadToCloudinary(imageUri)
              );
              const uploadResults = await Promise.all(uploadPromises);

              // Filter successful uploads and get URLs
              const successfulUploads = uploadResults.filter(
                (result) => result.success
              );
              const uploadedUrls = successfulUploads.map(
                (result) => result.url
              );

              // Log any failed uploads
              const failedUploads = uploadResults.filter(
                (result) => !result.success
              );
              if (failedUploads.length > 0) {
                console.warn(
                  `Failed to upload ${failedUploads.length} images for item: ${item.name}`
                );
              }

              return {
                ...item,
                images: uploadedUrls, // Replace local URIs with Cloudinary URLs
              };
            })
          );

          return {
            ...location,
            items: updatedItems,
          };
        })
      );

      setUploadingImages(false);
      return updatedPickupLocations;
    } catch (error) {
      setUploadingImages(false);
      throw error;
    }
  };

  // Helper function to calculate total for a list of items
  const calculateItemsTotal = (items) => {
    return items.reduce((sum, item) => {
      const quantity = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return sum + quantity * price;
    }, 0);
  };

  // Calculate the grand total for all locations combined
  const grandTotal = formData.pickupLocations.reduce((sum, location) => {
    return sum + calculateItemsTotal(location.items);
  }, 0);

  // Handle text input changes
  const handleChange = (field, value) => {
    const locationMatch = field.match(/pickupLocations\[(\d+)\]\.(\w+)/);
    const itemMatch = field.match(
      /pickupLocations\[(\d+)\]\.items\[(\d+)\]\.(\w+)/
    );

    setFormData((prev) => {
      if (itemMatch) {
        const locIdx = parseInt(itemMatch[1]);
        const itemIdx = parseInt(itemMatch[2]);
        const subField = itemMatch[3];

        const newPickupLocations = [...prev.pickupLocations];
        newPickupLocations[locIdx].items[itemIdx] = {
          ...newPickupLocations[locIdx].items[itemIdx],
          [subField]: value,
        };
        return { ...prev, pickupLocations: newPickupLocations };
      } else if (locationMatch) {
        const locIdx = parseInt(locationMatch[1]);
        const subField = locationMatch[2];

        const newPickupLocations = [...prev.pickupLocations];
        newPickupLocations[locIdx] = {
          ...newPickupLocations[locIdx],
          [subField]: value,
        };
        return { ...prev, pickupLocations: newPickupLocations };
      } else {
        return { ...prev, [field]: value };
      }
    });
  };

  // Add a new pickup location
  const addPickupLocation = () => {
    setFormData((prev) => ({
      ...prev,
      pickupLocations: [
        ...prev.pickupLocations,
        {
          name: "",
          address: "",
          items: [
            {
              name: "",
              description: "",
              quantity: "",
              price: "",
              images: [],
            },
          ],
        },
      ],
    }));
  };

  // Remove a pickup location
  const removePickupLocation = (index) => {
    if (formData.pickupLocations.length <= 1) {
      Alert.alert("Error", "You must have at least one pickup location");
      return;
    }

    setFormData((prev) => {
      const newPickupLocations = [...prev.pickupLocations];
      newPickupLocations.splice(index, 1);
      return { ...prev, pickupLocations: newPickupLocations };
    });
  };

  // Add a new item to a pickup location
  const addItem = (locationIndex) => {
    setFormData((prev) => {
      const newPickupLocations = [...prev.pickupLocations];
      newPickupLocations[locationIndex].items.push({
        name: "",
        description: "",
        quantity: "",
        price: "",
        images: [],
      });
      return { ...prev, pickupLocations: newPickupLocations };
    });
  };

  // Remove an item from a pickup location
  const removeItem = (locationIndex, itemIndex) => {
    if (formData.pickupLocations[locationIndex].items.length <= 1) {
      Alert.alert("Error", "You must have at least one item");
      return;
    }

    setFormData((prev) => {
      const newPickupLocations = [...prev.pickupLocations];
      newPickupLocations[locationIndex].items.splice(itemIndex, 1);
      return { ...prev, pickupLocations: newPickupLocations };
    });
  };

  // Handle image upload
  const pickImage = async (locationIndex, itemIndex) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFormData((prev) => {
        const newPickupLocations = [...prev.pickupLocations];
        newPickupLocations[locationIndex].items[itemIndex] = {
          ...newPickupLocations[locationIndex].items[itemIndex],
          images: [
            ...newPickupLocations[locationIndex].items[itemIndex].images,
            result.assets[0].uri,
          ],
        };
        return { ...prev, pickupLocations: newPickupLocations };
      });
    }
  };

  // Remove image
  const removeImage = (locationIndex, itemIndex, imageIndex) => {
    setFormData((prev) => {
      const newPickupLocations = [...prev.pickupLocations];
      const images = [
        ...newPickupLocations[locationIndex].items[itemIndex].images,
      ];
      images.splice(imageIndex, 1);
      newPickupLocations[locationIndex].items[itemIndex] = {
        ...newPickupLocations[locationIndex].items[itemIndex],
        images,
      };
      return { ...prev, pickupLocations: newPickupLocations };
    });
  };

  const {
    mutate: createErrand,
    isLoading: isCreating,
    error: creationError,
  } = useMutateData("api/v1/general/shoping", "POST", "errand");

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form
    if (!formData.title || !formData.deliveryAddress || !formData.phoneNumber) {
      Alert.alert(
        "Error",
        "Please fill in all required fields including phone number"
      );
      return;
    }

    // Validate phone number format (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      Alert.alert("Error", "Please enter a valid phone number (10-15 digits)");
      return;
    }

    for (let location of formData.pickupLocations) {
      if (!location.name || !location.address) {
        Alert.alert("Error", "Please fill in all pickup location fields");
        return;
      }

      for (let item of location.items) {
        if (!item.name || !item.quantity || !item.price) {
          Alert.alert(
            "Error",
            "Please fill in all item fields including price"
          );
          return;
        }
        if (
          isNaN(parseFloat(item.quantity)) ||
          parseFloat(item.quantity) <= 0
        ) {
          Alert.alert(
            "Error",
            `Quantity for item '${item.name}' must be a positive number.`
          );
          return;
        }
        if (isNaN(parseFloat(item.price)) || parseFloat(item.price) < 0) {
          Alert.alert(
            "Error",
            `Price for item '${item.name}' must be a non-negative number.`
          );
          return;
        }
      }
    }

    try {
      // Upload all images first
      const updatedPickupLocations = await uploadAllImages();

      const submissionData = {
        title: formData.title,
        deliveryAddress: formData.deliveryAddress,
        description: formData.description,
        phoneNumber: formData.phoneNumber,
        isWithinEstate: formData.isWithinEstate, // Include the toggle value
        pickupLocations: updatedPickupLocations.map((location) => ({
          name: location.name,
          address: location.address,
          items: location.items.map((item) => ({
            name: item.name,
            description: item.description,
            quantity: parseFloat(item.quantity),
            price: parseFloat(item.price),
            images: item.images,
          })),
        })),
      };

      console.log("Submission data with Cloudinary URLs:", submissionData);

      // Call the mutation
      createErrand(submissionData, {
        onSuccess: (data) => {
          Alert.alert("Success", "Errand created successfully!");
          navigation.goBack();
        },
        onError: (error) => {
          console.error("Creation Error:", error?.response);
          Alert.alert(
            "Error",
            error.message ||
              error.response?.data?.message ||
              "Failed to create errand"
          );
        },
      });
    } catch (error) {
      console.error("Image upload error:", error);
      Alert.alert("Error", "Failed to upload images. Please try again.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information </Text>

        <TextInput
          style={styles.input}
          placeholder="Title (e.g. Grocery Run)"
          value={formData.title}
          onChangeText={(text) => handleChange("title", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Delivery Address"
          value={formData.deliveryAddress}
          onChangeText={(text) => handleChange("deliveryAddress", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange("phoneNumber", text)}
          keyboardType="phone-pad"
        />

        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          multiline
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
        />
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleLabel}>
            Errand Inside your Estate ? (₦500 fee)
          </Text>
          <Switch
            value={formData.isWithinEstate}
            onValueChange={(value) => handleChange("isWithinEstate", value)}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={formData.isWithinEstate ? "#005091" : "#f4f3f4"}
          />
        </View>
        <Text style={styles.deliveryFeeText}>
          Delivery Fee: ₦{formData.isWithinEstate ? "500" : "1000"}
        </Text>
      </View>

      {/* Pickup Locations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Locations</Text>

        {formData.pickupLocations.map((location, locationIndex) => (
          <View key={locationIndex} style={styles.locationCard}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>
                Pickup Location #{locationIndex + 1}
              </Text>
              <TouchableOpacity
                onPress={() => removePickupLocation(locationIndex)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Location Name (e.g. Market Pickup)"
              value={location.name}
              onChangeText={(text) =>
                handleChange(`pickupLocations[${locationIndex}].name`, text)
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={location.address}
              onChangeText={(text) =>
                handleChange(`pickupLocations[${locationIndex}].address`, text)
              }
            />

            <Text style={styles.itemsTitle}>Items</Text>

            {location.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemNumber}>Item #{itemIndex + 1}</Text>
                  <TouchableOpacity
                    onPress={() => removeItem(locationIndex, itemIndex)}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="#FF3B30"
                    />
                  </TouchableOpacity>
                </View>

                <TextInput
                  style={styles.input}
                  placeholder="Item Name"
                  value={item.name}
                  onChangeText={(text) =>
                    handleChange(
                      `pickupLocations[${locationIndex}].items[${itemIndex}].name`,
                      text
                    )
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={item.description}
                  onChangeText={(text) =>
                    handleChange(
                      `pickupLocations[${locationIndex}].items[${itemIndex}].description`,
                      text
                    )
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Quantity"
                  keyboardType="numeric"
                  value={String(item.quantity)}
                  onChangeText={(text) =>
                    handleChange(
                      `pickupLocations[${locationIndex}].items[${itemIndex}].quantity`,
                      text
                    )
                  }
                />

                <TextInput
                  style={styles.input}
                  placeholder="Price per unit (e.g., 10.50)"
                  keyboardType="numeric"
                  value={String(item.price)}
                  onChangeText={(text) =>
                    handleChange(
                      `pickupLocations[${locationIndex}].items[${itemIndex}].price`,
                      text
                    )
                  }
                />

                {/* Display total price for the item */}
                {item.quantity && item.price ? (
                  <Text style={styles.itemTotalPrice}>
                    Item Total: ₦
                    {(
                      parseFloat(item.quantity) * parseFloat(item.price)
                    ).toFixed(2)}
                  </Text>
                ) : null}

                <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => pickImage(locationIndex, itemIndex)}
                >
                  <Text style={styles.imageButtonText}>Add Image</Text>
                </TouchableOpacity>

                {item.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    {item.images.map((imageUri, imgIndex) => (
                      <View key={imgIndex} style={styles.imageWrapper}>
                        <Image
                          source={{ uri: imageUri }}
                          style={styles.imagePreview}
                        />
                        <TouchableOpacity
                          style={styles.removeImageButton}
                          onPress={() =>
                            removeImage(locationIndex, itemIndex, imgIndex)
                          }
                        >
                          <Ionicons
                            name="close-circle"
                            size={20}
                            color="#FF3B30"
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addItem(locationIndex)}
            >
              <Text style={styles.addButtonText}>+ Add Item</Text>
            </TouchableOpacity>

            {/* Total price for this location */}
            <Text style={styles.locationTotal}>
              Location Total: ₦{calculateItemsTotal(location.items).toFixed(2)}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.addLocationButton}
          onPress={addPickupLocation}
        >
          <Text style={styles.addLocationButtonText}>
            + Add Pickup Location
          </Text>
        </TouchableOpacity>
      </View>

      <View>
        <Text style={{}}>
          {/* <Text style={{}}>Service Charge:</Text> ₦ 0.00 */}
          <Text style={styles.feeLabel}>Service Charge:</Text> ₦0.00
        </Text>

        <Text style={{}}>
          {/* <Text style={{}}>Delivery Charge:</Text> ₦ 500.00 */}

          <Text style={styles.feeText}>
            <Text style={styles.feeLabel}>Delivery Charge:</Text>₦
            {formData.isWithinEstate ? "500.00" : "1000.00"}
          </Text>
        </Text>
      </View>

      {/* Grand Total for all locations */}
      <View style={styles.grandTotalContainer}>
        {/* <Text style={styles.grandTotalText}>
            Grand Total for Errand: ₦{(grandTotal + 500.0).toFixed(2)}
          </Text> */}
        <Text style={styles.grandTotalText}>
          Grand Total for Errand: ₦
          {(grandTotal + (formData.isWithinEstate ? 500 : 1000)).toFixed(2)}
        </Text>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (isCreating || uploadingImages) && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={isCreating || uploadingImages}
      >
        {uploadingImages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFF" />
            <Text style={styles.submitButtonText}>Uploading Images...</Text>
          </View>
        ) : (
          <Text style={styles.submitButtonText}>
            {isCreating ? "Creating Errand..." : "Create Errand"}
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#444",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  locationCard: {
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EEE",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#555",
  },
  itemCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#666",
  },
  itemTotalPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: -5,
    marginBottom: 10,
    textAlign: "right",
    paddingRight: 5,
  },
  locationTotal: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    textAlign: "right",
  },
  grandTotalContainer: {
    backgroundColor: "#E0F7FA",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#B3E5FC",
    alignItems: "center",
  },
  grandTotalText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#00796B",
  },
  imageButton: {
    backgroundColor: "#E3F2FD",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  imageButtonText: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  imageWrapper: {
    position: "relative",
    marginRight: 10,
    marginBottom: 10,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFF",
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#388E3C",
    fontWeight: "bold",
  },
  addLocationButton: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  addLocationButtonText: {
    color: "#1976D2",
    fontWeight: "bold",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  disabledButton: {
    backgroundColor: "#A5D6A7",
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#FFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
  },
  toggleLabel: {
    fontSize: 16,
    color: "#555",
    flex: 1,
  },
  deliveryFeeText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#005091",
    marginLeft: 10,
  },
  feeText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#555",
  },
  feeLabel: {
    fontWeight: "bold",
  },
});

// import { View, Text } from 'react-native'
// import React from 'react'

export default function CreateErrandScreen() {
  const navigation = useNavigation();

  const [selected, setSelected] = useState("shopping");
  return (
    <ScreenWrapper
      title="Create Errand"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          flex: 1,
          padding: 20,
        }}
      >
        {/* Buttons Row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 12, // for spacing (works in RN 0.71+), else use margin
          }}
        >
          {/* Shopping Button */}
          <TouchableOpacity
            onPress={() => setSelected("shopping")}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: selected === "shopping" ? "green" : "lightgray",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
              Shopping
            </Text>
          </TouchableOpacity>

          {/* Pickup Button */}
          <TouchableOpacity
            onPress={() => setSelected("pickup")}
            style={{
              flex: 1,
              paddingVertical: 14,
              backgroundColor: selected === "pickup" ? "blue" : "lightgray",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
              Pickup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Show Selected */}
        {selected && (
          <View
            style={{
              flex: 1,
            }}
          >
            {selected === "shopping" && <ShoppingCreateErrandScreen />}
            {selected === "pickup" && <PickupErrandScreen />}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

{
  /* // export default CreateErrandScreen; */
}
