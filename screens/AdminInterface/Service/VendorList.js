// import React, { useEffect, useRef, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Image,
//   Pressable,
//   ScrollView,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   ActivityIndicator,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Get_all_admin_Service__Fun,
//   Get_all_Categoryes__Fun,
// } from "../../../Redux/Admin/AdminServiceSlice";
// import LottieView from "lottie-react-native";
// import { useNavigation } from "@react-navigation/native";

// const VendorList = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { get_all_admin_Service_data, categoryes_data } = useSelector(
//     (state) => state.AdminServiceSlice
//   );

//   const [category, setCategory] = useState("All");
//   const animation = useRef(null);

//   useEffect(() => {
//     dispatch(Get_all_admin_Service__Fun());
//     dispatch(Get_all_Categoryes__Fun());

//     return () => {};
//   }, [dispatch]);

//   const [refreshing, setRefreshing] = useState(false);

//   //   // Wait for 2 seconds
//   //   setRefreshing(false);
//   // };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await dispatch(Get_all_admin_Service__Fun());
//     await dispatch(Get_all_Categoryes__Fun());
//     setRefreshing(false);
//   };

//   const handleCategory = (item) => {};
//   const filteredVendors =
//     category === "All"
//       ? get_all_admin_Service_data?.vendors
//       : get_all_admin_Service_data?.vendors.filter(
//           (vendor) => vendor?.category?.slug === category
//         );

//   const renderItem = ({ item, index }) => (
//     <Pressable
//       onPress={() => {
//         navigation.navigate("vendorServiceDetails", { item: item });
//       }}
//       key={item?.id}
//       style={{
//         flex: 1, // Take equal space
//         marginBottom: 10,
//         padding: 5, // Add some padding to avoid overlap
//       }}
//     >
//       <View
//         style={{
//           backgroundColor: "#fff",
//           margin: 5, // Adjust margins for equal spacing
//           shadowOpacity: 0.1,
//           shadowOffset: { width: 0, height: 2 },
//           flex: 1, // Ensure items take equal width
//           borderRadius: 10, // Combine border radius
//         }}
//       >
//         <Image
//           source={{
//             uri: item?.photo?.url,
//           }}
//           style={{
//             width: "100%",
//             height: 150,
//             borderTopLeftRadius: 10,
//             borderTopRightRadius: 10,
//           }}
//         />
//         <View
//           style={{
//             padding: 10,
//             backgroundColor: "#F3FFF3",
//             borderWidth: 1,
//             borderColor: "#C5F3C5",
//             borderBottomLeftRadius: 10,
//             borderBottomRightRadius: 10,
//           }}
//         >
//           <Text style={styles.cardName}>{item?.FullName}</Text>
//           <Text style={styles.cardSubtitle}>{item.about_me}</Text>
//           <View style={styles.ratingContainer}>
//             <Icon name="star" size={15} color="#04973C" />
//             <Text style={styles.ratingText}>{item?.avgRating.toFixed(1)}</Text>
//           </View>
//         </View>
//       </View>
//     </Pressable>
//   );

//   const renderEmptyList = () => (
//     <ScrollView
//       contentContainerStyle={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <LottieView
//         autoPlay
//         ref={animation}
//         style={{
//           width: 200,
//           height: 200,
//           // backgroundColor: "#eee",
//         }}
//         // Find more Lottie files at https://lottiefiles.com/featured
//         source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
//       />
//     </ScrollView>
//     // <Text style={styles.emptyText}>No products available.</Text>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Icon name="search" size={20} color="#777" style={styles.icon} />
//         <TextInput
//           placeholder="Search Vendor"
//           style={styles.input}
//           placeholderTextColor="#777"
//         />
//       </View>

//       {refreshing && <ActivityIndicator size="large" color="#04973C" />}
//       {/* <ScrollView> */}
//       <FlatList
//         data={filteredVendors}
//         renderItem={renderItem}
//         keyExtractor={(item, index) => index.toString()}
//         ListEmptyComponent={renderEmptyList}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//         }
//         numColumns={2}
//         contentContainerStyle={{
//           padding: 10,
//         }}
//         columnWrapperStyle={{
//           justifyContent: "space-between", // Ensure even spacing
//         }}
//       />

//       {/* </ScrollView> */}

