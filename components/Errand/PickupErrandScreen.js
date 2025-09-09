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
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { formdatauseMutateData } from "../../hooks/Request";
// import { useNavigation } from "@react-navigation/native";
// import { useSelector } from "react-redux";
// // import { useMutateData } from "../hooks/api"; // 👈 adjust path

// // formdataapiRequest

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

//     const withinEstateValue = isWithinEstate.toString(); // "true" or "false"

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
//         type: img.type || "image/jpeg", // make sure type exists
//         name: img.name || `image_${index}.jpg`,
//       });
//     });

//     mutate(formData, {
//       onSuccess: () => {
//         Alert.alert("Success", "Pickup Errand created successfully!", [
//           {
//             text: "OK",
//             onPress: () => navigation.goBack(), // navigate back
//           },
//         ]);
//         // Alert.alert("Success", "Pickup Errand created successfully!");
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
//     <ScrollView style={styles.container}>
//       {userProfile_data?.currentClanMeeting && (
//         <View
//           style={{
//             backgroundColor: "#f2f6ff",
//             padding: 12,
//             borderRadius: 8,
//             marginBottom: 16,
//           }}
//         >
//           <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 4 }}>
//             Estate: {userProfile_data?.currentClanMeeting.name}
//           </Text>
//           <Text style={{ color: "#555" }}>
//             Code: {userProfile_data?.currentClanMeeting.uniqueClanID}
//           </Text>
//           <Text style={{ color: "#00796b", fontWeight: "600" }}>
//             You can select within estate if pickup is within your estate.
//           </Text>
//         </View>
//       )}

//       <Text style={styles.label}>Title *</Text>
//       <TextInput style={styles.input} value={title} onChangeText={setTitle} />

//       <Text style={styles.label}>Pickup Address *</Text>
//       <TextInput
//         style={styles.input}
//         value={pickUpAddress}
//         onChangeText={setPickUpAddress}
//       />

//       <Text style={styles.label}>Delivery Address *</Text>
//       <TextInput
//         style={styles.input}
//         value={deliveryAddress}
//         onChangeText={setDeliveryAddress}
//       />
//       {userProfile_data?.currentClanMeeting && (
//         <>
//           <Text style={styles.toggleLabel}>
//             Errand Inside your Estate ? (₦500 fee)
//           </Text>

//           <View style={styles.switchRow}>
//             <Text style={styles.label}>Is within estate?</Text>
//             <Switch value={isWithinEstate} onValueChange={setIsWithinEstate} />
//           </View>
//         </>
//       )}

//       <Text style={styles.label}>Description</Text>
//       <TextInput
//         style={[styles.input, { height: 100 }]}
//         value={description}
//         onChangeText={setDescription}
//         multiline
//       />

//       <Text style={styles.label}>Phone Number *</Text>
//       <TextInput
//         style={styles.input}
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         keyboardType="phone-pad"
//       />

//       <Text style={styles.label}>Upload Images</Text>
//       <TouchableOpacity style={styles.uploadBtn} onPress={pickImages}>
//         <Text style={styles.uploadText}>+ Pick Images</Text>
//       </TouchableOpacity>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         {images.map((img, index) => (
//           <Image
//             key={index}
//             source={{ uri: img.uri }}
//             style={{ width: 80, height: 80, marginRight: 8, borderRadius: 8 }}
//           />
//         ))}
//       </ScrollView>

//       <Text
//         style={{
//           fontSize: 18,
//           fontWeight: "700",
//           marginTop: 10,
//           color: "#000",
//         }}
//       >
//         Total Delivery Fee: ₦{isWithinEstate ? "500" : "1000"}
//       </Text>

//       <TouchableOpacity
//         style={[styles.submitBtn, { opacity: isLoading ? 0.6 : 1 }]}
//         onPress={handleSubmit}
//         disabled={isLoading}
//       >
//         <Text style={styles.submitText}>
//           {isLoading ? "Submitting..." : "Create Pickup Errand"}
//         </Text>
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// export default PickupErrandScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#fff" },
//   label: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
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
//   uploadText: { color: "#333", fontWeight: "600" },
//   submitBtn: {
//     backgroundColor: "green",
//     padding: 16,
//     borderRadius: 8,
//     marginTop: 20,
//     alignItems: "center",
//   },
//   submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
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

  console.log({
    ffl: userProfile_data?.currentClanMeeting,
  });

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

    const withinEstateValue = isWithinEstate.toString();

    console.log({
      fff: images,
      title,
      deliveryAddress,
      pickUpAddress,
      withinEstateValue,
      description,
      phoneNumber,
    });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("deliveryAddress", deliveryAddress);
    formData.append("pickUpAddress", pickUpAddress);
    formData.append("isWithinEstate", withinEstateValue);
    formData.append("description", description);
    formData.append("phoneNumber", phoneNumber);

    console.log({
      fff: images,
    });

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

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {userProfile_data?.currentClanMeeting && (
          <View
            style={{
              backgroundColor: "#f2f6ff",
              padding: 12,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 4 }}>
              Estate: {userProfile_data?.currentClanMeeting.name}
            </Text>
            <Text style={{ color: "#555" }}>
              Code: {userProfile_data?.currentClanMeeting.uniqueClanID}
            </Text>
            <Text style={{ color: "#00796b", fontWeight: "600" }}>
              You can select within estate if pickup is within your estate.
            </Text>
          </View>
        )}

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

        {userProfile_data?.currentClanMeeting && (
          <>
            <Text style={styles.toggleLabel}>
              Errand Inside your Estate ? (₦500 fee)
            </Text>

            <View style={styles.switchRow}>
              <Text style={styles.label}>Is within estate?</Text>
              <Switch
                value={isWithinEstate}
                onValueChange={setIsWithinEstate}
              />
            </View>
          </>
        )}

        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
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

        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            marginTop: 10,
            color: "#000",
          }}
        >
          Total Delivery Fee: ₦{isWithinEstate ? "500" : "1000"}
        </Text>

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
    </KeyboardAvoidingView>
  );
};

export default PickupErrandScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 50, // Extra padding at bottom
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 6,
    color: "#00796b",
  },
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
  uploadText: {
    color: "#333",
    fontWeight: "600",
  },
  submitBtn: {
    backgroundColor: "green",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
