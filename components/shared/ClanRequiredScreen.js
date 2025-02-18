import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

const ClanRequiredScreen = ({ component: Component, ...props }) => {
  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  if (get_user_profile_data?.currentClanMeeting) {
    return <Component {...props} />;
  }

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        You need to join a clan to access this screen.
      </Text>

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
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ClanRequiredScreen;
