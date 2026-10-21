import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

// Estate admin: every rating residents left for one artisan.
const VendortDetailsReview = () => {
  const artisanId = useRoute().params?.item;
  const [refreshing, setRefreshing] = useState(false);

  const { data, isLoading, refetch } = useFetchData_v2(
    `api/v1/artisan/admin/${artisanId}/ratings`,
    `artisanRatings-${artisanId}`,
  );
  const ratings = data?.data || [];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.itemHeader}>
        <Text style={styles.name}>{item?.user?.name || "Resident"}</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((s) => (
            <MaterialCommunityIcons
              key={s}
              name={s <= item?.rating ? "star" : "star-outline"}
              size={16}
              color="#F59E0B"
            />
          ))}
        </View>
      </View>
      {item?.review ? <Text style={styles.review}>{item.review}</Text> : null}
      {item?.createdAt ? (
        <Text style={styles.date}>{new Date(item.createdAt).toDateString()}</Text>
      ) : null}
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#04973C" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      data={ratings}
      keyExtractor={(item, index) => item?._id || index.toString()}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.center}>
          <MaterialCommunityIcons name="star-off-outline" size={40} color="#9CA3AF" />
          <Text style={styles.emptyText}>No ratings yet</Text>
        </View>
      }
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 60,
  },
  item: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  stars: {
    flexDirection: "row",
    gap: 1,
  },
  review: {
    fontSize: 15,
    color: "#374151",
    marginTop: 8,
    lineHeight: 21,
  },
  date: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 6,
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 10,
  },
});

export default VendortDetailsReview;
