// // // Import necessary modules from React Native and Expo
// // import React, { useEffect, useRef, useState } from "react";

// // import {
// //   View,
// //   Text,
// //   FlatList,
// //   TouchableOpacity,
// //   RefreshControl,
// //   ActivityIndicator,
// // } from "react-native";
// // import { useDispatch, useSelector } from "react-redux";
// // import LottieView from "lottie-react-native";

// // import {
// //   Get_User_Clans_Fun,
// //   Get_all_clan_User_Is_adminIN_Fun,
// // } from "../../../Redux/UserSide/ClanSlice";
// // import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";

// // // ------------------------------------------------------------------
// // // UPDATED IMPORT: Use @tanstack/react-query instead of react-query
// // import { useMutation } from "@tanstack/react-query";
// // // ------------------------------------------------------------------

// // const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// // import axios from "axios";
// // import Toast from "react-native-toast-message";
// // import {
// //   LightFontText,
// //   MediumFontText,
// //   RegularFontText,
// // } from "../../../components/shared/Paragrahp";
// // import { reset_login } from "../../../Redux/AuthSlice";
// // import { reset_isOnboarding } from "../../../Redux/DontwantToResetSlice";
// // import { useFetchData_v2 } from "../../../hooks/Requestv2";

// // // Replace this with the correct API endpoint for fetching user clans

// // const UserClans = () => {
// //   // State to store the list of user clans
// //   const [userClans, setUserClans] = useState([]);
// //   const [refreshing, setRefreshing] = useState(false);
// //   const [activeButton, setActiveButton] = useState("Member"); // Initialize with 'Member' as the active button
// //   const animation = useRef(null);

// //   const dispatch = useDispatch();
// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [selectedClan, setSelectedClan] = useState(null);

// //   const {
// //     data: allMyClans,
// //     isLoading: isLoadingallMyClans,
// //     isError: isErrorallMyClans,
// //     error: errorallMyClans,
// //     refetch: refetchallMyClans,
// //   } = useFetchData_v2("api/v1/clan/user/allMyClans", "allMyClans");

// //   console.log({
// //     tyyyyccc: allMyClans?.userClans,
// //   });

// //   const { get_all_clan_adminIN_data } = useSelector(
// //     (state) => state?.ClanSlice,
// //   );

// //   const { get_user_profile_data } = useSelector(
// //     (state) => state?.UserProfileSlice,
// //   );

// //   console.log({
// //     yuuuu: get_user_profile_data,
// //   });

// //   // Effect to fetch initial data when the component mounts
// //   useEffect(() => {
// //     dispatch(Get_User_Profle_Fun());
// //     return () => {};
// //   }, []);

// //   // ------------------------------------------------------------------
// //   // TanStack Query useMutation for Member Clan Selection/Leaving
// //   // ------------------------------------------------------------------
// //   const SelectCLan_Mutation = useMutation({
// //     mutationFn: (data_info) => {
// //       console.log({
// //         data_info,
// //       });
// //       let url = `${API_BASEURL}clan/select_user_clan/${data_info?.id}`;

// //       const config = {
// //         headers: {
// //           "Content-Type": "application/json",
// //           Accept: "application/json",
// //           // Authorization: `Bearer ${user_data?.token}`,
// //         },
// //       };

// //       if (data_info?.method === "GET") {
// //         return axios.get(url, config);
// //       }

// //       if (data_info?.method === "DELETE") {
// //         return axios.delete(url, config);
// //       }
// //       // Return a rejected promise if method is neither GET nor DELETE
// //       return Promise.reject(new Error("Invalid mutation method provided."));
// //     },
// //     onSuccess: (success) => {
// //       Toast.show({
// //         type: "success",
// //         text1: "Clan selection updated successfully",
// //       });

