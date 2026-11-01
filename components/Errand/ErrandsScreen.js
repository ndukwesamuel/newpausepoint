import React from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFetchData_v2 } from "../../hooks/Requestv2";
import { GREEN } from "./errandApi";
import { styles } from "./errandStyles";
import { LoadingState } from "./errandParts";
import CustomerErrands from "./CustomerErrands";
import RunnerErrands from "./RunnerErrands";

// The backend decides who sees what: runners get the runner workspace,
// everyone else the customer flow, and locked estates a notice.
const ErrandsScreen = () => {
  const { data, isLoading, isError, refetch } = useFetchData_v2("api/v1/errand/context", "errand-context");
  const context = data?.data;

  if (isLoading) return <View style={styles.screen}><LoadingState label="Loading errands…" /></View>;
  if (context?.isRunner) return <RunnerErrands />;

  if (isError || !context) {
    return (
      <View style={[styles.screen, { justifyContent: "center", padding: 20 }]}>
        <View style={styles.stateCard}>
          <View style={styles.stateIcon}><MaterialCommunityIcons name="wifi-alert" size={25} color="#D97706" /></View>
          <Text style={styles.stateTitle}>Couldn't load errands</Text>
          <Text style={styles.stateCopy}>Check your connection and try again.</Text>
          <Pressable onPress={() => refetch()} style={styles.retryButton}><Text style={styles.retryText}>Try again</Text></Pressable>
        </View>
      </View>
    );
  }

  if (!context.enabled) {
    return (
      <View style={[styles.screen, { justifyContent: "center", padding: 20 }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={styles.stateCard}>
          <View style={styles.stateIcon}><MaterialCommunityIcons name="lock-outline" size={25} color={GREEN} /></View>
          <Text style={styles.stateTitle}>Errands are paused</Text>
          <Text style={styles.stateCopy}>Errands aren't available in {context.estate?.name || "your estate"} right now. Check back later.</Text>
        </View>
      </View>
    );
  }

  return <CustomerErrands context={context} />;
};

export default ErrandsScreen;
