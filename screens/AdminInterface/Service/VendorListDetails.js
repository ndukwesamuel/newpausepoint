import { useRoute } from "@react-navigation/native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useMutateData_v2 } from "../../../hooks/Requestv2";

const PLACEHOLDER_IMAGE =
  "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

// Estate admin: one artisan, with delete and call.
const VendorListDetails = ({ navigation }) => {
  const item = useRoute().params?.item;

  const { mutate: deleteArtisan, isPending: isDeleting } = useMutateData_v2(
    `api/v1/artisan/admin/${item?._id}`,
    "DELETE",
    "artisans",
    {
      onSuccess: () => {
        Toast.show({ type: "success", text1: "Artisan deleted" });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.message || "Failed to delete artisan",
        });
      },
    },
  );

  const confirmDelete = () => {
    Alert.alert(
      "Delete artisan",
      `Remove ${item?.fullName} from your estate? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteArtisan() },
      ],
    );
  };

  const makePhoneCall = () => {
    if (item?.phone_number) {
      Linking.openURL(`tel:${item.phone_number}`);
    } else {
      Toast.show({ type: "error", text1: "Phone number not available" });
    }
  };

  const Row = ({ icon, label, value }) =>
    value ? (
      <View style={styles.row}>
        <MaterialCommunityIcons name={icon} size={20} color="#04973C" />
        <View style={{ flex: 1 }}>
          <Text style={styles.rowLabel}>{label}</Text>
          <Text style={styles.rowValue}>{value}</Text>
        </View>
      </View>
    ) : null;

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={styles.hero}>
        <Image
          source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
          style={styles.photo}
        />
        <Text style={styles.name}>{item?.fullName}</Text>
        {item?.typeOfJob ? (
          <Text style={styles.job}>{item.typeOfJob}</Text>
        ) : null}

        <TouchableOpacity
          style={styles.ratingButton}
          onPress={() =>
            navigation.navigate("VendortDetailsReview", { item: item?._id })
          }
        >
          <MaterialCommunityIcons name="star" size={18} color="#F59E0B" />
          <Text style={styles.ratingButtonText}>
            {Number(item?.avgRating || 0).toFixed(1)} · See ratings
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {item?.details ? <Text style={styles.details}>{item.details}</Text> : null}
        <Row icon="phone" label="Phone" value={item?.phone_number} />
        <Row icon="map-marker" label="Address" value={item?.address} />
        <Row icon="earth" label="State of origin" value={item?.origin} />
        <Row icon="card-account-details" label="NIN" value={item?.nin} />
        <Row
          icon="cake-variant"
          label="Date of birth"
          value={item?.dob ? new Date(item.dob).toDateString() : null}
        />

        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#DC2626" }]}
            onPress={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Delete</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#04973C" }]}
            onPress={makePhoneCall}
          >
            <MaterialCommunityIcons name="phone" size={18} color="white" />
            <Text style={styles.buttonText}>Call now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  hero: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F3FFF3",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E7EB",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 12,
    color: "#111827",
  },
  job: {
    fontSize: 14,
    fontWeight: "600",
    color: "#04973C",
    marginTop: 4,
  },
  ratingButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#C5F3C5",
  },
  ratingButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  body: {
    padding: 24,
  },
  details: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  rowLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  rowValue: {
    fontSize: 15,
    color: "#111827",
    marginTop: 2,
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 32,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "700",
  },
});

export default VendorListDetails;
