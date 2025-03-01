import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

import {
  CustomTextArea,
  Formbutton,
  Forminput,
  Forminput_Icon,
  RadioButton,
} from "../../../components/shared/InputForm";
import { AntDesign } from "@expo/vector-icons";
import {
  BoldFontText,
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { Get_ALl_Clan_Fun } from "../../../Redux/UserSide/ClanSlice";
import ReuseModals from "../../../components/shared/ReuseModals";
import { formatDate, formatDateandTime } from "../../../utils/DateTime";

const Joinclan = () => {
  const { get_all_clan_data } = useSelector((state) => state.ClanSlice);

  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState("");

  // const filteredData = get_all_clan_data?.data?.filter((clanitem) =>
  //   clanitem.name.toLowerCase().includes(inputValue.toLowerCase())
  // );

  const filteredData =
    inputValue.trim().length > 0
      ? get_all_clan_data?.data?.filter((clanitem) =>
          clanitem.name.toLowerCase().includes(inputValue.toLowerCase())
        )
      : [];

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalVisibility, setModalVisibility] = useState({});

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    dispatch(Get_ALl_Clan_Fun());
    return () => {};
  }, [dispatch]);

  const [activeButton, setActiveButton] = useState("Social"); // Initialize with 'Social' as the active button
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const initialData = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
    // Add more objects to your initial data
  ];

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });
  const [name, setName] = useState("");
  const [text, setText] = useState("");

  // this is for image
  const [profileImage, setProfileImage] = useState(
    "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
  ); // Replace with the user's actual data

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleInputChange = (text) => {
    setInputValue(text);
  };
  const handleSave = () => {
    // Handle the saving of user data here (e.g., make API calls).
  };

  const [selectedOption, setSelectedOption] = useState(1);

  const handleRadioSelect = (option) => {
    setSelectedOption(option);
  };

  const Joinclan_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}clan/joinClan/${data_info}`;

      console.log({
        url,
      });

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
        console.log({
          success,
        });
        Toast.show({
          type: "success",
          text1: "Request To Join Estate successfully ",
        });
        setModalVisible(false);
        setModalVisibility({});
      },

      onError: (error) => {
        console.log({
          error: error?.response,
        });

        console.log({
          error: error?.response?.data?.message,
        });

        setModalVisible(false);
        setModalVisibility({});
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingTop: 20,
        flex: 1,
      }}
    >
      <Forminput
        placeholder="Search Clans"
        value={inputValue}
        onChangeText={handleInputChange}
      />
      <View style={styles.container}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item?._id}
          ListEmptyComponent={() =>
            inputValue.trim().length > 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20 }}>
                No clans found
              </Text>
            ) : null
          }
          renderItem={({ item }) => (
            <View
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#ccc",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.clanName}>{item?.name}</Text>

              <Text style={styles?.description}>
                {item?.result?.description}
              </Text>

              <TouchableOpacity
                style={{
                  backgroundColor: "green",
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  borderRadius: 6,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setModalVisibility({
                    data: item,
                  });
                  setModalVisible(true);
                }}
              >
                <Text style={{ color: "white" }}>Join</Text>
              </TouchableOpacity>

              <ReuseModals visible={isModalVisible}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginTop: 5,
                  }}
                  onPress={() => {
                    setModalVisible(false);
                    setModalVisibility({});
                  }}
                >
                  <MaterialIcons name="cancel" size={24} color="black" />
                </TouchableOpacity>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={styles.container}>
                    <Text style={styles.title}>Estate</Text>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 16,
                      }}
                    >
                      Name: {modalVisibility?.data?.name}
                    </Text>

                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 16,
                      }}
                    >
                      Description: {modalVisibility?.data?.description}
                    </Text>

                    <Text style={styles.createdAt}>
                      Created At:
                      {formatDate(modalVisibility?.data?.createdAt)}
                    </Text>

                    <Text
                      style={{
                        fontSize: 16,
                      }}
                    >
                      Creator Details
                    </Text>
                    <BoldFontText text={"Creator Details"} />

                    <Text
                      style={{
                        fontSize: 24,
                        fontWeight: "bold",
                        marginBottom: 8,
                      }}
                    >
                      {modalVisibility?.data?.creatorData[0]?.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        marginBottom: 16,
                        color: "gray",
                      }}
                    >
                      {modalVisibility?.data?.creatorData[0]?.email}
                    </Text>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "green",
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        borderRadius: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        Joinclan_Mutation.mutate(modalVisibility?.data?._id)
                      }
                    >
                      {Joinclan_Mutation.isLoading ? (
                        <ActivityIndicator
                          size="small"
                          color="white"
                          //   animating={Joinclan_Mutation.isLoading}
                        />
                      ) : (
                        <Text style={{ color: "white" }}>Join</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </ReuseModals>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  clanName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },

  createdAt: {
    fontSize: 14,
    color: "gray",
  },
});

export default Joinclan;
