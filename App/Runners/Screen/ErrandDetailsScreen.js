import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ErrandDetailsScreen = ({ route, navigation }) => {
  const { errand } = route.params || {};
  const [errandStatus, setErrandStatus] = useState("accepted"); // accepted, in_progress, completed
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 1, title: "Errand Accepted", completed: true },
    {
      id: 2,
      title: "Heading to Pickup",
      completed: errandStatus !== "accepted",
    },
    {
      id: 3,
      title: "At Pickup Location",
      completed: errandStatus === "completed",
    },
    {
      id: 4,
      title: "Heading to Delivery",
      completed: errandStatus === "completed",
    },
    {
      id: 5,
      title: "Errand Completed",
      completed: errandStatus === "completed",
    },
  ];

  const mockErrand = {
    id: "1",
    title: "Grocery Shopping",
    description:
      "Buy groceries from Shoprite, Victoria Island. List includes rice, beans, tomatoes, and cooking oil.",
    payment: 2500,
    distance: "2.3 km",
    estimatedTime: "45 min",
    priority: "high",
    customer: {
      name: "Sarah Johnson",
      phone: "+234 801 234 5678",
      rating: 4.9,
      avatar: null,
    },
    pickup: {
      address: "Shoprite, Victoria Island, Lagos",
      coordinates: { lat: 6.4281, lng: 3.4219 },
      instructions:
        "Enter through the main entrance, grocery section is on the ground floor",
    },
    delivery: {
      address: "15 Ademola Street, Victoria Island, Lagos",
      coordinates: { lat: 6.4301, lng: 3.4289 },
      instructions: "Apartment 4B, use the elevator. Call when you arrive.",
    },
    items: [
      { name: "Rice (5kg)", quantity: 1, notes: "Uncle Ben's preferred" },
      { name: "Beans (2kg)", quantity: 1, notes: "Brown beans" },
      { name: "Tomatoes", quantity: "1kg", notes: "Fresh, not too ripe" },
      {
        name: "Cooking Oil",
        quantity: "1 bottle",
        notes: "Vegetable oil, 1 liter",
      },
    ],
    specialInstructions:
      "Please check expiry dates carefully. Customer prefers organic products when available.",
    timeConstraints: "Delivery needed before 6 PM",
  };

  const currentErrand = errand || mockErrand;

  const handleCallCustomer = () => {
    Alert.alert("Call Customer", `Call ${currentErrand.customer.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call",
        onPress: () => Linking.openURL(`tel:${currentErrand.customer.phone}`),
      },
    ]);
  };

  const handleNavigateToLocation = (location) => {
    const { lat, lng } = location.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url);
  };

  const handleUpdateStatus = (newStatus) => {
    setErrandStatus(newStatus);
    switch (newStatus) {
      case "in_progress":
        Alert.alert("Status Updated", "Heading to pickup location");
        break;
      case "at_pickup":
        Alert.alert("Status Updated", "Arrived at pickup location");
        break;
      case "heading_to_delivery":
        Alert.alert("Status Updated", "Heading to delivery location");
        break;
      case "completed":
        Alert.alert(
          "Errand Completed",
          "Great job! Payment will be processed."
        );
        break;
    }
  };

  const handleEmergency = () => {
    Alert.alert("Emergency", "What type of emergency?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call Support",
        onPress: () => Linking.openURL("tel:+2341234567890"),
      },
      { text: "Call Emergency", onPress: () => Linking.openURL("tel:199") },
    ]);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#FF4444";
      case "high":
        return "#FF8800";
      case "medium":
        return "#4CAF50";
      default:
        return "#666";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmergency}>
            <Text style={styles.emergencyButton}>🚨 Emergency</Text>
          </TouchableOpacity>
        </View>

        {/* Errand Overview */}
        <View style={styles.overviewCard}>
          <View style={styles.titleRow}>
            <Text style={styles.errandTitle}>{currentErrand.title}</Text>
            <View style={styles.paymentContainer}>
              <View
                style={[
                  styles.priorityDot,
                  { backgroundColor: getPriorityColor(currentErrand.priority) },
                ]}
              />
              <Text style={styles.payment}>
                ₦{currentErrand.payment.toLocaleString()}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>{currentErrand.description}</Text>
          <View style={styles.errandMeta}>
            <Text style={styles.metaText}>📍 {currentErrand.distance}</Text>
            <Text style={styles.metaText}>
              ⏱️ {currentErrand.estimatedTime}
            </Text>
          </View>
        </View>

        {/* Progress Tracker */}
        <View style={styles.progressCard}>
          <Text style={styles.cardTitle}>Progress</Text>
          {steps.map((step, index) => (
            <View key={step.id} style={styles.progressStep}>
              <View
                style={[
                  styles.progressDot,
                  { backgroundColor: step.completed ? "#4CAF50" : "#ddd" },
                ]}
              />
              <Text
                style={[
                  styles.progressText,
                  { color: step.completed ? "#4CAF50" : "#666" },
                ]}
              >
                {step.title}
              </Text>
            </View>
          ))}
        </View>

        {/* Customer Information */}
        <View style={styles.customerCard}>
          <Text style={styles.cardTitle}>Customer Information</Text>
          <View style={styles.customerInfo}>
            <View style={styles.customerAvatar}>
              <Text style={styles.avatarText}>
                {currentErrand.customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </Text>
            </View>
            <View style={styles.customerDetails}>
              <Text style={styles.customerName}>
                {currentErrand.customer.name}
              </Text>
              <Text style={styles.customerRating}>
                ⭐ {currentErrand.customer.rating}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.callButton}
              onPress={handleCallCustomer}
            >
              <Text style={styles.callButtonText}>📞 Call</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Locations */}
        <View style={styles.locationsCard}>
          <Text style={styles.cardTitle}>Locations</Text>

          {/* Pickup Location */}
          <View style={styles.locationItem}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>📍 Pickup Location</Text>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigateToLocation(currentErrand.pickup)}
              >
                <Text style={styles.navigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.locationAddress}>
              {currentErrand.pickup.address}
            </Text>
            <Text style={styles.locationInstructions}>
              {currentErrand.pickup.instructions}
            </Text>
          </View>

          {/* Delivery Location */}
          <View style={styles.locationItem}>
            <View style={styles.locationHeader}>
              <Text style={styles.locationTitle}>🎯 Delivery Location</Text>
              <TouchableOpacity
                style={styles.navigateButton}
                onPress={() => handleNavigateToLocation(currentErrand.delivery)}
              >
                <Text style={styles.navigateText}>Navigate</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.locationAddress}>
              {currentErrand.delivery.address}
            </Text>
            <Text style={styles.locationInstructions}>
              {currentErrand.delivery.instructions}
            </Text>
          </View>
        </View>

        {/* Shopping List */}
        <View style={styles.itemsCard}>
          <Text style={styles.cardTitle}>Shopping List</Text>
          {currentErrand.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                {item.notes && (
                  <Text style={styles.itemNotes}>Note: {item.notes}</Text>
                )}
              </View>
              <View style={styles.itemCheckbox}>
                <Text style={styles.checkboxText}>☐</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Special Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>Special Instructions</Text>
          <Text style={styles.instructionsText}>
            {currentErrand.specialInstructions}
          </Text>
          {currentErrand.timeConstraints && (
            <View style={styles.timeConstraints}>
              <Text style={styles.timeConstraintsText}>
                ⏰ {currentErrand.timeConstraints}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {errandStatus === "accepted" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("in_progress")}
            >
              <Text style={styles.primaryButtonText}>Start Errand</Text>
            </TouchableOpacity>
          )}

          {errandStatus === "in_progress" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("at_pickup")}
            >
              <Text style={styles.primaryButtonText}>Arrived at Pickup</Text>
            </TouchableOpacity>
          )}

          {errandStatus === "at_pickup" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("heading_to_delivery")}
            >
              <Text style={styles.primaryButtonText}>Heading to Delivery</Text>
            </TouchableOpacity>
          )}

          {errandStatus === "heading_to_delivery" && (
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleUpdateStatus("completed")}
            >
              <Text style={styles.primaryButtonText}>Complete Errand</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Report Issue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
  },
  backButton: {
    fontSize: 16,
    color: "#4CAF50",
  },
  emergencyButton: {
    fontSize: 14,
    color: "#FF4444",
    fontWeight: "bold",
  },
  overviewCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  errandTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  paymentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  payment: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  errandMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metaText: {
    fontSize: 12,
    color: "#888",
  },
  progressCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  progressText: {
    fontSize: 14,
  },
  customerCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatarText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  customerRating: {
    fontSize: 12,
    color: "#FF8800",
    marginTop: 2,
  },
  callButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  locationsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationItem: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  navigateButton: {
    backgroundColor: "#2196F3",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  navigateText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  locationAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  locationInstructions: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
  },
  itemsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  itemNotes: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    fontStyle: "italic",
  },
  itemCheckbox: {
    padding: 5,
  },
  checkboxText: {
    fontSize: 18,
    color: "#ccc",
  },
  instructionsCard: {
    backgroundColor: "white",
    margin: 10,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  instructionsText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  timeConstraints: {
    backgroundColor: "#FFF3E0",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  timeConstraintsText: {
    fontSize: 12,
    color: "#FF8800",
    fontWeight: "bold",
  },
  actionButtons: {
    margin: 10,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ErrandDetailsScreen;
