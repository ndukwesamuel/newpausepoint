import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";


import { MaterialCommunityIcons } from "@expo/vector-icons";

export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Registraion: undefined;
  Login: undefined;
  Forgotten: undefined;
  OTP: undefined;
  CreatePassword: undefined;
  usertab: undefined;
  PersonalInfo: undefined;
  notificationsettings: undefined;
  ChangePassowrd: undefined;
  DeleteAccount: undefined;
  adminscreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const SingleScreenWithBackButton = (
  screenName: any,
  component: any,
  title: any,
) => {
  return {
    name: screenName,
    component: component,
    options: ({ navigation }: { navigation: any }) => ({
      title: title,
      headerStyle: {
        backgroundColor: "white",
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginLeft: 10,
          }}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="black" />
        </TouchableOpacity>
      ),
    }),
  };
};

const StartScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Samhear</Text>
    </View>
  );
};

const AppNavigation = ({}) => {
  const navigation = useNavigation();
  //   const isLoggedIn = useAppSelector(selectLoginState);

  let isLoggedIn = true;

  let isAdmin = true;

  return <StartScreen />;
};

export default AppNavigation;

const styles = StyleSheet.create({});
