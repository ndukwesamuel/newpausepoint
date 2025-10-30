// // import {
// //   Image,
// //   KeyboardAvoidingView,
// //   Platform,
// //   StyleSheet,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   View,
// // } from "react-native";
// // import React, { useState } from "react";
// // import AppScreen from "../components/shared/AppScreen";
// // import RegHeaders from "../components/shared/RegHeaders";
// // import {
// //   RegistraionHeadersText,
// //   RegistraionParagraphText,
// // } from "../components/shared/Registraion";
// // import {
// //   FormLabel,
// //   Formbutton,
// //   Forminput,
// //   Forminputpassword,
// // } from "../components/shared/InputForm";

// // import { Ionicons, AntDesign } from "@expo/vector-icons";
// // import { useDispatch } from "react-redux";
// // import { useMutation } from "react-query";
// // const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

// // console.log({
// //   jjj: API_BASEURL,
// // });

// // import axios from "axios";
// // import Toast from "react-native-toast-message";
// // import { authScreenChange } from "../Redux/OnboardingSlice";

// // interface Registraionprops {
// //   mainPassword: string;
// //   confirmPassword: string;
// // }

// // const Registraion = ({}: {}) => {
// //   const dispatch = useDispatch();

// //   const RegistraionMutation = useMutation(
// //     (_) => {
// //       let joinurl = `${API_BASEURL}api/v1/auth/user-register`;

// //       let data = {
// //         name: name,
// //         email: email,
// //         password: passwords.mainPassword,
// //       };

// //       console.log({ data });

// //       return axios.post(joinurl, data);
// //     },
// //     {
// //       onSuccess: (success) => {
// //         Toast.show({
// //           type: "success",
// //           text1: "Registration successfully!",
// //         });
// //         dispatch(authScreenChange("LOGIN"));
// //       },
// //       onError: (error: any) => {
// //         console.log(error?.response?.data);

// //         Toast.show({
// //           type: "error",
// //           text1: `${error?.response?.data?.error}`,
// //           // text2: 'Toast message',
// //         });
// //       },
// //     }
// //   );

// //   const [inputValue, setInputValue] = useState("");
// //   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
// //   const togglePasswordVisibility = () => {
// //     setIsPasswordVisible(!isPasswordVisible);
// //   };
// //   const [name, setName] = useState("");
// //   const [email, setEmail] = useState("");

// //   const [privacypolicy, setPrivacypolicy] = useState(false);
// //   const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

// //   const [passwords, setPasswords] = useState<Registraionprops>({
// //     mainPassword: "",
// //     confirmPassword: "",
// //   });

// //   const handlePasswordChange = (
// //     field: keyof Registraionprops,
// //     text: string
// //   ) => {
// //     setPasswords((prevPasswords) => ({
// //       ...prevPasswords,
// //       [field]: text,
// //     }));
// //   };

// //   const handleSubmit = () => {
// //     // console.log('Current Password:', passwords.mainPassword);
// //     // console.log('New Password:', passwords.confirmPassword);

// //     // let data = {
// //     //     name: "haha",
// //     //     email: "haha@mail.com",
// //     //     password: "123456789"
// //     // }
// //     RegistraionMutation.mutate();
// //     // Add your password change logic here, e.g., sending it to a server
// //   };

// //   const handleInputChange = (text: string) => {
// //     setInputValue(text);
// //   };
// //   return (
// //     <AppScreen>
// //       <KeyboardAvoidingView
// //         behavior={Platform.OS === "ios" ? "padding" : "height"}
// //         style={{ flex: 1 }}
// //       >
// //         <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
// //           <RegistraionHeadersText data="Create Account" textStyle={{}} />

// //           <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
// //             <RegistraionParagraphText
// //               data="Already have an account?"
// //               color="#8E8E8F"
// //             />

// //             <TouchableOpacity
// //               onPress={() => dispatch(authScreenChange("LOGIN"))}
// //             >
// //               <RegistraionParagraphText data="Sign In" color="#04973C" />
// //             </TouchableOpacity>
// //           </View>

// //           <View style={{ marginBottom: 15 }}>
// //             <FormLabel data="Full Name" />
// //             <Forminput
// //               placeholder="Full Name"
// //               onChangeText={setName}
// //               value={name}
// //             />
// //           </View>

