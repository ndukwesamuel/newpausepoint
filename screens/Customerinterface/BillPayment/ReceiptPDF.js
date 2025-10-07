// import React from "react";
// import { View, Button, Alert, Platform } from "react-native";
// import * as Print from "expo-print";
// import * as WebBrowser from "expo-web-browser";
// import * as Sharing from "expo-sharing";

// const ReceiptPDF = ({ transaction, customConfig = {} }) => {
//   const generateReceiptHTML = (transaction, customConfig = {}) => {
//     const currentDate = new Date().toLocaleString();

//     // Default configuration
//     const config = {
//       companyName: "STRON",
//       companySubtitle: "PRIVATE METERING COMPANY CHINA",
//       receiptTitle: "CAPTAINS COURT ESTATE AJAH ELECTRICITY BILL",
//       logoUrl:
//         customConfig.logoUrl ||
//         "http://www.stronsmart.com/wp-content/uploads/2020/09/2020091602490152.png",
//       watermarkText: "STRON",
//       ...customConfig,
//     };

//     return `
//       <!DOCTYPE html>
//       <html lang="en">
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1">
//           <title>${config.companyName} Receipt</title>
//           <style>
//             body {
//               font-family: Arial, sans-serif;
//               margin: 40px;
//               color: #000;
//               background: white;
//               line-height: 1.4;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             .company-line {
//               display: flex;
//               justify-content: center;
//               align-items: center;
//               gap: 15px;
//               margin-bottom: 10px;
//             }
//             .company-line img {
//               width: 120px;
//               height: auto;
//             }
//             .company-line span {
//               font-size: 18px;
//               font-weight: bold;
//             }
//             .sub-title {
//               font-size: 16px;
//               font-weight: bold;
//               text-decoration: underline;
//               margin-top: 5px;
//             }
//             hr {
//               border: 1px solid #000;
//               margin: 15px 0;
//             }
//             .content-wrapper {
//               display: flex;
//               justify-content: center;
//             }
//             .invoice-box {
//               width: 70%;
//               max-width: 500px;
//               padding: 20px;
//               border: 1px solid #ddd;
//               border-radius: 6px;
//             }
//             .section {
//               margin-bottom: 15px;
//             }
//             .section p {
//               margin: 4px 0;
//               font-size: 14px;
//             }
//             .bold {
//               font-weight: bold;
//             }
//             .token-section {
//               margin: 25px 0;
//             }
//             .token-label {
//               font-size: 16px;
//               font-weight: bold;
//               margin-bottom: 10px;
//             }
//             .token-value {
//               font-family: 'Courier New', monospace;
//               font-size: 14px;
//               font-weight: bold;
//               background: #f9f9f9;
//               padding: 10px;
//               border: 1px solid #ddd;
//               word-break: break-all;
//             }
//             .footer {
//               margin-top: 20px;
//               border-top: 1px solid #000;
//               padding-top: 10px;
//             }
//             @media print {
//               body { margin: 0; }
//               .invoice-box { border: none; }
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <div class="company-line">
//               <img src="${config.logoUrl}" alt="${config.companyName}">
//               <span>${config.companySubtitle}</span>
//             </div>
//             <p class="sub-title">${config.receiptTitle}</p>
//             <hr>
//           </div>
//           <div class="content-wrapper">
//             <div class="invoice-box">
//               <div class="section">
//                 <p>Date: ${transaction.date || currentDate}</p>
//                 <p>User Code: ${
//                   transaction.userCode || transaction.user || ""
//                 }</p>
//                 <p>Customer No.: ${transaction.customerNo || ""}</p>
//                 <p>Meter No.: ${transaction.meterNo || ""}</p>
//                 <p>Activity: ${
//                   transaction.activity || "Electricity Purchase"
//                 }</p>
//                 <p>District: ${transaction.district || ""}</p>
//                 <p>Account No.: ${transaction.accountNo || ""}</p>
//                 <p>Payment: ${transaction.paymentMethod || ""}</p>
//                 <p>Address: ${transaction.address || ""}</p>
//                 <p>Value: ₦${parseFloat(
//                   transaction.value || transaction.amount || 0
//                 ).toLocaleString()}</p>
//                 ${
//                   transaction.token
//                     ? `
//                   <div class="token-section">
//                     <div class="token-label">Token:</div>
//                     <div class="token-value">${transaction.token}</div>
//                   </div>
//                 `
//                     : ""
//                 }
//               </div>
//               <div class="footer">
//                 <p>VAT: ₦${parseFloat(
//                   transaction.vat || 0
//                 ).toLocaleString()}</p>
//                 <p class="bold">Total Fees: ₦${parseFloat(
//                   transaction.totalFees || transaction.serviceCharge || 0
//                 ).toLocaleString()}</p>
//                 <p class="bold">Amount Paid: ₦${parseFloat(
//                   transaction.amountPaid || transaction.amount || 0
//                 ).toLocaleString()}</p>
//                 <p class="bold">Net Value: ₦${parseFloat(
//                   transaction.netValue || transaction.amount || 0
//                 ).toLocaleString()}</p>
//               </div>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;
//   };

