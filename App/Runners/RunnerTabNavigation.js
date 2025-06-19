import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons"; // Import FontAwesome
import { StyleSheet } from "react-native";

import RunnerDashboard from "./Screen/RunnerDashboard";
import RunnerProfileScreen from "./Screen/RunnerProfileScreen";
import EarningsAnalyticsScreen from "./Screen/EarningsAnalyticsScreen";
import ErrandHistoryScreen from "./Screen/ErrandHistoryScreen";

const Tab = createBottomTabNavigator();

const RunnerTabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "white",
          height: 65,
          ...styles.shadow,
        },
        tabBarLabelStyle: {
          color: "white",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={RunnerDashboard}
        options={{
          title: "Dashboard",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <FontAwesome
              name="dashboard"
              size={size}
              color={focused ? "#005091" : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="analytics"
        component={EarningsAnalyticsScreen}
        options={{
          title: "Analytics",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              size={24}
              color={focused ? "#005091" : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="history"
        component={ErrandHistoryScreen}
        options={{
          title: "History",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <MaterialCommunityIcons
              name="google-analytics"
              size={24}
              color={focused ? "#005091" : color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={RunnerProfileScreen}
        options={{
          title: "Dashboard",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => (
            <AntDesign
              name="setting"
              size={24}
              color={focused ? "#005091" : color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default RunnerTabNavigation;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
