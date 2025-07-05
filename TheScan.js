import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { CenterReuseModals } from "./components/shared/ReuseModals";
import { formatDateandTime } from "./utils/DateTime";
import { MaterialIcons } from "@expo/vector-icons";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";

export default function TheScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [maindata, setMaindata] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
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
        <Camera
          ref={cameraRef}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          barCodeScannerSettings={{
            barCodeTypes: ["qr", "pdf417", "code128", "ean13"],
          }}
        />
        {scanned && (
          <>
            <Button
              title={"Tap to Scan Again"}
              onPress={() => setScanned(false)}
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
                <TouchableOpacity
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 10,
                    elevation: 5,
                    width: "80%",
                  }}
                  onPress={() => {
                    setScanned(false);
                    setMaindata(null);
                  }}
                >
                  <MaterialIcons name="cancel" size={24} color="black" />
                </TouchableOpacity>
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

  console.log({
    data: data,
  });

  // const itemdata = JSON.parse(data);

  let itemdata;

  try {
    itemdata = JSON.parse(data);
  } catch (error) {
    console.error("JSON Parse error:", error);
    // You can customize the error message as needed
    return <Text>Error: Invalid data format</Text>;
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
