// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   StyleSheet,
//   Switch,
//   Image,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { formdatauseMutateData } from "../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";

// const PickupErrandScreen = () => {
//   const navigation = useNavigation();

//   const [title, setTitle] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [pickUpAddress, setPickUpAddress] = useState("");
//   const [isWithinEstate, setIsWithinEstate] = useState(false);
//   const [description, setDescription] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [images, setImages] = useState([]);

//   const { userProfile_data } = useSelector((state) => state.ProfileSlice);

//   console.log({
//     ffl: userProfile_data?.currentClanMeeting,
//   });

//   // Use mutation hook
//   const { mutate, isLoading } = formdatauseMutateData(
//     "api/v1/general/pickUp",
//     "POST",
//     "errands"
//   );

//   const pickImages = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsMultipleSelection: true,
//       quality: 0.7,
//     });

//     if (!result.canceled) {
//       const selected = result.assets.map((asset) => ({
//         uri: asset.uri,
//         name: asset.uri.split("/").pop(),
//         type: "image/jpeg",
//       }));
//       setImages([...images, ...selected]);
//     }
//   };

//   const handleSubmit = () => {
//     if (!title || !deliveryAddress || !pickUpAddress || !phoneNumber) {
//       Alert.alert("Error", "Please fill in all required fields");
//       return;
//     }

//     const withinEstateValue = isWithinEstate.toString();

//     console.log({
//       fff: images,
//       title,
//       deliveryAddress,
//       pickUpAddress,
//       withinEstateValue,
//       description,
//       phoneNumber,
//     });

//     const formData = new FormData();
//     formData.append("title", title);
//     formData.append("deliveryAddress", deliveryAddress);
//     formData.append("pickUpAddress", pickUpAddress);
//     formData.append("isWithinEstate", withinEstateValue);
//     formData.append("description", description);
//     formData.append("phoneNumber", phoneNumber);

//     console.log({
//       fff: images,
//     });

//     images.forEach((img, index) => {
//       formData.append("images", {
//         uri: img.uri,
//         type: img.type || "image/jpeg",
//         name: img.name || `image_${index}.jpg`,
//       });
//     });