//   const saveAsPDF = async (customConfig = {}) => {
//     try {
//       if (!transaction) {
//         Alert.alert("Error", "Invalid transaction data");
//         return;
//       }

//       const htmlContent = generateReceiptHTML(transaction, customConfig);
//       const pdfOptions = {
//         html: htmlContent,
//         width: 612,
//         height: 792,
//         base64: false,
//       };

//       const { uri } = await Print.printToFileAsync(pdfOptions);
//       console.log("📄 PDF generated successfully at:", uri);
//       await handlePDFSharing(uri, htmlContent);
//     } catch (error) {
//       console.error("Error generating PDF:", error);
//       Alert.alert("Error", "Failed to generate PDF. Please try again.");
//     }
//   };

//   const handlePDFSharing = async (pdfUri, htmlContent) => {
//     try {
//       if (Platform.OS === "web") {
//         const newWindow = window.open("", "_blank");
//         if (newWindow) {
//           newWindow.document.write(htmlContent);
//           newWindow.document.close();
//         } else {
//           Alert.alert("Error", "Please allow popups to view receipt");
//         }
//         return;
//       }

//       const isAvailable = await Sharing.isAvailableAsync();
//       if (isAvailable) {
//         await Sharing.shareAsync(pdfUri, {
//           mimeType: "application/pdf",
//           dialogTitle: "Share Receipt",
//           UTI: "com.adobe.pdf",
//         });
//       } else {
//         await WebBrowser.openBrowserAsync(pdfUri);
//       }
//     } catch (error) {
//       console.error("Error sharing PDF:", error);
//       Alert.alert("PDF Generated", "Receipt saved successfully!");
//     }
//   };

//   const printReceipt = async (customConfig = {}) => {
//     try {
//       const htmlContent = generateReceiptHTML(transaction, customConfig);
//       await Print.printAsync({
//         html: htmlContent,
//         printerUrl: undefined,
//       });
//     } catch (error) {
//       console.error("Error printing:", error);
//       Alert.alert("Error", "Printing failed. Please try again.");
//     }
//   };

//   return (
//     <View
//       style={{
//         margin: 20,
//         gap: 10,
//         flexDirection: "row",
//         justifyContent: "space-around",
//       }}
//     >
//       <Button
//         title="💾 Save as PDF"
//         onPress={() => saveAsPDF()}
//         color="#007bbf"
//       />
//       <Button
//         title="🖨️ Print Receipt"
//         onPress={() => printReceipt()}
//         color="#ff8c00"
//       />
//     </View>
//   );
// };

// export default ReceiptPDF;

