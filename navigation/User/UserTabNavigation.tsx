// import React from "react";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { AntDesign } from "@expo/vector-icons";
// import { useSelector } from "react-redux";

// import About from "../../screens/Customerinterface/About";
// import Account from "../../screens/Customerinterface/Account/Account";
// import History from "../../screens/Customerinterface/Guest/History";
// import Home from "../../screens/Customerinterface/Home";
// import Guests from "../../screens/Customerinterface/Guest/Guests";
// import Neigborhood from "../../screens/Customerinterface/Neigborhood";
// import {
//   CustomTabButton,
//   Tabcomponent,
// } from "../../components/shared/naviagetion";
// import ClanRequiredScreen from "../../components/shared/ClanRequiredScreen";
// import Emergency from "../../screens/Customerinterface/Emergency/Emergency";
// import { StyleSheet } from "react-native";
// import Errand from "../../screens/Customerinterface/Errands/Errand";

// const Tab = createBottomTabNavigator();

// const UserTabNavigation = () => {
//   const { userProfile_data } = useSelector((state) => state.ProfileSlice);

//   console.log({
//     ccc: userProfile_data?.user?.isGuest,
//   });

//   return (
//     <Tab.Navigator
//       initialRouteName="Home"
//       screenOptions={{
//         tabBarShowLabel: false,
//         tabBarStyle: {
//           backgroundColor: "white",
//           height: 65,
//           ...styles.shadow,
//         },
//         tabBarLabelStyle: {
//           color: "white",
//         },
//       }}
//     >
//       {userProfile_data?.user?.isGuest != true && (
//         <Tab.Screen
//           name="Guests"
//           component={Guests}
//           options={{
//             title: "Guests",
//             tabBarActiveTintColor: "#005091",
//             headerShown: false,
//             tabBarIcon: ({ focused }) => (
//               <Tabcomponent
//                 focused={focused}
//                 iconFocused={require("../../assets/images/guest2.png")}
//                 iconUnfocused={require("../../assets/images/guest.png")}
//                 label="Guests"
//                 containerStyle={{
//                   alignItems: "center",
//                   justifyContent: "center",
//                   top: 10,
//                 }}
//                 texttStyle={{ color: "#000000" }}
//               />
//             ),
//           }}
//         />
//       )}

//       {userProfile_data?.user?.isGuest != true && (
//         <Tab.Screen
//           component={Neigborhood}
//           name="Neigborhood"
//           options={{
//             title: "Neigborhood",
//             tabBarActiveTintColor: "#005091",
//             headerShown: false,
//             tabBarIcon: ({ focused }) => (
//               <Tabcomponent
//                 focused={focused}
//                 iconFocused={require("../../assets/message-text2.png")}
//                 iconUnfocused={require("../../assets/message-text.png")}
//                 label="Chat"
//                 containerStyle={{
//                   alignItems: "center",
//                   justifyContent: "center",
//                   top: 10,
//                 }}
//                 texttStyle={{ color: "#000000" }}
//               />
//             ),
//           }}
//         />
//       )}

//       <Tab.Screen
//         name="errands"
//         component={Errand}
//         options={{
//           title: "Errands",
//           tabBarActiveTintColor: "#005091",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <Tabcomponent
//               focused={focused}
//               iconFocused={require("../../assets/fastbike.png")}
//               iconUnfocused={require("../../assets/fastbike.png")}
//               label="Errands"
//               containerStyle={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 top: 10,
//               }}
//               texttStyle={{ color: "#000000" }}
//             />
//           ),
//         }}
//       />
//       <Tab.Screen
//         name="Home"
//         component={Home}
//         options={{
//           title: "Home",
//           tabBarActiveTintColor: "#005091",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <AntDesign
//               name="home"
//               size={24}
//               color="white"
//               style={{ width: 25, height: 25 }}
//             />
//           ),
//           tabBarButton: (props) => <CustomTabButton {...props} />,
//         }}
//       />
//       <Tab.Screen
//         name="Account"
//         component={Account}
//         options={{
//           title: "Account",
//           tabBarActiveTintColor: "#005091",
//           headerShown: false,
//           tabBarIcon: ({ focused }) => (
//             <Tabcomponent
//               focused={focused}
//               iconFocused={require("../../assets/images/Account2.png")}
//               iconUnfocused={require("../../assets/images/Account.png")}
//               label="Account"
//               containerStyle={{
//                 alignItems: "center",
//                 justifyContent: "center",
//                 top: 10,
//               }}
//               texttStyle={{ color: "#000000" }}
//             />
//           ),
//         }}
//       />
//     </Tab.Navigator>
//   );
// };

