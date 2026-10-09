import React from "react";
import { Image } from "react-native";
import LottieView from "lottie-react-native";
import { Video, ResizeMode } from "expo-av";

// Renders an announcement's Lottie animation, image or video.
// `source` can be a URL string (from the backend) or a require(...) (local).
const AnnouncementMedia = ({ type, source, height }) => {
  if (!source) return null;

  const src = typeof source === "string" ? { uri: source } : source;
  const style = { width: "100%", height };

  switch (type) {
    case "lottie":
      return <LottieView source={src} autoPlay loop style={style} />;

    case "video":
      return (
        <Video
          source={src}
          style={[style, { borderRadius: 16 }]}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay
          isLooping
          isMuted
          useNativeControls
        />
      );

    case "image":
    default:
      return <Image source={src} style={style} resizeMode="contain" />;
  }
};

export default AnnouncementMedia;
