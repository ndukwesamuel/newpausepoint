import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  AntDesign,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import AppScreen from "../../../components/shared/AppScreen";
import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";

const Myclan = ({ navigation }) => {
  // const { user_data, user_isLoading } = useSelector((state) => state.AuthSlice);

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.container}>
          {/* Your Estates Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="location-city" size={24} color="#3498db" />
              <MediumFontText
                data="All Communities You Live In"
                textstyle={styles.sectionTitle}
              />
            </View>
            <RegularFontText
              data="Join, where modern luxury meets timeless charm. Enjoy exquisite residences, world-class amenities, and a sense of community in a secure, exclusive environment"
              textstyle={styles.sectionDescription}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("alluserclan")}
              style={styles.primaryButton}
            >
              <RegularFontText
                data="View All Communities"
                textstyle={styles.buttonText}
              />
              <MaterialIcons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Join Community Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#e74c3c"
              />
              <MediumFontText
                data="Join A Community"
                textstyle={styles.sectionTitle}
              />
            </View>
            <RegularFontText
              data="Connect with neighbors and enjoy shared amenities. Find your perfect community that matches your lifestyle and preferences."
              textstyle={styles.sectionDescription}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate("joinclan")}
              style={[styles.primaryButton, { backgroundColor: "#e74c3c" }]}
            >
              <RegularFontText
                data="Explore Communities"
                textstyle={styles.buttonText}
              />
              <MaterialIcons name="search" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </AppScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20, // Added paddingVertical
    backgroundColor: "#f5f5f5",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginLeft: 10,
    color: "#2c3e50",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginLeft: 10,
    color: "#2c3e50",
  },
  sectionDescription: {
    fontSize: 14,
    color: "#7f8c8d",
    lineHeight: 20,
    marginBottom: 15,
  },
  primaryButton: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
    marginRight: 10,
  },
});

export default Myclan;
