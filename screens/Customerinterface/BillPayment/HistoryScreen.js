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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFetchData } from "../../../hooks/Request";
import { useNavigation } from "@react-navigation/native";
import ReceiptPDF from "./ReceiptPDF";

const { width, height } = Dimensions.get("window");

export default function HistoryScreen() {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const {
    data: history_info,
    isLoading,
    error,
  } = useFetchData("api/captain", "history_info");

  // Open modal with animation
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

  // Close modal with animation
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
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

  // Render each transaction card
  const renderTransactionCard = ({ item, index }) => {
    const { date, time } = formatDate(item.createdAt);

    return (
      <Animated.View
        style={[
          styles.transactionCard,
          {
            opacity: 1,
            transform: [
              {
                translateY: 0,
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => openModal(item)}
          style={styles.cardTouchable}
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
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
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
              <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
              <Text style={styles.dateText}>{date}</Text>
              <Ionicons name="time-outline" size={14} color="#8E8E93" />
              <Text style={styles.timeText}>{time}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Render transaction details modal
  const renderDetailsModal = () => {
    if (!selectedTransaction) return null;

    const { date, time } = formatDate(selectedTransaction.createdAt);

    const transactionData = {
      date: `${date} ${time}`, // "2024-01-15 14:30:00",
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

    console.log({
      jaja: selectedTransaction?.token,
    });

    return (
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        {/* Backdrop */}
        <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={closeModal}
          />
        </Animated.View>

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
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
                <Ionicons name="receipt-outline" size={24} color="#007AFF" />
                <Text style={styles.modalTitle}>Transaction Details</Text>
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#8E8E93" />
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
                  color="#FF9500"
                />
                <DetailCard
                  icon="key-outline"
                  label="Token"
                  value={selectedTransaction.token}
                  color="#34C759"
                  copyable={true}
                />
              </View>
            </View>

            {/* Date & Time Section */}
            <View style={styles.detailSection}>
              <View style={styles.dateTimeDetailContainer}>
                <View style={styles.dateTimeDetailRow}>
                  <Ionicons name="calendar" size={20} color="#007AFF" />
                  <Text style={styles.dateTimeDetailLabel}>Date</Text>
                  <Text style={styles.dateTimeDetailValue}>{date}</Text>
                </View>
                <View style={styles.dateTimeDetailRow}>
                  <Ionicons name="time" size={20} color="#007AFF" />
                  <Text style={styles.dateTimeDetailLabel}>Time</Text>
                  <Text style={styles.dateTimeDetailValue}>{time}</Text>
                </View>
              </View>
            </View>

            {/* Transaction ID */}
            <View style={[styles.detailSection, { marginBottom: 40 }]}>
              <View style={styles.transactionIdContainer}>
                <ReceiptPDF transaction={transactionData} />
                {/* 
                <Text style={styles.transactionIdLabel}>Transaction ID</Text>
                <Text style={styles.transactionIdValue}>
                  {selectedTransaction._id}
                </Text> */}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </Modal>
    );
  };

  // Empty state component
  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="receipt-outline" size={64} color="#C7C7CC" />
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <Text style={styles.headerSubtitle}>
          {history_info?.transactions?.length || 0} transactions
        </Text>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: "100%",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("MakeUtilityPayment")}
            style={{
              backgroundColor: "#007AFF",
              padding: 8,
              borderRadius: 20,
              alignItems: "center",
              position: "absolute",
              top: 10,
              right: 0,
            }}
          >
            <Ionicons name="add" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Transaction List */}
      <FlatList
        data={history_info?.transactions}
        keyExtractor={(item) => item._id}
        renderItem={renderTransactionCard}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Details Modal */}
      {renderDetailsModal()}
    </View>
  );
}

// Detail Card Component
const DetailCard = ({ icon, label, value, color, copyable = false }) => (
  <View style={styles.detailCard}>
    <View style={[styles.detailCardIcon, { backgroundColor: color + "20" }]}>
      <Ionicons name={icon} size={20} color={color} />
    </View>
    <Text style={styles.detailCardLabel}>{label}</Text>
    <Text style={styles.detailCardValue} numberOfLines={copyable ? 2 : 1}>
      {value}
    </Text>
    {copyable && (
      <TouchableOpacity style={styles.copyButton}>
        <Ionicons name="copy-outline" size={16} color="#007AFF" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },

  listContainer: {
    padding: 16,
    flexGrow: 1,
  },

  // Transaction Card Styles
  transactionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  cardTouchable: {
    padding: 20,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  nameContainer: {
    flex: 1,
  },

  customerName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },

  meterId: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },

  cardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  amountContainer: {
    flex: 1,
  },

  amountLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
    fontWeight: "500",
  },

  amountValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#34C759",
  },

  unitsContainer: {
    flex: 1,
    alignItems: "flex-end",
  },

  unitsLabel: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
    fontWeight: "500",
  },

  unitsValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF9500",
  },

  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 12,
  },

  dateTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  dateText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 6,
    marginRight: 16,
    fontWeight: "500",
  },

  timeText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 6,
    fontWeight: "500",
  },

  // Modal Styles
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  },

  modalHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#C7C7CC",
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
    borderBottomColor: "#F2F2F7",
  },

  modalTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginLeft: 8,
  },

  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },

  // Detail Sections
  detailSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },

  customerDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  largeAvatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },

  largeAvatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  customerDetailInfo: {
    flex: 1,
  },

  customerDetailName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },

  customerDetailMeter: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },

  amountDetailContainer: {
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    paddingVertical: 24,
  },

  amountDetailLabel: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 8,
  },

  amountDetailValue: {
    fontSize: 36,
    fontWeight: "700",
    color: "#34C759",
  },

  detailGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },

  detailCard: {
    flex: 1,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    position: "relative",
  },

  detailCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  detailCardLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 4,
    textAlign: "center",
  },

  detailCardValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
  },

  copyButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    justifyContent: "center",
  },

  dateTimeDetailContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },

  dateTimeDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  dateTimeDetailLabel: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },

  dateTimeDetailValue: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "600",
  },

  transactionIdContainer: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
  },

  transactionIdLabel: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    marginBottom: 8,
  },

  transactionIdValue: {
    fontSize: 14,
    color: "#666666",
    fontFamily: "monospace",
    lineHeight: 20,
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
    marginTop: 16,
    marginBottom: 8,
  },

  emptyStateDescription: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 24,
  },
});
