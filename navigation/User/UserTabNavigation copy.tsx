import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import About from '../../screens/Customerinterface/About';
import { AntDesign } from "@expo/vector-icons";
import { CustomTabButton, Tabcomponent } from '../../components/shared/naviagetion';
import Emergency from '../../screens/Customerinterface/Emergency/Emergency';
import Account from '../../screens/Customerinterface/Account/Account';
import History from '../../screens/Customerinterface/Guest/History';
import Home from '../../screens/Customerinterface/Home';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Guests from '../../screens/Customerinterface/Guest/Guests';
import Myclan from '../../screens/Customerinterface/Clan/Myclan';
import Neigborhood from '../../screens/Customerinterface/Neigborhood';




const Tab = createBottomTabNavigator();







const UserTabNavigation = () => {
    return (
        <>

            {/* <Text>UserTabNavigation</Text> */}
            <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                    tabBarShowLabel: false,

                    tabBarStyle: {
                        backgroundColor: 'white',

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
                        title: "Guests",
                        tabBarActiveTintColor: "#005091",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Tabcomponent
                                    focused={focused}
                                    iconFocused={require('../../assets/images/guest2.png')}
                                    iconUnfocused={require('../../assets/images/guest.png')}
                                    label="Guests"
                                    containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                    texttStyle={{ color: "#000000" }}
                                />


                            );
                        },
                    }}

                    name="Guests" component={Guests} />

                <Tab.Screen
                    options={{
                        title: "Neigborhood",
                        tabBarActiveTintColor: "#005091",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Tabcomponent
                                    focused={focused}
                                    iconFocused={require('../../assets/message-text.png')}
                                    iconUnfocused={require('../../assets/message-text.png')}
                                    label="Chat"
                                    containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                    texttStyle={{ color: "#000000" }}
                                />


                            );
                        },
                    }}

                    name="History" component={Neigborhood} />


                <Tab.Screen name="Home" component={Home}



                    options={{

                        title: "Home",
                        tabBarActiveTintColor: "#005091",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => {
                            return (
                                <AntDesign name="plus" size={24} color="white" style={{
                                    width: 25,
                                    height: 25,
                                }} />

                            );
                        },
                        tabBarButton: (props: any,) => {
                            return (
                                <CustomTabButton {...props} />

                            );
                        }
                    }}

                />


                <Tab.Screen
                    options={{
                        title: "Emergency",
                        tabBarActiveTintColor: "#005091",
                        headerShown: false,
                        tabBarIcon: ({ focused }) => {
                            return (
                                <Tabcomponent
                                    focused={focused}
                                    iconFocused={require('../../assets/images/emergency2.png')}
                                    iconUnfocused={require('../../assets/images/emergency.png')}
                                    label="Emergency"
                                    containerStyle={{ alignItems: "center", justifyContent: "center", top: 10 }}
                                    texttStyle={{ color: "#000000" }}
                                />


                            );
                        },
                    }}

                    name="Emergencyscreen" component={Emergency} />

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

        </>

    )
}

export default UserTabNavigation













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