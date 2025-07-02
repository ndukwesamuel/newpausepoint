// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
//   RefreshControl,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useRoute } from "@react-navigation/native";
// import { MaterialIcons } from "@expo/vector-icons";
// import { AntDesign } from "@expo/vector-icons";
// import { useMutation } from "react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import {
//   Get_All_Polls_Fun,
//   Get_Single_Polls_Fun,
// } from "../../../Redux/UserSide/PollSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigation } from "@react-navigation/native";
// const UserPollDetails = () => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const { itemdata } = useRoute()?.params;
//   const { user_data } = useSelector((state) => state.AuthSlice);
//   const [loading, setLoading] = useState(true);
//   const { get_all_poll_data, get_single_poll_data } = useSelector(
//     (state) => state.PollSlice
//   );

//   useEffect(() => {
//     dispatch(Get_Single_Polls_Fun(itemdata?._id));
//     setLoading(false);

//     return () => {};
//   }, [dispatch, Vote_Mutation]);

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = () => {
//     // Set the refreshing state to true
//     setRefreshing(true);
//     dispatch(Get_Single_Polls_Fun(itemdata?._id));

//     // Wait for 2 seconds
//     setRefreshing(false);
//   };

//   let totalVotes = 0;

//   get_single_poll_data?.data?.options?.forEach((option) => {
//     totalVotes += option.votes;
//   });

//   console.log({
//     totalVotes,
//   });

//   function calculateTotalVotes(data) {
//     let totalVotes = {};

//     // return totalVotes;
//   }

//   const Vote_Mutation = useMutation(
//     (data_info) => {
//       let url = `${API_BASEURL}poll/${itemdata?._id}/vote`;

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
//           text1: "Post Created  successfully ",
//         });

//         dispatch(Get_All_Polls_Fun());
//         dispatch(Get_Single_Polls_Fun(itemdata?._id));

//         // navigation.goBack();
//       },

//       onError: (error) => {
//         Toast.show({
//           type: "error",
//           text1: `${error?.response?.data?.message} `,
//           //   text2: ` ${error?.response?.data?.errorMsg} `,
//         });
//       },
//     }
//   );

//   const castVote = (optionIndex) => {
//     Vote_Mutation.mutate({
//       optionIndex: optionIndex,
//     });
//     // Perform your vote casting logic here
//     // Alert.alert("Vote Casted", `You voted for ${options[optionIndex].text}`);
//     // In a real application, you would send a request to your backend to record the vote
//   };
//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       {Vote_Mutation?.isLoading && (
//         <ActivityIndicator size="large" color="green" />
//       )}

//       <View style={{ flex: 1 }}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#0000ff" />
//         ) : (
//           <VoteScreen
//             mainoptions={get_single_poll_data?.data}
//             castVote={castVote}
//           />
//         )}
//       </View>

//       <View
//         style={{
//           flex: 1,
//           justifyContent: "center",
//           alignItems: "center",
//           paddingHorizontal: 20,
//           backgroundColor: "#fff",
//         }}
//       >
//         <Text
//           style={{
//             fontSize: 20,
//             fontWeight: "bold",
//             marginBottom: 20,
//             // textAlign: "center",
//           }}
//         >
//           Total Votes: {totalVotes}
//         </Text>
//       </View>
//     </ScrollView>
//   );
// };

// export default UserPollDetails;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // justifyContent: "center",
//     // alignItems: "center",
//     paddingHorizontal: 20,
//     backgroundColor: "#fff",
//   },
//   questionText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   optionButton: {
//     backgroundColor: "#f0f0f0",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     marginVertical: 10,
//     borderRadius: 10,
//   },
//   optionText: {
//     fontSize: 18,
//     color: "#333",
//   },
//   textInput: {
//     width: "100%",
//     height: 100,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginTop: 20,
//   },
// });

// // import React, { useState } from "react";
// // import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// export function VoteScreen({ mainoptions, castVote }) {
//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleVote = () => {
//     if (selectedOption !== null) {
//       castVote(selectedOption);
//     }
//   };

//   return (
//     <View
//       style={{
//         // flex: 1,
//         // justifyContent: "center",
//         // alignItems: "center",
//         paddingHorizontal: 20,
//       }}
//     >
//       <Text
//         style={{
//           fontSize: 20,
//           marginBottom: 20,
//           textAlign: "center",
//         }}
//       >
//         {mainoptions?.question}
//       </Text>

//       {mainoptions?.options?.map((option, index) => (
//         <TouchableOpacity
//           key={option.text}
//           style={[
//             {
//               backgroundColor: "#e0e0e0",
//               padding: 10,
//               marginBottom: 10,
//               borderRadius: 5,
//               minWidth: 200,
//               //   alignItems: "center",
//             },
//             selectedOption === index && { backgroundColor: "#b3e5fc" },
//           ]}
//           onPress={() => setSelectedOption(index)}
//         >
//           <View
//             style={{
//               flexDirection: "row",
//               gap: 10,
//               justifyContent: "space-between",
//             }}
//           >
//             <Text
//               style={{
//                 fontSize: 16,
//               }}
//             >
//               {option.text}
//             </Text>

//             <Text
//               style={{
//                 fontSize: 16,
//               }}
//             >
//               {option.votes}
//             </Text>
//           </View>
//         </TouchableOpacity>
//       ))}
//       <TouchableOpacity
//         style={{
//           backgroundColor: "#2196F3",
//           padding: 10,
//           borderRadius: 5,
//           minWidth: 200,
//           alignItems: "center",
//           marginTop: 20,
//         }}
//         onPress={handleVote}
//         disabled={selectedOption === null}
//       >
//         <Text
//           style={{
//             fontSize: 18,
//             color: "white",
//           }}
//         >
//           Vote
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import {
  Get_All_Polls_Fun,
  Get_Single_Polls_Fun,
} from "../../../Redux/UserSide/PollSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const UserPollDetails = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { itemdata } = useRoute()?.params;
  const { user_data } = useSelector((state) => state.AuthSlice);
  const [loading, setLoading] = useState(true);
  const { get_all_poll_data, get_single_poll_data } = useSelector(
    (state) => state.PollSlice
  );

  useEffect(() => {
    dispatch(Get_Single_Polls_Fun(itemdata?._id));
    setLoading(false);
    return () => {};
  }, [dispatch, Vote_Mutation]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(Get_Single_Polls_Fun(itemdata?._id));
    setRefreshing(false);
  };

  let totalVotes = 0;
  get_single_poll_data?.data?.options?.forEach((option) => {
    totalVotes += option.votes;
  });

  const Vote_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}poll/${itemdata?._id}/vote`;
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
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Vote cast successfully!",
        });
        dispatch(Get_All_Polls_Fun());
        dispatch(Get_Single_Polls_Fun(itemdata?._id));
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.message}`,
        });
      },
    }
  );

  const castVote = (optionIndex) => {
    Vote_Mutation.mutate({
      optionIndex: optionIndex,
    });
  };

  const LoadingOverlay = () => (
    <View style={styles.loadingOverlay}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Casting your vote...</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#4A90E2"]}
            tintColor="#4A90E2"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.initialLoadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Loading poll details...</Text>
          </View>
        ) : (
          <>
            <VoteScreen
              mainoptions={get_single_poll_data?.data}
              castVote={castVote}
              totalVotes={totalVotes}
              isVoting={Vote_Mutation?.isLoading}
            />
          </>
        )}
      </ScrollView>

      {Vote_Mutation?.isLoading && <LoadingOverlay />}
    </View>
  );
};

