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
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import profile from "../../assets/profile.png";
// Tab ICons...
import home from "../../assets/home.png";

// Notification

import clan from "../../assets/clan.png";
import bookmark from "../../assets/bookmark.png";
import teamwork from "../../assets/teamwork.png";

import Calendar_light from "../../assets/Calendar_light.png";

import qrcode from "../../assets/qrcode.png";

import amenicon from "../../assets/amenities_8084617.png";

import search from "../../assets/search.png";
import color_swatch from "../../assets/images/info-circle.png";

import calendar from "../../assets/calendar.png";
import guest_icon from "../../assets/user-tag.png";
// import service from "../../assets/customer-support.png";
// import service from "../../assets/user-tag.png";
import service from "../../assets/settings.png";

import market from "../../assets/marketPlace.png";

import emergencies_icon from "../../assets/warning-2.png";

// warning-2
import savepost from "../../assets/bookmark.png";
import logout from "../../assets/logout.png";
// Menu
import menu from "../../assets/menu.png";
import close from "../../assets/close.png";

// Photo
import photo from "../../assets/photo.jpg";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import {
  BoldFontText,
  LightFontText,
  MediumFontText,
  RegularFontText,
  SemiBoldFontText,
} from "../../components/shared/Paragrahp";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Get_Single_clan } from "../../Redux/UserSide/ClanSlice";
import Announcement from "./Announcement/Announcement";

