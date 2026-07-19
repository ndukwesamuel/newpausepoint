import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TERMS_KEY = "pausepoint_terms_accepted_v1";

const TERMS_TEXT = `PAUSEPOINT APP – TERMS AND CONDITIONS (TERMS OF SERVICE)
Effective Date: April 2026

Welcome to the Pausepoint App ("App"), a proptech platform operated by PG Works Services Ltd trading as Pausepoint ("Pausepoint", "we", "us", or "our").

By downloading, installing, registering an account, or using the Pausepoint mobile application and any related services (collectively the "Service"), you agree to be legally bound by these Terms and Conditions. If you do not agree, you must not use the Service.

1. ACCEPTANCE OF TERMS
These Terms constitute a legally binding agreement between you and Pausepoint. Your continued use of the Service after any updates means you accept the revised Terms.

2. DESCRIPTION OF THE SERVICE
Pausepoint is an all-in-one estate management platform for gated residential communities. The Service includes, but is not limited to:
• Visitor access code generation (including multi-entry codes)
• Compulsory user profile pictures for identity verification
• Electronic payments for estate dues, electricity, and other bills
• Emergency Alerts
• Service requests for verified artisans
• Community announcements and emergency alerts
• Access and visitor history logs
• Household grouping for dues collection
• Errand services (using Pausepoint-provided bicycles)
• Amenities booking (e.g., hall, gym, pool, etc.)
• Marketplace for goods and services within the estate
• Domestic staff registration and permanent access codes
• Polls and community voting
• Any additional or future features we may introduce

3. ACCOUNT CREATION AND ESTATE VERIFICATION
Anyone may download and create a basic account on the Pausepoint App. However, full access to estate-specific features is restricted until you join your specific estate and the estate administrator reviews and approves your request. Pausepoint is not responsible for any delay or denial of approval by the estate management.

4. VISITOR ACCESS CODES AND GUEST LIABILITY
When you generate and share any visitor access code, you take full and sole responsibility for every person you invite into the estate. Pausepoint, the estate management, and security personnel shall not be liable for any actions, damage, loss, injury, theft, or incident caused by your guest. Multi-entry codes expire after 7 days.

5. DOMESTIC STAFF REGISTRATION AND PERMANENT CODES
By registering domestic staff and issuing a permanent code, you confirm that you take full responsibility for the conduct and actions of such staff while inside the estate.

6. ERRAND SERVICES
Pausepoint only facilitates the connection and provides the bicycle. We are not responsible for the quality, timeliness, outcome of the errand, or for any loss, damage, or injury arising from the errand service.

7. OTHER FEATURES
• Amenities Booking: Subject to availability and estate rules.
• Marketplace: All transactions occur directly between users. Pausepoint is only a platform and is not responsible for quality, safety, delivery, or disputes.
• Artisan Services: Pausepoint only facilitates the connection. We do not employ artisans and are not responsible for their work.
• Polls and Announcements: Content you post must be lawful and respectful.

8. PRICING AND SUBSCRIPTION
Subscription fees and payment terms are determined by agreement between Pausepoint and each individual estate.

9. PAYMENTS AND BILL COLLECTION
Pausepoint acts only as a payment facilitator. Any dispute regarding amounts owed must be resolved directly with the estate management or relevant provider.

10. DATA PROTECTION AND PRIVACY
We are registered with the Nigeria Data Protection Commission (NDPC) and process your personal data in accordance with the Nigeria Data Protection Act 2023.

11. USER CONDUCT AND PROHIBITED ACTIVITIES
You agree not to misuse the App, generate codes for unlawful purposes, post harmful content, or interfere with the Service.

12. INTELLECTUAL PROPERTY
All rights in the Pausepoint App and its content belong to PG Works Services Ltd.

13. LIMITATION OF LIABILITY
To the fullest extent permitted by law, Pausepoint shall not be liable for any indirect, consequential, or punitive damages arising from your use of the Service.

14. TERMINATION
You may stop using the Service at any time. We may suspend or terminate your access for breach of these Terms.

15. CHANGES TO TERMS OR SERVICE
We may modify these Terms at any time. Continued use after notification constitutes acceptance.

16. GOVERNING LAW
These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes shall be resolved in the courts of Lagos State.

17. CONTACT US
Kazeem Oyelakin – CEO
Pausepoint (PG Works Services Ltd)
Phone: +234 901 926 9787 | +234 813 167 7842
Website: www.pausepoint.net`;

export const useTermsAcceptance = () => {
  const [termsAccepted, setTermsAccepted] = useState(null); // null = loading

  useEffect(() => {
    const check = async () => {
      try {
        const value = await AsyncStorage.getItem(TERMS_KEY);
        setTermsAccepted(value === "true");
      } catch {
        setTermsAccepted(false);
      }
    };
    check();
  }, []);

  const acceptTerms = async () => {
    await AsyncStorage.setItem(TERMS_KEY, "true");
    setTermsAccepted(true);
  };

  return { termsAccepted, acceptTerms };
};

const TermsModal = ({ visible, onAccept }) => {
  const [scrolledToBottom, setScrolledToBottom] = useState(false);

  const handleScroll = ({ nativeEvent }) => {
    const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isAtBottom) setScrolledToBottom(true);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <MaterialCommunityIcons
              name="shield-check"
              size={32}
              color="#10B981"
            />
          </View>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>
            Please read and accept before continuing
          </Text>
        </View>

        {/* Scroll hint */}
        {!scrolledToBottom && (
          <View style={styles.scrollHint}>
            <MaterialCommunityIcons
              name="arrow-down"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.scrollHintText}>
              Scroll to the bottom to accept
            </Text>
          </View>
        )}

        {/* Terms content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={true}
        >
          <Text style={styles.termsText}>{TERMS_TEXT}</Text>
        </ScrollView>

        {/* Accept button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.acceptButton,
              !scrolledToBottom && styles.acceptButtonDisabled,
            ]}
            onPress={onAccept}
            disabled={!scrolledToBottom}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={20}
              color="#FFFFFF"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.acceptButtonText}>
              {scrolledToBottom
                ? "I Accept the Terms & Conditions"
                : "Read all terms to continue"}
            </Text>
          </TouchableOpacity>
          <Text style={styles.footerNote}>
            By accepting you agree to be bound by these terms. This cannot be
            undone without reinstalling the app.
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  logoWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  scrollHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEF3C7",
    paddingVertical: 8,
  },
  scrollHintText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  termsText: {
    fontSize: 13,
    fontWeight: "400",
    color: "#374151",
    lineHeight: 22,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  acceptButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowColor: "transparent",
    elevation: 0,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  footerNote: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 16,
  },
});

export default TermsModal;
