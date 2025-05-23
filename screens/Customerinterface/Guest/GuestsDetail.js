import AppScreen from "../../../components/shared/AppScreen";
import {
  View,
  Text,
  Button,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  FlatList,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";

import * as Clipboard from "expo-clipboard"; // Import the Clipboard API
import { Share } from "react-native"; // Import the Share API
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import {
  Ionicons,
  AntDesign,
  MaterialIcons,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  Get_All_User_Guest_Fun,
  Get__User_Guest_detail_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import { formatDateandTime } from "../../../utils/DateTime";
import * as Sharing from "expo-sharing";

import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot";
// import Share from "react-nat
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import { useMutateData } from "../../../hooks/Request";

const GuestsDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const { itemdata } = route.params;

  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { get_all_user_guest_data, get_user_guest_detail_data } = useSelector(
    (state) => state?.GuestSlice
  );

  const {
    mutate: setdepature,
    isLoading: ispendingsetdepature,
    error,
  } = useMutateData("api/v1/guest/modify", "PATCH", "guest");

  const [qrCodeValue, setQRCodeValue] = useState("");
  const viewShotRef = useRef();

  // Function to copy access code to clipboard
  const copyToClipboard = async (code) => {
    await Clipboard.setStringAsync(code);
    Toast.show({
      type: "success",
      text1: "Access code copied to clipboard!",
    });
  };

  // Function to share access code via WhatsApp or other apps
  const shareAccessCode = async (code) => {
    try {
      const result = await Share.share({
        message: `Here is the access code: ${code}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type: ", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Error sharing access code: ", error.message);
    }
  };

  // const copyAndShareAccessCode = async (code) => {
  //   try {
  //     // Copy to clipboard
  //     await Clipboard.setStringAsync(code);
  //     Toast.show({
  //       type: "success",
  //       text1: "Access code copied to clipboard!",
  //     });

  //     // Share the code
  //     const result = await Share.share({
  //       message: `Here is the access code: ${code}`,
  //     });
  //     if (result.action === Share.sharedAction) {
  //       if (result.activityType) {
  //         console.log("Shared with activity type: ", result.activityType);
  //       } else {
  //         console.log("Shared successfully");
  //       }
  //     } else if (result.action === Share.dismissedAction) {
  //       console.log("Share dismissed");
  //     }
  //   } catch (error) {
  //     console.error("Error sharing access code: ", error.message);
  //   }
  // };

  const copyAndShareAccessCode = async (accessCode) => {
    // Message to copy and share
    const message = `Hi,\n\nHere is your one-time access code: ${accessCode}\n\nPowered by Pausepoint.net.`;

    // Copy to clipboard
    Clipboard.setString(message);

    // Share message
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    dispatch(Get__User_Guest_detail_Fun(itemdata?._id));

    return () => {};
  }, [dispatch]);

  const filteredData = get_all_user_guest_data?.userInvites?.filter((item) =>
    item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const Cancle_Guests_Mutation = useMutation(
    (data_info) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      let url = `${API_BASEURL}visitor/cancel/${get_user_guest_detail_data?.invitation?._id}`;

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: " successfully ",
        });

        dispatch(Get_All_User_Guest_Fun());

        navigation.goBack();
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });

        // dispatch(Get_User_Clans_Fun());
        // dispatch(Get_User_Profle_Fun());
        // dispatch(Get_all_clan_User_Is_adminIN_Fun());
      },
    }
  );

  const captureAndShare = async () => {
    try {
      const uri = await captureQRCodeAsImage();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing QR code: ", error.message);
    }
  };

  const captureQRCodeAsImage = async () => {
    try {
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch (error) {
      throw new Error("Error capturing QR code as image: ", error);
    }
  };

  const handleDeparture = () => {
    data = {
      invitationId: get_user_guest_detail_data?.invitation?._id,
      status: "departed",
    };

    console.log(data);
    setdepature(
      data,
      {
        onSuccess: (response) => {
          console.log({
            ddd: response?.data?.data,
          });
          navigation.goBack();
        },
      },

      {
        onError: (error) => {
          console.error("Mutation Error:", error.message);
        },
      }
    );
    // Handle fund wallet logic here
    // navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Invitation Details</Text>
        <View style={styles.detailsContainer}>
          <View>
            <Text style={styles.label}>Visitor Name:</Text>
            <Text style={styles.text}>
              {get_user_guest_detail_data?.invitation?.visitor_name}
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.text}>
              {get_user_guest_detail_data?.invitation?.gender}
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Phone Number:</Text>
            <Text style={styles.text}>
              {get_user_guest_detail_data?.invitation?.phone_number}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text style={styles.label}>Access Code:</Text>

              <Text style={styles.text}>
                {get_user_guest_detail_data?.invitation?.access_code}
              </Text>
            </View>

            <TouchableOpacity
              style={
                {
                  // backgroundColor: "blue",
                  // padding: 10,
                  // borderRadius: 5,
                  // marginTop: 10,
                }
              }
              onPress={() =>
                copyAndShareAccessCode(
                  get_user_guest_detail_data?.invitation?.access_code
                )
              }
            >
              <FontAwesome name="copy" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* // In your return statement */}
          <TouchableOpacity
            style={
              {
                // backgroundColor: "blue",
                // padding: 10,
                // borderRadius: 5,
                // marginTop: 10,
              }
            }
            onPress={() =>
              copyAndShareAccessCode(
                get_user_guest_detail_data?.invitation?.access_code
              )
            }
          >
            <Text style={{ color: "white", textAlign: "center" }}>
              Copy and Share Access Code
            </Text>
          </TouchableOpacity>

          <View>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.text}>
              {get_user_guest_detail_data?.invitation?.status}
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Arrived Date:</Text>
            <Text style={styles.text}>
              {formatDateandTime(
                get_user_guest_detail_data?.invitation?.arrived_at
              )}
              {/* {get_user_guest_detail_data?.invitation?.expires} */}
            </Text>
          </View>

          {ispendingsetdepature ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <Text style={styles.label}>Departure Date:</Text>
                <Text style={styles.text}>
                  {formatDateandTime(
                    get_user_guest_detail_data?.invitation?.departed_at
                  )}
                  {/* {get_user_guest_detail_data?.invitation?.expires} */}
                </Text>
              </View>

              {!get_user_guest_detail_data?.invitation?.departed_at && (
                <TouchableOpacity
                  style={
                    {
                      // backgroundColor: "blue",
                      // padding: 10,
                      // borderRadius: 5,
                      // marginTop: 10,
                    }
                  }
                  onPress={handleDeparture}
                >
                  {/* <FontAwesome name="copy" size={24} color="black" /> */}
                  <FontAwesome5
                    name="plane-departure"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              )}
            </View>
          )}

          <Text style={styles.label}>Expires Date:</Text>
          <Text style={styles.text}>
            {formatDateandTime(get_user_guest_detail_data?.invitation?.expires)}
            {/* {get_user_guest_detail_data?.invitation?.expires} */}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              // paddingHorizontal: 20,
              // paddingVertical: 10,
              borderRadius: 10,
              width: "40%",
              // height: 50
              paddingVertical: 10,
            }}
            onPress={() => {
              Cancle_Guests_Mutation.mutate();
            }}
          >
            {Cancle_Guests_Mutation.isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  marginBottom: 5,
                  color: "white",
                  textAlign: "center",
                }}
              >
                Cancel Visitor
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: "green",
              // paddingHorizontal: 20,
              // paddingVertical: 10,
              borderRadius: 10,
              width: "40%",
              // height: 50
              paddingVertical: 10,
            }}
            onPress={() => {
              // Cancle_Guests_Mutation.mutate();
              setModalVisible(true);
              const jsonString = JSON.stringify(
                get_user_guest_detail_data?.invitation
              );
              setQRCodeValue(jsonString);
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5,
                color: "white",
                textAlign: "center",
              }}
            >
              Qrcode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ position: "absolute", right: 20, top: 50, zIndex: 1 }}>
        <TouchableOpacity
          style={{
            backgroundColor: "green",
            // paddingHorizontal: 20,
            // paddingVertical: 10,
            borderRadius: 50,
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => {
            navigation.navigate("inviteguest", { itemdata });
          }}
        >
          <MaterialIcons name="mode-edit" size={24} color="black" />
        </TouchableOpacity>
      </View>

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
            width: "90%",
            height: "50%",
          }}
        >
          <TouchableOpacity onPress={() => setModalVisible(false)}>
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
            Qrcode
          </Text>

          {qrCodeValue !== "" && (
            <View
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {console.log({
                sssdd: qrCodeValue,
              })}
              <QRCode
                value={qrCodeValue}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </View>
          )}

          <Text style={{ textAlign: "center", marginTop: 30, fontSize: 16 }}>
            Screen Short and send to Guest
          </Text>

          {/* <TouchableOpacity
            onPress={captureAndShare}
            style={{
              marginTop: 20,
              backgroundColor: "#007AFF",
              padding: 10,
              borderRadius: 5,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
              }}
            >
              Share QR Code
            </Text>
          </TouchableOpacity> */}
        </View>
      </CenterReuseModals>
    </View>
  );
};

export default GuestsDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
    // backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
  },
});
