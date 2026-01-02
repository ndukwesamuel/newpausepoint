import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../../../hooks/Requestv2";
// import { useFetchData_v2 } from "../../../../../hooks/Requestv2";
const CreateDepositAccount = () => {
  const navigation = useNavigation();

  // Create deposit account - GET request with manual trigger
  const {
    refetch: createDepositAccount,
    isLoading: isCreatingAccount,
    isSuccess: accountCreated,
  } = useFetchData_v2(
    "api/v1/bank/customerDepositAccount",
    "createDepositAccount",
    {
      enabled: false, // Don't fetch automatically
    }
  );

  // Handle successful account creation
  useEffect(() => {
    if (accountCreated) {
      Alert.alert("Success", "Deposit account created successfully!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
    }
  }, [accountCreated, navigation]);

  // Handle create deposit account
  const handleCreateAccount = async () => {
    try {
      await createDepositAccount();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message || "Failed to create deposit account"
      );
    }
  };

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color="#111827"
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Deposit Account</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.decorativeCircle1} />
          <View style={styles.decorativeCircle2} />

          <View style={styles.iconContainerLarge}>
            <MaterialCommunityIcons name="wallet" size={40} color="#FFFFFF" />
          </View>

          <Text style={styles.heroTitle}>Start Saving Today</Text>
          <Text style={styles.heroDescription}>
            Create your deposit account and begin your savings journey
          </Text>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={20}
              color="#10B981"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.sectionTitle}>What You'll Get</Text>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#DBEAFE" }]}>
              <MaterialCommunityIcons
                name="piggy-bank"
                size={20}
                color="#3B82F6"
              />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Dedicated Savings Account</Text>
              <Text style={styles.benefitDescription}>
                Your own secure account for all your savings goals
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#FEF3C7" }]}>
              <MaterialCommunityIcons
                name="chart-line"
                size={20}
                color="#F59E0B"
              />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Track Your Progress</Text>
              <Text style={styles.benefitDescription}>
                Monitor your savings growth with detailed insights
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#D1FAE5" }]}>
              <MaterialCommunityIcons name="target" size={20} color="#10B981" />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Achieve Your Goals</Text>
              <Text style={styles.benefitDescription}>
                Set targets and watch your savings grow automatically
              </Text>
            </View>
          </View>

          <View style={styles.benefitItem}>
            <View style={[styles.benefitIcon, { backgroundColor: "#E0E7FF" }]}>
              <MaterialCommunityIcons
                name="shield-check"
                size={20}
                color="#6366F1"
              />
            </View>
            <View style={styles.benefitText}>
              <Text style={styles.benefitTitle}>Safe & Secure</Text>
              <Text style={styles.benefitDescription}>
                Bank-level security protecting your hard-earned money
              </Text>
            </View>
          </View>
        </View>

        {/* Create Account Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateAccount}
          disabled={isCreatingAccount}
          activeOpacity={0.8}
        >
          {isCreatingAccount ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.createButtonText}>
                Create Deposit Account
              </Text>
              <MaterialCommunityIcons
                name="arrow-right"
                size={20}
                color="#FFFFFF"
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: 0.3,
  },

  // Hero Card
  heroCard: {
    backgroundColor: "#10B981",
    borderRadius: 20,
    padding: 32,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
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
  iconContainerLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  heroDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 20,
  },

  // Info Card
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  benefitIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  benefitDescription: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
    lineHeight: 18,
  },

  // Create Button
  createButton: {
    backgroundColor: "#10B981",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
});

export default CreateDepositAccount;
