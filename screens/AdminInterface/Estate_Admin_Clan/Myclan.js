import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  CustomTextArea,
  Forminput,
  Forminput_Icon,
} from "../../../components/shared/InputForm";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import {
  BottomModal,
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";

import { useMutation } from "react-query";
const API_BASEURL = process.env.EXPO_PUBLIC_API_URL;

import axios from "axios";
import Toast from "react-native-toast-message";

const Myclan = ({ navigation }) => {
  const initialData = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
    { id: 3, name: "Bob" },
    // Add more objects to your initial data
  ];

  const {
    user_data,
    user_isError,
    user_isSuccess,
    user_isLoading,
    user_message,
  } = useSelector((state) => state.AuthSlice);

  const [filteredData, setFilteredData] = useState(initialData);

  const [formData, setFormData] = useState({
    search: "", // Initialize with empty values
  });

  const handleInputChange = (inputName, text) => {
    setFormData({ ...formData, [inputName]: text });

    // Filter the data based on the search input
    const filtered = initialData.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const [name, setName] = useState("");
  const [text, setText] = useState("");

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const Crate_Estate_Mutation = useMutation(
    (data_info) => {
      let url = `${API_BASEURL}clan`;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          //   "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user_data?.token}`,
        },
      };

      return axios.post(url, data_info, config);
    },
    {
      onSuccess: (success) => {
        console.log({
          success,
        });
        Toast.show({
          type: "success",
          text1: "Estate created successfully ",
          text2: ` Waiting for Admin to Aprove `,
        });
        // setModalVisible(false);
        setModalVisible(false);
        // setModalVisibility({});
      },

      onError: (error) => {
        console.log({
          error: error?.response,
        });

        console.log({
          error: error?.response?.data?.error,
        });
        setModalVisible(false);

        // setModalVisible(false);
        // setModalVisibility({});
        Toast.show({
          type: "error",
          text1: `${error?.response?.data?.error} `,
          //   text2: ` ${error?.response?.data?.errorMsg} `,
        });
      },
    }
  );

  const handleEstate = () => {
    let data = {
      name: name,
      description: text,
    };
    Crate_Estate_Mutation.mutate(data);
    console.log({
      data,
    });
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
      }}
    >
      <View style={{ marginVertical: 20 }}>
        <MediumFontText
          data="All estate you live in"
          textstyle={{ fontSize: 18, fontWeight: "500" }}
        />

        <RegularFontText
          data="Join, where modern luxury meets timeless charm. Enjoy exquisite residences, world-class amenities, and a sense of community in a secure, exclusive environment"
          textstyle={{ fontSize: 12, color: "#696969" }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("alluserclan")}
          style={{
            backgroundColor: "green",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <RegularFontText
            data="View All"
            textstyle={{
              fontSize: 14,
              fontWeight: "400",
              color: "white",
              textAlign: "center",
            }}
          />

          {/* <MaterialIcon name="keyboard-arrow-right" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 20 }}>
        <MediumFontText
          data="Join A Community"
          textstyle={{ fontSize: 18, fontWeight: "500" }}
        />

        <RegularFontText
          data="Join, where modern luxury meets timeless charm. Enjoy exquisite residences, world-class amenities, and a sense of community in a secure, exclusive environment"
          textstyle={{ fontSize: 12, color: "#696969" }}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("joinclan")}
          style={{
            backgroundColor: "green",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <RegularFontText
            data="Join Now"
            textstyle={{
              fontSize: 14,
              fontWeight: "400",
              color: "white",
              textAlign: "center",
            }}
          />

          {/* <MaterialIcon name="keyboard-arrow-right" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 20 }}>
        <MediumFontText
          data="Set Up A Community"
          textstyle={{ fontSize: 18, fontWeight: "500" }}
        />

        <RegularFontText
          data="Join, where modern luxury meets timeless charm. Enjoy exquisite residences, world-class amenities, and a sense of community in a secure, exclusive environment"
          textstyle={{ fontSize: 12, color: "#696969" }}
        />

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          // onPress={() => navigation.navigate("createclan")}
          style={{
            backgroundColor: "green",
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 20,
          }}
        >
          <RegularFontText
            data="Set Up"
            textstyle={{
              fontSize: 14,
              fontWeight: "400",
              color: "white",
              textAlign: "center",
            }}
          />

          {/* <MaterialIcon name="keyboard-arrow-right" size={24} color="black" /> */}
        </TouchableOpacity>
      </View>

      <CenterReuseModals
        visible={isModalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            width: "80%",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              // padding: 20,
              width: "100%",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: "50%",
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 10,
              }}
              onPress={() => setModalVisible(false)}
            >
              <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "500",
                fontFamily: "RobotoSlab-Medium",
                color: "black",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Create Your Estate
            </Text>

            <View>
              <MediumFontText data="Clan Name" textstyle={{ fontSize: 14 }} />

              <Forminput
                placeholder="Clan Name"
                onChangeText={setName}
                value={name}
              />

              <MediumFontText data="Clan Name" textstyle={{ fontSize: 14 }} />

              <CustomTextArea
                placeholder="Enter text here..."
                value={text}
                onChangeText={handleTextChange}
                style={{ width: "80%" }}
                inputStyle={{
                  backgroundColor: "#F6F8FAE5",
                  paddingHorizontal: 10,
                  paddingVertical: 20,
                  height: 200,
                  padding: 10,
                  borderRadius: 6,
                  fontSize: 16,
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 12,
                paddingVertical: 12,
                borderRadius: 6,
                marginTop: 20,
              }}
              onPress={handleEstate}
            >
              {Crate_Estate_Mutation.isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "400",
                    fontFamily: "RobotoSlab-Regular",
                    color: "white",
                    textAlign: "center",
                  }}
                >
                  Create Estate
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </CenterReuseModals>
    </View>
  );
};

export default Myclan;
