import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Platform,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from "react-native";

export const UpdateScreen = ({ message, onRetry, isLoading }) => (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      {/* <Image
        source={require("./assets/update.png")}
        style={{ width: 200, height: 200, marginBottom: 32 }}
        resizeMode="contain"
      /> */}

      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          color: "#333",
          textAlign: "center",
        }}
      >
        Update Required
      </Text>

      <Text
        style={{
          fontSize: 16,
          color: "#666",
          textAlign: "center",
          marginBottom: 32,
          lineHeight: 24,
          paddingHorizontal: 16,
        }}
      >
        {message ||
          "A new version of the app is available. Please update to continue using all features."}
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#007AFF",
          paddingHorizontal: 32,
          paddingVertical: 16,
          borderRadius: 8,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
        onPress={async () => {
          try {
            const url =
              Platform.OS === "ios"
                ? "https://apps.apple.com/ng/app/pausepoint/id6739864683"
                : "https://play.google.com/store/apps/details?id=com.pause_point.PausePoint&hl=en";

            const supported = await Linking.canOpenURL(url);
            if (supported) {
              await Linking.openURL(url);
            } else {
              await Linking.openURL("https://pausepoint.com/download");
            }
          } catch (error) {
            console.error("Error opening store link", error);
          }
        }}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Update Now
          </Text>
        )}
      </TouchableOpacity>
    </View>
  </SafeAreaView>
);
