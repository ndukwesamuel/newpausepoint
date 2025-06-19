import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import RegHeaders from "../components/shared/RegHeaders";
import {
  RegistraionHeadersText,
  RegistraionParagraphText,
} from "../components/shared/Registraion";
import {
  FormLabel,
  Formbutton,
  Forminput,
  Forminputpassword,
} from "../components/shared/InputForm";

import { Ionicons, AntDesign } from "@expo/vector-icons";

interface Registraionprops {
  mainPassword: string;
  confirmPassword: string;
}

const CreatePassword = ({ navigation }: { navigation: any }) => {
  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [privacypolicy, setPrivacypolicy] = useState(false);
  const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

  const [passwords, setPasswords] = useState<Registraionprops>({
    mainPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (
    field: keyof Registraionprops,
    text: string
  ) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  const handleSubmit = () => {
    console.log("Current Password:", passwords.mainPassword);
    console.log("New Password:", passwords.confirmPassword);
    // Add your password change logic here, e.g., sending it to a server
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handelsubmit = () => {
    console.log({
      passwords,
    });
  };
  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
          <RegistraionHeadersText
            data="Create New Password  kaka"
            textStyle={{}}
          />

          <RegistraionParagraphText
            data="Please enter your new password, and ensure to keep it safe."
            color="#8E8E8F"
          />

          <View style={{ flex: 1, marginTop: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <FormLabel data="Password " />

              <Forminputpassword
                placeholder="Enter your password"
                onChangeText={(text) =>
                  handlePasswordChange("mainPassword", text)
                }
                value={passwords.mainPassword}
              />
            </View>

            <View style={{ marginBottom: 20 }}>
              <FormLabel data="Confirm Password " />

              <Forminputpassword
                placeholder="Enter your password"
                onChangeText={(text) =>
                  handlePasswordChange("confirmPassword", text)
                }
                value={passwords.confirmPassword}
              />
            </View>
          </View>

          <View style={{ flex: 0.3 }}>
            <Formbutton
              buttonStyle={{
                backgroundColor: "#04973C",
                paddingVertical: 14,
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
              onPress={() => navigation.navigate("usertab")}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default CreatePassword;

const styles = StyleSheet.create({
  customInput: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f6f8fa",
    // opacity: 0.4
  },
});
