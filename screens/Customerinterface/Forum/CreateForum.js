import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator, // Added for loading states
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
// ------------------------------------------------------------------
// UPDATED IMPORT: Use @tanstack/react-query instead of react-query
import { useMutation } from "@tanstack/react-query";
// ------------------------------------------------------------------

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Get_My_Clan_Forum_Fun } from "../../../Redux/UserSide/ForumSlice";

const CreateForum = () => {
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

  // ------------------------------------------------------------------
  // TanStack Query useMutation for Create Forum Post
  // ------------------------------------------------------------------
  const Create_Forum_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}forum`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Post Created successfully",
      });

      dispatch(Get_My_Clan_Forum_Fun());
      navigation.goBack();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message || "Failed to create post"}`,
      });

      // Keeping the original flow to navigate back even on error
      // dispatch(Get_My_Clan_Forum_Fun()); // Not strictly necessary on error unless for specific error handling logic
      // navigation.goBack(); // Navigating back on error might interrupt user experience, consider removing
    },
  });
  // ------------------------------------------------------------------

  const handlePublish = () => {
    if (text.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Post content cannot be empty",
      });
      return;
    }

    if (!Create_Forum_Mutation.isPending) {
      Create_Forum_Mutation.mutate({
        content: text,
      });
    }
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 25 }}>
          <CustomTextArea
            placeholder="Enter text here..."
            value={text}
            onChangeText={handleTextChange}
            style={{ width: "100%" }} // Adjusted width to fill container
            inputStyle={{
              textAlignVertical: "top",
              paddingVertical: 10, // Combined vertical padding
              backgroundColor: "#F6F8FAE5",
              paddingHorizontal: 10,
              height: 100,
              borderRadius: 6,
              fontSize: 16,
            }}
          />

          {/* <UploadFile />  this will be added later*/}

          <View style={{ marginTop: 20 }}>
            {" "}
            {/* Added margin top for spacing */}
            <Formbutton
              buttonStyle={{
                backgroundColor: Create_Forum_Mutation.isPending
                  ? "#90ee90"
                  : "#04973C",
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
              data="Publish"
              onPress={handlePublish}
              // Use Create_Forum_Mutation.isPending for TanStack Query v4/v5
              isLoading={Create_Forum_Mutation.isPending}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateForum;
