import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  Button,
  KeyboardAvoidingView,
  Platform,
  DatePickerAndroid,
  StyleSheet,
  TouchableOpacity,
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
import { formatDateString } from "../../../utils/DateTime";
import LottieView from "lottie-react-native"; // Not used directly

// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";
import {
  Get_All_User_Guest_Fun,
  Get__User_Guest_detail_Fun,
} from "../../../Redux/UserSide/GuestSlice";

const CreateGuests = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(1);
  const { user_data } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  // console.log({ aaa: userProfile_data?.currentClanMeeting?._id }); // Commented out

  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  const [formData, setFormData] = useState({
    visitation_id: "",
    arrivalDate: new Date(),
    departureDate: new Date(),
    visitor_name: "",
    gender: selectedOption,
    phone_number: "",
  });

  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const showAndroidDatePicker = async (field) => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        date: formData[field],
        mode: "spinner",
      });

      if (action === DatePickerAndroid.dateSetAction) {
        const selectedDate = new Date(year, month, day);
        setFormData({
          ...formData,
          [field]: selectedDate,
        });
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  const showDatePickerModal = (field) => {
    if (field === "arrivalDate") {
      setShowArrivalDatePicker(true);
    } else {
      setShowDepartureDatePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate, field) => {
    if (Platform.OS === "ios") {
      // Hide the picker on iOS immediately
      if (field === "arrivalDate") {
        setShowArrivalDatePicker(false);
      } else {
        setShowDepartureDatePicker(false);
      }
    }

    if (selectedDate) {
      setFormData({
        ...formData,
        [field]: selectedDate,
      });
    }
  };

  // --- TanStack Query useMutation for Guests ---
  const Guests_Mutation = useMutation({
    mutationFn: (data_info) => {
      // 'mutationFn' replaces the function passed directly to useMutation
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url;
      if (formData?.visitation_id) {
        // Modification (PATCH)
        url = `${API_BASEURL}visitor/modify/${formData?.visitation_id}`;
        return axios.patch(url, data_info, config);
      } else {
        // Creation (POST)
        url = `${API_BASEURL}visitor/generate-access-code/${data_info?.clan}`;
        return axios.post(url, data_info, config);
      }
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Guest record successfully processed",
      });

      if (formData?.visitation_id) {
        dispatch(Get__User_Guest_detail_Fun(formData?.visitation_id));
      }
      // Re-fetch the list of guests via Redux
      dispatch(Get_All_User_Guest_Fun());

      navigation.goBack();
    },

    onError: (error) => {
      // console.log({ aaa: error?.response?.data }); // Commented out
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });
  // -------------------------------------------------------

  const handleSubmit = () => {
    // Set gender based on radio button
    const genderValue = selectedOption === 1 ? "Male" : "Female";

    // Call mutation with required data
    Guests_Mutation.mutate({
      clan: userProfile_data?.currentClanMeeting?._id,
      arraval: formData?.arrivalDate,
      expires: formData?.departureDate,
      visitor_name: formData?.visitor_name,
      gender: genderValue,
      phone_number: formData?.phone_number,
    });
  };

  useEffect(() => {
    // Check if there's a guest ID in the route parameters
    const guestId = route.params?.itemdata;

    if (guestId) {
      // Pre-fill form for modification
      setFormData({
        visitation_id: guestId?._id,
        // The original code uses new Date() for arrivalDate on edit, keeping it for consistency
        arrivalDate: new Date(guestId.arraval),
        departureDate: new Date(guestId.expires),
        visitor_name: guestId.visitor_name,
        // Set selectedOption for radio button
        gender: guestId.gender === "Male" ? 1 : 2,
        phone_number: `${guestId.phone_number}`,
      });
      // Set the radio button state too
      setSelectedOption(guestId.gender === "Male" ? 1 : 2);
    }
  }, [route.params?.itemdata]); // Use itemdata as the dependency

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
          }}
        >
          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Name" />
            <Forminput
              placeholder="Visitor Name"
              value={formData.visitor_name}
              onChangeText={(value) => handleInputChange("visitor_name", value)}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Phone Number" />
            <Forminput
              placeholder="Phone Number"
              value={formData.phone_number}
              onChangeText={(value) => handleInputChange("phone_number", value)}
              keyboardType="phone-pad" // Added keyboard type for phone number
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <Text>Choose an option:</Text>
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

          {/* Arrival Date Picker */}
          <View style={{ marginTop: 20 }}>
            <RegularFontText data="Arrival Date" />
            {Platform.OS === "android" ? (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => showAndroidDatePicker("arrivalDate")}
              >
                <Text>{formatDateString(formData.arrivalDate)}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => showDatePickerModal("arrivalDate")}
                >
                  <Text>{formatDateString(formData.arrivalDate)}</Text>
                </TouchableOpacity>

                {showArrivalDatePicker && (
                  <DateTimePicker
                    value={formData.arrivalDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) =>
                      handleDateChange(event, selectedDate, "arrivalDate")
                    }
                  />
                )}
              </>
            )}
          </View>

          {/* Departure Date Picker */}
          <View style={{ marginTop: 20 }}>
            <RegularFontText data="Departure Date" />
            {Platform.OS === "android" ? (
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => showAndroidDatePicker("departureDate")}
              >
                <Text>{formatDateString(formData.departureDate)}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => showDatePickerModal("departureDate")}
                >
                  <Text>{formatDateString(formData.departureDate)}</Text>
                </TouchableOpacity>
                {showDepartureDatePicker && (
                  <DateTimePicker
                    value={formData.departureDate}
                    mode="datetime"
                    display="default"
                    onChange={(event, selectedDate) =>
                      handleDateChange(event, selectedDate, "departureDate")
                    }
                  />
                )}
              </>
            )}
          </View>

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              marginTop: 30,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data={
              formData?.visitation_id ? "Update Guest" : "Generate Access Code"
            }
            onPress={handleSubmit}
            isLoading={Guests_Mutation?.isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateGuests;

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "lightgray",
    marginRight: 10,
  },
  dateInput: {
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#F6F8FAE5",
  },
});
