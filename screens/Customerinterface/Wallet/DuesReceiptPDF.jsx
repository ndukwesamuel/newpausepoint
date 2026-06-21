import React, { useEffect, useState } from "react";
import { View, Button, Alert, Platform } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

const DuesReceiptPDF = ({ due }) => {
  const generateReceiptHTML = () => {
    const paidAt = due.paidAt
      ? new Date(due.paidAt).toLocaleString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date().toLocaleString();

    const dueDate = due.dueDate
      ? new Date(due.dueDate).toLocaleDateString("en-NG", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "N/A";

    const category = (due.category || "other").replace(/_/g, " ");
    const estateName = due.clan?.name || "Estate";

    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>PausePoint Receipt</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: Arial, sans-serif;
              background: #f4f4f4;
              padding: 40px 20px;
              color: #111;
            }
            .card {
              background: white;
              max-width: 520px;
              margin: 0 auto;
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header {
              background: #111827;
              padding: 28px 32px;
              text-align: center;
            }
            .header h1 {
              color: white;
              font-size: 22px;
              font-weight: 800;
              letter-spacing: 0.5px;
            }
            .header p {
              color: #9CA3AF;
              font-size: 13px;
              margin-top: 4px;
            }
            .badge {
              display: inline-block;
              background: #10B981;
              color: white;
              font-size: 12px;
              font-weight: 700;
              padding: 4px 14px;
              border-radius: 20px;
              margin-top: 12px;
              text-transform: uppercase;
              letter-spacing: 0.8px;
            }
            .amount-section {
              background: #F0FDF4;
              padding: 24px 32px;
              text-align: center;
              border-bottom: 1px solid #E5E7EB;
            }
            .amount-label {
              font-size: 13px;
              color: #6B7280;
              font-weight: 600;
              text-transform: uppercase;
              letter-spacing: 0.6px;
            }
            .amount-value {
              font-size: 40px;
              font-weight: 800;
              color: #059669;
              margin-top: 6px;
            }
            .body { padding: 24px 32px; }
            .row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 12px 0;
              border-bottom: 1px solid #F3F4F6;
              font-size: 14px;
            }
            .row:last-child { border-bottom: none; }
            .row .key { color: #9CA3AF; font-weight: 500; }
            .row .val { color: #111827; font-weight: 700; text-align: right; max-width: 60%; }
            .val.capitalize { text-transform: capitalize; }
            .footer {
              background: #F9FAFB;
              padding: 18px 32px;
              text-align: center;
              border-top: 1px dashed #E5E7EB;
            }
            .footer p { font-size: 12px; color: #9CA3AF; line-height: 18px; }
            .footer strong { color: #10B981; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>PausePoint</h1>
              <p>${estateName}</p>
              <div class="badge">✓ Payment Confirmed</div>
            </div>

            <div class="amount-section">
              <div class="amount-label">Amount Paid</div>
              <div class="amount-value">₦${(due.amountPaid || 0).toLocaleString("en-NG")}</div>
            </div>

            <div class="body">
              <div class="row">
                <span class="key">Due Title</span>
                <span class="val">${due.title || "N/A"}</span>
              </div>
              <div class="row">
                <span class="key">Category</span>
                <span class="val capitalize">${category}</span>
              </div>
              ${due.description ? `
              <div class="row">
                <span class="key">Description</span>
                <span class="val">${due.description}</span>
              </div>` : ""}
              <div class="row">
                <span class="key">Estate</span>
                <span class="val">${estateName}</span>
              </div>
              <div class="row">
                <span class="key">Due Date</span>
                <span class="val">${dueDate}</span>
              </div>
              <div class="row">
                <span class="key">Paid On</span>
                <span class="val">${paidAt}</span>
              </div>
              <div class="row">
                <span class="key">Reference</span>
                <span class="val">${due._id}</span>
              </div>
              <div class="row">
                <span class="key">Status</span>
                <span class="val" style="color: #059669;">✓ Paid</span>
              </div>
            </div>

            <div class="footer">
              <p>This is an official payment receipt issued by <strong>PausePoint</strong>.</p>
              <p>Please keep this for your records.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  };

  const handleDownload = async () => {
    try {
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({ html });

      if (Platform.OS === "web") {
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(html);
          newWindow.document.close();
        }
        return;
      }

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download Receipt",
          UTI: "com.adobe.pdf",
        });
      } else {
        await WebBrowser.openBrowserAsync(uri);
      }
    } catch (error) {
      console.error("Receipt error:", error);
      Alert.alert("Error", "Failed to generate receipt. Please try again.");
    }
  };

  return (
    <View style={{ marginTop: 8 }}>
      <Button
        title="📄 Download Receipt"
        onPress={handleDownload}
        color="#111827"
      />
    </View>
  );
};

export default DuesReceiptPDF;