import { View, Text } from "react-native";
import React from "react";

import { AntDesign } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RunnerTabNavigation from "./RunnerTabNavigation";
import ErrandDetailsScreen from "./Screen/ErrandDetailsScreen";
import { TouchableOpacity } from "react-native";
import TaskScreen from "./Screen/TaskScreen";
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

const screens = [
  {
    name: "ErrandDetailsScreen",
    component: ErrandDetailsScreen,
    title: "Errand Details",
  },

  {
    name: "TaskScreen",
    component: TaskScreen,
    title: "Task ",
  },
];

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

      {screens.map((screen) =>
        createScreen(screen.name, screen.component, screen.title)
      )}
    </Stack.Navigator>
  );
}