// //       // Refetch relevant data after a successful operation
// //       dispatch(Get_User_Clans_Fun());
// //       dispatch(Get_User_Profle_Fun());
// //       dispatch(Get_all_clan_User_Is_adminIN_Fun());
// //     },
// //     onError: (error) => {
// //       console.log({
// //         ppp: error?.response?.data,
// //       });
// //       Toast.show({
// //         type: "error",
// //         text1: `${error?.response?.data?.message || "An error occurred"}`,
// //       });
// //       // Refetch on error to ensure state consistency
// //       dispatch(Get_User_Clans_Fun());
// //       dispatch(Get_User_Profle_Fun());
// //       dispatch(Get_all_clan_User_Is_adminIN_Fun());
// //     },
// //   });

// //   // ------------------------------------------------------------------
// //   // TanStack Query useMutation for Admin Clan Selection/Leaving
// //   // ------------------------------------------------------------------
// //   const Estate_admin_SelectCLan_Mutation = useMutation({
// //     mutationFn: (data_info) => {
// //       let url = `${API_BASEURL}clan/select_Admin_clan/${data_info?.id}`;

// //       const config = {
// //         headers: {
// //           "Content-Type": "application/json",
// //           Accept: "application/json",
// //           // Authorization: `Bearer ${user_data?.token}`,
// //         },
// //       };

// //       if (data_info?.method === "GET") {
// //         return axios.get(url, config);
// //       }

// //       if (data_info?.method === "DELETE") {
// //         return axios.delete(url, config);
// //       }
// //       return Promise.reject(new Error("Invalid mutation method provided."));
// //     },
// //     onSuccess: (success) => {
// //       Toast.show({
// //         type: "success",
// //         text1: "Admin Clan selection updated successfully",
// //       });

// //       // Refetch relevant data after a successful operation
// //       dispatch(Get_User_Clans_Fun());
// //       dispatch(Get_User_Profle_Fun());
// //       dispatch(Get_all_clan_User_Is_adminIN_Fun());
// //     },
// //     onError: (error) => {
// //       Toast.show({
// //         type: "error",
// //         text1: `${error?.response?.data?.message || "An error occurred"} `,
// //       });
// //       // Refetch on error to ensure state consistency
// //       dispatch(Get_User_Clans_Fun());
// //       dispatch(Get_User_Profle_Fun());
// //       dispatch(Get_all_clan_User_Is_adminIN_Fun());
// //     },
// //   });

// //   const onRefresh = () => {
// //     // Set the refreshing state to true
// //     setRefreshing(true);
// //     dispatch(Get_User_Clans_Fun());
// //     dispatch(Get_User_Profle_Fun());
// //     dispatch(Get_all_clan_User_Is_adminIN_Fun()).then(() =>
// //       setRefreshing(false),
// //     );
// //   };

// //   // Render item function for FlatList (Member Clans)
// //   const renderClanItem = ({ item }) => {
// //     const isCurrentClan =
// //       get_user_profile_data?.data?.currentClanMeeting?._id === item?._id;
// //     const isPending = SelectCLan_Mutation.isPending;
// //     return (
// //       <View
// //         style={{
// //           marginVertical: 10,
// //           marginHorizontal: 20,
// //           padding: 10,
// //           borderWidth: 1,
// //           borderColor: "#ccc",
// //           borderRadius: 8,
// //           flexDirection: "row",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //         }}
// //       >
// //         {console.log({
// //           xxx: item?._id,
// //         })}
// //         <View style={{ width: "75%" }}>
// //           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
// //           <Text>{item?.description}</Text>
// //           <Text>Status: {item?.status}</Text>
// //           <Text>Email: {item?.email}</Text>
// //         </View>

