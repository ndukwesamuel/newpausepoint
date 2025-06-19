// import { useRoute } from "@react-navigation/native";
// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
//   ScrollView,
//   Dimensions,
// } from "react-native";
// import Icon from "react-native-vector-icons/FontAwesome";
// import LottieView from "lottie-react-native";
// import { useMutation } from "react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
// // import Carousel from "react-native-snap-carousel";

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { useDispatch, useSelector } from "react-redux";
// import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";
// const ProductDetails = ({ navigation }) => {
//   const { item } = useRoute().params;
//   const dispatch = useDispatch();

//   const [activeIndex, setActiveIndex] = useState(0);
//   const carouselRef = useRef(null);
//   const screenWidth = Dimensions.get("window").width;

//   const { user_data } = useSelector((state) => state?.AuthSlice);

//   console.log({
//     ds: user_data?.token,
//     ewe: item?._id,
//   });
//   const Aprove_Mutation = useMutation(
//     (data_info) => {
//       let url = `${API_BASEURL}market/product/status/${item?._id}`;

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Accept: "application/json",
//           //   "Content-Type": "multipart/form-data",
//           Authorization: `Bearer ${user_data?.token}`,
//         },
//       };

//       return axios.put(url, data_info, config);
//     },
//     {
//       onSuccess: (success) => {
//         Toast.show({
//           type: "success",
//           text1: " successfully ",
//         });
//         dispatch(AdminMarket_data_Fun());

//         navigation.goBack();
//         // dispatch(Get_My_Clan_Forum_Fun());

//         // setTurnmodal(false);
//       },

//       onError: (error) => {
//         console.log({
//           error: error?.response?.data,
//         });
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

//   const renderItem = ({ item }) => {
//     return (
//       <View style={styles.slide}>
//         <Image
//           source={{ uri: item?.url }}
//           style={styles.carouselImage}
//           resizeMode="cover"
//         />
//       </View>
//     );
//   };
//   return (
//     <>
//       <ScrollView style={{ paddingVertical: 20 }}>
//         <View style={styles.carouselContainer}>
//           {/* <Carousel
//             layout="default"
//             ref={carouselRef}
//             data={item?.images}
//             renderItem={renderItem}
//             sliderWidth={screenWidth}
//             itemWidth={screenWidth}
//             onSnapToItem={(index) => setActiveIndex(index)}
//           /> */}
//           <View style={styles.pagination}>
//             {item?.images?.map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.paginationDot,
//                   activeIndex === index ? styles.paginationDotActive : null,
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         <View style={styles.contentContainer}>
//           <View style={styles.headerContainer}>
//             <View>
//               <Text style={styles.productTitle}>{item?.name}</Text>
//               <Text style={styles.productCategory}>{item?.category?.name}</Text>
//             </View>
//             <View>
//               <Text style={styles.productPrice}>₦{item?.price}</Text>
//             </View>
//           </View>
//           <Text style={styles.description}>{item?.description}</Text>
//         </View>
//         <View style={styles.downContainer}>
//           <Text style={styles.sellerTitle}>Seller Details</Text>
//           <Text style={styles.sellerInfo}>
//             <Icon name="user" size={20} color="black" />
//             <Text
//               style={{
//                 marginLeft: 10,
//               }}
//             >
//               {item?.seller?.name}
//             </Text>
//           </Text>
//         </View>

//         <View style={styles.buttonContainer}>
//           {Aprove_Mutation?.isLoading ? (
//             <ActivityIndicator size="large" color="white" />
//           ) : (
//             <>
//               {item?.status === "Decline" ? (
//                 <TouchableOpacity
//                   style={styles.approveButton}
//                   onPress={() => {
//                     Aprove_Mutation.mutate({
//                       status: "Approve",
//                     });
//                   }}
//                 >
//                   <Text style={styles.buttonText}>Approve</Text>
//                 </TouchableOpacity>
//               ) : (
//                 <TouchableOpacity
//                   style={styles.declineButton}
//                   onPress={() => {
//                     Aprove_Mutation.mutate({
//                       status: "Decline",
//                     });
//                   }}
//                 >
//                   <Text style={styles.buttonText}>Decline</Text>
//                 </TouchableOpacity>
//               )}
//             </>
//           )}

