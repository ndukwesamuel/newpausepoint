import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  Dimensions,
  StyleSheet,
  RefreshControl,
  Platform,
} from "react-native";
import { MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ReceiptPDF from "./ReceiptPDF";
import { useFetchData_v2 } from "../../../hooks/Requestv2";

const { width, height } = Dimensions.get("window");

export default function HistoryScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  // ── API — unchanged ────────────────────────────────────────────────────
  const {
    data: history_info,
    isLoading,
    error,
    refetch,
  } = useFetchData_v2("api/v1/captain/electricty_v2", "history_info");

  console.log({
    uuuu: history_info,
  });

  // ── Pull-to-refresh — unchanged ────────────────────────────────────────
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  // ── Modal open/close — unchanged ───────────────────────────────────────
  const openModal = (item) => {
    setSelectedTransaction(item);
    setModalVisible(true);

    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedTransaction(null);
    });
  };

  // ── Formatters — unchanged ─────────────────────────────────────────────
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  // ── Transaction card — redesigned ──────────────────────────────────────
  const renderTransactionCard = ({ item, index }) => {
    const { date, time } = formatDate(item.createdAt);

    return (
      <TouchableOpacity
        onPress={() => openModal(item)}
        style={styles.transactionCard}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.customerInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {item.customerName?.charAt(0)?.toUpperCase() || "C"}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.customerName} numberOfLines={1}>
                {item.customerName}
              </Text>
              <Text style={styles.meterId} numberOfLines={1}>
                Meter: {item.meterId}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="#D1D5DB"
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Amount</Text>
            <Text style={styles.amountValue}>
              {formatCurrency(item.totalAmount)}
            </Text>
          </View>

          <View style={styles.unitsContainer}>
            <Text style={styles.unitsLabel}>Units</Text>
            <Text style={styles.unitsValue}>{item.totalUnit} kWh</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.dateTimeContainer}>
            <MaterialCommunityIcons
              name="calendar-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.dateText}>{date}</Text>
            <MaterialCommunityIcons
              name="clock-outline"
              size={14}
              color="#6B7280"
            />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // ── Details modal — redesigned ─────────────────────────────────────────
  const renderDetailsModal = () => {
    if (!selectedTransaction) return null;

    const { date, time } = formatDate(selectedTransaction.createdAt);

    const transactionData = {
      date: `${date} ${time}`,
      userCode: selectedTransaction?.customerName,
      customerNo: selectedTransaction?.customerId,
      meterNo: selectedTransaction?.meterId,
      activity: "Electricity Purchase",
      district: "Ajah",
      accountNo: "ACC789012",
      paymentMethod: "Online Payment",
      address: selectedTransaction?.customerAddress,
      value: selectedTransaction?.totalUnit + selectedTransaction?.unit,
      token: selectedTransaction?.token,
      vat: "",
      totalFees: "",
      amountPaid: selectedTransaction?.totalAmount,
      netValue: selectedTransaction?.totalAmount,
    };

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.modalHandle} />

          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalTitleContainer}>
                <MaterialCommunityIcons
                  name="receipt-text-outline"
                  size={20}
                  color="#10B981"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.modalTitle}>Transaction Details</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <MaterialCommunityIcons
                  name="close"
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>

            {/* Customer Section */}
            <View style={styles.detailSection}>
              <View style={styles.customerDetailHeader}>
                <View style={styles.largeAvatarContainer}>
                  <Text style={styles.largeAvatarText}>
                    {selectedTransaction.customerName
                      ?.charAt(0)
                      ?.toUpperCase() || "C"}
                  </Text>
                </View>
                <View style={styles.customerDetailInfo}>
                  <Text style={styles.customerDetailName}>
                    {selectedTransaction.customerName}
                  </Text>
                  <Text style={styles.customerDetailMeter}>
                    Meter ID: {selectedTransaction.meterId}
                  </Text>
                </View>
              </View>
            </View>

            {/* Amount Section */}
            <View style={styles.detailSection}>
              <View style={styles.amountDetailContainer}>
                <Text style={styles.amountDetailLabel}>Total Amount</Text>
                <Text style={styles.amountDetailValue}>
                  {formatCurrency(selectedTransaction.totalAmount)}
                </Text>
              </View>
            </View>

            {/* Details Grid */}
            <View style={styles.detailSection}>
              <View style={styles.detailGrid}>
                <DetailCard
                  icon="flash-outline"
                  label="Units Purchased"
                  value={`${selectedTransaction.totalUnit} kWh`}
                  bg="#FEF3C7"
                  iconColor="#F59E0B"
                />
                <DetailCard
                  icon="key-outline"
                  label="Token"
                  value={selectedTransaction.token}
                  bg="#D1FAE5"
                  iconColor="#10B981"
                  copyable={true}
                />
              </View>
            </View>

            {/* Date & Time Section */}
            <View style={styles.detailSection}>
              <View style={styles.dateTimeDetailContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="calendar-clock"
                    size={20}
                    color="#10B981"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.sectionTitle}>Date &amp; Time</Text>
                </View>
                <View style={styles.dateTimeDetailRow}>
                  <View style={styles.dateTimeIconWrap}>
                    <MaterialCommunityIcons
                      name="calendar"
                      size={18}
                      color="#3B82F6"
                    />
                  </View>
                  <Text style={styles.dateTimeDetailLabel}>Date</Text>
                  <Text style={styles.dateTimeDetailValue}>{date}</Text>
                </View>
                <View style={[styles.dateTimeDetailRow, { marginBottom: 0 }]}>
                  <View style={styles.dateTimeIconWrap}>
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={18}
                      color="#3B82F6"
                    />
                  </View>
                  <Text style={styles.dateTimeDetailLabel}>Time</Text>
                  <Text style={styles.dateTimeDetailValue}>{time}</Text>
                </View>
              </View>
            </View>

            {/* Receipt */}
            <View style={[styles.detailSection, { marginBottom: 40 }]}>
              <View style={styles.transactionIdContainer}>
                <ReceiptPDF transaction={transactionData} />
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  };

  // ── Empty state — redesigned ───────────────────────────────────────────
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyStateIconWrap}>
        <MaterialCommunityIcons
          name="receipt-text-outline"
          size={40}
          color="#10B981"
        />
      </View>
      <Text style={styles.emptyStateTitle}>No Transactions</Text>
      <Text style={styles.emptyStateDescription}>
        Your transaction history will appear here once you make your first
        purchase.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleRow}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
            }}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <AntDesign name="arrowleft" size={22} color="#111827" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Transaction History</Text>
            <Text style={styles.headerSubtitle}>
              {history_info?.transactions?.length || 0} transactions
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("MakeUtilityPayment")}
            style={styles.addButton}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List with Pull-to-Refresh */}
      <FlatList
        data={history_info?.transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransactionCard}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={["#10B981"]}
            title="Pull to refresh"
            titleColor="#6B7280"
          />
        }
      />

      {/* Details Modal */}
      {renderDetailsModal()}
    </View>
  );
}

