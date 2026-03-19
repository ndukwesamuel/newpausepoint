import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
// import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFetchData_v2, useMutateData_v2 } from "../../../hooks/Requestv2";
const DataPurchase = ({ route }) => {
  const categoryData = route?.params?.data;

  const navigation = useNavigation();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  // Spinning animation for loading
  const spinAnim = useRef(new Animated.Value(0)).current;

  // ✅ Fetch service categories (Networks)
  const { data: serviceCategories, isLoading: isLoadingCategories } =
    useFetchData_v2(
      `api/v1/savehaven/listServiceCategories/${categoryData?._id}`,
      `service-categories-${categoryData?._id}`,
      {
        enabled: !!categoryData?._id,
      },
    );

  const networks = serviceCategories?.categories || [];

  // ✅ Fetch data bundles for selected network
  const {
    data: bundlesData,
    isLoading: isLoadingBundles,
    refetch: refetchBundles,
  } = useFetchData_v2(
    `api/v1/savehaven/listCategoryProducts/${selectedNetwork?._id}`,
    `data-bundles-${selectedNetwork?._id}`,
    {
      enabled: !!selectedNetwork?._id,
    },
  );

  const bundles = bundlesData?.products?.data || [];

  // ✅ Purchase data mutation
  const { mutate: purchaseData, isPending: purchaseLoading } = useMutateData_v2(
    "api/v1/savehaven/purchasedata",
    "POST",
    "data-purchase",
  );

  // Start spinning animation when loading
  useEffect(() => {
    if (purchaseLoading) {
      spinAnim.setValue(0);
      Animated.loop(
        Animated.timing(spinAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      spinAnim.stopAnimation();
    }
  }, [purchaseLoading]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // Auto-detect network from phone number
  const detectNetwork = (phone) => {
    const firstFourDigits = phone.substring(0, 4);

    const mtnPrefixes = [
      "0803",
      "0806",
      "0703",
      "0706",
      "0813",
      "0816",
      "0810",
      "0814",
      "0903",
      "0906",
      "0913",
      "0916",
    ];
    const airtelPrefixes = [
      "0802",
      "0808",
      "0708",
      "0812",
      "0701",
      "0902",
      "0907",
      "0912",
    ];
    const gloPrefixes = [
      "0805",
      "0807",
      "0705",
      "0815",
      "0811",
      "0905",
      "0915",
    ];
    const nineMobilePrefixes = ["0809", "0817", "0818", "0909", "0908"];

    if (mtnPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.identifier === "MTN");
    } else if (airtelPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.identifier === "AIRTEL");
    } else if (gloPrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.identifier === "GLO");
    } else if (nineMobilePrefixes.includes(firstFourDigits)) {
      return networks.find((n) => n.identifier === "ETISALAT");
    }
    return null;
  };

  const handlePhoneNumberChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, "").slice(0, 11);
    setPhoneNumber(numericText);

    // Auto-detect network
    if (numericText.length >= 4 && networks.length > 0) {
      const detected = detectNetwork(numericText);
      if (detected && !selectedNetwork) {
        setSelectedNetwork(detected);
      }
    }
  };

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    setSelectedBundle(null); // Reset bundle when network changes
  };

  const handleBundleSelect = (bundle) => {
    setSelectedBundle(bundle);
  };

  const handlePurchase = async () => {
    if (!phoneNumber) {
      Alert.alert("Error", "Please enter phone number");
      return;
    }

    if (phoneNumber.length !== 11) {
      Alert.alert("Error", "Phone number must be 11 digits");
      return;
    }

    if (!selectedNetwork) {
      Alert.alert("Error", "Please select a network");
      return;
    }

    if (!selectedBundle) {
      Alert.alert("Error", "Please select a data bundle");
      return;
    }

    Alert.alert(
      "Confirm Purchase",
      `Purchase ${selectedBundle.validity} for ${phoneNumber}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: () => processPurchase() },
      ],
    );
  };

  const processPurchase = () => {
    const data = {
      serviceCategoryId: selectedNetwork._id,
      amount: selectedBundle.amount,
      phoneNumber: phoneNumber,
      bundleCode: selectedBundle.bundleCode,
    };

    console.log({
      purchaseData: data,
    });

    purchaseData(data, {
      onSuccess: (response) => {
        console.log({
          purchaseResponse: response,
        });

        Alert.alert(
          "Purchase Successful! 🎉",
          `${selectedBundle.validity} has been sent to ${phoneNumber}`,
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ],
        );
      },
      onError: (error) => {
        console.log({
          purchaseError: error,
        });
        Alert.alert(
          "Purchase Failed",
          error?.data?.message || error.message || "An error occurred",
        );
      },
    });
  };

  const canPurchase =
    selectedNetwork && selectedBundle && phoneNumber.length === 11;

  // Network colors mapping
  const getNetworkColor = (identifier) => {
    const colors = {
      MTN: { color: "#FFCC00", bgColor: "#FEF3C7" },
      AIRTEL: { color: "#EF4444", bgColor: "#FEE2E2" },
      GLO: { color: "#10B981", bgColor: "#D1FAE5" },
      ETISALAT: { color: "#059669", bgColor: "#D1FAE5" },
    };
    return colors[identifier] || { color: "#6B7280", bgColor: "#F3F4F6" };
  };

  // Parse validity to extract data amount and duration
  const parseBundleInfo = (validity) => {
    // Example: "1.1GB + 1.5GB nite@N1000 1month"
    const match = validity.match(/^([\d.]+\s*[GM]B)/i);
    return match ? match[1] : validity;
  };

  if (!categoryData) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#EF4444" />
        <Text style={[styles.loadingText, { color: "#EF4444", marginTop: 16 }]}>
          Category data not found
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            marginTop: 20,
            backgroundColor: "#10B981",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoadingCategories) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Loading networks...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />

        <View style={styles.headerContent}>
          <View style={styles.headerIconContainer}>
            <MaterialCommunityIcons name="wifi" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{categoryData.name}</Text>
            <Text style={styles.headerSubtitle}>
              {categoryData.description}
            </Text>
          </View>
        </View>
      </View>

      {/* Phone Number Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="phone"
            size={20}
            color="#10B981"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Phone Number</Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="phone-outline"
            size={20}
            color={phoneNumber.length === 11 ? "#10B981" : "#6B7280"}
            style={styles.inputIcon}
          />
          <TextInput
            value={phoneNumber}
            onChangeText={handlePhoneNumberChange}
            placeholder="Enter 11-digit phone number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            maxLength={11}
            style={styles.textInput}
          />
          {phoneNumber.length === 11 && (
            <View style={styles.inputSuccessIcon}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#10B981"
              />
            </View>
          )}
        </View>

        {phoneNumber.length > 0 && phoneNumber.length !== 11 && (
          <View style={styles.warningBadge}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={14}
              color="#92400E"
            />
            <Text style={styles.warningText}>
              {phoneNumber.length}/11 digits entered
            </Text>
          </View>
        )}
      </View>

      {/* Network Selection Card */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons
            name="signal-variant"
            size={20}
            color="#10B981"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>Select Network</Text>
        </View>

        {networks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={48}
              color="#D1D5DB"
            />
            <Text style={styles.emptyStateText}>No networks available</Text>
          </View>
        ) : (
          <View style={styles.networkGrid}>
            {networks.map((network) => {
              const networkStyle = getNetworkColor(network.identifier);
              return (
                <TouchableOpacity
                  key={network._id}
                  onPress={() => handleNetworkSelect(network)}
                  activeOpacity={0.7}
                  style={[
                    styles.networkButton,
                    selectedNetwork?._id === network._id && {
                      backgroundColor: networkStyle.color,
                      borderColor: networkStyle.color,
                    },
                  ]}
                >
                  {network.logoUrl ? (
                    <Image
                      source={{ uri: network.logoUrl }}
                      style={styles.networkLogo}
                      resizeMode="contain"
                    />
                  ) : (
                    <View
                      style={[
                        styles.networkIconContainer,
                        {
                          backgroundColor:
                            selectedNetwork?._id === network._id
                              ? "rgba(255,255,255,0.3)"
                              : networkStyle.bgColor,
                        },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="sim"
                        size={20}
                        color={
                          selectedNetwork?._id === network._id
                            ? "#FFFFFF"
                            : networkStyle.color
                        }
                      />
                    </View>
                  )}
                  <Text
                    style={[
                      styles.networkName,
                      selectedNetwork?._id === network._id &&
                        styles.networkNameSelected,
                    ]}
                  >
                    {network.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      {/* Selected Network Info */}
      {selectedNetwork && (
        <View
          style={[
            styles.selectedNetworkCard,
            {
              borderLeftColor: getNetworkColor(selectedNetwork.identifier)
                .color,
            },
          ]}
        >
          <View
            style={[
              styles.selectedNetworkIcon,
              {
                backgroundColor: getNetworkColor(selectedNetwork.identifier)
                  .color,
              },
            ]}
          >
            <MaterialCommunityIcons name="check" size={18} color="#FFFFFF" />
          </View>
          <View style={styles.selectedNetworkInfo}>
            <Text style={styles.selectedNetworkName}>
              {selectedNetwork.name} Selected
            </Text>
            <Text style={styles.selectedNetworkMin}>
              Choose a data bundle below
            </Text>
          </View>
        </View>
      )}

      {/* Data Bundles Card */}
      {selectedNetwork && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="package-variant"
              size={20}
              color="#10B981"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>Select Data Bundle</Text>
          </View>

          {isLoadingBundles ? (
            <View style={{ padding: 20, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#10B981" />
              <Text style={{ marginTop: 8, fontSize: 12, color: "#6B7280" }}>
                Loading bundles...
              </Text>
            </View>
          ) : bundles.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color="#D1D5DB"
              />
              <Text style={styles.emptyStateText}>No bundles available</Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -16 }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
            >
              {bundles.map((bundle, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleBundleSelect(bundle)}
                  activeOpacity={0.7}
                  style={[
                    styles.bundleCard,
                    selectedBundle?.bundleCode === bundle.bundleCode &&
                      styles.bundleCardSelected,
                  ]}
                >
                  <View style={styles.bundleHeader}>
                    <MaterialCommunityIcons
                      name="wifi"
                      size={24}
                      color={
                        selectedBundle?.bundleCode === bundle.bundleCode
                          ? "#FFFFFF"
                          : "#10B981"
                      }
                    />
                    {selectedBundle?.bundleCode === bundle.bundleCode && (
                      <View style={styles.bundleCheckmark}>
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#10B981"
                        />
                      </View>
                    )}
                  </View>
                  <Text style={styles.bundleData}>
                    {parseBundleInfo(bundle.validity)}
                  </Text>
                  <Text style={styles.bundleValidity} numberOfLines={2}>
                    {bundle.validity}
                  </Text>
                  <Text style={styles.bundlePrice}>
                    ₦{bundle.amount.toLocaleString()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Summary Card */}
      {canPurchase && (
        <View style={styles.summaryContainer}>
          <View style={[styles.summaryCard, { backgroundColor: "#DBEAFE" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#3B82F6" },
              ]}
            >
              <MaterialCommunityIcons name="sim" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Network</Text>
            <Text style={[styles.summaryValue, { color: "#1E40AF" }]}>
              {selectedNetwork.name}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#D1FAE5" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#10B981" },
              ]}
            >
              <MaterialCommunityIcons name="wifi" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>Data</Text>
            <Text
              style={[styles.summaryValue, { color: "#059669" }]}
              numberOfLines={1}
            >
              {parseBundleInfo(selectedBundle.validity)}
            </Text>
          </View>

          <View style={[styles.summaryCard, { backgroundColor: "#E0E7FF" }]}>
            <View
              style={[
                styles.summaryIconContainer,
                { backgroundColor: "#6366F1" },
              ]}
            >
              <MaterialCommunityIcons name="phone" size={20} color="#FFFFFF" />
            </View>
            <Text style={styles.summaryLabel}>To</Text>
            <Text style={[styles.summaryValue, { color: "#4338CA" }]}>
              {phoneNumber.substring(0, 4)}***
            </Text>
          </View>
        </View>
      )}

      {/* Purchase Button */}
      {canPurchase && (
        <TouchableOpacity
          onPress={handlePurchase}
          disabled={purchaseLoading}
          activeOpacity={0.8}
          style={[
            styles.purchaseButton,
            purchaseLoading && styles.purchaseButtonDisabled,
          ]}
        >
          {purchaseLoading ? (
            <View style={styles.purchaseButtonContent}>
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <MaterialCommunityIcons
                  name="loading"
                  size={22}
                  color="#FFFFFF"
                />
              </Animated.View>
              <Text style={styles.purchaseButtonText}>Processing...</Text>
            </View>
          ) : (
            <View style={styles.purchaseButtonContent}>
              <MaterialCommunityIcons
                name="download"
                size={22}
                color="#FFFFFF"
              />
              <Text style={styles.purchaseButtonText}>
                Buy for ₦{selectedBundle.amount.toLocaleString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}

      {/* Helper Text */}
      {!selectedNetwork && (
        <View style={styles.helperCard}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.helperText}>
            Enter phone number and select network to view data bundles
          </Text>
        </View>
      )}

      {selectedNetwork && !selectedBundle && (
        <View style={styles.helperCard}>
          <MaterialCommunityIcons
            name="lightbulb-outline"
            size={20}
            color="#6B7280"
          />
          <Text style={styles.helperText}>
            Select a data bundle to continue
          </Text>
        </View>
      )}

      {/* Footer Info */}
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="shield-check"
            size={16}
            color="#10B981"
          />
          <Text style={styles.footerText}>Secure</Text>
        </View>
        <View style={styles.footerDot} />
        <View style={styles.footerItem}>
          <MaterialCommunityIcons
            name="lightning-bolt"
            size={16}
            color="#F59E0B"
          />
          <Text style={styles.footerText}>Instant</Text>
        </View>
        <View style={styles.footerDot} />
        <View style={styles.footerItem}>
          <MaterialCommunityIcons name="headset" size={16} color="#3B82F6" />
          <Text style={styles.footerText}>24/7 Support</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },

  // Header Card
  headerCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
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
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  decorativeCircle2: {
    position: "absolute",
    bottom: -20,
    left: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 4,
  },

  // Card Styles
  card: {
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
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Input Styles
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },
  inputSuccessIcon: {
    marginLeft: 8,
  },

  // Warning Badge
  warningBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#92400E",
    marginLeft: 6,
  },

  // Network Grid
  emptyState: {
    alignItems: "center",
    padding: 32,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
  },
  networkGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  networkButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  networkLogo: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  networkIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  networkName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  networkNameSelected: {
    color: "#FFFFFF",
  },

  // Selected Network Card
  selectedNetworkCard: {
    backgroundColor: "#ECFDF5",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedNetworkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  selectedNetworkInfo: {
    flex: 1,
  },
  selectedNetworkName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#065F46",
  },
  selectedNetworkMin: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginTop: 2,
  },

  // Bundle Cards
  bundleCard: {
    width: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  bundleCardSelected: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  bundleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bundleCheckmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  bundleData: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 4,
  },
  bundleValidity: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 14,
  },
  bundlePrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#10B981",
  },

  // Summary Cards
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
  },
  summaryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    fontWeight: "500",
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  // Purchase Button
  purchaseButton: {
    backgroundColor: "#10B981",
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 20,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  purchaseButtonDisabled: {
    backgroundColor: "#6EE7B7",
    shadowOpacity: 0.15,
  },
  purchaseButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  purchaseButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    marginLeft: 10,
  },

  // Helper Card
  helperCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  helperText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 8,
    fontStyle: "italic",
    textAlign: "center",
  },

  // Footer
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 12,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    marginLeft: 4,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 12,
  },
});

export default DataPurchase;
