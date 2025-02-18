import {
  Modal,
  View,
  Text,
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { ReactNode, useState } from "react";
import { FormLabel, Formbutton, Forminput } from "../shared/InputForm";
import { MediumFontText } from "../shared/Paragrahp";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";

interface EmergencyModalProps {
  visible: boolean;
  onClose: () => void;
  setModalFormVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const EmergencyModal = ({
  visible,
  onClose,
  setModalFormVisible,
}: EmergencyModalProps) => {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              fontFamily: "RobotoSlab-Medium",
              color: "black",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Call for Help{" "}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity style={{}} onPress={onClose}>
              <Text style={{}}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 6,
              }}
              onPress={() => {
                setModalFormVisible(true);
                console.log("yes");
                onClose();
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EmergencyModal;

interface EmergencyModalProps2 {
  visible: boolean;
  onClose: () => void;
  type: string;
}

export const EmergencyModalTwo = ({
  onClose,
  visible,
  type,
}: EmergencyModalProps2) => {
  const Emergency_Mutation = useMutation(
    (data_info) => {
      //   let url = `${API_BASEURL}clan/select_Admin_clan/${data_info?.id}`;
      console.log({
        data_info,
      });
      //   const config = {
      //     headers: {
      //       "Content-Type": "application/json",
      //       Accept: "application/json",
      //       //   "Content-Type": "multipart/form-data",
      //       Authorization: `Bearer ${user_data?.token}`,
      //     },
      //   };

      //   if (data_info?.method == "GET") {
      //     return axios.get(url, config);
      //   }

      //   if (data_info?.method == "DELETE") {
      //     return axios.delete(url, config);
      //   }
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Request To Join Estate successfully ",
        });

        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
        // dispatch(reset_login());
        // dispatch(reset_isOnboarding());

        onClose();
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        onClose();
        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const [homeaddress, setHomeaddress] = useState("");
  const [moreinfo, setMoreinfo] = useState("");

  const phoneNumber = "1234567890"; // Replace with the phone number you want to call

  const makePhoneCall = () => {
    const url = `tel:${phoneNumber}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          console.error(`Cannot open phone call: ${url}`);
        }
      })
      .catch((error) => {
        console.error(`Error making phone call: ${error}`);
      });
  };

  console.log({
    type: type,
  });

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            flex: 1,
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              height: "40%",
              width: "100%",
              backgroundColor: "white",
              borderTopRightRadius: 18,
              borderTopLeftRadius: 18,

              paddingHorizontal: 20,

              borderWidth: 1,
              borderColor: "green",
            }}
          >
            <View
              style={{
                height: "16%",
                backgroundColor: "white",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity onPress={onClose}>
                <AntDesign name="arrowleft" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }}>
              <View style={{ marginBottom: 15 }}>
                <Forminput
                  placeholder="House Address"
                  onChangeText={setHomeaddress}
                  value={homeaddress}
                />

                <TextInput
                  placeholder="Add more info...."
                  onChangeText={setMoreinfo}
                  value={moreinfo}
                  style={{
                    // borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    fontSize: 16,
                    backgroundColor: "#F6F8FAE5",
                    // opacity: 0.4
                    minHeight: 100,
                    marginTop: 20,
                  }}
                  multiline
                  numberOfLines={4}
                />
              </View>

              <TouchableOpacity
                onPress={makePhoneCall}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                  marginBottom: 5,
                }}
              >
                <Ionicons name="call" size={24} color="#04973C" />

                <MediumFontText
                  textstyle={{ fontSize: 14 }}
                  data="Call for Admin"
                />
              </TouchableOpacity>

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
                onPress={() => {
                  Emergency_Mutation.mutate({
                    type: type,
                    homeaddress: homeaddress,
                    moreinfo: moreinfo,
                  });
                }}
                //
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "50%",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "blue", // Customize the close button style
  },
});
