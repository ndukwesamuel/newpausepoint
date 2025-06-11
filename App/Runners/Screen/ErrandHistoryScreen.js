import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrandHistoryScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedErrand, setSelectedErrand] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const filters = [
    { key: "all", label: "All", count: 234 },
    { key: "completed", label: "Completed", count: 226 },
    { key: "cancelled", label: "Cancelled", count: 8 },
  ];

  const errandHistory = [
    {
      id: "1",
      title: "Grocery Shopping",
      customer: "Sarah Johnson",
      date: "2024-06-09",
      time: "14:30",
      status: "completed",
      payment: 2500,
      rating: 5,
      customerFeedback: "Excellent service! Very professional and quick.",
      pickupAddress: "Shoprite, Victoria Island",
      deliveryAddress: "15 Ademola Street, Victoria Island",
      duration: "45 minutes",
      distance: "2.3 km",
    },
    {
      id: "2",
      title: "Document Pickup",
      customer: "Michael Adebayo",
      date: "2024-06-09",
      time: "11:15",
      status: "completed",
      payment: 1800,
      rating: 4,
      customerFeedback: "Good job, but could have been faster.",
      pickupAddress: "First Bank, Ikoyi",
      deliveryAddress: "23 Awolowo Road, Ikoyi",
      duration: "30 minutes",
      distance: "1.5 km",
    },
    {
      id: "3",
      title: "Food Delivery",
      customer: "Company Ltd",
      date: "2024-06-08",
      time: "13:45",
      status: "completed",
      payment: 1200,
      rating: 5,
      customerFeedback: "Perfect timing for lunch delivery!",
      pickupAddress: "KFC, Lekki Phase 1",
      deliveryAddress: "Landmark Towers, Victoria Island",
      duration: "25 minutes",
      distance: "3.1 km",
    },
    {
      id: "4",
      title: "Pharmacy Run",
      customer: "Mrs. Okafor",
      date: "2024-06-08",
      time: "16:20",
      status: "completed",
      payment: 1500,
      rating: 5,
      customerFeedback: "Thank you for the careful handling of medications.",
      pickupAddress: "HealthPlus Pharmacy, Ikeja",
      deliveryAddress: "12 Opebi Road, Ikeja",
      duration: "35 minutes",
      distance: "4.2 km",
    },
    {
      id: "5",
      title: "Package Delivery",
      customer: "David Smith",
      date: "2024-06-07",
      time: "10:00",
      status: "cancelled",
      payment: 2000,
      rating: null,
      customerFeedback: "Cancelled due to unforeseen circumstances.",
      pickupAddress: "DHL Office, Lagos Island",
      deliveryAddress: "8 Marina Road, Lagos Island",
      duration: "N/A",
      distance: "5.0 km",
    },
  ];

  const filteredErrands = errandHistory.filter((errand) => {
    const matchesSearch =
      errand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      errand.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilter === "all" || errand.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const openErrandDetails = (errand) => {
    setSelectedErrand(errand);
    setIsDetailModalVisible(true);
  };

  const closeErrandDetails = () => {
    setIsDetailModalVisible(false);
    setSelectedErrand(null);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Text key={i} style={styles.star}>
            {i < rating ? "★" : "☆"}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Errand History</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search errands..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.key}
            style={[
              styles.filterButton,
              selectedFilter === filter.key && styles.selectedFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter.key)}
          >
            <Text
              style={[
                styles.filterButtonText,
                selectedFilter === filter.key &&
                  styles.selectedFilterButtonText,
              ]}
            >
              {filter.label} ({filter.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.errandList}>
        {filteredErrands.length > 0 ? (
          filteredErrands.map((errand) => (
            <TouchableOpacity
              key={errand.id}
              style={styles.errandCard}
              onPress={() => openErrandDetails(errand)}
            >
              <View style={styles.errandHeader}>
                <Text style={styles.errandTitle}>{errand.title}</Text>
                <Text
                  style={[
                    styles.errandStatus,
                    errand.status === "completed"
                      ? styles.completedStatus
                      : styles.cancelledStatus,
                  ]}
                >
                  {errand.status}
                </Text>
              </View>
              <Text style={styles.errandCustomer}>{errand.customer}</Text>
              <Text style={styles.errandDate}>
                {formatDate(errand.date)} at {errand.time}
              </Text>
              <View style={styles.errandFooter}>
                <Text style={styles.errandPayment}>
                  ₦{errand.payment.toLocaleString()}
                </Text>
                {renderStars(errand.rating)}
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No errands found</Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={isDetailModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={closeErrandDetails}
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedErrand && (
            <View style={styles.detailContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{selectedErrand.title}</Text>
                <TouchableOpacity onPress={closeErrandDetails}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Customer:</Text>
                <Text style={styles.detailValue}>
                  {selectedErrand.customer}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Date & Time:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(selectedErrand.date)} at {selectedErrand.time}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text
                  style={[
                    styles.detailValue,
                    selectedErrand.status === "completed"
                      ? styles.completedStatus
                      : styles.cancelledStatus,
                  ]}
                >
                  {selectedErrand.status}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Payment:</Text>
                <Text style={styles.detailValue}>
                  ₦{selectedErrand.payment.toLocaleString()}
                </Text>
              </View>

              {selectedErrand.rating && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Rating:</Text>
                  {renderStars(selectedErrand.rating)}
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Pickup Address:</Text>
                <Text style={styles.detailValue}>
                  {selectedErrand.pickupAddress}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Delivery Address:</Text>
                <Text style={styles.detailValue}>
                  {selectedErrand.deliveryAddress}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Duration:</Text>
                <Text style={styles.detailValue}>
                  {selectedErrand.duration}
                </Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Distance:</Text>
                <Text style={styles.detailValue}>
                  {selectedErrand.distance}
                </Text>
              </View>

              {selectedErrand.customerFeedback && (
                <View style={styles.detailSection}>
                  <Text style={styles.detailLabel}>Customer Feedback:</Text>
                  <Text style={styles.detailValue}>
                    {selectedErrand.customerFeedback}
                  </Text>
                </View>
              )}
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
  },
  filterContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f0f0f0",
  },
  selectedFilterButton: {
    backgroundColor: "#4a90e2",
  },
  filterButtonText: {
    color: "#666",
  },
  selectedFilterButtonText: {
    color: "#fff",
  },
  errandList: {
    flex: 1,
    padding: 16,
  },
  errandCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  errandHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  errandTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  errandStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  completedStatus: {
    color: "#4CAF50",
  },
  cancelledStatus: {
    color: "#F44336",
  },
  errandCustomer: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  errandDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  errandFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  errandPayment: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
    marginLeft: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#999",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailContainer: {
    flex: 1,
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  closeButton: {
    fontSize: 24,
    color: "#666",
  },
  detailSection: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: "#999",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
  },
});

export default ErrandHistoryScreen;
