import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

import { emergencydata } from "../../../components/Emergency/emdata";
import { MediumFontText } from "../../../components/shared/Paragrahp";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import {
  CustomTextArea,
  Forminput,
} from "../../../components/shared/InputForm";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useMutateData_v2 } from "../../../hooks/Requestv2";

const ESTATE_PHONE = "1234567890"; // TODO: replace with real number

const Emergency = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [homeaddress, setHomeaddress] = useState("");
  const [moreinfo, setMoreinfo] = useState("");

  // ── Validation ──────────────────────────────────────────
  const addressError = homeaddress.length > 0 && homeaddress.trim().length < 3;
  const isFormValid =
    homeaddress.trim().length >= 3 && moreinfo.trim().length >= 5;

  // ── Mutation ────────────────────────────────────────────
  const emergencyMutation = useMutateData_v2(
    "api/v1/Emergencyreport",
    "POST",
    undefined,
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Report sent",
          text2: "The estate team has been notified",
        });
        closeModal();
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to send report",
        });
      },
    },
  );

  // ── Helpers ─────────────────────────────────────────────
  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
    setHomeaddress("");
    setMoreinfo("");
  };

  const makePhoneCall = () => {
    const url = `tel:${ESTATE_PHONE}`;
    Linking.openURL(url).catch(() =>
      Toast.show({ type: "error", text1: "Could not open phone dialler" }),
    );
  };

  const handleSubmit = () => {
    if (!isFormValid) {
      Toast.show({
        type: "error",
        text1: "Please fill in all fields",
        text2: "Location and description are required",
      });
      return;
    }
    emergencyMutation.mutate({
      type: selectedItem?.type,
      address: homeaddress,
      additionalInfo: moreinfo,
    });
  };

  // ── Emergency card ──────────────────────────────────────
  const RenderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openModal(item)}
      activeOpacity={0.85}
    >
      <View style={styles.cardIconWrap}>
        <Image source={item.image} style={styles.cardImage} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>

      <View style={styles.cardChevron}>
        <MaterialCommunityIcons
          name="chevron-right"
          size={20}
          color="#10B981"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper
      title="Emergency"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
      showHeader={true}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* ── SOS banner ──────────────────────── */}
          <TouchableOpacity
            style={styles.sosBanner}
            onPress={makePhoneCall}
            activeOpacity={0.85}
          >
            <View style={styles.sosPulse}>
              <MaterialCommunityIcons
                name="phone-alert"
                size={22}
                color="#FFFFFF"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.sosTitle}>Emergency Hotline</Text>
              <Text style={styles.sosSub}>Tap to call estate security now</Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="#FFFFFF"
            />
          </TouchableOpacity>

          {/* ── Section label ───────────────────── */}
          <Text style={styles.sectionLabel}>Report an Emergency</Text>
          <Text style={styles.sectionSub}>
            Select the type of emergency to file a report
          </Text>

          {/* ── List ────────────────────────────── */}
          <FlatList
            data={emergencydata}
            renderItem={({ item }) => <RenderItem item={item} />}
            keyExtractor={(item) => item.type}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        {/* ── Report modal ────────────────────── */}
        <CenterReuseModals visible={modalVisible} onClose={closeModal}>
          <View style={styles.modalCard}>
            {/* Modal header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalIconWrap}>
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  size={20}
                  color="#EF4444"
                />
              </View>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedItem?.type || "Emergency"} Report
              </Text>
              <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
                <MaterialIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Location field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                Location <Text style={styles.required}>*</Text>
              </Text>
              <Forminput
                placeholder="House No., Street, Block (e.g. House 12, Road 3)"
                onChangeText={setHomeaddress}
                value={homeaddress}
              />
              {addressError && (
                <Text style={styles.fieldError}>
                  Please enter a valid location
                </Text>
              )}
            </View>

            {/* Description field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>
                What is happening? <Text style={styles.required}>*</Text>
              </Text>
              <CustomTextArea
                placeholder={`Describe the ${selectedItem?.type?.toLowerCase() || "emergency"} in detail...`}
                value={moreinfo}
                onChangeText={setMoreinfo}
                inputStyle={styles.textArea}
              />
              <Text style={styles.charCount}>{moreinfo.length} / 500</Text>
            </View>

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                !isFormValid && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid || emergencyMutation.isPending}
              activeOpacity={0.85}
            >
              {emergencyMutation.isPending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="send"
                    size={16}
                    color="#FFFFFF"
                  />
                  <Text style={styles.submitBtnText}>Submit Report</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={styles.modalNote}>
              Your report will be sent immediately to the estate management
              team.
            </Text>
          </View>
        </CenterReuseModals>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

export default Emergency;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },

  // SOS Banner
  sosBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EF4444",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sosPulse: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  sosTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  sosSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    marginTop: 2,
  },

  // Section
  sectionLabel: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 16,
  },

  listContent: {
    paddingBottom: 40,
    gap: 12,
  },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cardImage: {
    width: 30,
    height: 32,
    resizeMode: "contain",
  },
  cardBody: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    fontWeight: "500",
  },
  cardChevron: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
  },

  // Modal
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "92%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  modalIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginBottom: 20,
  },

  // Fields
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  fieldError: {
    fontSize: 12,
    color: "#EF4444",
    fontWeight: "500",
    marginTop: 4,
  },
  textArea: {
    textAlignVertical: "top",
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    height: 110,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  charCount: {
    fontSize: 11,
    color: "#9CA3AF",
    textAlign: "right",
    marginTop: 4,
    fontWeight: "500",
  },

  // Submit
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EF4444",
    paddingVertical: 15,
    borderRadius: 14,
    gap: 8,
    marginTop: 4,
    shadowColor: "#EF4444",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  modalNote: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 12,
    lineHeight: 18,
  },
});
