import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const ScreenWrapper = ({
  title,
  children,
  navigation,
  showBackButton = true,
  backgroundColor = "#fff",
  headerBackgroundColor = "#fff",
  titleColor = "#000",
  backButtonColor = "#000",
  statusBarStyle = "dark-content",
  showHeader = true,
  rightComponent = null, // Custom component for right side of header
}) => {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      {/* Status Bar */}
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={
          Platform.OS === "android" ? headerBackgroundColor : "transparent"
        }
        translucent={false}
      />

      {/* Header */}
      {showHeader && (
        <View
          style={[styles.header, { backgroundColor: headerBackgroundColor }]}
        >
          {/* Left Side - Back Button */}
          <View style={styles.leftContainer}>
            {showBackButton && navigation ? (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
                activeOpacity={0.7}
              >
                <AntDesign name="arrowleft" size={24} color={backButtonColor} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Center - Title */}
          <View style={styles.titleContainer}>
            <Text
              style={[styles.title, { color: titleColor }]}
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>

          {/* Right Side - Custom Component or Placeholder */}
          <View style={styles.rightContainer}>{rightComponent}</View>
        </View>
      )}

      {/* Content Area */}
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#e0e0e0",
    elevation: 1, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  leftContainer: {
    width: 50,
    alignItems: "flex-start",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  rightContainer: {
    width: 50,
    alignItems: "flex-end",
  },
  content: {
    flex: 1,
  },
});

export default ScreenWrapper;
