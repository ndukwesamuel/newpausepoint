// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import {
//   FormLabel,
//   Formbutton,
//   Forminput,
// } from "../../../components/shared/InputForm";
// import { useDispatch, useSelector } from "react-redux";
// import { useMutation } from "@tanstack/react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
// import ScreenWrapper from "../../../components/shared/ScreenWrapper";
// import {
//   formdatauseMutateData,
//   useFetchData,
//   useMutateData,
// } from "../../../hooks/Request";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
// import { useNavigation } from "@react-navigation/native";

// const EditPersonalInformation = ({ navigation }) => {
//   const { userProfile_data } = useSelector((state) => state.ProfileSlice);

//   const userIdToFind = userProfile_data?.user?._id;
//   const foundMember = userProfile_data?.currentClanMeeting?.members.find(
//     (member) => member.user.toString() === userIdToFind.toString(),
//   );

//   const canEditProfile =
//     userProfile_data?.currentClanMeeting?.settings?.allowMembersToEditProfile;

//   // Split name into firstName and lastName on initial load
//   const fullName = userProfile_data?.user?.name || "";
//   const nameParts = fullName.split(" ");
//   const initialFirstName = nameParts[0] || "";
//   const initialLastName = nameParts.slice(1).join(" ") || "";

//   const [firstName, setFirstName] = useState(initialFirstName);
//   const [lastName, setLastName] = useState(initialLastName);
//   const [gender, setGender] = useState(
//     userProfile_data?.user?.gender || "Male",
//   );
//   const [showGenderDropdown, setShowGenderDropdown] = useState(false);

//   const genderOptions = ["Male", "Female"];
//   const [profileImage, setProfileImage] = useState(userProfile_data?.photo);
//   const [hasImageChanged, setHasImageChanged] = useState(false);

//   // Address fields
//   const [street, setStreet] = useState(foundMember?.street);
//   const [city, setCity] = useState(userProfile_data?.address?.city);
//   const [state, setState] = useState(userProfile_data?.address?.state);
//   const [houseNumber, sethouseNumber] = useState(foundMember?.houseNumber);
//   const [typeOfApartment, setTypeOfApartment] = useState(
//     foundMember?.apartmentType,
//   );
//   const [unitNumber, setUnitNumber] = useState(foundMember?.unitNumber);
//   const [phone, setPhone] = useState(userProfile_data?.phoneNumber);

//   const dispatch = useDispatch();

//   const {
//     user_data,
//     user_isError,
//     user_isSuccess,
//     user_isLoading,
//     user_message,
//   } = useSelector((state) => state.AuthSlice);

//   // Dropdown states
//   const [showStreetDropdown, setShowStreetDropdown] = useState(false);
//   const [showApartmentDropdown, setShowApartmentDropdown] = useState(false);

//   const availableApartmentTypes =
//     userProfile_data?.currentClanMeeting?.availableApartmentTypes || [];
//   const availableStreets =
//     userProfile_data?.currentClanMeeting?.availableStreets || [];

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setProfileImage(result.assets[0].uri);
//       setHasImageChanged(true);
//     }
//   };

//   useEffect(() => {
//     dispatch(UserProfile_data_Fun());
//     return () => {};
//   }, [dispatch]);

//   // Handle text data update (JSON)
//   const handleTextUpdate = () => {
//     // Combine firstName and lastName back into name
//     const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

//     const textData = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       name: fullName,
//       phoneNumber: phone,
//       gender,
//     };

//     // Only include address fields if allowed to edit profile
//     if (canEditProfile) {
//       textData.street = street;
//       textData.apartmentType = typeOfApartment;
//       textData.unitNumber = unitNumber;
//       textData.houseNumber = houseNumber;
//       textData.city = city;
//       textData.state = state;
//     }

//     console.log({
//       cc: textData,
//     });

//     UpdateText_Mutation.mutate(textData);
//   };

//   // Handle image upload (FormData)
//   const handleImageUpdate = () => {
//     if (!hasImageChanged || !profileImage) {
//       Toast.show({
//         type: "error",
//         text1: "Please select an image to upload",
//       });
//       return;
//     }

