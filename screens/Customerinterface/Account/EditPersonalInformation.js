import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  FormLabel,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import { useDispatch, useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { formdatauseMutateData } from "../../../hooks/Request";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";

const EditPersonalInformation = ({ navigation }) => {
  const dispatch = useDispatch();

  const { get_user_profile_data: userProfile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  console.log({
    uuu: userProfile_data?.data,
  });

  const isGuest =
    !userProfile_data?.data?.currentClanMeeting &&
    !userProfile_data?.data?.AdmincurrentClanMeeting;
  const isClanMember = !!userProfile_data?.data?.currentClanMeeting;

  const userIdToFind = userProfile_data?.data?.user?._id;
  const foundMember = userProfile_data?.data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString(),
  );

  const canEditProfile =
    userProfile_data?.data?.currentClanMeeting?.settings
      ?.allowMembersToEditProfile;

  // ✅ Initialize form state
  const fullName = userProfile_data?.data?.user?.name || "";
  const nameParts = fullName.split(" ");
  const initialFirstName = nameParts[0] || "";
  const initialLastName = nameParts.slice(1).join(" ") || "";

  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);
  const [gender, setGender] = useState(userProfile_data?.user?.gender || "");
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [phone, setPhone] = useState(userProfile_data?.phoneNumber || "");

  // ✅ Address fields
  const [street, setStreet] = useState(
    isGuest
      ? userProfile_data?.address?.street || ""
      : foundMember?.street || "",
  );
  const [city, setCity] = useState(userProfile_data?.data?.address?.city || "");
  const [state, setState] = useState(
    userProfile_data?.data?.address?.state || "",
  );

  // ✅ Clan-specific fields
  const [showStreetDropdown, setShowStreetDropdown] = useState(false);
  const [showApartmentDropdown, setShowApartmentDropdown] = useState(false);
  const [houseNumber, sethouseNumber] = useState(
    foundMember?.houseNumber || "",
  );
  const [typeOfApartment, setTypeOfApartment] = useState(
    foundMember?.apartmentType || "",
  );
  const [unitNumber, setUnitNumber] = useState(foundMember?.unitNumber || "");

  const genderOptions = ["male", "female", "other", "prefer_not_to_say"];
  const availableApartmentTypes =
    userProfile_data?.data?.currentClanMeeting?.availableApartmentTypes || [];
  const availableStreets =
    userProfile_data?.data?.currentClanMeeting?.availableStreets || [];

  useEffect(() => {
    dispatch(Get_User_Profle_Fun());
  }, [dispatch]);

  // ✅ SINGLE UPDATE MUTATION
  const UpdateProfile = useMutateData_v2("api/v1/user", "POST", [
    "getUserUnified",
    "userProfile",
  ]);

  // ✅ Handle success
  useEffect(() => {
    if (UpdateProfile.isSuccess) {
      Toast.show({
        type: "success",
        text1: "Profile updated successfully!",
      });
      dispatch(Get_User_Profle_Fun());
      navigation.goBack();
    }
  }, [UpdateProfile.isSuccess]);

  // ✅ Handle error
  useEffect(() => {
    if (UpdateProfile.isError) {
      const errorMessage =
        UpdateProfile.error?.data?.message ||
        UpdateProfile.error?.data?.error ||
        "Failed to update profile";
      Toast.show({
        type: "error",
        text1: errorMessage,
      });
    }
  }, [UpdateProfile.isError]);

  // ✅ SINGLE SUBMIT HANDLER
  const handleSubmit = () => {
    const payload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    // Add optional fields
    if (gender) payload.gender = gender.toLowerCase();
    if (phone) payload.phoneNumber = phone;

    // Add address
    payload.address = {
      street: street || "",
      city: city || "",
      state: state || "",
    };

    console.log("Submitting payload:", payload);
    UpdateProfile.mutate(payload);
  };

  // ✅ Custom Dropdown Component
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
                  <Text style={styles.dropdownItemText}>
                    {item.charAt(0).toUpperCase() +
                      item.slice(1).replace(/_/g, " ")}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <ScreenWrapper
      title="Edit Profile"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* ✅ Profile Image Component */}
          {/* <ProfileImageUploaderComponent /> */}

          {/* add this later */}
          {/* ✅ Personal Information Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="account-circle"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Personal Information</Text>
            </View>

            {/* First Name */}
            <View style={styles.inputGroup}>
              <FormLabel data="First Name" />
              <Forminput
                placeholder="First Name"
                onChangeText={setFirstName}
                value={firstName}
              />
            </View>

            {/* Last Name */}
            <View style={styles.inputGroup}>
              <FormLabel data="Last Name" />
              <Forminput
                placeholder="Last Name"
                onChangeText={setLastName}
                value={lastName}
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputGroup}>
              <FormLabel data="Phone Number" />
              <Forminput
                placeholder="Phone Number"
                onChangeText={setPhone}
                value={phone}
                keyboardType="phone-pad"
              />
            </View>

            {/* Gender */}
            <View style={styles.inputGroup}>
              <FormLabel data="Gender" />
              <TouchableOpacity
                onPress={() => setShowGenderDropdown(true)}
                style={styles.dropdownTrigger}
              >
                <Text style={styles.dropdownTriggerText}>
                  {gender
                    ? gender.charAt(0).toUpperCase() +
                      gender.slice(1).replace(/_/g, " ")
                    : "Select Gender"}
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
              <CustomDropdown
                visible={showGenderDropdown}
                onClose={() => setShowGenderDropdown(false)}
                options={genderOptions}
                onSelect={(item) => setGender(item)}
                selectedValue={gender}
              />
            </View>
          </View>

          {/* ✅ Address Information Card */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="home-map-marker"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Address Information</Text>
            </View>

            {/* Street - Dropdown for clan members, text input for guests */}
            <View style={styles.inputGroup}>
              <FormLabel data="Street" />
              {isClanMember && canEditProfile && availableStreets.length > 0 ? (
                <>
                  <TouchableOpacity
                    onPress={() => setShowStreetDropdown(true)}
                    style={styles.dropdownTrigger}
                  >
                    <Text style={styles.dropdownTriggerText}>
                      {street || "Select Street"}
                    </Text>
                    <MaterialCommunityIcons
                      name="chevron-down"
                      size={20}
                      color="#6B7280"
                    />
                  </TouchableOpacity>
                  <CustomDropdown
                    visible={showStreetDropdown}
                    onClose={() => setShowStreetDropdown(false)}
                    options={availableStreets}
                    onSelect={(item) => setStreet(item)}
                    selectedValue={street}
                  />
                </>
              ) : (
                <Forminput
                  placeholder="Street Address"
                  onChangeText={setStreet}
                  value={street}
                />
              )}
            </View>

            {/* City */}
            <View style={styles.inputGroup}>
              <FormLabel data="City" />
              <Forminput
                placeholder="City"
                onChangeText={setCity}
                value={city}
              />
            </View>

            {/* State */}
            <View style={styles.inputGroup}>
              <FormLabel data="State" />
              <Forminput
                placeholder="State"
                onChangeText={setState}
                value={state}
              />
            </View>

            {/* ✅ Clan-specific fields - Only show if allowed */}
            {isClanMember && canEditProfile && (
              <>
                {/* House Number */}
                <View style={styles.inputGroup}>
                  <FormLabel data="House Number" />
                  <Forminput
                    placeholder="House Number"
                    onChangeText={sethouseNumber}
                    value={houseNumber}
                  />
                </View>

                {/* Type of Apartment */}
                {availableApartmentTypes.length > 0 && (
                  <View style={styles.inputGroup}>
                    <FormLabel data="Type of Apartment" />
                    <TouchableOpacity
                      onPress={() => setShowApartmentDropdown(true)}
                      style={styles.dropdownTrigger}
                    >
                      <Text style={styles.dropdownTriggerText}>
                        {typeOfApartment || "Select Apartment Type"}
                      </Text>
                      <MaterialCommunityIcons
                        name="chevron-down"
                        size={20}
                        color="#6B7280"
                      />
                    </TouchableOpacity>
                    <CustomDropdown
                      visible={showApartmentDropdown}
                      onClose={() => setShowApartmentDropdown(false)}
                      options={availableApartmentTypes}
                      onSelect={(item) => setTypeOfApartment(item)}
                      selectedValue={typeOfApartment}
                    />
                  </View>
                )}

                {/* Unit Number */}
                <View style={styles.inputGroup}>
                  <FormLabel data="Unit Number" />
                  <Forminput
                    placeholder="Unit Number"
                    onChangeText={setUnitNumber}
                    value={unitNumber}
                  />
                </View>
              </>
            )}
          </View>

          {/* ✅ Update Button */}
          <Formbutton
            buttonStyle={styles.primaryButton}
            textStyle={styles.primaryButtonText}
            data="Update Profile"
            onPress={handleSubmit}
            isLoading={UpdateProfile.isPending || UpdateProfile.isLoading}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

// ✅ Profile Image Uploader Component (UNCHANGED)
// function ProfileImageUploaderComponent() {
//   const dispatch = useDispatch();
//   // const { userProfile_data } = useSelector((state) => state.ProfileSlice);

//   const { get_user_profile_data: userProfile_data } = useSelector(
//     (state) => state.UserProfileSlice,
//   );

//   console.log({
//     uuu: userProfile_data,
//   });

//   const [profileImage, setProfileImage] = useState(
//     userProfile_data?.photo ||
//       "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg",
//   );
//   const [hasImageChanged, setHasImageChanged] = useState(false);

//   const UpdateImage_Mutation = formdatauseMutateData(
//     "api/v1/general/update-profile-image",
//     "PUT",
//     "userProfile",
//   );

//   const pickImage = async () => {
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       alert("Permission to access gallery is required!");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.7,
//     });

//     if (!result.canceled && result.assets?.length > 0) {
//       const localUri = result.assets[0].uri;
//       setProfileImage(localUri);
//       setHasImageChanged(true);
//     }
//   };

//   const handleImageUpdate = async () => {
//     if (!profileImage) return;

//     const uriParts = profileImage.split(".");
//     const fileExtension = uriParts[uriParts.length - 1];
//     const mimeType =
//       fileExtension === "jpg" || fileExtension === "jpeg"
//         ? "image/jpeg"
//         : `image/${fileExtension}`;

//     const formData = new FormData();
//     formData.append("image", {
//       uri: profileImage,
//       type: mimeType,
//       name: `profile_${Date.now()}.${fileExtension}`,
//     });

//     UpdateImage_Mutation.mutate(formData, {
//       onSuccess: () => {
//         Toast.show({
//           type: "success",
//           text1: "Profile image updated successfully!",
//         });
//         dispatch(UserProfile_data_Fun());
//         setHasImageChanged(false);
//       },
//       onError: (error) => {
//         const errorMessage =
//           error?.response?.data?.error || "Failed to update profile image";
//         Toast.show({
//           type: "error",
//           text1: errorMessage,
//         });
//       },
//     });
//   };

//   return (
//     <View style={profileImageStyles.container}>
//       <View style={profileImageStyles.imageCard}>
//         <TouchableOpacity
//           onPress={pickImage}
//           style={profileImageStyles.imageContainer}
//         >
//           <Image
//             source={{ uri: profileImage }}
//             style={profileImageStyles.profileImage}
//           />
//           <View style={profileImageStyles.editBadge}>
//             <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
//           </View>
//         </TouchableOpacity>

//         <Text style={profileImageStyles.emailText}>
//           {userProfile_data?.user?.email}
//         </Text>
//         <Text style={profileImageStyles.tapText}>Tap image to change</Text>
//       </View>

//       {hasImageChanged && (
//         <Formbutton
//           buttonStyle={profileImageStyles.updateButton}
//           textStyle={profileImageStyles.updateButtonText}
//           data="Update Profile Image"
//           onPress={handleImageUpdate}
//           isLoading={UpdateImage_Mutation.isLoading}
//         />
//       )}
//     </View>
//   );
// }

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.3,
  },
  dropdownTrigger: {
    backgroundColor: "#F9FAFB",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownTriggerText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  dropdownContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "50%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dropdownItemText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "500",
  },
  selectedItem: {
    backgroundColor: "#D1FAE5",
  },
});

const profileImageStyles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  imageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#10B981",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#10B981",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  emailText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  tapText: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  updateButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default EditPersonalInformation;
