// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation } from "@react-navigation/native";
// import * as ImagePicker from "expo-image-picker";
// import { Ionicons } from "@expo/vector-icons";
// import { useMutateData } from "../../hooks/Request";
// import ScreenWrapper from "../shared/ScreenWrapper";
// import { Switch } from "react-native";
// import PickupErrandScreen from "./PickupErrandScreen";

// const ShoppingCreateErrandScreen = () => {
//   const navigation = useNavigation();
//   const [uploadingImages, setUploadingImages] = useState(false);

//   // Form state
//   const [formData, setFormData] = useState({
//     title: "",
//     deliveryAddress: "",
//     description: "",
//     phoneNumber: "",
//     isWithinEstate: false,
//     pickupLocations: [
//       {
//         name: "",
//         address: "",
//         items: [
//           {
//             name: "",
//             description: "",
//             quantity: "",
//             price: "",
//             images: [],
//           },
//         ],
//       },
//     ],
//   });

//   // Cloudinary configuration - Replace with your actual values
//   const CLOUDINARY_CLOUD_NAME = "dkzds0azx";
//   const CLOUDINARY_UPLOAD_PRESET = "ydnmnjxq";

//   // Upload single image to Cloudinary
//   const uploadToCloudinary = async (imageUri) => {
//     try {
//       const formData = new FormData();

//       formData.append("file", {
//         uri: imageUri,
//         type: "image/jpeg",
//         name: "image.jpg",
//       });

//       formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//       formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         return {
//           success: true,
//           url: data.secure_url,
//           publicId: data.public_id,
//         };
//       } else {
//         throw new Error(data.error?.message || "Upload failed");
//       }
//     } catch (error) {
//       console.error("Cloudinary upload error:", error);
//       return {
//         success: false,
//         error: error.message,
//       };
//     }
//   };

//   // Upload all images in the form data
//   const uploadAllImages = async () => {
//     setUploadingImages(true);

//     try {
//       const updatedPickupLocations = await Promise.all(
//         formData.pickupLocations.map(async (location) => {
//           const updatedItems = await Promise.all(
//             location.items.map(async (item) => {
//               if (item.images.length === 0) {
//                 return item;
//               }

//               // Upload all images for this item
//               const uploadPromises = item.images.map((imageUri) =>
//                 uploadToCloudinary(imageUri)
//               );
//               const uploadResults = await Promise.all(uploadPromises);

//               // Filter successful uploads and get URLs
//               const successfulUploads = uploadResults.filter(
//                 (result) => result.success
//               );
//               const uploadedUrls = successfulUploads.map(
//                 (result) => result.url
//               );

//               // Log any failed uploads
//               const failedUploads = uploadResults.filter(
//                 (result) => !result.success
//               );
//               if (failedUploads.length > 0) {
//                 console.warn(
//                   `Failed to upload ${failedUploads.length} images for item: ${item.name}`
//                 );
//               }

//               return {
//                 ...item,
//                 images: uploadedUrls, // Replace local URIs with Cloudinary URLs
//               };
//             })
//           );

//           return {
//             ...location,
//             items: updatedItems,
//           };
//         })
//       );

//       setUploadingImages(false);
//       return updatedPickupLocations;
//     } catch (error) {
//       setUploadingImages(false);
//       throw error;
//     }
//   };

//   // Helper function to calculate total for a list of items
//   const calculateItemsTotal = (items) => {
//     return items.reduce((sum, item) => {
//       const quantity = parseFloat(item.quantity) || 0;
//       const price = parseFloat(item.price) || 0;
//       return sum + quantity * price;
//     }, 0);
//   };

//   // Calculate the grand total for all locations combined
//   const grandTotal = formData.pickupLocations.reduce((sum, location) => {
//     return sum + calculateItemsTotal(location.items);
//   }, 0);

//   // Handle text input changes
//   const handleChange = (field, value) => {
//     const locationMatch = field.match(/pickupLocations\[(\d+)\]\.(\w+)/);
//     const itemMatch = field.match(
//       /pickupLocations\[(\d+)\]\.items\[(\d+)\]\.(\w+)/
//     );

