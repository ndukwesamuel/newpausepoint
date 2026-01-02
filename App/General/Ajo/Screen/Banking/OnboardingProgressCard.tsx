import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useFetchData_v2 } from "../../../../../hooks/Requestv2";

const OnboardingProgressCard: React.FC = () => {
  const navigation = useNavigation();

  // Fetch bank account data
  const {
    data: bankData,
    isLoading: isBankLoading,
    error: bankError,
    refetch: refetchBankData,
  } = useFetchData_v2("api/v1/bank", "userBankAccount");

  // Refetch data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      refetchBankData();
    }, [refetchBankData])
  );

  // Determine user status from the bank data
  const getUserStatus = () => {
    // If bankData is null, user hasn't created account yet
    // console.log({
    //   ttyyy: bankData,
    // });

    if (!bankData) {
      return {
        hasBankAccount: false,
        hasKYC: false,
        hasDepositAccount: false,
      };
    }

    // Check KYC status
    const hasKYC = bankData.kycStatus === "approved";

    // Check if deposit account exists
    const hasDepositAccount = !!bankData.depositAccountInfo;

    return {
      hasBankAccount: true,
      hasKYC,
      hasDepositAccount,
    };
  };

  const user = getUserStatus();

  // Handle navigation
  const handleNavigate = (screen: string) => {
    navigation.navigate(screen as never);
  };

  // Determine current level
  const getCurrentLevel = () => {
    // Level 1: Create Bank Account
    if (!user.hasBankAccount) {
      return {
        level: 1,
        title: "Create Bank Account",
        description: "Set up your account to get started",
        action: "Create Account",
        icon: "bank",
        screen: "CreateBankAccount",
        color: "#3B82F6",
        bgColor: "#DBEAFE",
      };
    }

    // Level 2: Complete KYC
    if (!user.hasKYC) {
      return {
        level: 2,
        title: "Complete KYC",
        description: "Verify your identity to unlock features",
        action: "Start Verification",
        icon: "account-check",
        screen: "KYCForm",
        color: "#6366F1",
        bgColor: "#E0E7FF",
      };
    }

    // Level 3: Create Deposit Account
    if (!user.hasDepositAccount) {
      return {
        level: 3,
        title: "Create Deposit Account",
        description: "Set up your deposit account to start saving",
        action: "Create Deposit Account",
        icon: "wallet",
        screen: "CreateDepositAccount",
        color: "#10B981",
        bgColor: "#D1FAE5",
      };
    }

    // All complete - this state won't be shown
    return null;
  };

  const currentLevel = getCurrentLevel();

  // Loading state
  if (isBankLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>
            Checking your account status...
          </Text>
        </View>
      </View>
    );
  }

  // Don't show card if all steps are complete
  if (!currentLevel) {
    return null;
  }

  // Don't show card on error (optional - or you can show an error state)
  if (bankError) {
    return null;
  }

  const progress = ((currentLevel.level - 1) / 3) * 100;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="chart-timeline-variant"
          size={20}
          color="#10B981"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.headerTitle}>Account Setup</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: currentLevel.color,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>Step {currentLevel.level} of 3</Text>
      </View>

      {/* Current Step */}
      <View style={styles.stepContainer}>
        <View style={styles.stepContent}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: currentLevel.bgColor },
            ]}
          >
            <MaterialCommunityIcons
              name={currentLevel.icon as any}
              size={26}
              color={currentLevel.color}
            />
          </View>

          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{currentLevel.title}</Text>
            <Text style={styles.stepDescription}>
              {currentLevel.description}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: currentLevel.color }]}
          onPress={() => handleNavigate(currentLevel.screen)}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{currentLevel.action}</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Steps Overview */}
      <View style={styles.stepsOverview}>
        <StepIndicator
          completed={user.hasBankAccount}
          label="Account"
          isActive={!user.hasBankAccount}
          icon="bank"
        />
        <View style={styles.stepConnector} />
        <StepIndicator
          completed={user.hasKYC}
          label="KYC"
          isActive={user.hasBankAccount && !user.hasKYC}
          icon="account-check"
        />
        <View style={styles.stepConnector} />
        <StepIndicator
          completed={user.hasDepositAccount}
          label="Deposit"
          isActive={user.hasKYC && !user.hasDepositAccount}
          icon="wallet"
        />
      </View>
    </View>
  );
};

// Step Indicator Component
const StepIndicator: React.FC<{
  completed: boolean;
  label: string;
  isActive: boolean;
  icon: string;
}> = ({ completed, label, isActive, icon }) => (
  <View style={styles.stepIndicatorContainer}>
    <View
      style={[
        styles.stepDot,
        completed && styles.stepDotCompleted,
        isActive && styles.stepDotActive,
      ]}
    >
      {completed ? (
        <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
      ) : (
        <MaterialCommunityIcons
          name={icon as any}
          size={16}
          color={isActive ? "#FFFFFF" : "#9CA3AF"}
        />
      )}
    </View>
    <Text
      style={[
        styles.stepLabel,
        (completed || isActive) && styles.stepLabelActive,
      ]}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // Loading State
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: 0.3,
  },

  // Progress Bar
  progressSection: {
    marginBottom: 24,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 100,
  },
  progressText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "right",
  },

  // Current Step
  stepContainer: {
    marginBottom: 24,
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stepInfo: {
    flex: 1,
    paddingTop: 4,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  stepDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
    fontWeight: "500",
  },

  // Action Button
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Steps Overview
  stepsOverview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  stepIndicatorContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepDot: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  stepDotCompleted: {
    backgroundColor: "#10B981",
  },
  stepDotActive: {
    backgroundColor: "#6366F1",
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 4,
    marginBottom: 32,
  },
  stepLabel: {
    fontSize: 11,
    color: "#9CA3AF",
    fontWeight: "500",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#374151",
    fontWeight: "600",
  },
});

export default OnboardingProgressCard;
