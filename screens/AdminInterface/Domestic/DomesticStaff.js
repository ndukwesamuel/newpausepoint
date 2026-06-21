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

// --- IMPORTANT: Change this import from 'react-query' to '@tanstack/react-query' ---
// Since useMutation is not used, we can safely remove the import if we are not planning to use it.
// However, if we were using it, this would be the correct import:
// import { useMutation } from '@tanstack/react-query';
// Since no mutation is used, I will remove the unused import to clean up the code.
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL; // Not used

import axios from "axios"; // Not used directly
import Toast from "react-native-toast-message"; // Not used directly
import * as ImagePicker from "expo-image-picker"; // Not used directly
import { MaterialIcons } from "@expo/vector-icons"; // Not used directly
import { Ionicons, AntDesign } from "@expo/vector-icons"; // Not used directly

import DateTimePicker from "@react-native-community/datetimepicker"; // Not used directly

import { useDispatch, useSelector } from "react-redux";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import {
  Get_All_Domestic_Fun,
  Get_All_User_Guest_Fun,
} from "../../../Redux/UserSide/GuestSlice"; // Not used directly
import {
  formatDate,
  formatDateString,
  formatDateandTime,
} from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan"; // Not used directly
import { Admin_Get_All_DomesticStaff_Fun } from "../../../Redux/Admin/AdminGuestSlice";

const DomesticStaff = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Destructuring Redux state (some props are unused but kept for context)
  const { get_all_user_guest_data, get_all_domestic_data } = useSelector(
    (state) => state?.GuestSlice
  );

  const { Admin_get_all_domestic_staff_data } = useSelector(
    (state) => state?.AdminGuestSlice
  );
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  // Data Fetching logic (currently using Redux)
  useEffect(() => {
    // This is where you would ideally use useQuery from TanStack Query for fetching
    dispatch(Admin_Get_All_DomesticStaff_Fun());
    dispatch(UserProfile_data_Fun());

    return () => {};
  }, [dispatch]); // Added dispatch to dependency array for best practice

  const filteredData = Admin_get_all_domestic_staff_data?.data?.filter((item) =>
    item.staffCode?.toLowerCase().includes(searchQuery?.toLowerCase())
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    // Set the refreshing state to true
    setRefreshing(true);

    // In a full TanStack Query setup, you would use queryClient.refetchQueries('domesticStaffs')
    // For now, we stick to the Redux dispatch logic:
    await dispatch(Admin_Get_All_DomesticStaff_Fun());
    await dispatch(UserProfile_data_Fun());

    // Set the refreshing state to false once fetching is done
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
    // <AppScreen> // commented out in original, kept the same
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

      {/* Conditional rendering for empty/filtered data */}
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
                  // Fallback Lottie animation if list is empty (should be caught by the main conditional above)
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
