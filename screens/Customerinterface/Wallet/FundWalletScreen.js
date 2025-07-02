// import React, { useState } from "react";
// import { WebView } from "react-native-webview";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Modal,
// } from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import { useMutateData } from "../../../hooks/Request";
// import Constants from "expo-constants";
// const FundWalletScreen = ({ navigation }) => {
//   const [amount, setAmount] = useState("");
//   const [showFeeModal, setShowFeeModal] = useState(false);

//   const [webviewstart, setwebviewstart] = useState(false);
//   const [webviewdata, setwebviewdata] = useState(null);
//   const {
//     mutate: createUser,
//     isLoading: ispending,
//     error,
//   } = useMutateData("wallet", "POST", "wallet");

//   const handleFundWallet = () => {
//     createUser(
//       { amount: amount },
//       {
//         onSuccess: (response) => {
//           console.log({
//             ddd: response?.data?.data,
//           });
//           setwebviewstart(true);
//           setwebviewdata(response?.data?.data);
//         },
//       },

//       {
//         onError: (error) => {
//           console.error("Mutation Error:", error.message);
//         },
//       }
//     );
//     // Handle fund wallet logic here
//     // navigation.goBack();
//   };

//   return (
//     <>
//       {webviewstart ? (
//         <>
//           {console.log({
//             jdjdjd: webviewdata?.authorization_url,
//           })}
//           <WebView
//             style={{
//               flex: 1,
//               marginTop: Constants.statusBarHeight,
//             }}
//             source={{ uri: webviewdata?.authorization_url }}
//           />
//         </>
//       ) : (
//         <View style={styles.container}>
//           <Text style={styles.title}>Fund Wallet</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Enter amount"
//             keyboardType="numeric"
//             value={amount}
//             onChangeText={setAmount}
//           />
//           <TouchableOpacity
//             style={styles.feeIcon}
//             onPress={() => setShowFeeModal(true)}
//           >
//             <Icon name="info-outline" size={24} color="#007BFF" />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[
//               styles.button,
//               {
//                 marginTop: 30,
//               },
//             ]}
//             onPress={handleFundWallet}
//           >
//             {ispending ? (
//               <Text>Loading...</Text>
//             ) : (
//               <Text style={styles.buttonText}>Add Funds</Text>
//             )}
//           </TouchableOpacity>

//           {/* Modal to show service charge */}
//           <Modal
//             transparent={true}
//             visible={showFeeModal}
//             onRequestClose={() => setShowFeeModal(false)}
//           >
//             <View style={styles.modalOverlay}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Service Charge</Text>
//                 <Text style={styles.modalText}>
//                   A service charge of 2% will be applied to your transaction.
//                   +100 naria for transaction more than 10000
//                 </Text>
//                 <TouchableOpacity
//                   style={styles.modalButton}
//                   onPress={() => setShowFeeModal(false)}
//                 >
//                   <Text style={styles.modalButtonText}>Close</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </Modal>
//         </View>
//       )}
//     </>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#F5F5F5",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#CCCCCC",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//   },
//   feeIcon: {
//     position: "absolute",
//     right: 30,
//     top: 120,
//   },
//   button: {
//     backgroundColor: "#007BFF",
//     padding: 15,
//     borderRadius: 5,
//     alignItems: "center",
//   },
//   buttonText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
//   modalOverlay: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     width: "80%",
//     backgroundColor: "#FFF",
//     borderRadius: 10,
//     padding: 20,
//     alignItems: "center",
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   modalText: {
//     fontSize: 16,
//     textAlign: "center",
//     marginBottom: 20,
//   },
//   modalButton: {
//     backgroundColor: "#007BFF",
//     padding: 10,
//     borderRadius: 5,
//     width: "50%",
//     alignItems: "center",
//   },
//   modalButtonText: {
//     color: "#FFF",
//     fontSize: 16,
//   },
// });

// export default FundWalletScreen;

import React, { useState, useRef } from "react"; // Import useRef
import { WebView } from "react-native-webview";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator, // For a better loading indicator
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMutateData } from "../../../hooks/Request";
import Constants from "expo-constants";

const FundWalletScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [webviewstart, setwebviewstart] = useState(false);
  const [webviewdata, setwebviewdata] = useState(null);
  const [webviewLoading, setWebviewLoading] = useState(true); // Track WebView loading state

  // Use useRef to access the WebView methods if needed
  const webViewRef = useRef(null);

  const {
    mutate: createUser,
    isLoading: ispending,
    error,
  } = useMutateData("wallet", "POST", "wallet");

  const handleFundWallet = () => {
    // Basic validation
    if (!amount || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount to fund.");
      return;
    }

    createUser(
      { amount: amount },
      {
        onSuccess: (response) => {
          console.log({
            paystackResponse: response?.data?.data,
          });
          setwebviewstart(true);
          setwebviewdata(response?.data?.data);
          setWebviewLoading(true); // Start loading indicator when WebView appears
        },
        onError: (error) => {
          console.error("Mutation Error:", error.message);
          alert(
            `Failed to initiate payment: ${
              error.message || "An error occurred"
            }`
          );
        },
      }
    );
  };

  const onNavigationStateChange = (navState) => {
    const { url, loading } = navState;
    console.log("WebView Navigation State Changed:", url);

    // Hide loading indicator when page finishes loading
    if (!loading) {
      setWebviewLoading(false);
    }

    // IMPORTANT: Handle Paystack success/cancel redirects
    // Paystack usually redirects to standard.paystack.co/close or your callback_url
    // You MUST configure a callback_url in your Paystack dashboard or in your API call
    // for `callback_url` parameter when initializing the transaction.
    // Replace 'YOUR_SUCCESS_CALLBACK_URL' and 'YOUR_CANCEL_CALLBACK_URL'
    // with the actual URLs Paystack will redirect to.
    // For 3DS, Paystack often redirects to https://standard.paystack.co/close
    // after authentication.

    // Example: If Paystack redirects to a success or cancel page on your server
    // or a specific Paystack URL that indicates completion.
    if (url.includes("https://standard.paystack.co/close")) {
      console.log(
        "Paystack close URL detected. Payment flow potentially completed."
      );
      // This is a common indicator that the Paystack checkout has finished.
      // You now need to verify the transaction on your backend using the reference.
      // You can also add a slight delay to allow any final JS to execute if needed.
      // For example, if your backend call to Paystack to verify requires a moment.
      // For now, let's just close the webview and assume success/needs verification.
      setwebviewstart(false);
      alert("Payment process completed. Checking status...");
      // Trigger a verification call to your backend with the reference if available.
      // e.g., verifyPayment(webviewdata?.reference);
      return false; // Prevent WebView from loading this URL
    }

    // If you have a specific callback URL on your server for success/failure
    if (url.includes("YOUR_APP_SUCCESS_URL")) {
      // e.g., yourdomain.com/paystack-success?reference=...
      console.log("Success callback URL detected.");
      setwebviewstart(false);
      alert("Payment Successful!");
      // Extract reference from URL and verify on backend
      // navigation.navigate('PaymentSuccess', { reference: getReferenceFromUrl(url) });
      return false; // Prevent WebView from loading this URL
    }

    if (url.includes("YOUR_APP_CANCEL_URL")) {
      // e.g., yourdomain.com/paystack-cancel
      console.log("Cancel callback URL detected.");
      setwebviewstart(false);
      alert("Payment Cancelled.");
      // navigation.goBack();
      return false; // Prevent WebView from loading this URL
    }

    // Allow other URLs to load in the WebView
    return true;
  };

  return (
    <>
      {webviewstart ? (
        <View style={{ flex: 1, marginTop: Constants.statusBarHeight }}>
          {webviewLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#007BFF" />
              <Text style={styles.loadingText}>Loading Paystack...</Text>
            </View>
          )}
          {console.log({
            loadingWebviewUrl: webviewdata?.authorization_url,
          })}
          <WebView
            ref={webViewRef} // Assign ref
            style={{ flex: 1 }}
            source={{ uri: webviewdata?.authorization_url }}
            onNavigationStateChange={onNavigationStateChange} // Crucial for redirects
            onLoadStart={() => setWebviewLoading(true)}
            onLoadEnd={() => setWebviewLoading(false)}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn("WebView error: ", nativeEvent);
              alert(`WebView Error: ${nativeEvent.description}`);
              setwebviewstart(false); // Close webview on error
            }}
            // Optional: onShouldStartLoadWithRequest can be used if you need more granular control
            // before a navigation even begins. For most Paystack cases, onNavigationStateChange is enough.
            // onShouldStartLoadWithRequest={onNavigationStateChange} // Can use the same handler
            javaScriptEnabled={true} // Ensure JavaScript is enabled
            domStorageEnabled={true} // Enable DOM storage for some sites
            cacheEnabled={false} // Disable cache to ensure fresh load
            incognito={true} // Private Browse mode
            allowsBackForwardNavigationGestures={true} // Allow swipe gestures for navigation
          />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Fund Wallet</Text>
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
            disabled={ispending} // Disable button while loading
          >
            {ispending ? (
              <ActivityIndicator color="#FFF" />
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
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    zIndex: 10, // Ensure it's above the WebView
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default FundWalletScreen;
