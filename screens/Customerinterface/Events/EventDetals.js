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
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

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
import {
  Get_Single_UserEvent_Fun,
  Get_UserEvent_Fun,
  reset_MainEventSlice,
} from "../../../Redux/UserSide/MainEventSlice";

const EventDetals = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);

  const { itemdata } = useRoute().params;

  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { singleEvent_Data, singleEvent_isLoading } = useSelector(
    (state) => state?.MainEventSlice
  );

  console.log({
    ooo: singleEvent_Data,
  });

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  console.log({
    sss: user_data?.token,
  });

  useEffect(() => {
    dispatch(Get_Single_UserEvent_Fun(itemdata?._id));

    return () => {
      // dispatch(reset_MainEventSlice());
    };
  }, [dispatch, itemdata?._id]); // Added dependency array

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***

  /**
   * Mutation function to cancel an event.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const cancelEventRequest = async () => {
    const config = {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };

    // Use singleEvent_Data?.events?._id for the URL
    let url = `${API_BASEURL}resident-event/${singleEvent_Data?.events?._id}`;

    // Note: The original code used data_info as a parameter for useMutation,
    // but the delete call doesn't use it. We adjust the mutationFn signature.
    return axios.delete(url, config);
  };

  const Cancle_Guests_Mutation = useMutation({
    mutationFn: cancelEventRequest,
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: "Event cancelled successfully",
      });

      // Dispatch action to refresh the user's event list
      dispatch(Get_UserEvent_Fun());

      navigation.goBack();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.message || "Failed to cancel event.";

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  const [qrCodeValue, setQRCodeValue] = useState("");
  const viewShotRef = useRef();
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

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    // Set the refreshing state to true
    setRefreshing(true);

    // Fetch the updated data
    await dispatch(Get_Single_UserEvent_Fun(itemdata?._id));

    // After fetching the data, set the refreshing state back to false
    setRefreshing(false);
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1, // Use flexGrow 1 inside ScrollView
        // justifyContent: "center",
        // alignItems: "center",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {singleEvent_isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            animating={singleEvent_isLoading} // Use singleEvent_isLoading here
            size="large"
            color="green"
          />
        </View>
      )}

      {/* Only show content if data is loaded and available */}
      {!singleEvent_isLoading && singleEvent_Data?.events && (
        <View style={styles.container}>
          <Text style={styles.title}>Invitation Details</Text>
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
                    marginTop: 20, // Added spacing
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "red",
                      borderRadius: 10,
                      width: "48%", // Adjusted width for spacing
                      paddingVertical: 10,
                      justifyContent: "center", // Centered text vertically
                    }}
                    onPress={() => {
                      // *** CHANGE: Call mutate without arguments ***
                      Cancle_Guests_Mutation.mutate();
                    }}
                    disabled={Cancle_Guests_Mutation.isLoading}
                  >
                    {Cancle_Guests_Mutation.isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.cancelButtonText}>Cancel Event</Text>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "green",
                      borderRadius: 10,
                      width: "48%", // Adjusted width for spacing
                      paddingVertical: 10,
                      justifyContent: "center", // Centered text vertically
                    }}
                    onPress={() => {
                      setModalVisible(true);
                      // Ensure the data exists before stringifying
                      if (singleEvent_Data?.events) {
                        const jsonString = JSON.stringify(
                          singleEvent_Data.events
                        );
                        setQRCodeValue(jsonString);
                      }
                    }}
                  >
                    <Text style={styles.qrButtonText}>Qrcode</Text>
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
      )}

      {/* Edit button positioned relative to the container */}
      {!singleEvent_Data?.events?.isAdmin && (
        <View style={styles.editButtonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => {
              navigation.navigate("inviteguest", { itemdata });
            }}
          >
            <MaterialIcons name="mode-edit" size={24} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <CenterReuseModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            style={{ alignSelf: "flex-end" }}
          >
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Qrcode</Text>

          {qrCodeValue !== "" && (
            <View style={styles.qrCodeWrapper}>
              {/* ViewShot component is needed for sharing functionality */}
              <ViewShot
                ref={viewShotRef}
                options={{ format: "png", quality: 0.9 }}
              >
                <QRCode
                  value={qrCodeValue}
                  size={200}
                  color="black"
                  backgroundColor="white"
                />
              </ViewShot>
            </View>
          )}

          <Text style={styles.qrShareText}>Screen Shot and send to Guest</Text>

          {/* Uncomment the share button if you want to enable the sharing feature */}
          {/* <TouchableOpacity
            onPress={captureAndShare}
            style={styles.shareButton}
          >
            <Text style={styles.shareButtonText}>
              Share QR Code
            </Text>
          </TouchableOpacity> */}
        </View>
      </CenterReuseModals>
    </ScrollView>
  );
};

export default EventDetals;

const styles = StyleSheet.create({
  loadingOverlay: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
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
    backgroundColor: "#fff", // Added background color for better visibility
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
    color: "#333",
  },
  text: {
    fontSize: 16,
    marginBottom: 15,
    color: "#666",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  qrButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  editButtonContainer: {
    // This positioning logic is tricky in ScrollView.
    // Assuming the scrollable content takes up the full screen height
    // you might need to adjust 'top' based on the content height.
    // For now, I'll keep the original relative positioning approach.
    position: "absolute",
    right: 20,
    top: 320,
    zIndex: 1,
  },
  editButton: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%",
    // height: "50%", // Removed fixed height for flexible content
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  qrCodeWrapper: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qrShareText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
  },
  shareButton: {
    marginTop: 20,
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  shareButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
});
