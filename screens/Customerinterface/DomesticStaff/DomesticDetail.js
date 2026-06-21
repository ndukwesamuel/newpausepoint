// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import AppScreen from "../../../components/shared/AppScreen";
// import { formatDate } from "../../../utils/DateTime";

// // *** CHANGE: Import useMutation from @tanstack/react-query ***
// import { useMutation } from "@tanstack/react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// import { Get_All_Domestic_Fun } from "../../../Redux/UserSide/GuestSlice";
// import { Image } from "react-native";

// const DomesticDetail = ({ route }) => {
//   const {
//     _id,
//     staffName,
//     gender,
//     phone,
//     dateOfBirth,
//     homeAddress,
//     Role,
//     workingHours,
//     staffCode,
//     createdAt,
//     updatedAt,
//     photo,
//   } = route?.params?.itemdata;

//   // console.log({ // Commented out to reduce console noise
//   //   nnn: photo,
//   // });

//   // const { user_data } = useSelector((state) => state.AuthSlice);
//   const navigation = useNavigation();

//   const dispatch = useDispatch();

//   // *** TANSTACK QUERY MUTATION IMPLEMENTATION ***

//   /**
//    * @returns {Promise<import('axios').AxiosResponse>} The Axios response.
//    */
//   const deleteDomesticStaffRequest = async () => {
//     let url = `${API_BASEURL}domesticstaff/${_id}`;

//     // console.log({ // Commented out to reduce console noise
//     //   fff: url,
//     // });

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//         // Authorization: `Bearer ${user_data?.token}`,
//       },
//     };

//     return axios.delete(url, config);
//   };

//   const Delete_Mutation = useMutation({
//     mutationFn: deleteDomesticStaffRequest,
//     onSuccess: () => {
//       Toast.show({
//         type: "success",
//         text1: "Staff Deleted successfully",
//       });
//       // Refresh the staff list in the previous screen
//       dispatch(Get_All_Domestic_Fun());

//       navigation.goBack();
//     },

//     onError: (error) => {
//       /** @type {import('axios').AxiosError} */
//       const axiosError = error;
//       const errorMessage =
//         axiosError?.response?.data?.message || "Failed to delete staff.";

//       Toast.show({
//         type: "error",
//         text1: errorMessage,
//       });
//     },
//   });
//   // *** END TANSTACK QUERY MUTATION IMPLEMENTATION ***

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <View
//         style={{
//           alignItems: "center",
//           justifyContent: "center",
//           marginBottom: 30,
//         }}
//       >
//         <Image
//           source={{
//             uri:
//               photo ||
//               "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcSO9Xd_NJYU1FU2u886CDMp-pX-nffkmg_h0yhAKgLWCltFmAbQnt_nGdpEPgQZMZzw1k_pGxWjlD3U_Yk", // Fallback image
//           }}
//           style={styles.profileImage}
//         />
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Name:</Text>
//         <Text style={styles.value}>{staffName}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Gender:</Text>
//         <Text style={styles.value}>{gender === "1" ? "Male" : "Female"}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Phone:</Text>
//         <Text style={styles.value}>{phone}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Date of Birth:</Text>
//         <Text style={styles.value}>{formatDate(dateOfBirth)}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Home Address:</Text>
//         <Text style={styles.value}>{homeAddress}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Role:</Text>
//         <Text style={styles.value}>{Role}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Working Hours:</Text>
//         <Text style={styles.value}>{workingHours}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Staff Code:</Text>
//         <Text style={styles.value}>{staffCode}</Text>
//       </View>

//       <View style={styles.item}>
//         <Text style={styles.label}>Created At:</Text>
//         <Text style={styles.value}>{formatDate(createdAt)}</Text>
//       </View>

//       <View style={styles.actionContainer}>
//         {Delete_Mutation.isPending ? ( // Use isPending for TanStack Query v5
//           <ActivityIndicator size="small" color="red" />
//         ) : (
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() => Delete_Mutation.mutate()}
//           >
//             <Text style={styles.deleteButtonText}>Delete</Text>
//           </TouchableOpacity>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default DomesticDetail;

// const styles = StyleSheet.create({
//   container: {
//     paddingHorizontal: 20,
//     paddingVertical: 40,
//   },
//   profileImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: "#ccc",
//   },
//   item: {
//     marginBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     paddingBottom: 5,
//   },
//   label: {
//     fontSize: 14,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   value: {
//     fontSize: 16,
//     color: "#555",
//     marginTop: 2,
//   },
//   actionContainer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     gap: 10,
//     paddingTop: 30,
//   },
//   deleteButton: {
//     backgroundColor: "red",
//     width: "40%",
//     paddingVertical: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   deleteButtonText: {
//     textAlign: "center",
//     color: "white",
//     fontWeight: "bold",
//   },
// });


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../../../utils/DateTime";
import { useMutateData_v2 } from "../../../hooks/Requestv2";

