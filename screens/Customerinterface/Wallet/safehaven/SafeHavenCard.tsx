import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../../hooks/Requestv2";

const SafeHavenCard = () => {
  const navigation = useNavigation();

  // Fetch virtual account data
  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    error: virtualAccountError,
  } = useFetchData_v2("api/v1/savehaven", "virtual-account");

  // ✅ Check if data is an object (not an array)
  const hasAccount =
    virtualAccountData?.data &&
    Object.keys(virtualAccountData?.data).length > 0;

  // ✅ If loading, show nothing (or show loading if you prefer)
  if (isLoadingVirtualAccount) {
    return null; // Or return loading indicator if you want
  }

  // ✅ If user HAS account, don't show anything
  if (hasAccount) {
    return null;
  }

  // ✅ ONLY show card when user has NO account
  return (
    <TouchableOpacity
      style={styles.noAccountCard}
      onPress={() => navigation.navigate("CreateVirtualAccount")}
      activeOpacity={0.7}
    >
      <View style={styles.iconCircle}>
        <MaterialCommunityIcons name="bank-plus" size={32} color="#10B981" />
      </View>

      <View style={styles.noAccountContent}>
        <Text style={styles.noAccountTitle}>Create Virtual Account</Text>
        <Text style={styles.noAccountDescription}>
          Get instant funding from any bank
        </Text>
      </View>

      <MaterialIcons name="arrow-forward-ios" size={20} color="#9CA3AF" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // No Account Card
  noAccountCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#D1FAE5",
    borderStyle: "dashed",
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },
  noAccountContent: {
    flex: 1,
    marginLeft: 16,
  },
  noAccountTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 2,
  },
  noAccountDescription: {
    fontSize: 13,
    color: "#6B7280",
  },
});

export default SafeHavenCard;