//     mutate(formData, {
//       onSuccess: () => {
//         Alert.alert("Success", "Pickup Errand created successfully!", [
//           {
//             text: "OK",
//             onPress: () => navigation.goBack(),
//           },
//         ]);
//         setTitle("");
//         setDeliveryAddress("");
//         setPickUpAddress("");
//         setDescription("");
//         setPhoneNumber("");
//         setImages([]);
//       },
//       onError: (err) => {
//         Alert.alert("Error", err.message || "Failed to create pickup errand");
//       },
//     });
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
//     >
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         {userProfile_data?.currentClanMeeting && (
//           <View
//             style={{
//               backgroundColor: "#f2f6ff",
//               padding: 12,
//               borderRadius: 8,
//               marginBottom: 16,
//             }}
//           >
//             <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 4 }}>
//               Estate: {userProfile_data?.currentClanMeeting.name}
//             </Text>
//             <Text style={{ color: "#555" }}>
//               Code: {userProfile_data?.currentClanMeeting.uniqueClanID}
//             </Text>
//             <Text style={{ color: "#00796b", fontWeight: "600" }}>
//               You can select within estate if pickup is within your estate.
//             </Text>
//           </View>
//         )}

//         <Text style={styles.label}>Title *</Text>
//         <TextInput style={styles.input} value={title} onChangeText={setTitle} />

//         <Text style={styles.label}>Pickup Address *</Text>
//         <TextInput
//           style={styles.input}
//           value={pickUpAddress}
//           onChangeText={setPickUpAddress}
//         />

//         <Text style={styles.label}>Delivery Address *</Text>
//         <TextInput
//           style={styles.input}
//           value={deliveryAddress}
//           onChangeText={setDeliveryAddress}
//         />

//         {userProfile_data?.currentClanMeeting && (
//           <>
//             <Text style={styles.toggleLabel}>
//               Errand Inside your Estate ? (₦500 fee)
//             </Text>

//             <View style={styles.switchRow}>
//               <Text style={styles.label}>Is within estate?</Text>
//               <Switch
//                 value={isWithinEstate}
//                 onValueChange={setIsWithinEstate}
//               />
//             </View>
//           </>
//         )}

//         <Text style={styles.label}>Phone Number *</Text>
//         <TextInput
//           style={styles.input}
//           value={phoneNumber}
//           onChangeText={setPhoneNumber}
//           keyboardType="phone-pad"
//         />

//         <Text style={styles.label}>Description</Text>
//         <TextInput
//           style={[styles.input, { height: 100 }]}
//           value={description}
//           onChangeText={setDescription}
//           multiline
//         />

//         <Text style={styles.label}>Upload Images</Text>
//         <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
//           <Text style={styles.uploadText}>+ Pick Images</Text>
//         </TouchableOpacity>

//         <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//           {images.map((img, index) => (
//             <Image
//               key={index}
//               source={{ uri: img.uri }}
//               style={{ width: 80, height: 80, marginRight: 8, borderRadius: 8 }}
//             />
//           ))}
//         </ScrollView>

//         <Text
//           style={{
//             fontSize: 18,
//             fontWeight: "700",
//             marginTop: 10,
//             color: "#000",
//           }}
//         >
//           Total Delivery Fee: ₦{isWithinEstate ? "500" : "1000"}
//         </Text>

//         <TouchableOpacity
//           style={[styles.submitBtn, { opacity: isLoading ? 0.6 : 1 }]}
//           onPress={handleSubmit}
//           disabled={isLoading}
//         >
//           <Text style={styles.submitText}>
//             {isLoading ? "Submitting..." : "Create Pickup Errand"}
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// export default PickupErrandScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   scrollContent: {
//     padding: 16,
//     paddingBottom: 50, // Extra padding at bottom
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 6,
//   },
//   toggleLabel: {
//     fontSize: 16,
//     fontWeight: "500",
//     marginBottom: 6,
//     color: "#00796b",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//   },
//   switchRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     justifyContent: "space-between",
//   },
//   uploadBtn: {
//     backgroundColor: "#f0f0f0",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//     alignItems: "center",
//   },
//   uploadText: {
//     color: "#333",
//     fontWeight: "600",
//   },
//   submitBtn: {
//     backgroundColor: "green",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   submitText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "700",
//   },
// });

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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { formdatauseMutateData } from "../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const PickupErrandScreen = () => {
  const navigation = useNavigation();

  const [title, setTitle] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pickUpAddress, setPickUpAddress] = useState("");
  const [isWithinEstate, setIsWithinEstate] = useState(false);
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [images, setImages] = useState([]);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

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

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleSubmit = () => {
    if (!title || !deliveryAddress || !pickUpAddress || !phoneNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const withinEstateValue = isWithinEstate.toString();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("deliveryAddress", deliveryAddress);
    formData.append("pickUpAddress", pickUpAddress);
    formData.append("isWithinEstate", withinEstateValue);
    formData.append("description", description);
    formData.append("phoneNumber", phoneNumber);

    images.forEach((img, index) => {
      formData.append("images", {
        uri: img.uri,
        type: img.type || "image/jpeg",
        name: img.name || `image_${index}.jpg`,
      });
    });

    mutate(formData, {
      onSuccess: () => {
        Alert.alert("Success", "Pickup Errand created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
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

  const deliveryFee = isWithinEstate ? 500 : 1000;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Estate Info Banner */}
        {userProfile_data?.currentClanMeeting && (
          <View style={styles.estateBanner}>
            <View style={styles.estateBannerIcon}>
              <MaterialCommunityIcons
                name="home-city"
                size={20}
                color="#3B82F6"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.estateBannerTitle}>
                {userProfile_data?.currentClanMeeting.name}
              </Text>
              <Text style={styles.estateBannerCode}>
                Code: {userProfile_data?.currentClanMeeting.uniqueClanID}
              </Text>
              <Text style={styles.estateBannerHint}>
                Select "Within Estate" if pickup is in your estate
              </Text>
            </View>
          </View>
        )}

        {/* Basic Information Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Pickup Details</Text>
          </View>

          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Package from Friend"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Pickup Address *</Text>
          <TextInput
            style={styles.input}
            value={pickUpAddress}
            onChangeText={setPickUpAddress}
            placeholder="Enter pickup location"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Delivery Address *</Text>
          <TextInput
            style={styles.input}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder="Enter delivery address"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Phone Number *</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Add any additional details..."
            placeholderTextColor="#9CA3AF"
            textAlignVertical="top"
          />

          {/* Within Estate Toggle */}
          {userProfile_data?.currentClanMeeting && (
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
                    ₦{deliveryFee} delivery fee
                  </Text>
                </View>
              </View>
              <Switch
                value={isWithinEstate}
                onValueChange={setIsWithinEstate}
                trackColor={{ false: "#E5E7EB", true: "#D1FAE5" }}
                thumbColor={isWithinEstate ? "#10B981" : "#9CA3AF"}
              />
            </View>
          )}
        </View>

        {/* Images Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="image-multiple"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Item Images</Text>
          </View>

          <TouchableOpacity
            style={styles.imageUploadButton}
            onPress={pickImages}
          >
            <MaterialCommunityIcons
              name="image-plus"
              size={24}
              color="#3B82F6"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.imageUploadText}>Add Images</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imageGridContainer}>
              {images.map((img, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: img.uri }}
                    style={styles.imagePreview}
                  />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removeImage(index)}
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

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="calculator"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Delivery Fee</Text>
          </View>

          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Total Delivery Fee</Text>
            <Text style={styles.feeValue}>₦{deliveryFee}</Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color="#FFFFFF"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitButtonText}>
            {isLoading ? "Creating..." : "Create Pickup Errand"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PickupErrandScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  estateBanner: {
    flexDirection: "row",
    backgroundColor: "#DBEAFE",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
  },
  estateBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  estateBannerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  estateBannerCode: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  estateBannerHint: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
  sectionCard: {
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
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DBEAFE",
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  imageUploadText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B82F6",
    letterSpacing: 0.3,
  },
  imageGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
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
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  feeValue: {
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
});