//           {console.log({
//             ccc: item?.status,
//           })}
//         </View>
//       </ScrollView>
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   image: {
//     width: "100%",
//   },
//   contentContainer: {
//     padding: 20,
//     paddingTop: 50,
//   },
//   headerContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//   },
//   productTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   productCategory: {
//     fontSize: 18,
//     color: "gray",
//   },
//   productPrice: {
//     fontSize: 22,
//     fontWeight: "bold",
//   },
//   productStock: {
//     fontSize: 18,
//     color: "gray",
//   },
//   description: {
//     marginTop: 10,
//     fontSize: 14,
//     color: "gray",
//   },
//   downContainer: {
//     paddingBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F6F6F6",
//     paddingHorizontal: 20,
//   },
//   sellerTitle: {
//     fontSize: 20,
//     fontWeight: "700",
//     paddingBottom: 5,
//   },
//   sellerInfo: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginTop: 5,
//   },
//   icon: {
//     marginRight: 10,
//   },
//   buttonContainer: {
//     paddingHorizontal: 20,
//     paddingTop: 60,
//   },
//   approveButton: {
//     backgroundColor: "green",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   declineButton: {
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "bold",
//   },

//   carouselContainer: {
//     position: "relative",
//   },
//   slide: {
//     width: "100%",
//     height: 250,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   carouselImage: {
//     width: "100%",
//     height: "100%",
//   },
//   pagination: {
//     position: "absolute",
//     bottom: 10,
//     width: "100%",
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   paginationDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: "rgba(255,255,255,0.5)",
//     marginHorizontal: 4,
//   },
//   paginationDotActive: {
//     backgroundColor: "white",
//     width: 12,
//   },
// });

// export default ProductDetails;

import { useRoute } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native"; // Keep if used elsewhere, otherwise can remove
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { useDispatch, useSelector } from "react-redux";
import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

const ProductDetails = ({ navigation }) => {
  const { item } = useRoute().params;
  const dispatch = useDispatch();

  const [activeIndex, setActiveIndex] = useState(0);
  // carouselRef is no longer needed with custom ScrollView carousel
  // const carouselRef = useRef(null);
  const screenWidth = Dimensions.get("window").width;

  const { user_data } = useSelector((state) => state?.AuthSlice);

  console.log({
    ds: user_data?.token,
    ewe: item?._id,
  });

  const Aprove_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}market/product/status/${item?._id}`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.put(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Status updated successfully",
        });
        dispatch(AdminMarket_data_Fun());
        navigation.goBack();
      },
      onError: (error) => {
        console.log({
          error: error?.response?.data,
        });
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message} `,
        });
      },
    }
  );

  // Removed renderItem as it's specific to react-native-snap-carousel

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / screenWidth);
    setActiveIndex(currentIndex);
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.carouselContainer}>
        {/* Custom Carousel Implementation */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16} // To ensure smooth updates
        >
          {item?.images?.map((image, index) => (
            <View key={index} style={[styles.slide, { width: screenWidth }]}>
              <Image
                source={{ uri: image?.url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          ))}
        </ScrollView>
        {/* End Custom Carousel Implementation */}

        <View style={styles.pagination}>
          {item?.images?.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                activeIndex === index ? styles.paginationDotActive : null,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.productTitle}>{item?.name}</Text>
            <Text style={styles.productCategory}>{item?.category?.name}</Text>
          </View>
          <View>
            <Text style={styles.productPrice}>₦{item?.price}</Text>
          </View>
        </View>
        <Text style={styles.description}>{item?.description}</Text>
      </View>
      <View style={styles.downContainer}>
        <Text style={styles.sellerTitle}>Seller Details</Text>
        <Text style={styles.sellerInfo}>
          <Icon name="user" size={20} color="black" />
          <Text
            style={{
              marginLeft: 10,
            }}
          >
            {item?.seller?.name}
          </Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {Aprove_Mutation?.isLoading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <>
            {item?.status === "Decline" || item?.status === "Pending" ? ( // Also consider "Pending" to be approved
              <TouchableOpacity
                style={styles.approveButton}
                onPress={() => {
                  Aprove_Mutation.mutate({
                    status: "Approve",
                  });
                }}
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.declineButton}
                onPress={() => {
                  Aprove_Mutation.mutate({
                    status: "Decline",
                  });
                }}
              >
                <Text style={styles.buttonText}>Decline</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {console.log({
          ccc: item?.status,
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: "100%",
  },
  contentContainer: {
    padding: 20,
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 18,
    color: "gray",
  },
  productPrice: {
    fontSize: 22,
    fontWeight: "bold",
  },
  productStock: {
    fontSize: 18,
    color: "gray",
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: "gray",
  },
  downContainer: {
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
    paddingHorizontal: 20,
  },
  sellerTitle: {
    fontSize: 20,
    fontWeight: "700",
    paddingBottom: 5,
  },
  sellerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  icon: {
    marginRight: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  approveButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  declineButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  carouselContainer: {
    position: "relative",
    height: 250, // Added a fixed height for the ScrollView to render correctly
  },
  slide: {
    height: "100%", // The individual slide should take full height
    justifyContent: "center",
    alignItems: "center",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  pagination: {
    position: "absolute",
    bottom: 10,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 12,
  },
});

export default ProductDetails;
