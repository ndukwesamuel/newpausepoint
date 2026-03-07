import AppScreen from "../../../components/shared/AppScreen";
import {
  View,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  TextInput,
  RefreshControl,
  Linking,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import LottieView from "lottie-react-native";

import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons, AntDesign } from "@expo/vector-icons";

import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { formatDateandTime } from "../../../utils/DateTime";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
import ClickToJoinCLan from "../../../components/shared/ClickToJoinCLan";
import GuestAdCard from "./GuestAdCard";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

// Sample Advertisement Data for Guest Screen
const guestAdvertisements = [
  {
    id: "guest_ad_1",
    title: "Smart Door Locks",
    description:
      "Upgrade your security with keyless entry. Perfect for managing guests!",
    imageUrl:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "lock-smart",
  },
  {
    id: "guest_ad_2",
    title: "Guest WiFi Setup",
    description:
      "Secure guest network installation. Keep your main network safe.",
    imageUrl:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "wifi",
  },
  {
    id: "guest_ad_3",
    title: "Home Security System",
    description: "24/7 monitoring with guest access codes. Free installation!",
    imageUrl:
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "shield-home",
  },
  {
    id: "guest_ad_4",
    title: "Property Management",
    description:
      "Professional guest management services for landlords and hosts.",
    imageUrl:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "home-city",
  },
  {
    id: "guest_ad_5",
    title: "Cleaning Services",
    description:
      "Pre and post-guest cleaning. Book your first clean at 30% off!",
    imageUrl:
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "broom",
  },
  {
    id: "guest_ad_6",
    title: "Visitor Parking Pass",
    description:
      "Digital parking passes for your guests. Easy setup, instant delivery.",
    imageUrl:
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=80",
    linkUrl: "https://www.pausepoint.net/",
    iconName: "car",
  },
];

