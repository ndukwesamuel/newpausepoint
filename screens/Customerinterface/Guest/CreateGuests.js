


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
import {
  FormLabel,
  Formbutton,
  Forminput,
  RadioButton,
} from "../../../components/shared/InputForm";
import AppScreen from "../../../components/shared/AppScreen";
import { RegularFontText } from "../../../components/shared/Paragrahp";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  Get_All_User_Guest_Fun,
  Get__User_Guest_detail_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import { useMutateData_v2 } from "../../../hooks/Requestv2";

const CreateGuests = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [selectedOption, setSelectedOption] = useState(1);
  const [formData, setFormData] = useState({
    visitation_id: "",
    arrivalDate: new Date(),
    departureDate: new Date(),
    visitor_name: "",
    gender: selectedOption,
    phone_number: "",
    location: "",
  });



  console.log({
    yyyyy:route?.params?.itemdata
  });
  
  const [showArrivalDatePicker, setShowArrivalDatePicker] = useState(false);
  const [showArrivalTimePicker, setShowArrivalTimePicker] = useState(false);
  const [showDepartureDatePicker, setShowDepartureDatePicker] = useState(false);
  const [showDepartureTimePicker, setShowDepartureTimePicker] = useState(false);

  // ✅ Single mutation hook for both create and update
  const visitorMutation = useMutateData_v2(
    "api/v1/visitor",
    formData?.visitation_id ? "PATCH" : "POST",
    ["visitors", "invites"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: formData?.visitation_id 
            ? "Guest updated successfully" 
            : "Guest invitation created successfully",
        });

        if (formData?.visitation_id) {
          dispatch(Get__User_Guest_detail_Fun(formData?.visitation_id));
        }
        dispatch(Get_All_User_Guest_Fun());
        navigation.goBack();
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Submission failed",
        });
      },
    }
  );

  const handleRadioSelect = (option: number) => {
    setSelectedOption(option);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const showDatePickerModal = (field: string, type: string) => {
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

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    field: string,
    type: string
  ) => {
    if (field === "arrivalDate") {
      type === "date"
        ? setShowArrivalDatePicker(false)
        : setShowArrivalTimePicker(false);
    } else {
      type === "date"
        ? setShowDepartureDatePicker(false)
        : setShowDepartureTimePicker(false);
    }

    if (selectedDate !== undefined) {
      setFormData((prev) => {
        const newDate = new Date(prev[field]);

        if (type === "date") {
          newDate.setFullYear(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
          );
        } else {
          newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
        }

        return {
          ...prev,
          [field]: newDate,
        };
      });
    }
  };

  const handleSubmit = () => {
    const genderString = selectedOption === 1 ? "Male" : "Female";

    const payload = {
      arraval: formData?.arrivalDate,
      expires: formData?.departureDate,
      visitor_name: formData?.visitor_name,
      gender: genderString,
      phone_number: formData?.phone_number,
      location: formData?.location,
      ...(formData?.visitation_id && { visitorID: formData?.visitation_id }),
    };

    visitorMutation.mutate(payload);
  };

  useEffect(() => {
    const guestData = route.params?.itemdata;

    if (guestData) {
      setFormData({
        visitation_id: guestData?._id,
        arrivalDate: new Date(guestData.arraval || Date.now()),
        departureDate: new Date(guestData.expires || Date.now()),
        visitor_name: guestData.visitor_name || "",
        gender: guestData.gender === "Male" ? 1 : 2,
        phone_number: `${guestData.phone_number || ""}`,
        location: guestData.location || "",
      });
      setSelectedOption(guestData.gender === "Male" ? 1 : 2);
    }
  }, [route.params?.itemdata]);

  const getFormattedDateTime = (date: Date, mode: string) => {
    if (!date) return "";
    try {
      const d = new Date(date);
      return mode === "date"
        ? d.toLocaleDateString()
        : d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch (e) {
      return mode === "date" ? "Select Date" : "Select Time";
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ paddingHorizontal: 20 }}>
            {/* Name Input */}
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

            {/* Phone Number Input */}
            <View style={{ marginBottom: 15 }}>
              <FormLabel data="Phone Number" />
              <Forminput
                placeholder="Phone Number"
                value={formData.phone_number}
                onChangeText={(value) =>
                  handleInputChange("phone_number", value)
                }
                keyboardType="numeric"
              />
            </View>

            {/* Gender Selection */}
            <View style={{ marginTop: 15 }}>
              <Text>Choose an option:</Text>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <RadioButton
                  label="Male"
                  selected={selectedOption === 1}
                  onSelect={() => handleRadioSelect(1)}
                />
                <RadioButton
                  label="Female"
                  selected={selectedOption === 2}
                  onSelect={() => handleRadioSelect(2)}
                  inputStyle={[styles.radioButton, { marginLeft: 20 }]}
                />
              </View>
            </View>

            {/* Arrival Date */}
            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Arrival Date" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("arrivalDate", "date")}
              >
                <Text>
                  {getFormattedDateTime(formData.arrivalDate, "date")}
                </Text>
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

            {/* Arrival Time */}
            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Arrival Time" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("arrivalDate", "time")}
              >
                <Text>
                  {getFormattedDateTime(formData.arrivalDate, "time")}
                </Text>
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

            {/* Departure Date */}
            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Departure Date" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("departureDate", "date")}
              >
                <Text>
                  {getFormattedDateTime(formData.departureDate, "date")}
                </Text>
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

            {/* Departure Time */}
            <View style={{ marginTop: 20 }}>
              <RegularFontText data="Departure Time" />
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => showDatePickerModal("departureDate", "time")}
              >
                <Text>
                  {getFormattedDateTime(formData.departureDate, "time")}
                </Text>
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

            {/* Location Input */}
            <View style={{ marginBottom: 15, marginTop: 20 }}>
              <FormLabel data="Location (Optional)" />
              <Forminput
                placeholder="Enter Your Address Of invite"
                value={formData.location}
                onChangeText={(value) => handleInputChange("location", value)}
              />
            </View>

            {/* Submit Button */}
            <Formbutton
              buttonStyle={styles.submitButton}
              textStyle={styles.submitButtonText}
              data={formData.visitation_id ? "Update Guest" : "Create Guest"}
              onPress={handleSubmit}
              isLoading={visitorMutation.isPending}
            />

            <View style={{ height: 40 }} />
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
    padding: 15,
    borderRadius: 5,
    backgroundColor: "#F6F8FAE5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginTop: 5,
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
// ```

// ---

// ## **What Changed:**

// ### **✅ Removed:**
// 1. ❌ Old `Guests_Mutation` useMutation hook
// 2. ❌ Commented out old code
// 3. ❌ Unused imports (`axios`, `API_BASEURL`)
// 4. ❌ `createVisitorMutation` (merged into `visitorMutation`)

// ### **✅ Added:**
// 1. ✅ Single `visitorMutation` hook that handles **both create and update**
// 2. ✅ Dynamic method: `POST` for create, `PATCH` for update
// 3. ✅ `onSuccess` and `onError` callbacks in hook options
// 4. ✅ `visitorID` added to payload for updates
// 5. ✅ Clean, single source of truth

// ---

// ## **How It Works:**

// ### **Create (No `visitation_id`):**
// ```
// POST /api/v1/visitor
// {
//   "arraval": "2026-03-06T21:25:29.300Z",
//   "expires": "2026-03-06T21:25:29.300Z",
//   "gender": "Male",
//   "location": "71 bricking",
//   "phone_number": "08056148116",
//   "visitor_name": "Lakaka"
// }
// ```

// ### **Update (Has `visitation_id`):**
// ```
// PATCH /api/v1/visitor
// {
//   "arraval": "2026-03-06T21:25:29.300Z",
//   "expires": "2026-03-06T21:25:29.300Z",
//   "gender": "Male",
//   "location": "71 bricking",
//   "phone_number": "08056148116",
//   "visitor_name": "Lakaka",
//   "visitorID": "69abb06050579d1a8051fb86"
// }