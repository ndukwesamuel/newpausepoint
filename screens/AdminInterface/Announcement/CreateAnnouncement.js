import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../../../components/shared/AppScreen";
import {
  RegistraionHeadersText,
  RegistraionParagraphText,
} from "../../../components/shared/Registraion";
import {
  CustomTextArea,
  FormLabel,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import UploadFile from "../../../components/UserHome/UploadFile";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Get_My_Clan_Forum_Fun } from "../../../Redux/UserSide/ForumSlice";
import { Admin_Get_My_Clan_Announcement_Fun } from "../../../Redux/Admin/AdminForumSlice";

const CreateAnnouncement = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const { get_my_clan_forum_data, get_my_clan_forum_message } = useSelector(
    (state) => state.ForumSlice
  );

  const [remember, setRemember] = useState(false);

  const [passwords, setPasswords] = useState({
    mainPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (field, text) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  const { user_data } = useSelector((state) => state.AuthSlice);

  const handleSubmit = () => {
    console.log("Current Password:", passwords.mainPassword);
    console.log("New Password:", passwords.confirmPassword);
    // Add your password change logic here, e.g., sending it to a server
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };
  const [text, setText] = useState("");

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const Create_Forum_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}forum/admin-announcement`;

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
          text1: "Post Created  successfully ",
        });
        // dispatch(
        //   Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting)
        // );
        dispatch(Admin_Get_My_Clan_Announcement_Fun({}));

        navigation.goBack();
        // setTurnmodal(false);
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );
  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView>
          <View style={{ flex: 1, paddingHorizontal: 25 }}>
            <CustomTextArea
              placeholder="Enter text here..."
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

            {/* <UploadFile />  this will be added later*/}

            <View style={{}}>
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
                  marginTop: 20,
                }}
                textStyle={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
                data="Publish"
                onPress={() => {
                  Create_Forum_Mutation.mutate({
                    content: text,
                  });
                }}
                isLoading={Create_Forum_Mutation.isLoading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateAnnouncement;