//     const formData = new FormData();
//     const uri = profileImage;
//     const uriParts = uri.split("/");
//     const fileName = uriParts[uriParts.length - 1];
//     const type = "image/" + fileName.split(".").pop();

//     formData.append("photo", { uri, type, name: fileName });

//     UpdateImage_Mutation.mutate(formData);
//   };

//   // --- TanStack Query: Text update mutation (JSON) ---
//   const UpdateText_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       let url = `${API_BASEURL}api/v1/user/update-profile`;
//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.patch(url, data_info, config);
//     },
//     onSuccess: () => {
//       Toast.show({
//         type: "success",
//         text1: "Profile information updated successfully!",
//       });
//       dispatch(UserProfile_data_Fun());
//       navigation.goBack();
//     },
//     onError: (error) => {
//       const errorMessage =
//         error?.response?.data?.error || "Failed to update profile information";
//       Toast.show({
//         type: "error",
//         text1: errorMessage,
//       });
//     },
//   });

//   // --- TanStack Query: Image update mutation (FormData) ---
//   const UpdateImage_Mutation = useMutation({
//     mutationFn: (data_info) => {
//       let url = `${API_BASEURL}profile/update-image`;

//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.put(url, data_info, config);
//     },
//     onSuccess: () => {
//       Toast.show({
//         type: "success",
//         text1: "Profile image updated successfully!",
//       });
//       setHasImageChanged(false);
//       dispatch(UserProfile_data_Fun());
//     },
//     onError: (error) => {
//       const errorMessage =
//         error?.response?.data?.error || "Failed to update profile image";
//       Toast.show({
//         type: "error",
//         text1: errorMessage,
//       });
//     },
//   });

//   // Custom Dropdown Component
//   const CustomDropdown = ({
//     visible,
//     onClose,
//     options,
//     onSelect,
//     selectedValue,
//   }) => {
//     return (
//       <Modal
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//         animationType="fade"
//       >
//         <TouchableOpacity
//           style={styles.dropdownOverlay}
//           activeOpacity={1}
//           onPress={onClose}
//         >
//           <View style={styles.dropdownContainer}>
//             <ScrollView>
//               {options.map((item, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   style={[
//                     styles.dropdownItem,
//                     selectedValue === item && styles.selectedItem,
//                   ]}
//                   onPress={() => {
//                     onSelect(item);
//                     onClose();
//                   }}
//                 >
//                   <Text style={styles.dropdownItemText}>{item}</Text>
//                 </TouchableOpacity>
//               ))}
//             </ScrollView>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   };

//   return (
//     <ScreenWrapper
//       title=""
//       navigation={navigation}
//       headerStyle={{
//         backgroundColor: "white",
//       }}
//     >
//       <ScrollView
//         style={styles.scrollView}
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         <View style={styles.container}>
//           {/* Profile Image Section - Modern Card */}
//           <ProfileImageUploaderComponent />

//           {userProfile_data?.user?.isGuest === true ? (
//             <GeneralEditPersonalInformation />
//           ) : (
//             <>
//               {/* Personal Information Card */}
//               <View style={styles.sectionCard}>
//                 {/* Section Header */}
//                 <View style={styles.sectionHeader}>
//                   <MaterialCommunityIcons
//                     name="account-circle"
//                     size={20}
//                     color="#10B981"
//                     style={{ marginRight: 8 }}
//                   />
//                   <Text style={styles.sectionTitle}>Personal Information</Text>
//                 </View>

//                 {/* First Name */}
//                 <View style={styles.inputGroup}>
//                   <FormLabel data="First Name" />
//                   <Forminput
//                     placeholder="First Name"
//                     onChangeText={setFirstName}
//                     value={firstName}
//                   />
//                 </View>

//                 {/* Last Name */}
//                 <View style={styles.inputGroup}>
//                   <FormLabel data="Last Name" />
//                   <Forminput
//                     placeholder="Last Name"
//                     onChangeText={setLastName}
//                     value={lastName}
//                   />
//                 </View>

