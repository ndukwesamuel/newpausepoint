import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutateData } from "../../../hooks/Request";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const { width } = Dimensions.get("window");

const ErrandDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { errand } = route.params;

  const {
    mutate: assignedErrand,
    isLoading: assignedErrandispending,
    error: assignedErranderror,
  } = useMutateData("api/v1/guesterrand", "PATCH", "geterrandinfo");

  // Function to show the confirmation alert
  const showConfirmStatusUpdate = (newStatus) => {
    let title = "";
    let message = "";

    if (newStatus === "assigned") {
      title = "Confirm Acceptance";
      message = "Are you sure you want to accept and pay for this errand?";
    } else if (newStatus === "cancelled") {
      title = "Confirm Cancellation";
      message = "Are you sure you want to cancel this errand?";
    } else if (newStatus === "en_route") {
      title = "Confirm En Route";
      message = "Are you sure you want to mark this errand as 'En Route'?";
    } else {
      title = "Confirm Action";
      message = `Are you sure you want to change status to ${newStatus}?`;
    }

    Alert.alert(
      title,
      message,
      [
        {
          text: "No",
          onPress: () => console.log("Status update cancelled"),
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => handleUpdateStatus(newStatus),
        },
      ],
      { cancelable: false }
    );
  };

  const handleUpdateStatus = (newStatus) => {
    let data = {
      status: newStatus,
      errandId: errand?._id,
    };

    console.log({
      payloadToSend: data,
    });

    assignedErrand(data, {
      onSuccess: (response) => {
        console.log({ successResponse: response });

        Alert.alert("Success", "Status updated successfully", [{ text: "OK" }]);
        navigation.goBack();
      },
      onError: (error) => {
        console.log({ errorDetails: error?.response });

        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update status. Please try again.";

        Alert.alert("Error", errorMessage, [{ text: "OK" }]);
      },
    });
  };

  if (!errand) {
    return (
      <View style={styles.centerContent}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={64}
            color="#DC2626"
          />
          <Text style={styles.errorTitle}>Errand Not Found</Text>
          <Text style={styles.errorText}>
            Unable to load errand details. Please try again.
          </Text>
        </View>
      </View>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return { bg: "#FEF3C7", text: "#92400E" }; // Warning yellow
      case "assigned":
        return { bg: "#E0E7FF", text: "#4338CA" }; // Indigo
      case "en_route":
        return { bg: "#FED7AA", text: "#C2410C" }; // Orange
      case "picked_up":
        return { bg: "#DBEAFE", text: "#1E40AF" }; // Blue
      case "delivered":
        return { bg: "#A5F3FC", text: "#0E7490" }; // Cyan
      case "completed":
        return { bg: "#D1FAE5", text: "#065F46" }; // Green
      case "cancelled":
        return { bg: "#FEE2E2", text: "#991B1B" }; // Red
      default:
        return { bg: "#F3F4F6", text: "#6B7280" }; // Grey
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }) +
      " " +
      date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const statusColors = getStatusColor(errand.status);

  return (
    <ScreenWrapper
      title="Errand Details"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card with Title and Status */}
        <View style={styles.heroCard}>
          {/* Decorative circles */}
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{errand.title}</Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
            >
              <MaterialCommunityIcons
                name="information"
                size={14}
                color={statusColors.text}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.statusText, { color: statusColors.text }]}>
                {errand.status.toUpperCase().replace("_", " ")}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons (if pending) */}
        {errand.status === "pending" && (
          <View style={styles.actionButtonsCard}>
            <TouchableOpacity
              onPress={() => showConfirmStatusUpdate("assigned")}
              style={styles.acceptButton}
              disabled={assignedErrandispending}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.acceptButtonText}>
                {assignedErrandispending ? "Processing..." : "Accept & Pay"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => showConfirmStatusUpdate("cancelled")}
              style={styles.cancelButton}
              disabled={assignedErrandispending}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color="#DC2626"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delivery Information Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="map-marker"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Delivery Information</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons
              name="home-map-marker"
              size={18}
              color="#6B7280"
            />
            <Text style={styles.infoText}>{errand.deliveryAddress}</Text>
          </View>
        </View>

        {/* Pickup Information - Type: pickup */}
        {errand?.type === "pickup" ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="package-variant"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Pickup Information</Text>
            </View>

            <View style={styles.pickupDetailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Title:</Text>
                <Text style={styles.detailValue}>{errand.title}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description:</Text>
                <Text style={styles.detailValue}>
                  {errand.description || "N/A"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Pickup Address:</Text>
                <Text style={styles.detailValue}>{errand.pickUpAddress}</Text>
              </View>

              {errand.images && errand.images.length > 0 && (
                <Image
                  source={{ uri: errand?.images[0]?.url }}
                  style={styles.itemImage}
                  onError={(e) =>
                    console.log("Image loading error:", e.nativeEvent.error)
                  }
                />
              )}
            </View>
          </View>
        ) : (
          /* Pickup Locations & Items - Type: delivery */
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="store-marker"
                size={20}
                color="#10B981"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.sectionTitle}>Pickup Locations & Items</Text>
            </View>

            {errand.pickupLocations && errand.pickupLocations.length > 0 ? (
              errand.pickupLocations.map((location, locIndex) => (
                <View key={locIndex} style={styles.locationCard}>
                  {/* Location Header */}
                  <View style={styles.locationHeader}>
                    <View style={styles.locationIconContainer}>
                      <MaterialCommunityIcons
                        name="store"
                        size={20}
                        color="#3B82F6"
                      />
                    </View>
                    <View style={styles.locationInfo}>
                      <Text style={styles.locationName}>{location.name}</Text>
                      <Text style={styles.locationAddress}>
                        {location.address}
                      </Text>
                    </View>
                  </View>

                  {/* Items */}
                  {location.items && location.items.length > 0 ? (
                    location.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.itemCard}>
                        <View style={styles.itemHeader}>
                          <Text style={styles.itemName} numberOfLines={2}>
                            {item.name}
                          </Text>
                          <View style={styles.itemPriceTag}>
                            <Text style={styles.itemQuantity}>
                              {item.quantity}x
                            </Text>
                            <Text style={styles.itemPrice}>
                              ₦{item.price?.toFixed(2) || "N/A"}
                            </Text>
                          </View>
                        </View>

                        {item.description && (
                          <Text style={styles.itemDescription}>
                            {item.description}
                          </Text>
                        )}

                        {item.images && item.images.length > 0 && (
                          <Image
                            source={{ uri: item.images[0] }}
                            style={styles.itemImage}
                            onError={(e) =>
                              console.log(
                                "Image loading error:",
                                e.nativeEvent.error
                              )
                            }
                          />
                        )}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.noItemsText}>
                      No items listed for this pickup location.
                    </Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noItemsText}>
                No pickup locations listed for this errand.
              </Text>
            )}
          </View>
        )}

        {/* Financial Summary Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="cash-multiple"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Financial Summary</Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Total Price</Text>
            <Text style={styles.financialValue}>
              ₦{errand.totalPrice?.toFixed(2) || "0.00"}
            </Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Service Charge</Text>
            <Text style={styles.financialValue}>
              ₦{errand.serviceCharge?.toFixed(2) || "0.00"}
            </Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Delivery Charge</Text>
            <Text style={styles.financialValue}>
              ₦{errand?.deliveryFee?.toFixed(2) || "500.00"}
            </Text>
          </View>

          <View style={styles.financialDivider} />

          <View style={styles.financialRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ₦{errand.totalAmount?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>

        {/* Timestamps Card */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="clock-outline"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>Timeline</Text>
          </View>

          <View style={styles.timestampRow}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={16}
              color="#6B7280"
            />
            <View style={styles.timestampContent}>
              <Text style={styles.timestampLabel}>Created</Text>
              <Text style={styles.timestampValue}>
                {formatDate(errand.createdAt)}
              </Text>
            </View>
          </View>

          <View style={styles.timestampRow}>
            <MaterialCommunityIcons
              name="calendar-edit"
              size={16}
              color="#6B7280"
            />
            <View style={styles.timestampContent}>
              <Text style={styles.timestampLabel}>Last Updated</Text>
              <Text style={styles.timestampValue}>
                {formatDate(errand.updatedAt)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollViewContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 32,
  },
  errorContainer: {
    alignItems: "center",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginTop: 16,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  errorText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },
  heroCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
  },
  decorativeCircle1: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -30,
    left: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  heroContent: {
    zIndex: 1,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    letterSpacing: 0.3,
    lineHeight: 30,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actionButtonsCard: {
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
  acceptButton: {
    backgroundColor: "#10B981",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#DC2626",
  },
  cancelButtonText: {
    color: "#DC2626",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sectionCard: {
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
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
    lineHeight: 20,
  },
  pickupDetailsContainer: {
    gap: 12,
  },
  detailRow: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
    lineHeight: 20,
  },
  locationCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  locationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  locationAddress: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  itemCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    marginRight: 12,
    letterSpacing: 0.3,
  },
  itemPriceTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  itemQuantity: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "700",
    color: "#10B981",
  },
  itemDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
    marginBottom: 8,
  },
  itemImage: {
    width: "100%",
    height: width * 0.5,
    borderRadius: 12,
    marginTop: 8,
    resizeMode: "cover",
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  financialLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  financialValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  financialDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#10B981",
    letterSpacing: 0.3,
  },
  timestampRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 12,
  },
  timestampContent: {
    flex: 1,
  },
  timestampLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 2,
  },
  timestampValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  noItemsText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
    textAlign: "center",
    paddingVertical: 12,
    fontWeight: "500",
  },
});

export default ErrandDetailScreen;
