// import { useRoute } from "@react-navigation/native";
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
//   Linking,
//   ScrollView,
// } from "react-native";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import Toast from "react-native-toast-message";

// const PLACEHOLDER_IMAGE =
//   "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

// const VendorService = ({ navigation }) => {
//   const item = useRoute().params?.item;

//   const makePhoneCall = () => {
//     if (item?.phone_number) {

//       console.log("Phone number:", item.phone_number);
//       Linking.openURL(`tel:${item.phone_number}`);
//     } else {
//       Toast.show({
//         type: "error",
//         text1: "Phone number not available",
//       });
//     }
//   };

//   return (
//     <ScrollView
//       style={styles.scrollView}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* ── Hero card ─────────────────────────────────────────────────── */}
//       <View style={styles.heroCard}>
//         <View style={styles.decorativeCircle1} />
//         <View style={styles.decorativeCircle2} />

//         <View style={styles.heroContent}>
//           <Image
//             source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
//             style={styles.avatar}
//           />
//           <Text style={styles.heroName}>{item?.fullName}</Text>

//           {/* Type of job badge */}
//           {item?.typeOfJob ? (
//             <View style={styles.jobBadge}>
//               <MaterialCommunityIcons
//                 name="briefcase-outline"
//                 size={13}
//                 color="#065F46"
//                 style={{ marginRight: 4 }}
//               />
//               <Text style={styles.jobBadgeText}>{item.typeOfJob}</Text>
//             </View>
//           ) : null}

//           {/* Details / bio */}
//           {item?.details ? (
//             <Text style={styles.heroDetails}>{item.details}</Text>
//           ) : null}
//         </View>
//       </View>

//       <View style={styles.container}>

//         {/* ── Contact card ──────────────────────────────────────────────── */}
//         <View style={styles.sectionCard}>
//           <View style={styles.sectionHeader}>
//             <MaterialCommunityIcons
//               name="card-account-details-outline"
//               size={20}
//               color="#10B981"
//               style={{ marginRight: 8 }}
//             />
//             <Text style={styles.sectionTitle}>Contact & Location</Text>
//           </View>

//           {item?.phone_number ? (
//             <View style={styles.infoRow}>
//               <View style={styles.infoIconWrap}>
//                 <MaterialCommunityIcons
//                   name="phone-outline"
//                   size={18}
//                   color="#10B981"
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.infoLabel}>Phone Number</Text>
//                 <Text style={styles.infoValue}>{item.phone_number}</Text>
//               </View>
//             </View>
//           ) : null}

//           {item?.address ? (
//             <View style={styles.infoRow}>
//               <View style={styles.infoIconWrap}>
//                 <MaterialCommunityIcons
//                   name="map-marker-outline"
//                   size={18}
//                   color="#10B981"
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.infoLabel}>Address</Text>
//                 <Text style={styles.infoValue}>{item.address}</Text>
//               </View>
//             </View>
//           ) : null}

//           {item?.origin ? (
//             <View style={[styles.infoRow, { marginBottom: 0 }]}>
//               <View style={styles.infoIconWrap}>
//                 <MaterialCommunityIcons
//                   name="flag-outline"
//                   size={18}
//                   color="#10B981"
//                 />
//               </View>
//               <View style={{ flex: 1 }}>
//                 <Text style={styles.infoLabel}>State of Origin</Text>
//                 <Text style={styles.infoValue}>{item.origin}</Text>
//               </View>
//             </View>
//           ) : null}
//         </View>

//         {/* ── Call button ───────────────────────────────────────────────── */}
//         <TouchableOpacity
//           style={styles.callButton}
//           onPress={makePhoneCall}
//           activeOpacity={0.85}
//         >
//           <MaterialCommunityIcons
//             name="phone"
//             size={22}
//             color="#FFFFFF"
//             style={{ marginRight: 10 }}
//           />
//           <Text style={styles.callButtonText}>Call Now</Text>
//         </TouchableOpacity>

//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   scrollView: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },

