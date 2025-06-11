import { View, Text } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RunnerTabNavigation from "./RunnerTabNavigation";
const Stack = createNativeStackNavigator();

const SingleScreenWithBackButton = (screenName, component, title) => {
  return {
    name: screenName,
    component: component,
    options: ({ navigation }) => ({
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
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
      ),
    }),
  };
};

const createScreen = (name, component, title) => {
  return (
    <Stack.Screen
      key={name}
      {...SingleScreenWithBackButton(name, component, title)}
    />
  );
};

export default function RunnerNavigation() {
  return (
    <Stack.Navigator initialRouteName="RunnerTabNavigation">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="RunnerTabNavigation"
        component={RunnerTabNavigation}
      />
    </Stack.Navigator>
  );
}