// export default UserTabNavigation;

// const styles = StyleSheet.create({
//   shadow: {
//     shadowColor: "#7F5DF0",
//     shadowOffset: {
//       width: 0,
//       height: 10,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
// });

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { StyleSheet } from "react-native";

// Screens
import Home from "../../screens/Customerinterface/Home";
import Account from "../../screens/Customerinterface/Account/Account";
import Guests from "../../screens/Customerinterface/Guest/Guests";
import Neigborhood from "../../screens/Customerinterface/Neigborhood";
import Errand from "../../screens/Customerinterface/Errands/Errand";

// Components
import {
  CustomTabButton,
  Tabcomponent,
} from "../../components/shared/naviagetion";

const Tab = createBottomTabNavigator();

const UserTabNavigation = () => {
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);
  const isGuest = userProfile_data?.user?.isGuest;

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
      {/* For Non-Guests (5 tabs) */}
      {!isGuest && (
        <>
          <Tab.Screen
            name="Guests"
            component={Guests}
            options={{
              tabBarActiveTintColor: "#005091",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Tabcomponent
                  focused={focused}
                  iconFocused={require("../../assets/images/guest2.png")}
                  iconUnfocused={require("../../assets/images/guest.png")}
                  label="Guests"
                  containerStyle={{ alignItems: "center", top: 10 }}
                  texttStyle={{ color: "#000000" }}
                />
              ),
            }}
          />
          <Tab.Screen
            name="Neigborhood"
            component={Neigborhood}
            options={{
              tabBarActiveTintColor: "#005091",
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Tabcomponent
                  focused={focused}
                  iconFocused={require("../../assets/message-text2.png")}
                  iconUnfocused={require("../../assets/message-text.png")}
                  label="Chat"
                  containerStyle={{ alignItems: "center", top: 10 }}
                  texttStyle={{ color: "#000000" }}
                />
              ),
            }}
          />
        </>
      )}

      {/* For Guests (3 tabs) - Errands comes first */}
      {isGuest && (
        <Tab.Screen
          name="errands"
          component={Errand}
          options={{
            tabBarActiveTintColor: "#005091",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Tabcomponent
                focused={focused}
                iconFocused={require("../../assets/fastbike.png")}
                iconUnfocused={require("../../assets/fastbike.png")}
                label="Errands"
                containerStyle={{ alignItems: "center", top: 10 }}
                texttStyle={{ color: "#000000" }}
              />
            ),
          }}
        />
      )}

      {/* Home (Middle Tab) */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
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

      {/* For Non-Guests (5 tabs) - Errands comes after Home */}
      {!isGuest && (
        <Tab.Screen
          name="errands"
          component={Errand}
          options={{
            tabBarActiveTintColor: "#005091",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Tabcomponent
                focused={focused}
                iconFocused={require("../../assets/fastbike.png")}
                iconUnfocused={require("../../assets/fastbike.png")}
                label="Errands"
                containerStyle={{ alignItems: "center", top: 10 }}
                texttStyle={{ color: "#000000" }}
              />
            ),
          }}
        />
      )}

      {/* Account (Always Last) */}
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarActiveTintColor: "#005091",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <Tabcomponent
              focused={focused}
              iconFocused={require("../../assets/images/Account2.png")}
              iconUnfocused={require("../../assets/images/Account.png")}
              label="Account"
              containerStyle={{ alignItems: "center", top: 10 }}
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
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
