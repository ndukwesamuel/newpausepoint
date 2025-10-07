import React from "react";
import { View, Button, Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

const ReceiptPDF = ({ transaction, customConfig = {} }) => {
  const generateReceiptHTML = (transaction, customConfig = {}) => {
    const currentDate = new Date().toLocaleString();

    // Default configuration - you can override these
    const config = {
      companyName: "STRON",
      companySubtitle: "PRIVATE METERING COMPANY CHINA",
      receiptTitle: "CAPTAINS COURT ESTATE AJAH ELECTRICITY BILL",
      logoUrl: customConfig.logoUrl || "", // Add your logo URL here
      watermarkText: "STRON",
      ...customConfig,
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${config.companyName} Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              background: white;
              color: #333;
              line-height: 1.4;
              position: relative;
            }
            .watermark {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-45deg);
              font-size: 120px;
              font-weight: bold;
              color: rgba(0, 123, 191, 0.1);
              z-index: -1;
              pointer-events: none;
            }
            .receipt-container {
              max-width: 500px;
              margin: 0 auto;
              background: white;
              position: relative;
              z-index: 1;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px 0;
            }
            .company-logo {
              display: block;
              text-align: center;
              margin-bottom: 15px;
            }
            .company-logo img {
              max-height: 80px;
              max-width: 200px;
              width: auto;
              height: auto;
              display: block;
              margin: 0 auto 15px auto;
            }
            .logo-text {
              font-size: 36px;
              font-weight: bold;
              color: #007bbf;
              display: block;
              margin-bottom: 10px;
            }
            .logo-accent {
              width: 40px;
              height: 20px;
              background: linear-gradient(135deg, #ff8c00, #ff6b00);
              border-radius: 20px;
              margin: 0 auto 15px auto;
            }
            .company-subtitle {
              font-size: 14px;
              font-weight: bold;
              color: #333;
              letter-spacing: 1px;
              margin: 10px 0;
              text-transform: uppercase;
            }
            .receipt-title {
              font-size: 16px;
              font-weight: bold;
              color: #333;
              margin-top: 20px;
              padding: 10px 0 5px 0;
              border-bottom: 2px solid #333;
              text-transform: uppercase;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin: 30px 0 20px 0;
            }
            .content {
              padding: 0 10px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 15px;
              font-size: 14px;
            }
            .label {
              font-weight: 500;
              color: #333;
              min-width: 120px;
            }
            .colon {
              margin: 0 10px;
            }
            .value {
              font-weight: 500;
              color: #333;
              text-align: right;
              flex: 1;
            }
            .token-section {
              margin: 25px 0;
            }
            .token-label {
              font-size: 20px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .token-value {
              font-family: 'Courier New', monospace;
              font-size: 16px;
              font-weight: bold;
              color: #333;
              background: #f9f9f9;
              padding: 10px;
              border: 1px solid #ddd;
              word-break: break-all;
              letter-spacing: 1px;
            }
            .financial-summary {
              margin-top: 30px;
            }
            .vat-line {
              display: flex;
              justify-content: space-between;
              margin: 15px 0;
              font-size: 14px;
            }
            .total-fees, .amount-paid, .net-value {
              font-size: 18px;
              font-weight: bold;
              margin: 15px 0;
            }
            .amount-highlight {
              font-size: 20px;
              color: #007bbf;
            }
            @media print {
              .watermark { display: none; }
              body { background: white; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">${config.watermarkText}</div>
          
          <div class="receipt-container">
            <div class="header">
              <div class="company-logo">
                ${
                  config.logoUrl
                    ? `
                  <img src="${config.logoUrl}" alt="${config.companyName}" style="max-height: 50px; margin-right: 15px;">
                `
                    : `
                  <div class="logo-text">${config.companyName}</div>
                  <div class="logo-accent"></div>
                `
                }
              </div>
              <div class="company-subtitle">${config.companySubtitle}</div>
              <div class="receipt-title">${config.receiptTitle}</div>
            </div>
            
            <div class="content">
              <div class="section-title">Selling Card</div>
              
              <div class="info-item">
                <span class="label">Date</span>
                <span class="colon">:</span>
                <span class="value">${transaction.date || currentDate}</span>
              </div>
              
              <div class="info-item">
                <span class="label">User Code</span>
                <span class="colon">:</span>
                <span class="value">${
                  transaction.userCode || transaction.user || ""
                }</span>
              </div>
              
              <div class="info-item">
                <span class="label">Customer No.</span>
                <span class="colon">:</span>
                <span class="value">${transaction.customerNo || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Meter No.</span>
                <span class="colon">:</span>
                <span class="value">${transaction.meterNo || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Activity</span>
                <span class="colon">:</span>
                <span class="value">${
                  transaction.activity || "Electricity Purchase"
                }</span>
              </div>
              
              <div class="info-item">
                <span class="label">District</span>
                <span class="colon">:</span>
                <span class="value">${transaction.district || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Account No.</span>
                <span class="colon">:</span>
                <span class="value">${transaction.accountNo || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Payment</span>
                <span class="colon">:</span>
                <span class="value">${transaction.paymentMethod || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Address</span>
                <span class="colon">:</span>
                <span class="value">${transaction.address || ""}</span>
              </div>
              
              <div class="info-item">
                <span class="label">Value</span>
                <span class="colon">:</span>
                <span class="value">₦${parseFloat(
                  transaction.value || transaction.amount || 0
                ).toLocaleString()}</span>
              </div>
              
              ${
                transaction.token
                  ? `
                <div class="token-section">
                  <div class="token-label">Token :</div>
                  <div class="token-value">${transaction.token}</div>
                </div>
              `
                  : ""
              }
              
              <div class="financial-summary">
                <div class="vat-line">
                  <span>VAT.................. :</span>
                  <span>₦${parseFloat(
                    transaction.vat || 0
                  ).toLocaleString()}</span>
                </div>
                
                <div class="info-item total-fees">
                  <span class="label">Total Fees.....</span>
                  <span class="colon">:</span>
                  <span class="value">₦${parseFloat(
                    transaction.totalFees || transaction.serviceCharge || 0
                  ).toLocaleString()}</span>
                </div>
                
                <div class="info-item amount-paid">
                  <span class="label">Amount Paid.</span>
                  <span class="colon">:</span>
                  <span class="value amount-highlight">₦${parseFloat(
                    transaction.amountPaid || transaction.amount || 0
                  ).toLocaleString()}</span>
                </div>
                
                <div class="info-item net-value">
                  <span class="label">Net Value.....</span>
                  <span class="colon">:</span>
                  <span class="value">₦${parseFloat(
                    transaction.netValue || transaction.amount || 0
                  ).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const saveAsPDF = async (customConfig = {}) => {
    try {
      // Validate transaction data
      if (!transaction) {
        Alert.alert("Error", "Invalid transaction data");
        return;
      }

      // Generate HTML content with custom configuration
      const htmlContent = generateReceiptHTML(transaction, customConfig);

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

  const printReceipt = async (customConfig = {}) => {
    try {
      const htmlContent = generateReceiptHTML(transaction, customConfig);

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
      <Button
        title="💾 Save as PDF"
        onPress={() => saveAsPDF()}
        color="#007bbf"
      />
      <Button
        title="🖨️ Print Receipt"
        onPress={() => printReceipt()}
        color="#ff8c00"
      />
    </View>
  );
};

export default ReceiptPDF;

// Example usage with STRON format:
/*
const transactionData = {
  date: "2024-01-15 14:30:00",
  userCode: "UC123456",
  customerNo: "123456789",
  meterNo: "MTR001234",
  activity: "Electricity Purchase",
  district: "Ajah",
  accountNo: "ACC789012",
  paymentMethod: "Online Payment",
  address: "Captains Court Estate, Ajah",
  value: "5000.00",
  token: "1234-5678-9012-3456-7890",
  vat: "375.00",
  totalFees: "100.00",
  amountPaid: "5475.00",
  netValue: "5000.00"
};

// Custom configuration (optional)
const customConfig = {
  companyName: "YOUR COMPANY",
  companySubtitle: "YOUR SUBTITLE HERE", 
  receiptTitle: "YOUR CUSTOM TITLE",
  logoUrl: "https://yoursite.com/logo.png", // Optional logo URL
  watermarkText: "YOUR BRAND"
};

<ReceiptPDF transaction={transactionData} />

// Or with custom config:
// <ReceiptPDF transaction={transactionData} customConfig={customConfig} />
*/
