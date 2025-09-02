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
  SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
// import { useFetchData } from "../../../hooks/Request";
import {
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { useFetchData } from "../../../hooks/Request";
import { StatusBar } from "react-native";
import { useSelector } from "react-redux";

// ... inside your component

const Wallet = ({}) => {
  const {
    data,
    isLoading,
    error,
    refetch: refetchWallet,
  } = useFetchData("wallet", "wallet");

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);
  const {
    data: allmydues,
    isLoading: ispending,
    error: isError,
    refetch: refetchDues,
  } = useFetchData("wallet/pay-due", "pay-due");
  const animation = useRef(null);

  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);
  const [showUtilitiesModal, setShowUtilitiesModal] = useState(false);

  const utilityBills = [
    {
      id: 1,
      name: "Electricity (PHCN)",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19zpaIEhnv7Tndjz_HAhxkJBrlNg4CBeBPw&s", //"https://cdn-icons-png.flaticon.com/512/3627/3627068.png",
      type: "electricity",
    },
    {
      id: 2,
      name: "Water Bill",
      image:
        "https://domf5oio6qrcr.cloudfront.net/medialibrary/7909/conversions/b8a1309a-ba53-48c7-bca3-9c36aab2338a-thumb.jpg", //"https://cdn-icons-png.flaticon.com/512/3437/3437539.png",
      type: "water",
    },
    {
      id: 3,
      name: "DSTV/GOTV",
      image:
        "https://yt3.googleusercontent.com/ytc/AIdro_lJ6O-csU6TV2rLiQrAdMPCBGulqXuoz0qSunmRCGLWmg=s900-c-k-c0x00ffffff-no-rj", //"https://cdn-icons-png.flaticon.com/512/2504/2504921.png",
      type: "cable",
    },
    {
      id: 4,
      name: "Internet (WiFi)",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjql54yQIHWOl8m2DESARmhhz5op2PgSKFUA&s", // "https://cdn-icons-png.flaticon.com/512/2285/2285533.png",
      type: "internet",
    },
    {
      id: 5,
      name: "Airtime/Data",
      image:
        "https://read.cardtonic.com/wp-content/uploads/2024/04/How-to-Buy-Cheap-Airtime-Online-in-Nigeria-in-2024@3x-100-scaled.jpg", //"https://cdn-icons-png.flaticon.com/512/3059/3059518.png",
      type: "airtime",
    },
    {
      id: 6,
      name: "WAEC/NECO",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSI_WAj-T6ltOQdewMA40uKgy9DvWBtikXyvQ&s", //"https://cdn-icons-png.flaticon.com/512/3976/3976626.png",
      type: "education",
    },
  ];

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

  if (isLoading || ispending) return <Text>Loading...</Text>;
  if (error || isError) {
    console.error("Fetch Error:", error?.message || isError?.message);
    return <Text>Error: {error?.message || isError?.message}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" />

      <View style={styles.container}>
        <View style={styles.balanceContainer}>
          <Icon name="account-balance-wallet" size={30} color="#4CAF50" />
          <Text style={styles.balance}>
            {data?.balance?.toFixed(2)} {data?.currency}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("FundWallet")}
          >
            <Icon name="add" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Fund Wallet</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => setShowUtilitiesModal(true)}
          >
            <Icon name="payment" size={20} color="#FFF" />
            <Text style={styles.buttonText}>Pay Bills</Text>
          </TouchableOpacity> */}
        </View>

        {user_data?.user?.isGuest != true && (
          <>
            <Text style={styles.subTitle}>Invoices due</Text>

            <FlatList
              data={allmydues?.dues}
              renderItem={({ item }) => (
                <DueItem item={item} navigation={navigation} />
              )}
              keyExtractor={(item) => item._id}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              ListEmptyComponent={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={{
                      width: 200,
                      height: 200,
                      // backgroundColor: "#eee",
                    }}
                    source={require("../../../assets/Lottie/notFund.json")}
                  />
                  <Text
                    style={{
                      fontSize: 22,
                      fontWeight: "bold",
                      color: "#333",
                      marginBottom: 10,
                      textAlign: "center",
                    }}
                  >
                    No Dues Found
                  </Text>
                </View>
              }
            />
          </>
        )}

        <Modal
          visible={showUtilitiesModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUtilitiesModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: "90%",
                borderRadius: 20,
                padding: 20,
                maxHeight: "80%",
              }}
            >
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20,
                  color: "#2c3e50",
                }}
              >
                Select Utility Bill
              </Text>

              <ScrollView
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  paddingBottom: 20,
                }}
              >
                {[
                  {
                    id: 1,
                    name: "Electricity",
                    icon: "flash",
                    iconSet: MaterialCommunityIcons,
                    color: "#f39c12",
                  },
                  {
                    id: 2,
                    name: "Water",
                    icon: "water",
                    iconSet: FontAwesome5,
                    color: "#3498db",
                  },
                  {
                    id: 3,
                    name: "Internet",
                    icon: "wifi",
                    iconSet: Ionicons,
                    color: "#9b59b6",
                  },
                  {
                    id: 4,
                    name: "Cable TV",
                    icon: "tv",
                    iconSet: Ionicons,
                    color: "#e74c3c",
                  },
                  {
                    id: 5,
                    name: "Gas",
                    icon: "fire",
                    iconSet: FontAwesome5,
                    color: "#e67e22",
                  },
                  {
                    id: 6,
                    name: "Waste",
                    icon: "delete",
                    iconSet: MaterialIcons,
                    color: "#2ecc71",
                  },
                ].map((utility) => (
                  <TouchableOpacity
                    key={utility.id}
                    style={{
                      width: "48%",
                      backgroundColor: "#f8f9fa",
                      borderRadius: 12,
                      padding: 15,
                      marginBottom: 15,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: "#ecf0f1",
                    }}
                    disabled={true} // Disabled for "Coming Soon"
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
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <View
                style={{
                  backgroundColor: "#fff9e6",
                  padding: 15,
                  borderRadius: 10,
                  marginBottom: 15,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Ionicons name="time-outline" size={24} color="#f39c12" />
                <Text
                  style={{
                    color: "#e67e22",
                    fontSize: 16,
                    marginLeft: 10,
                    flex: 1,
                  }}
                >
                  Utility bill payments coming soon!
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: "#3498db",
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                }}
                onPress={() => setShowUtilitiesModal(false)}
              >
                <Text
                  style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
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
    padding: 20,
    backgroundColor: "#F5F5F5",
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
});

export default Wallet;
