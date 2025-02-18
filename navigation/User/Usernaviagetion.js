import React from "react";
import { TouchableOpacity } from "react-native";

import UserTabNavigation from "./UserTabNavigation";
import Neigborhood from "../../screens/Customerinterface/Neigborhood";
import { AntDesign } from "@expo/vector-icons";
import Chats from "../../screens/Customerinterface/Chats";
import Myclan from "../../screens/Customerinterface/Clan/Myclan";
import Createclan from "../../screens/Customerinterface/Clan/Createclan.js";
import Joinclan from "../../screens/Customerinterface/Clan/Joinclan";
import ICEcontact from "../../screens/Customerinterface/ICEcontact";
import HelpSupport from "../../screens/Customerinterface/Help/HelpSupport";
import LiveSupport from "../../screens/Customerinterface/Help/LiveSupport";
import ComplaintsandFeedback from "../../screens/Customerinterface/Help/ComplaintsandFeedback";
import UserPolicy from "../../screens/Customerinterface/Help/UserPolicy";
import FAQ from "../../screens/Customerinterface/Help/FAQ";
import TermsConditions from "../../screens/Customerinterface/Help/TermsConditions";
import PrivacyPolicy from "../../screens/Customerinterface/Help/PrivacyPolicy";
import Share from "../../screens/Customerinterface/Help/Share";
import CommentScreen from "../../screens/SharedScreen/CommentScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreatePrivateEvent from "../../screens/Customerinterface/Events/CreateMainEvent";
import CreatePublicEvent from "../../screens/Customerinterface/Events/CreatePublicEvent";
import Commingsoon from "../../screens/SharedScreen/Commingsoon";
import UserClans from "../../screens/Customerinterface/Clan/UserClans";
import CreateForum from "../../screens/Customerinterface/Forum/CreateForum";
import ForumDetails from "../../screens/Customerinterface/Forum/ForumDetails";
import EditPersonalInformation from "../../screens/Customerinterface/Account/EditPersonalInformation";
import CreateGuests from "../../screens/Customerinterface/Guest/CreateGuests";
import GuestsDetail from "../../screens/Customerinterface/Guest/GuestsDetail";
import UserPolls from "../../screens/Customerinterface/Poll/UserPolls";
import UserPollDetails from "../../screens/Customerinterface/Poll/UserPollDetails";
import ServiceView from "../../screens/Customerinterface/ServiceView";
import VendorService from "../../screens/Customerinterface/VendorService";
import AboutUS from "../../screens/Customerinterface/About.tsx";
import ViewProfile from "../../screens/Customerinterface/Account/ViewProfile";
import Review from "../../screens/Customerinterface/Review";
import VendorReview from "../../screens/Customerinterface/VendorReview";
import MainEvent from "../../screens/Customerinterface/Events/MainEvent";
import CreateMainEvent from "../../screens/Customerinterface/Events/CreateMainEvent";
import EventDetals from "../../screens/Customerinterface/Events/EventDetals";
import Service from "../../screens/Customerinterface/Service/Service";
import MarketPlace from "../../screens/Customerinterface/MarketPlace/Marketplace";
import MarketReview from "../../screens/Customerinterface/MarketPlace/MarketReview";
import CreateProduct from "../../screens/Customerinterface/MarketPlace/CreateProduct";
import DomesticStaff from "../../screens/Customerinterface/DomesticStaff/DomesticStaff";
import CreateDomesticStaff from "../../screens/Customerinterface/DomesticStaff/CreateDomesticStaff";
import DomesticDetail from "../../screens/Customerinterface/DomesticStaff/DomesticDetail";
import Amenities from "../../screens/Customerinterface/Amentities/Amenities";
const Stack = createNativeStackNavigator();

