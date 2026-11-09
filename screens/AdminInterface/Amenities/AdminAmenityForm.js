import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert,
  ActivityIndicator, Switch, KeyboardAvoidingView, Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  AMENITY_ICONS, AMENITY_STATUS_CONFIG, GREEN, formatDate, imageFile, useAmenityAction,
} from "../../../components/Amenity/amenityApi";

const Field = ({ label, ...props }) => (
  <View style={{ marginBottom: 16 }}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, props.multiline && { minHeight: 90 }]}
      placeholderTextColor="#9CA3AF"
      textAlignVertical={props.multiline ? "top" : "center"}
      {...props}
    />
  </View>
);

// Create when no amenity is passed, edit otherwise. Sent as multipart so an
// image can ride along; the backend coerces the string fields.
const AdminAmenityForm = () => {
  const navigation = useNavigation();
  const existing = useRoute().params?.amenity;
  const action = useAmenityAction();

  const [form, setForm] = useState({
    name: existing?.name || "",
    description: existing?.description || "",
    location: existing?.location || "",
    operatingHours: existing?.operatingHours || "",
    status: existing?.status || "open",
    estimatedReopenDate: existing?.estimatedReopenDate ? new Date(existing.estimatedReopenDate) : null,
    rules: (existing?.rules || []).join("\n"),
    iconName: existing?.iconName || "office-building",
    isPaid: !!existing?.isPaid,
    price: existing?.price ? String(existing.price) : "",
  });
  const [image, setImage] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const set = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) { Alert.alert("Permission needed", "Allow photo access to add an image."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.7, allowsEditing: true, aspect: [16, 9] });
    if (!result.canceled && result.assets?.[0]) setImage(result.assets[0]);
  };

  const save = () => {
    if (!form.name.trim()) { Alert.alert("Name required", "Give the amenity a name, e.g. Swimming Pool."); return; }
    const data = new FormData();
    data.append("name", form.name.trim());
    data.append("description", form.description.trim());
    data.append("location", form.location.trim());
    data.append("operatingHours", form.operatingHours.trim());
    data.append("status", form.status);
    data.append("rules", JSON.stringify(form.rules.split("\n").map((r) => r.trim()).filter(Boolean)));
    data.append("iconName", form.iconName);
    data.append("isPaid", String(form.isPaid));
    data.append("price", form.isPaid ? String(Number(form.price) || 0) : "0");
    if (form.status === "under_maintenance" && form.estimatedReopenDate) {
      data.append("estimatedReopenDate", form.estimatedReopenDate.toISOString());
    }
    if (image) data.append("image", imageFile(image, "amenity.jpg"));

    action.mutate(
      existing ? { path: `/admin/${existing._id}`, method: "PATCH", formData: data } : { path: "/admin", formData: data },
      {
        onSuccess: () => navigation.goBack(),
        onError: (err) => Alert.alert("Couldn't save amenity", err.message),
      },
    );
  };

  const preview = image?.uri || existing?.image?.url;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20, paddingBottom: 60 }} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {preview ? (
            <Image source={{ uri: preview }} style={styles.image} />
          ) : (
            <>
              <MaterialCommunityIcons name="image-plus" size={34} color={GREEN} />
              <Text style={styles.imageText}>Add a photo (optional)</Text>
            </>
          )}
        </TouchableOpacity>

        <Field label="NAME" value={form.name} onChangeText={set("name")} placeholder="Swimming Pool" maxLength={80} />
        <Field label="DESCRIPTION" value={form.description} onChangeText={set("description")} placeholder="What residents should know" multiline maxLength={1000} />
        <Field label="LOCATION" value={form.location} onChangeText={set("location")} placeholder="Block A, near the main gate" maxLength={150} />
        <Field label="OPENING HOURS" value={form.operatingHours} onChangeText={set("operatingHours")} placeholder="6:00 AM – 9:00 PM" maxLength={80} />

        <Text style={styles.label}>ICON</Text>
        <View style={styles.iconGrid}>
          {AMENITY_ICONS.map((icon) => (
            <TouchableOpacity key={icon} style={[styles.iconChoice, form.iconName === icon && styles.iconChoiceActive]} onPress={() => set("iconName")(icon)}>
              <MaterialCommunityIcons name={icon} size={22} color={form.iconName === icon ? "#fff" : GREEN} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>STATUS</Text>
        <View style={styles.statusRow}>
          {Object.entries(AMENITY_STATUS_CONFIG).map(([value, cfg]) => (
            <TouchableOpacity key={value} style={[styles.statusChoice, form.status === value && { backgroundColor: cfg.bg, borderColor: cfg.dot }]} onPress={() => set("status")(value)}>
              <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
              <Text style={[styles.statusText, form.status === value && { color: cfg.text }]}>{cfg.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {form.status === "under_maintenance" ? (
          <View style={{ marginBottom: 16 }}>
            <Text style={styles.label}>EXPECTED TO REOPEN</Text>
            <TouchableOpacity style={[styles.input, styles.dateBtn]} onPress={() => setShowDate(true)}>
              <Text style={{ color: form.estimatedReopenDate ? "#111827" : "#9CA3AF", fontSize: 15 }}>
                {form.estimatedReopenDate ? formatDate(form.estimatedReopenDate, true) : "Pick a date (optional)"}
              </Text>
              <MaterialCommunityIcons name="calendar" size={20} color={GREEN} />
            </TouchableOpacity>
            {showDate ? (
              <DateTimePicker
                value={form.estimatedReopenDate || new Date()}
                mode="date"
                minimumDate={new Date()}
                onChange={(event, date) => {
                  setShowDate(Platform.OS === "ios");
                  if (event.type === "set" && date) set("estimatedReopenDate")(date);
                }}
              />
            ) : null}
          </View>
        ) : null}

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.switchTitle}>Paid amenity</Text>
            <Text style={styles.switchSub}>Residents pay to use it</Text>
          </View>
          <Switch value={form.isPaid} onValueChange={set("isPaid")} trackColor={{ true: GREEN }} />
        </View>
        {form.isPaid ? (
          <Field label="PRICE (₦)" value={form.price} onChangeText={(v) => set("price")(v.replace(/[^0-9]/g, ""))} keyboardType="number-pad" placeholder="5000" />
        ) : null}

        <Field label="RULES (ONE PER LINE)" value={form.rules} onChangeText={set("rules")} placeholder={"No running on the pool deck\nChildren must be supervised"} multiline />

        <TouchableOpacity style={[styles.save, action.isPending && { opacity: 0.6 }]} onPress={save} disabled={action.isPending}>
          {action.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveText}>{existing ? "Save changes" : "Add amenity"}</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  label: { fontSize: 12, fontWeight: "700", color: "#6B7280", letterSpacing: 0.5, marginBottom: 8 },
  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: "#111827" },
  imagePicker: { height: 170, borderRadius: 16, borderWidth: 1, borderStyle: "dashed", borderColor: "#6EE7B7", backgroundColor: "#ECFDF5", justifyContent: "center", alignItems: "center", marginBottom: 20, overflow: "hidden", gap: 6 },
  image: { width: "100%", height: "100%" },
  imageText: { fontSize: 14, fontWeight: "600", color: "#065F46" },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 18 },
  iconChoice: { width: 46, height: 46, borderRadius: 12, backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center" },
  iconChoiceActive: { backgroundColor: GREEN },
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 18 },
  statusChoice: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#E5E7EB", backgroundColor: "#fff" },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  dateBtn: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  switchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: "#E5E7EB" },
  switchTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  switchSub: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  save: { backgroundColor: GREEN, borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 8 },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default AdminAmenityForm;