//                 {/* Phone Number */}
//                 <View style={styles.inputGroup}>
//                   <FormLabel data="Phone Number" />
//                   <Forminput
//                     placeholder="Phone Number"
//                     onChangeText={setPhone}
//                     value={phone}
//                     keyboardType="phone-pad"
//                   />
//                 </View>

//                 {/* Gender */}
//                 <View style={styles.inputGroup}>
//                   <FormLabel data="Gender" />
//                   <TouchableOpacity
//                     onPress={() => setShowGenderDropdown(true)}
//                     style={styles.dropdownTrigger}
//                   >
//                     <Text style={styles.dropdownTriggerText}>
//                       {gender || "Select Gender"}
//                     </Text>
//                     <MaterialCommunityIcons
//                       name="chevron-down"
//                       size={20}
//                       color="#6B7280"
//                     />
//                   </TouchableOpacity>
//                   <CustomDropdown
//                     visible={showGenderDropdown}
//                     onClose={() => setShowGenderDropdown(false)}
//                     options={genderOptions}
//                     onSelect={(item) => setGender(item)}
//                     selectedValue={gender}
//                   />
//                 </View>
//               </View>

//               {/* Address Information Card - Only show if allowed */}
//               {canEditProfile && (
//                 <View style={styles.sectionCard}>
//                   {/* Section Header */}
//                   <View style={styles.sectionHeader}>
//                     <MaterialCommunityIcons
//                       name="home-map-marker"
//                       size={20}
//                       color="#10B981"
//                       style={{ marginRight: 8 }}
//                     />
//                     <Text style={styles.sectionTitle}>Address Information</Text>
//                   </View>

//                   {/* Street Name */}
//                   <View style={styles.inputGroup}>
//                     <FormLabel data="Street Name" />
//                     <TouchableOpacity
//                       onPress={() => setShowStreetDropdown(true)}
//                       style={styles.dropdownTrigger}
//                     >
//                       <Text style={styles.dropdownTriggerText}>
//                         {street || "Select Street"}
//                       </Text>
//                       <MaterialCommunityIcons
//                         name="chevron-down"
//                         size={20}
//                         color="#6B7280"
//                       />
//                     </TouchableOpacity>
//                     <CustomDropdown
//                       visible={showStreetDropdown}
//                       onClose={() => setShowStreetDropdown(false)}
//                       options={availableStreets}
//                       onSelect={(item) => setStreet(item)}
//                       selectedValue={street}
//                     />
//                   </View>

//                   {/* House Number */}
//                   <View style={styles.inputGroup}>
//                     <FormLabel data="House Number" />
//                     <Forminput
//                       placeholder="House Number"
//                       onChangeText={sethouseNumber}
//                       value={houseNumber}
//                     />
//                   </View>

//                   {/* Type of Apartment */}
//                   <View style={styles.inputGroup}>
//                     <FormLabel data="Type of Apartment" />
//                     <TouchableOpacity
//                       onPress={() => setShowApartmentDropdown(true)}
//                       style={styles.dropdownTrigger}
//                     >
//                       <Text style={styles.dropdownTriggerText}>
//                         {typeOfApartment || "Select Apartment Type"}
//                       </Text>
//                       <MaterialCommunityIcons
//                         name="chevron-down"
//                         size={20}
//                         color="#6B7280"
//                       />
//                     </TouchableOpacity>
//                     <CustomDropdown
//                       visible={showApartmentDropdown}
//                       onClose={() => setShowApartmentDropdown(false)}
//                       options={availableApartmentTypes}
//                       onSelect={(item) => setTypeOfApartment(item)}
//                       selectedValue={typeOfApartment}
//                     />
//                   </View>

//                   {/* Unit Number */}
//                   <View style={styles.inputGroup}>
//                     <FormLabel data="Unit Number" />
//                     <Forminput
//                       placeholder="Unit Number"
//                       onChangeText={setUnitNumber}
//                       value={unitNumber}
//                     />
//                   </View>
//                 </View>
//               )}