const SingleScreenWithBackButton = (screenName, component, title) => {
  return {
    name: screenName,
    component: component,
    options: ({ navigation }) => ({
      title: title,
      headerStyle: {
        backgroundColor: "white",
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

const createScreen = (name, component, title) => {
  return (
    <Stack.Screen
      key={name}
      {...SingleScreenWithBackButton(name, component, title)}
    />
  );
};
export const Usernaviagetion = () => {
  const screens = [
    {
      name: "CreatePrivateEvent",
      component: CreatePrivateEvent,
      title: "Create Private Event",
    },

    {
      name: "CreateMainEvent",
      component: CreateMainEvent,
      title: "Create Main Event",
    },

    {
      name: "CreatePublicEvent",
      component: CreatePublicEvent,
      title: "Create Public Event",
    },

    {
      name: "createforum",
      component: CreateForum,
      title: "Write Message",
    },

    {
      name: "forumdetail",
      component: ForumDetails,
      title: "",
    },

    {
      name: "PersonalInfo",
      // component: EditPersonalInformation,
      component: ViewProfile,
      title: "",
    },

    {
      name: "editPersonalInfo",
      component: EditPersonalInformation,
      title: "",
    },

    {
      name: "inviteguest",
      component: CreateGuests,
      title: "Invite Guest",
    },

    {
      name: "guestsdetail",
      component: GuestsDetail,
      title: " Guest Details",
    },

    {
      name: "eventdetails",
      component: EventDetals,
      title: " Event Details",
    },

    {
      name: "userpolls",
      component: UserPolls,
      title: "Estate Polls",
    },

    {
      name: "estatepollsdetail",
      component: UserPollDetails,
      title: "Estate Polls Details",
    },

    {
      name: "service",
      component: ServiceView,
      title: "Services",
    },
    {
      name: "Marketplace",
      component: MarketPlace,
      title: "Market Place",
    },

    {
      name: "amentities",
      component: Amenities,
      title: "Amenities",
    },

    {
      name: "MarketReview",
      component: MarketReview,
      title: "Market Review",
    },

    {
      name: "CreateProduct",
      component: CreateProduct,
      title: "Create Product",
    },

    {
      name: "vendorService",
      component: VendorService,
      title: "Services",
    },
    {
      name: "review",
      component: Review,
      title: "Reviews",
    },
    {
      name: "vendorReview",
      component: VendorReview,
      title: "Reviews",
    },

    {
      title: "ICE Contact",
      component: ICEcontact,
      name: "icecontact",
    },

    {
      title: "Help Support",
      component: HelpSupport,
      name: "HelpSupport",
    },

    {
      title: "About Us",
      component: AboutUS,
      name: "aboutus",
    },

    {
      title: "Domestic Staff",
      component: DomesticStaff,
      name: "domestic",
    },

    {
      title: "Domestic Staff Details",
      component: DomesticDetail,
      name: "domesticDetail",
    },

    {
      title: "Domestic Staff",
      component: CreateDomesticStaff,
      name: "creatdomestic",
    },

    // Add more screens as needed
  ];
  return (
    <Stack.Navigator initialRouteName="UserTabNavigation">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="UserTabNavigation"
        component={UserTabNavigation}
      />

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Events",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            // <Button
            //     onPress={() => navigation.navigate('Home')}
            //     title="Back"
            // />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
          title: "Comming Soon",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            // <Button
            //     onPress={() => navigation.navigate('Home')}
            //     title="Back"
            // />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="comming"
        component={Commingsoon}
      />

      {/* <Stack.Screen
        options={({ navigation }) => ({
          title: "Create Private Event ",
          headerStyle: {
            backgroundColor: "white",
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
        })}
        name="CreatePrivateEvent"
        component={CreatePrivateEvent}
      /> */}

      {screens.map((screen) =>
        createScreen(screen.name, screen.component, screen.title)
      )}
      {/* 
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="eventdetails"
        component={EventDetals}
      /> */}

      <Stack.Screen
        options={({ navigation }) => ({
          title: "Neigborhood Directory",
          headerStyle: {
            backgroundColor: "white",
          },
          headerLeft: () => (
            // <Button
            //     onPress={() => navigation.navigate('Home')}
            //     title="Back"
            // />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
          title: "Myclan",
          headerStyle: {
            backgroundColor: "white",
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
          title: "FAQ’s",
          headerStyle: {
            backgroundColor: "white",
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
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
              onPress={() => navigation.goBack()}
              style={{
                marginLeft: 10,
              }}
            >
              <AntDesign name="arrowleft" size={24} color="black" />
            </TouchableOpacity>
          ),
        })}
        name="Share"
        component={Share}
      />

      <Stack.Screen
        {...SingleScreenWithBackButton(
          "CommentScreen",
          CommentScreen,
          "csdsdkjsdkj "
        )}
      />

      {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
    </Stack.Navigator>
  );
};
