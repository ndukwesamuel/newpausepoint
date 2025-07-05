import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { emergencydata } from "../../components/Emergency/emdata";
import AppScreen from "../../components/shared/AppScreen";
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../components/Emergency/Modal";
import { MediumFontText } from "../../components/shared/Paragrahp";

import { AntDesign } from "@expo/vector-icons";
import { Forminput_Icon } from "../../components/shared/InputForm";
import { userFile } from "../../utils/fakedata";
import { useDispatch, useSelector } from "react-redux";
import { Admin_Get_All_User_Fun } from "../../Redux/Admin/UserSlice";
import {
  Admin_Get_All_Clan_Memeber_Fun,
  Get_Single_clan,
} from "../../Redux/UserSide/ClanSlice";

export default function AllUsers({ navigation }) {
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);
  const { Alluser_data_isSuccess, Alluser_data } = useSelector(
    (state) => state.UserSlice
  );

  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
    admin_get_all_clan_memeber_data,
  } = useSelector((state) => state?.ClanSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    dispatch(Admin_Get_All_Clan_Memeber_Fun());
    dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
    return () => {};
  }, []);

  useEffect(() => {
    dispatch(Admin_Get_All_User_Fun());
    return () => {};
  }, [Alluser_data_isSuccess]);

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
  const [formData, setFormData] = useState({ search: "" });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const All_User = get_Single_clan_data?.data?.members;

  const approvedUser = All_User?.filter((user) => user?.status === "approved");
  const suspendUser = All_User?.filter((user) => user?.status === "suspended");
  const pendingUser = All_User?.filter((user) => user?.status === "pending");

  // Filter users based on search query and user type
  const filterUsers = (users) => {
    return users?.filter((user) =>
      user?.user?.name?.toLowerCase().includes(formData.search.toLowerCase())
    );
  };

  const RenderItem = ({ item }) => {
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";
    if (item.status === "suspended") {
      statusColor = "#F34357"; // Red color for 'Banned' status
      statusBackColor = "#FDF2F3";
    } else if (item.status === "pending") {
      statusColor = "#F27F2D"; // Yellow color for 'Pending' status
      statusBackColor = "#FFF1E7";
    }

    return (
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#CFCDCD",
          borderRadius: 6,
          paddingHorizontal: 10,
          gap: 10,
          paddingVertical: 20,
          marginBottom: 20,
        }}
        onPress={() =>
          navigation.navigate("AdminTab", {
            screen: "adminUserDetails",
            params: { item },
          })
        }
      >
        <View
          style={{
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={{
              uri: "https://static.vecteezy.com/system/resources/previews/019/776/467/non_2x/user-icon-fake-photo-sign-profile-button-simple-style-social-media-poster-background-symbol-user-brand-logo-design-element-user-t-shirt-printing-for-sticker-free-vector.jpg",
            }}
            style={{ width: 50, height: 50, borderRadius: 50 }}
          />
        </View>

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{}}>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
              }}
            >
              {item?.user?.name}
            </Text>

            <Text>{item?.user?.email}</Text>
          </View>

          <View
            style={{ backgroundColor: statusBackColor, paddingHorizontal: 10 }}
          >
            <Text style={{ color: statusColor }}>
              {capitalizeFirstLetter(item.status)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            marginBottom: 20,
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor: "#CFCDCD",
            borderBottomWidth: 1,
            paddingBottom: 10,
          }}
        >
          <MediumFontText data="Users" textstyle={{ fontSize: 18 }} />
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 5,
            paddingHorizontal: 20,
            marginBottom: 5,
          }}
        >
          {usertypelist?.map((item, index) => (
            <TouchableOpacity
              onPress={() => setUserType(item)}
              key={index}
              style={{
                flex: 1,
                backgroundColor: userType === item ? "green" : "white",
                paddingVertical: 10,
                gap: 5,
                borderRadius: 18,
              }}
            >
              <MediumFontText
                data={item}
                textstyle={{
                  textAlign: "center",
                  color: userType === item ? "white" : "black",
                }}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Forminput_Icon
            placeholder="Search for user... "
            containerstyle={{
              padding: 10,
              borderRadius: 5,
              backgroundColor: "#F6F8FAE5",
              flexDirection: "row",
              gap: 10,
              marginBottom: 10,
            }}
            textstyle={{
              fontSize: 16,
            }}
            onChangeText={(text) => handleInputChange("search", text)}
            value={formData.search}
            icon={<AntDesign name="search1" size={22} color="black" />}
          />

          {userType === "All" && (
            <FlatList
              data={filterUsers(All_User)}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item._id}
            />
          )}

          {userType === "Active" && (
            <FlatList
              data={filterUsers(approvedUser)}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item._id}
            />
          )}

          {userType === "Banned" && (
            <FlatList
              data={filterUsers(suspendUser)}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item._id}
            />
          )}

          {userType === "Pending" && (
            <FlatList
              data={filterUsers(pendingUser)}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item._id}
            />
          )}
        </View>

        <EmergencyModal
          visible={modalVisible}
          onClose={closeModal}
          setModalFormVisible={setModalFormVisible}
        />
        <EmergencyModalTwo
          visible={modalformVisible}
          onClose={closeFormModal}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
}
