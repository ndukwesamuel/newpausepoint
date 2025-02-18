import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { Audio } from "expo-av";

export const notificationservicecode = (data_info) => {
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
  //   emargencysong();

  //   useEffect(() => {
  //     emargencysong();

  //     return () => {};
  //   }, []);

  return;
};
