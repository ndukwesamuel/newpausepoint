import * as React from "react";
import { Platform, ScrollView, StyleSheet, ViewStyle } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  isScrollable?: boolean;
}

const AppScreen = ({ children, style, isScrollable = false }: Props) => {
  return (
    <SafeAreaView
      style={{
        // flex: 1,
        backgroundColor: "white",
        paddingTop: Platform.OS === "android" ? 25 : 0,
        flex: 1,
        // backgroundColor: "white",
        ...style,
      }}
    >
      <StatusBar style="dark" backgroundColor="transparent" />
      {isScrollable ? <ScrollView>{children}</ScrollView> : <>{children}</>}
    </SafeAreaView>
  );
};

export default AppScreen;

const styles = StyleSheet.create({});
