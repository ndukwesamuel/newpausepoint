import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  FormLabel,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
import axios from "axios";
import Toast from "react-native-toast-message";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";

const EditPersonalInformation = () => {
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const canEditProfile =
    userProfile_data?.currentClanMeeting?.settings?.allowMembersToEditProfile;

  const [name, setName] = useState(userProfile_data?.user?.name);
  const [gender, setGender] = useState("Male");
  const [profileImage, setProfileImage] = useState(userProfile_data?.photo);

  // Address fields
  const [street, setStreet] = useState(userProfile_data?.address?.street);
  const [city, setCity] = useState(userProfile_data?.address?.city);
  const [state, setState] = useState(userProfile_data?.address?.state);
  const [flatNumber, setFlatNumber] = useState(
    userProfile_data?.address?.flatNumber
  );
  const [typeOfApartment, setTypeOfApartment] = useState(
    userProfile_data?.address?.typeOfApartment
  );
  const [selfcon, setSelfcon] = useState(userProfile_data?.address?.selfcon);
  const [unitNumber, setUnitNumber] = useState(
    userProfile_data?.address?.unitNumber
  );

  const [phone, setPhone] = useState(userProfile_data?.phoneNumber);
  const dispatch = useDispatch();

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  // Dropdown states
  const [showStreetDropdown, setShowStreetDropdown] = useState(false);
  const [showApartmentDropdown, setShowApartmentDropdown] = useState(false);

  // Get available apartment types and streets from userProfile_data
  const availableApartmentTypes =
    userProfile_data?.currentClanMeeting?.availableApartmentTypes || [];
  const availableStreets =
    userProfile_data?.currentClanMeeting?.availableStreets || [];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, [dispatch]);

  const handleSave = () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("phoneNumber", phone);

    // Only include address fields if allowed to edit profile
    if (canEditProfile) {
      formData.append("street", street);
      formData.append("typeOfApartment", typeOfApartment);
      formData.append("unitNumber", unitNumber);
      formData.append("flatNumber", flatNumber);
    }

    if (profileImage) {
      const uri = profileImage;
      const type = "image/jpeg";
      const name = "photo.jpg";
      formData.append("photo", { uri, type, name });
    }

    Update_Mutation.mutate(formData);
  };

  const Update_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}profile/update`;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.put(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "User Profile Updated successfully!",
        });
        dispatch(UserProfile_data_Fun());
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
        });
      },
    }
  );

  // Custom Dropdown Component
  const CustomDropdown = ({
    visible,
    onClose,
    options,
    onSelect,
    selectedValue,
  }) => {
    return (
      <Modal
        transparent={true}
        visible={visible}
        onRequestClose={onClose}
        animationType="fade"
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={styles.dropdownContainer}>
            <ScrollView>
              {options.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dropdownItem,
                    selectedValue === item && styles.selectedItem,
                  ]}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={{ paddingBottom: 30 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
          onPress={pickImage}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{ uri: profileImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <Text>{userProfile_data?.user?.email}</Text>
        </TouchableOpacity>

        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <View>
            <FormLabel data="Name" />
            <Forminput
              placeholder="Your Name"
              onChangeText={setName}
              value={name}
            />
          </View>

          <View>
            <FormLabel data="Phone Number" />
            <Forminput
              placeholder="Phone Number"
              onChangeText={setPhone}
              value={phone}
            />
          </View>

          <View>
            <FormLabel data="Gender" />
            <Forminput
              placeholder="Your gender"
              onChangeText={setGender}
              value={gender}
            />
          </View>

          {/* Only show address fields if canEditProfile is true */}
          {canEditProfile && (
            <>
              <View>
                <FormLabel data="Street Name" />
                <TouchableOpacity
                  onPress={() => setShowStreetDropdown(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownTriggerText}>
                    {street || "Select Street"}
                  </Text>
                </TouchableOpacity>
                <CustomDropdown
                  visible={showStreetDropdown}
                  onClose={() => setShowStreetDropdown(false)}
                  options={availableStreets}
                  onSelect={(item) => setStreet(item)}
                  selectedValue={street}
                />
              </View>

              <View>
                <FormLabel data="House Number" />
                <Forminput
                  placeholder="House Number"
                  onChangeText={setFlatNumber}
                  value={flatNumber}
                />
              </View>

              <View>
                <FormLabel data="Type of Apartment" />
                <TouchableOpacity
                  onPress={() => setShowApartmentDropdown(true)}
                  style={styles.dropdownTrigger}
                >
                  <Text style={styles.dropdownTriggerText}>
                    {typeOfApartment || "Select Apartment Type"}
                  </Text>
                </TouchableOpacity>
                <CustomDropdown
                  visible={showApartmentDropdown}
                  onClose={() => setShowApartmentDropdown(false)}
                  options={availableApartmentTypes}
                  onSelect={(item) => setTypeOfApartment(item)}
                  selectedValue={typeOfApartment}
                />
              </View>

              <View>
                <FormLabel data="Unit Number" />
                <Forminput
                  placeholder="Unit Number"
                  onChangeText={setUnitNumber}
                  value={unitNumber}
                />
              </View>
            </>
          )}

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Submit"
            onPress={handleSave}
            isLoading={Update_Mutation.isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownTrigger: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  dropdownTriggerText: {
    fontSize: 16,
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownContainer: {
    backgroundColor: "white",
    width: "80%",
    maxHeight: "50%",
    borderRadius: 10,
    padding: 10,
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
  },
  selectedItem: {
    backgroundColor: "#f0f0f0",
  },
});

export default EditPersonalInformation;
