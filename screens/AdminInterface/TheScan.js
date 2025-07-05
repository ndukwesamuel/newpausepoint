import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDateandTime } from "../../utils/DateTime";
import { useDispatch, useSelector } from "react-redux";
import {
  Admin_Get_All_Clan_Memeber_Fun,
  Get_Single_clan,
} from "../../Redux/UserSide/ClanSlice";

export default function TheScan() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [maindata, setMaindata] = useState(null);
  const cameraRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
    admin_get_all_clan_memeber_data,
  } = useSelector((state) => state?.ClanSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  useEffect(() => {
    dispatch(Admin_Get_All_Clan_Memeber_Fun());
    dispatch(Get_Single_clan(get_user_profile_data?.AdmincurrentClanMeeting));
    return () => {};
  }, []);

  const All_User = get_Single_clan_data?.data?.members;

  console.log({
    fff: All_User[0]?.memberCode,
  });

  const handleBarcodeScanned = ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setModalVisible(true);
    setMaindata(data);
  };

  // Check if data is a PI code (e.g., "PI-AAAA-0018")
  const isPiCode = (data) => {
    if (typeof data !== "string") return false;

    // This matches any 3 letters, then 4 letters/numbers, then 4 numbers
    // Example matches: PI-AAAA-0018, CCE-BB22-0001, HLE-1234-0002, ABC-DEFG-1234
    return /^[A-Z]{3}-[A-Z0-9]{4}-\d{4}$/.test(data);
    // return typeof data === "string" && /^PI-[A-Z]{4}-\d{4}$/.test(data);
  };

  if (!permission) {
    return <Text>Loading camera permissions...</Text>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center", marginBottom: 20 }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Camera Permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "code128", "code39", "ean13"],
        }}
      />

      {scanned && (
        <>
          <View style={styles.scanAgainContainer}>
            <Button
              title={"Tap to Scan Again"}
              onPress={() => {
                setScanned(false);
                setMaindata(null);
              }}
            />
          </View>

          {modalVisible && (
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    setScanned(false);
                    setMaindata(null);
                    setModalVisible(false);
                  }}
                >
                  <MaterialIcons name="cancel" size={24} color="black" />
                </TouchableOpacity>
                <View style={styles.modalContent}>
                  <Converter data={maindata} />
                </View>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

// New component for PI code display
const PiCodeScreen = ({ data }) => {
  return (
    <View style={{ padding: 20 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        PI Code Detected
      </Text>

      <View
        style={{
          backgroundColor: "#f0f0f0",
          padding: 15,
          borderRadius: 8,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: "#2c3e50",
          }}
        >
          {data}
        </Text>
      </View>

      <Text
        style={{
          marginTop: 20,
          fontSize: 14,
          color: "#7f8c8d",
          textAlign: "center",
        }}
      >
        This is a product identification code
      </Text>
    </View>
  );
};

// Your existing Converter component remains the same
const Converter = ({ data }) => {
  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
    admin_get_all_clan_memeber_data,
  } = useSelector((state) => state?.ClanSlice);

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice
  );

  const All_User = get_Single_clan_data?.data?.members;
  console.log({
    oooo: All_User,
  });

  const navigation = useNavigation();
  let itemdata;

  try {
    itemdata = JSON.parse(data);
  } catch (error) {
    console.error("JSON Parse error:", error);

    // console.log();

    const foundUser = All_User.find((member) => member.memberCode === data);
    console.log({
      cc: foundUser,
    });

    return (
      <>
        {foundUser ? (
          <View>
            {/* Your existing Converter JSX remains unchanged */}
            <View>
              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "RobotoSlab-Medium",
                    fontWeight: "500",
                  }}
                >
                  Resident Name
                </Text>
                <Text
                  style={{
                    fontSize: 20,
                    fontFamily: "Inter-SemiBold",
                    fontWeight: "600",
                  }}
                >
                  {foundUser?.user?.name}
                </Text>
              </View>

              <View style={{ marginBottom: 10 }}>
                <Text
                  style={{
                    fontSize: 11,
                    fontFamily: "RobotoSlab-Medium",
                    fontWeight: "500",
                  }}
                >
                  Member Code ID
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: "Inter-SemiBold",
                    fontWeight: "600",
                  }}
                >
                  {foundUser?.memberCode}
                </Text>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  borderWidth: 1,
                  borderColor: "#CFCDCD",
                  marginBottom: 10,
                  paddingVertical: 10,
                  borderRadius: 9,
                }}
                onPress={() =>
                  navigation.navigate("AdminTab", {
                    screen: "adminUserDetails",
                    params: { item: foundUser },
                  })
                }
              >
                <Text>Verify </Text>
              </TouchableOpacity>
            </View>

            {/* Rest of your Converter component... */}
          </View>
        ) : (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              PI Code Detected
            </Text>

            <View
              style={{
                backgroundColor: "#f0f0f0",
                padding: 15,
                borderRadius: 8,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "bold",
                  color: "#2c3e50",
                }}
              >
                {data}
              </Text>
            </View>

            <Text
              style={{
                marginTop: 20,
                fontSize: 14,
                color: "#7f8c8d",
                textAlign: "center",
              }}
            >
              This is a product identification code
            </Text>
          </View>
        )}
      </>
    );
  }

  return (
    <View>
      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Visitor Name
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {itemdata?.visitor_name}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Code ID
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {itemdata?.access_code}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Expire Time
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {formatDateandTime(itemdata?.expires)}
        </Text>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Phone Number
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {itemdata?.phone_number}
        </Text>
      </View>

      <TouchableOpacity
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          borderWidth: 1,
          borderColor: "#CFCDCD",
          marginBottom: 10,
          paddingVertical: 10,
          borderRadius: 9,
        }}
        onPress={() => {
          navigation.navigate("AdminGuestsDetail", { itemdata });
        }}
      >
        <Text>Verify </Text>
      </TouchableOpacity>
    </View>
  );
};

// Your existing styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  scanAgainContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "80%",
    maxHeight: "80%",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 40,
  },
});
