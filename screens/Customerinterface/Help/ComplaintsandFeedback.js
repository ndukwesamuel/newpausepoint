import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../../../components/shared/AppScreen";

import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { FontAwesome5 } from "@expo/vector-icons";
import {
  CustomTextArea,
  Formbutton,
} from "../../../components/shared/InputForm";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const data = [
  {
    id: 1,
    label: "Email Us",
    des: "Replies within 8hrs",
    link: "PersonalInfo",
  },
  {
    id: 2,
    label: "Email Us",
    des: "Replies within 8hrs",
    link: "PersonalInfo",
  },

  {
    id: 3,
    label: "Email Us",
    des: "Replies within 8hrs",
    link: "PersonalInfo",
  },
];

let new_item = {
  id: 4,
  icon: "logout-outline",
  label: "Logout",
  icon_type: "Ionicons",
  link: "Logout",
};

const ComplaintsandFeedback = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);
  const [text, setText] = useState("");

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleDarkModeToggle = (isDarkMode) => {
    // Add logic to handle dark mode state in your app
    console.log(`Dark Mode is ${isDarkMode ? "enabled" : "disabled"}`);
    // You can update your app's theme or styles based on the isDarkMode state here.
  };

  const makePhoneCall = () => {
    Linking.openURL("tel:+1234567890");
  };

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const Complain_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}complaint`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: " successfully ",
        });
        setText("");
        navigation.goBack();
      },

      onError: (error) => {
        console.log({
          error: error?.response,
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

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <MediumFontText
            data="We listen"
            textstyle={{ fontSize: 18, fontWeight: "500" }}
          />
          <RegularFontText
            data="There is always room for Improvement!"
            textstyle={{ fontSize: 12 }}
          />
          <RegularFontText
            data="Tell us about your experiences so far or how we can make Pausepoint better for you"
            textstyle={{ fontSize: 12 }}
          />

          <View style={{ marginTop: 20 }}>
            <CustomTextArea
              placeholder="Leave a comment..."
              value={text}
              onChangeText={handleTextChange}
              style={{ width: "80%" }}
              inputStyle={{
                textAlignVertical: "top", // Ensures text starts from the top
                paddingTop: 10, // Add paddingTop to control vertical padding
                paddingBottom: 10, // Add paddingBottom to balance padding
                backgroundColor: "#F6F8FAE5",
                paddingHorizontal: 10,
                paddingTop: 10, // Add paddingTop to control the vertical padding
                paddingBottom: 10, // Add paddingBottom to balance the padding
                height: 100,
                borderRadius: 6,
                fontSize: 16,
              }}
            />
          </View>

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              borderWidth: 1,
              borderColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Send"
            onPress={() =>
              Complain_Mutation.mutate({
                complaint: text,
              })
            }
            isLoading={Complain_Mutation?.isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default ComplaintsandFeedback;

const styles = StyleSheet.create({});
