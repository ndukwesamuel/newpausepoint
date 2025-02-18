import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { NavigationProp, ParamListBase } from '@react-navigation/native';


import Onboarding from "../components/Onboard/Onboading ";
import Registraion from "../screens/Registraion";
import LoginScreen from "../screens/LoginScreen";
import ForgottenPasswod from "../screens/ForgottenPasswod";
import OTP from "../screens/OTP";
import CreatePassword from "../screens/CreatePassword";
import UserTabNavigation from "./User/UserTabNavigation";
import EditPersonalInformation from "../screens/Customerinterface/Account/EditPersonalInformation";
import NotificatioSettings from "../screens/Customerinterface/Account/NotificatioSettings";
import ChangePassowrd from "../screens/Customerinterface/Account/ChangePassowrd";
import DeleteAccount from "../screens/Customerinterface/Account/DeleteAccount";
import Usernaviagetion from "./User/Usernaviagetion";
import AdminHome from "../screens/AdminInterface/AdminHome";
import Adminnaviagetion from "./Admin/Adminnaviagetion";
import UserDetails from "../screens/AdminInterface/UserDetails";
// import WelcomeScreen from "../screens/WelcomeScreen";
// import LoginScreen from "../screens/LoginScreen";
// import SignupScreen from "../screens/SignupScreen";
// import DashboardTabs from "./DashboardTabs";
// import { useAppSelector } from "../redux/store";
// import { selectLoginState } from "../redux/slices/authSlice";
import { AntDesign } from '@expo/vector-icons';
import CommentScreen from "../screens/SharedScreen/CommentScreen";
import { useSelector } from "react-redux";


export type RootStackParamList = {
    Welcome: undefined;
    Home: undefined
    Registraion: undefined
    Login: undefined
    Forgotten: undefined
    OTP: undefined
    CreatePassword: undefined
    usertab: undefined
    PersonalInfo: undefined
    notificationsettings: undefined
    ChangePassowrd: undefined
    DeleteAccount: undefined
    adminscreen: undefined


};


const Stack = createNativeStackNavigator<RootStackParamList>();


const SingleScreenWithBackButton = (screenName: any, component: any, title: any) => {
    return {
        name: screenName,
        component: component,
        options: ({ navigation }: { navigation: any }) => ({
            title: title,
            headerStyle: {
                backgroundColor: 'white',
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

const StartScreen = () => {

    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><Text>Samhear</Text></View>
};

const AppNavigation = ({ }) => {
    const navigation = useNavigation();
    //   const isLoggedIn = useAppSelector(selectLoginState);


    let isLoggedIn = true

    let isAdmin = true


    return (
        <StartScreen />)












};

export default AppNavigation;

const styles = StyleSheet.create({});