import React, { useEffect, useState } from "react";
import { View, Button, Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as WebBrowser from "expo-web-browser";
import * as Sharing from "expo-sharing";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

const ReceiptPDF = ({ transaction, customConfig = {} }) => {
  const [logoBase64, setLogoBase64] = useState("");

  useEffect(() => {
    // Convert local asset to Base64 once when component mounts
    const loadLogo = async () => {
      try {
        const asset = Asset.fromModule(
          require("../../../assets/captain/logo.png")
        ); // <-- put your logo in assets folder
        await asset.downloadAsync();
        const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        setLogoBase64(`data:image/png;base64,${base64}`);
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    };
    loadLogo();
  }, []);

  const generateReceiptHTML = (transaction, customConfig = {}) => {
    const currentDate = new Date().toLocaleString();

    const config = {
      companyName: "STRON",
      companySubtitle: "PRIVATE METERING COMPANY CHINA",
      receiptTitle: "CAPTAINS COURT ESTATE AJAH ELECTRICITY BILL",
      logoUrl: logoBase64 || customConfig.logoUrl || "", // prefer base64 logo
      watermarkText: "STRON",
      ...customConfig,
    };

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${config.companyName} Receipt</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 40px;
              color: #000;
              background: white;
              line-height: 1.4;
            }
            .header { text-align: center; margin-bottom: 20px; }
            .company-line {
              display: flex;
              justify-content: center;
              align-items: center;
              gap: 15px;
              margin-bottom: 10px;
            }
            .company-line img { width: 120px; height: auto; }
            .company-line span { font-size: 18px; font-weight: bold; }
            .sub-title {
              font-size: 16px; font-weight: bold; text-decoration: underline; margin-top: 5px;
            }
            hr { border: 1px solid #000; margin: 15px 0; }
            .content-wrapper { display: flex; justify-content: center; }
            .invoice-box {
              width: 70%; max-width: 500px; padding: 20px;
              border: 1px solid #ddd; border-radius: 6px;
            }
            .section { margin-bottom: 15px; }
            .section p { margin: 4px 0; font-size: 14px; }
            .bold { font-weight: bold; }
            .token-section { margin: 25px 0; }
            .token-label { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
            .token-value {
              font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold;
              background: #f9f9f9; padding: 10px; border: 1px solid #ddd;
              word-break: break-all;
            }
            .footer { margin-top: 20px; border-top: 1px solid #000; padding-top: 10px; }
            @media print { body { margin: 0; } .invoice-box { border: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-line">
              ${
                config.logoUrl
                  ? `<img src="${config.logoUrl}" alt="${config.companyName}">`
                  : ""
              }
              <span>${config.companySubtitle}</span>
            </div>
            <p class="sub-title">${config.receiptTitle}</p>
            <hr>
          </div>
          <div class="content-wrapper">
            <div class="invoice-box">
              <div class="section">
                <p>Date: ${transaction.date || currentDate}</p>
                <p>User Code: ${
                  transaction.userCode || transaction.user || ""
                }</p>
                <p>Customer No.: ${transaction.customerNo || ""}</p>
                <p>Meter No.: ${transaction.meterNo || ""}</p>
                <p>Activity: ${
                  transaction.activity || "Electricity Purchase"
                }</p>
                <p>District: ${transaction.district || ""}</p>
                <p>Account No.: ${transaction.accountNo || ""}</p>
                <p>Payment: ${transaction.paymentMethod || ""}</p>
                <p>Address: ${transaction.address || ""}</p>
                <p>Value: ₦${parseFloat(
                  transaction.value || transaction.amount || 0
                ).toLocaleString()}</p>
                ${
                  transaction.token
                    ? `<div class="token-section">
                        <div class="token-label">Token:</div>
                        <div class="token-value">${transaction.token}</div>
                       </div>`
                    : ""
                }
              </div>
              <div class="footer">
                <p>VAT: ₦${parseFloat(
                  transaction.vat || 0
                ).toLocaleString()}</p>
                <p class="bold">Total Fees: ₦${parseFloat(
                  transaction.totalFees || transaction.serviceCharge || 0
                ).toLocaleString()}</p>
                <p class="bold">Amount Paid: ₦${parseFloat(
                  transaction.amountPaid || transaction.amount || 0
                ).toLocaleString()}</p>
                <p class="bold">Net Value: ₦${parseFloat(
                  transaction.netValue || transaction.amount || 0
                ).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const saveAsPDF = async (customConfig = {}) => {
    try {
      if (!transaction) {
        Alert.alert("Error", "Invalid transaction data");
        return;
      }

      const htmlContent = generateReceiptHTML(transaction, customConfig);
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("📄 PDF generated successfully at:", uri);
      await handlePDFSharing(uri, htmlContent);
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", "Failed to generate PDF. Please try again.");
    }
  };

  const handlePDFSharing = async (pdfUri, htmlContent) => {
    try {
      if (Platform.OS === "web") {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
        } else {
          Alert.alert("Error", "Please allow popups to view receipt");
        }
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(pdfUri, {
          mimeType: "application/pdf",
          dialogTitle: "Share Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
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
      await Print.printAsync({ html: htmlContent });
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
      {/* <Button
        title="🖨️ Print Receipt"
        onPress={() => printReceipt()}
        color="#ff8c00"
      /> */}
    </View>
  );
};

export default ReceiptPDF;
