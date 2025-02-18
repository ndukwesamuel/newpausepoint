// import { View, Text, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

// import { MediumFontText } from "../../../components/shared/Paragrahp";
// import ApprovedGoods from "./ApprovedGoods";
// import PendingGoods from "./PendingGoods";
// import { useDispatch, useSelector } from "react-redux";
// import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons } from "@expo/vector-icons";
import { Amenitity_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";
import {
  BottomModal,
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

// const amenitiesData = [
//   { id: "1", name: "Table Tennis", priceType: "Free" },
//   { id: "2", name: "Board Games", priceType: "Free" },
//   { id: "3", name: "Swimming Pool", priceType: "Paid" },
//   { id: "4", name: "Amenity Pool", priceType: "Paid" },
//   { id: "5", name: "Club house-Gym", priceType: "Paid" },
//   { id: "6", name: "Club house-TT room", priceType: "Free" },
//   { id: "7", name: "Cricket Net", priceType: "Paid" },
//   { id: "8", name: "Cycle Shot", priceType: "Free" },
//   { id: "9", name: "New Court for Badminton", priceType: "Paid" },
//   { id: "10", name: "New Test Amenity", priceType: "Free" },
// ];

// const Amenities = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();

//   const [mainmodal, setMainmodal] = useState(false);
//   const { amenitity_data } = useSelector((state) => state?.AdminMarketSLice);
//   const [newAmenity, setNewAmenity] = useState("");
//   const [amenityStatus, setAmenityStatus] = useState("");
//   console.log({
//     jdjd: amenitity_data?.amenities,
//   });

//   const {
//     user_data,
//     user_isError,
//     user_isSuccess,
//     user_isLoading,
//     user_message,
//   } = useSelector((state) => state.AuthSlice);

//   useEffect(() => {
//     dispatch(Amenitity_data_Fun());

//     return () => {};
//   }, []);

//   const CreateAmenties_Mutation = useMutation(
//     (data_info) => {
//       let url = `${API_BASEURL}amenities`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           //   "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.post(url, data_info, config);
//     },
//     {
//       onSuccess: (success) => {
//         Toast.show({
//           type: "success",
//           text1: " successfully ",
//         });

//         setNewAmenity("");
//         setAmenityStatus("");
//         dispatch(Amenitity_data_Fun());

//         setMainmodal(false);
//         // dispatch(Get_My_Clan_Forum_Fun());
//         // setTurnmodal(false);
//       },

//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: `${error?.response?.data?.message} `,
//           //   text2: ` ${error?.response?.data?.errorMsg} `,
//         });

//         // dispatch(Get_User_Clans_Fun());
//         // dispatch(Get_User_Profle_Fun());
//         // dispatch(Get_all_clan_User_Is_adminIN_Fun());
//       },
//     }
//   );

//   const handleAddAmenity = () => {
//     if (newAmenity && amenityStatus) {
//       CreateAmenties_Mutation.mutate({
//         name: newAmenity,
//         payment: amenityStatus,
//       });
//     }
//   };

//   const maoldaClose = () => {
//     setMainmodal(false);
//   };

//   return (
//     <View style={styles.container}>
//       <View style={{ position: "absolute", right: 50, top: 320, zIndex: 1 }}>
//         <TouchableOpacity
//           style={{
//             backgroundColor: "green",
//             // paddingHorizontal: 20,
//             // paddingVertical: 10,
//             borderRadius: 50,
//             width: 50,
//             height: 50,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//           // navigation.navigate("guestsdetail", { itemdata });

//           onPress={() => setMainmodal(true)}
//         >
//           <MaterialIcons name="mode-edit" size={24} color="white" />
//         </TouchableOpacity>
//       </View>
//       <FlatList
//         data={amenitity_data?.amenities}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.amenityContainer}>
//             <Text style={styles.amenityName}>{item.name}</Text>
//             <Text style={item.payment === "Free" ? styles.free : styles.paid}>
//               {item.payment}
//             </Text>
//           </View>
//         )}
//       />

//       {mainmodal && (
//         <BottomModal onClose={maoldaClose}>
//           <View
//             style={{
//               margin: 10,
//             }}
//           >
//             <TextInput
//               style={styles.input}
//               placeholder="Enter Amenity"
//               value={newAmenity}
//               onChangeText={setNewAmenity}
//             />

//             <TextInput
//               style={styles.input}
//               placeholder="Status (Free/Paid)"
//               value={amenityStatus}
//               onChangeText={setAmenityStatus}
//             />
//           </View>

//           {CreateAmenties_Mutation?.isLoading ? (
//             <ActivityIndicator size="large" color="green" />
//           ) : (
//             <Button title="Add Amenity" onPress={handleAddAmenity} />
//           )}
//         </BottomModal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//     backgroundColor: "#fff",
//   },
//   amenityContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ccc",
//   },
//   amenityName: {
//     fontSize: 16,
//     color: "#000",
//   },
//   free: {
//     color: "green",
//   },
//   paid: {
//     color: "red",
//   },

//   input: {
//     borderWidth: 1,
//     borderColor: "#ddd",
//     padding: 10,
//     marginBottom: 10,
//   },
// });

// export default Amenities;

// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Button,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { MaterialIcons } from "@expo/vector-icons";
// import { Amenitity_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";
// import { BottomModal } from "../../../components/shared/ReuseModals";

// import { useMutation } from "react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useNavigation } from "@react-navigation/native";

const Amenities = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [mainmodal, setMainmodal] = useState(false);
  const { amenitity_data } = useSelector((state) => state?.AdminMarketSLice);
  const [newAmenity, setNewAmenity] = useState("");
  const [amenityStatus, setAmenityStatus] = useState("");

  const { user_data } = useSelector((state) => state.AuthSlice);

  useEffect(() => {
    dispatch(Amenitity_data_Fun("all"));
    return () => {};
  }, []);

  const CreateAmenties_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}amenities`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Amenity created successfully",
        });
        setNewAmenity("");
        setAmenityStatus("");
        dispatch(Amenitity_data_Fun());
        setMainmodal(false);
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message}`,
        });
      },
    }
  );

  const DeleteAmenity_Mutation = useMutation(
    (amenityId) => {
      let url = `${API_BASEURL}amenities/${amenityId}`;

      console.log({
        url,
      });

      const config = {
        headers: {
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.delete(url, config);
    },
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Amenity deleted successfully",
        });
        dispatch(Amenitity_data_Fun());
      },

      onError: (error) => {
        console.log({
          ssssss: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message}`,
        });
      },
    }
  );

  const handleAddAmenity = () => {
    if (newAmenity && amenityStatus) {
      CreateAmenties_Mutation.mutate({
        name: newAmenity,
        payment: amenityStatus,
      });
    }
  };

  const handleDeleteAmenity = (amenityId) => {
    console.log({
      ddd: amenityId,
    });
    DeleteAmenity_Mutation.mutate(amenityId);
  };

  const maoldaClose = () => {
    setMainmodal(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={amenitity_data?.amenities}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.amenityContainer}>
            <Text style={styles.amenityName}>{item.name}</Text>

            <Text style={item.payment === "Free" ? styles.free : styles.paid}>
              {item.payment}
            </Text>
          </View>
        )}
      />

      {DeleteAmenity_Mutation.isLoading && (
        <ActivityIndicator size="large" color="green" />
      )}

      {mainmodal && (
        <BottomModal onClose={maoldaClose}>
          <View style={{ margin: 10 }}>
            <TextInput
              style={styles.input}
              placeholder="Enter Amenity"
              value={newAmenity}
              onChangeText={setNewAmenity}
            />

            <TextInput
              style={styles.input}
              placeholder="Status (Free/Paid)"
              value={amenityStatus}
              onChangeText={setAmenityStatus}
            />
          </View>

          {CreateAmenties_Mutation?.isLoading ? (
            <ActivityIndicator size="large" color="green" />
          ) : (
            <Button title="Add Amenity" onPress={handleAddAmenity} />
          )}
        </BottomModal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  amenityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  amenityName: {
    fontSize: 16,
    color: "#000",
  },
  free: {
    color: "green",
  },
  paid: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    borderRadius: 50,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Amenities;
