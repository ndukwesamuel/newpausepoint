import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function UploadFile() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "flex-end", marginTop: 20 }}>
      <TouchableOpacity
        style={{
          paddingHorizontal: 12,
          paddingVertical: 2,
          borderRadius: 6,
          borderWidth: 1,
        }}
        onPress={pickImage}
      >
        <Text
          style={{
            color: "black",
            fontWeight: "500",
            fontSize: 14,
            fontFamily: "RobotoSlab-Medium",
          }}
        >
          Choose File
        </Text>
      </TouchableOpacity>

      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
}
