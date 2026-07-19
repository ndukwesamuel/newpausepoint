import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
  RefreshControl,
  Alert,
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
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Formbutton,
  Forminput_Icon,
} from "../../../components/shared/InputForm";
import { userFile } from "../../../utils/fakedata";
import { useNavigation, useRoute } from "@react-navigation/native";
import { HalfScreenModal } from "../../../components/shared/ReuseableModal";
import { useDispatch, useSelector } from "react-redux";
import {
  Admin_Get_ALl_Emergency_Report_Fun,
  Admin_Get_Single_Emergency_Report_Fun,
} from "../../../Redux/Admin/EmergencySlice";
import { formatDateandTime } from "../../../utils/DateTime";
import { useMutation } from "@tanstack/react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

export default function EmergencyDetails({}) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const navigation = useNavigation();

  const { Admin_Get_Single_Emergency_Report } = useSelector(
    (state) => state.EmergencySlice
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const route = useRoute();
  const { data: item } = route.params;

  useEffect(() => {
    dispatch(Admin_Get_Single_Emergency_Report_Fun(item));
    return () => {};
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userType, setUserType] = useState("All");

  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const filteredUsers = userFile.filter((user) => {
    if (userType.toUpperCase() === "ALL") {
      return true;
    } else {
      return user.status === userType;
    }
  });

  const [formData, setFormData] = useState({
    search: "",
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  function capitalizeFirstLetter(str) {
    return str?.charAt(0).toUpperCase() + str?.slice(1);
  }

  const Stattus_fuc = () => {
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";
    if (item?.status === "Banned") {
      statusColor = "#F34357";
      statusBackColor = "#FDF2F3";
    } else if (item?.status === "Pending") {
      statusColor = "#F27F2D";
      statusBackColor = "#FFF1E7";
    }

    return (
      <View
        style={{
          backgroundColor: statusBackColor,
          paddingHorizontal: 10,
          borderRadius: 5,
        }}
      >
        <Text style={{ color: statusColor, textAlign: "center" }}>
          {item?.status}
        </Text>
      </View>
    );
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(Admin_Get_Single_Emergency_Report_Fun(item));
    setRefreshing(false);
  };

  const makePhoneCall = () => {
    Linking.openURL(
      `tel:${Admin_Get_Single_Emergency_Report?.userProfile?.phoneNumber}`
    );
  };

  const Resolve_Mutation = useMutation({
    mutationFn: (id) => {
      let url = `${API_BASEURL}emargencyreport/resolve-emergency/${id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.get(url, config);
    },
    onSuccess: (success) => {
      Toast.show({
        type: "success",
        text1: " successfully ",
      });
      dispatch(Admin_Get_Single_Emergency_Report_Fun(item));
      dispatch(Admin_Get_ALl_Emergency_Report_Fun());
      navigation.goBack();
    },
    onError: (error) => {
      console.log({
        error: error?.response,
      });
      Toast.show({
        type: "error",
        text1: `${error?.response?.data?.message} `,
      });
    },
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 7,
            borderColor: "#2632381F",
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginTop: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              borderBottomColor: "#CFCDCD",
              borderBottomWidth: 1,
              paddingBottom: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={require("../../../assets/images/fire.png")}
              style={{ width: 38, height: 40 }}
            />

            <SemiBoldFontText
              data={`${item.type} Emergency`}
              textstyle={{ fontSize: 18 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <RegularFontText
              data="Reported by:"
              textstyle={{ fontSize: 14, color: "#696969", width: "30%" }}
            />
            <MediumFontText
              data={capitalizeFirstLetter(
                Admin_Get_Single_Emergency_Report?.report?.member?.name
              )}
              textstyle={{ fontSize: 14 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <RegularFontText
              data="Date and Time:"
              textstyle={{ fontSize: 14, color: "#696969", width: "30%" }}
            />
            <MediumFontText
              data={formatDateandTime(
                Admin_Get_Single_Emergency_Report?.report?.createdAt
              )}
              textstyle={{ fontSize: 14 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <RegularFontText
              data="Additional Information:"
              textstyle={{ fontSize: 14, color: "#696969", width: "30%" }}
            />
            <MediumFontText
              data={Admin_Get_Single_Emergency_Report?.report?.additionalInfo}
              textstyle={{ fontSize: 14 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <RegularFontText
              data="House Address:"
              textstyle={{ fontSize: 14, color: "#696969", width: "30%" }}
            />
            <MediumFontText
              data={Admin_Get_Single_Emergency_Report?.report?.address}
              textstyle={{ fontSize: 14 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          >
            <RegularFontText
              data="Status:"
              textstyle={{ fontSize: 14, color: "#696969", width: "30%" }}
            />
            <MediumFontText
              data={Admin_Get_Single_Emergency_Report?.report?.status}
              textstyle={{ fontSize: 14 }}
            />
          </View>

          <View
            style={{
              marginBottom: 5,
              paddingBottom: 10,
              flexDirection: "row",
              gap: 20,
            }}
          ></View>
        </View>

        <Formbutton
          buttonStyle={{
            backgroundColor: "#04973C",
            paddingVertical: 14,
            alignItems: "center",
            borderRadius: 5,
            borderWidth: 1,
            marginTop: 10,
          }}
          textStyle={{
            color: "white",
            fontWeight: "500",
            fontSize: 14,
            fontFamily: "RobotoSlab-Medium",
          }}
          data="Make a call "
          onPress={makePhoneCall}
        />

        {Admin_Get_Single_Emergency_Report?.report?.status === "pending" && (
          <Formbutton
            isLoading={Resolve_Mutation.isPending}
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              borderWidth: 1,
              marginTop: 10,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Resolve"
            onPress={() => {
              Resolve_Mutation.mutate(
                Admin_Get_Single_Emergency_Report?.report?._id
              );
            }}
          />
        )}

        <Modal
          transparent={true}
          animationType="slide"
          visible={isModalVisible}
        >
          <TouchableWithoutFeedback onPress={toggleModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View
                  style={{
                    marginBottom: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomColor: "#CFCDCD",
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                  }}
                >
                  <MediumFontText
                    data={
                      item?.status === "Active" ? "Ban User " : "Reinstate User"
                    }
                    textstyle={{
                      fontSize: 18,
                      textAlign: "center",
                      width: "100%",
                    }}
                  />
                </View>

                <RegularFontText
                  data={
                    item?.status === "Active"
                      ? "BBanning this user will suspend their account indefinitely, preventing further access to the system."
                      : "Reinstating this user will reactivate their account, allowing them to access the system"
                  }
                  textstyle={{
                    fontSize: 14,
                    fontWeight: "400",
                    textAlign: "center",
                  }}
                />
                {item?.status === "Active" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#FDF2F3",
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        borderRadius: 6,
                      }}
                      onPress={toggleModal}
                    >
                      <RegularFontText
                        data="Ban User"
                        textstyle={{
                          fontSize: 14,
                          fontWeight: "400",
                          textAlign: "center",
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#04973C",
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        borderRadius: 6,
                      }}
                    >
                      <RegularFontText
                        data="Cancel"
                        textstyle={{
                          fontSize: 14,
                          fontWeight: "400",
                          textAlign: "center",
                          color: "white",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        backgroundColor: "white",
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: "#04973C",
                      }}
                      onPress={toggleModal}
                    >
                      <RegularFontText
                        data="Cancel"
                        textstyle={{
                          fontSize: 14,
                          fontWeight: "400",
                          textAlign: "center",
                          color: "#04973C",
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        backgroundColor: "#04973C",
                        paddingHorizontal: 12,
                        paddingVertical: 12,
                        borderRadius: 6,
                      }}
                    >
                      <RegularFontText
                        data="Reinstate"
                        textstyle={{
                          fontSize: 14,
                          fontWeight: "400",
                          textAlign: "center",
                          color: "white",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: "30%",
  },
});