// //         <TouchableOpacity
// //           style={{
// //             backgroundColor: isCurrentClan ? "#dc3545" : "#04973C", // Red for Leave, Green for Join
// //             paddingHorizontal: 20,
// //             paddingVertical: 10,
// //             borderRadius: 10,
// //           }}
// //           onPress={() => {
// //             SelectCLan_Mutation.mutate({
// //               method: isCurrentClan ? "DELETE" : "GET",
// //               id: item?._id,
// //             });
// //           }}
// //           disabled={isPending}
// //         >
// //           <View>
// //             {isPending ? (
// //               <ActivityIndicator size="small" color="white" />
// //             ) : (
// //               <Text style={{ color: "white" }}>
// //                 {isCurrentClan ? "Leave " : "Join"}
// //               </Text>
// //             )}
// //           </View>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   // Render item function for FlatList (Admin Clans)
// //   const AdminrenderClanItem = ({ item }) => {
// //     const isAdminCurrentClan =
// //       get_user_profile_data?.AdmincurrentClanMeeting === item?._id;
// //     const isPending = Estate_admin_SelectCLan_Mutation.isPending;

// //     return (
// //       <View
// //         style={{
// //           marginVertical: 10,
// //           marginHorizontal: 20,
// //           padding: 10,
// //           borderWidth: 1,
// //           borderColor: "#ccc",
// //           borderRadius: 8,
// //           flexDirection: "row",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //         }}
// //       >
// //         <View style={{ width: "75%" }}>
// //           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
// //           <Text>{item?.description}</Text>
// //           <Text>Status: {item?.status}</Text>
// //           <Text>Email: {item?.email}</Text>
// //         </View>

// //         <TouchableOpacity
// //           style={{
// //             backgroundColor: isAdminCurrentClan ? "#dc3545" : "#04973C", // Red for Leave, Green for Join
// //             paddingHorizontal: 20,
// //             paddingVertical: 10,
// //             borderRadius: 10,
// //           }}
// //           onPress={() => {
// //             Estate_admin_SelectCLan_Mutation.mutate({
// //               method: isAdminCurrentClan ? "DELETE" : "GET",
// //               id: item?._id,
// //             });
// //           }}
// //           disabled={isPending}
// //         >
// //           <View>
// //             {isPending ? (
// //               <ActivityIndicator size="small" color="white" />
// //             ) : (
// //               <Text style={{ color: "white" }}>
// //                 {isAdminCurrentClan ? "Leave" : "Join"}
// //               </Text>
// //             )}
// //           </View>
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   return (
// //     <View style={{ flex: 1, alignItems: "center" }}>
// //       {(SelectCLan_Mutation.isPending ||
// //         Estate_admin_SelectCLan_Mutation.isPending) && (
// //         // Display a single overlay indicator for any pending mutation
// //         <ActivityIndicator
// //           size="large"
// //           color="#0C1401"
// //           style={{
// //             position: "absolute",
// //             top: 0,
// //             bottom: 0,
// //             left: 0,
// //             right: 0,
// //             zIndex: 10,
// //           }}
// //         />
// //       )}

// //       <View
// //         style={{
// //           flexDirection: "row",
// //           justifyContent: "space-between",
// //           marginBottom: 20,
// //           borderWidth: 1,
// //           borderColor: "#CFCDCD",
// //           borderRadius: 6,
// //           padding: 10,
// //           width: "90%",
// //         }}
// //       >
// //         <TouchableOpacity
// //           style={{
// //             backgroundColor:
// //               activeButton === "Member" ? "#04973C" : "transparent",
// //             padding: 10,
// //             borderRadius: 5,
// //             flex: 1,
// //             alignItems: "center",
// //           }}
// //           onPress={() => setActiveButton("Member")}
// //         >
// //           <MediumFontText
// //             data="Member"
// //             textstyle={{
// //               fontSize: 16,
// //               fontWeight: "500",
// //               color: activeButton === "Member" ? "white" : "black",
// //             }}
// //           />
// //         </TouchableOpacity>

// //         <TouchableOpacity
// //           style={{
// //             backgroundColor:
// //               activeButton === "Admin" ? "#04973C" : "transparent",
// //             padding: 10,
// //             borderRadius: 5,
// //             flex: 1,
// //             alignItems: "center",
// //           }}
// //           onPress={() => setActiveButton("Admin")}
// //         >
// //           <MediumFontText
// //             data="Admin"
// //             textstyle={{
// //               fontSize: 16,
// //               fontWeight: "500",
// //               color: activeButton === "Admin" ? "white" : "black",
// //             }}
// //           />
// //         </TouchableOpacity>
// //       </View>

// //       {activeButton === "Member" && (
// //         <>
// //           {allMyClans?.userClans?.length < 1 ? (
// //             <View
// //               style={{
// //                 flex: 1,
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //               }}
// //             >
// //               <LottieView
// //                 autoPlay
// //                 ref={animation}
// //                 style={{
// //                   width: 200,
// //                   height: 200,
// //                 }}
// //                 source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
// //               />
// //             </View>
// //           ) : (
// //             <FlatList
// //               data={allMyClans?.userClans}
// //               keyExtractor={(item) => item._id}
// //               renderItem={renderClanItem}
// //               style={{ width: "100%" }}
// //               refreshControl={
// //                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// //               }
// //             />
// //           )}
// //         </>
// //       )}

// //       {activeButton === "Admin" && (
// //         <>
// //           {get_all_clan_adminIN_data === null ||
// //           get_all_clan_adminIN_data?.clans_info?.length < 1 ? (
// //             <View
// //               style={{
// //                 flex: 1,
// //                 justifyContent: "center",
// //                 alignItems: "center",
// //               }}
// //             >
// //               <LottieView
// //                 autoPlay
// //                 ref={animation}
// //                 style={{
// //                   width: 200,
// //                   height: 200,
// //                 }}
// //                 source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
// //               />
// //             </View>
// //           ) : (
// //             <FlatList
// //               data={get_all_clan_adminIN_data?.clans_info}
// //               keyExtractor={(item) => item._id}
// //               renderItem={AdminrenderClanItem}
// //               style={{ width: "100%" }}
// //               refreshControl={
// //                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
// //               }
// //             />
// //           )}
// //         </>
// //       )}
// //     </View>
// //   );
// // };

// // export default UserClans;

// import React, { useRef, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   RefreshControl,
//   ActivityIndicator,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import LottieView from "lottie-react-native";
// import Toast from "react-native-toast-message";

// import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";
// import { MediumFontText } from "../../../components/shared/Paragrahp";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

// const UserClans = () => {
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeButton, setActiveButton] = useState("Member");
//   const animation = useRef(null);
//   const dispatch = useDispatch();

