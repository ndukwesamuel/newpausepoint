import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { emergencydata } from "../../../components/Emergency/emdata";
import AppScreen from "../../../components/shared/AppScreen";
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../../components/Emergency/Modal";
import { useDispatch, useSelector } from "react-redux";

import {
  LightFontText,
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";
import { MaterialIcons, AntDesign, Entypo } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  Formbutton,
  Forminput_Icon,
} from "../../../components/shared/InputForm";
import { userFile } from "../../../utils/fakedata";
import { useRoute } from "@react-navigation/native";
import { HalfScreenModal } from "../../../components/shared/ReuseableModal";
import { Admin_Get_My_Clan_Announcement_Fun } from "../../../Redux/Admin/AdminForumSlice";
import { formatDateandTime } from "../../../utils/DateTime";

export default function AnnouncementDetails({ navigation }) {
  const { item } = useRoute()?.params;

  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const { Admin_get_my_clan_Announcement_data } = useSelector(
    (state) => state.AdminForumSlice
  );

  useEffect(() => {
    dispatch(Admin_Get_My_Clan_Announcement_Fun({}));
    return () => {};
  }, []);

  const route = useRoute();
  // const { item } = route.params as { item: any };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userType, setUserType] = useState("All");

  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const filteredUsers = userFile.filter((user) => {
    // if (userType === "ALL") {

    if (userType.toUpperCase() === "ALL") {
      return true; // Show all users
    } else {
      return user.status === userType; // Show users with selected status
    }
  });

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const animation = useRef(null);

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <View style={{ flex: 1, marginTop: 10 }}>
          <View style={{ flex: 1 }}>
            {/* <Forum /> */}

            {Admin_get_my_clan_Announcement_data?.forums?.length < 1 && (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 20,
                }}
              >
                <Image
                  source={require("../../../assets/images/Pendingdata.png")}
                  style={{ width: 250, height: 100 }}
                />

                <MediumFontText
                  data="No Pending Emergencies"
                  textstyle={{ fontSize: 14, color: "#969696" }}
                />
              </View>
            )}

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
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        item?.user?.photo ||
                        "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
                </View>

                {/* pls oncoment this in the next versino */}

                {/* <TouchableOpacity
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}
                        // onPress={toggleModal}
                      >
                        <Entypo
                          name="dots-three-vertical"
                          size={24}
                          color="black"
                        />
                      </TouchableOpacity> */}
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

              {/* pls oncoment this in the next versino */}
              {/* <View
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
                        // onPress={() => {
                        //   Like_Mutation.mutate({
                        //     forumid: item?._id,
                        //     clanId: item?.clan,
                        //   });
                        // }}
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
                        onPress={() =>
                          navigation.navigate("forumdetail", { forumid: item })
                        }
                      >
                        <AntDesign name="message1" size={24} color="black" />
                        <Text>Comment</Text>
                      </TouchableOpacity>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <AntDesign name="sharealt" size={24} color="black" />
                        <Text>Share</Text>
                      </View>
                    </View> */}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "30%",
  },
});
