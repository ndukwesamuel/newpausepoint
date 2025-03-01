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
import { emergencydata } from "../../../components/Emergency/emdata";
import AppScreen from "../../../components/shared/AppScreen";
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../../components/Emergency/Modal";
import {
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import DarkModeToggle from "../../../components/Account/DarkModeToggle";
import General from "../../../components/Account/General";
import { DeleteAccountModal } from "../../../components/Account/Modal";
import { DeleteLAccount, Logout } from "../../../components/Account/Logout";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigation";

import { useDispatch, useSelector } from "react-redux";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";

type GeneralData = {
  id: number;
  icon: string;
  label: string;
  icon_type: string;
  link: string;
};

const data: GeneralData[] = [
  {
    id: 1,
    icon: "user",
    label: "Edit Personal Info",
    icon_type: "AntDesign",
    link: "PersonalInfo",
    // link: "comming"
  },
  // {
  //     id: 2,
  //     icon: 'notifications-outline',
  //     label: 'Notification',
  //     icon_type: 'Ionicons',
  //     // link: 'notificationsettings',
  //     link: "comming"

  // },

  // {
  //     id: 3,
  //     icon: 'setting',
  //     label: 'Change Password',
  //     icon_type: 'Ionicons',
  //     // link: 'ChangePassowrd',
  //     link: "comming"

  // },

  // Add more objects as needed
];

let new_item = {
  id: 4,
  icon: "logout-outline",
  label: "Logout",
  icon_type: "Ionicons",
  link: "Logout",
};

const Account = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { userProfile_data } = useSelector((state) => state?.ProfileSlice);

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

  const handleDarkModeToggle = (isDarkMode: boolean) => {
    // Add logic to handle dark mode state in your app
    console.log(`Dark Mode is ${isDarkMode ? "enabled" : "disabled"}`);
    // You can update your app's theme or styles based on the isDarkMode state here.
  };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, [dispatch]);

  console.log({
    s: userProfile_data,
  });

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform?.OS === "ios" ? "padding" : "height"}
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
          <MediumFontText data="Account" textstyle={{ fontSize: 18 }} />
        </View>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <Image
              source={{
                uri: userProfile_data?.photo,
              }}
              style={{ width: 68, height: 68, borderRadius: 50 }}
            />

            <View>
              <MediumFontText
                data={userProfile_data?.user?.name}
                textstyle={{ fontSize: 18, fontWeight: "500" }}
              />
              <RegularFontText
                data={userProfile_data?.phoneNumber}
                textstyle={{ fontSize: 14, fontWeight: "400" }}
              />
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginTop: 20,
            }}
          >
            <Text>General</Text>
            <View
              style={{ borderColor: "#CFCDCD", borderWidth: 1, width: "80%" }}
            />
          </View>

          <View style={{ gap: 40, marginBottom: 40 }}>
            {data?.map((item, index) => (
              <General key={item?.id} item={item} />
            ))}
          </View>

          {/* <DarkModeToggle onDarkModeToggle={handleDarkModeToggle} /> */}
          <View
            style={{
              borderBottomColor: "#CFCDCD",
              borderBottomWidth: 1,
              marginBottom: 20,
            }}
          />

          <DeleteLAccount item={new_item} />
          <Logout item={new_item} />

          {/* 
                    <View>
                        <TouchableOpacity
                            // onPress={() => navigation.navigate('DeleteAccount')}
                            onPress={() => navigation.navigate('comming')}


                            style={{ justifyContent: "flex-end", alignItems: 'center', flexDirection: 'row', gap: 10, marginTop: 20 }}>


                            <RegularFontText data="Delete Account" textstyle={{ fontSize: 14, fontWeight: '400', color: 'red', textDecorationColor: 'red', textDecorationLine: 'underline' }} />

                        </TouchableOpacity>
                    </View> */}
        </View>

        <EmergencyModalTwo
          visible={modalformVisible}
          onClose={closeFormModal}
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default Account;

const styles = StyleSheet.create({});