//   // ----------------------------------------------------------------
//   // Fetch all clans the user belongs to
//   // ----------------------------------------------------------------
//   const { data: allMyClans, refetch: refetchallMyClans } = useFetchData_v2(
//     "api/v1/clan/user/allMyClans",
//     "allMyClans",
//   );

//   const { get_all_clan_adminIN_data } = useSelector(
//     (state) => state?.ClanSlice,
//   );

//   const { get_user_profile_data } = useSelector(
//     (state) => state?.UserProfileSlice,
//   );

//   // ----------------------------------------------------------------
//   // Single PATCH mutation for both Member and Admin clan selection
//   // Body shape drives the logic:
//   //   Member Join  → { currentClanMeeting: clanId }
//   //   Member Leave → { currentClanMeeting: null }
//   //   Admin  Join  → { AdmincurrentClanMeeting: clanId }
//   //   Admin  Leave → { AdmincurrentClanMeeting: null }
//   // ----------------------------------------------------------------
//   const updateClanMutation = useMutateData_v2(
//     "api/v1/clan/user/allMyClans",
//     "PATCH",
//     ["allMyClans"],
//     {
//       onSuccess: () => {
//         Toast.show({
//           type: "success",
//           text1: "Clan updated successfully",
//         });
//         dispatch(Get_User_Profle_Fun());
//       },
//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: error?.data?.message || "An error occurred",
//         });
//       },
//     },
//   );

//   // ----------------------------------------------------------------
//   // Pull-to-refresh
//   // ----------------------------------------------------------------
//   const onRefresh = async () => {
//     setRefreshing(true);
//     await Promise.all([refetchallMyClans(), dispatch(Get_User_Profle_Fun())]);
//     setRefreshing(false);
//   };

