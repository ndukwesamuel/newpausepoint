

import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../../../components/shared/AppScreen";
import {
  CustomTextArea,
  Formbutton,
} from "../../../components/shared/InputForm";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { useMutateData_v2 } from "../../../hooks/Requestv2";
// import { useMutateData_v2 } from "../../../hooks/Requestv2";

const CreateForum = () => {
  const navigation = useNavigation();
  const [text, setText] = useState("");

  const { mutate, isPending } = useMutateData_v2(
    "api/v1/forum",
    "POST",
    ["forum"], // invalidates forum list on success
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Post created successfully",
        });
        navigation.goBack();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to create post",
        });
      },
    },
  );

  const handlePublish = () => {
    if (text.trim() === "") {
      Toast.show({
        type: "error",
        text1: "Post content cannot be empty",
      });
      return;
    }

    if (!isPending) {
      mutate({ content: text.trim() });
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
            placeholder="What's on your mind?"
            value={text}
            onChangeText={setText}
            style={{ width: "100%" }}
            inputStyle={{
              textAlignVertical: "top",
              paddingVertical: 10,
              backgroundColor: "#F6F8FAE5",
              paddingHorizontal: 10,
              height: 100,
              borderRadius: 6,
              fontSize: 16,
            }}
          />

          <View style={{ marginTop: 20 }}>
            <Formbutton
              buttonStyle={{
                backgroundColor: isPending ? "#90ee90" : "#04973C",
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
              isLoading={isPending}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreateForum;
