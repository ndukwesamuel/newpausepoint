import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import { Ionicons, AntDesign } from "@expo/vector-icons";

import {
  FormLabel,
  Formbutton,
  Forminput,
  RadioButton,
} from "../../../components/shared/InputForm";
import AppScreen from "../../../components/shared/AppScreen";
import { RegularFontText } from "../../../components/shared/Paragrahp";
import LottieView from "lottie-react-native";
// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Get_All_Domestic_Fun,
  Get_All_User_Guest_Fun,
  Get__User_Guest_detail_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import { Image } from "react-native";

/**
 * @typedef {FormData} DomesticStaffFormData
 */

const CreateDomesticStaff = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(1); // 1: Male, 2: Female
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const [formData, setFormData] = useState({
    staffName: "",
    gender: "Male", // Initialize with default radio button value
    phone: "",
    dateOfBirth: new Date(),
    homeAddress: "",
    Role: "",
    workingHours: "",
  });
  const [images, setImages] = useState(""); // Holds URI of the selected photo

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages(result.assets[0].uri);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setFormData({
        ...formData,
        dateOfBirth: selectedDate,
      });
      setShowDatePicker(Platform.OS === "ios"); // Only hide immediately on non-iOS
    } else {
      setShowDatePicker(false);
    }
  };

  const handleRadioSelect = (option) => {
    setSelectedOption(option);
    setFormData({
      ...formData,
      gender: option === 1 ? "Male" : "Female",
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (
      !formData.staffName ||
      !formData.phone ||
      !formData.homeAddress ||
      !formData.Role ||
      !formData.workingHours ||
      !images
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all fields and select a photo.",
      });
      return;
    }

    const data = new FormData();
    data.append("staffName", formData.staffName);
    data.append("gender", formData.gender);
    data.append("phone", formData.phone);
    data.append(
      "dateOfBirth",
      formData.dateOfBirth.toISOString().split("T")[0],
    );
    data.append("homeAddress", formData.homeAddress);
    data.append("Role", formData.Role);
    data.append("workingHours", formData.workingHours);

    // --- Corrected file handling for multipart/form-data ---
    if (images) {
      const uri = images;
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const fileType = match ? `image/${match[1]}` : "image";

      // Ensure the server expects 'photo' or 'images'. The old code used 'images',
      // but typical API expects singular 'photo'. Sticking to original 'images' name for now.
      data.append("images", {
        uri,
        name: filename,
        type: fileType,
      });
    }
    // --------------------------------------------------------

    Guests_Mutation.mutate(data);
  };

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***

  /**
   * @param {DomesticStaffFormData} data_info - The FormData object.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const createDomesticStaffRequest = async (data_info) => {
    const config = {
      headers: {
        // IMPORTANT: Do NOT manually set 'Content-Type': 'multipart/form-data'.
        // Let Axios handle it for proper boundary generation.
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    let url = `${API_BASEURL}api/v1/domestic`;

    return axios.post(url, data_info, config);
  };

  const Guests_Mutation = useMutation({
    mutationFn: createDomesticStaffRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Staff created successfully",
      });

      // Refresh the staff list
      dispatch(Get_All_Domestic_Fun());

      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.message || "Failed to create staff.";

      console.log({
        nnn: axiosError?.response?.data,
      });

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <TouchableOpacity
              onPress={pickImage}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
              }}
            >
              <Image
                source={{
                  uri:
                    images ||
                    "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
                }}
                style={styles.profileImage}
              />
              <Text
                style={{ marginTop: 10, color: "#04973C", fontWeight: "bold" }}
              >
                Tap to Select Photo
              </Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Staff Name" />
              <Forminput
                placeholder="Enter Staff Name"
                value={formData.staffName}
                onChangeText={(value) => handleInputChange("staffName", value)}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Phone Number" />
              <Forminput
                placeholder="Enter Phone Number"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <Text style={styles.radioTitle}>Choose Gender:</Text>
              <View style={{ flexDirection: "row", gap: 20 }}>
                <RadioButton
                  label="Male"
                  selected={selectedOption === 1}
                  onSelect={() => handleRadioSelect(1)}
                />
                <RadioButton
                  label="Female"
                  selected={selectedOption === 2}
                  onSelect={() => handleRadioSelect(2)}
                />
              </View>
            </View>

            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Date of Birth" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showDatePickerModal}
              >
                <Text>{formData.dateOfBirth.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={{ marginBottom: 15, marginTop: 15 }}>
              <FormLabel data="Home Address" />
              <Forminput
                placeholder="Enter Staff Home Address"
                value={formData.homeAddress}
                onChangeText={(value) =>
                  handleInputChange("homeAddress", value)
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Role" />
              <Forminput
                placeholder="Enter Staff Role (e.g., Maid, Driver)"
                value={formData.Role}
                onChangeText={(value) => handleInputChange("Role", value)}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Working Hours" />
              <Forminput
                placeholder="Enter Working Hours (e.g., 9am - 5pm)"
                value={formData.workingHours}
                onChangeText={(value) =>
                  handleInputChange("workingHours", value)
                }
              />
            </View>

            <Formbutton
              buttonStyle={styles.submitButton}
              textStyle={styles.submitButtonText}
              data={Guests_Mutation.isPending ? "" : "Submit"}
              onPress={handleSubmit}
              isLoading={Guests_Mutation.isPending}
            >
              {Guests_Mutation.isPending && <ActivityIndicator color="white" />}
            </Formbutton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateDomesticStaff;

const styles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  radioTitle: {
    marginBottom: 5,
    fontWeight: "bold",
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F6F8FAE5",
    height: 50,
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#04973C",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
    minHeight: 50,
    justifyContent: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
  },
});