//   // ----------------------------------------------------------------
//   // Member clan list item
//   // ----------------------------------------------------------------
//   const renderClanItem = ({ item }) => {
//     const isCurrentClan =
//       (get_user_profile_data?.data?.currentClanMeeting?._id ??
//         get_user_profile_data?.data?.currentClanMeeting) === item?._id;

//     return (
//       <View
//         style={{
//           marginVertical: 10,
//           marginHorizontal: 20,
//           padding: 10,
//           borderWidth: 1,
//           borderColor: "#ccc",
//           borderRadius: 8,
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <View style={{ width: "75%" }}>
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
//           <Text>{item?.description}</Text>
//           <Text>Status: {item?.status}</Text>
//           <Text>Email: {item?.email}</Text>
//         </View>

//         <TouchableOpacity
//           style={{
//             backgroundColor: isCurrentClan ? "#dc3545" : "#04973C",
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderRadius: 10,
//           }}
//           onPress={() => {
//             updateClanMutation.mutate({
//               currentClanMeeting: isCurrentClan ? null : item?._id,
//             });
//           }}
//           disabled={updateClanMutation.isPending}
//         >
//           {updateClanMutation.isPending ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <Text style={{ color: "white" }}>
//               {isCurrentClan ? "Leave" : "Join"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // ----------------------------------------------------------------
//   // Admin clan list item
//   // ----------------------------------------------------------------
//   const AdminrenderClanItem = ({ item }) => {
//     const isAdminCurrentClan =
//       (get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ??
//         get_user_profile_data?.data?.AdmincurrentClanMeeting) === item?._id;

//     return (
//       <View
//         style={{
//           marginVertical: 10,
//           marginHorizontal: 20,
//           padding: 10,
//           borderWidth: 1,
//           borderColor: "#ccc",
//           borderRadius: 8,
//           flexDirection: "row",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <View style={{ width: "75%" }}>
//           <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
//           <Text>{item?.description}</Text>
//           <Text>Status: {item?.status}</Text>
//           <Text>Email: {item?.email}</Text>
//         </View>

//         <TouchableOpacity
//           style={{
//             backgroundColor: isAdminCurrentClan ? "#dc3545" : "#04973C",
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderRadius: 10,
//           }}
//           onPress={() => {
//             updateClanMutation.mutate({
//               AdmincurrentClanMeeting: isAdminCurrentClan ? null : item?._id,
//             });
//           }}
//           disabled={updateClanMutation.isPending}
//         >
//           {updateClanMutation.isPending ? (
//             <ActivityIndicator size="small" color="white" />
//           ) : (
//             <Text style={{ color: "white" }}>
//               {isAdminCurrentClan ? "Leave" : "Join"}
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>
//     );
//   };

//   // ----------------------------------------------------------------
//   // Render
//   // ----------------------------------------------------------------
//   return (
//     <View style={{ flex: 1, alignItems: "center" }}>
//       {updateClanMutation.isPending && (
//         <ActivityIndicator
//           size="large"
//           color="#0C1401"
//           style={{
//             position: "absolute",
//             top: 0,
//             bottom: 0,
//             left: 0,
//             right: 0,
//             zIndex: 10,
//           }}
//         />
//       )}

//       {/* Tab toggle */}
//       <View
//         style={{
//           flexDirection: "row",
//           justifyContent: "space-between",
//           marginBottom: 20,
//           borderWidth: 1,
//           borderColor: "#CFCDCD",
//           borderRadius: 6,
//           padding: 10,
//           width: "90%",
//         }}
//       >
//         <TouchableOpacity
//           style={{
//             backgroundColor:
//               activeButton === "Member" ? "#04973C" : "transparent",
//             padding: 10,
//             borderRadius: 5,
//             flex: 1,
//             alignItems: "center",
//           }}
//           onPress={() => setActiveButton("Member")}
//         >
//           <MediumFontText
//             data="Member"
//             textstyle={{
//               fontSize: 16,
//               fontWeight: "500",
//               color: activeButton === "Member" ? "white" : "black",
//             }}
//           />
//         </TouchableOpacity>

