import { StatusBar } from "expo-status-bar";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Platform,
  ScrollView,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import clan from "../../assets/clan.png";

import bookmark from "../../assets/bookmark.png";
import Calendar_light from "../../assets/Calendar_light.png";
import Contact from "../../assets/Desk_light.png";
import teamwork from "../../assets/teamwork.png";
import amenicon from "../../assets/amenities_8084617.png";

import qrcode from "../../assets/qrcode.png";
import service from "../../assets/settings.png";
import market from "../../assets/mdi_marketplace-outline.png";
import aboutusicon from "../../assets/Info_alt_light.png";
import bikeIcon from "../../assets/fastbike.png";
import emergencyIcon from "../../assets/images/emergency.png";
import search from "../../assets/search.png";
import color_swatch from "../../assets/color-swatch.png";

import notifications from "../../assets/bell.png";
import settings from "../../assets/settings.png";
import homes from "../../assets/homes.png";
// Menu
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

// Photo
import photo from "../../assets/photo.jpg";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../components/shared/Paragrahp";
import Events from "./Events/Events";
import Forum from "../../components/Forum/Forum";
import { useNavigation } from "@react-navigation/native";
import { UserProfile_data_Fun } from "../../Redux/ProfileSlice";
import { Feather } from "@expo/vector-icons";
import { LogoutModal } from "../../components/Account/Logout";
import Forum_Market from "../../components/shared/Forum_Market";

