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
  RefreshControl,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { useDispatch, useSelector } from "react-redux";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  Get_All_Domestic_Fun,
  Get_All_User_Guest_Fun,
} from "../../../Redux/UserSide/GuestSlice";
import {
  formatDate,
  formatDateString,
  formatDateandTime,
} from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";
import { Admin_Get_All_DomesticStaff_Fun } from "../../../Redux/Admin/AdminGuestSlice";

const DomesticStaff = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { get_all_user_guest_data, get_all_domestic_data } = useSelector(
    (state) => state?.GuestSlice
  );

  const { Admin_get_all_user_guest_data, Admin_get_all_domestic_staff_data } =
    useSelector((state) => state?.AdminGuestSlice);
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    dispatch(Admin_Get_All_DomesticStaff_Fun());

    dispatch(UserProfile_data_Fun());

    return () => {};
  }, [dispatch]);
  const filteredData = Admin_get_all_domestic_staff_data?.data?.filter((item) =>
    item.staffCode?.toLowerCase().includes(searchQuery?.toLowerCase())
  );
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Admin_Get_All_DomesticStaff_Fun());

    dispatch(UserProfile_data_Fun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        navigation.navigate("AdmindomesticDetail", { itemdata: item });
      }}
    >
      <Text style={styles.staffName}>{item.staffName}</Text>
      <Text style={styles.staffDetails}>
        Role: {item.Role} | Gender: {item.gender}
      </Text>

      <Text style={styles.staffDetails}>
        Phone: {item.phone} | Working Hours: {item.workingHours}
      </Text>
      <Text style={styles.staffDetails}>
        DOB: {formatDate(item.dateOfBirth)}
      </Text>
      <Text>Staff Code: {item.staffCode}</Text>
    </TouchableOpacity>
  );

  return (
    // <AppScreen>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 20,
        paddingTop: 25,
      }}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Search by staff code"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredData?.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LottieView
            autoPlay
            ref={animation}
            style={{
              width: 200,
              height: 200,
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
          />
        </View>
      ) : (
        <>
          <FlatList
            data={filteredData}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={() => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                />
              </View>
            )}
          />
        </>
      )}
    </View>
    // </AppScreen>
  );
};

export default DomesticStaff;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  staffName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  staffDetails: {
    fontSize: 14,
    marginBottom: 4,
  },
  emptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#777",
  },
});
