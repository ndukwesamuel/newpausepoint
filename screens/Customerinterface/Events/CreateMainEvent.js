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
    // Example usage
    const { date, time } = ReturnSeprateDateAndTime(startDate, 7); // Adds 7 days and sets time to 9:00AM by default

    let newdata = {
      name: eventname,
      date: date,
      time: time,
      location: eventlocatiion,
      guestNumber: numberofguest,
    };

    console.log(newdata);

    Create_Private_Event_Mutation.mutate(newdata);
  };

  const Create_Private_Event_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}resident-event`;

      const config = {
        headers: {
          "Content-Type": "application/json",
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
              <MediumFontText data="Event Name " />
              <Forminput
                placeholder="Event Name"
                onChangeText={setEventname}
                value={eventname}
              />

              <MediumFontText data="Event Time" />
              <View>
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

export default CreateMainEvent;