//               {/* Update Button */}
//               <Formbutton
//                 buttonStyle={styles.primaryButton}
//                 textStyle={styles.primaryButtonText}
//                 data="Update Information"
//                 onPress={handleTextUpdate}
//                 isLoading={UpdateText_Mutation.isLoading}
//               />
//             </>
//           )}
//         </View>
//       </ScrollView>
//     </ScreenWrapper>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingBottom: 30,
//   },
//   container: {
//     flex: 1,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//   },
//   // Section Card Styles
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },
//   // Input Group Styles
//   inputGroup: {
//     marginBottom: 16,
//   },
//   // Primary Button Styles
//   primaryButton: {
//     backgroundColor: "#10B981",
//     paddingHorizontal: 20,
//     paddingVertical: 14,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 10,
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//     fontSize: 14,
//     letterSpacing: 0.3,
//     fontFamily: "RobotoSlab-Medium",
//   },
//   // Dropdown Styles
//   dropdownTrigger: {
//     backgroundColor: "#F9FAFB",
//     padding: 15,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#E5E7EB",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   dropdownTriggerText: {
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   dropdownOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "flex-end",
//   },
//   dropdownContainer: {
//     backgroundColor: "white",
//     borderTopLeftRadius: 24,
//     borderTopRightRadius: 24,
//     padding: 24,
//     maxHeight: "50%",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   dropdownItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   dropdownItemText: {
//     fontSize: 14,
//     color: "#111827",
//     fontWeight: "500",
//   },
//   selectedItem: {
//     backgroundColor: "#D1FAE5",
//   },
// });

// // Guest User Edit Component
// function GeneralEditPersonalInformation() {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   // Split name into firstName and lastName
//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [street, setStreet] = useState("");
//   const [city, setCity] = useState("");
//   const [state, setState] = useState("");

//   const UpdateText_Mutation = useMutateData(
//     "api/v1/general/UserProfile",
//     "PATCH",
//     "userProfile",
//   );

//   const UpdateUserInfo = useMutateData_v2(
//     "api/v1/user/updatebankingInfo",
//     "POST",
//     "userProfile",
//   );

//   const {
//     data: getuserinfo,
//     isLoading: isloadinggetuserinfo,
//     error: iserrorgetuserinfo,
//   } = useFetchData("api/v1/general/UserProfile", "getuserinfo");

//   const {
//     data: userData,
//     isLoading: isLoadingUser,
//     error: userError,
//   } = useFetchData_v2("api/v1/user", "getUserUnified");

//   console.log({
//     one: getuserinfo,
//   });

//   console.log({
//     two: userData,
//   });

//   // Populate state once data is fetched
//   useEffect(() => {
//     if (getuserinfo?.user) {
//       const { name, phoneNumber, address } = getuserinfo.user;

//       // Split name into firstName and lastName
//       const fullName = name || "";
//       const nameParts = fullName.split(" ");
//       const extractedFirstName = nameParts[0] || "";
//       const extractedLastName = nameParts.slice(1).join(" ") || "";

//       setFirstName(extractedFirstName);
//       setLastName(extractedLastName);
//       setPhone(phoneNumber || "");
//       setStreet(address?.street || "");
//       setCity(address?.city || "");
//       setState(address?.state || "");
//     }
//   }, [getuserinfo]);

//   // Navigate back after success (old mutation - kept for backwards compatibility)
//   useEffect(() => {
//     if (UpdateText_Mutation.isSuccess) {
//       Toast.show({
//         type: "success",
//         text1: "Guest profile information updated successfully!",
//       });
//       dispatch(UserProfile_data_Fun());
//       navigation.goBack();
//     }
//   }, [UpdateText_Mutation.isSuccess, navigation, dispatch]);

//   // Handle UpdateUserInfo success
//   useEffect(() => {
//     if (UpdateUserInfo.isSuccess) {
//       Toast.show({
//         type: "success",
//         text1: "Profile information updated successfully!",
//       });
//       dispatch(UserProfile_data_Fun());
//       navigation.goBack();
//     }
//   }, [UpdateUserInfo.isSuccess, navigation, dispatch]);

