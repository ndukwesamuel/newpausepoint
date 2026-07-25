import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/MaterialIcons";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
{
  /* <FontAwesome5 name="superpowers" size={24} color="black" /> */
}
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import SafeHavenCard from "./safehaven/SafeHavenCard";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import DueNotificationChecker from "./DueNotificationChecker";

const WalletScreen = ({}) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData_v2("api/v1/wallet", "wallet");

  let mainBalance = data?.balance;

  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice,
  );

  const { userDatav2 } = useSelector((state) => state.authSlice);



  const clanMembers = get_user_profile_data?.data?.currentClanMeeting?.members



const currentMember = clanMembers?.find(
  (member) => member.user?.toString() === userDatav2?.data?.user?.id?.toString()
);

const isApproved = currentMember?.status === "approved";




  const isGuest = false; //  user_data?.user?.isGuest;

  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  const quickLinks = [
    {
      id: 1,
      name: "My Clans",
      icon: "people-outline",
      iconSet: Ionicons,
      color: "#2196F3",
      type: "clans",
      route: "myclan",
      params: {},
      condition: true //userDatav2?.data?.isInClan,
    },
       {
      id: 3,
      name: "Dues",
      icon: "superpowers",
      iconSet: FontAwesome5,
      color: "#009688",
      type: "amenities",
      route: "Due",
      params: {},
      condition: isApproved//userDatav2?.data?.isInClan,
    },
        {
      id: 6,
      name: "Artisan",
      icon: "room-service",
      iconSet: MaterialIcons,
      color: "#FF9800",
      type: "service",
      route: "service",
      params: {},
      condition: true,
    },
    {
      id: 7,
      name: "Marketplace",
      icon: "store",
      iconSet: MaterialIcons,
      color: "#00BCD4",
      type: "marketplace",
      route: "Marketplace",
      params: {},
      condition: true,
    },
     {
      id: 11,
      name: "Access card",
      icon: "card",
      iconSet: Ionicons,
      color: "#2196F3",
      type: "clans",
      route: "UserCard",
      params: {},
      condition: isApproved //userDatav2?.data?.isInClan,
    },
    {
      id: 2,
      name: "Amenities",
      icon: "apartment",
      iconSet: MaterialIcons,
      color: "#009688",
      type: "amenities",
      route: "amentities",
      params: {},
      condition: isApproved//userDatav2?.data?.isInClan,
    },
 

    {
      id: 4,
      name: "Emergency",
      icon: "emergency",
      iconSet: MaterialIcons,
      color: "#F44336",
      type: "emergency",
      route: "Emergencyscreen",
      params: {},
      condition: isApproved//userDatav2?.data?.isInClan,
    },
    {
      id: 5,
      name: "Polls/Surveys",
      icon: "poll",
      iconSet: MaterialIcons,
      color: "#9C27B0",
      type: "polls",
      route: "userpolls",
      params: {},
      condition: isApproved//userDatav2?.data?.isInClan,
    },

    {
      id: 8,
      name: "ICE Contacts",
      icon: "contact-phone",
      iconSet: MaterialIcons,
      color: "#E91E63",
      type: "ice",
      route: "icecontact",
      params: {},
      condition: true,
    },
    {
      id: 9,
      name: "Domestic Staff",
      icon: "people",
      iconSet: MaterialIcons,
      color: "#3F51B5",
      type: "domestic",
      route: "domestic",
      params: {},
      condition: isApproved//userDatav2?.data?.isInClan,
    },

    // {
    //   id: 10,
    //   name: "General Dues",
    //   icon: "superpowers",
    //   iconSet: FontAwesome5,
    //   color: "#009688",
    //   type: "amenities",
    //   route: "GeneralDuesUser",
    //   params: {},
    //   condition: userDatav2?.data?.isInClan,
    // },
  ];

  const visibleQuickLinks = quickLinks.filter((link) => link.condition);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchWallet();
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleReloadWallet = async () => {
    try {
      const { data } = await refetchWallet();
      if (data) {
        Alert.alert("Success", "Wallet balance updated!");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to refresh wallet. Please try again.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.container}>
        {/* ================================
            WALLET BALANCE CARD 
        ================================ */}
        <View
          style={{
            backgroundColor: "#10B981",
            borderRadius: 20,
            padding: 24,
            shadowColor: "#10B981",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
            overflow: "hidden",
          }}
        >
          {/* Decorative circles */}
          <View
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              borderRadius: 60,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: -20,
              left: -20,
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: "rgba(255, 255, 255, 0.08)",
            }}
          />

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialCommunityIcons
                name="wallet"
                size={20}
                color="rgba(255, 255, 255, 0.9)"
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  fontSize: 13,
                  fontWeight: "500",
                  letterSpacing: 0.5,
                }}
              >
                Available Balance
              </Text>
              <TouchableOpacity
                onPress={handleReloadWallet}
                disabled={isLoading}
                style={{
                  marginLeft: 12,
                  padding: 6,
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderRadius: 8,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="reload"
                    size={18}
                    color="#FFFFFF"
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  color: "#FFFFFF",
                  fontSize: 32,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }}
              >
                ₦{mainBalance?.toFixed(2) ?? "0.00"}
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Tap reload to refresh
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 25,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              onPress={() => navigation.navigate("FundWallet")}
            >
              <MaterialCommunityIcons
                name="plus"
                size={18}
                color="#10B981"
                style={{ marginRight: 6 }}
              />
              <Text
                style={{
                  color: "#10B981",
                  fontWeight: "700",
                  fontSize: 14,
                  letterSpacing: 0.3,
                }}
              >
                Add Money
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================
            👇 ADD VIRTUAL ACCOUNT CARD HERE
        ================================ */}
        <SafeHavenCard />

        {/* ================================
            BILLS PAYMENT SECTION
        ================================ */}
        <View
          style={{
            marginTop: 24,
            marginBottom: 20,
            backgroundColor: "#FFFFFF",
            padding: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons
              name="flash"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1F2937",
                letterSpacing: 0.3,
              }}
            >
              Bills Payment
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {/* Electricity */}

            <TouchableOpacity
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={() =>
                navigation.navigate("UtilityPayment", {
                  billType: "electricty",
                })
              }
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#FEF3C7",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Icon name="electric-bolt" size={28} color="#F59E0B" />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#374151",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Electricity
              </Text>
            </TouchableOpacity>

            {/* Airtime */}
            <TouchableOpacity
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={() =>
                navigation.navigate("Airtime", {
                  data: {
                    _id: "61efaba1da92348f9dde5f6c",
                    name: "Mobile Recharge",
                    identifier: "AIRTIME",
                    description: "Airtime Recharge",
                    createdAt: "2022-01-25T07:49:53.181Z",
                    updatedAt: "2022-01-25T07:49:53.181Z",
                    __v: 0,
                  },
                })
              }
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#E0E7FF",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >

                <MaterialIcons name="call" size={24} color="black" />
                {/* <MaterialCommunityIcons name="aliyun" size={26} color="#6366F1" /> */}
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#374151",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Airtime
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={() =>
                navigation.navigate("DataPurchase", {
                  data: {
                    _id: "61efabb2da92348f9dde5f6e",
                    name: "DATA PURCHASE",
                    identifier: "DATA",
                    description: "Data bundle subscription",

                    __v: 0,
                  },
                })
              }
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#E0E7FF",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialIcons
                  name="signal-wifi-statusbar-connected-no-internet-4"
                  size={24}
                  color="black"
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#374151",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Data
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================
            QUICK LINKS SECTION
        ================================ */}
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            backgroundColor: "#FFFFFF",
            padding: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <MaterialCommunityIcons
              name="link-variant"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "700",
                color: "#1F2937",
                letterSpacing: 0.3,
              }}
            >
              Quick Links
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {visibleQuickLinks.map((link) => {
              const IconComponent = link.iconSet;
              return (
                <TouchableOpacity
                  key={link.id}
                  style={{
                    width: "25%",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                  onPress={() => navigation.navigate(link.route, link.params)}
                >
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      backgroundColor: `${link.color}15`,
                      borderRadius: 16,
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <IconComponent
                      name={link.icon}
                      size={24}
                      color={link.color}
                    />
                  </View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#374151",
                      textAlign: "center",
                      fontWeight: "500",
                      lineHeight: 14,
                    }}
                  >
                    {link.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default WalletScreen;
