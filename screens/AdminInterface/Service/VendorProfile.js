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
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useFormDataMutate } from "../../../hooks/Requestv2";

const NIN_REGEX = /^\d{11}$/;

const mimeFor = (fileName) => {
  const ext = (fileName.split(".").pop() || "").toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "heic") return "image/heic";
  return `image/${ext || "jpeg"}`;
};

// Declared outside the screen so inputs inside it keep focus while typing.
const Field = ({ label, required, children }) => (
  <View style={{ marginBottom: 14 }}>
    <Text style={styles.label}>
      {label}
      {required ? <Text style={{ color: "#DC2626" }}> *</Text> : null}
    </Text>
    {children}
  </View>
);

// Estate admin: register an artisan for the admin's estate.
const VendorProfile = ({ navigation }) => {
  const [photo, setPhoto] = useState(null);
  const [fullName, setFullName] = useState("");
  const [typeOfJob, setTypeOfJob] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [nin, setNin] = useState("");
  const [dob, setDob] = useState(null);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [origin, setOrigin] = useState("");
  const [address, setAddress] = useState("");
  const [details, setDetails] = useState("");

  const { mutate: createArtisan, isPending } = useFormDataMutate(
    "api/v1/artisan/admin",
    "POST",
    "artisans",
    {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Artisan added" });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Failed to add artisan",
        });
      },
    },
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setPhoto(result.assets[0].uri);
  };

  const onDobChange = (event, selected) => {
    setShowDobPicker(Platform.OS === "ios");
    if (selected) setDob(selected);
  };

  const handleSave = () => {
    if (
      !fullName.trim() ||
      !typeOfJob.trim() ||
      !phone_number.trim() ||
      !nin.trim() ||
      !dob ||
      !origin.trim() ||
      !address.trim()
    ) {
      Toast.show({ type: "error", text1: "Please fill all required fields" });
      return;
    }
    if (!NIN_REGEX.test(nin.trim())) {
      Toast.show({ type: "error", text1: "NIN must be exactly 11 digits" });
      return;
    }
    if (dob > new Date()) {
      Toast.show({ type: "error", text1: "Date of birth can't be in the future" });
      return;
    }
    if (!photo) {
      Toast.show({ type: "error", text1: "Please add a photo of the artisan" });
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName.trim());
    formData.append("typeOfJob", typeOfJob.trim());
    formData.append("phone_number", phone_number.trim());
    formData.append("nin", nin.trim());
    // Local calendar date; toISOString() would shift it a day back in UTC+1.
    const pad = (n) => String(n).padStart(2, "0");
    formData.append(
      "dob",
      `${dob.getFullYear()}-${pad(dob.getMonth() + 1)}-${pad(dob.getDate())}`,
    );
    formData.append("origin", origin.trim());
    formData.append("address", address.trim());
    if (details.trim()) formData.append("details", details.trim());

    const fileName = photo.split("/").pop() || "photo.jpg";
    formData.append("photo", { uri: photo, name: fileName, type: mimeFor(fileName) });

    createArtisan(formData);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ padding: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={pickImage} style={styles.photoWrap}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <View style={[styles.photo, styles.photoEmpty]}>
            <MaterialCommunityIcons name="camera-plus" size={30} color="#6B7280" />
          </View>
        )}
        <Text style={styles.photoText}>{photo ? "Change photo" : "Add photo *"}</Text>
      </TouchableOpacity>

      <Field label="Full name" required>
        <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="e.g. Musa Ibrahim" />
      </Field>
      <Field label="Service / type of job" required>
        <TextInput style={styles.input} value={typeOfJob} onChangeText={setTypeOfJob} placeholder="e.g. Electrician" />
      </Field>
      <Field label="Phone number" required>
        <TextInput style={styles.input} value={phone_number} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="080..." />
      </Field>
      <Field label="NIN (11 digits)" required>
        <TextInput style={styles.input} value={nin} onChangeText={setNin} keyboardType="number-pad" maxLength={11} placeholder="12345678901" />
      </Field>
      <Field label="Date of birth" required>
        <TouchableOpacity style={styles.input} onPress={() => setShowDobPicker(true)}>
          <Text style={{ color: dob ? "#111827" : "#9CA3AF", fontSize: 16 }}>
            {dob ? dob.toDateString() : "Select date"}
          </Text>
        </TouchableOpacity>
        {showDobPicker && (
          <DateTimePicker
            value={dob || new Date(1990, 0, 1)}
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={onDobChange}
          />
        )}
      </Field>
      <Field label="State of origin" required>
        <TextInput style={styles.input} value={origin} onChangeText={setOrigin} placeholder="e.g. Kano" />
      </Field>
      <Field label="Address" required>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Where they live" />
      </Field>
      <Field label="Details">
        <TextInput
          style={[styles.input, { minHeight: 90, textAlignVertical: "top" }]}
          value={details}
          onChangeText={setDetails}
          multiline
          placeholder="Experience, working hours, anything residents should know"
        />
      </Field>

      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isPending}>
        {isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Add artisan</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  photoWrap: {
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  photoEmpty: {
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  photoText: {
    marginTop: 8,
    color: "#04973C",
    fontWeight: "600",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111827",
  },
  input: {
    fontSize: 16,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  button: {
    backgroundColor: "#04973C",
    padding: 16,
    alignItems: "center",
    borderRadius: 10,
    marginTop: 16,
    marginBottom: 50,
  },
  buttonText: {
    fontSize: 17,
    color: "white",
    fontWeight: "700",
  },
});

export default VendorProfile;
