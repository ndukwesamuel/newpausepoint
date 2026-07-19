// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Share,
//   StyleSheet,
//   Button,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { AntDesign, MaterialIcons, Ionicons } from "@expo/vector-icons";
// import { MediumFontText } from "../shared/Paragrahp";
// import { NavigationContainer, useNavigation } from "@react-navigation/native";
// import {
//   NativeStackNavigationProp,
//   createNativeStackNavigator,
// } from "@react-navigation/native-stack";
// import { RootStackParamList } from "../../navigation/AppNavigation";
// import { BottomModal } from "../shared/ReuseModals";
// import { useDispatch, useSelector } from "react-redux";
// import { getSShareLink } from "../../Redux/UtilitisSlice";

// // const Stack = createNativeStackNavigator<RootStackParamList>();
// const General = ({ item }) => {
//   const navigation = useNavigation();
//   const { shareLink } = useSelector((state) => state.UtilitisSlice);

//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(getSShareLink());
//     return () => {};
//   }, []);

//   const navigateToPersonalInfo = () => {
//     // if (item.link === "botton") {
//     //     re

//     // }
//     navigation.navigate(item.link);
//   };

//   const [sharemodal, setShareModal] = useState(false);

//   const onShare = async () => {
//     try {
//       const result = await Share.share({
//         message: `Check out this link: ${shareLink?.data?.link} `,
//       });

//       if (result.action === Share.sharedAction) {
//         if (result.activityType) {
//           // Shared with activity type of result.activityType
//         } else {
//           // Shared
//         }
//       } else if (result.action === Share.dismissedAction) {
//         // Dismissed
//       }
//     } catch (error) {
//       alert(error.message);
//     }
//   };

//   return (
//     <>
//       {item.link === "button" ? (
//         <TouchableOpacity
//           onPress={() => setShareModal(true)}
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//             <MediumFontText
//               data={item?.label}
//               textstyle={{ fontSize: 17, fontWeight: "500" }}
//             />
//           </View>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity
//           onPress={navigateToPersonalInfo}
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
//             {item.icon == "user" && (
//               <MaterialCommunityIcons name="user" size={24} color="black" />
//             )}
//             {item.icon == "notifications-outline" && (
//               <Ionicons name="notifications-outline" size={24} color="black" />
//             )}
//             {item.icon == "setting" && (
//               <MaterialCommunityIcons name="setting" size={24} color="black" />
//             )}

//             {item?.icon === "logout-outline" && (
//               <Ionicons name="log-out-outline" size={24} color="black" />
//             )}
//             <MediumFontText
//               data={item?.label}
//               textstyle={{ fontSize: 17, fontWeight: "500" }}
//             />
//           </View>
//           <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
//         </TouchableOpacity>
//       )}

//       <BottomModal visible={sharemodal}>
//         <View style={{ position: "absolute", right: 20, top: 20, zIndex: 1 }}>
//           <TouchableOpacity
//             style={{
//               backgroundColor: "white",
//               // paddingHorizontal: 20,
//               // paddingVertical: 10,
//               borderRadius: 50,
//               width: 50,
//               height: 50,
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//             // navigation.navigate("guestsdetail", { itemdata });

//             onPress={() => setShareModal(false)}
//           >
//             <MaterialIcons name="cancel" size={24} color="black" />
//           </TouchableOpacity>
//         </View>
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Button title="Share To Friend" onPress={onShare} />
//         </View>
//       </BottomModal>
//     </>
//   );
// };

// export default General;


import {
  View,
  Text,
  TouchableOpacity,
  Share,
  StyleSheet,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { MediumFontText } from "../shared/Paragrahp";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/AppNavigation";
import { BottomModal } from "../shared/ReuseModals";
import { useDispatch, useSelector } from "react-redux";
import { getSShareLink } from "../../Redux/UtilitisSlice";

const General = ({ item }) => {
  const navigation = useNavigation();
  const { shareLink } = useSelector((state) => state.UtilitisSlice);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getSShareLink());
    return () => {};
  }, []);

  const navigateToPersonalInfo = () => {
    navigation.navigate(item.link);
  };

  const [sharemodal, setShareModal] = useState(false);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this link: ${shareLink?.data?.link} `,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action === Share.dismissedAction) {
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // ── Render icon based on icon_type and icon name ──────────────────────
  const renderIcon = () => {
    if (item.icon_type === "Ionicons") {
      return <Ionicons name={item.icon} size={24} color="#10B981" />;
    }
    if (item.icon_type === "MaterialIcons") {
      return <MaterialIcons name={item.icon} size={24} color="#10B981" />;
    }
    // Default — MaterialCommunityIcons
    return <MaterialCommunityIcons name={item.icon} size={24} color="#10B981" />;
  };

  return (
    <>
      {item.link === "button" ? (
        <TouchableOpacity
          onPress={() => setShareModal(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MediumFontText
              data={item?.label}
              textstyle={{ fontSize: 17, fontWeight: "500" }}
            />
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={navigateToPersonalInfo}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {renderIcon()}
            <MediumFontText
              data={item?.label}
              textstyle={{ fontSize: 17, fontWeight: "500" }}
            />
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
        </TouchableOpacity>
      )}

      <BottomModal visible={sharemodal}>
        <View style={{ position: "absolute", right: 20, top: 20, zIndex: 1 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              borderRadius: 50,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => setShareModal(false)}
          >
            <MaterialIcons name="cancel" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button title="Share To Friend" onPress={onShare} />
        </View>
      </BottomModal>
    </>
  );
};

export default General;