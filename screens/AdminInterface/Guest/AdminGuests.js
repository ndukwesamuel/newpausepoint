

import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { CenterReuseModals } from "../../../components/shared/ReuseModals";
import TheScan from "../TheScan";
import { useFetchData_v2 } from "../../../hooks/Requestv2";
import { formatDateandTime } from "../../../utils/DateTime";

const STATUS_COLORS = {
  pending:   { bg: "#FEF3C7", text: "#92400E" },
  arrived:   { bg: "#DCFCE7", text: "#166534" },
  departed:  { bg: "#F3F4F6", text: "#374151" },
};

const AdminGuests = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 50;

  const buildUrl = () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (searchQuery.trim()) params.append("search", searchQuery.trim());
    return `api/v1/visitor/estateadmin?${params.toString()}`;
  };

  const {
    data: guestData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useFetchData_v2(buildUrl(), `admin-guests-${page}-${searchQuery}`, {
    keepPreviousData: true,
  });


  console.log({
    iiooo:guestData
  });
  

  const userInvites = guestData?.userInvites || [];
  const pagination = guestData?.pagination || {};

  const onRefresh = () => {
    setPage(1);
    refetch();
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setPage(1);
  };

  const loadMore = () => {
    if (page < pagination.totalPages && !isFetching) {
      setPage((prev) => prev + 1);
    }
  };

  // ── Guest card ────────────────────────────────────────────────────────────
  const GuestCard = ({ item }) => {
    const status = item?.status || "pending";
    const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.pending;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AdminGuestsDetail", { itemdata: item })}
        activeOpacity={0.7}
      >
        {/* Top row — access code + status badge */}
        <View style={styles.cardTopRow}>
          <View style={styles.accessCodeContainer}>
            <MaterialCommunityIcons name="key-variant" size={14} color="#10B981" />
            <Text style={styles.accessCode}>{item?.access_code}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Visitor name */}
        <Text style={styles.visitorName}>{item?.visitor_name}</Text>

        {/* Bottom row — departure + phone */}
        <View style={styles.cardBottomRow}>
          <View style={styles.cardDetail}>
            <MaterialCommunityIcons name="clock-outline" size={13} color="#6B7280" />
            <Text style={styles.cardDetailText}>
              {formatDateandTime(item?.expires)}
            </Text>
          </View>

          <View style={styles.cardDetail}>
            <MaterialCommunityIcons name="phone-outline" size={13} color="#6B7280" />
            <Text style={styles.cardDetailText}>
              {item?.phone_number || "N/A"}
            </Text>
          </View>
        </View>

        {/* Arrow */}
        <MaterialIcons
          name="chevron-right"
          size={20}
          color="#D1D5DB"
          style={styles.cardArrow}
        />
      </TouchableOpacity>
    );
  };

  const renderFooter = () => {
    if (!isFetching) return null;
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading && page === 1) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Loading guests...</Text>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centered}>
          <MaterialCommunityIcons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text style={styles.errorText}>
            {error?.message || "Error loading guests"}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (userInvites.length === 0) {
      return (
        <View style={styles.centered}>
          <LottieView
            autoPlay
            style={{ width: 200, height: 200 }}
            source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
          />
          <Text style={styles.emptyText}>
            {searchQuery ? "No matching guests found" : "No guests yet"}
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={userInvites}
        renderItem={({ item }) => <GuestCard item={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <ScreenWrapper
      title="Estate Guests"
      navigation={navigation}
      headerStyle={{ backgroundColor: "white" }}
    >
      <View style={styles.wrapper}>

        {/* ── Search + QR row ─────────────────────────────────────────── */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <MaterialIcons name="search" size={18} color="#9CA3AF" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by access code or name..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={handleSearch}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => handleSearch("")}>
                <MaterialIcons name="close" size={18} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.qrButton}
            onPress={() => setModalVisible(true)}
          >
            <Image
              source={require("../../../assets/qrcode.png")}
              style={{ width: 22, height: 22 }}
            />
          </TouchableOpacity>
        </View>

        {/* ── Pagination info ──────────────────────────────────────────── */}
        {pagination.totalCount > 0 && (
          <View style={styles.paginationRow}>
            <Text style={styles.paginationText}>
              Page {pagination.page} of {pagination.totalPages}
            </Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>
                {pagination.totalCount} guests
              </Text>
            </View>
          </View>
        )}

        {/* ── Content ──────────────────────────────────────────────────── */}
        <View style={{ flex: 1 }}>
          {renderContent()}
        </View>
      </View>

      {/* ── QR Scanner Modal ─────────────────────────────────────────────── */}
      <CenterReuseModals
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.qrModal}>
          <View style={styles.qrModalHeader}>
            <Text style={styles.qrModalTitle}>Scan QR Code </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <MaterialIcons name="cancel" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <TheScan />
        </View>
      </CenterReuseModals>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // ── Search ──
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    padding: 0,
  },
  qrButton: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // ── Pagination ──
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paginationText: {
    fontSize: 12,
    color: "#6B7280",
  },
  totalBadge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  totalBadgeText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },

  // ── Guest card ──
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  accessCodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  accessCode: {
    fontSize: 15,
    fontWeight: "700",
    color: "#10B981",
    letterSpacing: 1,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  cardBottomRow: {
    flexDirection: "row",
    gap: 16,
  },
  cardDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDetailText: {
    fontSize: 12,
    color: "#6B7280",
  },
  cardArrow: {
    position: "absolute",
    right: 12,
    top: "50%",
  },

  // ── States ──
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },
  errorText: {
    color: "#EF4444",
    marginTop: 12,
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  retryButton: {
    backgroundColor: "#10B981",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyText: {
    marginTop: 12,
    color: "#9CA3AF",
    fontSize: 14,
    textAlign: "center",
  },

  // ── QR Modal ──
  qrModal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    width: "90%",
    height: "80%",
  },
  qrModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  qrModalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
});

export default AdminGuests;