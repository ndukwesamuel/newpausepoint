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
import { useMutation } from "react-query";
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
  const [eventcountry, setEventcountry] = useState("");
  const [eventlocatiion, setEventlocatiion] = useState("");
  const [numberofguest, setNumberofguest] = useState("");
  const [email, setEmail] = useState("");
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

  const [selectedOption, setSelectedOption] = useState(1);
  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

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

    if (!result.cancelled) {
      setProfileImage(result.uri);
      setPicFile(result.uri);
      // Handle the image upload and profile update here
      // You may want to send the image to a server and update the user's profile data
    }
  };

  const handlesubmit = () => {
    let event_date = formatDate(startDate);
    let start_event_data = startDate.toISOString();
    let end_event_data = endDate.toISOString();
    let newemal = email;
    const formData = new FormData();

    formData.append("title", eventname);
    formData.append("description", description);
    formData.append("event_date", event_date);
    formData.append("start_time", start_event_data);
    formData.append("end_time", end_event_data);
    formData.append("number_of_guests", numberofguest);
    formData.append("venue", eventlocatiion);
    formData.append("add_guests", newemal);

    // Assuming picFile is an object with a uri property representing the file path
    if (picFile) {
      const uri = picFile;
      const type = "image/jpeg"; // Adjust the type based on the file type
      const name = "photo.jpg"; // Adjust the name as needed
      formData.append("photo", { uri, type, name });
    }

    Create_Private_Event_Mutation.mutate(formData);
  };

  const Create_Private_Event_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}create-event`;

      const config = {
        headers: {
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
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
          // text2: 'Toast message',
        });
      },
    }
  );

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
              {/* <MediumFontText data="Country" />

              <Forminput
                placeholder="Event Country and State"
                onChangeText={setEventcountry}
                value={eventcountry}
              /> */}

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
                data="Expected Guests Number"
                textstyle={{ fontSize: 14 }}
              />
              <Forminput
                placeholder="Event  Number Guests"
                onChangeText={setNumberofguest}
                value={numberofguest}
              />

              <MediumFontText
                data="Enter Guests Email"
                textstyle={{ fontSize: 14 }}
              />
              <CustomTextArea
                placeholder="Enter text here..."
                value={email}
                onChangeText={setEmail}
                // onChangeText={handleTextChange}
                style={{ width: "80%" }}
                inputStyle={{
                  backgroundColor: "#F6F8FAE5",
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  height: 200,
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 16,
                }}
              />
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
            isLoading={Create_Private_Event_Mutation?.isLoading}
          />
        </View>
      </View>
    </View>
  );
};

export default CreatePrivateEvent;
