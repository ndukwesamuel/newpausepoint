



import { StyleSheet } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Onboarding from "../components/Onboard/Onboading ";
import Registraion from "../screens/Registraion";
import LoginScreen from "../screens/LoginScreen";
import ForgottenPasswod from "../screens/ForgottenPasswod";
import OTP from "../screens/OTP";
import CreatePassword from "../screens/CreatePassword";
import UserTabNavigation from "./User/UserTabNavigation";
import Emergency from "../screens/Customerinterface/Emergency/Emergency";
// import WelcomeScreen from "../screens/WelcomeScreen";
// import LoginScreen from "../screens/LoginScreen";
// import SignupScreen from "../screens/SignupScreen";
// import DashboardTabs from "./DashboardTabs";
// import { useAppSelector } from "../redux/store";
// import { selectLoginState } from "../redux/slices/authSlice";

export type EmergencyNavigationParamList = {
    emergency: undefined;
    // Home: undefined
    // Registraion: undefined
    // Login: undefined
    // Forgotten: undefined
    // OTP: undefined
    // CreatePassword: undefined
    // usertab: undefined

};

const Stack = createNativeStackNavigator<EmergencyNavigationParamList>();



const UserAccountNavigation = ({ }) => {
    //   const isLoggedIn = useAppSelector(selectLoginState);

    let isLoggedIn = true




    return (
        <Stack.Navigator
            initialRouteName="emergency"
            screenOptions={{ headerShown: false }}
        >

            <Stack.Screen name="emergency" component={Emergency} />









        </Stack.Navigator>
    );
};

export default UserAccountNavigation;

const styles = StyleSheet.create({});
