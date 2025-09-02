import { ReactNode } from "react";
import {
  View,
  Image,
  Text,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from "react-native";

type TabBarItemProps = {
  focused: boolean;
  iconFocused: ImageSourcePropType;
  iconUnfocused: ImageSourcePropType;
  containerStyle: StyleProp<ViewStyle>;
  label: string;
  texttStyle: StyleProp<TextStyle>;
};
export const Tabcomponent = ({
  focused,
  iconFocused,
  iconUnfocused,
  containerStyle,
  label,
  texttStyle,
}: TabBarItemProps) => {
  return (
    <View style={[containerStyle]}>
      {focused ? (
        <Image source={iconFocused} style={{ width: 25, height: 25 }} />
      ) : (
        <Image source={iconUnfocused} style={{ width: 25, height: 25 }} />
      )}
      <Text
        style={[texttStyle, { fontWeight: "400", fontFamily: "Inter-Regular" }]}
      >
        {label}
      </Text>
    </View>
  );
};

type CustomTabButtonProps = {
  children: ReactNode;
  onPress: () => void;
  focused: boolean;
  iconFocused: ImageSourcePropType;
  iconUnfocused: ImageSourcePropType;
  containerStyle: StyleProp<ViewStyle>;
  label: string;
  texttStyle: StyleProp<TextStyle>;
};

export const CustomTabButton = ({
  children,
  onPress,
  focused,
  iconFocused,
  iconUnfocused,
  containerStyle,
  label,
  texttStyle,
}: CustomTabButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        containerStyle,
        {
          top: -20,
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
      onPress={onPress}
    >
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 36,
          backgroundColor: "#04973C",
          borderWidth: 5,
          borderColor: "white",
        }}
      >
        {children}
      </View>

      <Text
        style={{ fontWeight: "400", fontFamily: "Inter-Regular", fontSize: 12 }}
      >
        Home
      </Text>
    </TouchableOpacity>
  );
};