// ── Detail Card — redesigned ─────────────────────────────────────────────
const DetailCard = ({ icon, label, value, bg, iconColor, copyable = false }) => (
  <View style={styles.detailCard}>
    <View style={[styles.detailCardIcon, { backgroundColor: bg }]}>
      <MaterialCommunityIcons name={icon} size={22} color={iconColor} />
    </View>
    <Text style={styles.detailCardLabel}>{label}</Text>
    <Text style={styles.detailCardValue} numberOfLines={copyable ? 2 : 1}>
      {value}
    </Text>
    {copyable && (
      <TouchableOpacity style={styles.copyButton}>
        <MaterialCommunityIcons
          name="content-copy"
          size={14}
          color="#10B981"
        />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  // ── Header ──
  headerCard: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
    marginTop: 2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 40,
    flexGrow: 1,
  },

  // ── Transaction Card ──
  transactionCard: {
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

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
  },

  nameContainer: {
    flex: 1,
  },

  customerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
    letterSpacing: 0.3,
  },

  meterId: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  amountContainer: {
    flex: 1,
  },

  amountLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },

  amountValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#10B981",
  },

  unitsContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  unitsLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 4,
    fontWeight: "500",
  },

  unitsValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#F59E0B",
  },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },

  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    marginRight: 16,
    fontWeight: "500",
  },

  timeText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 6,
    fontWeight: "500",
  },

  // ── Modal ──
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(17, 24, 39, 0.5)",
  },

  backdropTouchable: {
    flex: 1,
  },

  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },

  modalContent: {
    flex: 1,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Detail Sections ──
  detailSection: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  customerDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  largeAvatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  largeAvatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#10B981",
  },

  customerDetailInfo: {
    flex: 1,
  },

  customerDetailName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  customerDetailMeter: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  amountDetailContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  amountDetailLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 8,
  },

  amountDetailValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#10B981",
  },

  detailGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  detailCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  detailCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  detailCardLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },

  detailCardValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },

  copyButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
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

  dateTimeDetailContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  dateTimeIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  dateTimeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  dateTimeDetailLabel: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
    flex: 1,
  },

  dateTimeDetailValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },

  transactionIdContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // ── Empty State ──
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyStateIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  emptyStateDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});