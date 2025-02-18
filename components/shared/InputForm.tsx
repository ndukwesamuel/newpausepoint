import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from "react-native";
import { Checkbox } from "expo-checkbox";
import { MaterialIcons } from "@expo/vector-icons";

interface ForminputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  value: string;
  icon?: React.ReactElement; // Add this line
  containerstyle?: ViewStyle;
  textstyle?: TextStyle;
}

export const Forminput = ({
  placeholder,
  onChangeText,
  value,
}: ForminputProps) => {
  return (
    <View style={{}}>
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={{
          // borderWidth: 1,
          padding: 10,
          borderRadius: 5,
          fontSize: 16,
          backgroundColor: "#F6F8FAE5",
          // opacity: 0.4
        }}
      />

      {/* <Text>{value}</Text> */}
    </View>
  );
};

export const Forminput_Icon = ({
  placeholder,
  onChangeText,
  value,
  icon,
  containerstyle,
  textstyle,
}: ForminputProps) => {
  return (
    <View style={[containerstyle]}>
      {icon && <View>{icon}</View>}

      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        style={[textstyle]}

        // style={{
        //     // borderWidth: 1,
        //     padding: 10,
        //     borderRadius: 5,
        //     fontSize: 16,
        //     backgroundColor: "#F6F8FAE5",
        //     // opacity: 0.4
        // }}
      />

      {/* <Text>{value}</Text> */}
    </View>
  );
};

interface CustomTextAreaProps {
  style?: ViewStyle;
  inputStyle?: TextStyle;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
}

export const CustomTextArea: React.FC<CustomTextAreaProps> = ({
  style,
  inputStyle,
  placeholder,
  value,
  onChangeText,
}) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <TextInput
          multiline
          numberOfLines={4}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          style={inputStyle}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export const Forminputpassword = ({
  placeholder,
  onChangeText,
  value,
}: ForminputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F6F8FAE5",
        paddingHorizontal: 10,
      }}
    >
      <TextInput
        placeholder={placeholder}
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={!isPasswordVisible}
        style={{
          flex: 1,
          padding: 10,
          // paddingVertical: 20,

          // opacity: 0.4
        }}
      />
      <TouchableOpacity onPress={togglePasswordVisibility}>
        <MaterialIcons
          name={isPasswordVisible ? "visibility" : "visibility-off"}
          size={24}
          color="#888"
        />
      </TouchableOpacity>
    </View>
  );
};

export const FormLabel = ({ data }: { data: string }) => {
  return (
    <Text
      style={{
        color: "rgba(38, 50, 56, 0.71)",
        fontWeight: "400",
        fontSize: 13,
        fontFamily: "RobotoSlab-Medium",
        marginBottom: 5,
      }}
    >
      {data}
    </Text>
  );
};

interface FormbuttonProps {
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  data: string;
  icon?: React.ReactElement; // Add this line
  onPress?: () => void;
  isLoading?: boolean;
  isLoading_color?: string;
}

export const Formbutton = ({
  buttonStyle,
  textStyle,
  data,
  icon,
  isLoading,
  isLoading_color,
  onPress,
}: FormbuttonProps) => {
  return (
    <TouchableOpacity style={[buttonStyle]} onPress={onPress}>
      {isLoading ? (
        <ActivityIndicator size="small" color={isLoading_color || "white"} />
      ) : (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          {icon && <View>{icon}</View>}
          <Text style={[textStyle]}>{data}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

interface OTPInputProps {
  onOTPChange: (otp: string) => void;
  containerView?: ViewStyle;
  inputStyle?: TextStyle;
}
export const Otpinput = ({
  onOTPChange,
  containerView,
  inputStyle,
}: OTPInputProps) => {
  const [otp, setOTP] = useState<string>("");
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  useEffect(() => {
    const otpValue = otp.split("").filter((char) => !isNaN(Number(char)));
    setOTP(otpValue.join(""));

    // Call the parent component's callback with the OTP value
    onOTPChange(otpValue.join(""));

    // Move to the next input field automatically when 1 digit is entered
    if (otp.length === 1) {
      inputRefs[1].current?.focus();
    }
    if (otp.length === 2) {
      inputRefs[2].current?.focus();
    }
    if (otp.length === 3) {
      inputRefs[3].current?.focus();
    }
  }, [otp, onOTPChange]);

  const handleInputChange = (text: string, index: number) => {
    const newOTP = otp.split("");
    newOTP[index] = text;
    setOTP(newOTP.join(""));
  };

  return (
    <View style={[containerView]}>
      {inputRefs.map((inputRef, index) => (
        <TextInput
          key={index}
          ref={inputRef}
          style={[inputStyle]}
          value={otp[index]}
          onChangeText={(text) => handleInputChange(text, index)}
          keyboardType="numeric"
          maxLength={1}
        />
      ))}
    </View>
  );
};

interface CheckboxProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
  containerView?: ViewStyle;
  TextStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export const CustomCheckbox: React.FC<CheckboxProps> = ({
  value,
  onValueChange,
  label,
  inputStyle,
  containerView,
  TextStyle,
}) => {
  return (
    <View style={[containerView]}>
      <Checkbox
        style={[inputStyle]}
        value={value}
        onValueChange={onValueChange}
      />
      <Text style={[TextStyle]}>{label}</Text>
    </View>
  );
};

interface RadioButtonProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  label,
  selected,
  onSelect,
  inputStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={{
        marginBottom: 10,
      }}
    >
      <View style={styles.radioButton}>
        <View
          style={[
            styles.radioCircle,
            { backgroundColor: selected ? "lightgray" : "white" },
          ]}
        />
        <Text style={inputStyle}>{label}</Text>
        {/* {subText} */}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "lightgray",
    marginRight: 10,
  },
});
