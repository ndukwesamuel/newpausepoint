// import { View, Text, Button } from "react-native";
import React from "react";
import ElectricityPaymentScreen from "./ElectricityPaymentScreen";
import HistoryScreen from "./HistoryScreen";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { View, Button, Alert, Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as FileSystem from "expo-file-system";
import ReceiptPDF from "./ReceiptPDF";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";
import { useNavigation } from "@react-navigation/native";
export default function BillDashboard() {
  const navigation = useNavigation();
  return (
    <ScreenWrapper
      title=" Utility Payment"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
    >
      <HistoryScreen />
    </ScreenWrapper>
  );
}