const Guests = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const animation = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query instead of Redux
  const {
    data: guestData,
    isLoading: isLoadingGuests,
    isError: isErrorGuests,
    error: errorGuests,
    refetch: refetchGuests,
  } = useFetchData_v2("api/v1/visitor", "userGuests");

  const { get_user_profile_data } = useSelector(
    (state) => state?.UserProfileSlice,
  );

  console.log({
    itititi: get_user_profile_data?.data,
  });

  console.log({
    guestData: guestData,
  });

  // Filter data based on search query
  const filteredData = guestData?.userInvites?.filter((item) =>
    item.visitor_name?.toLowerCase().includes(searchQuery?.toLowerCase()),
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchGuests(); // Refetch guests using React Query
    dispatch(UserProfile_data_Fun()); // Keep profile refresh
    setRefreshing(false);
  };

  // Function to insert ads into guest list (every 3 guests)
  const getGuestDataWithAds = () => {
    if (!filteredData || filteredData.length === 0) return [];

    const dataWithAds = [];
    let adIndex = 0;

    filteredData.forEach((guest, index) => {
      // Add the guest
      dataWithAds.push({ type: "guest", data: guest });

      // Add an ad after every 3 guests
      if ((index + 1) % 3 === 0 && adIndex < guestAdvertisements.length) {
        dataWithAds.push({
          type: "ad",
          data: guestAdvertisements[adIndex % guestAdvertisements.length],
        });
        adIndex++;
      }
    });

    return dataWithAds;
  };

  const HistoryItem = ({ itemdata }) => {
    return (
      <TouchableOpacity
        style={styles.guestCard}
        onPress={() => {
          navigation.navigate("guestsdetail", { itemdata });
        }}
      >
        {/* Guest Icon */}
        <View style={styles.guestIconContainer}>
          <MaterialCommunityIcons name="account" size={32} color="#3B82F6" />
        </View>

        {/* Guest Details */}
        <View style={styles.guestDetailsContainer}>
          {/* Top Row - Code and Name */}
          <View style={styles.guestTopRow}>
            <View style={styles.guestInfoBlock}>
              <Text style={styles.guestPrimaryText}>
                {itemdata?.access_code}
              </Text>
              <Text style={styles.guestSecondaryText}>Access Code</Text>
            </View>

            <View style={styles.statusBadge}>
              <Text style={styles.statusBadgeText}>ACTIVE</Text>
            </View>
          </View>

          {/* Visitor Name */}
          <View style={styles.guestNameRow}>
            <MaterialCommunityIcons
              name="account-circle"
              size={16}
              color="#6B7280"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.guestNameText}>{itemdata?.visitor_name}</Text>
          </View>

          {/* Bottom Row - Phone and Expiry */}
          <View style={styles.guestBottomRow}>
            <View style={styles.guestInfoItem}>
              <MaterialCommunityIcons
                name="phone"
                size={14}
                color="#6B7280"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.guestInfoText}>{itemdata?.phone_number}</Text>
            </View>

            <View style={styles.guestInfoItem}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#6B7280"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.guestInfoText}>
                {formatDateandTime(itemdata?.expires)}
              </Text>
            </View>
          </View>
        </View>

        {/* Chevron */}
        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color="#D1D5DB"
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    if (item.type === "ad") {
      return <GuestAdCard ad={item.data} />;
    }

    // Regular guest rendering
    return <HistoryItem itemdata={item.data} />;
  };

  // Show loading state
  if (isLoadingGuests) {
    return (
      <AppScreen>
        <View style={styles.loadingContainer}>
          <LottieView
            autoPlay
            ref={animation}
            style={styles.emptyStateAnimation}
            source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
          />
          <Text style={styles.loadingText}>Loading guests...</Text>
        </View>
      </AppScreen>
    );
  }

  // Show error state
  if (isErrorGuests) {
    return (
      <AppScreen>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color="#EF4444"
          />
          <Text style={styles.errorText}>Failed to load guests</Text>
          <Text style={styles.errorSubtext}>
            {errorGuests?.message || "Please try again"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetchGuests}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </AppScreen>
    );
  }

  return (
    <AppScreen>
      {get_user_profile_data?.data?.currentClanMeeting ? (
        <View style={styles.scrollView}>
          <View style={styles.container}>
            {/* Header Section */}
            <View style={styles.headerCard}>
              <View style={styles.headerContent}>
                <View style={styles.headerTitleRow}>
                  <MaterialCommunityIcons
                    name="account-group"
                    size={24}
                    color="#10B981"
                    style={{ marginRight: 12 }}
                  />
                  <View>
                    <Text style={styles.headerTitle}>Guest Management</Text>
                    <Text style={styles.headerSubtitle}>
                      {filteredData?.length || 0} active guests
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Search Section */}
            <View style={styles.searchCard}>
              <View style={styles.searchInputContainer}>
                <MaterialCommunityIcons
                  name="magnify"
                  size={20}
                  color="#6B7280"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by visitor name..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={(text) => setSearchQuery(text)}
                />
                {searchQuery !== "" && (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <MaterialCommunityIcons
                      name="close-circle"
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Guest List Section with Ads */}
            <View style={styles.guestListCard}>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="clipboard-list"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.sectionTitle}>Guest List</Text>
              </View>

              {filteredData?.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <LottieView
                    autoPlay
                    ref={animation}
                    style={styles.emptyStateAnimation}
                    source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                  />
                  <Text style={styles.emptyStateTitle}>No guests found</Text>
                  <Text style={styles.emptyStateSubtitle}>
                    {searchQuery
                      ? "Try adjusting your search"
                      : "Invite guests to get started"}
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={getGuestDataWithAds()}
                  keyExtractor={(item, index) =>
                    item.type === "ad"
                      ? `ad-${item.data.id}-${index}`
                      : `guest-${item.data._id || index}`
                  }
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                      tintColor="#10B981"
                    />
                  }
                  renderItem={renderItem}
                />
              )}
            </View>
          </View>

          {/* Floating Action Button */}
          <View
            style={{ position: "absolute", right: 20, top: 320, zIndex: 1 }}
          >
            <TouchableOpacity
              style={styles.fab}
              onPress={() => navigation.navigate("inviteguest")}
            >
              <MaterialCommunityIcons name="plus" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.noAccessContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#10B981"
            />
          }
        >
          <View style={styles.noAccessCard}>
            <View style={styles.noAccessIconContainer}>
              <MaterialCommunityIcons
                name="account-alert-outline"
                size={64}
                color="#EF4444"
              />
            </View>

            <Text style={styles.noAccessTitle}>Access Required</Text>
            <Text style={styles.noAccessSubtitle}>
              You need to be part of a clan to view and manage guest
              invitations. Please contact IT support for assistance.
            </Text>
          </View>
        </ScrollView>
      )}
    </AppScreen>
  );
};

export default Guests;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#10B981",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Header Card
  headerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 4,
  },

  // Search Card
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },

  // Guest List Card
  guestListCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Guest Card
  guestCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  guestIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  guestDetailsContainer: {
    flex: 1,
  },
  guestTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  guestInfoBlock: {
    flex: 1,
  },
  guestPrimaryText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  guestSecondaryText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#065F46",
    letterSpacing: 0.5,
  },
  guestNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  guestNameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  guestBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  guestInfoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  guestInfoText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Empty State
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateAnimation: {
    width: 160,
    height: 160,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    letterSpacing: 0.3,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },

  // Floating Action Button
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  // No Access State
  noAccessContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
  },
  noAccessCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    maxWidth: 400,
  },
  noAccessIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  noAccessTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
    marginTop: 16,
    textAlign: "center",
  },
  noAccessSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    marginTop: 12,
    textAlign: "center",
    lineHeight: 20,
  },
});
