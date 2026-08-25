

import { View, Text } from "react-native";
import React from "react";
import { Logout } from "../../../components/Account/Logout";

export default function Account() {
  let new_item = {
    id: 4,
    icon: "logout-outline",
    label: "Logout",
    icon_type: "Ionicons",
    link: "Logout",
  };
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Account</Text>
      <Logout item={new_item} />
    </View>
  );
}
