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
import { userFile } from "../../../utils/fakedata";
import { useRoute } from "@react-navigation/native";

import { Admin_Get_My_Clan_Announcement_Fun } from "../../../Redux/Admin/AdminForumSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import { useNavigation } from "@react-navigation/native";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";

export default function Announcement({}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const { Admin_get_my_clan_Announcement_data } = useSelector(
    (state) => state.AdminForumSlice
  );
  const {userProfile_data} = useSelector((state)=> state.ProfileSlice)
  useEffect(() => {
    dispatch(Admin_Get_My_Clan_Announcement_Fun({}));
    dispatch(UserProfile_data_Fun())
    return () => {};
  }, []);

  const route = useRoute();
  // const { item } = route.params as { item: any };

  let item = {};

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

  let fakedata = [];
  let fakedataResolve = [
    {
      name: "Fire Emergency",
      day: "Monday",
      time: "10:30 AM",
      sender: "Fire Department",
    },
    {
      name: "Medical Emergency",
      day: "Wednesday",
      time: "2:45 PM",
      sender: "911 Operator",
    },
    {
      name: "Police Emergency",
      day: "Saturday",
      time: "8:15 PM",
      sender: "Police Department",
    },

    {
      name: "Police Emergency",
      day: "Saturday",
      time: "8:15 PM",
      sender: "Police Department",
    },

    {
      name: "Police Emergency",
      day: "Saturday",
      time: "8:15 PM",
      sender: "Police Department",
    },
  ];

  const animation = useRef(null);

  return (
    <View style={{ flex: 1, paddingTop: 10 }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <TouchableOpacity
          style={{
            width: "60%",
            borderWidth: 1,
            borderColor: "#04973C",
            borderRadius: 6,
            paddingVertical: 10,
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
          }}
          onPress={() => navigation.navigate("AdmincreateAnnouncement")}
        >
          <AntDesign name="plus" size={24} color="#04973C" />

          <MediumFontText
            data="Create Announcement"
            textstyle={{ fontSize: 12, color: "#04973C" }}
          />
        </TouchableOpacity>
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
            {Admin_get_my_clan_Announcement_data?.forums?.length > 0 && (
              <FlatList
                data={Admin_get_my_clan_Announcement_data?.forums}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={{
                      flex: 1,

                      borderWidth: 1,
                      borderColor: "#CFCDCD",
                      borderRadius: 6,
                      padding: 10,
                      marginBottom: 10,
                    }}
                    onPress={() => {
                      navigation.navigate("AnnouncementDetails", {
                        item: item,
                      });
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
                            userProfile_data?.photo
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
                  </TouchableOpacity>
                )}
              />
            )}
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
