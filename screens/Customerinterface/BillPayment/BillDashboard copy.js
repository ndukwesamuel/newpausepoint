// import { View, Text, Button } from "react-native";
import React from "react";
import ElectricityPaymentScreen from "./ElectricityPaymentScreen";
import HistoryScreen from "./HistoryScreen";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { View, Button, Alert, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
export default function BillDashboard() {
  // return <HistoryScreen />;

  const transactionData = {
    date: new Date().toLocaleString(),
    user: "John Doe",
    customerNo: "123456789",
    meterNo: "MTR001234",
    token: "1234-5678-9012-3456",
    amount: "5000.00",
    serviceCharge: "50.00",
    reference: "TXN789012345",
    status: "Successful",
  };

  return <ReceiptPDF transaction={transactionData} />;
  // return <ReceiptPDF />;
}

// // import React from "react";
// // import { Button, View } from "react-native";

// const ReceiptPDF = ({ transaction }) => {
//   const saveAsPDF = async () => {
//     // 1. Define the HTML for your receipt
//     const html = `
//       <html>
//         <body style="font-family: Arial; padding: 20px;">
//           <h2 style="text-align: center;">ZynoPay Receipt</h2>
//           <hr />
//           <p><b>Date:</b> ${transaction.date}</p>
//           <p><b>User:</b> ${transaction.user}</p>
//           <p><b>Customer No:</b> ${transaction.customerNo}</p>
//           <p><b>Meter No:</b> ${transaction.meterNo}</p>
//           <p><b>Token:</b> ${transaction.token}</p>
//           <p><b>Amount Paid:</b> ₦${transaction.amount}</p>
//           <hr />
//           <p style="text-align: center;">Thank you for your payment ✅</p>
//         </body>
//       </html>
//     `;

//     // 2. Generate PDF
//     const { uri } = await Print.printToFileAsync({ html });

//     console.log("📄 PDF saved at:", uri);

//     // 3. Share PDF (WhatsApp, Gmail, etc.)
//     if (await Sharing.isAvailableAsync()) {
//       await Sharing.shareAsync(uri);
//     } else {
//       alert("Sharing not available on this device");
//     }
//   };

//   return (
//     <View style={{ margin: 20 }}>
//       <Button title="Save as PDF" onPress={saveAsPDF} />
//     </View>
//   );
// };

// // export default ReceiptPDF;

const ReceiptPDF = ({ transaction }) => {
  const generateReceiptHTML = (transaction) => {
    const currentDate = new Date().toLocaleString();

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>ZynoPay Receipt</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: #f8f9fa;
              color: #333;
              line-height: 1.6;
            }
            .receipt-container {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 12px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #4CAF50, #45a049);
              color: white;
              padding: 25px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
              font-weight: 600;
            }
            .header p {
              margin: 5px 0 0 0;
              opacity: 0.9;
              font-size: 14px;
            }
            .content {
              padding: 25px 20px;
            }
            .transaction-id {
              background: #f0f8ff;
              border-left: 4px solid #4CAF50;
              padding: 12px 15px;
              margin-bottom: 20px;
              border-radius: 4px;
            }
            .transaction-id .label {
              font-size: 12px;
              color: #666;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .transaction-id .value {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              font-weight: bold;
              color: #333;
              margin-top: 4px;
            }
            .info-grid {
              display: grid;
              gap: 15px;
              margin-bottom: 20px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #eee;
            }
            .info-item:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #555;
              font-size: 14px;
            }
            .value {
              font-weight: 500;
              color: #333;
              font-size: 14px;
              text-align: right;
            }
            .amount {
              background: #e8f5e8;
              border-radius: 6px;
              padding: 8px 12px;
              font-weight: bold;
              color: #2e7d32;
              font-size: 16px;
            }
            .token-section {
              background: #fff3cd;
              border: 1px solid #ffeaa7;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
              text-align: center;
            }
            .token-label {
              font-size: 12px;
              color: #856404;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }
            .token-value {
              font-family: 'Courier New', monospace;
              font-size: 18px;
              font-weight: bold;
              color: #856404;
              letter-spacing: 1px;
              word-break: break-all;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: #f8f9fa;
              border-top: 1px solid #eee;
            }
            .success-icon {
              font-size: 24px;
              margin-bottom: 8px;
            }
            .thank-you {
              font-size: 16px;
              font-weight: 600;
              color: #4CAF50;
              margin-bottom: 4px;
            }
            .support-text {
              font-size: 12px;
              color: #666;
            }
            .divider {
              height: 1px;
              background: linear-gradient(to right, transparent, #ddd, transparent);
              margin: 20px 0;
            }
            @media print {
              body { background: white; }
              .receipt-container { 
                box-shadow: none; 
                max-width: none;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <div class="header">
              <h1>ZynoPay</h1>
              <p>Payment Receipt</p>
            </div>
            
            <div class="content">
              ${
                transaction.reference
                  ? `
                <div class="transaction-id">
                  <div class="label">Transaction Reference</div>
                  <div class="value">${transaction.reference}</div>
                </div>
              `
                  : ""
              }
              
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Date & Time</span>
                  <span class="value">${transaction.date || currentDate}</span>
                </div>
                
                <div class="info-item">
                  <span class="label">Customer</span>
                  <span class="value">${transaction.user || "N/A"}</span>
                </div>
                
                ${
                  transaction.customerNo
                    ? `
                  <div class="info-item">
                    <span class="label">Customer No.</span>
                    <span class="value">${transaction.customerNo}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  transaction.meterNo
                    ? `
                  <div class="info-item">
                    <span class="label">Meter No.</span>
                    <span class="value">${transaction.meterNo}</span>
                  </div>
                `
                    : ""
                }
                
                <div class="info-item">
                  <span class="label">Amount Paid</span>
                  <span class="value amount">₦${parseFloat(
                    transaction.amount || 0
                  ).toLocaleString()}</span>
                </div>
                
                ${
                  transaction.serviceCharge
                    ? `
                  <div class="info-item">
                    <span class="label">Service Charge</span>
                    <span class="value">₦${parseFloat(
                      transaction.serviceCharge
                    ).toLocaleString()}</span>
                  </div>
                `
                    : ""
                }
                
                ${
                  transaction.status
                    ? `
                  <div class="info-item">
                    <span class="label">Status</span>
                    <span class="value" style="color: #4CAF50; font-weight: bold;">${transaction.status}</span>
                  </div>
                `
                    : ""
                }
              </div>
              
              ${
                transaction.token
                  ? `
                <div class="token-section">
                  <div class="token-label">Electricity Token</div>
                  <div class="token-value">${transaction.token}</div>
                </div>
              `
                  : ""
              }
              
              <div class="divider"></div>
            </div>
            
            <div class="footer">
              <div class="success-icon">✅</div>
              <div class="thank-you">Payment Successful!</div>
              <div class="support-text">Keep this receipt for your records</div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const saveAsPDF = async () => {
    try {
      // Validate transaction data
      if (!transaction || !transaction.amount) {
        Alert.alert("Error", "Invalid transaction data");
        return;
      }

      // Generate HTML content
      const htmlContent = generateReceiptHTML(transaction);

      // Configure PDF options
      const pdfOptions = {
        html: htmlContent,
        width: 612, // Standard width for receipts
        height: 792, // Standard height
        base64: false,
      };

      // Generate PDF
      const { uri } = await Print.printToFileAsync(pdfOptions);

      console.log("📄 PDF generated successfully at:", uri);

      // Handle sharing based on platform
      await handlePDFSharing(uri, htmlContent);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  const handlePDFSharing = async (pdfUri, htmlContent) => {
    try {
      if (Platform.OS === "web") {
        // For web platform, open HTML in new window
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        } else {
          Alert.alert("Error", "Please allow popups to view receipt");
        }
        return;
      }

      // For mobile platforms
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        // Show share dialog with custom options
        await Sharing.shareAsync(pdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
        // Fallback: Open in browser
        await WebBrowser.openBrowserAsync(pdfUri);
      }
    } catch (error) {
      console.error("Error sharing PDF:", error);
      Alert.alert("PDF Generated", "Receipt saved successfully!");
    }
  };

  const printReceipt = async () => {
    try {
      const htmlContent = generateReceiptHTML(transaction);

      // Use Print.printAsync for direct printing
      await Print.printAsync({
        html: htmlContent,
        printerUrl: undefined, // Let user choose printer
      });
    } catch (error) {
      console.error("Error printing:", error);
      Alert.alert("Error", "Printing failed. Please try again.");
    }
  };

  return (
    <View
      style={{
        margin: 20,
        gap: 10,
        flexDirection: "row",
        justifyContent: "space-around",
      }}
    >
      <Button title="💾 Save as PDF" onPress={saveAsPDF} color="#4CAF50" />
      <Button title="🖨️ Print Receipt" onPress={printReceipt} color="#2196F3" />
    </View>
  );
};

// export default ReceiptPDF;

// Example usage:
/*

*/
