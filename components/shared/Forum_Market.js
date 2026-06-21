

import {
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react"; // Import useEffect
import Forum from "../Forum/Forum";
import { MediumFontText } from "./Paragrahp";
import Marketplace from "../../screens/Customerinterface/MarketPlace/Marketplace";
import { useSelector } from "react-redux";
import ClickToJoinCLan from "./ClickToJoinCLan";
import WalletScreen from "../../screens/Customerinterface/Wallet/WalletScreen";

const Forum_Market = () => {
  const { get_user_profile_data } = useSelector(
    (state) => state.UserProfileSlice
  );
  const { user_data } = useSelector((state) => state.AuthSlice); // Get user_data from AuthSlice

  const isGuest = user_data?.user?.isGuest; // Determine if the user is a guest

  // Initialize forumlist based on whether the user is a guest
  // If a guest, default to Wallet (false); otherwise, default to Forum (true)
  const [forumlist, setforumlist] = useState(!isGuest);

  // Use useEffect to ensure forumlist is correctly set if isGuest changes
  useEffect(() => {
    setforumlist(!isGuest);
  }, [isGuest]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          marginBottom: 10,
        }}
      >
        {/* Conditionally render "Forum" tab for non-guests */}
        {!isGuest && (
          <TouchableOpacity
            onPress={() => setforumlist(true)}
            style={{
              borderBottomWidth: forumlist ? 2 : 0,
              borderColor: "#D9D9D9",
              width: isGuest ? "100%" : "50%", // Adjust width if only one tab
            }}
          >
            <MediumFontText
              data="Forum"
              textstyle={{
                fontSize: 20,
                fontWeight: "500",
                marginVertical: 10,
                textAlign: "center",
              }}
            />
          </TouchableOpacity>
        )}

        {/* Always render "Wallet" tab */}
        <TouchableOpacity
          style={{
            borderBottomWidth: forumlist && !isGuest ? 0 : 2, // Only highlight if not forumlist and not a guest, or if it's the only tab
            borderColor: "#D9D9D9",
            width: isGuest ? "100%" : "50%", // Adjust width if only one tab
          }}
          onPress={() => setforumlist(false)}
        >
          <MediumFontText
            data="Wallet"
            textstyle={{
              fontSize: 20,
              fontWeight: "500",
              marginVertical: 10,
              textAlign: "center",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: "85%" }}>
        <WalletScreen />
      </View>
    </>
  );
};

export default Forum_Market;
