import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { StyleSheet, View, Text, Platform } from "react-native";

// Screens
import Home from "../../screens/Customerinterface/Home";
import Account from "../../screens/Customerinterface/Account/Account";
import Guests from "../../screens/Customerinterface/Guest/Guests";
import Neigborhood from "../../screens/Customerinterface/Neigborhood";
import Errand from "../../screens/Customerinterface/Errands/Errand";
import Forum from "../../components/Forum/Forum";

const Tab = createBottomTabNavigator();

// Custom Tab Bar Icon Component
const TabBarIcon = ({ focused, iconName, label }) => {
  return (
    <View style={styles.tabItemContainer}>
      <View
        style={[styles.iconContainer, focused && styles.iconContainerActive]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={focused ? 26 : 24}
          color={focused ? "#10B981" : "#6B7280"}
        />
      </View>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
};

// Custom Home Tab Icon (Center, Special)
const HomeTabIcon = ({ focused }) => {
  return (
    <View style={styles.homeTabContainer}>
      <View style={styles.homeIconWrapper}>
        <MaterialCommunityIcons name="home" size={28} color="#FFFFFF" />
      </View>
    </View>
  );
};

const UserTabNavigation = () => {
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);
  const { userDatav2 } = useSelector((state) => state?.authSlice); // Get user_data from AuthSlice

  const MemberOfEstate = userDatav2?.data?.isInClan;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
        headerShown: false,
      }}
    >
      {/* For Non-Guests - Left Side Tabs */}
      {MemberOfEstate ? (
        <>
          {/* Guests Tab */}
          <Tab.Screen
            name="Guests"
            component={Guests}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon
                  focused={focused}
                  iconName="account-group"
                  label="Guests"
                />
              ),
            }}
          />

          {/* Forum Tab */}
          <Tab.Screen
            name="Forum"
            component={Forum}
            options={{
              tabBarIcon: ({ focused }) => (
                <TabBarIcon focused={focused} iconName="forum" label="Forum" />
              ),
            }}
          />
        </>
      ) : (
        /* For Guests - Errands on Left */
        <Tab.Screen
          name="ErrandsLeft"
          component={Errand}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                iconName="bike-fast"
                label="Errands"
              />
            ),
          }}
        />
      )}

      {/* Home Tab (Center - Always Present) */}
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => <HomeTabIcon focused={focused} />,
        }}
      />

      {/* Right Side Tabs */}
      {MemberOfEstate && (
        /* Errands for Non-Guests */
        <Tab.Screen
          name="Errands"
          component={Errand}
          options={{
            tabBarIcon: ({ focused }) => (
              <TabBarIcon
                focused={focused}
                iconName="bike-fast"
                label="Errands"
              />
            ),
          }}
        />
      )}

      {/* Account Tab (Always Present) */}
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabBarIcon
              focused={focused}
              iconName="account-circle"
              label="Account"
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default UserTabNavigation;

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    height: 70,
    paddingBottom: 8,
    paddingTop: 8,
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    borderTopWidth: 0,
  },
  tabItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    paddingVertical: 4,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  iconContainerActive: {
    backgroundColor: "#D1FAE5",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  tabLabelActive: {
    fontSize: 11,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  homeTabContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20,
  },
  homeIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
