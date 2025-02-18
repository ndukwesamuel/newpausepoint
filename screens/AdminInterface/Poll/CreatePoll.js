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
import {
  CustomTextArea,
  Forminput,
} from "../../../components/shared/InputForm";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const CreatePoll = () => {
  const [question, setQuestion] = useState("");
  const navigation = useNavigation();

  const [options, setOptions] = useState(["", "", ""]); // Initial array with 3 empty options
  const { user_data } = useSelector((state) => state.AuthSlice);
  const dispatch = useDispatch();
  const handleOptionChange = (index, text) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const Poll_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}poll`;

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
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  const handleCreatePoll = () => {
    const pollData = {
      question,
      options: options.filter((option) => option.trim() !== ""), // Remove empty options
    };
    // Send pollData to your API endpoint using a POST request
    console.log("Poll data:", pollData);
    // Reset input fields after creating the poll
    // setQuestion("");
    // setOptions(["", "", ""]);
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
          // onChangeText={handleTextChange}
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
                // onChangeText={setEmail}
                onChangeText={(text) => handleOptionChange(index, text)}
                // value={email}
                value={option}
              />
            </View>

            <TouchableOpacity onPress={() => handleDeleteOption(index)}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          // <TextInput
          //   key={index}
          //   style={styles.input}
          //   placeholder={`Option ${index + 1}`}
          //   value={option}
          //   onChangeText={(text) => handleOptionChange(index, text)}
          // />
        ))}
      </ScrollView>

      {/* <Button
        title="Add Option"
        onPress={handleAddOption}
        style={{ marginTop: 20 }}
      /> */}

      <TouchableOpacity
        onPress={handleAddOption}
        style={{
          backgroundColor: "#e0e0e0",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          minWidth: 200,
          //   alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            // fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Add Option
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleCreatePoll}
        style={{
          backgroundColor: "#e0e0e0",
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
          minWidth: 200,
          //   alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            // fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Create Poll
        </Text>
      </TouchableOpacity>
      {/* <Button title="Create Poll" onPress={handleCreatePoll} /> */}

      {Poll_Mutation?.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
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