export default function App({ navigation }) {
  // const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("Home");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  // Animated Properties...
  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  console.log({
    xxx: user_data?.user?.isGuest,
  });

  // Animated Properties...
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);
  let user_clan_info = userProfile_data?.currentClanMeeting;

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(UserProfile_data_Fun());

    return () => {};
  }, [dispatch]);

  const isGuest = user_data?.user?.isGuest;

  return (
    <SafeAreaView
      // style={styles.container}

      style={{
        // flex: 1,
        backgroundColor: "white",
        marginTop: Platform.OS === "android" ? 25 : 0,
        flex: 1,
        // backgroundColor: "white",
        // ...style,
      }}
    >
      <StatusBar style="dark" backgroundColor="black" />

      <ScrollView>
        <View style={{ justifyContent: "flex-start", padding: 15 }}>
          <Image
            source={{
              uri: userProfile_data?.photo,
            }}
            style={{ width: 68, height: 68, borderRadius: 50 }}
          />

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              // color: "white",
              marginTop: 20,
            }}
          >
            {userProfile_data?.user?.name}
          </Text>
          <RegularFontText
            data={userProfile_data?.currentClanMeeting?.name}
            textstyle={{ fontSize: 14, fontWeight: "400" }}
          />

          <View>
            <ScrollView style={{ flexGrow: 1, marginTop: 5 }}>
              {/* Conditionally render TabButton based on isGuest */}
              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="My Clans"
                image={clan}
                link="myclan"
                user_clan_info={user_clan_info}
                condition={true} // Only show if not a guest
              />

              {/* <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Errands"
                image={bikeIcon}
                link="errands"
                user_clan_info={user_clan_info}
                condition={true} // Always show Errands
              /> */}

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Emergency"
                image={emergencyIcon}
                link="Emergencyscreen"
                user_clan_info={user_clan_info}
                condition={!isGuest} // Always show Errands
              />
              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Polls/Surveys"
                image={color_swatch}
                link="userpolls"
                user_clan_info={user_clan_info}
                condition={!isGuest} // Only show if not a guest
              />

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Wallet"
                image={Calendar_light}
                link="payment"
                user_clan_info={user_clan_info}
                condition={true} // Only show if not a guest
              />

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Service"
                image={service}
                link="service"
                user_clan_info={user_clan_info}
                condition={true} // Always show Service
              />

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Marketplace"
                image={market}
                link="Marketplace"
                user_clan_info={user_clan_info}
                condition={true} // Always show Marketplace
              />

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="ICE Contacts"
                image={Contact}
                link="icecontact"
                user_clan_info={user_clan_info}
                condition={!isGuest} // Only show if not a guest
              />

              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Domestic Staff"
                image={teamwork}
                link="domestic"
                user_clan_info={user_clan_info}
                condition={!isGuest} // Only show if not a guest
              />
              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Amenities"
                image={amenicon}
                link="amentities"
                user_clan_info={user_clan_info}
                condition={!isGuest} // Always show Amenities
              />
            </ScrollView>

            <View
              style={{ borderWidth: 1, borderColor: "black", borderRadius: 10 }}
            />

            <View style={{ flexGrow: 1 }}>
              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="Help/Support"
                image={clan}
                link="HelpSupport"
                user_clan_info={user_clan_info}
                condition={true} // Always show Help/Support
              />
              <TabButton
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
                title="About Us"
                image={aboutusicon}
                link="aboutus"
                user_clan_info={user_clan_info}
                condition={true} // Always show About Us
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {
        // Over lay View...
      }

      <Animated.View
        style={{
          flexGrow: 1,
          backgroundColor: "white",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 15,
          paddingBottom: 20,
          // paddingVertical: 20,
          borderRadius: showMenu ? 15 : 0,
          // borderWidth: 1,
          // borderColor: "black",
          // borderRadius: 50,
          // Transforming View...
          transform: [{ scale: scaleValue }, { translateX: offsetValue }],
        }}
      >
        {
          // Menu Button...
        }

        <Animated.View
          style={{
            transform: [
              {
                translateY: closeButtonOffset,
              },
            ],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 30,

              // marginTop: 40,
              // ...(Platform.OS === "android" && { marginTop: 50 }),
            }}
          >
            <TouchableOpacity
              onPress={() => {
                // Do Actions Here....
                // Scaling the view...
                Animated.timing(scaleValue, {
                  toValue: showMenu ? 1 : 0.88,
                  duration: 300,
                  useNativeDriver: true,
                }).start();

                Animated.timing(offsetValue, {
                  // YOur Random Value...
                  toValue: showMenu ? 0 : 230,
                  duration: 300,
                  useNativeDriver: true,
                }).start();

                Animated.timing(closeButtonOffset, {
                  // YOur Random Value...
                  toValue: !showMenu ? -30 : 0,
                  duration: 300,
                  useNativeDriver: true,
                }).start();

                setShowMenu(!showMenu);
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 20,
              }}
            >
              <Image
                source={showMenu ? close : menu}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: "black",
                }}
              ></Image>
            </TouchableOpacity>
          </View>

          <Forum_Market />
        </Animated.View>
      </Animated.View>
    </SafeAreaView>
  );
}

// For multiple Buttons...
const TabButton = ({
  currentTab,
  setCurrentTab,
  title,
  image,
  link,
  user_clan_info,
  condition = true, // Default to true if no condition is provided
}) => {
  const navigation = useNavigation();

  // If the condition is false, return null to not render the component
  if (!condition) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => {
        if (title == "LogOut") {
          // Do your Stuff...
          console.log("LogOut");
        }
        if (
          user_clan_info === null &&
          link !== "HelpSupport" &&
          link !== "aboutus" &&
          link !== "errands" &&
          link !== "Marketplace" &&
          link !== "service" &&
          link !== "amentities"
        ) {
          navigation.navigate("myclan");
          return null;
        } else {
          setCurrentTab(title);
          navigation.navigate(link);
        }
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 4,
          backgroundColor: currentTab == title ? "white" : "transparent",
          paddingLeft: 13,
          paddingRight: 35,
          borderRadius: 8,
          marginTop: 15,
        }}
      >
        <Image
          source={image}
          style={{
            width: 25,
            height: 25,
            tintColor: currentTab == title ? "#5359D1" : "black",
          }}
        ></Image>

        <Text
          style={{
            fontSize: 15,
            fontWeight: "bold",
            paddingLeft: 15,
            textAlign: "justify",
            color: currentTab == title ? "#5359D1" : "black",
          }}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
