import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { Feather } from "@expo/vector-icons";

// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import DropDownPicker from "react-native-dropdown-picker";

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
import {
  All_Public_events_Fun,
  Category_Fun,
} from "../../../Redux/UserSide/EventSlice";

// Define the shape of the data for clarity
/**
 * @typedef {FormData} EventCreationFormData
 */

const CreatePublicEvent = () => {
  const dispatch = useDispatch();
  const { category_data } = useSelector((state) => state.EventSlice);
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  // const [category, setCategory] = useState(); // Not used

  const navigation = useNavigation();

  const [eventname, setEventname] = useState("");
  const [eventcountry, setEventcountry] = useState(""); // Not used
  const [eventlocatiion, setEventlocatiion] = useState("");
  const [available_tickets, setAvailable_tickets] = useState("");
  const [email, setEmail] = useState(""); // Not used
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [price, setPrice] = useState("0");

  const [open, setOpen] = useState(false); // DropDownPicker state, but FlatList is used below
  const [value, setValue] = useState(null); // DropDownPicker state, but FlatList is used below
  const [items, setItems] = useState([]); // DropDownPicker state, but FlatList is used below

  const [profileImage, setProfileImage] = useState("");
  const [picFile, setPicFile] = useState(null); // This holds the image URI for the FormData

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri); // Display image
      setPicFile(result.assets[0].uri); // File for upload
    }
  };

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

  const [free_event, setFree_event] = useState(true);
  const handleFree = (option) => {
    setFree_event(option);
  };

  const [selectedOption, setSelectedOption] = useState(""); // This holds the category name

  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  const handlesubmit = () => {
    // --- Validation (Highly recommended before mutation) ---
    if (
      !eventname ||
      !description ||
      !eventlocatiion ||
      !available_tickets ||
      !selectedOption ||
      !picFile
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields and select a flyer.",
      });
      return;
    }
    if (!free_event && price === "0") {
      Toast.show({
        type: "error",
        text1: "Please set a price for a paid event.",
      });
      return;
    }
    // --------------------------------------------------------

    const formData = new FormData();
    // Event date is currently formatted, but the API might prefer ISO strings for starts/ends
    let event_date = formatDate(startDate);

    let start_event_data = startDate.toISOString();
    let end_event_data = endDate.toISOString();

    formData.append("title", eventname);
    formData.append("description", description);
    formData.append("category", selectedOption);
    formData.append("venue", eventlocatiion);
    formData.append("event_date", event_date);
    formData.append("starts", start_event_data);
    formData.append("ends", end_event_data);
    formData.append("price", price);
    formData.append("available_tickets", available_tickets);
    formData.append("isFree", free_event);

    // Append the file (picFile is the URI)
    if (picFile) {
      const uri = picFile;
      // Get filename and type from URI. This is a common pattern for RN/Expo file uploads.
      const filename = uri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image";

      formData.append("photo", {
        uri,
        type,
        name: filename,
      });
    }

    Create_Public_Event_Mutation.mutate(formData);
  };

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***
  /**
   * @param {EventCreationFormData} data_info - The FormData object containing event details and file.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const createPublicEventRequest = async (data_info) => {
    let url = `${API_BASEURL}public-event/create`;

    const config = {
      headers: {
        // Crucially, when using FormData, let Axios and the browser/RN handle the 'Content-Type': 'multipart/form-data'
        // You only need to set the Authorization header
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    return axios.post(url, data_info, config);
  };

  const Create_Public_Event_Mutation = useMutation({
    mutationFn: createPublicEventRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Event created successfully!",
      });
      // Optionally dispatch an action to refetch event list
      dispatch(All_Public_events_Fun());
      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;

      console.log({
        error: axiosError?.response,
      });

      // Determine the best error message to display
      const errorMessage =
        axiosError?.response?.data?.error ||
        axiosError?.response?.data?.errorMsg ||
        "An unknown error occurred while creating the event.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  useEffect(() => {
    // Only dispatch the category fetch, as mapping should happen once data is in Redux
    dispatch(Category_Fun());

    // The mapping logic should typically be done via useSelector/reselect
    // or inside the render if the component uses the Redux state directly.
    // However, since the radio buttons use category_data, the dependency
    // injection for DropDownPicker items can be removed as it's not used.

    return () => {};
  }, [dispatch]);

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
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }} // Add bottom padding for scroll content
            keyboardShouldPersistTaps="handled"
          >
            <View style={{ flex: 1, gap: 25 }}>
              <MediumFontText data="Event Name" />
              <Forminput
                placeholder="Event Name"
                onChangeText={setEventname}
                value={eventname}
              />

              <MediumFontText data="Is Event Free or paid for" />
              <View style={{ flexDirection: "row", gap: 20 }}>
                <RadioButton
                  label="Free Event"
                  selected={free_event === true}
                  onSelect={() => handleFree(true)}
                />

                <RadioButton
                  label="Paid Event"
                  selected={free_event === false}
                  onSelect={() => handleFree(false)} // Fixed: allows user to select paid
                />
              </View>

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
                    width: 100, // Reduced size for better layout
                    height: 100,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "lightgray",
                    overflow: "hidden", // Clip image to border radius
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
                    <Feather name="image" size={30} color="gray" />
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

              {!free_event && (
                <>
                  <MediumFontText
                    data="Tickets Price"
                    textstyle={{ fontSize: 14 }}
                  />
                  <Forminput
                    placeholder="Tickets Price In Naria"
                    onChangeText={setPrice}
                    value={price}
                    keyboardType="numeric"
                  />
                </>
              )}

              <MediumFontText
                data="Number of Tickets Available"
                textstyle={{ fontSize: 14 }}
              />
              <Forminput
                placeholder="Number Tickets Available"
                onChangeText={setAvailable_tickets}
                value={available_tickets}
                keyboardType="numeric"
              />

              <View style={{ marginBottom: 20 }}>
                <MediumFontText
                  data="Select Category"
                  textstyle={{ fontSize: 14, marginBottom: 10 }}
                />
                {category_data?.map((category_item) => (
                  <RadioButton
                    key={category_item?.slug}
                    label={category_item?.name}
                    selected={selectedOption === category_item?.name}
                    onSelect={() => handleRadioSelect(category_item?.name)}
                    inputStyle={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  />
                ))}
              </View>
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
            isLoading={Create_Public_Event_Mutation.isLoading} // Use isLoading from destructured mutation
          />
        </View>
      </View>
    </View>
  );
};

export default CreatePublicEvent;