const DomesticDetail = ({ route }) => {
  const {
    _id,
    staffName,
    gender,
    phone,
    dateOfBirth,
    homeAddress,
    Role,
    workingHours,
    staffCode,
    createdAt,
    photo,
  } = route?.params?.itemdata;

  const navigation = useNavigation();

  // ── Edit modal state ──────────────────────────────────────────
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    staffName:    staffName    || "",
    gender:       gender       || "",
    phone:        phone        || "",
    dateOfBirth:  dateOfBirth  || "",
    homeAddress:  homeAddress  || "",
    Role:         Role         || "",
    workingHours: workingHours || "",
  });

  // ── Delete mutation ───────────────────────────────────────────
  // DELETE /api/v1/domestic?staffId=xxx
  const deleteMutation = useMutateData_v2(
    `api/v1/domestic?staffId=${_id}`,
    "DELETE",
    "getAllDomesticStaff",
  );

  // ── Update mutation ───────────────────────────────────────────
  // PATCH /api/v1/domestic
  const updateMutation = useMutateData_v2(
    "api/v1/domestic",
    "PATCH",
    "getAllDomesticStaff",
  );

  // ── Handlers ──────────────────────────────────────────────────

  const handleDelete = () => {
    Alert.alert(
      "Delete Staff",
      `Are you sure you want to delete ${staffName}? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync({});
              Toast.show({ type: "success", text1: "Staff deleted successfully" });
              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: "error",
                text1: error?.message || "Failed to delete staff",
              });
            }
          },
        },
      ],
    );
  };

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        ...formData,
        staffId: _id,
      });
      Toast.show({ type: "success", text1: "Staff updated successfully" });
      setShowEditModal(false);
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error?.message || "Failed to update staff",
      });
    }
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Render ────────────────────────────────────────────────────

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Profile Photo */}
        <View style={styles.photoContainer}>
          <Image
            source={{
              uri: photo ||
                "https://static.vecteezy.com/system/resources/previews/002/318/271/original/user-profile-icon-free-vector.jpg",
            }}
            style={styles.profileImage}
          />
        </View>

        {/* Details */}
        <InfoRow label="Name"          value={staffName} />
        <InfoRow label="Gender"        value={gender === "1" ? "Male" : "Female"} />
        <InfoRow label="Phone"         value={phone} />
        <InfoRow label="Date of Birth" value={formatDate(dateOfBirth)} />
        <InfoRow label="Home Address"  value={homeAddress} />
        <InfoRow label="Role"          value={Role} />
        <InfoRow label="Working Hours" value={workingHours} />
        <InfoRow label="Staff Code"    value={staffCode} />
        <InfoRow label="Created At"    value={formatDate(createdAt)} />

        {/* Action Buttons */}
        <View style={styles.actionContainer}>

          {/* Edit Button */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
            disabled={deleteMutation.isPending}
          >
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>

          {/* Delete Button */}
          {deleteMutation.isPending ? (
            <ActivityIndicator size="small" color="red" />
          ) : (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      {/* ── Edit Modal ── */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Staff</Text>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                disabled={updateMutation.isPending}
              >
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

              <FormField
                label="Name"
                value={formData.staffName}
                onChangeText={(v) => updateField("staffName", v)}
                placeholder="Staff name"
              />
              <FormField
                label="Gender"
                value={formData.gender}
                onChangeText={(v) => updateField("gender", v)}
                placeholder="Male or Female"
              />
              <FormField
                label="Phone"
                value={formData.phone}
                onChangeText={(v) => updateField("phone", v)}
                placeholder="+2348012345678"
                keyboardType="phone-pad"
              />
              <FormField
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChangeText={(v) => updateField("dateOfBirth", v)}
                placeholder="YYYY-MM-DD"
              />
              <FormField
                label="Home Address"
                value={formData.homeAddress}
                onChangeText={(v) => updateField("homeAddress", v)}
                placeholder="Home address"
                multiline
              />
              <FormField
                label="Role"
                value={formData.Role}
                onChangeText={(v) => updateField("Role", v)}
                placeholder="e.g. Housekeeper"
              />
              <FormField
                label="Working Hours"
                value={formData.workingHours}
                onChangeText={(v) => updateField("workingHours", v)}
                placeholder="e.g. 8 AM - 5 PM"
              />

              {/* Modal Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowEditModal(false)}
                  disabled={updateMutation.isPending}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    updateMutation.isPending && styles.buttonDisabled,
                  ]}
                  onPress={handleUpdate}
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>

            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

// ─── Small reusable components ────────────────────────────────────────────────

const InfoRow = ({ label, value }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const FormField = ({ label, value, onChangeText, placeholder, keyboardType, multiline }) => (
  <View style={styles.formField}>
    <Text style={styles.formLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType={keyboardType || "default"}
      multiline={multiline || false}
      style={[styles.formInput, multiline && { height: 80, textAlignVertical: "top" }]}
    />
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  photoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#ccc",
  },
  item: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginTop: 2,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    paddingTop: 30,
  },
  editButton: {
    backgroundColor: "#10B981",
    width: "40%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  deleteButton: {
    backgroundColor: "red",
    width: "40%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalClose: {
    fontSize: 18,
    color: "#6B7280",
    padding: 4,
  },

  // ── Form ──
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "white",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#10B981",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
});

export default DomesticDetail;