import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Modal,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFetchData, useMutateData } from "../../../hooks/Request";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
  Entypo,
  AntDesign,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useSelector } from "react-redux";

// ... inside your component

const WalletScreen = ({}) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData("wallet", "wallet");

  const [isVirtualAccountExpanded, setIsVirtualAccountExpanded] =
    useState(false);
  const {
    data: virtualAccountData,
    isLoading: isLoadingVirtualAccount,
    error: virtualAccountError,
    refetch: refetchVirtualAccount,
  } = useFetchData("api/v3/bank/singleUser", "virtual-account");

  const { userProfile_data } = useSelector((state) => state?.ProfileSlice); // Get user_data from AuthSlice

  const { user_data } = useSelector((state) => state.AuthSlice); // Get user_data from AuthSlice

  const clanIDf = userProfile_data?.currentClanMeeting?.uniqueClanID;
  const clanID = userProfile_data?.currentClanMeeting?._id;

  const isGuest = user_data?.user?.isGuest;
  const animation = useRef(null);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [showUtilitiesModal, setShowUtilitiesModal] = useState(false);

  const utilities = [
    {
      id: 1,
      name: "Electricity",
      icon: "flash",
      iconSet: MaterialCommunityIcons,
      color: "#f39c12",
      type: "electricity",
      // enable only if clanID matches
      enabled: clanID === "6807bbbf6152e3e0bb049580",
    },
    {
      id: 2,
      name: "Airtime",
      icon: "network",
      iconSet: Entypo,
      color: "#3498db",
      type: "airtime",
      enabled: false,
    },
    {
      id: 3,
      name: "Internet",
      icon: "wifi",
      iconSet: Ionicons,
      color: "#9b59b6",
      type: "internet",
      enabled: false,
    },
    {
      id: 4,
      name: "Cable TV",
      icon: "tv",
      iconSet: Ionicons,
      color: "#e74c3c",
      type: "cable",
      enabled: false,
    },
    {
      id: 5,
      name: "Gas",
      icon: "fire",
      iconSet: FontAwesome5,
      color: "#e67e22",
      type: "gas",
      enabled: false,
    },
    {
      id: 6,
      name: "Waste",
      icon: "delete",
      iconSet: MaterialIcons,
      color: "#2ecc71",
      type: "waste",
      enabled: false,
    },
  ];

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
      condition: true, // Always show
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
      condition: !isGuest,
    },
    {
      id: 3,
      name: "Emergency",
      icon: "emergency",
      iconSet: MaterialIcons,
      color: "#F44336",
      type: "emergency",
      route: "Emergencyscreen",
      params: {},
      condition: !isGuest,
    },
    {
      id: 4,
      name: "Polls/Surveys",
      icon: "poll",
      iconSet: MaterialIcons,
      color: "#9C27B0",
      type: "polls",
      route: "userpolls",
      params: {},
      condition: !isGuest,
    },
    {
      id: 5,
      name: "Service",
      icon: "room-service",
      iconSet: MaterialIcons,
      color: "#FF9800",
      type: "service",
      route: "service",
      params: {},
      condition: true,
    },
    {
      id: 6,
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
      id: 7,
      name: "ICE Contacts",
      icon: "contact-phone",
      iconSet: MaterialIcons,
      color: "#E91E63",
      type: "ice",
      route: "icecontact",
      params: {},
      condition: !isGuest,
    },
    {
      id: 8,
      name: "Domestic Staff",
      icon: "people",
      iconSet: MaterialIcons,
      color: "#3F51B5",
      type: "domestic",
      route: "domestic",
      params: {},
      condition: !isGuest,
    },
  ];

  // Filter the quick links based on conditions
  const visibleQuickLinks = quickLinks.filter((link) => link.condition);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchWallet();
      await refetchDues();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleUtilitySelect = (type) => {
    setShowUtilitiesModal(false);

    navigation.navigate("UtilityPayment", { billType: type });
  };

  const handleCopyToClipboard = async (text, label) => {
    try {
      console.log({
        dc: text,
        label,
      });

      await Clipboard.setStringAsync(text);
      // You can show an alert or toast notification here
      Alert.alert("Copied!", `${text} copied to clipboard`);

      // Alternatively, if you have a toast library:
      // Toast.show(`${label} copied to clipboard!`, { type: 'success' });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      Alert.alert("Error", "Failed to copy to clipboard");
    }
  };

  const UpdateText_Mutation = useMutateData(
    "api/v3/bank/create-virtual-account",
    "POST",
    "virtual-account"
  );

  const {
    mutate: paybillsmeter,
    isLoading: paybillsmeterispending,
    error: errorpaybillsmeter,
  } = useMutateData(
    "api/v3/bank/create-virtual-account",
    "POST",
    "virtual-account"
  );

  const [isLoading_fact, setIsLoading_fact] = useState(false);

  const handleCreateVirtualAccount = async () => {
    const payload = {
      userId: user_data?.user.id,
    };

    setIsLoading_fact(true);

    try {
      const response = await fetch(
        "https://communist-carla-pausepoint-fb082012.koyeb.app/api/v1/user/bankpi",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Authorization: `Bearer ${token}`, // Add if needed
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Request failed");
      }

      // Success
      console.log("Success:", data);
      Alert.alert("Success", "Your virtual account has been created!");
      refetchVirtualAccount();
    } catch (error) {
      // Error
      console.log("Error:", error);
      Alert.alert("Account Creation Failed", error.message);
      setIsLoading_fact(false);
    } finally {
      setIsLoading_fact(false);
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
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        {/* MODERNIZED WALLET CARD */}
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
          {/* Decorative circles for depth */}
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
              {/* Add Reload Button */}
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
                ₦{data?.balance?.toFixed(2) || "0.00"}
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

        {/* Bills Payment - Modernized */}
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

            {/* Esusu */}
            <TouchableOpacity
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={() => navigation.navigate("EsusuLandingScreen")}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  backgroundColor: "#DBEAFE",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <MaterialIcons name="savings" size={26} color="#3B82F6" />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: "#374151",
                  textAlign: "center",
                  fontWeight: "500",
                }}
              >
                Esusu
              </Text>
            </TouchableOpacity>

            {/* Airtime */}
            <TouchableOpacity
              style={{
                width: "30%",
                alignItems: "center",
                marginBottom: 16,
              }}
              onPress={() => navigation.navigate("Airtime")}
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
                <AntDesign name="aliyun" size={26} color="#6366F1" />
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
          </View>
        </View>

        {/*
           

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#F0F0F0",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>⚽</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Betting
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#00D09E",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>📺</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                TV
              </Text>
            </TouchableOpacity> */}

        {/* Row 2 */}
        {/* <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#00D09E",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>💼</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Safebox
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#00D09E",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>💵</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Loan
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#00D09E",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>💚</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Play4aChild
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: "#00D09E",
                  borderRadius: 15,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 24 }}>⋯</Text>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                More
              </Text>
            </TouchableOpacity> */}
        {/* </View>
        </View> */}

        {/* Quick Links - Modernized */}
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
                    width: "23%",
                    alignItems: "center",
                    marginBottom: 20,
                  }}
                  onPress={() => navigation.navigate(link.route, link.params)}
                >
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      backgroundColor: `${link.color}15`, // 15% opacity
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

        {/* Modernized Utilities Modal */}
        <Modal
          visible={showUtilitiesModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUtilitiesModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 24,
                  paddingBottom: 16,
                  borderBottomWidth: 1,
                  borderBottomColor: "#F3F4F6",
                }}
              >
                <Text style={styles.modalTitle}>Select Utility Bill</Text>
                <TouchableOpacity
                  onPress={() => setShowUtilitiesModal(false)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: "#F3F4F6",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  paddingBottom: 20,
                }}
              >
                {utilities.map((utility) => (
                  <TouchableOpacity
                    key={utility.id}
                    style={{
                      width: "48%",
                      backgroundColor: utility.enabled ? "#FFFFFF" : "#F9FAFB",
                      borderRadius: 16,
                      padding: 20,
                      marginBottom: 16,
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: utility.enabled ? utility.color : "#E5E7EB",
                      opacity: utility.enabled ? 1 : 0.6,
                      shadowColor: utility.enabled ? utility.color : "#000",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: utility.enabled ? 0.15 : 0,
                      shadowRadius: 8,
                      elevation: utility.enabled ? 4 : 0,
                    }}
                    disabled={!utility.enabled}
                    onPress={() =>
                      utility.enabled && handleUtilitySelect(utility.type)
                    }
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: utility.enabled
                          ? `${utility.color}15`
                          : "#F3F4F6",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 12,
                      }}
                    >
                      <utility.iconSet
                        name={utility.icon}
                        size={32}
                        color={utility.enabled ? utility.color : "#9CA3AF"}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "600",
                        color: utility.enabled ? "#1F2937" : "#9CA3AF",
                        textAlign: "center",
                        marginBottom: 4,
                      }}
                    >
                      {utility.name}
                    </Text>
                    {!utility.enabled && (
                      <View
                        style={{
                          backgroundColor: "#FEF3C7",
                          paddingHorizontal: 12,
                          paddingVertical: 4,
                          borderRadius: 12,
                          marginTop: 4,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 11,
                            color: "#F59E0B",
                            fontWeight: "600",
                          }}
                        >
                          Coming Soon
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const DueItem = ({ item, navigation }) => (
  <TouchableOpacity
    onPress={() => navigation.navigate("duedetails", { data: item })}
    style={styles.dueItem}
  >
    <View style={styles.dueItemContent}>
      <Icon name="receipt" size={24} color="#2196F3" />
      <View style={styles.dueDetails}>
        <Text style={styles.dueTitle}>{item?.serviceName}</Text>
        <Text style={styles.dueDescription}>{item?.serviceDetails}</Text>
        <Text style={styles.dueAmount}>₦{item?.amount.toLocaleString()}</Text>
        <View style={styles.dueStatusContainer}>
          <Text
            style={[
              styles.dueStatus,
              item?.membersToPay[0]?.status === "paid"
                ? styles.paidStatus
                : styles.pendingStatus,
            ]}
          >
            {item?.membersToPay[0]?.status.toUpperCase()}
          </Text>
          <DueDateIndicator dueDate={item?.dueDate} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const DueDateIndicator = ({ dueDate }) => {
  const dueDateObj = new Date(dueDate);
  const currentDate = new Date();
  const timeDifference = dueDateObj - currentDate;
  const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  let statusStyle, statusMessage;
  if (timeDifference > 0) {
    statusStyle = styles.dueUpcoming;
    statusMessage = `Due in ${daysDifference} day${
      daysDifference !== 1 ? "s" : ""
    }`;
  } else if (timeDifference === 0) {
    statusStyle = styles.dueToday;
    statusMessage = "Due today!";
  } else {
    statusStyle = styles.dueLate;
    statusMessage = `${Math.abs(daysDifference)} day${
      daysDifference !== -1 ? "s" : ""
    } overdue`;
  }

  return <Text style={[styles.dueDate, statusStyle]}>{statusMessage}</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    // backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },
  balance: {
    fontSize: 22,
    marginLeft: 10,
    fontWeight: "600",
    color: "#4CAF50",
  },

  // Virtual Account Card Styles
  virtualAccountCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  virtualAccountHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  virtualAccountTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "#2196F3",
  },
  virtualAccountDetails: {
    gap: 12,
  },
  accountDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accountDetailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  accountDetailValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  copyButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  copyIcon: {
    marginLeft: 6,
  },
  accountInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF3E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  accountInfoText: {
    fontSize: 12,
    color: "#E65100",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "500",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  dueItem: {
    backgroundColor: "#FFF",
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  dueItemContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  dueDetails: {
    marginLeft: 15,
    flex: 1,
  },
  dueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  dueDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  dueAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#E91E63",
    marginTop: 8,
  },
  dueStatusContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  dueStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  paidStatus: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
  },
  pendingStatus: {
    backgroundColor: "#FFF3E0",
    color: "#EF6C00",
  },
  dueDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  dueUpcoming: {
    color: "#2196F3",
  },
  dueToday: {
    color: "#FF9800",
    fontWeight: "bold",
  },
  dueLate: {
    color: "#F44336",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  utilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  utilityCard: {
    width: "48%",
    alignItems: "center",
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
    elevation: 1,
  },
  utilityImage: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  utilityName: {
    textAlign: "center",
    fontSize: 13,
    fontWeight: "500",
    color: "#333",
  },
  closeButton: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  balanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // ADDED to space out content and refresh button
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#FFF",
    borderRadius: 10,
    elevation: 2,
  },

  accountInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF8E1",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  accountInfoText: {
    fontSize: 13,
    color: "#333",
    lineHeight: 18,
  },
});

export default WalletScreen;
