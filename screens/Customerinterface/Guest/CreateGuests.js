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
import { formatDateString } from "../../../utils/DateTime";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
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
    location: "",
  });

  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const showDatePickerModal = (field, type) => {
    if (field === "arrivalDate") {
      type === "date"
        ? setShowArrivalDatePicker(true)
        : setShowArrivalTimePicker(true);
    } else {
      type === "date"
        ? setShowDepartureDatePicker(true)
        : setShowDepartureTimePicker(true);
    }
  };

  const handleDateChange = (event, selectedDate, field, type) => {
    if (type === "date") {
      if (selectedDate) {
        setFormData({
          ...formData,
          [field]: new Date(
            formData[field].setFullYear(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            )
          ),
        });
      }
      if (field === "arrivalDate") {
        setShowArrivalDatePicker(false);
      } else {
        setShowDepartureDatePicker(false);
      }
    } else {
      if (selectedDate) {
        setFormData({
          ...formData,
          [field]: new Date(
            formData[field].setHours(
              selectedDate.getHours(),
              selectedDate.getMinutes()
            )
          ),
        });
      }
      if (field === "arrivalDate") {
        setShowArrivalTimePicker(false);
      } else {
        setShowDepartureTimePicker(false);
      }
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
      location: formData?.location,
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
        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          dfdf: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
        });
      },
    }
  );

  useEffect(() => {
    const guestId = route.params?.itemdata;

    if (guestId) {
      setFormData({
        visitation_id: guestId?._id,
        arrivalDate: new Date(),
        departureDate: new Date(guestId.expires),
        visitor_name: guestId.visitor_name,
        gender: guestId.gender === "Male" ? 1 : 2,
        phone_number: `${guestId.phone_number}`,
      });
    }
  }, [route.params?.guestId]);

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "10"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Name" />
              <Forminput
                placeholder="Visitor Name"
                value={formData.visitor_name}
                onChangeText={(value) =>
                  handleInputChange("visitor_name", value)
                }
              />
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Phone Number" />
              <Forminput
                placeholder="Phone Number"
                value={formData.phone_number}
                onChangeText={(value) =>
                  handleInputChange("phone_number", value)
                }
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

            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Arrival Date" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("arrivalDate", "date")}
              >
                <Text>{formData.arrivalDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showArrivalDatePicker && (
                <DateTimePicker
                  value={formData.arrivalDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange(event, selectedDate, "arrivalDate", "date")
                  }
                />
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Arrival Time" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("arrivalDate", "time")}
              >
                <Text>{formData.arrivalDate.toLocaleTimeString()}</Text>
              </TouchableOpacity>
              {showArrivalTimePicker && (
                <DateTimePicker
                  value={formData.arrivalDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange(event, selectedDate, "arrivalDate", "time")
                  }
                />
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Departure Date" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("departureDate", "date")}
              >
                <Text>{formData.departureDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDepartureDatePicker && (
                <DateTimePicker
                  value={formData.departureDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange(
                      event,
                      selectedDate,
                      "departureDate",
                      "date"
                    )
                  }
                />
              )}
            </View>

            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Departure Time" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("departureDate", "time")}
              >
                <Text>{formData.departureDate.toLocaleTimeString()}</Text>
              </TouchableOpacity>
              {showDepartureTimePicker && (
                <DateTimePicker
                  value={formData.departureDate}
                  mode="time"
                  display="default"
                  onChange={(event, selectedDate) =>
                    handleDateChange(
                      event,
                      selectedDate,
                      "departureDate",
                      "time"
                    )
                  }
                />
              )}
            </View>

            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Location" />
              <Forminput
                placeholder="Enter Your Address Of invite"
                value={formData.location}
                onChangeText={(value) => handleInputChange("location", value)}
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

export default CreateGuests;

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
