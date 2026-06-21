import React, { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";

import {
  FormLabel,
  Forminput,
  RadioButton,
} from "../../../components/shared/InputForm";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useFormDataMutate } from "../../../hooks/Requestv2";

const GENDER_OPTIONS = ["Male", "Female"];

const PLACEHOLDER_AVATAR =
  "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg";

const CreateDomesticStaff = () => {
  const navigation = useNavigation();

  const [photo, setPhoto] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    staffName: "",
    gender: "Male",
    phone: "",
    dateOfBirth: new Date(),
    homeAddress: "",
    Role: "",
    workingHours: "",
  });

  // ── Validation ──────────────────────────────────────────
  const isFormValid =
    formData.staffName.trim() &&
    formData.phone.trim() &&
    formData.homeAddress.trim() &&
    formData.Role.trim() &&
    formData.workingHours.trim() &&
    photo;

  // ── Mutation ────────────────────────────────────────────
  const createStaffMutation = useFormDataMutate(
    "api/v1/domestic",
    "POST",
    ["domesticStaff"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Staff added successfully",
        });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Failed to create staff",
        });
      },
    },
  );

  // ── Helpers ─────────────────────────────────────────────
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      handleInputChange("dateOfBirth", selectedDate);
      if (Platform.OS !== "ios") setShowDatePicker(false);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Please fill all fields and select a photo",
      });
      return;
    }

    const data = new FormData();
    data.append("staffName", formData.staffName.trim());
    data.append("gender", formData.gender);
    data.append("phone", formData.phone.trim());
    data.append(
      "dateOfBirth",
      formData.dateOfBirth.toISOString().split("T")[0],
    );
    data.append("homeAddress", formData.homeAddress.trim());
    data.append("Role", formData.Role.trim());
    data.append("workingHours", formData.workingHours.trim());

    const uri = photo;
    const filename = uri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const fileType = match ? `image/${match[1]}` : "image/jpeg";
    data.append("images", { uri, name: filename, type: fileType });

    createStaffMutation.mutate(data);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Avatar picker ───────────────────── */}
          <TouchableOpacity
            style={styles.avatarWrap}
            onPress={pickImage}
            activeOpacity={0.85}
          >
            <Image
              source={{ uri: photo || PLACEHOLDER_AVATAR }}
              style={styles.avatar}
            />
            <View style={styles.avatarEditBadge}>
              <MaterialCommunityIcons name="camera" size={14} color="#FFFFFF" />
            </View>
            <Text style={styles.avatarHint}>
              {photo ? "Change photo" : "Tap to add photo"}
            </Text>
          </TouchableOpacity>

          {/* ── Form fields ─────────────────────── */}
          <View style={styles.form}>
            <FormField label="Staff Name" required>
              <Forminput
                placeholder="e.g. Chinelo Okafor"
                value={formData.staffName}
                onChangeText={(v) => handleInputChange("staffName", v)}
              />
            </FormField>

            <FormField label="Phone Number" required>
              <Forminput
                placeholder="e.g. +2348012345678"
                value={formData.phone}
                onChangeText={(v) => handleInputChange("phone", v)}
                keyboardType="phone-pad"
              />
            </FormField>

            <FormField label="Gender" required>
              <View style={styles.radioRow}>
                {GENDER_OPTIONS.map((g, i) => (
                  <RadioButton
                    key={g}
                    label={g}
                    selected={formData.gender === g}
                    onSelect={() => handleInputChange("gender", g)}
                  />
                ))}
              </View>
            </FormField>

            <FormField label="Date of Birth" required>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialCommunityIcons
                  name="calendar"
                  size={18}
                  color="#10B981"
                />
                <Text style={styles.dateBtnText}>
                  {formData.dateOfBirth.toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dateOfBirth}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </FormField>

            <FormField label="Home Address" required>
              <Forminput
                placeholder="e.g. 123, Lagos Street, VI, Lagos"
                value={formData.homeAddress}
                onChangeText={(v) => handleInputChange("homeAddress", v)}
              />
            </FormField>

            <FormField label="Role" required>
              <Forminput
                placeholder="e.g. Housekeeper, Driver, Cook"
                value={formData.Role}
                onChangeText={(v) => handleInputChange("Role", v)}
              />
            </FormField>

            <FormField label="Working Hours" required>
              <Forminput
                placeholder="e.g. 8 AM – 5 PM"
                value={formData.workingHours}
                onChangeText={(v) => handleInputChange("workingHours", v)}
              />
            </FormField>
          </View>

          {/* ── Submit ──────────────────────────── */}
          <TouchableOpacity
            style={[styles.submitBtn, !isFormValid && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={!isFormValid || createStaffMutation.isPending}
            activeOpacity={0.85}
          >
            {createStaffMutation.isPending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.submitBtnText}>Add Staff Member</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

// ── Small helper component ───────────────────────────────
const FormField = ({ label, required, children }) => (
  <View style={styles.fieldWrap}>
    <Text style={styles.fieldLabel}>
      {label}
      {required && <Text style={styles.required}> *</Text>}
    </Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Avatar
  avatarWrap: {
    alignItems: "center",
    marginBottom: 28,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    borderWidth: 2,
    borderColor: "#D1FAE5",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 24,
    right: "33%",
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  avatarHint: {
    marginTop: 8,
    fontSize: 13,
    color: "#10B981",
    fontWeight: "700",
  },

  // Form
  form: {
    gap: 20,
    marginBottom: 28,
  },
  fieldWrap: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
  },
  required: {
    color: "#EF4444",
  },
  radioRow: {
    flexDirection: "row",
    gap: 20,
    paddingTop: 4,
  },

  // Date button
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 10,
  },
  dateBtnText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },

  // Submit
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default CreateDomesticStaff;
