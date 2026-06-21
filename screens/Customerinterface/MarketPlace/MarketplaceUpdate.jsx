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
  FlatList,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useFormDataMutate } from "../../../hooks/Requestv2";
import { CustomTextArea } from "../../../components/shared/InputForm";

const CATEGORY_LIST = [
  "Food",
  "Electronics",
  "Services",
  "Furniture",
  "Clothing",
  "Other",
];

export default function MarketplaceUpdate() {
  const navigation = useNavigation();
  const route = useRoute();
  const listing = route.params?.listing;

  // ── Pre-fill form with existing data ─────────────────────────────────────
  const [name, setName] = useState(listing?.name || "");
  const [price, setPrice] = useState(listing?.price?.toString() || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [contact, setContact] = useState(listing?.phone || "");
  const [category, setCategory] = useState(listing?.category || "Other");

  // New images picked by user — if empty, existing images are kept on backend
  const [newImages, setNewImages] = useState([]);
  // Track if user has chosen to replace images
  const [replaceImages, setReplaceImages] = useState(false);

  const { mutate, isPending } = useFormDataMutate(
    `api/v1/marketRouter/${listing?._id}`,
    "PATCH",
    ["marketplace", "myListings"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Listing updated!",
          text2: "Pending admin re-approval before going live.",
        });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Failed to update listing",
        });
      },
    },
  );

  // ── Image picker ──────────────────────────────────────────────────────────
  const pickNewImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const selected = result.assets.slice(0, 4);
      setNewImages(selected);
      setReplaceImages(true);
    }
  };

  const removeNewImage = (index) => {
    const updated = [...newImages];
    updated.splice(index, 1);
    setNewImages(updated);
    if (updated.length === 0) setReplaceImages(false);
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleUpdate = () => {
    if (!name.trim() || !price || !contact.trim() || !description.trim()) {
      Alert.alert("Missing fields", "Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("price", price);
    formData.append("description", description.trim());
    formData.append("contact", contact.trim());
    formData.append("category", category);

    // Only append images if user picked new ones
    if (replaceImages && newImages.length > 0) {
      newImages.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: image.mimeType || "image/jpeg",
          name: `image_${index}.jpg`,
        });
      });
    }

    mutate(formData);
  };

  if (!listing) {
    return (
      <View style={styles.centerState}>
        <Text style={styles.centerStateText}>Listing not found</Text>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Name + Price */}
        <View style={styles.row}>
          <View style={styles.column}>
            <Text style={styles.label}>Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. iPhone 12"
              placeholderTextColor="#9CA3AF"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={styles.column}>
            <Text style={styles.label}>Price (₦) *</Text>
            <TextInput
              style={styles.input}
              placeholder="50000"
              placeholderTextColor="#9CA3AF"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Contact */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Phone *</Text>
          <TextInput
            style={styles.input}
            placeholder="08012345678"
            placeholderTextColor="#9CA3AF"
            value={contact}
            onChangeText={setContact}
            keyboardType="phone-pad"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description *</Text>
          <CustomTextArea
            placeholder="Describe your item or service..."
            value={description}
            onChangeText={setDescription}
            inputStyle={{
              textAlignVertical: "top",
              paddingTop: 12,
              paddingBottom: 10,
              backgroundColor: "white",
              paddingHorizontal: 14,
              height: 110,
              borderRadius: 10,
              fontSize: 14,
              borderWidth: 0.5,
              borderColor: "#E5E7EB",
              color: "#111827",
            }}
          />
        </View>

        {/* Category */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category *</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {CATEGORY_LIST.map((c) => (
                <TouchableOpacity
                  key={c}
                  onPress={() => setCategory(c)}
                  style={[
                    styles.catPill,
                    category === c && { backgroundColor: "#10B981" },
                  ]}
                >
                  <Text
                    style={[
                      styles.catPillText,
                      category === c && { color: "white" },
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Images */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Product Images</Text>

          {/* Show existing images if user hasn't replaced them */}
          {!replaceImages && listing.images?.length > 0 && (
            <>
              <Text style={styles.existingLabel}>Current images:</Text>
              <FlatList
                horizontal
                data={listing.images}
                keyExtractor={(_, i) => i.toString()}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 10 }}
                renderItem={({ item, index }) => (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: item.url }}
                      style={styles.imagePreview}
                    />
                    {index === 0 && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>Main</Text>
                      </View>
                    )}
                  </View>
                )}
              />
            </>
          )}

          {/* Show new images if picked */}
          {replaceImages && newImages.length > 0 && (
            <>
              <Text style={styles.existingLabel}>
                New images (will replace current):
              </Text>
              <FlatList
                horizontal
                data={newImages}
                keyExtractor={(_, i) => i.toString()}
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 10 }}
                renderItem={({ item, index }) => (
                  <View style={styles.imagePreviewContainer}>
                    <Image
                      source={{ uri: item.uri }}
                      style={styles.imagePreview}
                    />
                    {index === 0 && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>Main</Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => removeNewImage(index)}
                    >
                      <Text style={styles.removeImageText}>×</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </>
          )}

          {/* Change images button */}
          <TouchableOpacity onPress={pickNewImages} style={styles.uploadBtn}>
            <MaterialCommunityIcons
              name="camera-plus-outline"
              size={20}
              color="#6B7280"
            />
            <Text style={styles.uploadBtnText}>
              {replaceImages ? "Change Selected Images" : "Replace All Images"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Info note */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color="#1D9E75"
          />
          <Text style={styles.infoText}>
            After updating, your listing will be re-reviewed by the estate admin
            before going live again.
          </Text>
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            isPending && { backgroundColor: "#6EE7B7" },
          ]}
          onPress={handleUpdate}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitBtnText}>Update Listing</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centerState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  centerStateText: { fontSize: 14, color: "#9CA3AF" },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: "#10B981",
    borderRadius: 8,
  },
  retryBtnText: { color: "white", fontSize: 14, fontWeight: "600" },
  row: { flexDirection: "row", gap: 12, marginBottom: 14 },
  column: { flex: 1 },
  inputGroup: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 },
  existingLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 8 },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: "#F3F4F6",
  },
  catPillText: { fontSize: 13, color: "#6B7280", fontWeight: "500" },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "white",
    marginTop: 6,
  },
  uploadBtnText: { fontSize: 14, color: "#6B7280", fontWeight: "500" },
  imagePreviewContainer: {
    position: "relative",
    marginRight: 10,
    marginTop: 4,
  },
  imagePreview: { width: 100, height: 100, borderRadius: 8 },
  mainBadge: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainBadgeText: { color: "white", fontSize: 10, fontWeight: "700" },
  removeImageButton: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#EF4444",
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  removeImageText: { color: "white", fontWeight: "800", fontSize: 14 },
  infoBox: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: "#F0FDF4",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: "#D1FAE5",
  },
  infoText: { flex: 1, fontSize: 12, color: "#065F46", lineHeight: 18 },
  submitBtn: {
    backgroundColor: "#10B981",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});
