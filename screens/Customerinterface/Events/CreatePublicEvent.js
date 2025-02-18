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

import { useMutation } from "react-query";
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
  const [category, setCategory] = useState();

  const navigation = useNavigation();

  const [eventname, setEventname] = useState("");
  const [eventcountry, setEventcountry] = useState("");
  const [eventlocatiion, setEventlocatiion] = useState("");
  const [available_tickets, setAvailable_tickets] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [price, setPrice] = useState("0");

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);

  const [profileImage, setProfileImage] = useState("");

  const [picFile, setPicFile] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
      setPicFile(result.uri);
      // Handle the image upload and profile update here
      // You may want to send the image to a server and update the user's profile data
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

  const [selectedOption, setSelectedOption] = useState("");

  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  const handlesubmit = () => {
    const formData = new FormData();
    let event_date = formatDate(startDate);
    console.log("working ");

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

    // Assuming picFile is an object with a uri property representing the file path
    if (picFile) {
      const uri = picFile;
      const type = "image/jpeg"; // Adjust the type based on the file type
      const name = "photo.jpg"; // Adjust the name as needed
      formData.append("photo", { uri, type, name });
    }

    Create_Public_Event_Mutation.mutate(formData);
  };

  const Create_Public_Event_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}public-event/create`;

      const config = {
        headers: {
          // "Content-Type": "application/json",
          // Accept: "application/json",
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Event created successfully!",
        });
        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          error: error?.response,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error} `,
          text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  useEffect(() => {
    dispatch(Category_Fun());

    const mappedItems = category_data?.map((category_item) => ({
      label: category_item?.name,
      value: category_item?.slug, // You can use any unique identifier here
    }));

    setItems(mappedItems);

    return () => {};
  }, []);

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      {/* <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          > */}

      <View style={{ flex: 1, padding: 20 }}>
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
          style={{ flex: 1, backgroundColor: "white" }}
        >
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled" // or "always"
          >
            <View style={{ flex: 1, gap: 25 }}>
              <MediumFontText data="Event Name" />

              <Forminput
                placeholder="Event Name"
                onChangeText={setEventname}
                value={eventname}
              />

              <MediumFontText data="Is Event Free or paid for  " />

              <View style={{}}>
                <RadioButton
                  label="Free Event"
                  selected={free_event === true}
                  onSelect={() => handleFree(true)}
                />

                <RadioButton
                  label="Paid Event"
                  selected={free_event === false}
                  // onSelect={() => handleFree(false)}
                />
              </View>
              <MediumFontText data="Event Descripttion" />

              <CustomTextArea
                placeholder="Enter text here..."
                value={description}
                onChangeText={setDescription}
                // onChangeText={handleTextChange}
                style={{ width: "80%" }}
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
                  // justifyContent: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 100,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: "black",
                  }}
                  onPress={pickImage}
                >
                  <Image
                    // className="w-40 h-40 rounded-full"
                    style={{ width: 200, height: 200 }}
                    source={{
                      uri:
                        profileImage ||
                        "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSO9Xd_NJYU1FU2u886CDMp-pX-nffkmg_h0yhAKgLWCltFmAbQnt_nGdpEPgQZMZzw1k_pGxWjlD3U_Yk",
                    }}
                    //   style={{ width: 200, height: 200, borderRadius: 100 }}
                  />
                </TouchableOpacity>

                <MediumFontText data="Event Flyer" />
              </View>

              <MediumFontText data="Event Time" />
              <View>
                <RegularFontText data="Start Date" />
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
                  }}
                  onPress={toggleStartPicker}
                >
                  <Text>{formatDateString(startDate)}</Text>
                </TouchableOpacity>
                {/* <Text>{startDate.toDateString()}</Text> */}

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
                <RegularFontText data="End Date" />

                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
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
                data="   Tickets Price"
                textstyle={{ fontSize: 14 }}
              />

              {!free_event && (
                <Forminput
                  placeholder="   Tickets Price In Naria"
                  onChangeText={setPrice}
                  value={price}
                />
              )}

              <MediumFontText
                data="  Number  Tickets Available"
                textstyle={{ fontSize: 14 }}
              />
              <Forminput
                placeholder="  Number  Tickets Available"
                onChangeText={setAvailable_tickets}
                value={available_tickets}
              />

              <View>
                <MediumFontText
                  data="Select  Category "
                  textstyle={{ fontSize: 14, marginBottom: 10 }}
                />
                {category_data?.map((category_item) => (
                  <RadioButton
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

        <View style={{}}>
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
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Create Event"
            onPress={handlesubmit}
            icon={<AntDesign name="plus" size={24} color="white" />}
            isLoading={Create_Public_Event_Mutation?.isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default CreatePublicEvent;
