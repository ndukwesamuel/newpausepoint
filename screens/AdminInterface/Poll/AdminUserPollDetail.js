import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { Get_All_Polls_Fun } from "../../../Redux/UserSide/PollSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
const AdminUserPollDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { itemdata } = useRoute()?.params;
  const { user_data } = useSelector((state) => state.AuthSlice);
  const [optionCounts, setOptionCounts] = useState(null);

  useEffect(() => {
    const votes = itemdata?.votes;

    const counts = votes?.reduce((acc, vote) => {
      const optionText = vote?.optionText;
      acc[optionText] = (acc[optionText] || 0) + 1;
      return acc;
    }, {});
    setOptionCounts(counts);
    return () => {};
  }, []);

  const Poll_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}poll/${itemdata?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.delete(url, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Post Deleted  successfully ",
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
  // const { item } = route.params as { item: any };
  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            // paddingHorizontal: 20,
            // paddingVertical: 10,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          // navigation.navigate("guestsdetail", { itemdata });

          onPress={() => Poll_Mutation.mutate()}
        >
          <AntDesign name="delete" size={24} color="red" />
        </TouchableOpacity>
      </View>

      {Poll_Mutation?.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Question:
        </Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          {itemdata?.question}
        </Text>
      </View>
      {itemdata?.options.map((option, index) => (
        <View
          key={index}
          style={{
            // backgroundColor: "#f0f0f0",
            flexDirection: "row",
            gap: 20,
            // justifyContent: "center",
            // alignItems: "center",
            // paddingVertical: 10,
            // paddingHorizontal: 20,
            // marginVertical: 10,
            // borderRadius: 10,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Option {index + 1}:
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {option.text}
          </Text>
        </View>
      ))}

      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 20,
            // textAlign: "center",
          }}
        >
          {" "}
          Total Votes: {itemdata?.votes?.length}
        </Text>
      </View>

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {optionCounts ? (
          // <OptionCountsScreen optionCounts={optionCounts} />

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {Object.entries(optionCounts).map(([optionText, count]) => (
              <View
                key={optionText}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    marginRight: 10,
                  }}
                >
                  {optionText}
                </Text>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  {count}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
      </View>
    </View>
  );
};

export default AdminUserPollDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    paddingHorizontal: 10,
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
