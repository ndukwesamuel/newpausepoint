import React from "react";
import { Platform, TouchableOpacity } from "react-native";

import { AntDesign } from "@expo/vector-icons";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BackHandler } from "react-native";
import { useEffect, useCallback } from "react";
import GuestTabNavigation from "./GuestTabNavigation";
import CreateErrandScreen from "../../../components/Errand/CreateErrandScreen";
import ErrandDetailScreen from "../../../screens/Customerinterface/Errands/ErrandDetailScreen";
import FundWalletScreen from "../../../screens/Customerinterface/Wallet/FundWalletScreen";

const Stack = createNativeStackNavigator();

const SingleScreenWithBackButton = (screenName, component, title) => {
  const WrappedComponent = (props) => {
    const Component = component;

    // Create a stable callback for the back handler
    const handleBackPress = useCallback(() => {
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
        return true; // Prevent default behavior
      }
      return false; // Let default behavior handle it
    }, [props.navigation]);

    // Handle hardware back button on Android
    useEffect(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        handleBackPress,
      );

      return () => backHandler.remove();
    }, [handleBackPress]);

    return <Component {...props} />;
  };

  // Create a memoized back button handler to prevent recreation
  const createBackHandler = useCallback(
    (navigation) => () => {
      navigation.goBack();
    },
    [],
  );

  return {
    name: screenName,
    component: WrappedComponent,
    options: ({ navigation }) => ({
      title: title,
      headerStyle: {
        backgroundColor: "white",
        elevation: 0, // Remove shadow on Android
        shadowOpacity: 0, // Remove shadow on iOS
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={createBackHandler(navigation)}
          style={{
            marginLeft: Platform.OS === "android" ? 16 : 10,
            padding: 12,
            borderRadius: 8,
            minWidth: 44,
            minHeight: 44,
            justifyContent: "center",
            alignItems: "center",
          }}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          activeOpacity={0.6}
          delayPressIn={0}
          delayPressOut={0}
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

export default function GuestNavigation() {
  return (
    <Stack.Navigator initialRouteName="GuestTabNavigation">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="GuestTabNavigation"
        component={GuestTabNavigation}
      />

      <Stack.Screen
        name="erranddetail"
        component={ErrandDetailScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="createErrand"
        component={CreateErrandScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FundWallet"
        component={FundWalletScreen}
        // options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
