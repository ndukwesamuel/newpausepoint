import React, { useState } from "react";
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert,
  ActivityIndicator, Image, Modal, TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import {
  AMENITY_PATH, AMENITY_STATUS_CONFIG, GREEN, REPORT_STATUS_CONFIG,
  formatDate, money, useAmenityAction,
} from "../../../components/Amenity/amenityApi";

const REPORT_FILTERS = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const Pill = ({ cfg }) => (
  <View style={[styles.pill, { backgroundColor: cfg.bg }]}>
    <Text style={[styles.pillText, { color: cfg.text }]}>{cfg.label}</Text>
  </View>
);

const AmenityList = () => {
  const navigation = useNavigation();
  const action = useAmenityAction();
  const { data, isLoading, isRefetching, refetch, error } = useFetchData_v2(`${AMENITY_PATH}/admin`, "admin-amenities");
  const amenities = data?.data?.amenities || [];

  const confirmDelete = (amenity) =>
    Alert.alert("Delete amenity", `Delete ${amenity.name}? Its issue reports will be deleted too.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => action.mutate({ path: `/admin/${amenity._id}`, method: "DELETE" }, {
          onError: (err) => Alert.alert("Couldn't delete", err.message),
        }),
      },
    ]);

  if (isLoading) return <ActivityIndicator color={GREEN} style={{ marginTop: 60 }} />;

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={amenities}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GREEN} />}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              {item.image?.url ? (
                <Image source={{ uri: item.image.url }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbIcon]}>
                  <MaterialCommunityIcons name={item.iconName || "office-building"} size={26} color={GREEN} />
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.muted} numberOfLines={1}>
                  {[item.location, item.isPaid ? (item.price ? money(item.price) : "Paid") : "Free"].filter(Boolean).join(" · ")}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 6 }}>
                  <Pill cfg={AMENITY_STATUS_CONFIG[item.status] || AMENITY_STATUS_CONFIG.open} />
                </View>
              </View>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate("AdminAmenityForm", { amenity: item })}>
                <MaterialCommunityIcons name="pencil-outline" size={17} color="#111827" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} onPress={() => confirmDelete(item)} disabled={action.isPending}>
                <MaterialCommunityIcons name="trash-can-outline" size={17} color="#B42318" />
                <Text style={[styles.actionText, { color: "#B42318" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <MaterialCommunityIcons name="pool" size={52} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>{error ? "Couldn't load amenities" : "No amenities yet"}</Text>
            <Text style={styles.emptySub}>{error ? error.message : "Add your estate's pool, gym, hall and other facilities so residents can see them."}</Text>
          </View>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate("AdminAmenityForm", {})}>
        <MaterialCommunityIcons name="plus" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const ReportList = () => {
  const [filter, setFilter] = useState("");
  const [resolving, setResolving] = useState(null);
  const [note, setNote] = useState("");
  const action = useAmenityAction();
  const url = `${AMENITY_PATH}/admin/reports${filter ? `?status=${filter}` : ""}`;
  const { data, isLoading, isRefetching, refetch } = useFetchData_v2(url, "admin-amenity-reports");
  const reports = data?.data?.reports || [];
  const counts = data?.data?.counts || {};

  const setStatus = (report, status, adminNote) =>
    action.mutate(
      { path: `/admin/reports/${report._id}`, method: "PATCH", body: { status, ...(adminNote !== undefined && { adminNote }) } },
      {
        onSuccess: () => { setResolving(null); setNote(""); },
        onError: (err) => Alert.alert("Couldn't update report", err.message),
      },
    );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.chips}>
        {REPORT_FILTERS.map((f) => (
          <TouchableOpacity key={f.label} style={[styles.chip, filter === f.value && styles.chipActive]} onPress={() => setFilter(f.value)}>
            <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>
              {f.label}{f.value && counts[f.value] ? ` (${counts[f.value]})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoading ? <ActivityIndicator color={GREEN} style={{ marginTop: 40 }} /> : (
        <FlatList
          data={reports}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={GREEN} />}
          renderItem={({ item }) => {
            const member = item.member || {};
            return (
              <View style={styles.card}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>{item.amenity?.name || "Deleted amenity"}</Text>
                    <Text style={styles.muted}>
                      {[member.firstName, member.lastName].filter(Boolean).join(" ") || "Resident"} · {formatDate(item.createdAt)}
                    </Text>
                  </View>
                  <Pill cfg={REPORT_STATUS_CONFIG[item.status] || REPORT_STATUS_CONFIG.open} />
                </View>
                <Text style={styles.body}>{item.description}</Text>
                {item.photo?.url ? <Image source={{ uri: item.photo.url }} style={styles.photo} /> : null}
                {item.adminNote ? <Text style={styles.note}>Your note: {item.adminNote}</Text> : null}
                <View style={styles.actions}>
                  {item.status === "open" ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setStatus(item, "in_progress")} disabled={action.isPending}>
                      <MaterialCommunityIcons name="progress-wrench" size={17} color="#1E40AF" />
                      <Text style={[styles.actionText, { color: "#1E40AF" }]}>Start work</Text>
                    </TouchableOpacity>
                  ) : null}
                  {item.status !== "resolved" ? (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => { setNote(item.adminNote || ""); setResolving(item); }} disabled={action.isPending}>
                      <MaterialCommunityIcons name="check-circle-outline" size={17} color="#065F46" />
                      <Text style={[styles.actionText, { color: "#065F46" }]}>Resolve</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={styles.actionBtn} onPress={() => setStatus(item, "open")} disabled={action.isPending}>
                      <MaterialCommunityIcons name="restore" size={17} color="#111827" />
                      <Text style={styles.actionText}>Reopen</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <MaterialCommunityIcons name="clipboard-check-outline" size={52} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No reports</Text>
              <Text style={styles.emptySub}>Issues residents report on amenities will show up here.</Text>
            </View>
          }
        />
      )}

      <Modal visible={!!resolving} transparent animationType="fade" onRequestClose={() => setResolving(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.title}>Resolve report</Text>
            <Text style={[styles.muted, { marginBottom: 12 }]}>Add a note for the resident (optional).</Text>
            <TextInput
              style={styles.modalInput}
              multiline
              textAlignVertical="top"
              value={note}
              onChangeText={setNote}
              placeholder="e.g. Lights replaced on Tuesday"
              placeholderTextColor="#9CA3AF"
              maxLength={500}
            />
            <View style={[styles.actions, { borderTopWidth: 0 }]}>
              <TouchableOpacity style={styles.actionBtn} onPress={() => setResolving(null)}>
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionBtn, { backgroundColor: GREEN }]} onPress={() => setStatus(resolving, "resolved", note.trim())} disabled={action.isPending}>
                {action.isPending ? <ActivityIndicator color="#fff" /> : <Text style={[styles.actionText, { color: "#fff" }]}>Mark resolved</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const AdminAmenities = () => {
  const [tab, setTab] = useState("amenities");
  return (
    <View style={styles.container}>
      <View style={styles.segment}>
        {[["amenities", "Amenities"], ["reports", "Issue reports"]].map(([value, label]) => (
          <TouchableOpacity key={value} style={[styles.segmentItem, tab === value && styles.segmentActive]} onPress={() => setTab(value)}>
            <Text style={[styles.segmentText, tab === value && styles.segmentTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab === "amenities" ? <AmenityList /> : <ReportList />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  segment: { flexDirection: "row", margin: 16, marginBottom: 8, backgroundColor: "#E5E7EB", borderRadius: 12, padding: 4 },
  segmentItem: { flex: 1, paddingVertical: 9, borderRadius: 9, alignItems: "center" },
  segmentActive: { backgroundColor: "#fff" },
  segmentText: { fontSize: 14, fontWeight: "600", color: "#6B7280" },
  segmentTextActive: { color: "#111827" },
  list: { padding: 16, paddingBottom: 120, gap: 12 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 } },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  thumb: { width: 60, height: 60, borderRadius: 12, backgroundColor: "#F3F4F6" },
  thumbIcon: { backgroundColor: "#D1FAE5", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 16, fontWeight: "700", color: "#111827" },
  muted: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  body: { fontSize: 14, color: "#374151", lineHeight: 20, marginTop: 10 },
  note: { fontSize: 13, color: "#1E40AF", marginTop: 8 },
  photo: { width: "100%", height: 160, borderRadius: 12, marginTop: 10, backgroundColor: "#F3F4F6" },
  pill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  pillText: { fontSize: 12, fontWeight: "700" },
  actions: { flexDirection: "row", gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F3F4F6" },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: "#F3F4F6" },
  actionText: { fontSize: 14, fontWeight: "600", color: "#111827" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 16, paddingTop: 4 },
  chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#E5E7EB" },
  chipActive: { backgroundColor: GREEN, borderColor: GREEN },
  chipText: { fontSize: 13, fontWeight: "600", color: "#6B7280" },
  chipTextActive: { color: "#fff" },
  empty: { alignItems: "center", paddingTop: 70, gap: 8, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#374151" },
  emptySub: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
  fab: { position: "absolute", right: 22, bottom: 34, width: 58, height: 58, borderRadius: 29, backgroundColor: GREEN, justifyContent: "center", alignItems: "center", elevation: 5, shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", padding: 24 },
  modalCard: { backgroundColor: "#fff", borderRadius: 18, padding: 20 },
  modalInput: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 12, padding: 12, minHeight: 90, fontSize: 15, color: "#111827" },
});

export default AdminAmenities;
