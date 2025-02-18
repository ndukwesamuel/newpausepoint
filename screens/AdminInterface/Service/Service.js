import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
} from "react-native";

const Service = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require("../../../assets/Vector.png")} />
      </View>
      <Text style={styles.message}>
        There are no services created by you yet!
      </Text>
      <Text style={styles.instruction}>
        Click the Add Icon below to create vendor profile.
      </Text>
      <View
        style={{
          marginTop: 250,
          alignSelf: "flex-end",
          marginRight: 30,
        }}
      >
        <Pressable
          onPress={() => navigation.navigate("VendorProfile")}
          accessibilityLabel="Add Vendor Profile"
        >
          <Image source={require("../../../assets/cross.png")} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  imageContainer: {
    marginBottom: 30,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 4,
  },
  instruction: {
    fontSize: 14,
    textAlign: "center",
  },
  addButtonContainer: {
    marginTop: 250,
    alignSelf: "flex-end",
    marginRight: 30,
  },
});

export default Service;
