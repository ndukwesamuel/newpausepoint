import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Provider, useDispatch, useSelector } from "react-redux";

import React, { useState } from "react";
import { emergencydata } from "../../../components/Emergency/emdata";
import AppScreen from "../../../components/shared/AppScreen";
import EmergencyModal, {
  EmergencyModalTwo,
} from "../../../components/Emergency/Modal";
import { MediumFontText } from "../../../components/shared/Paragrahp";
import ReuseModals, {
  BottomModal,
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import LottieView from "lottie-react-native";
import {
  CustomTextArea,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const Emergency = ({ navigation }) => {
  const [modalformVisible, setModalFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const { user_data } = useSelector((state) => state.AuthSlice);
  const closeFormModal = () => {
    setModalFormVisible(false);
    setSelectedItem(null);
  };

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

  const Emergency_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}emargencyreport`;
      console.log({
        data_info,
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

      //   if (data_info?.method == "GET") {
      //     return axios.get(url, config);
      //   }

      //   if (data_info?.method == "DELETE") {
      //     return axios.delete(url, config);
      //   }
      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        console.log({
          success,
        });
        Toast.show({
          type: "success",
          text1: "Emergency Report successfully send",
        });

        closeFormModal();
      },

      onError: (error) => {
        console.log({
          error: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
        });
      },
    }
  );

  const RenderItem = ({ item }) => {
    console.log({
      hhh: item,
    });
    const openFormModal = () => {
      setModalFormVisible(!modalformVisible);
      setSelectedItem(item); // Add this line to set the selected item
    };

    return (
      <View>
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
          onPress={openFormModal}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: "#CFCDCD",
              borderRadius: 6,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image source={item.image} style={{ width: 38, height: 40 }} />
          </View>

          <View style={{ width: "90%" }}>
            <Text
              style={{
                fontWeight: "500",
                fontSize: 14,
                fontFamily: "RobotoSlab-Medium",
                marginBottom: 10,
              }}
            >
              {item.name}
            </Text>

            <Text>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    // dispatch(Get_All_User_Guest_Fun());
    dispatch(UserProfile_data_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  return (
    <ScreenWrapper
      title="Emergency"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      showHeader={true}
    >
      {get_user_profile_data?.currentClanMeeting ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            <FlatList
              data={emergencydata}
              renderItem={({ item }) => <RenderItem item={item} />}
            />
          </View>

          <CenterReuseModals
            visible={modalformVisible}
            onClose={() => setModalFormVisible(false)}
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
              <View
                style={{
                  backgroundColor: "white",
                  // padding: 20,
                  width: "100%",
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  height: "50%",
                  paddingTop: 30,
                }}
              >
                <TouchableOpacity
                  style={{
                    // flexDirection: "row",
                    // justifyContent: "flex-end",
                    // marginTop: 10,
                    // borderWidth: 1,
                    // borderColor: "#CFCDCD",
                    // borderRadius: 6,
                    // paddingHorizontal: 10,
                    // gap: 10,
                    // width: 50,

                    position: "absolute",
                    top: 0,
                    right: 1,
                  }}
                  onPress={() => setModalFormVisible(false)}
                >
                  <MaterialIcons name="cancel" size={24} color="black" />
                </TouchableOpacity>
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
                  Make a Report About {selectedItem?.type} Emergency
                </Text>

                <View>
                  <MediumFontText
                    data="Location"
                    textstyle={{ fontSize: 14 }}
                  />

                  <Forminput
                    placeholder="Location Information"
                    onChangeText={setHomeaddress}
                    value={homeaddress}
                  />

                  <MediumFontText
                    data="Additional Information"
                    textstyle={{ fontSize: 14 }}
                  />

                  <CustomTextArea
                    placeholder="Enter text here..."
                    value={moreinfo}
                    onChangeText={setMoreinfo}
                    style={{ width: "80%" }}
                    inputStyle={{
                      textAlignVertical: "top", // Ensures text starts from the top
                      paddingTop: 10, // Add paddingTop to control vertical padding
                      paddingBottom: 10, // Add paddingBottom to balance padding
                      backgroundColor: "#F6F8FAE5",
                      paddingHorizontal: 10,
                      paddingTop: 10, // Add paddingTop to control the vertical padding
                      paddingBottom: 10, // Add paddingBottom to balance the padding
                      height: 100,
                      borderRadius: 6,
                      fontSize: 16,
                    }}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#04973C",
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 6,
                    marginTop: 20,
                  }}
                  onPress={() => {
                    Emergency_Mutation.mutate({
                      type: selectedItem?.type,
                      address: homeaddress,
                      additionalInfo: moreinfo,
                    });
                  }}
                >
                  {Emergency_Mutation.isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "400",
                        fontFamily: "RobotoSlab-Regular",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      Submit
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </CenterReuseModals>
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
    </ScreenWrapper>
  );
};

export default Emergency;

const styles = StyleSheet.create({});
