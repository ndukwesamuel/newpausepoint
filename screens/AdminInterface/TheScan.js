// import React, { useState, useEffect } from "react";
// import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
// // import { DeleteAccountModal } from "./components/Account/Modal";
// // import { CenterReuseModals } from "./components/shared/ReuseModals";
// // import { formatDateandTime } from "./utils/DateTime";
// import { MaterialIcons } from "@expo/vector-icons";

// import {
//   NavigationContainer,
//   NavigationProp,
//   useNavigation,
// } from "@react-navigation/native";
// import { formatDateandTime } from "../../utils/DateTime";
// import { CenterReuseModals } from "../../components/shared/ReuseModals";
// import { useDispatch, useSelector } from "react-redux";
// import { Admin_Get_All_Clan_Memeber_Fun } from "../../Redux/UserSide/ClanSlice";

// export default function TheScan() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);
//   const [maindata, setMaindata] = useState(null);
//   const dispatch = useDispatch();
//   const {
//     get_user_clan_data,
//     get_all_clan_adminIN_data,
//     get_Single_clan_data,
//     admin_get_all_clan_memeber_data,
//   } = useSelector((state) => state?.ClanSlice);

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     };

//     getBarCodeScannerPermissions();
//     dispatch(Admin_Get_All_Clan_Memeber_Fun());
//   }, []);

//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalformVisible, setModalFormVisible] = useState(false);

//   const closeModal = () => {
//     setModalVisible(false);
//   };
//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     setModalVisible(true);
//     setMaindata(data);
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }

//   return (
//     <>
//       <View style={styles.container}>
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />
//         {scanned && (
//           <>
//             <Button
//               title={"Tap to Scan Again"}
//               onPress={() => {
//                 // setHasPermission(null);
//                 setScanned(false);
//                 setMaindata(null);
//               }}
//             />

//             <CenterReuseModals
//               visible={modalVisible}
//               onClose={() => setModalVisible(false)}
//             >
//               <View
//                 style={{
//                   backgroundColor: "white",
//                   padding: 20,
//                   borderRadius: 10,
//                   elevation: 5,
//                   width: "80%",
//                 }}
//               >
//                 <View
//                   style={{
//                     backgroundColor: "white",
//                     // padding: 20,
//                     width: "100%",
//                     borderTopLeftRadius: 30,
//                     borderTopRightRadius: 30,
//                     height: "80%",
//                   }}
//                 >
//                   <TouchableOpacity
//                     style={{
//                       // backgroundColor: "white",
//                       // padding: 20,
//                       // borderRadius: 10,
//                       // elevation: 5,
//                       // width: "80%",
//                       justifyContent: "flex-end",
//                       alignItems: "flex-end",
//                     }}
//                     onPress={() => {
//                       setModalVisible(false);
//                     }}
//                   >
//                     <MaterialIcons name="cancel" size={24} color="black" />
//                   </TouchableOpacity>
//                   <COnveter data={maindata} />
//                 </View>
//               </View>
//             </CenterReuseModals>
//           </>
//         )}
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: "column",
//     justifyContent: "center",
//   },
// });

// const COnveter = ({ data }) => {
//   const navigation = useNavigation();
//   const {
//     get_user_clan_data,
//     get_all_clan_adminIN_data,
//     get_Single_clan_data,
//     admin_get_all_clan_memeber_data,
//   } = useSelector((state) => state?.ClanSlice);

//   // const itemdata = JSON.parse(data);

//   let itemdata;

//   let usercode = data;
//   const findmemberwithcode = admin_get_all_clan_memeber_data?.data?.find(
//     (item) => item?.memberCode === usercode
//   );

//   console.log({
//     jaja: usercode,
//   });

//   console.log({
//     iiii: findmemberwithcode,
//   });

//   try {
//     itemdata = {}; // JSON.parse(data);
//   } catch (error) {
//     console.error("JSON Parse error:", error);
//     // You can customize the error message as needed
//     return <Text>Error: Invalid data format</Text>;
//   }

//   console.log({
//     ee: itemdata,
//   });

//   return (
//     <View>
//       <View style={{ marginBottom: 10 }}>
//         <Text
//           style={{
//             fontSize: 11,
//             fontFamily: "RobotoSlab-Medium",
//             fontWeight: "500",
//           }}
//         >
//           User Verification
//         </Text>

//         <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             Name:
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {findmemberwithcode?.user?.name}
//           </Text>
//         </View>

//         <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             Email:
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {findmemberwithcode?.user?.email}
//           </Text>
//         </View>

//         <View style={{ flexDirection: "row", marginBottom: 10, gap: 10 }}>
//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             Estate Status:
//           </Text>

//           <Text
//             style={{
//               fontSize: 14,
//               fontFamily: "Inter-SemiBold",
//               fontWeight: "600",
//             }}
//           >
//             {findmemberwithcode?.status}
//           </Text>
//         </View>
//       </View>

//       <TouchableOpacity
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-around",
//           borderWidth: 1,
//           borderColor: "#CFCDCD",
//           marginBottom: 10,
//           paddingVertical: 10,
//           borderRadius: 9,
//         }}
//         onPress={() =>
//           navigation.navigate("adminUserDetails", { item: findmemberwithcode })
//         }
//       >
//         <Text>Verify</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

import React, { useState, useEffect, useRef } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";

import {
  NavigationContainer,
  NavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { formatDateandTime } from "../../utils/DateTime";
import { CenterReuseModals } from "../../components/shared/ReuseModals";
import { useDispatch, useSelector } from "react-redux";
import { Admin_Get_All_Clan_Memeber_Fun } from "../../Redux/UserSide/ClanSlice";

export default function TheScan() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [maindata, setMaindata] = useState(null);
  const cameraRef = useRef(null);
  const dispatch = useDispatch();
  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
    admin_get_all_clan_memeber_data,
  } = useSelector((state) => state?.ClanSlice);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
    dispatch(Admin_Get_All_Clan_Memeber_Fun());
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
          style={StyleSheet.absoluteFillObject}
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          barCodeScannerSettings={{
            barCodeTypes: ["qr", "code128", "code39", "ean13"],
          }}
        />
        {scanned && (
          <>
            <Button
              title={"Tap to Scan Again"}
              onPress={() => {
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
                    width: "100%",
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    height: "80%",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      justifyContent: "flex-end",
                      alignItems: "flex-end",
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
  const {
    get_user_clan_data,
    get_all_clan_adminIN_data,
    get_Single_clan_data,
    admin_get_all_clan_memeber_data,
  } = useSelector((state) => state?.ClanSlice);

  let usercode = data;
  const findmemberwithcode = admin_get_all_clan_memeber_data?.data?.find(
    (item) => item?.memberCode === usercode
  );

  console.log({
    jaja: usercode,
  });

  console.log({
    iiii: findmemberwithcode,
  });

  let itemdata;

  try {
    itemdata = {}; // JSON.parse(data);
  } catch (error) {
    console.error("JSON Parse error:", error);
    return <Text>Error: Invalid data format</Text>;
  }

  console.log({
    ee: itemdata,
  });

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
            {findmemberwithcode?.user?.name}
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
            {findmemberwithcode?.user?.email}
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
            Estate Status:
          </Text>

          <Text
            style={{
              fontSize: 14,
              fontFamily: "Inter-SemiBold",
              fontWeight: "600",
            }}
          >
            {findmemberwithcode?.status}
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
          navigation.navigate("adminUserDetails", { item: findmemberwithcode })
        }
      >
        <Text>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};
