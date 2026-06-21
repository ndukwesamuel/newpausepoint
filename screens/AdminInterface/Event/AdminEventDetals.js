import AppScreen from "../../../components/shared/AppScreen"; // Not used in the final return, but kept for context
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
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";

// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
import { useMutation } from "@tanstack/react-query";

const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker"; // Not used directly
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker"; // Not used directly

import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  Get_All_User_Guest_Fun, // Not used directly
  Get__User_Guest_detail_Fun, // Not used directly
} from "../../../Redux/UserSide/GuestSlice"; // Not used directly
import { formatDateandTime } from "../../../utils/DateTime";
import * as Sharing from "expo-sharing";

import QRCode from "react-native-qrcode-svg";
import ViewShot from "react-native-view-shot"; // Not used directly
// import Share from "react-nat // Not used directly
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import {
  Get_Single_UserEvent_Fun,
  Get_UserEvent_Fun,
  reset_MainEventSlice, // Not used directly
} from "../../../Redux/UserSide/MainEventSlice";

const AdminEventDetals = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const { itemdata } = useRoute().params;

  const animation = useRef(null); // Not used directly
  const [searchQuery, setSearchQuery] = useState(""); // Not used directly
  const { singleEvent_Data, singleEvent_isLoading } = useSelector(
    (state) => state?.MainEventSlice
  );

  // console.log({ ooo: singleEvent_Data }); // Commented out

  const { user_data } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    dispatch(Get_Single_UserEvent_Fun(itemdata?._id));

    return () => {
      // dispatch(reset_MainEventSlice()); // Commented out in original
    };
  }, [dispatch, itemdata?._id]); // Added dependencies for best practice

  // --- TanStack Query useMutation for Cancelling Event ---
  const Cancle_Guests_Mutation = useMutation({
    mutationFn: (data_info) => {
      // 'mutationFn' replaces the function passed directly to useMutation
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      // Note: The original code passed data_info (which appears empty) to axios.delete.
      // Axios delete typically doesn't take a data body, but I'm keeping the original signature.
      let url = `${API_BASEURL}resident-event/${singleEvent_Data?.events?._id}`;

      return axios.delete(url, config); // Simplified to usually correct axios.delete signature
    },
    onSuccess: () => {
      Toast.show({
        type: "success",
        text1: "Event cancelled successfully",
      });

      // Re-fetch list of events via Redux (for simplicity/Redux consistency)
      dispatch(Get_UserEvent_Fun());

      navigation.goBack();
    },

    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message}`,
      });
    },
  });
  // -------------------------------------------------------

  const [qrCodeValue, setQRCodeValue] = useState("");
  const viewShotRef = useRef();

  // Note: These functions are not currently used due to the share button being commented out,
  // but kept for completeness.
  const captureAndShare = async () => {
    try {
      const uri = await captureQRCodeAsImage();
      await Sharing.shareAsync(uri);
    } catch (error) {
      console.error("Error sharing QR code: ", error.message);
      Toast.show({
        type: "error",
        text1: "Failed to share QR code",
      });
    }
  };

  const captureQRCodeAsImage = async () => {
    try {
      // Check if the ref is attached to the view correctly (original code didn't show this)
      if (!viewShotRef.current) {
        throw new Error("ViewShot ref not ready.");
      }
      const uri = await viewShotRef.current.capture();
      return uri;
    } catch (error) {
      // Throwing an error here is fine, but it should be caught above.
      console.error("Error capturing QR code as image: ", error);
      throw new Error("Error capturing QR code as image.");
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);

    // Fetch the updated data (currently using Redux)
    await dispatch(Get_Single_UserEvent_Fun(itemdata?._id));

    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {singleEvent_isLoading && (
        <View>
          <ActivityIndicator size="large" color="green" />
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Invitation Details </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Clan:</Text>
          <Text style={styles.text}>
            {singleEvent_Data?.events?.clan?.name}
          </Text>

          <View>
            <Text style={styles.label}>Event Name:</Text>
            <Text style={styles.text}>{singleEvent_Data?.events?.name}</Text>
          </View>

          <View>
            <Text style={styles.label}>Number Of Guest :</Text>
            <Text style={styles.text}>
              {singleEvent_Data?.events?.guestNumber}
            </Text>
          </View>

          <View>
            <Text style={styles.label}>Date :</Text>
            <Text style={styles.text}>{singleEvent_Data?.events?.date}</Text>
          </View>

          <View>
            <Text style={styles.label}>Time :</Text>
            <Text style={styles.text}>{singleEvent_Data?.events?.time}</Text>
          </View>

          {!singleEvent_Data?.events?.isAdmin && (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "red",
                    borderRadius: 10,
                    width: "40%",
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    // Call the mutate function without arguments for this use case
                    Cancle_Guests_Mutation.mutate();
                  }}
                  // Disable the button while the mutation is in progress
                  disabled={Cancle_Guests_Mutation.isLoading}
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
                      Cancel Event
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    backgroundColor: "green",
                    borderRadius: 10,
                    width: "40%",
                    paddingVertical: 10,
                  }}
                  onPress={() => {
                    setModalVisible(true);
                    // The QR code value is the entire event object stringified
                    const jsonString = JSON.stringify(singleEvent_Data?.events);
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
            </>
          )}

          {singleEvent_Data?.events?.isAdmin && (
            <View>
              <Text style={styles.label}>Creator:</Text>
              <Text style={styles.text}>Admin</Text>
            </View>
          )}
        </View>
      </View>

      {!singleEvent_Data?.events?.isAdmin && (
        <View style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "green",
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
      )}

      {/* QR Code Modal */}
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
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ alignSelf: "flex-start" }}
          >
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "500",
              // fontFamily: "RobotoSlab-Medium", // Removed custom font for standard use
              color: "black",
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Qrcode
          </Text>

          {/* ViewShot is only useful if you intend to capture and share the image */}
          {qrCodeValue !== "" && (
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 1.0 }}
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white", // Ensure background is white for capture
              }}
            >
              <QRCode
                value={qrCodeValue}
                size={200}
                color="black"
                backgroundColor="white"
              />
            </ViewShot>
          )}

          <Text style={{ textAlign: "center", marginTop: 30, fontSize: 16 }}>
            Screen Shot and send to Guest
          </Text>

          {/* Share button (commented out in original, kept here as an option) */}
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
    </ScrollView>
  );
};

export default AdminEventDetals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detailsContainer: {
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