//     setFormData((prev) => {
//       if (itemMatch) {
//         const locIdx = parseInt(itemMatch[1]);
//         const itemIdx = parseInt(itemMatch[2]);
//         const subField = itemMatch[3];

//         const newPickupLocations = [...prev.pickupLocations];
//         newPickupLocations[locIdx].items[itemIdx] = {
//           ...newPickupLocations[locIdx].items[itemIdx],
//           [subField]: value,
//         };
//         return { ...prev, pickupLocations: newPickupLocations };
//       } else if (locationMatch) {
//         const locIdx = parseInt(locationMatch[1]);
//         const subField = locationMatch[2];

//         const newPickupLocations = [...prev.pickupLocations];
//         newPickupLocations[locIdx] = {
//           ...newPickupLocations[locIdx],
//           [subField]: value,
//         };
//         return { ...prev, pickupLocations: newPickupLocations };
//       } else {
//         return { ...prev, [field]: value };
//       }
//     });
//   };

//   // Add a new pickup location
//   const addPickupLocation = () => {
//     setFormData((prev) => ({
//       ...prev,
//       pickupLocations: [
//         ...prev.pickupLocations,
//         {
//           name: "",
//           address: "",
//           items: [
//             {
//               name: "",
//               description: "",
//               quantity: "",
//               price: "",
//               images: [],
//             },
//           ],
//         },
//       ],
//     }));
//   };

//   // Remove a pickup location
//   const removePickupLocation = (index) => {
//     if (formData.pickupLocations.length <= 1) {
//       Alert.alert("Error", "You must have at least one pickup location");
//       return;
//     }

//     setFormData((prev) => {
//       const newPickupLocations = [...prev.pickupLocations];
//       newPickupLocations.splice(index, 1);
//       return { ...prev, pickupLocations: newPickupLocations };
//     });
//   };

//   // Add a new item to a pickup location
//   const addItem = (locationIndex) => {
//     setFormData((prev) => {
//       const newPickupLocations = [...prev.pickupLocations];
//       newPickupLocations[locationIndex].items.push({
//         name: "",
//         description: "",
//         quantity: "",
//         price: "",
//         images: [],
//       });
//       return { ...prev, pickupLocations: newPickupLocations };
//     });
//   };

//   // Remove an item from a pickup location
//   const removeItem = (locationIndex, itemIndex) => {
//     if (formData.pickupLocations[locationIndex].items.length <= 1) {
//       Alert.alert("Error", "You must have at least one item");
//       return;
//     }

//     setFormData((prev) => {
//       const newPickupLocations = [...prev.pickupLocations];
//       newPickupLocations[locationIndex].items.splice(itemIndex, 1);
//       return { ...prev, pickupLocations: newPickupLocations };
//     });
//   };

//   // Handle image upload
//   const pickImage = async (locationIndex, itemIndex) => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setFormData((prev) => {
//         const newPickupLocations = [...prev.pickupLocations];
//         newPickupLocations[locationIndex].items[itemIndex] = {
//           ...newPickupLocations[locationIndex].items[itemIndex],
//           images: [
//             ...newPickupLocations[locationIndex].items[itemIndex].images,
//             result.assets[0].uri,
//           ],
//         };
//         return { ...prev, pickupLocations: newPickupLocations };
//       });
//     }
//   };

//   // Remove image
//   const removeImage = (locationIndex, itemIndex, imageIndex) => {
//     setFormData((prev) => {
//       const newPickupLocations = [...prev.pickupLocations];
//       const images = [
//         ...newPickupLocations[locationIndex].items[itemIndex].images,
//       ];
//       images.splice(imageIndex, 1);
//       newPickupLocations[locationIndex].items[itemIndex] = {
//         ...newPickupLocations[locationIndex].items[itemIndex],
//         images,
//       };
//       return { ...prev, pickupLocations: newPickupLocations };
//     });
//   };

//   const {
//     mutate: createErrand,
//     isLoading: isCreating,
//     error: creationError,
//   } = useMutateData("api/v1/general/shoping", "POST", "errand");