//   // Handle UpdateUserInfo error
//   useEffect(() => {
//     if (UpdateUserInfo.isError) {
//       const errorMessage =
//         UpdateUserInfo.error?.data?.error ||
//         UpdateUserInfo.error?.data?.message ||
//         "Failed to update profile information";
//       Toast.show({
//         type: "error",
//         text1: errorMessage,
//       });
//     }
//   }, [UpdateUserInfo.isError, UpdateUserInfo.error]);

//   const handleTextUpdate = () => {
//     const payload = {
//       firstName: firstName.trim(),
//       lastName: lastName.trim(),
//       phoneNumber: phone,
//       street,
//       city,
//       state,
//     };

//     console.log("Submitting:", payload);
//     UpdateUserInfo.mutate(payload);
//   };

//   return (
//     <View style={styles.sectionCard}>
//       {/* Section Header */}
//       <View style={styles.sectionHeader}>
//         <MaterialCommunityIcons
//           name="account-circle"
//           size={20}
//           color="#10B981"
//           style={{ marginRight: 8 }}
//         />
//         <Text style={styles.sectionTitle}>Personal Information kaka</Text>
//       </View>

//       {/* First Name */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="First Name" />
//         <Forminput
//           placeholder="First Name"
//           onChangeText={setFirstName}
//           value={firstName}
//         />
//       </View>

//       {/* Last Name */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="Last Name" />
//         <Forminput
//           placeholder="Last Name"
//           onChangeText={setLastName}
//           value={lastName}
//         />
//       </View>

//       {/* Phone Number */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="Phone Number" />
//         <Forminput
//           placeholder="Phone Number"
//           onChangeText={setPhone}
//           value={phone}
//           keyboardType="phone-pad"
//         />
//       </View>

//       {/* Street */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="Street" />
//         <Forminput
//           placeholder="Street Address"
//           onChangeText={setStreet}
//           value={street}
//         />
//       </View>

//       {/* City */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="City" />
//         <Forminput placeholder="City" onChangeText={setCity} value={city} />
//       </View>

//       {/* State */}
//       <View style={styles.inputGroup}>
//         <FormLabel data="State" />
//         <Forminput placeholder="State" onChangeText={setState} value={state} />
//       </View>

//       {/* Submit Button */}
//       <Formbutton
//         buttonStyle={styles.primaryButton}
//         textStyle={styles.primaryButtonText}
//         data="Update Information"
//         onPress={handleTextUpdate}
//         isLoading={UpdateUserInfo.isPending || UpdateUserInfo.isLoading}
//       />
//     </View>
//   );
// }

// // Profile Image Uploader Component
// function ProfileImageUploaderComponent() {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const { userProfile_data } = useSelector((state) => state.ProfileSlice);

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
//       console.log("Selected Image URI:", localUri);
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
//       {/* Profile Image Card */}
//       <View style={profileImageStyles.imageCard}>
//         <TouchableOpacity
//           onPress={pickImage}
//           style={profileImageStyles.imageContainer}
//         >
//           <Image
//             source={{ uri: profileImage }}
//             style={profileImageStyles.profileImage}
//             onError={(e) =>
//               console.log("Image load error:", e.nativeEvent.error)
//             }
//           />
//           <View style={profileImageStyles.editBadge}>
//             <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
//           </View>
//         </TouchableOpacity>

//         <Text style={profileImageStyles.emailText}>
//           {userProfile_data?.user?.email}
//         </Text>
//         <Text style={profileImageStyles.tapText}>Tap image to change jaja</Text>
//       </View>

//       {/* Update Image Button - Only show if changed */}
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

