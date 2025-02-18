import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const ClickToJoinCLan = ({ children }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      style={{
        borderWidth: 1,
        borderColor: "#D9D9D9",
        padding: 10,
        borderRadius: 6,
      }}
      onPress={() => navigation.navigate("myclan")}
    >
      <Text> Click join a clan </Text>
      {children}
    </TouchableOpacity>
  );
};

export default ClickToJoinCLan;
