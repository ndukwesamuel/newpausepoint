import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Audio } from "expo-av";

export const notificationservicecode = (data_info, queryClient) => {
  const soundObject = new Audio.Sound();

  async function emargencysong() {
    try {
      if (!soundObject._loaded) {
        await soundObject.loadAsync(require("../assets/audio/firesound.wav"));
      }
      await soundObject.replayAsync();
      console.log("Sound played successfully");
    } catch (error) {
      console.error("Failed to play the sound", error);
    }
  }

  console.log({
    rerer: data_info,
  });

  if (
    data_info?.withSome?.type === "fire" ||
    data_info?.withSome?.type === "health" ||
    data_info?.withSome?.type === "theft" ||
    data_info?.withSome?.type === "burglary" ||
    data_info?.withSome?.type === "kidnapping"
  ) {
    emargencysong();
  } else {
    console.log("no fire");
  }

  // A guest arriving/departing changes what the guest list screen should
  // show. Its cached copy only ever refreshes on manual pull-to-refresh or
  // right after creating/editing a guest — never on a push — so without
  // this, the notification and the screen can openly disagree ("arrived"
  // push, "pending" still shown). queryClient is passed in by the caller;
  // guarded so a caller that forgets to pass it can't crash this function.
  if (
    data_info?.type === "visitor_arrived" ||
    data_info?.type === "visitor_departed"
  ) {
    try {
      queryClient?.invalidateQueries({ queryKey: ["userGuests"] });
    } catch (error) {
      console.error("Failed to refresh guest list after push:", error);
    }
  }
  //   emargencysong();

  //   useEffect(() => {
  //     emargencysong();

  //     return () => {};
  //   }, []);

  return;
};
