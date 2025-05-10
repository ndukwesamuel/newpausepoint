import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const Errand = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#f8f9fa",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      {/* Main Heading */}
      <Text
        style={{
          fontSize: 28,
          fontWeight: "bold",
          color: "#2c3e50",
          marginBottom: 15,
          textAlign: "center",
        }}
      >
        Errands Made Effortless
      </Text>

      {/* Subheading */}
      <Text
        style={{
          fontSize: 18,
          color: "#7f8c8d",
          marginBottom: 30,
          textAlign: "center",
          lineHeight: 25,
        }}
      >
        Tired of juggling grocery runs and deliveries? {"\n"}
        We're building the perfect solution for your estate!
      </Text>

      {/* Features List */}
      <View style={{ marginBottom: 30, width: "100%" }}>
        {[
          "✓ Request errands with just a few taps",
          "✓ Track runners in real-time",
          "✓ Secure in-app payments",
          "✓ Vetted, trusted service providers",
        ].map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              marginBottom: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#27ae60", marginRight: 10 }}>✓</Text>
            <Text style={{ color: "#34495e", fontSize: 16 }}>{item}</Text>
          </View>
        ))}
      </View>

      {/* Countdown or Coming Soon Text */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: "#e74c3c",
          marginBottom: 30,
        }}
      >
        Launching Soon!
      </Text>

      {/* CTA Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#3498db",
          paddingVertical: 15,
          paddingHorizontal: 40,
          borderRadius: 30,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 3,
        }}
        onPress={() => console.log("Notify me pressed")}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Notify Me When Live
        </Text>
      </TouchableOpacity>

      {/* Footer Note */}
      <Text
        style={{
          marginTop: 30,
          color: "#95a5a6",
          fontSize: 14,
          textAlign: "center",
        }}
      >
        Be the first to experience hassle-free errands in your community
      </Text>
    </View>
  );
};

export default Errand;
