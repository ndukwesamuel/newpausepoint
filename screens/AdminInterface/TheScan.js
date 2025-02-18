import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
// import { DeleteAccountModal } from "./components/Account/Modal";
// import { CenterReuseModals } from "./components/shared/ReuseModals";
// import { formatDateandTime } from "./utils/DateTime";
import { MaterialIcons } from "@expo/vector-icons";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { formatDateandTime } from "../../utils/DateTime";
import { CenterReuseModals } from "../../components/shared/ReuseModals";

export default function TheScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [maindata, setMaindata] = useState(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalformVisible, setModalFormVisible] = useState(false);

  const closeModal = () => {
    setModalVisible(false);
  };
  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setModalVisible(true);
    setMaindata(data);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <>
      <View style={styles.container}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <>
            <Button
              title={"Tap to Scan Again"}
              onPress={() => {
                // setHasPermission(null);
                setScanned(false);
                setMaindata(null);
              }}
            />

            <CenterReuseModals
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  padding: 20,
                  borderRadius: 10,
                  elevation: 5,
                  width: "80%",
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    // padding: 20,
                    width: "100%",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    height: "80%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "white",
                      padding: 20,
                      borderRadius: 10,
                      elevation: 5,
                      width: "80%",
                    }}
                    onPress={() => {
                      setModalVisible(false);
                    }}
                  >
                    <MaterialIcons name="cancel" size={24} color="black" />
                  </TouchableOpacity>
                  <COnveter data={maindata} />
                </View>
              </View>
            </CenterReuseModals>
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

const COnveter = ({ data }) => {
  const navigation = useNavigation();

  // const itemdata = JSON.parse(data);

  let itemdata;

  try {
    itemdata = JSON.parse(data);
  } catch (error) {
    console.error("JSON Parse error:", error);
    // You can customize the error message as needed
    return <Text>Error: Invalid data format</Text>;
  }

  console.log({
    ee: itemdata,
  });

  return (
    // <View>
    //   <Text>Sam</Text>
    // </View>
    <View>
      <View style={{ marginBottom: 10 }}>
        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          User Verification
        </Text>

        <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            Name:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.user?.name}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            Email:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.user?.email}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            phone Number:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {itemdata?.phoneNumber}
          </Text>
        </View>
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
          navigation.navigate("adminUserDetails", { item: itemdata })
        }
      >
        <Text>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};
