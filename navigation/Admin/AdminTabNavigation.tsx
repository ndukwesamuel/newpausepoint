import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import About from '../../screens/Customerinterface/About';
import { AntDesign } from "@expo/vector-icons";
import { CustomTabButton, Tabcomponent } from '../../components/shared/naviagetion';
import Guests from '../../screens/Customerinterface/Guest/Guests';
import Emergency from '../../screens/Customerinterface/Emergency/Emergency';
import Account from '../../screens/AdminInterface/Account/Account';
import History from '../../screens/Customerinterface/Guest/History';
import Home from '../../screens/Customerinterface/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminHome from '../../screens/AdminInterface/AdminHome';
import AllUsers from '../../screens/AdminInterface/AllUsers';
import AdminGuests from '../../screens/AdminInterface/Guest/AdminGuests';





const Tab = createBottomTabNavigator();







const AdminTabNavigation = () => {
    return (

        <Tab.Navigator

            screenOptions={{
                tabBarShowLabel: false,

                tabBarStyle: {
                    backgroundColor: 'white',
                    // position: 'absolute',
                    // bottom: 25,
                    // left: 20,
                    // right: 20,
                    // borderRadius: 15,
                    // borderTopEndRadius: 50,
                    // borderTopLeftRadius: 50,
                    // alignItems: 'center',
                    height: 65,
                    // justifyContent: 'center',
                    ...styles.shadow,
                    // paddingVertical: 20
                    // Set the background color of the tab bar
                },
                tabBarLabelStyle: {

                    color: 'white', // Set the text color of the tab labels
                },
                // You can add more styling options as needed
            }}
        >




            <Tab.Screen
                options={{
                    title: "AdminHome",
                    tabBarActiveTintColor: "#005091",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Tabcomponent
                                focused={focused}
                                iconFocused={require('../../assets/images/home.png')}
                                iconUnfocused={require('../../assets/images/home-2.png')}
                                label="Home"
                                containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                texttStyle={{ color: "#000000" }}
                            />


                        );
                    },
                }}

                name="AdminHome" component={AdminHome} />

            <Tab.Screen
                options={{
                    title: "Guest",
                    tabBarActiveTintColor: "#005091",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Tabcomponent
                                focused={focused}
                                iconFocused={require('../../assets/images/history.png')}
                                iconUnfocused={require('../../assets/images/historyhistory2.png')}
                                label="Guest"
                                containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                texttStyle={{ color: "#000000" }}
                            />


                        );
                    },
                }}

                name="adminguest" component={AdminGuests} />





            <Tab.Screen
                options={{
                    title: "Users",
                    tabBarActiveTintColor: "#005091",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Tabcomponent
                                focused={focused}
                                iconFocused={require('../../assets/images/guest2.png')}
                                iconUnfocused={require('../../assets/images/guest.png')}
                                label="Users"
                                containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                texttStyle={{ color: "#000000" }}
                            />


                        );
                    },
                }}

                name="AllUsers" component={AllUsers} />



            <Tab.Screen
                options={{
                    title: "Account",
                    tabBarActiveTintColor: "#005091",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <Tabcomponent
                                focused={focused}
                                iconFocused={require('../../assets/images/Account2.png')}
                                iconUnfocused={require('../../assets/images/Account.png')}
                                label="Account"
                                containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                texttStyle={{ color: "#000000" }}
                            />


                        );
                    },
                }}

                name="Account" component={Account} />
        </Tab.Navigator >


    )
}

export default AdminTabNavigation













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

    }
})