//       <Pressable
//         style={{
//           position: "absolute",
//           bottom: 20,
//           // left: 0,
//           right: 5,
//           // justifyContent: "center",
//           // alignItems: "center",
//         }}
//         onPress={() => navigation.navigate("VendorProfile")}
//         accessibilityLabel="Add Vendor Profile"
//       >
//         <Image source={require("../../../assets/cross.png")} />
//       </Pressable>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "white",
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     borderRadius: 9,
//     paddingHorizontal: 10,
//     margin: 10,
//     backgroundColor: "#F6F8FA",
//   },
//   input: {
//     flex: 1,
//     paddingVertical: 18,
//     paddingLeft: 1,
//     color: "gray",
//   },
//   icon: {
//     marginRight: 10,
//   },
//   serviceListContainer: {
//     flexDirection: "row",
//     justifyContent: "space-evenly",
//   },
//   serviceItem: {
//     padding: 5,
//     borderWidth: 1,
//     borderRadius: 10,
//     borderColor: "#969696",
//     color: "#969696",
//     marginBottom: 10,
//   },
//   itemContainer: {
//     paddingVertical: 18,
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 20,
//   },
//   itemImage: {
//     marginRight: 25,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: "600",
//     paddingVertical: 10,
//   },
//   itemDetails: {
//     flexDirection: "row",
//     gap: 30,
//     justifyContent: "space-evenly",
//   },
//   ratingContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     height: 25,
//     width: 47,
//     padding: 5,
//     borderWidth: 1,
//     borderRadius: 10,
//     borderColor: "#81CB9D",
//   },
//   ratingText: {
//     marginLeft: 5,
//   },
//   closeButtonContainer: {
//     marginLeft: 280,
//   },
// });

// export default VendorList;

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import {
  Get_all_admin_Service__Fun,
  Get_all_Categoryes__Fun,
} from "../../../Redux/Admin/AdminServiceSlice";
import LottieView from "lottie-react-native";

const VendorList = ({ navigation }) => {
  const dispatch = useDispatch();
  const { get_all_admin_Service_data } = useSelector(
    (state) => state.AdminServiceSlice
  );

  const [category, setCategory] = useState("All");
  const [searchText, setSearchText] = useState(""); // State for search input
  const [refreshing, setRefreshing] = useState(false);
  const animation = useRef(null);

  useEffect(() => {
    dispatch(Get_all_admin_Service__Fun());
    dispatch(Get_all_Categoryes__Fun());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await dispatch(Get_all_admin_Service__Fun());
    await dispatch(Get_all_Categoryes__Fun());
    setRefreshing(false);
  };

  // Filter vendors based on category and search text
  const filteredVendors =
    category === "All"
      ? get_all_admin_Service_data?.vendors.filter((vendor) =>
          vendor?.FullName.toLowerCase().includes(searchText.toLowerCase())
        )
      : get_all_admin_Service_data?.vendors
          .filter((vendor) => vendor?.category?.slug === category)
          .filter((vendor) =>
            vendor?.FullName.toLowerCase().includes(searchText.toLowerCase())
          );

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        navigation.navigate("vendorServiceDetails", { item: item });
      }}
      key={item?.id}
      style={{
        flex: 1,
        marginBottom: 10,
        padding: 5,
      }}
    >
      <View
        style={{
          backgroundColor: "#fff",
          margin: 5,
          shadowOpacity: 0.1,
          shadowOffset: { width: 0, height: 2 },
          flex: 1,
          borderRadius: 10,
        }}
      >
        <Image
          source={{
            uri: item?.photo?.url,
          }}
          style={{
            width: "100%",
            height: 150,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}
        />
        <View
          style={{
            padding: 10,
            backgroundColor: "#F3FFF3",
            borderWidth: 1,
            borderColor: "#C5F3C5",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          <Text style={styles.cardName}>{item?.FullName}</Text>
          <Text style={styles.cardSubtitle}>{item?.about_me}</Text>
          <View style={styles.ratingContainer}>
            <Icon name="star" size={15} color="#04973C" />
            <Text style={styles.ratingText}>{item?.avgRating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderEmptyList = () => (
    <LottieView
      autoPlay
      ref={animation}
      style={{
        width: 200,
        height: 200,
      }}
      source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Search Vendor"
          style={styles.input}
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={(text) => setSearchText(text)} // Update search text on input
        />
      </View>

      {refreshing && <ActivityIndicator size="large" color="#04973C" />}
      <FlatList
        data={filteredVendors}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        numColumns={2}
        contentContainerStyle={{
          padding: 10,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
        }}
      />

      <Pressable
        style={{
          position: "absolute",
          bottom: 20,
          right: 5,
        }}
        onPress={() => navigation.navigate("VendorProfile")}
        accessibilityLabel="Add Vendor Profile"
      >
        <Image source={require("../../../assets/cross.png")} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: "#F6F8FA",
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 1,
    color: "gray",
  },
  icon: {
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 25,
    width: 47,
    padding: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#81CB9D",
  },
  ratingText: {
    marginLeft: 5,
  },
});

export default VendorList;