export default function AdminHome() {
  const navigation = useNavigation();
  const [currentTab, setCurrentTab] = useState("Home");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();

  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
  } = useSelector((state) => state?.ClanSlice);
  // Animated Properties...

  useEffect(() => {
    dispatch(Get_Single_clan(userProfile_data?.AdmincurrentClanMeeting));

    return () => {};
  }, []);

  function countUsersByStatus(users, status) {
    return users?.filter((user) => user?.status === status).length;
  }
  const totalUsers = get_Single_clan_data?.data?.members.length;
  const approvedCount = countUsersByStatus(
    get_Single_clan_data?.data?.members,
    "approved"
  );
  const suspendCount = countUsersByStatus(
    get_Single_clan_data?.data?.members,
    "suspended"
  );
  const pendingCount = countUsersByStatus(
    get_Single_clan_data?.data?.members,
    "pending"
  );

  const screenHeight = Dimensions.get("window").height;
  const dpi = 160;
  const screeninchis = screenHeight / dpi;

  // const approvedPercentage = (approvedCount / totalUsers) * 100;
  // const suspendPercentage = (suspendCount / totalUsers) * 100;
  // const pendingPercentage = (pendingCount / totalUsers) * 100;

  const approvedPercentage = parseFloat(
    ((approvedCount / totalUsers) * 100).toFixed(2)
  );
  const suspendPercentage = parseFloat(
    ((suspendCount / totalUsers) * 100).toFixed(2)
  );
  const pendingPercentage = parseFloat(
    ((pendingCount / totalUsers) * 100).toFixed(2)
  );

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  const data = [
    { id: "1", title: "Item 1" },
    { id: "2", title: "Item 2" },
    { id: "3", title: "Item 2" },
    { id: "4", title: "Item 2" },
    { id: "5", title: "Item 2" },
    { id: "6", title: "Item 2" },
    // Add more items as needed
  ];
  return (
    <SafeAreaView
      style={{
        // flex: 1,
        backgroundColor: "white",
        marginTop: Platform.OS === "android" ? 20 : 0,
        flex: 1,
        // backgroundColor: "white",
        // ...style,
      }}
    >
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            justifyContent: "flex-start",
            padding: 15,
          }}
        >
          <Image
            source={{
              uri:
                userProfile_data?.photo ||
                "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
          {/* <RegularFontText
            data=" Lekki County Homes"
            textstyle={{ fontSize: 14, fontWeight: "400" }}
          /> */}

          <View
            style={{
              flexGrow: 1,
              // screeninchis < 5 ? 5 : screeninchis
              // marginTop:  50,
              marginTop: screeninchis >= 5 ? 50 : 0,
            }}
          >
            {
              // Tab Bar Buttons....
            }

            {/* {TabButton(
            currentTab,
            setCurrentTab,
            "Clan",
            emergencies_icon,
            "AdminEmergencies"
          )} */}

            {TabButton(
              currentTab,
              setCurrentTab,
              "My Clans",
              clan,
              "AdminMyclan"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "Emergencies",
              emergencies_icon,
              "AdminEmergencies"
            )}
            {/* {TabButton(
              currentTab,
              setCurrentTab,
              "Calender",
              search,
              "icecontact"
            )} */}
            {TabButton(
              currentTab,
              setCurrentTab,
              "Announcement",
              color_swatch,
              "AdminAnnouncement"
            )}
            {/* {TabButton(currentTab, setCurrentTab, "Complaints", Calendar_light)} */}
            {TabButton(
              currentTab,
              setCurrentTab,
              "Guests",
              guest_icon,
              "AdminGuest"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "Payment",
              calendar,
              "payment"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "Service",
              service,
              "Service"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "MarketPlace",
              market,
              "AdminMarketPlace"
            )}

            {TabButton(currentTab, setCurrentTab, "Qrcode", qrcode, "scanner")}
            {TabButton(
              currentTab,
              setCurrentTab,
              "User Polls",

              bookmark,
              "AdminUserPolls"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "Domestic Staff",
              teamwork,
              "domestic"
            )}

            {TabButton(
              currentTab,
              setCurrentTab,
              "Amenities",
              amenicon,
              "amentities"
            )}
          </View>

          {/* <View>{TabButton(currentTab, setCurrentTab, "LogOut", logout)}</View> */}
        </View>

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
            paddingVertical: 20,
            borderRadius: showMenu ? 15 : 0,
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
                // marginTop: 40,

                // borderWidth: 3,
                // borderColor: "red",
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

              {/* <View style={{ flexDirection: "row", gap: 20 }}>
                <AntDesign name="search1" size={24} color="black" />

                <TouchableOpacity>
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="black"
                  />
                </TouchableOpacity>
              </View> */}
            </View>

            <MediumFontText
              data="Dashboard"
              textstyle={{
                fontSize: 20,
                fontWeight: "500",
                marginVertical: 10,
              }}
            />

            <View style={{}}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 10,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  paddingHorizontal: 5,
                  paddingVertical: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#EEFDF4",
                    padding: 2,
                  }}
                >
                  <Image
                    source={require("../../assets/images/guest2.png")}
                    style={{ width: 30, height: 30 }}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    justifyContent: "space-between",
                    flex: 1,
                    alignItems: "center",
                  }}
                >
                  <View>
                    <MediumFontText data="ACTIVE USERS" />
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <SemiBoldFontText
                        data={approvedCount}
                        textstyle={{ fontSize: 28 }}
                      />
                      <RegularFontText
                        data={`${approvedPercentage}% `}
                        textstyle={{ color: "#04973C" }}
                      />
                    </View>
                  </View>

                  {/* <View>
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#F3FFF3",
                        borderRadius: 10,
                        padding: 7,
                      }}
                    >
                      <MediumFontText
                        data="Details"
                        textstyle={{ fontSize: 10, color: "#04973C" }}
                      />
                      <Image
                        source={require("../../assets/images/shareVector.png")}
                      />
                    </TouchableOpacity>
                  </View> */}
                </View>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  gap: 5,
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    width: "45%",
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#FFF1E7",
                      padding: 2,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/Account3.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <MediumFontText data="Suspended USERS" />
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <SemiBoldFontText
                          data={suspendCount}
                          textstyle={{ fontSize: 28 }}
                        />
                        <RegularFontText
                          data={`${suspendPercentage}% `}
                          textstyle={{ color: "#04973C" }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "black",
                    borderRadius: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    width: "45%",
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#FDF2F3",
                      padding: 2,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/profile-delete.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                      justifyContent: "space-between",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <MediumFontText data="PENDING USERS" />
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <SemiBoldFontText
                          data={pendingCount}
                          textstyle={{ fontSize: 28 }}
                        />
                        <RegularFontText
                          data={`${pendingPercentage}% `}
                          textstyle={{ color: "#F34357" }}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <ScrollView
              style={{
                height: "65%",
              }}
            >
              {/* <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >

                  <MediumFontText
                    data="Announcements  "
                    textstyle={{ fontSize: 18 }}
                  />

                  <TouchableOpacity
                    onPress={() => navigation.navigate("AdminAnnouncement")}
                  >
                    <RegularFontText
                      data="See Alls"
                      textstyle={{
                        fontSize: 12,
                        color: "#04973C",
                        textDecorationLine: "underline",
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View> */}

              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: 10,
                  }}
                >
                  {/* <MediumFontText  */}

                  <MediumFontText
                    data="Announcements"
                    textstyle={{ fontSize: 18 }}
                  />
                  {/* <TouchableOpacity>
                    <RegularFontText
                      data="See All"
                      textstyle={{
                        fontSize: 12,
                        color: "#04973C",
                        textDecorationLine: "underline",
                      }}
                    />
                  </TouchableOpacity> */}
                </View>
                <Announcement />
              </View>
            </ScrollView>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// For multiple Buttons...
const TabButton = (currentTab, setCurrentTab, title, image, link) => {
  const navigation = useNavigation();
  const screenHeight = Dimensions.get("window").height;
  const dpi = 160;
  const screeninchis = screenHeight / dpi;
  return (
    <TouchableOpacity
      onPress={() => {
        if (title == "LogOut") {
          // Do your Stuff...
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
          paddingVertical: screeninchis >= 5 ? 4 : 8,

          // paddingVertical: 4,
          backgroundColor: currentTab == title ? "white" : "transparent",
          paddingLeft: 13,
          paddingRight: 35,
          borderRadius: 8,
          // marginTop: 15,
          marginTop: screeninchis >= 5 ? 15 : 0,
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
    borderWidth: 3,
    borderColor: "red",
  },
});
