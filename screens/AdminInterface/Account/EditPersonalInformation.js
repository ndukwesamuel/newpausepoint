import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  FormLabel,
  Formbutton,
  Forminput,
} from "../../../components/shared/InputForm";
import AppScreen from "../../../components/shared/AppScreen";
import { useDispatch, useSelector } from "react-redux";
import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";
import { UserProfile_data_Fun } from "../../../Redux/ProfileSlice";
const EditPersonalInformation = () => {
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const [name, setName] = useState(userProfile_data?.user?.name); // Replace with the user's actual data
  const [gender, setGender] = useState("Male"); // Replace with the user's actual data
  const [profileImage, setProfileImage] = useState(userProfile_data?.photo); // Replace with the user's actual data

  const [street, setStreet] = useState(userProfile_data?.address?.street);
  const [city, setCity] = useState(userProfile_data?.address?.city);
  const [addressSatate, setAddressSatate] = useState(
    userProfile_data?.address?.state
  );
  const dispatch = useDispatch();

  const [phone, setPhone] = useState(userProfile_data?.phoneNumber); // Replace with the user's actual data

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state?.AuthSlice);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker?.launchImageLibraryAsync({
      mediaTypes: ImagePicker?.MediaTypeOptions?.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result?.canceled) {
      setProfileImage(result?.assets[0]?.uri);
    }
  };

  useEffect(() => {
    dispatch(UserProfile_data_Fun());
    return () => {};
  }, [dispatch]);

  const handleSave = () => {
    // Handle the saving of user data here (e.g., make API calls).
    const formData = new FormData();

    formData?.append("name", name);
    // formData.append("photo", description);
    formData?.append("phoneNumber", phone);
    formData?.append("street", street);
    formData?.append("city", city);
    formData?.append("state", "Lagos");
    if (profileImage) {
      const uri = profileImage;
      const type = "image/jpeg"; // Adjust the type based on the file type
      const name = "photo.jpg"; // Adjust the name as needed
      formData?.append("photo", { uri, type, name });
    }

    Update_Mutation?.mutate(formData);
  };

  const Update_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}profile/update`;

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.put(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        Toast.show({
          type: "success",
          text1: "Event created successfully!",
        });
        dispatch(UserProfile_data_Fun());
      },

      onError: (error) => {
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error}`,
        });
      },
    }
  );
  return (
    <View
      style={{
        paddingBottom: 30,
      }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <TouchableOpacity
          onPress={pickImage}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={{ uri: profileImage }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />

          <Text>{userProfile_data?.user?.email}</Text>
        </TouchableOpacity>
        {/* <Button title="Change Profile Picture" onPress={pickImage} /> */}

        <View style={{ paddingHorizontal: 20, gap: 10 }}>
          <View>
            <FormLabel data="Name" />
            {/* <FormLabel data="   Email Address " /> */}
            <Forminput
              placeholder="Your Name"
              onChangeText={setName}
              value={name}
            />
          </View>

          <View>
            <FormLabel data="Phone Number " />
            <Forminput
              placeholder="Phone Number"
              onChangeText={setPhone}
              value={phone}
            />
          </View>

          <View>
            <FormLabel data="Street" />
            <Forminput
              placeholder="your Street"
              onChangeText={setStreet}
              value={street}
            />
          </View>

          <View>
            <FormLabel data="City" />
            <Forminput
              placeholder="your City"
              onChangeText={setCity}
              value={city}
            />
          </View>

          <View>
            <FormLabel data="State" />
            <Forminput
              placeholder="your State"
              onChangeText={setAddressSatate}
              value={addressSatate}
            />
          </View>

          <View>
            <FormLabel data="   Gender " />
            <Forminput
              placeholder="your address"
              onChangeText={setGender}
              value={gender}
            />
          </View>

          <Formbutton
            buttonStyle={{
              backgroundColor: "#04973C",
              paddingVertical: 14,
              alignItems: "center",
              borderRadius: 5,
            }}
            textStyle={{
              color: "white",
              fontWeight: "500",
              fontSize: 14,
              fontFamily: "RobotoSlab-Medium",
            }}
            data="Submit"
            onPress={handleSave}
            isLoading={Update_Mutation?.isLoading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EditPersonalInformation;
