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
  RefreshControl,
  ScrollView,
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
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  Formbutton,
  Forminput_Icon,
} from "../../../components/shared/InputForm";
import { userFile } from "../../../utils/fakedata";
import { useRoute } from "@react-navigation/native";
import { HalfScreenModal } from "../../../components/shared/ReuseableModal";
import { Admin_Get_ALl_Emergency_Report_Fun } from "../../../Redux/Admin/EmergencySlice";
import { formatDateandTime } from "../../../utils/DateTime";

export default function Emergencies({ navigation }) {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { Admin_Get_ALl_Emergency_Report } = useSelector(
    (state) => state.EmergencySlice
  );

  const { user_data } = useSelector((state) => state.AuthSlice);

  const [activeButton, setActiveButton] = useState("pending"); // Initialize with 'Social' as the active button

  const pendingReports = Admin_Get_ALl_Emergency_Report?.reports?.filter(
    (report) => report.status === "pending"
  );

  const resolvedReports = Admin_Get_ALl_Emergency_Report?.reports.filter(
    (report) => report.status === "resolved"
  );

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const route = useRoute();
  // const { item } = route.params as { item: any };
  const [refreshing, setRefreshing] = useState(false);

  let item = {};

  useEffect(() => {
    dispatch(Admin_Get_ALl_Emergency_Report_Fun());
    return () => {};
  }, [dispatch]);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Admin_Get_ALl_Emergency_Report_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeFormModal = () => {
    setModalFormVisible(false);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const [userType, setUserType] = useState("All");

  const usertypelist = ["All", "Active", "Banned", "Pending"];

  const filteredUsers = userFile.filter((user) => {
    // if (userType === "ALL") {

    if (userType.toUpperCase() === "ALL") {
      return true; // Show all users
    } else {
      return user.status === userType; // Show users with selected status
    }
  });

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const Stattus_fuc = () => {
    let statusColor = "#3DCF3A";
    let statusBackColor = "#F3FFF3";
    if (item?.status === "Banned") {
      statusColor = "#F34357"; // Red color for 'Banned' status
      statusBackColor = "#FDF2F3";
    } else if (item?.status === "Pending") {
      statusColor = "#F27F2D"; // Yellow color for 'Pending' status
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

  const RenderItem = ({ item }) => {
    return (
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
        onPress={() => navigation.navigate("EmergencyDetails", { data: item })}
      >
        <View
          style={{
            borderRadius: 6,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* import fireImage from "../../assets/images/fire.png"; */}
          <Image
            source={require("../../../assets/images/fire.png")}
            style={{ width: 38, height: 40 }}
          />
        </View>

        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-between",
            flex: 1,
            alignItems: "center",
          }}
        >
          <View style={{}}>
            <MediumFontText
              data={`${item.type} Emergency`}
              textstyle={{ fontSize: 16 }}
            />
            <RegularFontText
              data={`Location  ${item.address}`}
              textstyle={{ fontSize: 11, color: "#696969" }}
            />
            <RegularFontText
              //   data={`2 Days Ago   |   7:56 PM`}
              data={formatDateandTime(item.createdAt)}
              textstyle={{ fontSize: 11, color: "#696969" }}
            />
          </View>

          <View style={{}}>
            <MaterialIcons
              name="keyboard-arrow-right"
              size={24}
              color="black"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ alignItems: "center" }}>
        <View
          style={{
            //   marginVertical: 20,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
            borderWidth: 1,
            borderColor: "#CFCDCD",
            borderRadius: 6,
            padding: 10,
            width: "90%",
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor:
                activeButton === "pending" ? "green" : "transparent",
              padding: 10, // Adjust the padding as needed
              borderRadius: 5, // Add rounded corners if desired
            }}
            onPress={() => setActiveButton("pending")}
          >
            <MediumFontText
              data="Pending"
              textstyle={{
                fontSize: 16,
                fontWeight: "500",

                color: activeButton === "pending" ? "white" : "black",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor:
                activeButton === "resolved" ? "green" : "transparent",
              padding: 10, // Adjust the padding as needed
              borderRadius: 5, // Add rounded corners if desired
            }}
            onPress={() => setActiveButton("resolved")}
          >
            <MediumFontText
              data="Resolved"
              textstyle={{
                fontSize: 16,
                fontWeight: "500",

                color: activeButton === "resolved" ? "white" : "black",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {activeButton === "pending" && (
          <View style={{ flex: 1 }}>
            {pendingReports && pendingReports?.length > 0 ? (
              <View>
                <FlatList
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  data={pendingReports}
                  renderItem={({ item }) => <RenderItem item={item} />}
                />
              </View>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 20,
                  }}
                >
                  <Image
                    source={require("../../../assets/images/Pendingdata.png")}
                    style={{ width: 250, height: 100 }}
                  />

                  <MediumFontText
                    data="No Pending Emergencies "
                    textstyle={{ fontSize: 14, color: "#969696" }}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {activeButton === "resolved" && (
          <View style={{ flex: 1 }}>
            {resolvedReports && resolvedReports?.length > 0 ? (
              <View>
                <FlatList
                  data={resolvedReports}
                  renderItem={({ item }) => <RenderItem item={item} />}
                />
              </View>
            ) : (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginVertical: 20,
                  }}
                >
                  <Image
                    source={require("../../../assets/images/Pendingdata.png")}
                    style={{ width: 250, height: 100 }}
                  />

                  <MediumFontText
                    data="No resolved Emergencies"
                    textstyle={{ fontSize: 14, color: "#969696" }}
                  />
                </View>
              </ScrollView>
            )}
          </View>
        )}

        {/* <EmergencyModal visible={modalVisible} onClose={closeModal} setModalFormVisible={setModalFormVisible} /> */}

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
    </View>
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