//   // Handle form submission
//   const handleSubmit = async () => {
//     // Validate form
//     if (!formData.title || !formData.deliveryAddress || !formData.phoneNumber) {
//       Alert.alert(
//         "Error",
//         "Please fill in all required fields including phone number"
//       );
//       return;
//     }

//     // Validate phone number format (basic validation)
//     const phoneRegex = /^[0-9]{10,15}$/;
//     if (!phoneRegex.test(formData.phoneNumber)) {
//       Alert.alert("Error", "Please enter a valid phone number (10-15 digits)");
//       return;
//     }

//     for (let location of formData.pickupLocations) {
//       if (!location.name || !location.address) {
//         Alert.alert("Error", "Please fill in all pickup location fields");
//         return;
//       }

//       for (let item of location.items) {
//         if (!item.name || !item.quantity || !item.price) {
//           Alert.alert(
//             "Error",
//             "Please fill in all item fields including price"
//           );
//           return;
//         }
//         if (
//           isNaN(parseFloat(item.quantity)) ||
//           parseFloat(item.quantity) <= 0
//         ) {
//           Alert.alert(
//             "Error",
//             `Quantity for item '${item.name}' must be a positive number.`
//           );
//           return;
//         }
//         if (isNaN(parseFloat(item.price)) || parseFloat(item.price) < 0) {
//           Alert.alert(
//             "Error",
//             `Price for item '${item.name}' must be a non-negative number.`
//           );
//           return;
//         }
//       }
//     }

//     try {
//       // Upload all images first
//       const updatedPickupLocations = await uploadAllImages();

//       const submissionData = {
//         title: formData.title,
//         deliveryAddress: formData.deliveryAddress,
//         description: formData.description,
//         phoneNumber: formData.phoneNumber,
//         isWithinEstate: formData.isWithinEstate, // Include the toggle value
//         pickupLocations: updatedPickupLocations.map((location) => ({
//           name: location.name,
//           address: location.address,
//           items: location.items.map((item) => ({
//             name: item.name,
//             description: item.description,
//             quantity: parseFloat(item.quantity),
//             price: parseFloat(item.price),
//             images: item.images,
//           })),
//         })),
//       };

//       console.log("Submission data with Cloudinary URLs:", submissionData);

