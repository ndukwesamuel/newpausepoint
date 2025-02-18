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
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
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
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  console.log({
    aaa: userProfile_data?.currentClanMeeting?._id,
  });
  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };
  const [formData, setFormData] = useState({
    visitation_id: "",
    arrivalDate: new Date(), // Initial value is the current date and time
    departureDate: new Date(), // Initial value is the current date and time
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

  const handleSubmit = () => {
    if (selectedOption === 1) {
      formData.gender = "Male";
    } else {
      formData.gender = "Female";
    }

    Guests_Mutation.mutate({
      clan: userProfile_data?.currentClanMeeting?._id,
      arraval: formData?.arrivalDate,
      expires: formData?.departureDate,
      visitor_name: formData?.visitor_name,
      gender: formData?.gender,
      phone_number: formData?.phone_number,
    });
  };

  console.log({
    aaaa: userProfile_data,
  });

  const Guests_Mutation = useMutation(
    (data_info) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url;
      if (formData?.visitation_id) {
        url = `${API_BASEURL}visitor/modify/${formData?.visitation_id}`;

        return axios.patch(url, data_info, config);
      } else {
        url = `${API_BASEURL}visitor/generate-access-code/${data_info?.clan}`;

        return axios.post(url, data_info, config);
      }
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: " successfully ",
        });

        if (formData?.visitation_id) {
          dispatch(Get__User_Guest_detail_Fun(formData?.visitation_id));
        }
        dispatch(Get_All_User_Guest_Fun());

        // setTurnmodal(false);
        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          aaa: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  useEffect(() => {
    // Check if there's a guest ID in the route parameters
    const guestId = route.params?.itemdata;

    if (guestId) {
      // Fetch guest details using the guestId and update the form data
      // dispatch(fetchGuestDetails(guestId)).then((guestDetails) => {
      setFormData({
        visitation_id: guestId?._id,
        arrivalDate: new Date(),
        departureDate: new Date(guestId.expires),
        visitor_name: guestId.visitor_name,
        gender: guestId.gender === "Male" ? 1 : 2,
        phone_number: `${guestId.phone_number}`,
      });
      // });
    }
  }, [route.params?.guestId]);
  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            // paddingTop: 20,
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
            {/* Add more options as needed */}
          </View>
          <View style={{ marginTop: 20 }}>
            <RegularFontText data="Arrival Date" />
            {/* Arrival Date */}
            {Platform.OS === "android" ? (
              <>
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
                  }}
                  onPress={() => showAndroidDatePicker("arrivalDate")}
                >
                  <Text>{formatDateString(formData.arrivalDate)}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
                  }}
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

          <View style={{ marginTop: 20 }}>
            {/* Departure Date */}
            <RegularFontText data="Departure Date" />
            {Platform.OS === "android" ? (
              // <Button
              //   title="Select Departure Date"
              //   onPress={() => showAndroidDatePicker("departureDate")}
              // />

              <TouchableOpacity
                style={{
                  // borderWidth: 1,
                  padding: 10,
                  borderRadius: 5,
                  fontSize: 16,
                  backgroundColor: "#F6F8FAE5",
                  // opacity: 0.4
                }}
                onPress={() => showAndroidDatePicker("departureDate")}
              >
                <Text>{formatDateString(formData.departureDate)}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
                  }}
                  onPress={() => showDatePickerModal("departureDate")}
                >
                  <Text>{formatDateString(formData.departureDate)}</Text>
                </TouchableOpacity>
                {/* <Button
                  title="Select Departure Date"
                  onPress={() => showDatePickerModal("departureDate")}
                /> */}
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
            data="Submit"
            onPress={handleSubmit}
            // icon={<AntDesign name="plus" size={24} color="white" />}
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
});
