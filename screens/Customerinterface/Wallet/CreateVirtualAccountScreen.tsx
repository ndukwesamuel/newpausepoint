import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutateData_v2 } from "../../../hooks/Requestv2";
import { useSelector } from "react-redux";

const CreateVirtualAccountScreen = () => {
  const navigation = useNavigation();
  const { userDatav2 } = useSelector((state) => state.authSlice);

  // Step tracking
  const [currentStep, setCurrentStep] = useState(1); // 1: NIN Input, 2: OTP Verification, 3: Personal Details

  // Form data
  const [ninNumber, setNinNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  // Identity ID from step 1
  const [identityId, setIdentityId] = useState("");
  const [phoneHint, setPhoneHint] = useState("");

  // Step 1: Initiate NIN Verification
  const { mutate: initiateNinVerification, isPending: isInitiatingNin } =
    useMutateData_v2(
      "api/v1/savehaven/initiate-identity",
      "POST",
      "virtual-account",
    );

  // Step 2: Create Subaccount
  const { mutate: createSubaccount, isPending: isCreatingAccount } =
    useMutateData_v2(
      "api/v1/savehaven/create-subaccount",
      "POST",
      "virtual-account",
    );

  const handleNinSubmit = () => {
    if (!ninNumber || ninNumber.length !== 11) {
      Alert.alert("Invalid NIN", "Please enter a valid 11-digit NIN");
      return;
    }

    const payload = {
      identityType: "NIN",
      identityNumber: ninNumber,
    };

    initiateNinVerification(payload, {
      onSuccess: (data) => {
        console.log("NIN Verification Response:", data);

        if (data.success) {
          const idData = data.identityId?.data;
          setIdentityId(idData?._id);

          // Extract phone hint from message
          const message = data.identityId?.message || "";
          const phoneMatch = message.match(/(\d{4})/);
          if (phoneMatch) {
            setPhoneHint(phoneMatch[1]);
          }

          Alert.alert(
            "OTP Sent!",
            data.identityId?.message ||
              "OTP has been sent to your registered phone number",
            [{ text: "OK", onPress: () => setCurrentStep(2) }],
          );
        } else {
          Alert.alert("Error", data.message || "Failed to verify NIN");
        }
      },
      onError: (error) => {
        console.error("NIN Verification Error:", error);
        const errorMessage =
          error.data?.message ||
          "Failed to initiate verification. Please try again.";
        Alert.alert("Verification Failed", errorMessage);
      },
    });
  };

  const handleCreateAccount = () => {
    // Validation
    if (!otp || otp.length !== 6) {
      Alert.alert("Invalid OTP", "Please enter the 6-digit OTP");
      return;
    }
    if (!firstName || !lastName) {
      Alert.alert(
        "Missing Information",
        "Please enter your first and last name",
      );
      return;
    }
    if (!phoneNumber || phoneNumber.length < 11) {
      Alert.alert("Invalid Phone", "Please enter a valid phone number");
      return;
    }
    if (!email || !email.includes("@")) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }
    if (!street || !city || !state) {
      Alert.alert("Incomplete Address", "Please fill in all address fields");
      return;
    }

    const payload = {
      identityId: identityId,
      otp: otp,
      identityType: "NIN",
      identityNumber: ninNumber,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber.startsWith("+234")
        ? phoneNumber
        : `+234${phoneNumber.replace(/^0/, "")}`,
      emailAddress: email,
      address: {
        street: street,
        city: city,
        state: state,
      },
    };

    createSubaccount(payload, {
      onSuccess: (data) => {
        console.log("Account Creation Response:", data);

        if (data.success) {
          Alert.alert(
            "Success! 🎉",
            "Your virtual account has been created successfully!",
            [
              {
                text: "View Account",
                onPress: () => navigation.replace("VirtualAccountScreen"),
              },
            ],
          );
        } else {
          Alert.alert("Error", data.message || "Failed to create account");
        }
      },
      onError: (error) => {
        console.error("Account Creation Error:", error);
        const errorMessage =
          error.data?.message || "Failed to create account. Please try again.";
        Alert.alert("Creation Failed", errorMessage);
      },
    });
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            currentStep >= 1 && styles.stepCircleActive,
          ]}
        >
          <Text
            style={[
              styles.stepNumber,
              currentStep >= 1 && styles.stepNumberActive,
            ]}
          >
            1
          </Text>
        </View>
        <Text style={styles.stepLabel}>Verify NIN</Text>
      </View>

      <View
        style={[styles.stepLine, currentStep >= 2 && styles.stepLineActive]}
      />

      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            currentStep >= 2 && styles.stepCircleActive,
          ]}
        >
          <Text
            style={[
              styles.stepNumber,
              currentStep >= 2 && styles.stepNumberActive,
            ]}
          >
            2
          </Text>
        </View>
        <Text style={styles.stepLabel}>Enter OTP</Text>
      </View>

      <View
        style={[styles.stepLine, currentStep >= 3 && styles.stepLineActive]}
      />

      <View style={styles.stepItem}>
        <View
          style={[
            styles.stepCircle,
            currentStep >= 3 && styles.stepCircleActive,
          ]}
        >
          <Text
            style={[
              styles.stepNumber,
              currentStep >= 3 && styles.stepNumberActive,
            ]}
          >
            3
          </Text>
        </View>
        <Text style={styles.stepLabel}>Details</Text>
      </View>
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="verified-user" size={48} color="#10B981" />
        <Text style={styles.stepTitle}>Verify Your NIN</Text>
        <Text style={styles.stepDescription}>
          Enter your National Identification Number to get started. We'll send
          an OTP to your registered phone.
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>
          National Identification Number (NIN)
        </Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="badge"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter 11-digit NIN"
            value={ninNumber}
            onChangeText={setNinNumber}
            keyboardType="numeric"
            maxLength={11}
          />
        </View>
        <Text style={styles.inputHint}>Your NIN must be 11 digits</Text>
      </View>

      <TouchableOpacity
        style={[styles.primaryButton, isInitiatingNin && styles.buttonDisabled]}
        onPress={handleNinSubmit}
        disabled={isInitiatingNin}
      >
        {isInitiatingNin ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Send OTP</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="sms" size={48} color="#6366F1" />
        <Text style={styles.stepTitle}>Enter OTP</Text>
        <Text style={styles.stepDescription}>
          Enter the 6-digit code sent to your phone number ending with{" "}
          {phoneHint}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>One-Time Password</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="lock-outline"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />
        </View>
        <Text style={styles.inputHint}>Didn't receive? Dial *347*238#</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => setCurrentStep(3)}
      >
        <Text style={styles.primaryButtonText}>Verify OTP</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setCurrentStep(1)}
      >
        <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
        <Text style={styles.secondaryButtonText}>Change NIN</Text>
      </TouchableOpacity>
    </View>
  );

  // const renderStep3 = () => (
  //   <View style={styles.stepContent}>
  //     <View style={styles.stepHeader}>
  //       <MaterialIcons name="person-add" size={48} color="#F59E0B" />
  //       <Text style={styles.stepTitle}>Complete Your Profile</Text>
  //       <Text style={styles.stepDescription}>
  //         Provide your personal details to finalize account creation
  //       </Text>
  //     </View>

  //     <View style={styles.formContainer}>
  //       {/* Name Fields */}
  //       <View style={styles.inputRow}>
  //         <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
  //           <Text style={styles.inputLabel}>First Name</Text>
  //           <View style={styles.inputWrapper}>
  //             <TextInput
  //               style={styles.textInput}
  //               placeholder="John"
  //               value={firstName}
  //               onChangeText={setFirstName}
  //             />
  //           </View>
  //         </View>

  //         <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
  //           <Text style={styles.inputLabel}>Last Name</Text>
  //           <View style={styles.inputWrapper}>
  //             <TextInput
  //               style={styles.textInput}
  //               placeholder="Doe"
  //               value={lastName}
  //               onChangeText={setLastName}
  //             />
  //           </View>
  //         </View>
  //       </View>

  //       {/* Phone */}
  //       <View style={styles.inputContainer}>
  //         <Text style={styles.inputLabel}>Phone Number</Text>
  //         <View style={styles.inputWrapper}>
  //           <MaterialIcons
  //             name="phone"
  //             size={20}
  //             color="#6B7280"
  //             style={styles.inputIcon}
  //           />
  //           <TextInput
  //             style={styles.textInput}
  //             placeholder="+2348012345678"
  //             value={phoneNumber}
  //             onChangeText={setPhoneNumber}
  //             keyboardType="phone-pad"
  //           />
  //         </View>
  //       </View>

  //       {/* Email */}
  //       <View style={styles.inputContainer}>
  //         <Text style={styles.inputLabel}>Email Address</Text>
  //         <View style={styles.inputWrapper}>
  //           <MaterialIcons
  //             name="email"
  //             size={20}
  //             color="#6B7280"
  //             style={styles.inputIcon}
  //           />
  //           <TextInput
  //             style={styles.textInput}
  //             placeholder="john@example.com"
  //             value={email}
  //             onChangeText={setEmail}
  //             keyboardType="email-address"
  //             autoCapitalize="none"
  //           />
  //         </View>
  //       </View>

  //       {/* Address */}
  //       <View style={styles.inputContainer}>
  //         <Text style={styles.inputLabel}>Street Address</Text>
  //         <TextInput
  //           style={styles.textInput}
  //           placeholder="123 Main Street"
  //           value={street}
  //           onChangeText={setStreet}
  //         />
  //       </View>

  //       <View style={styles.inputRow}>
  //         <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
  //           <Text style={styles.inputLabel}>City</Text>
  //           <TextInput
  //             style={styles.textInput}
  //             placeholder="Lagos"
  //             value={city}
  //             onChangeText={setCity}
  //           />
  //         </View>

  //         <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
  //           <Text style={styles.inputLabel}>State</Text>
  //           <TextInput
  //             style={styles.textInput}
  //             placeholder="Lagos"
  //             value={state}
  //             onChangeText={setState}
  //           />
  //         </View>
  //       </View>
  //     </View>

  //     <TouchableOpacity
  //       style={[
  //         styles.primaryButton,
  //         isCreatingAccount && styles.buttonDisabled,
  //       ]}
  //       onPress={handleCreateAccount}
  //       disabled={isCreatingAccount}
  //     >
  //       {isCreatingAccount ? (
  //         <ActivityIndicator color="#FFFFFF" />
  //       ) : (
  //         <>
  //           <Text style={styles.primaryButtonText}>Create Account</Text>
  //           <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
  //         </>
  //       )}
  //     </TouchableOpacity>

  //     <TouchableOpacity
  //       style={styles.secondaryButton}
  //       onPress={() => setCurrentStep(2)}
  //     >
  //       <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
  //       <Text style={styles.secondaryButtonText}>Back to OTP</Text>
  //     </TouchableOpacity>
  //   </View>
  // );

  const renderStep3 = () => (
    <View style={styles.stepContent}>
      <View style={styles.stepHeader}>
        <MaterialIcons name="person-add" size={48} color="#F59E0B" />
        <Text style={styles.stepTitle}>Complete Your Profile</Text>
        <Text style={styles.stepDescription}>
          Provide your personal details to finalize account creation
        </Text>
      </View>

      <View style={styles.formContainer}>
        {/* Name Fields */}
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>First Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="John"
                placeholderTextColor="#9CA3AF"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Doe"
                placeholderTextColor="#9CA3AF"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>
        </View>

        {/* Phone */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="phone"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="+2348012345678"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="john@example.com"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* Street Address */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Street Address</Text>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="location-on"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.textInput, styles.textInputWithIcon]}
              placeholder="123 Main Street"
              placeholderTextColor="#9CA3AF"
              value={street}
              onChangeText={setStreet}
            />
          </View>
        </View>

        {/* City + State */}
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Lagos"
                placeholderTextColor="#9CA3AF"
                value={city}
                onChangeText={setCity}
              />
            </View>
          </View>

          <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>State</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Lagos"
                placeholderTextColor="#9CA3AF"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryButton,
          isCreatingAccount && styles.buttonDisabled,
        ]}
        onPress={handleCreateAccount}
        disabled={isCreatingAccount}
      >
        {isCreatingAccount ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Text style={styles.primaryButtonText}>Create Account</Text>
            <MaterialIcons name="check-circle" size={20} color="#FFFFFF" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setCurrentStep(2)}
      >
        <MaterialIcons name="arrow-back" size={20} color="#6366F1" />
        <Text style={styles.secondaryButtonText}>Back to OTP</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Styles to update ──────────────────────────────────────────────────────────
  // Replace your existing inputWrapper, textInput, and inputIcon styles with these:

  const updatedStyles = StyleSheet.create({
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: "#374151",
      marginBottom: 6,
      letterSpacing: 0.2,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      borderWidth: 1.5,
      borderColor: "#D1D5DB",
      borderRadius: 12,
      paddingHorizontal: 14,
      height: 52,
      // shadow for depth
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    inputIcon: {
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      fontSize: 15,
      color: "#111827",
      fontWeight: "400",
      height: "100%",
      paddingVertical: 0, // prevents Android extra padding
    },
    textInputWithIcon: {
      // no change needed — icon + flex handles it
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Virtual Account</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderStepIndicator()}

          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  scrollView: {
    flex: 1,
  },

  // Step Indicator
  stepIndicatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
  },
  stepItem: {
    alignItems: "center",
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepCircleActive: {
    backgroundColor: "#10B981",
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  stepNumberActive: {
    color: "#FFFFFF",
  },
  stepLabel: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: "#10B981",
  },

  // Step Content
  stepContent: {
    padding: 16,
  },
  stepHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 16,
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },

  // Form Elements
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: "row",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1F2937",
  },
  inputHint: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 6,
  },

  // Buttons
  primaryButton: {
    backgroundColor: "#10B981",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
  },
  secondaryButtonText: {
    color: "#6366F1",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default CreateVirtualAccountScreen;
