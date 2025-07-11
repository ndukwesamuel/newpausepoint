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
import React, { useState } from "react";
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
import SmsToggle from "../../../components/Account/SmsToggle";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../navigation/AppNavigation";
import {
  CustomCheckbox,
  CustomTextArea,
  FormLabel,
  Formbutton,
  Forminputpassword,
} from "../../../components/shared/InputForm";

import { Entypo } from "@expo/vector-icons";
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
  },
  {
    id: 2,
    icon: "notifications-outline",
    label: "Notification",
    icon_type: "Ionicons",
    link: "notificationsettings",
  },

  {
    id: 3,
    icon: "setting",
    label: "Change Password",
    icon_type: "Ionicons",
    link: "EditPersonalInformation",
  },

  // Add more objects as needed
];

let new_item = {
  id: 4,
  icon: "logout-outline",
  label: "Logout",
  icon_type: "Ionicons",
  link: "",
};

interface Registraionprops {
  mainPassword: string;
  confirmPassword: string;
}

const DeleteAccount = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const [passwords, setPasswords] = useState<Registraionprops>({
    mainPassword: "",
    confirmPassword: "",
  });

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  let data = ["Delete your account from Pausepoint", "Erase all your Clans"];

  const handleDarkModeToggle = (isDarkMode: boolean) => {
    // Add logic to handle dark mode state in your app
    console.log(`Dark Mode is ${isDarkMode ? "enabled" : "disabled"}`);
    // You can update your app's theme or styles based on the isDarkMode state here.
  };

  const handleSMSToggle = (isDarkMode: boolean) => {
    // Add logic to handle dark mode state in your app
    console.log(`SMS Mode is ${isDarkMode ? "enabled" : "disabled"}`);
    // You can update your app's theme or styles based on the isDarkMode state here.
  };

  const handlePasswordChange = (
    field: keyof Registraionprops,
    text: string
  ) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  const checkboxes = [
    { label: "I could not find my Clan", id: 1 },
    { label: "I don’t understand how to use the app ", id: 2 },
    // Add more checkboxes here with unique IDs
  ];

  const handleCheckboxChange = (value: boolean, id: number) => {
    console.log(`Checkbox ${id} value changed: ${value}`);
  };

  const [options, setOptions] = useState<{
    option1: boolean;
    option2: boolean;
    option3: boolean;
  }>({
    option1: false,
    option2: false,
    option3: false,
  });

  console.log({ options });

  const handleOptionChange = (option: keyof typeof options) => {
    setOptions({
      ...options,
      [option]: !options[option],
    });
  };

  const [text, setText] = useState("");

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            marginBottom: 20,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: "#CFCDCD",
            borderBottomWidth: 1,
            paddingBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <MediumFontText
            data="Delete my Account"
            textstyle={{ fontSize: 18, width: "80%", textAlign: "center" }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <MediumFontText
            data="Deleting your account will:"
            textstyle={{ fontSize: 14 }}
          />

          <View style={{ paddingLeft: 20 }}>
            {data?.map((item, index) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Entypo name="dot-single" size={24} color="black" />
                <RegularFontText
                  data={item}
                  textstyle={{ fontSize: 14, textAlign: "justify" }}
                />
              </View>
            ))}
          </View>

          <MediumFontText
            data="Having issues? Talk to us about it. Please contact our Live Support."
            textstyle={{ fontSize: 14, marginBottom: 20 }}
          />

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              borderWidth: 1,
              borderColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Live Support"
            onPress={() => console.log("LiveSupport")}
          />

          <MediumFontText
            data="Why do you want to delete account?
"
            textstyle={{ fontSize: 14, marginBottom: 20 }}
          />

          {/* <View style={{ gap: 40, marginBottom: 40 }}>
                        {data?.map((item, index) => (
                            <General key={item?.id} item={item} />
                        ))}
                    </View> */}

          <View>
            <CustomCheckbox
              value={options.option1}
              onValueChange={() => handleOptionChange("option1")}
              label="I could not find my Clan"
              containerView={{
                flexDirection: "row",
                alignItems: "center",
              }}
              TextStyle={{
                fontSize: 15,
              }}
              inputStyle={{
                margin: 5,
              }}
            />
            <CustomCheckbox
              value={options.option2}
              onValueChange={() => handleOptionChange("option2")}
              label="I don’t understand how to use the app"
              containerView={{
                flexDirection: "row",
                alignItems: "center",
              }}
              TextStyle={{
                fontSize: 15,
              }}
              inputStyle={{
                margin: 5,
              }}
            />
            <CustomCheckbox
              value={options.option3}
              onValueChange={() => handleOptionChange("option3")}
              label="I want to register with another phone number"
              containerView={{
                flexDirection: "row",
                alignItems: "center",
              }}
              TextStyle={{
                fontSize: 15,
              }}
              inputStyle={{
                margin: 5,
              }}
            />
          </View>

          <View>
            <Text>Others;</Text>
          </View>

          <CustomTextArea
            placeholder="Enter text here..."
            value={text}
            onChangeText={handleTextChange}
            style={{ width: "80%" }}
            inputStyle={{
              backgroundColor: "#F6F8FA",
              paddingHorizontal: 10,
              paddingVertical: 20,
              height: 200,
              padding: 10,
              borderRadius: 6,
              fontSize: 16,
            }}
          />
          <View style={{ alignItems: "flex-end", marginTop: 20 }}>
            <Formbutton
              buttonStyle={{
                width: "40%",
                backgroundColor: "#04973C",
                borderWidth: 1,
                borderColor: "#04973C",
                paddingVertical: 5,
                alignItems: "center",
                borderRadius: 5,
              }}
              textStyle={{
                color: "white",
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
              }}
              data="Submit"
            />
          </View>
        </View>

        <Formbutton
          buttonStyle={{
            backgroundColor: "#04973C",
            borderWidth: 1,
            borderColor: "#04973C",
            paddingVertical: 14,
            alignItems: "center",
            borderRadius: 5,
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
            marginHorizontal: 20,
          }}
          textStyle={{
            color: "white",
            fontWeight: "500",
            fontSize: 14,
            fontFamily: "RobotoSlab-Medium",
          }}
          data="Delete My Account"
        />
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default DeleteAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
  },
});
