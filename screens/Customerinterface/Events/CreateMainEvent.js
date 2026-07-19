import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
} from "react-native";
import React, { useState } from "react";
// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import AppScreen from "../../../components/shared/AppScreen";
import {
  CustomTextArea,
  Formbutton,
  Forminput,
  RadioButton,
} from "../../../components/shared/InputForm";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import { useDispatch, useSelector } from "react-redux";
import {
  formatDate,
  formatDateString,
  ReturnSeprateDateAndTime,
} from "../../../utils/DateTime";
import { splitStringToArray } from "../../../utils";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";

/**
 * @typedef {{ name: string, date: string, time: string, location: string, guestNumber: string }} ResidentEventData
 */

const CreateMainEvent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const [eventname, setEventname] = useState("");
  const [eventcountry, setEventcountry] = useState(""); // Not used
  const [eventlocatiion, setEventlocatiion] = useState("");
  const [numberofguest, setNumberofguest] = useState("");
  const [email, setEmail] = useState(""); // Not used
  const [description, setDescription] = useState(""); // Not used
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date()); // Not used
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false); // Not used

  const onStartChange = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartPicker(Platform.OS === "ios");
    setStartDate(currentDate);
  };

  const onEndChange = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndPicker(Platform.OS === "ios");
    setEndDate(currentDate);
  };

  const toggleStartPicker = () => {
    setShowStartPicker(!showStartPicker);
  };

  const toggleEndPicker = () => {
    setShowEndPicker(!showEndPicker);
  };

  const [selectedOption, setSelectedOption] = useState(1); // Not used
  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  const [free_event, setFree_event] = useState(true); // Not used

  const [profileImage, setProfileImage] = useState(""); // Not used
  const [picFile, setPicFile] = useState(null); // Not used

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      setPicFile(result.assets[0].uri);
    }
  };

  const handlesubmit = () => {
    // --- Validation (Highly recommended before mutation) ---
    if (!eventname.trim() || !eventlocatiion.trim() || !numberofguest.trim()) {
      Toast.show({
        type: "error",
        text1: "Please fill out Event Name, Location, and Guest Number.",
      });
      return;
    }
    // --------------------------------------------------------

    // The utility function ReturnSeprateDateAndTime is used here, adding 7 days by default.
    // If the intent is to use the selected start date, we should pass startDate to the utility.
    // Assuming the current implementation of ReturnSeprateDateAndTime(startDate) is correct for the API.
    const { date, time } = ReturnSeprateDateAndTime(startDate);

    /** @type {ResidentEventData} */
    let newdata = {
      name: eventname,
      date: date,
      time: time,
      location: eventlocatiion,
      guestNumber: numberofguest,
    };

    console.log(newdata);

    Create_Resident_Event_Mutation.mutate(newdata); // Renamed mutation for clarity
  };

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION (Renamed to Create_Resident_Event_Mutation for accuracy) ***

  /**
   * @param {ResidentEventData} data_info - The event data.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const createResidentEventRequest = async (data_info) => {
    let url = `${API_BASEURL}resident-event`;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    return axios.post(url, data_info, config);
  };

  const Create_Resident_Event_Mutation = useMutation({
    mutationFn: createResidentEventRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Event created successfully!",
      });
      // Optionally dispatch a refresh action for the event list
      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.error || "Failed to create event.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, gap: 25 }}>
              <MediumFontText data="Event Name" />
              <Forminput
                placeholder="Event Name"
                onChangeText={setEventname}
                value={eventname}
              />

              <MediumFontText data="Event Date and Time" />
              <View>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    justifyContent: "center",
                    height: 50,
                  }}
                  onPress={toggleStartPicker}
                >
                  <Text>{formatDateString(startDate)}</Text>
                </TouchableOpacity>

                {showStartPicker && (
                  <DateTimePicker
                    testID="startDateTimePicker"
                    value={startDate}
                    mode="datetime"
                    is24Hour={true}
                    display="spinner"
                    onChange={onStartChange}
                  />
                )}
              </View>

              <MediumFontText
                data="Event Location"
                textstyle={{ fontSize: 14 }}
              />
              <Forminput
                placeholder="Event Location"
                onChangeText={setEventlocatiion}
                value={eventlocatiion}
              />
              <MediumFontText
                data="Expected Guests Number"
                textstyle={{ fontSize: 14 }}
              />
              <Forminput
                placeholder="Event Number Guests"
                onChangeText={setNumberofguest}
                value={numberofguest}
                keyboardType="numeric"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={{ marginTop: 10 }}>
          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 16,
            }}
            data="Create Event"
            onPress={handlesubmit}
            icon={<MaterialCommunityIcons name="plus" size={20} color="white" />}
            isLoading={Create_Resident_Event_Mutation.isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default CreateMainEvent;
