import { View, Text, ScrollView, StyleSheet, Image } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const About = () => {
  return (
    <ScrollView style={styles.container}>
      {/* About Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="information-outline"
            size={24}
            color="#3498db"
          />
          <Text style={styles.sectionTitle}>About Us</Text>
        </View>
        <Text style={styles.sectionText}>
          At Pause Point, we're on a mission to create safer, more connected
          communities through innovative technology. Our platform brings
          neighbors closer, secures assets, and ensures family safety. With
          privacy and security as our guiding principles, we're reshaping the
          way you experience the world right at your doorstep. Welcome to Pause
          Point, your gateway to safer, more connected living.
        </Text>
      </View>

      {/* Vision Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="eye-outline" size={24} color="#e74c3c" />
          <Text style={styles.sectionTitle}>Vision</Text>
        </View>
        <Text style={styles.sectionText}>
          Our vision at Pause Point is to redefine community living in a digital
          age. We envision a world where residents enjoy peace of mind, knowing
          their privacy and security are paramount. Our platform will continue
          to be the bridge that strengthens community bonds, secures assets, and
          provides a safe environment for families to thrive. Together, we aim
          to build a future where 'home' means not only a physical place but
          also a strong, connected, and secure community.
        </Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="target" size={24} color="#2ecc71" />
          <Text style={styles.sectionTitle}>Mission</Text>
        </View>
        <Text style={styles.sectionText}>
          At Pause Point, our mission is to create a secure and connected world
          within communities. We aim to empower residents to build strong social
          connections, safeguard their valuable assets, and ensure the safety of
          their families. Through innovative technology and unwavering
          commitment to privacy and security, we strive to foster a sense of
          belonging and trust within every neighborhood.
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Pause Point © 2025</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 15,
  },
  logo: {
    width: 120,
    height: 120,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#2c3e50",
  },
  sectionText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#34495e",
  },
  footer: {
    marginTop: 20,
    alignItems: "center",
    padding: 15,
  },
  footerText: {
    color: "#7f8c8d",
    fontSize: 14,
  },
});

export default About;
