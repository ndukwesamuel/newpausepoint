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
import { formatDate, formatDateString } from "../../../utils/DateTime";
import { splitStringToArray } from "../../../utils";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";

/**
 * @typedef {FormData} PrivateEventCreationFormData
 */

const CreatePrivateEvent = () => {
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
  const [eventcountry, setEventcountry] = useState(""); // Not used in form
  const [eventlocatiion, setEventlocatiion] = useState("");
  const [numberofguest, setNumberofguest] = useState("");
  const [email, setEmail] = useState(""); // List of guest emails
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

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

  // State for radio buttons (selectedOption) is defined but not used in form
  const [selectedOption, setSelectedOption] = useState(1);
  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  // State for free_event is defined but not used in form
  const [free_event, setFree_event] = useState(true);

  const [profileImage, setProfileImage] = useState("");
  const [picFile, setPicFile] = useState(null);

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
    if (
      !eventname.trim() ||
      !description.trim() ||
      !eventlocatiion.trim() ||
      !numberofguest.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill out all required fields.",
      });
      return;
    }
    // --------------------------------------------------------

    let event_date = formatDate(startDate);
    let start_event_data = startDate.toISOString();
    let end_event_data = endDate.toISOString();
    let newemal = email; // Guest emails list

    const formData = new FormData();

    formData.append("title", eventname);
    formData.append("description", description);
    formData.append("event_date", event_date); // Note: API might prefer ISO string for date/time fields
    formData.append("start_time", start_event_data);
    formData.append("end_time", end_event_data);
    formData.append("number_of_guests", numberofguest);
    formData.append("venue", eventlocatiion);
    // Assuming 'add_guests' takes a comma-separated string of emails
    formData.append("add_guests", newemal);

    // Append the file
    if (picFile) {
      const uri = picFile;
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("photo", {
        uri,
        type,
        name: filename,
      });
    }

    Create_Private_Event_Mutation.mutate(formData);
  };

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***
  /**
   * @param {PrivateEventCreationFormData} data_info - The FormData object.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const createPrivateEventRequest = async (data_info) => {
    let url = `${API_BASEURL}create-event`; // This URL seems generic; check if a specific private event URL exists

    const config = {
      headers: {
        // Crucially, when using FormData, let Axios and the browser/RN handle the 'Content-Type': 'multipart/form-data'
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    return axios.post(url, data_info, config);
  };

  const Create_Private_Event_Mutation = useMutation({
    mutationFn: createPrivateEventRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Event created successfully! Guests will be invited.",
      });
      // You may want to dispatch a refresh action here if you have a list of events
      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.error || "Failed to create private event.";

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

              <MediumFontText data="Event Description" />

              <CustomTextArea
                placeholder="Enter text here..."
                value={description}
                onChangeText={setDescription}
                inputStyle={{
                  backgroundColor: "#F6F8FAE5",
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  height: 100,
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 16,
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    overflow: "hidden",
                  }}
                  onPress={pickImage}
                >
                  {profileImage ? (
                    <Image
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                      }}
                      source={{ uri: profileImage }}
                    />
                  ) : (
                    <AntDesign name="camerao" size={30} color="gray" />
                  )}
                </TouchableOpacity>

                <MediumFontText data="Event Flyer (Tap to select)" />
              </View>

              <MediumFontText data="Event Time" />
              <View>
                <RegularFontText data="Start Date & Time" />
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

              <View>
                <RegularFontText data="End Date & Time" />

                <TouchableOpacity
                  style={{
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    justifyContent: "center",
                    height: 50,
                  }}
                  onPress={toggleEndPicker}
                >
                  <Text>{formatDateString(endDate)}</Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    testID="endDateTimePicker"
                    value={endDate}
                    mode="datetime"
                    is24Hour={true}
                    display="spinner"
                    onChange={onEndChange}
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

              <MediumFontText
                data="Enter Guests Email (one per line, or comma separated)"
                textstyle={{ fontSize: 14 }}
              />
              <CustomTextArea
                placeholder="Enter guest emails here..."
                value={email}
                onChangeText={setEmail}
                inputStyle={{
                  backgroundColor: "#F6F8FAE5",
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  height: 150, // Reduced height slightly
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 16,
                }}
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
            icon={<AntDesign name="plus" size={20} color="white" />}
            isLoading={Create_Private_Event_Mutation.isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default CreatePrivateEvent;
