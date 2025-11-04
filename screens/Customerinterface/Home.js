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
import WalletScreen from "./Wallet/WalletScreen";

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
      style={{
        // flex: 1,
        backgroundColor: "white",
        marginTop: Platform.OS === "android" ? 25 : 0,
        flex: 1,
      }}
    >
      <WalletScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
});