export default UserPollDetails;

export function VoteScreen({ mainoptions, castVote, totalVotes, isVoting }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const animatedValues = useRef(
    mainoptions?.options?.map(() => new Animated.Value(0)) || []
  ).current;

  useEffect(() => {
    // Animate progress bars
    mainoptions?.options?.forEach((option, index) => {
      const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
      Animated.timing(animatedValues[index], {
        toValue: percentage,
        duration: 1000,
        useNativeDriver: false,
      }).start();
    });
  }, [mainoptions?.options, totalVotes]);

  const handleVote = () => {
    if (selectedOption !== null && !isVoting) {
      castVote(selectedOption);
    }
  };

  const getOptionPercentage = (votes) => {
    return totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : 0;
  };

  const getLeadingOption = () => {
    if (!mainoptions?.options || mainoptions.options.length === 0) return null;
    return mainoptions.options.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  const leadingOption = getLeadingOption();

  return (
    <View style={styles.voteContainer}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.pollIconContainer}>
          <Ionicons name="bar-chart" size={24} color="#4A90E2" />
        </View>
        <Text style={styles.questionText}>{mainoptions?.question}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalVotes}</Text>
            <Text style={styles.statLabel}>Total Votes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {mainoptions?.options?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Options</Text>
          </View>
        </View>
      </View>

      {/* Leading Option Banner */}
      {totalVotes > 0 && leadingOption && (
        <View style={styles.leadingBanner}>
          <Ionicons name="trophy" size={20} color="#FFD700" />
          <Text style={styles.leadingText}>
            "{leadingOption.text}" is currently leading with{" "}
            {leadingOption.votes} votes
          </Text>
        </View>
      )}

      {/* Options List */}
      <View style={styles.optionsContainer}>
        <Text style={styles.sectionTitle}>Cast Your Vote</Text>

        {mainoptions?.options?.map((option, index) => {
          const percentage = getOptionPercentage(option.votes);
          const isSelected = selectedOption === index;
          const isLeading =
            leadingOption &&
            option.text === leadingOption.text &&
            totalVotes > 0;

          return (
            <TouchableOpacity
              key={`${option.text}-${index}`}
              style={[
                styles.optionCard,
                isSelected && styles.selectedOption,
                isLeading && styles.leadingOptionCard,
              ]}
              onPress={() => setSelectedOption(index)}
              disabled={isVoting}
              activeOpacity={0.7}
            >
              <View style={styles.optionContent}>
                <View style={styles.optionHeader}>
                  <View style={styles.optionLeft}>
                    <View
                      style={[
                        styles.radioButton,
                        isSelected && styles.radioButtonSelected,
                      ]}
                    >
                      {isSelected && <View style={styles.radioButtonInner} />}
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                        isLeading && styles.leadingOptionText,
                      ]}
                    >
                      {option.text}
                    </Text>
                  </View>

                  <View style={styles.optionRight}>
                    {isLeading && (
                      <Ionicons name="trending-up" size={16} color="#4CAF50" />
                    )}
                    <Text
                      style={[
                        styles.voteCount,
                        isLeading && styles.leadingVoteCount,
                      ]}
                    >
                      {option.votes}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBackground}>
                    <Animated.View
                      style={[
                        styles.progressBar,
                        {
                          width: animatedValues[index]?.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0%", "100%"],
                            extrapolate: "clamp",
                          }),
                          backgroundColor: isLeading
                            ? "#4CAF50"
                            : isSelected
                            ? "#4A90E2"
                            : "#E0E0E0",
                        },
                      ]}
                    />
                  </View>
                  <Text
                    style={[
                      styles.percentageText,
                      isLeading && styles.leadingPercentage,
                    ]}
                  >
                    {percentage}%
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Vote Button */}
      <View style={styles.voteButtonContainer}>
        <TouchableOpacity
          style={[
            styles.voteButton,
            selectedOption === null && styles.voteButtonDisabled,
            isVoting && styles.voteButtonLoading,
          ]}
          onPress={handleVote}
          disabled={selectedOption === null || isVoting}
          activeOpacity={0.8}
        >
          {isVoting ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.voteButtonText}>Cast Vote</Text>
            </>
          )}
        </TouchableOpacity>

        {selectedOption !== null && (
          <Text style={styles.selectedOptionIndicator}>
            You selected: "{mainoptions?.options[selectedOption]?.text}"
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  initialLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 100,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontFamily: "Inter-Medium",
  },
  voteContainer: {
    padding: 20,
  },
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: "center",
  },
  pollIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  questionText: {
    fontSize: 20,
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    color: "#1C1C1E",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: "Inter-Bold",
    fontWeight: "700",
    color: "#4A90E2",
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Inter-Medium",
    color: "#8E8E93",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
  },
  leadingBanner: {
    backgroundColor: "#FFF3CD",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  leadingText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#856404",
    marginLeft: 8,
    flex: 1,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    color: "#1C1C1E",
    marginBottom: 16,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedOption: {
    borderColor: "#4A90E2",
    backgroundColor: "#F0F8FF",
  },
  leadingOptionCard: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8E9",
  },
  optionContent: {
    flex: 1,
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#4A90E2",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4A90E2",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Inter-Medium",
    color: "#1C1C1E",
    flex: 1,
  },
  selectedOptionText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  leadingOptionText: {
    color: "#2E7D32",
    fontWeight: "600",
  },
  optionRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  voteCount: {
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    color: "#8E8E93",
    marginLeft: 4,
  },
  leadingVoteCount: {
    color: "#4CAF50",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginRight: 12,
  },
  progressBar: {
    height: "100%",
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 14,
    fontFamily: "Inter-Medium",
    color: "#8E8E93",
    minWidth: 40,
    textAlign: "right",
  },
  leadingPercentage: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  voteButtonContainer: {
    alignItems: "center",
  },
  voteButton: {
    backgroundColor: "#4A90E2",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    minWidth: 160,
    shadowColor: "#4A90E2",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  voteButtonDisabled: {
    backgroundColor: "#C7C7CC",
    shadowOpacity: 0,
    elevation: 0,
  },
  voteButtonLoading: {
    backgroundColor: "#4A90E2",
  },
  voteButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Inter-SemiBold",
    fontWeight: "600",
    marginLeft: 8,
  },
  selectedOptionIndicator: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: "Inter-Regular",
    color: "#4A90E2",
    textAlign: "center",
  },
});