//       // Call the mutation
//       createErrand(submissionData, {
//         onSuccess: (data) => {
//           Alert.alert("Success", "Errand created successfully!");
//           navigation.goBack();
//         },
//         onError: (error) => {
//           console.error("Creation Error:", error?.response);
//           Alert.alert(
//             "Error",
//             error.message ||
//               error.response?.data?.message ||
//               "Failed to create errand"
//           );
//         },
//       });
//     } catch (error) {
//       console.error("Image upload error:", error);
//       Alert.alert("Error", "Failed to upload images. Please try again.");
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {/* Basic Information */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Basic Information </Text>

//         <TextInput
//           style={styles.input}
//           placeholder="Title (e.g. Grocery Run)"
//           value={formData.title}
//           onChangeText={(text) => handleChange("title", text)}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Delivery Address"
//           value={formData.deliveryAddress}
//           onChangeText={(text) => handleChange("deliveryAddress", text)}
//         />

//         <TextInput
//           style={styles.input}
//           placeholder="Phone Number"
//           value={formData.phoneNumber}
//           onChangeText={(text) => handleChange("phoneNumber", text)}
//           keyboardType="phone-pad"
//         />

//         <TextInput
//           style={[styles.input, { height: 80 }]}
//           placeholder="Description"
//           multiline
//           value={formData.description}
//           onChangeText={(text) => handleChange("description", text)}
//         />
//         <View style={styles.toggleContainer}>
//           <Text style={styles.toggleLabel}>
//             Errand Inside your Estate ? (₦500 fee)
//           </Text>
//           <Switch
//             value={formData.isWithinEstate}
//             onValueChange={(value) => handleChange("isWithinEstate", value)}
//             trackColor={{ false: "#767577", true: "#81b0ff" }}
//             thumbColor={formData.isWithinEstate ? "#005091" : "#f4f3f4"}
//           />
//         </View>
//         <Text style={styles.deliveryFeeText}>
//           Delivery Fee: ₦{formData.isWithinEstate ? "500" : "1000"}
//         </Text>
//       </View>

//       {/* Pickup Locations */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Pickup Locations</Text>

//         {formData.pickupLocations.map((location, locationIndex) => (
//           <View key={locationIndex} style={styles.locationCard}>
//             <View style={styles.locationHeader}>
//               <Text style={styles.locationTitle}>
//                 Pickup Location #{locationIndex + 1}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => removePickupLocation(locationIndex)}
//               >
//                 <Ionicons name="trash-outline" size={20} color="#FF3B30" />
//               </TouchableOpacity>
//             </View>

//             <TextInput
//               style={styles.input}
//               placeholder="Location Name (e.g. Market Pickup)"
//               value={location.name}
//               onChangeText={(text) =>
//                 handleChange(`pickupLocations[${locationIndex}].name`, text)
//               }
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Address"
//               value={location.address}
//               onChangeText={(text) =>
//                 handleChange(`pickupLocations[${locationIndex}].address`, text)
//               }
//             />

//             <Text style={styles.itemsTitle}>Items</Text>

//             {location.items.map((item, itemIndex) => (
//               <View key={itemIndex} style={styles.itemCard}>
//                 <View style={styles.itemHeader}>
//                   <Text style={styles.itemNumber}>Item #{itemIndex + 1}</Text>
//                   <TouchableOpacity
//                     onPress={() => removeItem(locationIndex, itemIndex)}
//                   >
//                     <Ionicons
//                       name="close-circle-outline"
//                       size={20}
//                       color="#FF3B30"
//                     />
//                   </TouchableOpacity>
//                 </View>

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Item Name"
//                   value={item.name}
//                   onChangeText={(text) =>
//                     handleChange(
//                       `pickupLocations[${locationIndex}].items[${itemIndex}].name`,
//                       text
//                     )
//                   }
//                 />

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Description"
//                   value={item.description}
//                   onChangeText={(text) =>
//                     handleChange(
//                       `pickupLocations[${locationIndex}].items[${itemIndex}].description`,
//                       text
//                     )
//                   }
//                 />

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Quantity"
//                   keyboardType="numeric"
//                   value={String(item.quantity)}
//                   onChangeText={(text) =>
//                     handleChange(
//                       `pickupLocations[${locationIndex}].items[${itemIndex}].quantity`,
//                       text
//                     )
//                   }
//                 />

//                 <TextInput
//                   style={styles.input}
//                   placeholder="Price per unit (e.g., 10.50)"
//                   keyboardType="numeric"
//                   value={String(item.price)}
//                   onChangeText={(text) =>
//                     handleChange(
//                       `pickupLocations[${locationIndex}].items[${itemIndex}].price`,
//                       text
//                     )
//                   }
//                 />

//                 {/* Display total price for the item */}
//                 {item.quantity && item.price ? (
//                   <Text style={styles.itemTotalPrice}>
//                     Item Total: ₦
//                     {(
//                       parseFloat(item.quantity) * parseFloat(item.price)
//                     ).toFixed(2)}
//                   </Text>
//                 ) : null}

//                 <TouchableOpacity
//                   style={styles.imageButton}
//                   onPress={() => pickImage(locationIndex, itemIndex)}
//                 >
//                   <Text style={styles.imageButtonText}>Add Image</Text>
//                 </TouchableOpacity>

//                 {item.images.length > 0 && (
//                   <View style={styles.imagePreviewContainer}>
//                     {item.images.map((imageUri, imgIndex) => (
//                       <View key={imgIndex} style={styles.imageWrapper}>
//                         <Image
//                           source={{ uri: imageUri }}
//                           style={styles.imagePreview}
//                         />
//                         <TouchableOpacity
//                           style={styles.removeImageButton}
//                           onPress={() =>
//                             removeImage(locationIndex, itemIndex, imgIndex)
//                           }
//                         >
//                           <Ionicons
//                             name="close-circle"
//                             size={20}
//                             color="#FF3B30"
//                           />
//                         </TouchableOpacity>
//                       </View>
//                     ))}
//                   </View>
//                 )}
//               </View>
//             ))}

//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={() => addItem(locationIndex)}
//             >
//               <Text style={styles.addButtonText}>+ Add Item</Text>
//             </TouchableOpacity>

//             {/* Total price for this location */}
//             <Text style={styles.locationTotal}>
//               Location Total: ₦{calculateItemsTotal(location.items).toFixed(2)}
//             </Text>
//           </View>
//         ))}

//         <TouchableOpacity
//           style={styles.addLocationButton}
//           onPress={addPickupLocation}
//         >
//           <Text style={styles.addLocationButtonText}>
//             + Add Pickup Location
//           </Text>
//         </TouchableOpacity>
//       </View>

//       <View>
//         <Text style={{}}>
//           {/* <Text style={{}}>Service Charge:</Text> ₦ 0.00 */}
//           <Text style={styles.feeLabel}>Service Charge:</Text> ₦0.00
//         </Text>

//         <Text style={{}}>
//           {/* <Text style={{}}>Delivery Charge:</Text> ₦ 500.00 */}

//           <Text style={styles.feeText}>
//             <Text style={styles.feeLabel}>Delivery Charge:</Text>₦
//             {formData.isWithinEstate ? "500.00" : "1000.00"}
//           </Text>
//         </Text>
//       </View>

//       {/* Grand Total for all locations */}
//       <View style={styles.grandTotalContainer}>
//         {/* <Text style={styles.grandTotalText}>
//             Grand Total for Errand: ₦{(grandTotal + 500.0).toFixed(2)}
//           </Text> */}
//         <Text style={styles.grandTotalText}>
//           Grand Total for Errand: ₦
//           {(grandTotal + (formData.isWithinEstate ? 500 : 1000)).toFixed(2)}
//         </Text>
//       </View>

//       {/* Submit Button */}
//       <TouchableOpacity
//         style={[
//           styles.submitButton,
//           (isCreating || uploadingImages) && styles.disabledButton,
//         ]}
//         onPress={handleSubmit}
//         disabled={isCreating || uploadingImages}
//       >
//         {uploadingImages ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="small" color="#FFF" />
//             <Text style={styles.submitButtonText}>Uploading Images...</Text>
//           </View>
//         ) : (
//           <Text style={styles.submitButtonText}>
//             {isCreating ? "Creating Errand..." : "Create Errand"}
//           </Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F5F5F5",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#333",
//   },
//   section: {
//     marginBottom: 25,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 15,
//     color: "#444",
//   },
//   input: {
//     backgroundColor: "#FFF",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 15,
//     borderWidth: 1,
//     borderColor: "#DDD",
//   },
//   locationCard: {
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: "#EEE",
//   },
//   locationHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   locationTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#555",
//   },
//   itemsTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//     color: "#555",
//   },
//   itemCard: {
//     backgroundColor: "#F9F9F9",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 15,
//   },
//   itemHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   itemNumber: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#666",
//   },
//   itemTotalPrice: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#007BFF",
//     marginTop: -5,
//     marginBottom: 10,
//     textAlign: "right",
//     paddingRight: 5,
//   },
//   locationTotal: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#28A745",
//     marginTop: 15,
//     paddingTop: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#EEE",
//     textAlign: "right",
//   },
//   grandTotalContainer: {
//     backgroundColor: "#E0F7FA",
//     padding: 20,
//     borderRadius: 10,
//     marginTop: 20,
//     marginBottom: 30,
//     borderWidth: 1,
//     borderColor: "#B3E5FC",
//     alignItems: "center",
//   },
//   grandTotalText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#00796B",
//   },
//   imageButton: {
//     backgroundColor: "#E3F2FD",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   imageButtonText: {
//     color: "#1976D2",
//     fontWeight: "bold",
//   },
//   imagePreviewContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 10,
//   },
//   imageWrapper: {
//     position: "relative",
//     marginRight: 10,
//     marginBottom: 10,
//   },
//   imagePreview: {
//     width: 80,
//     height: 80,
//     borderRadius: 8,
//   },
//   removeImageButton: {
//     position: "absolute",
//     top: -8,
//     right: -8,
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//   },
//   addButton: {
//     backgroundColor: "#E8F5E9",
//     padding: 12,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: "#388E3C",
//     fontWeight: "bold",
//   },
//   addLocationButton: {
//     backgroundColor: "#E3F2FD",
//     padding: 15,
//     borderRadius: 8,
//     alignItems: "center",
//     marginTop: 10,
//   },
//   addLocationButtonText: {
//     color: "#1976D2",
//     fontWeight: "bold",
//   },
//   submitButton: {
//     backgroundColor: "#4CAF50",
//     padding: 18,
//     borderRadius: 8,
//     alignItems: "center",
//     marginVertical: 20,
//   },
//   disabledButton: {
//     backgroundColor: "#A5D6A7",
//   },
//   submitButtonText: {
//     color: "#FFF",
//     fontWeight: "bold",
//     fontSize: 16,
//   },
//   loadingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },

//   toggleContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 15,
//     padding: 12,
//     backgroundColor: "#FFF",
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: "#DDD",
//   },
//   toggleLabel: {
//     fontSize: 16,
//     color: "#555",
//     flex: 1,
//   },
//   deliveryFeeText: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#005091",
//     marginLeft: 10,
//   },
//   feeText: {
//     fontSize: 16,
//     marginBottom: 5,
//     color: "#555",
//   },
//   feeLabel: {
//     fontWeight: "bold",
//   },
// });

// // import { View, Text } from 'react-native'
// // import React from 'react'

// export default function CreateErrandScreen() {
//   const navigation = useNavigation();

//   const [selected, setSelected] = useState("shopping");
//   return (
//     <ScreenWrapper
//       title="Create Errand"
//       navigation={navigation}
//       headerStyle={{
//         backgroundColor: "white",
//       }}
//     >
//       <View
//         style={{
//           flex: 1,
//           padding: 20,
//         }}
//       >
//         {/* Buttons Row */}
//         <View
//           style={{
//             flexDirection: "row",
//             justifyContent: "space-between",
//             gap: 12, // for spacing (works in RN 0.71+), else use margin
//           }}
//         >
//           {/* Shopping Button */}
//           <TouchableOpacity
//             onPress={() => setSelected("shopping")}
//             style={{
//               flex: 1,
//               paddingVertical: 14,
//               backgroundColor: selected === "shopping" ? "green" : "lightgray",
//               borderRadius: 8,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
//               Shopping
//             </Text>
//           </TouchableOpacity>

//           {/* Pickup Button */}
//           <TouchableOpacity
//             onPress={() => setSelected("pickup")}
//             style={{
//               flex: 1,
//               paddingVertical: 14,
//               backgroundColor: selected === "pickup" ? "blue" : "lightgray",
//               borderRadius: 8,
//               alignItems: "center",
//             }}
//           >
//             <Text style={{ fontSize: 16, color: "#fff", fontWeight: "600" }}>
//               Pickup
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Show Selected */}
//         {selected && (
//           <View
//             style={{
//               flex: 1,
//             }}
//           >
//             {selected === "shopping" && <ShoppingCreateErrandScreen />}
//             {selected === "pickup" && <PickupErrandScreen />}
//           </View>
//         )}
//       </View>
//     </ScreenWrapper>
//   );
// }

