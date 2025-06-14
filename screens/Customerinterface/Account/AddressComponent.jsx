import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../../components/shared/Paragrahp";

const AddressComponent = ({ memberData, clanId, userId, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    flatNumber: memberData?.flatNumber || "",
    street: memberData?.street || "",
    apartmentType: memberData?.apartmentType || "",
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Call your API to update the member's address info
      const response = await axios.put(
        `${API_BASEURL}clan/update-member-address`,
        {
          clanId,
          userId,
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${user_data?.token}`,
          },
        }
      );

      Toast.show({
        type: "success",
        text1: "Address updated successfully",
      });
      setIsEditing(false);
      onUpdateSuccess?.(); // Refresh parent component if needed
    } catch (error) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to update address",
      });
    }
  };

  if (!isEditing) {
    return (
      <View style={styles.addressContainer}>
        <View style={styles.addressRow}>
          <RegularFontText data="Flat Number" textstyle={styles.label} />
          <MediumFontText
            data={formData.flatNumber || "Not specified"}
            textstyle={styles.value}
          />
        </View>
        <View style={styles.addressRow}>
          <RegularFontText data="Street Name" textstyle={styles.label} />
          <MediumFontText
            data={formData.street || "Not specified"}
            textstyle={styles.value}
          />
        </View>
        <View style={styles.addressRow}>
          <RegularFontText data="Apartment Type" textstyle={styles.label} />
          <MediumFontText
            data={formData.apartmentType || "Not specified"}
            textstyle={styles.value}
          />
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditing(true)}
        >
          <Text style={styles.editButtonText}>Edit Address</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.addressContainer}>
      <View style={styles.inputGroup}>
        <RegularFontText data="Flat Number" textstyle={styles.label} />
        <TextInput
          style={styles.input}
          value={formData.flatNumber}
          onChangeText={(text) => handleInputChange("flatNumber", text)}
          placeholder="Enter flat number"
        />
      </View>

      <View style={styles.inputGroup}>
        <RegularFontText data="Street Name" textstyle={styles.label} />
        <TextInput
          style={styles.input}
          value={formData.street}
          onChangeText={(text) => handleInputChange("street", text)}
          placeholder="Enter street name"
        />
      </View>

      <View style={styles.inputGroup}>
        <RegularFontText data="Apartment Type" textstyle={styles.label} />
        <TextInput
          style={styles.input}
          value={formData.apartmentType}
          onChangeText={(text) => handleInputChange("apartmentType", text)}
          placeholder="Enter apartment type"
        />
      </View>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setIsEditing(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    borderWidth: 1,
    borderRadius: 7,
    borderColor: "#2632381F",
    padding: 15,
    marginTop: 15,
  },
  addressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: "#696969",
    width: "40%",
  },
  value: {
    fontSize: 14,
    width: "60%",
    textAlign: "right",
  },
  editButton: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: "flex-end",
  },
  editButtonText: {
    color: "white",
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    textAlign: "center",
    color: "white",
  },
});

export default AddressComponent;
