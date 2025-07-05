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

const EditPersonalInformation = ({ navigation }) => {
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const userIdToFind = userProfile_data?.user?._id; // The userId you're looking for
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString()
  );

  const canEditProfile =
    userProfile_data?.currentClanMeeting?.settings?.allowMembersToEditProfile;

  const [name, setName] = useState(userProfile_data?.user?.name);
  const [gender, setGender] = useState("Male");

  const [showGenderDropdown, setShowGenderDropdown] = useState(false);

  // Add this array with your other options arrays
  const genderOptions = ["Male", "Female"];
  const [profileImage, setProfileImage] = useState(userProfile_data?.photo);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Address fields
  const [street, setStreet] = useState(foundMember?.street);
  const [city, setCity] = useState(userProfile_data?.address?.city);
  const [state, setState] = useState(userProfile_data?.address?.state);
  const [houseNumber, sethouseNumber] = useState(foundMember?.houseNumber);
  const [typeOfApartment, setTypeOfApartment] = useState(
    foundMember?.apartmentType
  );

  console.log({
    vbvb: typeOfApartment,
  });

  const [selfcon, setSelfcon] = useState(userProfile_data?.address?.selfcon);
  const [unitNumber, setUnitNumber] = useState(foundMember?.unitNumber);

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
      setHasImageChanged(true);
    }
  };

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, [dispatch]);

  // Handle text data update (JSON)
  const handleTextUpdate = () => {
    const textData = {
      name,
      phoneNumber: phone,
      gender,
    };

    // Only include address fields if allowed to edit profile
    if (canEditProfile) {
      textData.street = street;
      textData.typeOfApartment = typeOfApartment;
      textData.unitNumber = unitNumber;
      textData.houseNumber = houseNumber;
      textData.city = city;
      textData.state = state;
      textData.selfcon = selfcon;
    }

    console.log({
      cc: textData,
    });

    UpdateText_Mutation.mutate(textData);
  };

  // Handle image upload (FormData)
  const handleImageUpdate = () => {
    if (!hasImageChanged || !profileImage) {
      Toast.show({
        type: "error",
        text1: "Please select an image to upload",
      });
      return;
    }

    const formData = new FormData();
    const uri = profileImage;
    const type = "image/jpeg";
    const name = "photo.jpg";
    formData.append("photo", { uri, type, name });

    UpdateImage_Mutation.mutate(formData);
  };

  // Text update mutation (JSON)
  const UpdateText_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}api/v1/user/update-profile`;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.patch(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Profile information updated successfully!",
        });
        dispatch(UserProfile_data_Fun());
        navigation.goBack(); // Navigate back after successful update
      },
      onError: (error) => {
        console.log({
          vvvbL: error?.response?.data,
        });

        Toast.show({
          type: "error",
          text1: `${
            error?.response?.data?.error ||
            "Failed to update profile information"
          }`,
        });
      },
    }
  );

  // Image update mutation (FormData)
  const UpdateImage_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}profile/update-image`;

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
          text1: "Profile image updated successfully!",
        });
        setHasImageChanged(false);
        dispatch(UserProfile_data_Fun());
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${
            error?.response?.data?.error || "Failed to update profile image"
          }`,
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
        {/* Profile Image Section */}
        <Text
          style={[
            styles.sectionTitle,
            {
              textAlign: "center",
            },
          ]}
        >
          Personal Information
        </Text>

        <View
          style={{
            alignItems: "center",
            paddingVertical: 20,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 20,
          }}
        >
          <TouchableOpacity
            onPress={pickImage}
            style={{ alignItems: "center", justifyContent: "center" }}
          >
            <Image
              source={{ uri: profileImage }}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
            <Text style={styles.changeImageText}>Tap to change image</Text>
            <Text>{userProfile_data?.user?.email}</Text>
          </TouchableOpacity>

          {/* Only show update button if image has changed */}
          <View>
            {hasImageChanged && (
              <Formbutton
                buttonStyle={[
                  styles.submitButton,
                  {
                    backgroundColor: "green",
                    marginTop: 15,
                    paddingHorizontal: 20,
                  },
                ]}
                textStyle={styles.submitButtonText}
                data="Update Image"
                onPress={handleImageUpdate}
                isLoading={UpdateImage_Mutation.isLoading}
              />
            )}
          </View>
        </View>
        {/* Text Information Section */}
        <View style={{ paddingHorizontal: 20, gap: 10, marginTop: 20 }}>
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
            <TouchableOpacity
              onPress={() => setShowGenderDropdown(true)}
              style={styles.dropdownTrigger}
            >
              <Text style={styles.dropdownTriggerText}>
                {gender || "Select Gender"}
              </Text>
            </TouchableOpacity>
            <CustomDropdown
              visible={showGenderDropdown}
              onClose={() => setShowGenderDropdown(false)}
              options={genderOptions}
              onSelect={(item) => setGender(item)}
              selectedValue={gender}
            />
          </View>

          {/* Only show address fields if canEditProfile is true */}
          {canEditProfile && (
            <>
              <Text style={styles.sectionTitle}>Address Information</Text>

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
                  onChangeText={sethouseNumber}
                  value={houseNumber}
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

          {/* Text Update Button */}
          <Formbutton
            buttonStyle={[styles.submitButton, { backgroundColor: "#04973C" }]}
            textStyle={styles.submitButtonText}
            data="Update Information"
            onPress={handleTextUpdate}
            isLoading={UpdateText_Mutation.isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  imageSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginHorizontal: 20,
  },
  changeImageText: {
    color: "#666",
    fontSize: 12,
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 14,
    fontFamily: "RobotoSlab-Medium",
  },
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