// //           <View style={{ marginBottom: 15 }}>
// //             <FormLabel data="Email " />
// //             <Forminput
// //               placeholder="Enter your email"
// //               onChangeText={setEmail}
// //               value={email}
// //             />
// //           </View>

// //           <View style={{ marginBottom: 20 }}>
// //             <FormLabel data="Password " />

// //             <Forminputpassword
// //               placeholder="Enter your password"
// //               onChangeText={(text) =>
// //                 handlePasswordChange("mainPassword", text)
// //               }
// //               value={passwords.mainPassword}
// //             />
// //           </View>

// //           <View style={{ marginBottom: 20 }}>
// //             <FormLabel data="Confirm Password  " />

// //             <Forminputpassword
// //               placeholder="Enter your password"
// //               onChangeText={(text) =>
// //                 handlePasswordChange("confirmPassword", text)
// //               }
// //               value={passwords.confirmPassword}
// //             />
// //           </View>

// //           <Formbutton
// //             buttonStyle={{
// //               backgroundColor: "#04973C",
// //               paddingVertical: 14,
// //               alignItems: "center",
// //               borderRadius: 5,
// //               marginTop: 20,
// //             }}
// //             textStyle={{
// //               color: "white",
// //               fontWeight: "500",
// //               fontSize: 14,
// //               fontFamily: "RobotoSlab-Medium",
// //             }}
// //             data="Sign Up "
// //             onPress={handleSubmit}
// //             isLoading={RegistraionMutation.isLoading}
// //           />
// //         </View>
// //       </KeyboardAvoidingView>
// //     </AppScreen>
// //   );
// // };

// // export default Registraion;

// // const styles = StyleSheet.create({
// //   customInput: {
// //     borderWidth: 1,
// //     borderColor: "red",
// //     padding: 10,
// //     borderRadius: 5,
// //     fontSize: 16,
// //     backgroundColor: "#f6f8fa",
// //     // opacity: 0.4
// //   },

// // });

// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import React, { useState } from "react";
// import AppScreen from "../components/shared/AppScreen";
// import RegHeaders from "../components/shared/RegHeaders";
// import {
//   RegistraionHeadersText,
//   RegistraionParagraphText,
// } from "../components/shared/Registraion";
// import {
//   FormLabel,
//   Formbutton,
//   Forminput,
//   Forminputpassword,
// } from "../components/shared/InputForm";

// import { Ionicons, AntDesign } from "@expo/vector-icons";
// import { useDispatch } from "react-redux";
// import { useMutation } from "react-query";
// const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
// const API_BASEURL_v2 = process.env.EXPO_PUBLIC_API_URL_v2;

// console.log({
//   jjj: API_BASEURL,
// });

// import axios from "axios";
// import Toast from "react-native-toast-message";
// import { authScreenChange } from "../Redux/OnboardingSlice";

// interface Registraionprops {
//   mainPassword: string;
//   confirmPassword: string;
// }

// const Registraion = ({}: {}) => {
//   const dispatch = useDispatch();

//   const [inputValue, setInputValue] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const togglePasswordVisibility = () => {
//     setIsPasswordVisible(!isPasswordVisible);
//   };
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");

//   const [privacypolicy, setPrivacypolicy] = useState(false);
//   const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

//   const [passwords, setPasswords] = useState<Registraionprops>({
//     mainPassword: "",
//     confirmPassword: "",
//   });

//   const handlePasswordChange = (
//     field: keyof Registraionprops,
//     text: string
//   ) => {
//     setPasswords((prevPasswords) => ({
//       ...prevPasswords,
//       [field]: text,
//     }));
//   };

//   const RegistraionMutation = useMutation(
//     (_) => {
//       let joinurl = `${API_BASEURL_v2}api/v1/auth/signup`;

//       let data = {
//         email: email,
//         name: name,
//         phoneNumber: phoneNumber,
//         password: passwords.mainPassword,
//       };

//       console.log({ data });

//       return axios.post(joinurl, data);
//     },
//     {
//       onSuccess: (success) => {
//         Toast.show({
//           type: "success",
//           text1: "Registration successfully!",
//         });
//         dispatch(authScreenChange("LOGIN"));
//       },
//       onError: (error: any) => {
//         console.log(error?.response?.data);

//         Toast.show({
//           type: "error",
//           text1: `${error?.response?.data?.error}`,
//           // text2: 'Toast message',
//         });
//       },
//     }
//   );
//   const handleSubmit = () => {
//     // console.log('Current Password:', passwords.mainPassword);
//     // console.log('New Password:', passwords.confirmPassword);

