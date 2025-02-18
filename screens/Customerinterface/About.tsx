import { View, Text, ScrollView } from "react-native";
import React from "react";

const About = () => {
  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        About Us
      </Text>

      <Text style={{ marginBottom: 20 }}>
        At Pause Point, we're on a mission to create safer, more connected
        communities through innovative technology. Our platform brings neighbors
        closer, secures assets, and ensures family safety. With privacy and
        security as our guiding principles, we're reshaping the way you
        experience the world right at your doorstep. Welcome to Pause Point,
        your gateway to safer, more connected living.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Vision
      </Text>

      <Text style={{ marginBottom: 20 }}>
        Our vision at Pause Point is to redefine community living in a digital
        age. We envision a world where residents enjoy peace of mind, knowing
        their privacy and security are paramount. Our platform will continue to
        be the bridge that strengthens community bonds, secures assets, and
        provides a safe environment for families to thrive. Together, we aim to
        build a future where 'home' means not only a physical place but also a
        strong, connected, and secure community.
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Mission
      </Text>

      <Text style={{ marginBottom: 20 }}>
        At Pause Point, our mission is to create a secure and connected world
        within communities. We aim to empower residents to build strong social
        connections, safeguard their valuable assets, and ensure the safety of
        their families. Through innovative technology and unwavering commitment
        to privacy and security, we strive to foster a sense of belonging and
        trust within every neighborhood.
      </Text>
    </ScrollView>
  );
};

export default About;