//         <TouchableOpacity
//           style={{
//             backgroundColor:
//               activeButton === "Admin" ? "#04973C" : "transparent",
//             padding: 10,
//             borderRadius: 5,
//             flex: 1,
//             alignItems: "center",
//           }}
//           onPress={() => setActiveButton("Admin")}
//         >
//           <MediumFontText
//             data="Admin"
//             textstyle={{
//               fontSize: 16,
//               fontWeight: "500",
//               color: activeButton === "Admin" ? "white" : "black",
//             }}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Member tab */}
//       {activeButton === "Member" && (
//         <>
//           {!allMyClans?.userClans?.length ? (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <LottieView
//                 autoPlay
//                 ref={animation}
//                 style={{ width: 200, height: 200 }}
//                 source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
//               />
//             </View>
//           ) : (
//             <FlatList
//               data={allMyClans?.userClans}
//               keyExtractor={(item) => item._id}
//               renderItem={renderClanItem}
//               style={{ width: "100%" }}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//             />
//           )}
//         </>
//       )}

//       {/* Admin tab */}
//       {activeButton === "Admin" && (
//         <>
//           {!get_all_clan_adminIN_data?.clans_info?.length ? (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//               }}
//             >
//               <LottieView
//                 autoPlay
//                 ref={animation}
//                 style={{ width: 200, height: 200 }}
//                 source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
//               />
//             </View>
//           ) : (
//             <FlatList
//               data={get_all_clan_adminIN_data?.clans_info}
//               keyExtractor={(item) => item._id}
//               renderItem={AdminrenderClanItem}
//               style={{ width: "100%" }}
//               refreshControl={
//                 <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//               }
//             />
//           )}
//         </>
//       )}
//     </View>
//   );
// };

// export default UserClans;

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import LottieView from "lottie-react-native";
import Toast from "react-native-toast-message";

import { Get_User_Profle_Fun } from "../../../Redux/UserSide/UserProfileSlice";
import { MediumFontText } from "../../../components/shared/Paragrahp";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";

