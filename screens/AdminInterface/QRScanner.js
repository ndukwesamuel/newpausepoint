// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// import axios from "axios";

// export default function QRScanner() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [scannedData, setScannedData] = useState(null);

//   useEffect(() => {
//     (async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     })();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setScannedData(data);
//   };

//   const sendDataToServer = async () => {
//     try {
//       // Send a POST request with scanned data
//       const response = await axios.post("YOUR_API_ENDPOINT", {
//         data: scannedData,
//       });

//       // Handle response
//       console.log("Server response:", response.data);

//       // Reset scanned data
//       setScannedData(null);
//     } catch (error) {
//       console.error("Error sending data to server:", error);
//     }
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//       />
//       {scanned && (
//         <View style={styles.buttonContainer}>
//           <Button title={"Send Data"} onPress={sendDataToServer} />
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "flex-end",
//     alignItems: "center",
//   },
//   buttonContainer: {
//     position: "absolute",
//     bottom: 20,
//     left: 0,
//     right: 0,
//     justifyContent: "center",
//     alignItems: "center",
//   },
// });

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
          barCodeTypes: ["qr", "pdf417", "code128", "ean13"],
        }}
      />
      {scanned && (
        <View style={styles.buttonContainer}>
          <Button title={"Send Data"} onPress={sendDataToServer} />
          <View style={{ marginTop: 10 }}>
            <Button
              title={"Scan Again"}
              onPress={() => setScanned(false)}
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
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 20,
  },
});
