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
import React, { useState } from "react";
import {
  CustomTextArea,
  Forminput,
  Forminput_Icon,
} from "../../../components/shared/InputForm";
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
import {
  BottomModal,
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";
// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
import axios from "axios";
import Toast from "react-native-toast-message";

// Define the expected mutation data structure
/**
 * @typedef {{ name: string, description: string }} EstateCreationData
 */

const Myclan = ({ navigation }) => {
  // const { user_data, user_isLoading } = useSelector((state) => state.AuthSlice);

  // Modal for creating a new clan/estate
  const [isModalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  /**
   * Mutation function to create a new estate.
   * @param {EstateCreationData} data_info - The name and description for the new estate.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const createEstateRequest = async (data_info) => {
    let url = `${API_BASEURL}clan`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // Authorization: `Bearer ${user_data?.token}`,
      },
    };
    return axios.post(url, data_info, config);
  };

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***
  const Crate_Estate_Mutation = useMutation({
    mutationFn: createEstateRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Estate created successfully",
        text2: `Waiting for Admin to Approve`,
      });
      setModalVisible(false);
      setName("");
      setText("");
      // Optionally invalidate a query for the list of my clans here if needed
      // queryClient.invalidateQueries(['myClans']);
    },
    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.error || "An unexpected error occurred.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  const handleEstate = () => {
    if (!name.trim() || !text.trim()) {
      Toast.show({
        type: "info",
        text1: "Please provide both name and description.",
      });
      return;
    }
    let data = {
      name: name,
      description: text,
    };
    Crate_Estate_Mutation.mutate(data);
  };

  // Destructure isLoading from the mutation
  const { isLoading: isCreatingEstate } = Crate_Estate_Mutation;

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

      {/* Modal for creating a new estate/clan */}
      <BottomModal
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Estate/Clan</Text>
          <Forminput
            placeholder="Estate/Clan Name"
            value={name}
            onChangeText={setName}
          />
          <CustomTextArea
            placeholder="Description (Max 150 words)"
            value={text}
            onChangeText={setText}
            numberOfLines={5}
          />
          <TouchableOpacity
            onPress={handleEstate}
            style={styles.modalButton}
            disabled={isCreatingEstate}
          >
            {isCreatingEstate ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <RegularFontText
                data="Submit For Approval"
                textstyle={styles.modalButtonText}
              />
            )}
          </TouchableOpacity>
        </View>
      </BottomModal>
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
  modalContent: {
    padding: 20,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  modalButton: {
    backgroundColor: "#3498db",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Myclan;
