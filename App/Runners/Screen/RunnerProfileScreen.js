import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Switch,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Logout } from "../../../components/Account/Logout";

const RunnerProfileScreen = () => {
  const [profile, setProfile] = useState({
    name: "John Adebayo",
    email: "john.adebayo@email.com",
    phone: "+234 801 234 5678",
    rating: 4.8,
    completedErrands: 234,
    profileImage: null,
    vehicleType: "Motorcycle",
    vehicleNumber: "LAG-123-XY",
    isVerified: true,
  });

  const [settings, setSettings] = useState({
    pushNotifications: true,
    locationSharing: true,
    autoAcceptErrands: false,
    workingHours: true,
    soundAlerts: true,
  });

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingField, setEditingField] = useState("");
  const [editValue, setEditValue] = useState("");

  const handleEditProfile = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
    setIsEditModalVisible(true);
  };

  const saveEdit = () => {
    setProfile((prev) => ({
      ...prev,
      [editingField]: editValue,
    }));
    setIsEditModalVisible(false);
  };

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout"),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}

        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image source={profile.profileImage} style={styles.profileImage} />
            <TouchableOpacity style={styles.editImageButton}>
              <Text style={styles.editImageText}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{profile.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>⭐ {profile.rating}</Text>
            <Text style={styles.completedText}>
              {profile.completedErrands} errands completed
            </Text>
          </View>
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified Runner</Text>
            </View>
          )}
        </View>
        <View
          style={{
            position: "relative",
            top: 0,
            zIndex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Logout
            item={{
              // Re-using GeneralData for consistency
              id: 4,
              icon: "logout-outline",
              label: "Logout",
              icon_type: "Ionicons",
              link: "Logout",
            }}
          />

          <Text
            style={{
              fontSize: 16,
            }}
          >
            Logout
          </Text>
        </View>

        {/* Profile Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleEditProfile("email", profile.email)}
          >
            <Text style={styles.infoLabel}>Email</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profile.email}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() => handleEditProfile("phone", profile.phone)}
          >
            <Text style={styles.infoLabel}>Phone</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profile.phone}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              handleEditProfile("vehicleType", profile.vehicleType)
            }
          >
            <Text style={styles.infoLabel}>Vehicle Type</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profile.vehicleType}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.infoRow}
            onPress={() =>
              handleEditProfile("vehicleNumber", profile.vehicleNumber)
            }
          >
            <Text style={styles.infoLabel}>Vehicle Number</Text>
            <View style={styles.infoValue}>
              <Text style={styles.infoText}>{profile.vehicleNumber}</Text>
              <Text style={styles.editIcon}>✏️</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch
              value={settings.pushNotifications}
              onValueChange={() => toggleSetting("pushNotifications")}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Location Sharing</Text>
            <Switch
              value={settings.locationSharing}
              onValueChange={() => toggleSetting("locationSharing")}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Auto Accept Errands</Text>
            <Switch
              value={settings.autoAcceptErrands}
              onValueChange={() => toggleSetting("autoAcceptErrands")}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Working Hours Mode</Text>
            <Switch
              value={settings.workingHours}
              onValueChange={() => toggleSetting("workingHours")}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Alerts</Text>
            <Switch
              value={settings.soundAlerts}
              onValueChange={() => toggleSetting("soundAlerts")}
              trackColor={{ false: "#767577", true: "#4CAF50" }}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>📊 View Analytics</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>💳 Payment Methods</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>📋 Errand History</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>🏆 Achievements</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>💬 Support & Help</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionRow}>
            <Text style={styles.actionText}>📄 Terms & Privacy</Text>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionRow, styles.logoutRow]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={isEditModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editingField}</Text>
            <TextInput
              style={styles.modalInput}
              value={editValue}
              onChangeText={setEditValue}
              placeholder={`Enter ${editingField}`}
              autoFocus={true}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileHeader: {
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ddd",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#4CAF50",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editImageText: {
    fontSize: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ratingContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 16,
    color: "#FF8800",
    marginBottom: 2,
  },
  completedText: {
    fontSize: 12,
    color: "#666",
  },
  verifiedBadge: {
    backgroundColor: "#E8F5E8",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    color: "#4CAF50",
    fontSize: 12,
    fontWeight: "bold",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  editIcon: {
    fontSize: 12,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLabel: {
    fontSize: 14,
    color: "#333",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  actionText: {
    fontSize: 14,
    color: "#333",
  },
  actionArrow: {
    fontSize: 18,
    color: "#ccc",
  },
  logoutRow: {
    borderBottomWidth: 0,
  },
  logoutText: {
    fontSize: 14,
    color: "#FF4444",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginLeft: 10,
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "bold",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default RunnerProfileScreen;
