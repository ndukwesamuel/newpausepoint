import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { useMutation } from "react-query";
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

const CreateDomesticStaff = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(1);
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  // Updated formData to match new structure
  const [formData, setFormData] = useState({
    staffName: "",
    gender: selectedOption,
    phone: "",
    dateOfBirth: new Date(),
    homeAddress: "",
    Role: "",
    workingHours: "",
  });
  const [images, setImages] = useState(""); // Changed from profileImage to images array

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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
    // const formData = new FormData();
    // formData.append("staffName", formData?.staffName);
    // formData.append("gender", formData?.gender);
    // formData.append("phone", formData?.phone);
    // formData.append("dateOfBirth", formData?.dateOfBirth);
    // formData.append("homeAddress", formData?.homeAddress);
    // formData.append("Role", formData.Role);
    // formData.append("workingHours", formData?.workingHours);

    // if (images) {
    //   const uri = images;
    //   const type = "image/jpeg"; // Adjust the type based on the file type
    //   const name = "photo.jpg"; // Adjust the name as needed
    //   formData.append("photo", { uri, type, name });
    // }

    // Guests_Mutation.mutate(formData);

    const data = new FormData();
    data.append("staffName", formData.staffName);
    data.append("gender", formData.gender);
    data.append("phone", formData.phone);
    data.append(
      "dateOfBirth",
      formData.dateOfBirth.toISOString().split("T")[0]
    );
    data.append("homeAddress", formData.homeAddress);
    data.append("Role", formData.Role);
    data.append("workingHours", formData.workingHours);

    // if (images) {
    //   const uriParts = images.split(".");
    //   const fileType = uriParts[uriParts.length - 1];
    //   data.append("photo", {
    //     uri: images,
    //     name: `photo.${fileType}`,
    //     type: `image/${fileType}`,
    //   });
    // }

    if (images) {
      const uri = images;
      const type = "image/jpeg"; // Adjust the type based on the file type
      const name = "photo.jpg"; // Adjust the name as needed
      data.append("images", { uri, type, name });
    }

    Guests_Mutation.mutate(data);
  };

  const Guests_Mutation = useMutation(
    (data_info) => {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url = `${API_BASEURL}api/v1/domestic`;

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Staff created successfully",
        });

        dispatch(Get_All_Domestic_Fun());

        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          nnn: error?.response?.data,
        });

        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
        });
      },
    }
  );

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "10"}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          onPress={pickImage}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{
              uri:
                images ||
                "https://t4.ftcdn.net/jpg/02/44/43/69/360_F_244436923_vkMe10KKKiw5bjhZeRDT05moxWcPpdmb.jpg",
            }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />

          {/* <Text>{userProfile_data?.user?.email}</Text> */}
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
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
              />
            </View>

            <View style={{ marginTop: 15 }}>
              <Text>Choose Gender:</Text>
              <RadioButton
                label="Male"
                selected={selectedOption === 1}
                onSelect={() => handleRadioSelect(1)}
              />
              <RadioButton
                label="Female"
                selected={selectedOption === 2}
                onSelect={() => handleRadioSelect(2)}
                inputStyle={styles.radioButton}
              />
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

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Home Address" />
              <Forminput
                placeholder="Enter Home Address"
                value={formData.homeAddress}
                onChangeText={(value) =>
                  handleInputChange("homeAddress", value)
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Role" />
              <Forminput
                placeholder="Enter Staff Role"
                value={formData.Role}
                onChangeText={(value) => handleInputChange("Role", value)}
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Working Hours" />
              <Forminput
                placeholder="Enter Working Hours"
                value={formData.workingHours}
                onChangeText={(value) =>
                  handleInputChange("workingHours", value)
                }
              />
            </View>

            <Formbutton
              buttonStyle={styles.submitButton}
              textStyle={styles.submitButtonText}
              data="Submit"
              onPress={handleSubmit}
              isLoading={Guests_Mutation?.isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateDomesticStaff;

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#F6F8FAE5",
  },
  submitButton: {
    backgroundColor: "#04973C",
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 30,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "RobotoSlab-Medium",
  },
});