// const profileImageStyles = StyleSheet.create({
//   container: {
//     marginBottom: 24,
//   },
//   imageCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 24,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   imageContainer: {
//     position: "relative",
//     marginBottom: 16,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 3,
//     borderColor: "#10B981",
//   },
//   editBadge: {
//     position: "absolute",
//     bottom: 0,
//     right: 0,
//     backgroundColor: "#10B981",
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     justifyContent: "center",
//     alignItems: "center",
//     borderWidth: 3,
//     borderColor: "#FFFFFF",
//   },
//   emailText: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   tapText: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   updateButton: {
//     backgroundColor: "#10B981",
//     paddingHorizontal: 20,
//     paddingVertical: 12,
//     borderRadius: 16,
//     alignItems: "center",
//     marginTop: 16,
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   updateButtonText: {
//     color: "#FFFFFF",
//     fontSize: 14,
//     fontWeight: "700",
//     letterSpacing: 0.3,
//   },
// });

// export default EditPersonalInformation;

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
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { formdatauseMutateData } from "../../../hooks/Request";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const EditPersonalInformation = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  // ✅ Determine user type
  const isGuest =
    !userProfile_data?.currentClanMeeting &&
    !userProfile_data?.AdmincurrentClanMeeting;
  const isClanMember = !!userProfile_data?.currentClanMeeting;

  const userIdToFind = userProfile_data?.user?._id;
  const foundMember = userProfile_data?.currentClanMeeting?.members.find(
    (member) => member.user.toString() === userIdToFind.toString(),
  );

  const canEditProfile =
    userProfile_data?.currentClanMeeting?.settings?.allowMembersToEditProfile;

  // ✅ Initialize form state
  const fullName = userProfile_data?.user?.name || "";
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
  const [city, setCity] = useState(userProfile_data?.address?.city || "");
  const [state, setState] = useState(userProfile_data?.address?.state || "");

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
    userProfile_data?.currentClanMeeting?.availableApartmentTypes || [];
  const availableStreets =
    userProfile_data?.currentClanMeeting?.availableStreets || [];

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
  }, [dispatch]);

  // ✅ SINGLE UPDATE MUTATION
  const UpdateProfile = useMutateData_v2("api/v1/user", "PATCH", [
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
      dispatch(UserProfile_data_Fun());
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
          <ProfileImageUploaderComponent />

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
function ProfileImageUploaderComponent() {
  const dispatch = useDispatch();
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const [profileImage, setProfileImage] = useState(
    userProfile_data?.photo ||
      "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg",
  );
  const [hasImageChanged, setHasImageChanged] = useState(false);

  const UpdateImage_Mutation = formdatauseMutateData(
    "api/v1/general/update-profile-image",
    "PUT",
    "userProfile",
  );

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const localUri = result.assets[0].uri;
      setProfileImage(localUri);
      setHasImageChanged(true);
    }
  };

  const handleImageUpdate = async () => {
    if (!profileImage) return;

    const uriParts = profileImage.split(".");
    const fileExtension = uriParts[uriParts.length - 1];
    const mimeType =
      fileExtension === "jpg" || fileExtension === "jpeg"
        ? "image/jpeg"
        : `image/${fileExtension}`;

    const formData = new FormData();
    formData.append("image", {
      uri: profileImage,
      type: mimeType,
      name: `profile_${Date.now()}.${fileExtension}`,
    });

    UpdateImage_Mutation.mutate(formData, {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Profile image updated successfully!",
        });
        dispatch(UserProfile_data_Fun());
        setHasImageChanged(false);
      },
      onError: (error) => {
        const errorMessage =
          error?.response?.data?.error || "Failed to update profile image";
        Toast.show({
          type: "error",
          text1: errorMessage,
        });
      },
    });
  };

  return (
    <View style={profileImageStyles.container}>
      <View style={profileImageStyles.imageCard}>
        <TouchableOpacity
          onPress={pickImage}
          style={profileImageStyles.imageContainer}
        >
          <Image
            source={{ uri: profileImage }}
            style={profileImageStyles.profileImage}
          />
          <View style={profileImageStyles.editBadge}>
            <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
          </View>
        </TouchableOpacity>

        <Text style={profileImageStyles.emailText}>
          {userProfile_data?.user?.email}
        </Text>
        <Text style={profileImageStyles.tapText}>Tap image to change</Text>
      </View>

      {hasImageChanged && (
        <Formbutton
          buttonStyle={profileImageStyles.updateButton}
          textStyle={profileImageStyles.updateButtonText}
          data="Update Profile Image"
          onPress={handleImageUpdate}
          isLoading={UpdateImage_Mutation.isLoading}
        />
      )}
    </View>
  );
}

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
