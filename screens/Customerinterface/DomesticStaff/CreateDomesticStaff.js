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

  const [showDatePicker, setShowDatePicker] = useState(false);

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
    Guests_Mutation.mutate({
      staffName: formData.staffName,
      gender: formData.gender,
      phone: formData.phone,
      dateOfBirth: formData.dateOfBirth,
      homeAddress: formData.homeAddress,
      Role: formData.Role,
      workingHours: formData.workingHours,
    });
  };

  const Guests_Mutation = useMutation(
    (data_info) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url = `${API_BASEURL}domesticstaff`;

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
