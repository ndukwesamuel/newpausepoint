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
        handleBackPress
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
    []
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
  //   const screens = [
  //     {
  //       name: "CreatePrivateEvent",
  //       component: CreatePrivateEvent,
  //       title: "Create Private Event",
  //     },
  //     {
  //       name: "CreateMainEvent",
  //       component: CreateMainEvent,
  //       title: "Create Main Event",
  //     },
  //     {
  //       name: "FundWallet",
  //       component: FundWalletScreen,
  //       title: "FundWallet",
  //     },
  //     {
  //       name: "payment",
  //       component: WalletScreen,
  //       title: "Payment",
  //     },
  //     {
  //       name: "duedetails",
  //       component: DueDetails,
  //       title: "Due Details",
  //     },
  //     {
  //       name: "CreatePublicEvent",
  //       component: CreatePublicEvent,
  //       title: "Create Public Event",
  //     },
  //     {
  //       name: "createforum",
  //       component: CreateForum,
  //       title: "Write Message",
  //     },
  //     {
  //       name: "forumdetail",
  //       component: ForumDetails,
  //       title: "",
  //     },
  //     {
  //       name: "PersonalInfo",
  //       component: ViewProfile,
  //       title: "",
  //     },
  //     {
  //       name: "editPersonalInfo",
  //       component: EditPersonalInformation,
  //       title: "",
  //     },
  //     {
  //       name: "inviteguest",
  //       component: CreateGuests,
  //       title: "Invite Guest",
  //     },
  //     {
  //       name: "guestsdetail",
  //       component: GuestsDetail,
  //       title: " Guest Details",
  //     },
  //     {
  //       name: "eventdetails",
  //       component: EventDetals,
  //       title: " Event Details",
  //     },
  //     {
  //       name: "userpolls",
  //       component: UserPolls,
  //       title: "Estate Polls",
  //     },
  //     {
  //       name: "estatepollsdetail",
  //       component: UserPollDetails,
  //       title: "Estate Polls Details",
  //     },
  //     {
  //       name: "service",
  //       component: ServiceView,
  //       title: "Services",
  //     },
  //     {
  //       name: "Marketplace",
  //       component: MarketPlace,
  //       title: "Market Place",
  //     },
  //     {
  //       name: "amentities",
  //       component: Amenities,
  //       title: "Amenities",
  //     },
  //     {
  //       name: "MarketReview",
  //       component: MarketReview,
  //       title: "Market Review",
  //     },
  //     {
  //       name: "CreateProduct",
  //       component: CreateProduct,
  //       title: "Create Product",
  //     },
  //     {
  //       name: "vendorService",
  //       component: VendorService,
  //       title: "Services",
  //     },
  //     {
  //       name: "review",
  //       component: Review,
  //       title: "Reviews",
  //     },
  //     {
  //       name: "vendorReview",
  //       component: VendorReview,
  //       title: "Reviews",
  //     },
  //     {
  //       title: "ICE Contact",
  //       component: ICEcontact,
  //       name: "icecontact",
  //     },
  //     {
  //       title: "Help Support",
  //       component: HelpSupport,
  //       name: "HelpSupport",
  //     },
  //     {
  //       title: "About Us",
  //       component: AboutUS,
  //       name: "aboutus",
  //     },
  //     {
  //       title: "Domestic Staff",
  //       component: DomesticStaff,
  //       name: "domestic",
  //     },
  //     {
  //       title: "Domestic Staff Details",
  //       component: DomesticDetail,
  //       name: "domesticDetail",
  //     },
  //     {
  //       title: "Domestic Staff",
  //       component: CreateDomesticStaff,
  //       name: "creatdomestic",
  //     },
  //   ];

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

      {/* 
      <Stack.Screen
        options={({ navigation }) => ({
          title: "Events",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
        })}
        name="userevents"
        component={MainEvent}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Coming Soon",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="comming"
        component={Commingsoon}
      />

      {screens.map((screen) =>
        createScreen(screen.name, screen.component, screen.title)
      )}

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Neighbourhood Directory",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="Neigborhood"
        component={Neigborhood}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Chats",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="Chats"
        component={Chats}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "My Communities",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="myclan"
        component={Myclan}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Create Clan",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="createclan"
        component={Createclan}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "All User Clan",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="alluserclan"
        component={UserClans}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Join Clan",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="joinclan"
        component={Joinclan}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Live Support",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="LiveSupport"
        component={LiveSupport}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Complaints and Feedback",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="ComplaintsFeedback"
        component={ComplaintsandFeedback}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "User Policy",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="UserPolicy"
        component={UserPolicy}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "FAQ's",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="FAQ"
        component={FAQ}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Terms and Conditions",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="Terms&Conditions"
        component={TermsConditions}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Privacy Policy",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="PrivacyPolicy"
        component={PrivacyPolicy}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Share this app with friends",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
              style={{
                marginLeft: Platform.OS === "android" ? 16 : 10,
                padding: 8,
              }}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="Share"
        component={Share}
      />

      <Stack.Screen
        name="errands"
        component={Errand}
        options={{ headerShown: false }}
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
        {...SingleScreenWithBackButton(
          "CommentScreen",
          CommentScreen,
          "Comments"
        )}
      /> */}
    </Stack.Navigator>
  );
}
