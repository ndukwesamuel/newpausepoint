import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import AppScreen from "../shared/AppScreen";
import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../shared/Paragrahp";
import { Entypo, AntDesign, MaterialIcons } from "@expo/vector-icons";

import ForumModal from "./ForumModal";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Get_My_Clan_Forum_Fun } from "../../Redux/UserSide/ForumSlice";
import { formatDate, formatDateandTime } from "../../utils/DateTime";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const data = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },

  // Add more items as needed
];

// createforum
const Forum = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const animation = useRef(null);
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Get_My_Clan_Forum_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  const Like_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}forum/like/${data_info?.clanId}/${data_info?.forumid}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.get(url, config);
    },
    {
      onSuccess: (success) => {
        // Toast.show({
        //   type: "success",
        //   text1: " successfully ",
        // });
        dispatch(Get_My_Clan_Forum_Fun());
        // setTurnmodal(false);
      },

      onError: (error) => {
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
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const { get_my_clan_forum_data, get_my_clan_forum_message } = useSelector(
    (state) => state.ForumSlice
  );

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice
  );

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    dispatch(Get_My_Clan_Forum_Fun());

    return () => {};
  }, [dispatch]);

  return (
    <View style={{ flex: 1 }}>
      {get_user_profile_data?.currentClanMeeting?._id ? (
        <>
          {get_my_clan_forum_message && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 200,
                  height: 200,
                  // backgroundColor: "#eee",
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../assets/Lottie/notFund.json")}
              />
              <Text>{get_my_clan_forum_message}</Text>
            </View>
          )}

          {get_my_clan_forum_message && (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <LottieView
                autoPlay
                ref={animation}
                style={{
                  width: 200,
                  height: 200,
                  // backgroundColor: "#eee",
                }}
                // Find more Lottie files at https://lottiefiles.com/featured
                source={require("../../assets/Lottie/notFund.json")}
              />
              <Text>{get_my_clan_forum_message}</Text>
            </View>
          )}

          <FlatList
            data={get_my_clan_forum_data?.forums}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,

                  borderWidth: 1,
                  borderColor: "#CFCDCD",
                  borderRadius: 6,
                  padding: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 20,

                    // paddingBottom: 20,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                    onPress={() => {
                      navigation.navigate("forumdetail", item);
                    }}
                  >
                    <Image
                      source={{
                        uri: item?.user?.photo,
                        // ||
                        // "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                      }}
                      style={{ width: 40, height: 40, borderRadius: 50 }}
                    />
                    <View>
                      <MediumFontText
                        data={item?.user?.name}
                        textstyle={{ fontSize: 16, fontWeight: "500" }}
                      />

                      <LightFontText
                        data={formatDateandTime(item?.createdAt)}
                        // "Jane Doe - 54 mins ago"
                        textstyle={{ fontSize: 12, fontWeight: "300" }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View style={{ paddingHorizontal: 20 }}>
                  <RegularFontText
                    data={item?.content}
                    textstyle={{
                      fontSize: 12,
                      fontWeight: "400",
                      textAlign: "justify",
                    }}
                  />
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#D9D9D9",
                    marginVertical: 10,
                  }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginVertical: 10,
                    paddingHorizontal: 30,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                    onPress={() => {
                      Like_Mutation.mutate({
                        forumid: item?._id,
                        clanId: item?.clan,
                      });
                    }}
                  >
                    <AntDesign name="hearto" size={24} color="black" />
                    <Text>{item?.likes?.length} Likes </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                    }}
                    onPress={() => navigation.navigate("forumdetail", item)}
                  >
                    <AntDesign name="message1" size={24} color="black" />
                    <Text>Comment</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../assets/Lottie/notFund.json")}
                />
                <Text>{get_my_clan_forum_message}</Text>
              </View>
            }
          />

          <View style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}>
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

              onPress={() => navigation.navigate("createforum")}
            >
              <AntDesign
                name="plus"
                size={24}
                color="white"
                // style={{ width: 25, height: 25 }}
              />
              {/* <MaterialIcons name="mode-edit" size={24} color="black" /> */}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "#D9D9D9",
              padding: 10,
              borderRadius: 6,
            }}
            onPress={() => navigation.navigate("myclan")}
          >
            <Text> Click join a clan </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <ForumModal visible={isModalVisible} onClose={toggleModal} />
    </View>
  );
};

export default Forum;

const styles = StyleSheet.create({});
