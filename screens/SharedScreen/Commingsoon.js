import { View, Text } from "react-native";
import React, { useEffect, useRef, useState } from "react";

import LottieView from "lottie-react-native";

const Commingsoon = () => {
  const animation = useRef(null);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <View>
        <LottieView
          autoPlay
          ref={animation}
          style={{
            width: 200,
            height: 200,
            // backgroundColor: "#eee",
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("../../assets/Lottie/commingSoon.json")}
        />
      </View>
    </View>
  );
};

export default Commingsoon;
