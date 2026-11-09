import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert,
  ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { GREEN, imageFile, useAmenityAction } from "../../../components/Amenity/amenityApi";

const ReportAmenityIssueScreen = () => {
  const navigation = useNavigation();
  const { amenity } = useRoute().params;
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(null);
  const action = useAmenityAction();

  const pick = async (camera) => {
    const options = { mediaTypes: ["images"], quality: 0.6 };
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Allow access so you can attach a photo.");
      return;
    }
    const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    if (!result.canceled && result.assets?.[0]) setPhoto(result.assets[0]);
  };

  const submit = () => {
    if (description.trim().length < 5) {
      Alert.alert("Describe the issue", "Tell the estate team what's wrong.");
      return;
    }
    const form = new FormData();
    form.append("description", description.trim());
    if (photo) form.append("photo", imageFile(photo, "issue.jpg"));
    action.mutate(
      { path: `/${amenity._id}/reports`, formData: form },
      {
        onSuccess: (res) => {
          Alert.alert("Report sent", res?.message || "The estate team has been notified.");
          navigation.replace("MyAmenityReports");
        },
        onError: (err) => Alert.alert("Couldn't send report", err.message),
      },
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View style={styles.amenityRow}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name={amenity.iconName || "office-building"} size={22} color={GREEN} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>REPORTING AN ISSUE WITH</Text>
            <Text style={styles.amenityName}>{amenity.name}</Text>
          </View>
        </View>

        <Text style={styles.label}>WHAT'S WRONG?</Text>
        <TextInput
          style={styles.input}
          multiline
          textAlignVertical="top"
          placeholder="e.g. The pool lights at the deep end are not working"
          placeholderTextColor="#9CA3AF"
          value={description}
          onChangeText={setDescription}
          maxLength={1000}
        />

        <Text style={styles.label}>PHOTO (OPTIONAL)</Text>
        {photo ? (
          <View>
            <Image source={{ uri: photo.uri }} style={styles.photo} />
            <TouchableOpacity style={styles.removePhoto} onPress={() => setPhoto(null)}>
              <MaterialCommunityIcons name="close" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.photoBtn} onPress={() => pick(true)}>
              <MaterialCommunityIcons name="camera-outline" size={20} color={GREEN} />
              <Text style={styles.photoBtnText}>Take photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.photoBtn} onPress={() => pick(false)}>
              <MaterialCommunityIcons name="image-outline" size={20} color={GREEN} />
              <Text style={styles.photoBtnText}>Choose photo</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={[styles.submit, action.isPending && { opacity: 0.6 }]} onPress={submit} disabled={action.isPending}>
          {action.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Send report</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  amenityRow: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 16, padding: 14, marginBottom: 24 },
  iconWrap: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center" },
  amenityName: { fontSize: 17, fontWeight: "700", color: "#111827" },
  label: { fontSize: 12, fontWeight: "700", color: "#6B7280", letterSpacing: 0.5, marginBottom: 8 },
  input: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 1, borderColor: "#E5E7EB", padding: 14, minHeight: 130, fontSize: 15, color: "#111827", marginBottom: 24 },
  photoRow: { flexDirection: "row", gap: 12, marginBottom: 28 },
  photoBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#fff", borderWidth: 1, borderColor: "#D1FAE5", borderRadius: 14, paddingVertical: 14 },
  photoBtnText: { fontSize: 14, fontWeight: "600", color: "#065F46" },
  photo: { width: "100%", height: 200, borderRadius: 14, marginBottom: 28 },
  removePhoto: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 14, padding: 5 },
  submit: { backgroundColor: "#EF4444", borderRadius: 16, paddingVertical: 16, alignItems: "center" },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default ReportAmenityIssueScreen;
