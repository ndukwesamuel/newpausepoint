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
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
// ------------------------------------------------------------------
// UPDATED IMPORT: Use @tanstack/react-query instead of react-query
import { useMutation } from "@tanstack/react-query";
// ------------------------------------------------------------------

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, AntDesign, MaterialIcons } from "@expo/vector-icons";

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
import { API_CONFIG } from "../../../api";

const API_BASEURL = API_CONFIG?.BASE_URL;
console.log({
  tyyy: API_BASEURL,
});
const GuestsDetail = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const route = useRoute();
  const { itemdata } = route.params;

  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { get_all_user_guest_data, get_user_guest_detail_data } = useSelector(
    (state) => state?.GuestSlice,
  );

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
  }, [dispatch, itemdata?._id]); // Added dispatch and itemdata?._id to dependency array

  const filteredData = get_all_user_guest_data?.userInvites?.filter((item) =>
    item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase()),
  );

  // ------------------------------------------------------------------
  // TanStack Query useMutation for Cancle Guests
  // ------------------------------------------------------------------
  const Cancle_Guests_Mutation = useMutation({
    mutationFn: (data_info) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      // Ensure invitation ID is available before proceeding
      const invitationId = get_user_guest_detail_data?.invitation?._id;
      if (!invitationId) {
        return Promise.reject(new Error("Invitation ID is missing."));
      }

      let url = `${API_BASEURL}visitor/cancel/${invitationId}`;

      return axios.post(url, data_info, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Visitor successfully canceled",
      });

      dispatch(Get_All_User_Guest_Fun());

      navigation.goBack();
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: `${
          error?.response?.data?.message || "Failed to cancel visitor."
        } `,
      });

      // Optionally refresh the detail data if needed, but going back is usually sufficient
      // dispatch(Get__User_Guest_detail_Fun(itemdata?._id));
    },
  });
  // ------------------------------------------------------------------

  const [qrCodeValue, setQRCodeValue] = useState("");
  const viewShotRef = useRef();

  // Note: Sharing implementation using expo-sharing and view-shot is kept
  // but the share button is commented out in the return statement.

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
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        return uri;
      }
      throw new Error("ViewShot reference is not ready.");
    } catch (error) {
      throw new Error("Error capturing QR code as image: " + error.message);
    }
  };

  const handleCancelVisitor = () => {
    // Check if the mutation is not already running
    if (!Cancle_Guests_Mutation.isPending) {
      Cancle_Guests_Mutation.mutate({}); // Pass an empty object if no body is needed
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Invitation Details</Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.label}>Clan:</Text>
          <Text style={styles.text}>
            {get_user_guest_detail_data?.invitation?.clan}
          </Text>

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
          <Text style={styles.label}>Creator:</Text>
          <Text style={styles.text}>
            {get_user_guest_detail_data?.invitation?.creator}
          </Text>
          <Text style={styles.label}>Access Code:</Text>
          <Text style={styles.text}>
            {get_user_guest_detail_data?.invitation?.access_code}
          </Text>

          <Text style={styles.label}>Expires Date:</Text>
          <Text style={styles.text}>
            {formatDateandTime(get_user_guest_detail_data?.invitation?.expires)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 20, // Added margin for spacing
          }}
        >
          {/* Un-commented and updated the Cancel Visitor Button using the new mutation */}
          <TouchableOpacity
            style={{
              backgroundColor: Cancle_Guests_Mutation.isPending
                ? "#f8d7da"
                : "red",
              borderRadius: 10,
              width: "48%", // Adjusted width to fit better with the Qrcode button
              paddingVertical: 10,
              justifyContent: "center",
            }}
            onPress={handleCancelVisitor}
            disabled={Cancle_Guests_Mutation.isPending} // Disable while loading
          >
            {Cancle_Guests_Mutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
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
              borderRadius: 10,
              width: "48%", // Adjusted width to fit better with the Cancel button
              paddingVertical: 10,
              justifyContent: "center",
            }}
            onPress={() => {
              setModalVisible(true);
              // Set the QR code value to the JSON string of the invitation data
              const jsonString = JSON.stringify(
                get_user_guest_detail_data?.invitation,
              );
              setQRCodeValue(jsonString);
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
              Qrcode
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
          <MaterialIcons name="mode-edit" size={24} color="white" />
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
            alignItems: "center", // Center content horizontally
          }}
        >
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ position: "absolute", top: 10, right: 10, zIndex: 2 }}
          >
            <MaterialIcons name="cancel" size={30} color="gray" />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "black",
              textAlign: "center",
              marginBottom: 20,
              marginTop: 10,
            }}
          >
            Visitor Access QR Code
          </Text>

          {qrCodeValue !== "" ? (
            // Use ViewShot to capture the QR code for sharing if implemented
            <ViewShot
              ref={viewShotRef}
              options={{ format: "png", quality: 0.9 }}
            >
              <View
                style={{
                  padding: 10, // Padding around QR code for better capture
                  backgroundColor: "white",
                }}
              >
                <QRCode
                  value={qrCodeValue}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            </ViewShot>
          ) : (
            <ActivityIndicator
              size="large"
              color="green"
              style={{ marginTop: 50 }}
            />
          )}

          <Text
            style={{
              textAlign: "center",
              marginTop: 30,
              fontSize: 14,
              color: "gray",
            }}
          >
            Screen shot and share with your guest.
          </Text>

          <TouchableOpacity
            onPress={captureAndShare}
            style={{
              marginTop: 20,
              backgroundColor: "#007AFF",
              paddingVertical: 10,
              paddingHorizontal: 20,
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
          </TouchableOpacity>
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
    backgroundColor: "#fff", // Added background for better elevation visibility
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
  },
});