//   // ── Hero ──
//   heroCard: {
//     backgroundColor: "#10B981",
//     borderBottomLeftRadius: 32,
//     borderBottomRightRadius: 32,
//     paddingTop: 32,
//     paddingBottom: 32,
//     overflow: "hidden",
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   decorativeCircle1: {
//     position: "absolute",
//     top: -30,
//     right: -30,
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: "rgba(255,255,255,0.1)",
//   },
//   decorativeCircle2: {
//     position: "absolute",
//     bottom: -20,
//     left: -20,
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "rgba(255,255,255,0.08)",
//   },
//   heroContent: {
//     alignItems: "center",
//     paddingHorizontal: 24,
//   },
//   avatar: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     borderWidth: 3,
//     borderColor: "rgba(255,255,255,0.4)",
//     marginBottom: 12,
//     backgroundColor: "#D1FAE5",
//   },
//   heroName: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//     marginBottom: 8,
//     textAlign: "center",
//   },
//   jobBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#D1FAE5",
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 20,
//     marginBottom: 12,
//   },
//   jobBadgeText: {
//     fontSize: 13,
//     fontWeight: "700",
//     color: "#065F46",
//     letterSpacing: 0.3,
//   },
//   heroDetails: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "rgba(255,255,255,0.85)",
//     textAlign: "center",
//     lineHeight: 20,
//   },

//   // ── Content ──
//   container: {
//     padding: 16,
//     paddingTop: 20,
//   },

//   // ── Section card ──
//   sectionCard: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   sectionHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#1F2937",
//     letterSpacing: 0.3,
//   },

//   // ── Info rows ──
//   infoRow: {
//     flexDirection: "row",
//     alignItems: "flex-start",
//     marginBottom: 16,
//   },
//   infoIconWrap: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     backgroundColor: "#D1FAE5",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//     flexShrink: 0,
//   },
//   infoLabel: {
//     fontSize: 11,
//     fontWeight: "500",
//     color: "#6B7280",
//     marginBottom: 3,
//   },
//   infoValue: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#111827",
//     lineHeight: 20,
//   },

//   // ── Call button ──
//   callButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#10B981",
//     paddingVertical: 16,
//     borderRadius: 16,
//     marginTop: 8,
//     marginBottom: 40,
//     shadowColor: "#10B981",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   callButtonText: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#FFFFFF",
//     letterSpacing: 0.3,
//   },
// });

// export default VendorService;


import { useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
useMutateData_v2
import { useQueryClient } from "@tanstack/react-query";
import { useMutateData_v2 ,useFetchData_v2 } from "../../hooks/Requestv2";

const PLACEHOLDER_IMAGE =
  "https://deleoye.ng/wp-content/uploads/2016/11/Dummy-image.jpg";

const VendorService = ({ navigation }) => {
  const item = useRoute().params?.item;
  const queryClient = useQueryClient();

  // ── Rating modal state ────────────────────────────────────────────────
  const [ratingModalVisible, setRatingModalVisible] = useState(false);
  const [selectedStar, setSelectedStar] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // ── Fetch ratings ─────────────────────────────────────────────────────
  const {
    data: ratingsData,
    isLoading: isLoadingRatings,
    refetch: refetchRatings,
  } = useFetchData_v2(`api/v1/artisan/${item?._id}/ratings`, `artisanRatings-${item?._id}`);

  const ratings = ratingsData?.data || [];

  // ── Submit rating mutation ────────────────────────────────────────────
  const { mutate: submitRating, isPending: isSubmitting } = useMutateData_v2(
    `api/v1/artisan/${item?._id}/rate`,
    "POST",
    [`artisanRatings-${item?._id}`, "artisans"],
    {
      onSuccess: (response) => {
        Toast.show({
          type: "success",
          text1: "Rating submitted successfully",
          text2: `New average: ${response?.data?.avgRating} ⭐`,
        });
        setRatingModalVisible(false);
        setSelectedStar(0);
        setReviewText("");
        refetchRatings();
        queryClient.invalidateQueries({ queryKey: ["artisans"] });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: error?.data?.message || "Failed to submit rating",
        });
      },
    },
  );

  const handleSubmitRating = () => {
    if (selectedStar === 0) {
      Toast.show({ type: "error", text1: "Please select a star rating" });
      return;
    }
    submitRating({
      rating: selectedStar,
      ...(reviewText.trim() && { review: reviewText.trim() }),
    });
  };

  const makePhoneCall = () => {
    if (item?.phone_number) {
      Linking.openURL(`tel:${item.phone_number}`);
    } else {
      Toast.show({ type: "error", text1: "Phone number not available" });
    }
  };

  // ── Star display helper ───────────────────────────────────────────────
  const StarDisplay = ({ rating, size = 16, color = "#F59E0B" }) => {
    return (
      <View style={{ flexDirection: "row", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= Math.round(rating) ? "star" : "star-outline"}
            size={size}
            color={star <= Math.round(rating) ? color : "#D1D5DB"}
          />
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* ── Hero card ─────────────────────────────────────────────── */}
        <View style={styles.heroCard}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.heroContent}>
            <Image
              source={{ uri: item?.photoUrl || PLACEHOLDER_IMAGE }}
              style={styles.avatar}
            />
            <Text style={styles.heroName}>{item?.fullName}</Text>

            {item?.typeOfJob ? (
              <View style={styles.jobBadge}>
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={13}
                  color="#065F46"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.jobBadgeText}>{item.typeOfJob}</Text>
              </View>
            ) : null}

            {/* Avg rating in hero */}
            {item?.avgRating > 0 ? (
              <View style={styles.heroRatingRow}>
                <StarDisplay rating={item.avgRating} size={18} color="#FCD34D" />
                <Text style={styles.heroRatingText}>
                  {item.avgRating.toFixed(1)} · {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
                </Text>
              </View>
            ) : null}

            {item?.details ? (
              <Text style={styles.heroDetails}>{item.details}</Text>
            ) : null}
          </View>
        </View>

        <View style={styles.container}>

          {/* ── Contact card ────────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="card-account-details-outline"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Contact & Location</Text>
            </View>

            {item?.phone_number ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <MaterialCommunityIcons name="phone-outline" size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{item.phone_number}</Text>
                </View>
              </View>
            ) : null}

            {item?.address ? (
              <View style={styles.infoRow}>
                <View style={styles.infoIconWrap}>
                  <MaterialCommunityIcons name="map-marker-outline" size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{item.address}</Text>
                </View>
              </View>
            ) : null}

            {item?.origin ? (
              <View style={[styles.infoRow, { marginBottom: 0 }]}>
                <View style={styles.infoIconWrap}>
                  <MaterialCommunityIcons name="flag-outline" size={18} color="#10B981" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.infoLabel}>State of Origin</Text>
                  <Text style={styles.infoValue}>{item.origin}</Text>
                </View>
              </View>
            ) : null}
          </View>

          {/* ── Action buttons ───────────────────────────────────────── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.callButton}
              onPress={makePhoneCall}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rateButton}
              onPress={() => setRatingModalVisible(true)}
              activeOpacity={0.85}
            >
              <MaterialCommunityIcons name="star-outline" size={20} color="#10B981" style={{ marginRight: 8 }} />
              <Text style={styles.rateButtonText}>Rate</Text>
            </TouchableOpacity>
          </View>

          {/* ── Ratings section ──────────────────────────────────────── */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="star-half-full"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>
                Reviews {ratings.length > 0 ? `(${ratings.length})` : ""}
              </Text>
            </View>

            {isLoadingRatings ? (
              <ActivityIndicator size="small" color="#10B981" style={{ paddingVertical: 20 }} />
            ) : ratings.length === 0 ? (
              <View style={styles.noRatings}>
                <MaterialCommunityIcons name="star-outline" size={40} color="#D1D5DB" />
                <Text style={styles.noRatingsText}>No reviews yet</Text>
                <Text style={styles.noRatingsSubtext}>Be the first to rate this artisan</Text>
              </View>
            ) : (
              ratings.map((r, index) => (
                <View
                  key={r._id || index}
                  style={[
                    styles.ratingItem,
                    index === ratings.length - 1 && { borderBottomWidth: 0, marginBottom: 0 },
                  ]}
                >
                  <View style={styles.ratingItemHeader}>
                    <View style={styles.ratingAvatar}>
                      <Text style={styles.ratingAvatarText}>
                        {r?.user?.name?.charAt(0)?.toUpperCase() ||
                         r?.user?.email?.charAt(0)?.toUpperCase() || "U"}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.ratingUserName}>
                        {r?.user?.name || r?.user?.email || "Anonymous"}
                      </Text>
                      <StarDisplay rating={r.rating} size={13} />
                    </View>
                    <Text style={styles.ratingDate}>
                      {new Date(r.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                  {r.review ? (
                    <Text style={styles.ratingReviewText}>{r.review}</Text>
                  ) : null}
                </View>
              ))
            )}
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      {/* ── Rating modal ──────────────────────────────────────────────── */}
      <Modal
        visible={ratingModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setRatingModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Handle */}
            <View style={styles.modalHandle} />

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Rate {item?.fullName}</Text>
              <TouchableOpacity
                onPress={() => setRatingModalVisible(false)}
                style={styles.modalClose}
              >
                <MaterialCommunityIcons name="close" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Stars */}
            <Text style={styles.modalLabel}>Your Rating</Text>
            <View style={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setSelectedStar(star)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={star <= selectedStar ? "star" : "star-outline"}
                    size={40}
                    color={star <= selectedStar ? "#F59E0B" : "#D1D5DB"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {selectedStar > 0 && (
              <Text style={styles.selectedStarLabel}>
                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][selectedStar]}
              </Text>
            )}

            {/* Review text */}
            <Text style={[styles.modalLabel, { marginTop: 16 }]}>
              Review <Text style={{ color: "#9CA3AF", fontWeight: "400" }}>(optional)</Text>
            </Text>
            <TextInput
              style={styles.reviewInput}
              placeholder="Share your experience..."
              placeholderTextColor="#9CA3AF"
              value={reviewText}
              onChangeText={setReviewText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Submit */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                (isSubmitting || selectedStar === 0) && { opacity: 0.6 },
              ]}
              onPress={handleSubmitRating}
              disabled={isSubmitting || selectedStar === 0}
              activeOpacity={0.85}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <MaterialCommunityIcons name="send" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.submitButtonText}>Submit Rating</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: "#F9FAFB" },

  // ── Hero ──
  heroCard: {
    backgroundColor: "#10B981",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingTop: 32,
    paddingBottom: 32,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  decorativeCircle1: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroContent: { alignItems: "center", paddingHorizontal: 24 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    marginBottom: 12,
    backgroundColor: "#D1FAE5",
  },
  heroName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    marginBottom: 8,
    textAlign: "center",
  },
  jobBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  jobBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.3,
  },
  heroRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  heroRatingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
  },
  heroDetails: {
    fontSize: 14,
    fontWeight: "500",
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
  },

  // ── Content ──
  container: { padding: 16, paddingTop: 20 },

  // ── Section card ──
  sectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // ── Info rows ──
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    lineHeight: 20,
  },

  // ── Action buttons ──
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  callButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  callButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  rateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#10B981",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  rateButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 0.3,
  },

  // ── Ratings ──
  noRatings: {
    alignItems: "center",
    paddingVertical: 24,
  },
  noRatingsText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  noRatingsSubtext: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 4,
  },
  ratingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    marginBottom: 4,
  },
  ratingItemHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  ratingAvatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#10B981",
  },
  ratingUserName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 3,
  },
  ratingDate: {
    fontSize: 11,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  ratingReviewText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    lineHeight: 19,
    marginLeft: 46,
  },

  // ── Modal ──
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17, 24, 39, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    flex: 1,
  },
  modalClose: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  modalLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
    letterSpacing: 0.3,
  },
  starPicker: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 8,
  },
  selectedStarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F59E0B",
    textAlign: "center",
    marginBottom: 4,
  },
  reviewInput: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    minHeight: 90,
    marginBottom: 20,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default VendorService;