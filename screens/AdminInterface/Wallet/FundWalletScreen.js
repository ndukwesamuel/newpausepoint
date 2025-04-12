import React, { useState } from "react";
import { WebView } from "react-native-webview";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMutateData } from "../../../hooks/Request";
import Constants from "expo-constants";
const FundWalletScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [showFeeModal, setShowFeeModal] = useState(false);

  const [webviewstart, setwebviewstart] = useState(false);
  const [webviewdata, setwebviewdata] = useState(null);
  const {
    mutate: createUser,
    isLoading: ispending,
    error,
  } = useMutateData("wallet", "POST", "wallet");

  //   if (error) {
  //     console.log({
  //       jdjdj: error,
  //     });
  //   }
  const handleFundWallet = () => {
    createUser(
      { amount: amount },
      {
        onSuccess: (response) => {
          console.log({
            ddd: response?.data?.data,
          });
          setwebviewstart(true);
          setwebviewdata(response?.data?.data);
        },
      },

      {
        onError: (error) => {
          console.error("Mutation Error:", error.message);
        },
      }
    );
    // Handle fund wallet logic here
    // navigation.goBack();
  };

  return (
    <>
      {webviewstart ? (
        <WebView
          style={{
            flex: 1,
            marginTop: Constants.statusBarHeight,
          }}
          source={{ uri: webviewdata?.authorization_url }}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Fund Wallet </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
          <TouchableOpacity
            style={styles.feeIcon}
            onPress={() => setShowFeeModal(true)}
          >
            <Icon name="info-outline" size={24} color="#007BFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              {
                marginTop: 30,
              },
            ]}
            onPress={handleFundWallet}
          >
            {ispending ? (
              <Text>Loading...</Text>
            ) : (
              <Text style={styles.buttonText}>Add Funds</Text>
            )}
          </TouchableOpacity>

          {/* Modal to show service charge */}
          <Modal
            transparent={true}
            visible={showFeeModal}
            onRequestClose={() => setShowFeeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Service Charge</Text>
                <Text style={styles.modalText}>
                  A service charge of 2% will be applied to your transaction.
                  +100 naria for transaction more than 10000
                </Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setShowFeeModal(false)}
                >
                  <Text style={styles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  feeIcon: {
    position: "absolute",
    right: 30,
    top: 120,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
});

export default FundWalletScreen;
