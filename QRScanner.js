import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { Camera } from "expo-camera";
import axios from "axios";

export default function QRScanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
  };

  const sendDataToServer = async () => {
    try {
      // Send a POST request with scanned data
      const response = await axios.post("YOUR_API_ENDPOINT", {
        data: scannedData,
      });

      // Handle response
      console.log("Server response:", response.data);

      // Reset scanned data
      setScannedData(null);
      setScanned(false); // Allow scanning again
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        barCodeScannerSettings={{
          barCodeTypes: ["qr", "pdf417", "code128", "ean13", "ean8", "upc_e"],
        }}
      />
      {scanned && scannedData && (
        <View style={styles.resultsContainer}>
          <Text style={styles.scannedText}>Scanned: {scannedData}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Send Data" onPress={sendDataToServer} />
            <Button
              title="Scan Again"
              onPress={() => {
                setScanned(false);
                setScannedData(null);
              }}
              color="#841584"
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  resultsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  scannedText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
});