//     // let data = {
//     //     name: "haha",
//     //     email: "haha@mail.com",
//     //     password: "123456789"
//     // }
//     RegistraionMutation.mutate();
//     // Add your password change logic here, e.g., sending it to a server
//   };

//   const handleInputChange = (text: string) => {
//     setInputValue(text);
//   };
//   return (
//     <AppScreen>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         style={{ flex: 1 }}
//       >
//         <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
//           <RegistraionHeadersText data="Create Account" textStyle={{}} />

//           <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
//             <RegistraionParagraphText
//               data="Already have an account?"
//               color="#8E8E8F"
//             />

//             <TouchableOpacity
//               onPress={() => dispatch(authScreenChange("LOGIN"))}
//             >
//               <RegistraionParagraphText data="Sign In" color="#04973C" />
//             </TouchableOpacity>
//           </View>

//           <View style={{ marginBottom: 15 }}>
//             <FormLabel data="Full Name" />
//             <Forminput
//               placeholder="Full Name"
//               onChangeText={setName}
//               value={name}
//             />
//           </View>

//           <View style={{ marginBottom: 15 }}>
//             <FormLabel data="Email" />
//             <Forminput
//               placeholder="Enter your email"
//               onChangeText={setEmail}
//               value={email}
//               keyboardType="email-address"
//             />
//           </View>

//           <View style={{ marginBottom: 15 }}>
//             <FormLabel data="Phone Number" />
//             <Forminput
//               placeholder="Enter your phone number"
//               onChangeText={setPhoneNumber}
//               value={phoneNumber}
//               keyboardType="phone-pad"
//             />
//           </View>

//           <View style={{ marginBottom: 20 }}>
//             <FormLabel data="Password" />

//             <Forminputpassword
//               placeholder="Enter your password"
//               onChangeText={(text) =>
//                 handlePasswordChange("mainPassword", text)
//               }
//               value={passwords.mainPassword}
//             />
//           </View>

//           <View style={{ marginBottom: 20 }}>
//             <FormLabel data="Confirm Password" />

//             <Forminputpassword
//               placeholder="Enter your password"
//               onChangeText={(text) =>
//                 handlePasswordChange("confirmPassword", text)
//               }
//               value={passwords.confirmPassword}
//             />
//           </View>

//           <Formbutton
//             buttonStyle={{
//               backgroundColor: "#04973C",
//               paddingVertical: 14,
//               alignItems: "center",
//               borderRadius: 5,
//               marginTop: 20,
//             }}
//             textStyle={{
//               color: "white",
//               fontWeight: "500",
//               fontSize: 14,
//               fontFamily: "RobotoSlab-Medium",
//             }}
//             data="Sign Up"
//             onPress={handleSubmit}
//             isLoading={RegistraionMutation.isLoading}
//           />
//         </View>
//       </KeyboardAvoidingView>
//     </AppScreen>
//   );
// };

// export default Registraion;

// const styles = StyleSheet.create({
//   customInput: {
//     borderWidth: 1,
//     borderColor: "red",
//     padding: 10,
//     borderRadius: 5,
//     fontSize: 16,
//     backgroundColor: "#f6f8fa",
//     // opacity: 0.4
//   },
// });

import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import AppScreen from "../components/shared/AppScreen";
import RegHeaders from "../components/shared/RegHeaders";
import {
  RegistraionHeadersText,
  RegistraionParagraphText,
} from "../components/shared/Registraion";
import {
  FormLabel,
  Formbutton,
  Forminput,
  Forminputpassword,
} from "../components/shared/InputForm";

import { Ionicons, AntDesign } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;
const API_BASEURL_v2 = process.env.EXPO_PUBLIC_API_URL_v2;

console.log({
  jjj: API_BASEURL,
});

import axios from "axios";
import Toast from "react-native-toast-message";
import { authScreenChange } from "../Redux/OnboardingSlice";

interface Registraionprops {
  mainPassword: string;
  confirmPassword: string;
}