const UserClans = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeButton, setActiveButton] = useState("Member");
  const [loadingClanId, setLoadingClanId] = useState(null); // tracks which clan is loading
  const animation = useRef(null);
  const dispatch = useDispatch();

  // ----------------------------------------------------------------
  // Fetch all clans the user belongs to
  // ----------------------------------------------------------------
  const { data: allMyClans, refetch: refetchallMyClans } = useFetchData_v2(
    "api/v1/clan/user/allMyClans",
    "allMyClans",
  );

  const { get_all_clan_adminIN_data } = useSelector(
    (state) => state?.ClanSlice,
  );

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  // ----------------------------------------------------------------
  // Single PATCH mutation for both Member and Admin clan selection
  // Body shape drives the logic:
  //   Member Join  → { currentClanMeeting: clanId }
  //   Member Leave → { currentClanMeeting: null }
  //   Admin  Join  → { AdmincurrentClanMeeting: clanId }
  //   Admin  Leave → { AdmincurrentClanMeeting: null }
  // ----------------------------------------------------------------
  const updateClanMutation = useMutateData_v2(
    "api/v1/clan/user/allMyClans",
    "PATCH",
    ["allMyClans"],
    {
      onSuccess: () => {
        Toast.show({
          type: "success",
          text1: "Clan updated successfully",
        });
        dispatch(Get_User_Profle_Fun());
        setLoadingClanId(null);
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "An error occurred",
        });
        setLoadingClanId(null);
      },
    },
  );

  // ----------------------------------------------------------------
  // Pull-to-refresh
  // ----------------------------------------------------------------
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchallMyClans(), dispatch(Get_User_Profle_Fun())]);
    setRefreshing(false);
  };

  // ----------------------------------------------------------------
  // Member clan list item
  // ----------------------------------------------------------------
  const renderClanItem = ({ item }) => {
    const isCurrentClan =
      (get_user_profile_data?.data?.currentClanMeeting?._id ??
        get_user_profile_data?.data?.currentClanMeeting) === item?._id;

    const isThisLoading = loadingClanId === item?._id;

    return (
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "75%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>Status: {item?.status}</Text>
          <Text>Email: {item?.email}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isCurrentClan ? "#dc3545" : "#04973C",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            setLoadingClanId(item?._id);
            updateClanMutation.mutate({
              currentClanMeeting: isCurrentClan ? null : item?._id,
            });
          }}
          disabled={isThisLoading}
        >
          {isThisLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isCurrentClan ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ----------------------------------------------------------------
  // Admin clan list item
  // ----------------------------------------------------------------
  const AdminrenderClanItem = ({ item }) => {
    const isAdminCurrentClan =
      (get_user_profile_data?.data?.AdmincurrentClanMeeting?._id ??
        get_user_profile_data?.data?.AdmincurrentClanMeeting) === item?._id;

    const isThisLoading = loadingClanId === item?._id;

    return (
      <View
        style={{
          marginVertical: 10,
          marginHorizontal: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ width: "75%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item?.name}</Text>
          <Text>{item?.description}</Text>
          <Text>Status: {item?.status}</Text>
          <Text>Email: {item?.email}</Text>
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: isAdminCurrentClan ? "#dc3545" : "#04973C",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
          }}
          onPress={() => {
            setLoadingClanId(item?._id);
            updateClanMutation.mutate({
              AdmincurrentClanMeeting: isAdminCurrentClan ? null : item?._id,
            });
          }}
          disabled={isThisLoading}
        >
          {isThisLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={{ color: "white" }}>
              {isAdminCurrentClan ? "Leave" : "Join"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  // ----------------------------------------------------------------
  // Render
  // ----------------------------------------------------------------
  return (
    <View style={{ flex: 1, alignItems: "center" }}>
      {loadingClanId !== null && (
        <ActivityIndicator
          size="large"
          color="#0C1401"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        />
      )}

      {/* Tab toggle */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 20,
          borderWidth: 1,
          borderColor: "#CFCDCD",
          borderRadius: 6,
          padding: 10,
          width: "90%",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Member" ? "#04973C" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => setActiveButton("Member")}
        >
          <MediumFontText
            data="Member"
            textstyle={{
              fontSize: 16,
              fontWeight: "500",
              color: activeButton === "Member" ? "white" : "black",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor:
              activeButton === "Admin" ? "#04973C" : "transparent",
            padding: 10,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
          }}
          onPress={() => setActiveButton("Admin")}
        >
          <MediumFontText
            data="Admin"
            textstyle={{
              fontSize: 16,
              fontWeight: "500",
              color: activeButton === "Admin" ? "white" : "black",
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Member tab */}
      {activeButton === "Member" && (
        <>
          {!allMyClans?.userClans?.length ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                autoPlay
                ref={animation}
                style={{ width: 200, height: 200 }}
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
            </View>
          ) : (
            <FlatList
              data={allMyClans?.userClans}
              keyExtractor={(item) => item._id}
              renderItem={renderClanItem}
              style={{ width: "100%" }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}

      {/* Admin tab */}
      {activeButton === "Admin" && (
        <>
          {!get_all_clan_adminIN_data?.clans_info?.length ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LottieView
                autoPlay
                ref={animation}
                style={{ width: 200, height: 200 }}
                source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
              />
            </View>
          ) : (
            <FlatList
              data={get_all_clan_adminIN_data?.clans_info}
              keyExtractor={(item) => item._id}
              renderItem={AdminrenderClanItem}
              style={{ width: "100%" }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          )}
        </>
      )}
    </View>
  );
};

export default UserClans;