// {
//   /* // export default CreateErrandScreen; */
// }

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMutateData } from "../../hooks/Request";
import ScreenWrapper from "../shared/ScreenWrapper";
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

  // Cloudinary configuration
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

              const uploadPromises = item.images.map((imageUri) =>
                uploadToCloudinary(imageUri)
              );
              const uploadResults = await Promise.all(uploadPromises);

              const successfulUploads = uploadResults.filter(
                (result) => result.success
              );
              const uploadedUrls = successfulUploads.map(
                (result) => result.url
              );

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
                images: uploadedUrls,
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

    // Validate phone number format
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
        isWithinEstate: formData.isWithinEstate,
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
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Basic Information Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color="#10B981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sectionTitle}>Basic Information</Text>
        </View>

        <Text style={styles.inputLabel}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Grocery Run"
          value={formData.title}
          onChangeText={(text) => handleChange("title", text)}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.inputLabel}>Delivery Address *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter delivery address"
          value={formData.deliveryAddress}
          onChangeText={(text) => handleChange("deliveryAddress", text)}
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.inputLabel}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChangeText={(text) => handleChange("phoneNumber", text)}
          keyboardType="phone-pad"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.inputLabel}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any additional details..."
          multiline
          numberOfLines={4}
          value={formData.description}
          onChangeText={(text) => handleChange("description", text)}
          placeholderTextColor="#9CA3AF"
          textAlignVertical="top"
        />

        {/* Within Estate Toggle */}
        <View style={styles.toggleContainer}>
          <View style={styles.toggleLeft}>
            <MaterialCommunityIcons
              name="home-city"
              size={20}
              color="#6B7280"
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Within Estate</Text>
              <Text style={styles.toggleSubtext}>
                ₦{formData.isWithinEstate ? "500" : "1000"} delivery fee
              </Text>
            </View>
          </View>
          <Switch
            value={formData.isWithinEstate}
            onValueChange={(value) => handleChange("isWithinEstate", value)}
            trackColor={{ false: "#E5E7EB", true: "#D1FAE5" }}
            thumbColor={formData.isWithinEstate ? "#10B981" : "#9CA3AF"}
          />
        </View>
      </View>

      {/* Pickup Locations */}
      {formData.pickupLocations.map((location, locationIndex) => (
        <View key={locationIndex} style={styles.locationCard}>
          {/* Location Header */}
          <View style={styles.locationCardHeader}>
            <View style={styles.locationHeaderLeft}>
              <View style={styles.locationIconContainer}>
                <MaterialCommunityIcons
                  name="store-marker"
                  size={20}
                  color="#3B82F6"
                />
              </View>
              <Text style={styles.locationCardTitle}>
                Pickup Location #{locationIndex + 1}
              </Text>
            </View>
            {formData.pickupLocations.length > 1 && (
              <TouchableOpacity
                onPress={() => removePickupLocation(locationIndex)}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color="#DC2626"
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.inputLabel}>Location Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Market Pickup"
            value={location.name}
            onChangeText={(text) =>
              handleChange(`pickupLocations[${locationIndex}].name`, text)
            }
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Address *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter pickup address"
            value={location.address}
            onChangeText={(text) =>
              handleChange(`pickupLocations[${locationIndex}].address`, text)
            }
            placeholderTextColor="#9CA3AF"
          />

          {/* Items Section */}
          <View style={styles.itemsHeader}>
            <MaterialCommunityIcons
              name="package-variant"
              size={18}
              color="#6B7280"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.itemsHeaderText}>Items</Text>
          </View>

          {location.items.map((item, itemIndex) => (
            <View key={itemIndex} style={styles.itemCard}>
              <View style={styles.itemCardHeader}>
                <Text style={styles.itemNumber}>Item #{itemIndex + 1}</Text>
                {location.items.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeItem(locationIndex, itemIndex)}
                  >
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#DC2626"
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.inputLabel}>Item Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter item name"
                value={item.name}
                onChangeText={(text) =>
                  handleChange(
                    `pickupLocations[${locationIndex}].items[${itemIndex}].name`,
                    text
                  )
                }
                placeholderTextColor="#9CA3AF"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Item description (optional)"
                value={item.description}
                onChangeText={(text) =>
                  handleChange(
                    `pickupLocations[${locationIndex}].items[${itemIndex}].description`,
                    text
                  )
                }
                placeholderTextColor="#9CA3AF"
              />

              <View style={styles.rowInputs}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Quantity *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    keyboardType="numeric"
                    value={String(item.quantity)}
                    onChangeText={(text) =>
                      handleChange(
                        `pickupLocations[${locationIndex}].items[${itemIndex}].quantity`,
                        text
                      )
                    }
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>Price (₦) *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={String(item.price)}
                    onChangeText={(text) =>
                      handleChange(
                        `pickupLocations[${locationIndex}].items[${itemIndex}].price`,
                        text
                      )
                    }
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Item Total Price */}
              {item.quantity && item.price ? (
                <View style={styles.itemTotalContainer}>
                  <Text style={styles.itemTotalLabel}>Item Total:</Text>
                  <Text style={styles.itemTotalPrice}>
                    ₦
                    {(
                      parseFloat(item.quantity) * parseFloat(item.price)
                    ).toFixed(2)}
                  </Text>
                </View>
              ) : null}

              {/* Image Upload */}
              <TouchableOpacity
                style={styles.imageUploadButton}
                onPress={() => pickImage(locationIndex, itemIndex)}
              >
                <MaterialCommunityIcons
                  name="image-plus"
                  size={20}
                  color="#3B82F6"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.imageUploadText}>Add Image</Text>
              </TouchableOpacity>

              {/* Image Preview */}
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
                        <MaterialCommunityIcons
                          name="close-circle"
                          size={22}
                          color="#DC2626"
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Add Item Button */}
          <TouchableOpacity
            style={styles.addItemButton}
            onPress={() => addItem(locationIndex)}
          >
            <MaterialCommunityIcons
              name="plus-circle"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.addItemText}>Add Item</Text>
          </TouchableOpacity>

          {/* Location Total */}
          <View style={styles.locationTotalContainer}>
            <Text style={styles.locationTotalLabel}>Location Total:</Text>
            <Text style={styles.locationTotalPrice}>
              ₦{calculateItemsTotal(location.items).toFixed(2)}
            </Text>
          </View>
        </View>
      ))}

      {/* Add Pickup Location Button */}
      <TouchableOpacity
        style={styles.addLocationButton}
        onPress={addPickupLocation}
      >
        <MaterialCommunityIcons
          name="map-marker-plus"
          size={22}
          color="#FFFFFF"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.addLocationText}>Add Pickup Location</Text>
      </TouchableOpacity>

      {/* Financial Summary Card */}
      <View style={styles.summaryCard}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="calculator"
            size={20}
            color="#10B981"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.sectionTitle}>Summary</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>₦{grandTotal.toFixed(2)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Service Charge</Text>
          <Text style={styles.summaryValue}>₦0.00</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>
            ₦{formData.isWithinEstate ? "500.00" : "1000.00"}
          </Text>
        </View>

        <View style={styles.summaryDivider} />

        <View style={styles.summaryRow}>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.grandTotalValue}>
            ₦{(grandTotal + (formData.isWithinEstate ? 500 : 1000)).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          (isCreating || uploadingImages) && styles.submitButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isCreating || uploadingImages}
        activeOpacity={0.8}
      >
        {uploadingImages ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text style={styles.submitButtonText}>Uploading Images...</Text>
          </View>
        ) : (
          <>
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.submitButtonText}>
              {isCreating ? "Creating Errand..." : "Create Errand"}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

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
      <View style={styles.container}>
        {/* Tab Buttons */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            onPress={() => setSelected("shopping")}
            style={[
              styles.tabButton,
              selected === "shopping" && styles.tabButtonActive,
            ]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="cart"
              size={20}
              color={selected === "shopping" ? "#FFFFFF" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                selected === "shopping" && styles.tabTextActive,
              ]}
            >
              Shopping
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setSelected("pickup")}
            style={[
              styles.tabButton,
              selected === "pickup" && styles.tabButtonActiveBlue,
            ]}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="package-variant"
              size={20}
              color={selected === "pickup" ? "#FFFFFF" : "#6B7280"}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.tabText,
                selected === "pickup" && styles.tabTextActive,
              ]}
            >
              Pickup
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {selected === "shopping" && <ShoppingCreateErrandScreen />}
          {selected === "pickup" && <PickupErrandScreen />}
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  tabContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  tabButtonActive: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  tabButtonActiveBlue: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  tabTextActive: {
    color: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    marginTop: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  toggleSubtext: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  locationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  locationCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  locationHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  itemsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  itemsHeaderText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  itemCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  itemCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemNumber: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    letterSpacing: 0.3,
  },
  rowInputs: {
    flexDirection: "row",
  },
  itemTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  itemTotalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#065F46",
  },
  itemTotalPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.3,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  imageUploadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  imagePreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageWrapper: {
    position: "relative",
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
  },
  addItemButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1FAE5",
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  addItemText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
  },
  locationTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  locationTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  locationTotalPrice: {
    fontSize: 17,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  addLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addLocationText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
