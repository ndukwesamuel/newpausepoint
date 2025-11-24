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
        <View
          style={{
            backgroundColor: "green",
            borderRadius: 10,
            padding: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 15,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "500" }}
              >
                Available Balance
              </Text>
              {/* Add Reload Button */}
              <TouchableOpacity
                onPress={handleReloadWallet}
                disabled={isLoading}
                style={{
                  marginLeft: 10,
                  padding: 5,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialCommunityIcons
                    name="reload"
                    size={20}
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
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              ₦ {data?.balance?.toFixed(2) || "0.00"}
            </Text>

            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
              }}
              onPress={() => navigation.navigate("FundWallet")}
            >
              <Text style={{ color: "#00D09E", fontWeight: "600" }}>
                + Add Money
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Actions */}
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            borderColor: "#8E8E93",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Bills Payment
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            {/* Row 1 */}
            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={() =>
                navigation.navigate("UtilityPayment", {
                  billType: "electricty",
                })
              }
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#4CAF50",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Icon name="electric-bolt" size={30} color="white" />
                </View>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Electricity
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={() => navigation.navigate("EsusuLandingScreen")}
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#4CAF50",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <MaterialIcons name="savings" size={24} color="white" />
                </View>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Esusu
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "23%",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={() => navigation.navigate("Airtime")}
            >
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "#4CAF50",
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <AntDesign name="aliyun" size={24} color="white" />
                  {/* <Icon name="electric-bolt" size={30} color="white" /> */}
                </View>
              </View>
              <Text
                style={{ fontSize: 12, color: "#333", textAlign: "center" }}
              >
                Airtime
              </Text>
            </TouchableOpacity>

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
          </View>
        </View>

        {/* Quick Links */}
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            borderColor: "#8E8E93",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: "bold",
            }}
          >
            Quick Links
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              marginTop: 10,
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
                  <View style={{ position: "relative" }}>
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: link.color,
                        borderRadius: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <IconComponent name={link.icon} size={20} color="white" />
                    </View>
                  </View>
                  <Text
                    style={{ fontSize: 12, color: "#333", textAlign: "center" }}
                  >
                    {link.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Modal
          visible={showUtilitiesModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUtilitiesModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Select Utility Bill </Text>

              <ScrollView
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
                      backgroundColor: utility.enabled ? "#ecf0f1" : "#f8f9fa",
                      borderRadius: 12,
                      padding: 15,
                      marginBottom: 15,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: utility.enabled ? "#3498db" : "#ecf0f1",
                      opacity: utility.enabled ? 1 : 0.5,
                    }}
                    disabled={!utility.enabled}
                    onPress={() =>
                      utility.enabled && handleUtilitySelect(utility.type)
                    }
                  >
                    <utility.iconSet
                      name={utility.icon}
                      size={40}
                      color={utility.color}
                      style={{ marginBottom: 10 }}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: "#34495e",
                        textAlign: "center",
                      }}
                    >
                      {utility.name}
                    </Text>
                    {!utility.enabled && (
                      <Text style={{ fontSize: 12, color: "#e67e22" }}>
                        Coming Soon
                      </Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUtilitiesModal(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
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
