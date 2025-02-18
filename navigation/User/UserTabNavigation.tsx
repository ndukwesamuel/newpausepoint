import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import About from "../../screens/Customerinterface/About";
import Account from "../../screens/Customerinterface/Account/Account";
import History from "../../screens/Customerinterface/Guest/History";
import Home from "../../screens/Customerinterface/Home";
import Guests from "../../screens/Customerinterface/Guest/Guests";
import Neigborhood from "../../screens/Customerinterface/Neigborhood";
import {
  CustomTabButton,
  Tabcomponent,
} from "../../components/shared/naviagetion";
import ClanRequiredScreen from "../../components/shared/ClanRequiredScreen";
import Emergency from "../../screens/Customerinterface/Emergency/Emergency";
import { StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

const UserTabNavigation = () => {
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
        name="Guests"
        component={Guests}
        options={{
          title: "Guests",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabcomponent
              focused={focused}
              iconFocused={require("../../assets/images/guest2.png")}
              iconUnfocused={require("../../assets/images/guest.png")}
              label="Guests"
              containerStyle={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
              texttStyle={{ color: "#000000" }}
            />
          ),
        }}
      />
      {/* {props => (
                    <ClanRequiredScreen {...props}>
                        <Guests {...props} />
                    </ClanRequiredScreen>
                )}
            </Tab.Screen> */}

      <Tab.Screen
        component={Neigborhood}
        name="Neigborhood"
        options={{
          title: "Neigborhood",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabcomponent
              focused={focused}
              iconFocused={require("../../assets/message-text2.png")}
              iconUnfocused={require("../../assets/message-text.png")}
              label="Chat"
              containerStyle={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
              texttStyle={{ color: "#000000" }}
            />
          ),
        }}
      />
      {/* {props => (
                    <ClanRequiredScreen {...props}>
                        <Neigborhood {...props} />
                    </ClanRequiredScreen>cha
                )}
            </Tab.Screen> */}

      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          title: "Home",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <AntDesign
              name="home"
              size={24}
              color="white"
              style={{ width: 25, height: 25 }}
            />
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
        }}
      />

      <Tab.Screen
        name="Emergencyscreen"
        component={Emergency}
        options={{
          title: "Emergency",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabcomponent
              focused={focused}
              iconFocused={require("../../assets/images/emergency2.png")}
              iconUnfocused={require("../../assets/images/emergency.png")}
              label="Emergency"
              containerStyle={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
              texttStyle={{ color: "#000000" }}
            />
          ),
        }}
      />
      {/* {props => (
                    <ClanRequiredScreen {...props}>
                        <Emergency {...props} />
                    </ClanRequiredScreen>
                )}
            </Tab.Screen> */}

      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          title: "Account",
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabcomponent
              focused={focused}
              iconFocused={require("../../assets/images/Account2.png")}
              iconUnfocused={require("../../assets/images/Account.png")}
              label="Account"
              containerStyle={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
              texttStyle={{ color: "#000000" }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserTabNavigation;

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
