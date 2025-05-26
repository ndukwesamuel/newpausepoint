import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useMutateData } from "../../hooks/Request";

const CreateErrandScreen = () => {
  const navigation = useNavigation();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    deliveryAddress: "",
    description: "",
    clanId: "",
    pickupLocations: [
      {
        name: "",
        address: "",
        items: [
          {
            name: "",
            description: "",
            quantity: "",
            images: [],
          },
        ],
      },
    ],
  });

  // Handle text input changes
  const handleChange = (field, value, locationIndex = 0, itemIndex = 0) => {
    if (field.includes("pickupLocations")) {
      const [_, locIdx, subField, itemIdx] =
        field.match(/pickupLocations\[(\d+)\]\.(items\[(\d+)\]\.)?(\w+)/) || [];

      if (subField) {
        // Item field changed
        setFormData((prev) => {
          const newPickupLocations = [...prev.pickupLocations];
          newPickupLocations[locIdx].items[itemIdx][subField] = value;
          return { ...prev, pickupLocations: newPickupLocations };
        });
      } else {
        // Location field changed
        setFormData((prev) => {
          const newPickupLocations = [...prev.pickupLocations];
          newPickupLocations[locIdx][field.split(".")[1]] = value;
          return { ...prev, pickupLocations: newPickupLocations };
        });
      }
    } else {
      // Top level field changed
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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
      handleChange(
        `pickupLocations[${locationIndex}].items[${itemIndex}].images`,
        [
          ...formData.pickupLocations[locationIndex].items[itemIndex].images,
          result.uri,
        ]
      );
    }
  };

  const {
    mutate: createErrand,
    isLoading: isCreating,
    error: creationError,
  } = useMutateData("errands", "POST", "errands-list");

  // Handle form submission
  //   const handleSubmit = () => {
  //     // Validate form
  //     if (!formData.title || !formData.deliveryAddress || !formData.clanId) {
  //       Alert.alert("Error", "Please fill in all required fields");
  //       return;
  //     }

  //     for (let location of formData.pickupLocations) {
  //       if (!location.name || !location.address) {
  //         Alert.alert("Error", "Please fill in all pickup location fields");
  //         return;
  //       }

  //       for (let item of location.items) {
  //         if (!item.name || !item.quantity) {
  //           Alert.alert("Error", "Please fill in all item fields");
  //           return;
  //         }
  //       }
  //     }

  //     // Prepare form data for submission
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("title", formData.title);
  //     formDataToSend.append("deliveryAddress", formData.deliveryAddress);
  //     formDataToSend.append("description", formData.description);
  //     formDataToSend.append("clanId", formData.clanId);

  //     // Add pickup locations and items
  //     formData.pickupLocations.forEach((location, locIndex) => {
  //       formDataToSend.append(
  //         `pickupLocations[${locIndex}][name]`,
  //         location.name
  //       );
  //       formDataToSend.append(
  //         `pickupLocations[${locIndex}][address]`,
  //         location.address
  //       );

  //       location.items.forEach((item, itemIndex) => {
  //         formDataToSend.append(
  //           `pickupLocations[${locIndex}][items][${itemIndex}][name]`,
  //           item.name
  //         );
  //         formDataToSend.append(
  //           `pickupLocations[${locIndex}][items][${itemIndex}][description]`,
  //           item.description
  //         );
  //         formDataToSend.append(
  //           `pickupLocations[${locIndex}][items][${itemIndex}][quantity]`,
  //           item.quantity
  //         );

  //         // Add images if they exist
  //         item.images.forEach((imageUri, imgIndex) => {
  //           formDataToSend.append(
  //             `pickupLocations[${locIndex}][items][${itemIndex}][images][${imgIndex}]`,
  //             {
  //               uri: imageUri,
  //               type: "image/jpeg",
  //               name: `image_${locIndex}_${itemIndex}_${imgIndex}.jpg`,
  //             }
  //           );
  //         });
  //       });
  //     });

  //     // Here you would typically send the formDataToSend to your API
  //     console.log("Form data to send:", formDataToSend);

  //     // For demo purposes, we'll just log it and navigate back
  //     Alert.alert("Success", "Errand created successfully!");
  //     navigation.goBack();
  //   };

  // Modified handleSubmit function to use the mutation
  const handleSubmit = () => {
    // Validate form (same as before)
    if (!formData.title || !formData.deliveryAddress || !formData.clanId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    for (let location of formData.pickupLocations) {
      if (!location.name || !location.address) {
        Alert.alert("Error", "Please fill in all pickup location fields");
        return;
      }

      for (let item of location.items) {
        if (!item.name || !item.quantity) {
          Alert.alert("Error", "Please fill in all item fields");
          return;
        }
      }
    }

    // Prepare the data for submission
    const submissionData = {
      title: formData.title,
      deliveryAddress: formData.deliveryAddress,
      description: formData.description,
      clanId: formData.clanId,
      pickupLocations: formData.pickupLocations.map((location) => ({
        name: location.name,
        address: location.address,
        items: location.items.map((item) => ({
          name: item.name,
          description: item.description,
          quantity: item.quantity,
          // If you need to handle image uploads separately, you might need additional logic here
          images: item.images,
        })),
      })),
    };

    // Call the mutation
    createErrand(submissionData, {
      onSuccess: (data) => {
        Alert.alert("Success", "Errand created successfully!");
        navigation.goBack();
      },
      onError: (error) => {
        Alert.alert("Error", error.message || "Failed to create errand");
      },
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Create New Errand</Text>

      {/* Basic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Basic Information</Text>

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
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          multiline
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Clan ID"
          value={formData.clanId}
          onChangeText={(text) => handleChange("clanId", text)}
        />
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
                  value={item.quantity}
                  onChangeText={(text) =>
                    handleChange(
                      `pickupLocations[${locationIndex}].items[${itemIndex}].quantity`,
                      text
                    )
                  }
                />

                {/* <TouchableOpacity
                  style={styles.imageButton}
                  onPress={() => pickImage(locationIndex, itemIndex)}
                >
                  <Text style={styles.imageButtonText}>Add Image</Text>
                </TouchableOpacity> */}

                {item.images.length > 0 && (
                  <View style={styles.imagePreviewContainer}>
                    {item.images.map((imageUri, imgIndex) => (
                      <Image
                        key={imgIndex}
                        source={{ uri: imageUri }}
                        style={styles.imagePreview}
                      />
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

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Create Errand</Text>
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
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
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
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default CreateErrandScreen;
