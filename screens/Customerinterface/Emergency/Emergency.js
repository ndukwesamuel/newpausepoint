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

// *** CHANGE: Import useMutation from @tanstack/react-query ***
import { useMutation } from "@tanstack/react-query";
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

/**
 * @typedef {{ type: string, address: string, additionalInfo: string }} EmergencyReportData
 */

const Emergency = ({ navigation }) => {
  const dispatch = useDispatch();
  const [modalformVisible, setModalFormVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const { user_data } = useSelector((state) => state.AuthSlice);
  const closeFormModal = () => {
    setModalFormVisible(false);
    setSelectedItem(null);
    setHomeaddress(""); // Clear form fields
    setMoreinfo(""); // Clear form fields
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

  // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***

  /**
   * @param {EmergencyReportData} data_info - The report data.
   * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
   */
  const sendEmergencyReportRequest = async (data_info) => {
    let url = `${API_BASEURL}emargencyreport`;

    console.log({
      data_info,
      url,
    });

    const config = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${user_data?.token}`,
      },
    };
    return axios.post(url, data_info, config);
  };

  const Emergency_Mutation = useMutation({
    mutationFn: sendEmergencyReportRequest,
    onSuccess: (success) => {
      console.log({
        success,
      });
      Toast.show({
        type: "success",
        text1: "Emergency Report successfully sent",
      });

      closeFormModal();
    },

    onError: (error) => {
      /** @type {import('axios').AxiosError} */
      const axiosError = error;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "Failed to send emergency report.";

      console.log({
        error: axiosError?.response?.data,
      });

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    },
  });
  // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

  const RenderItem = ({ item }) => {
    // console.log({ // Commented out to reduce console noise
    //   hhh: item,
    // });
    const openFormModal = () => {
      setModalFormVisible(true); // Open modal
      setSelectedItem(item); // Set the selected item
    };

    return (
      <View>
        <TouchableOpacity style={styles.itemContainer} onPress={openFormModal}>
          <View style={styles.imageWrapper}>
            <Image source={item.image} style={styles.itemImage} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.itemName}>{item.name}</Text>

            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    // Set the refreshing state to true
    setRefreshing(true);
    // Fetch the updated data
    await dispatch(UserProfile_data_Fun());

    // Wait for 2 seconds (or just set false after data fetch)
    setRefreshing(false);
  };

  // Helper function to handle submission logic
  const handleSubmitReport = () => {
    if (!homeaddress.trim() || !moreinfo.trim()) {
      Toast.show({
        type: "error",
        text1: "Please fill out the Location and Additional Info.",
      });
      return;
    }
    Emergency_Mutation.mutate({
      type: selectedItem?.type,
      address: homeaddress,
      additionalInfo: moreinfo,
    });
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
      {get_user_profile_data?.currentClanMeeting ? ( // This check seems to be for clan membership
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
            <FlatList
              data={emergencydata}
              renderItem={({ item }) => <RenderItem item={item} />}
              keyExtractor={(item) => item.type}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <CenterReuseModals
            visible={modalformVisible}
            onClose={() => setModalFormVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContentWrapper}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalFormVisible(false)}
                >
                  <MaterialIcons name="cancel" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>
                  Make a Report About {selectedItem?.type || "an"} Emergency
                </Text>

                <View style={styles.formGroup}>
                  <MediumFontText
                    data="Location"
                    textstyle={styles.formLabel}
                  />

                  <Forminput
                    placeholder="Location Information (e.g., House No., Street)"
                    onChangeText={setHomeaddress}
                    value={homeaddress}
                  />

                  <MediumFontText
                    data="Additional Information"
                    textstyle={styles.formLabel}
                  />

                  <CustomTextArea
                    placeholder={`Describe the ${
                      selectedItem?.type || "emergency"
                    } here...`}
                    value={moreinfo}
                    onChangeText={setMoreinfo}
                    inputStyle={styles.textAreaInput}
                  />
                </View>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmitReport}
                  disabled={Emergency_Mutation.isLoading}
                >
                  {Emergency_Mutation.isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit Report</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </CenterReuseModals>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView
          contentContainerStyle={styles.noClanContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ClickToJoinCLan />
          <Text style={styles.noClanText}>
            Join a clan to access emergency services.
          </Text>
        </ScrollView>
      )}
    </ScreenWrapper>
  );
};

export default Emergency;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CFCDCD",
    borderRadius: 6,
    paddingHorizontal: 10,
    gap: 10,
    paddingVertical: 20,
    marginBottom: 20,
  },
  imageWrapper: {
    borderWidth: 1,
    borderColor: "#CFCDCD",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  itemImage: {
    width: 38,
    height: 40,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "RobotoSlab-Medium",
    marginBottom: 10,
  },
  itemDescription: {
    fontSize: 12,
    color: "#7f8c8d",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "90%", // Increased width for better text area view
    // height is handled by content
  },
  modalContentWrapper: {
    backgroundColor: "white",
    width: "100%",
    paddingTop: 10,
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 1,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  formGroup: {
    gap: 10,
  },
  formLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  textAreaInput: {
    textAlignVertical: "top",
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: "#F6F8FAE5",
    paddingHorizontal: 10,
    height: 100,
    borderRadius: 6,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#04973C",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 6,
    marginTop: 30,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    textAlign: "center",
  },
  noClanContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noClanText: {
    fontSize: 16,
    marginTop: 15,
    textAlign: "center",
  },
});
