import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  Get_All_Polls_Fun,
  Get_Single_Polls_Fun,
} from "../../../Redux/UserSide/PollSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const UserPollDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { itemdata } = useRoute()?.params;
  const { user_data } = useSelector((state) => state.AuthSlice);
  const [loading, setLoading] = useState(true);
  const { get_all_poll_data, get_single_poll_data } = useSelector(
    (state) => state.PollSlice
  );

  useEffect(() => {
    dispatch(Get_Single_Polls_Fun(itemdata?._id));
    setLoading(false);

    return () => {};
  }, [dispatch, Vote_Mutation]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_Single_Polls_Fun(itemdata?._id));

    // Wait for 2 seconds
    setRefreshing(false);
  };

  let totalVotes = 0;

  get_single_poll_data?.data?.options?.forEach((option) => {
    totalVotes += option.votes;
  });

  console.log({
    totalVotes,
  });

  function calculateTotalVotes(data) {
    let totalVotes = {};

    // return totalVotes;
  }

  const Vote_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}poll/${itemdata?._id}/vote`;

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
        dispatch(Get_Single_Polls_Fun(itemdata?._id));

        // navigation.goBack();
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

  const castVote = (optionIndex) => {
    Vote_Mutation.mutate({
      optionIndex: optionIndex,
    });
    // Perform your vote casting logic here
    // Alert.alert("Vote Casted", `You voted for ${options[optionIndex].text}`);
    // In a real application, you would send a request to your backend to record the vote
  };
  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {Vote_Mutation?.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )}

      <View style={{ flex: 1 }}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <VoteScreen
            mainoptions={get_single_poll_data?.data}
            castVote={castVote}
          />
        )}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
            // textAlign: "center",
          }}
        >
          Total Votes: {totalVotes}
        </Text>
      </View>
    </ScrollView>
  );
};

export default UserPollDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  questionText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  optionText: {
    fontSize: 18,
    color: "#333",
  },
  textInput: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 20,
  },
});

// import React, { useState } from "react";
// import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function VoteScreen({ mainoptions, castVote }) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = () => {
    if (selectedOption !== null) {
      castVote(selectedOption);
    }
  };

  return (
    <View
      style={{
        // flex: 1,
        // justifyContent: "center",
        // alignItems: "center",
        paddingHorizontal: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        {mainoptions?.question}
      </Text>

      {mainoptions?.options?.map((option, index) => (
        <TouchableOpacity
          key={option.text}
          style={[
            {
              backgroundColor: "#e0e0e0",
              padding: 10,
              marginBottom: 10,
              borderRadius: 5,
              minWidth: 200,
              //   alignItems: "center",
            },
            selectedOption === index && { backgroundColor: "#b3e5fc" },
          ]}
          onPress={() => setSelectedOption(index)}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 16,
              }}
            >
              {option.text}
            </Text>

            <Text
              style={{
                fontSize: 16,
              }}
            >
              {option.votes}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={{
          backgroundColor: "#2196F3",
          padding: 10,
          borderRadius: 5,
          minWidth: 200,
          alignItems: "center",
          marginTop: 20,
        }}
        onPress={handleVote}
        disabled={selectedOption === null}
      >
        <Text
          style={{
            fontSize: 18,
            color: "white",
          }}
        >
          Vote
        </Text>
      </TouchableOpacity>
    </View>
  );
}
