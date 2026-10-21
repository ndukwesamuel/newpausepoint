import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

const PLACEHOLDER_IMAGE =
  "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

// Estate admin: artisans registered in the admin's estate.
const VendorList = ({ navigation }) => {
  const animation = useRef(null);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const { data, refetch } = useFetchData_v2(
    "api/v1/artisan/admin",
    "artisans",
  );

  const artisans = data?.data || [];
  const term = search.toLowerCase();
  const filtered = artisans.filter(
    (item) =>
      item?.fullName?.toLowerCase().includes(term) ||
      item?.typeOfJob?.toLowerCase().includes(term),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("vendorServiceDetails", { item })}
      style={styles.cardWrapper}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
          style={styles.cardImage}
        />
        <View style={styles.cardContent}>
          <Text style={styles.cardName} numberOfLines={1}>
            {item?.fullName}
          </Text>
          <Text style={styles.cardJob} numberOfLines={1}>
            {item?.typeOfJob}
          </Text>
          <View style={styles.ratingRow}>
            <MaterialCommunityIcons name="star" size={13} color="#F59E0B" />
            <Text style={styles.ratingText}>
              {Number(item?.avgRating || 0).toFixed(1)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <LottieView
        autoPlay
        ref={animation}
        style={styles.lottie}
        source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
      />
      <Text style={styles.emptyTitle}>
        {search ? "No artisans match your search" : "No artisans yet"}
      </Text>
      {!search && (
        <Text style={styles.emptySubtitle}>
          Tap + to register the first artisan for your estate
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color="#6B7280"
          style={{ marginRight: 8 }}
        />
        <TextInput
          placeholder="Search by name or service..."
          style={styles.searchInput}
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
        {search !== "" && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <MaterialCommunityIcons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item, index) => item?._id || index.toString()}
        ListEmptyComponent={renderEmpty}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
          />
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("VendorProfile")}
        accessibilityLabel="Add artisan"
      >
        <MaterialCommunityIcons name="plus" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },
  listContent: {
    paddingBottom: 100,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardWrapper: {
    width: "48%",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#F3F4F6",
  },
  cardContent: {
    padding: 12,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  cardJob: {
    fontSize: 12,
    color: "#10B981",
    fontWeight: "600",
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  lottie: {
    width: 180,
    height: 180,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#04973C",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default VendorList;