const Registraion = ({}: {}) => {
  const dispatch = useDispatch();

  const [inputValue, setInputValue] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [privacypolicy, setPrivacypolicy] = useState(false);
  const [privacyPolicyColor, setPrivacyPolicyColor] = useState("#04973C");

  const [passwords, setPasswords] = useState<Registraionprops>({
    mainPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (
    field: keyof Registraionprops,
    text: string
  ) => {
    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [field]: text,
    }));
  };

  // Validate Nigerian phone number
  const validateNigerianPhoneNumber = (phone: string): boolean => {
    // Remove any spaces or special characters
    const cleanedPhone = phone.replace(/\s+/g, "");

    // Check if it's exactly 11 digits
    if (cleanedPhone.length !== 11) {
      setPhoneNumberError("Phone number must be 11 digits");
      return false;
    }

    // Check if it starts with 0
    if (!cleanedPhone.startsWith("0")) {
      setPhoneNumberError("Phone number must start with 0");
      return false;
    }

    // Check if the first two digits are 07, 08, or 09
    const prefix = cleanedPhone.substring(0, 2);
    if (prefix !== "07" && prefix !== "08" && prefix !== "09") {
      setPhoneNumberError("Phone number must start with 07, 08, or 09");
      return false;
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(cleanedPhone)) {
      setPhoneNumberError("Phone number must contain only digits");
      return false;
    }

    setPhoneNumberError("");
    return true;
  };

  const handlePhoneNumberChange = (text: string) => {
    // Only allow digits and limit to 11 characters
    const cleaned = text.replace(/[^0-9]/g, "").substring(0, 11);
    setPhoneNumber(cleaned);

    // Clear error when user starts typing
    if (phoneNumberError) {
      setPhoneNumberError("");
    }
  };

  const RegistraionMutation = useMutation(
    (_) => {
      let joinurl = `${API_BASEURL_v2}api/v1/auth/signup`;

      let data = {
        email: email,
        name: name,
        phoneNumber: phoneNumber,
        password: passwords.mainPassword,
      };

      console.log({ data });

      return axios.post(joinurl, data);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Registration successfully!",
        });
        dispatch(authScreenChange("LOGIN"));
      },
      onError: (error: any) => {
        console.log(error?.response?.data);

        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
        });
      },
    }
  );

  const handleSubmit = () => {
    // Validate phone number before submission
    if (!validateNigerianPhoneNumber(phoneNumber)) {
      Toast.show({
        type: "error",
        text1: phoneNumberError || "Invalid phone number",
      });
      return;
    }

    // Validate other fields
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your full name",
      });
      return;
    }

    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your email",
      });
      return;
    }

    if (!passwords.mainPassword) {
      Toast.show({
        type: "error",
        text1: "Please enter a password",
      });
      return;
    }

    if (passwords.mainPassword !== passwords.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match",
      });
      return;
    }

    RegistraionMutation.mutate();
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  return (
    <AppScreen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <RegistraionHeadersText data="Create Account" textStyle={{}} />

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 30 }}>
            <RegistraionParagraphText
              data="Already have an account?"
              color="#8E8E8F"
            />

            <TouchableOpacity
              onPress={() => dispatch(authScreenChange("LOGIN"))}
            >
              <RegistraionParagraphText data="Sign In" color="#04973C" />
            </TouchableOpacity>
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Full Name" />
            <Forminput
              placeholder="Full Name"
              onChangeText={setName}
              value={name}
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Email" />
            <Forminput
              placeholder="Enter your email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
            />
          </View>

          <View style={{ marginBottom: 15 }}>
            <FormLabel data="Phone Number" />
            <Forminput
              placeholder="e.g. 08012345678"
              onChangeText={handlePhoneNumberChange}
              value={phoneNumber}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {phoneNumberError ? (
              <Text style={styles.errorText}>{phoneNumberError}</Text>
            ) : null}
          </View>

          <View style={{ marginBottom: 20 }}>
            <FormLabel data="Password" />

            <Forminputpassword
              placeholder="Enter your password"
              onChangeText={(text) =>
                handlePasswordChange("mainPassword", text)
              }
              value={passwords.mainPassword}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <FormLabel data="Confirm Password" />

            <Forminputpassword
              placeholder="Enter your password"
              onChangeText={(text) =>
                handlePasswordChange("confirmPassword", text)
              }
              value={passwords.confirmPassword}
            />
          </View>

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
              marginTop: 20,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Sign Up"
            onPress={handleSubmit}
            isLoading={RegistraionMutation.isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </AppScreen>
  );
};

export default Registraion;

const styles = StyleSheet.create({
  customInput: {
    borderWidth: 1,
    borderColor: "red",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: "#f6f8fa",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    fontFamily: "RobotoSlab-Regular",
  },
});
