import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  ScrollView,
} from "react-native";
// Assuming these are custom components
import {
  CustomTextArea,
  Forminput,
} from "../../../components/shared/InputForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
// ------------------------------------------------------------------
// 1. UPDATED IMPORT: Use @tanstack/react-query instead of react-query
import { useMutation } from "@tanstack/react-query";
// ------------------------------------------------------------------

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
// Assuming these actions and selectors are correctly defined
import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const navigation = useNavigation();

  const [options, setOptions] = useState(["", "", ""]); // Initial array with 3 empty options
  // Corrected state access for Redux slice
  const { user_data } = useSelector((state) => state.AuthSlice);
  const dispatch = useDispatch();

  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  // ------------------------------------------------------------------
  // 2. USE MUTATION: The structure remains largely the same for v4/v5
  // Note: For v5, `isLoading` is renamed to `isPending`
  const Poll_Mutation = useMutation({
    mutationFn: (data_info) => {
      let url = `${API_BASEURL}poll`;

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
        text1: "Post Created successfully ",
      });

      dispatch(Get_All_Polls_Fun());

      navigation.goBack();
    },
    onError: (error) => {
      console.log({
        aaa: error?.response,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
    },
  });
  // ------------------------------------------------------------------

  const handleCreatePoll = () => {
    const pollData = {
      question,
      options: options.filter((option) => option.trim() !== ""), // Remove empty options
    };
    // Send pollData to your API endpoint using a POST request
    console.log("Poll data:", pollData);
    Poll_Mutation.mutate(pollData);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]); // Add a new empty option to the options array
  };

  const handleDeleteOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1); // Remove the option at the specified index
    setOptions(newOptions);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={{
          marginBottom: 20,
        }}
      >
        <CustomTextArea
          placeholder="Enter poll question"
          value={question}
          onChangeText={setQuestion}
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

        {options.map((option, index) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
              gap: 10,
            }}
            key={index}
          >
            <View style={{ flex: 1 }}>
              <Forminput
                key={index}
                placeholder={`Option ${index + 1}`}
                onChangeText={(text) => handleOptionChange(index, text)}
                value={option}
              />
            </View>

            <TouchableOpacity
              onPress={() => handleDeleteOption(index)}
              // Disable delete if there are only 2 or fewer options
              disabled={options.length <= 2}
            >
              <MaterialCommunityIcons
                name="delete"
                size={24}
                color={options.length <= 2 ? "#ccc" : "red"}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        onPress={handleAddOption}
        style={{
          backgroundColor: "#e0e0e0",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          minWidth: 200,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Add Option
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCreatePoll}
        // Use Poll_Mutation.isPending for v4/v5 (was Poll_Mutation.isLoading in v3)
        disabled={Poll_Mutation.isPending}
        style={{
          backgroundColor: Poll_Mutation.isPending ? "#90ee90" : "#04973C", // Changed color for disabled/loading state
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          minWidth: 200,
        }}
      >
        {Poll_Mutation.isPending ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              fontSize: 20,
              color: "white",
              textAlign: "center",
            }}
          >
            Create Poll
          </Text>
        )}
      </TouchableOpacity>

      {/* The original separate ActivityIndicator is no longer needed since it's integrated into the button */}
      {/* {Poll_Mutation?.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
});

export default CreatePoll;
