import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Get_All_User_Profle_Fun,
  Profle_Fun,
} from "../../Redux/UserSide/UserProfileSlice";
import { Forminput_Icon } from "../../components/shared/InputForm";
import { AntDesign } from "@expo/vector-icons";
import { centralData } from "../../utils/fakedata";
import io from "socket.io-client";

import {
  MediumFontText,
  RegularFontText,
} from "../../components/shared/Paragrahp";
import { CenterReuseModals } from "../../components/shared/ReuseModals";
import { useNavigation } from "@react-navigation/native";
import AppScreen from "../../components/shared/AppScreen";
import ClickToJoinCLan from "../../components/shared/ClickToJoinCLan";

const Neigborhood = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { get_all_user_data, get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice
  );

  console.log({
    ccc: get_all_user_data?.data[0]?.user?.userProfile?.photo,
  });
  const { user_data } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    dispatch(Get_All_User_Profle_Fun());
    dispatch(Profle_Fun());

    return () => {};
  }, []);

  const [data, setData] = useState([]);
  const [frequentlyContacted, setFrequentlyContacted] = useState([]);
  const [allDirectory, setAllDirectory] = useState([]);

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });

    // console.log({ formData });
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    // dispatch(Get_My_Clan_Forum_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleSubmit = () => {
    // Handle the search and filter the data into frequentlyContacted and allDirectory lists.
    const searchQuery = formData.search.toLowerCase();
    const filteredFrequentlyContacted = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    setFrequentlyContacted(filteredFrequentlyContacted);

    const filteredAllDirectory = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery)
    );
    setAllDirectory(filteredAllDirectory);
  };

  return (
    <AppScreen>
      {get_user_profile_data?.currentClanMeeting ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View
            style={{ flex: 1, backgroundColor: "white", paddingVertical: 20 }}
          >
            {/* <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{
                marginLeft: 10,
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                width: 100,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
              <Text>Add user</Text>
            </TouchableOpacity> */}

            {get_user_profile_data?.currentClanMeeting?._id ? (
              <>
                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                  <Forminput_Icon
                    placeholder="Search for user..."
                    containerstyle={{
                      // borderWidth: 1,
                      padding: 10,
                      borderRadius: 5,
                      backgroundColor: "#F3FFF3",
                      // opacity: 0.4
                      flexDirection: "row",
                      gap: 10,
                    }}
                    textstyle={{
                      fontSize: 16,
                    }}
                    onChangeText={(text) => handleInputChange("search", text)}
                    value={formData.search}
                    icon={<AntDesign name="search1" size={22} color="black" />}
                  />

                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={get_all_user_data?.data}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Chats", { item })}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                              marginVertical: 10,
                            }}
                          >
                            <Image
                              source={{
                                uri:
                                  item.user?.userProfile?.photo ||
                                  "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                              }}
                              style={{
                                width: 68,
                                height: 68,
                                borderRadius: 50,
                              }}
                            />

                            <View>
                              <MediumFontText
                                data={item.user?.name}
                                textstyle={{ fontSize: 16, fontWeight: "500" }}
                              />
                              {/* <RegularFontText
                                data={item?.email}
                                textstyle={{ fontSize: 14, fontWeight: "400" }}
                              /> */}
                            </View>
                          </View>

                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#CFCDCD",
                              borderRadius: 6,
                              marginTop: 10,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </>
            ) : null}

            <CenterReuseModals
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  elevation: 5,
                  width: "80%",
                }}
              >
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    right: 10,
                    backgroundColor: "red",
                    padding: 10,
                    borderRadius: 10,
                  }}
                >
                  <Text>cancel</Text>
                </TouchableOpacity>
                <View
                  style={{
                    backgroundColor: "white",
                    // padding: 20,
                    width: "100%",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    height: "80%",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={get_all_user_data?.data}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => navigation.navigate("Chats", { item })}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              gap: 10,
                              marginVertical: 10,
                            }}
                          >
                            <Image
                              source={{
                                uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
                              }}
                              style={{
                                width: 68,
                                height: 68,
                                borderRadius: 50,
                              }}
                            />

                            <View>
                              <MediumFontText
                                data={item?.user?.name}
                                textstyle={{ fontSize: 16, fontWeight: "500" }}
                              />
                              {/* <RegularFontText
                                data={item?.email}
                                textstyle={{ fontSize: 14, fontWeight: "400" }}
                              /> */}
                            </View>
                          </View>

                          <View
                            style={{
                              borderWidth: 1,
                              borderColor: "#CFCDCD",
                              borderRadius: 6,
                              marginTop: 10,
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </View>
              </View>
            </CenterReuseModals>
          </View>
        </KeyboardAvoidingView>
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
          <ClickToJoinCLan />
          <Text style={{ fontSize: 18 }}>
            Join a clan to see a guest list and invite guests.
          </Text>
        </ScrollView>
      )}
    </AppScreen>
  );
};

export default Neigborhood;
