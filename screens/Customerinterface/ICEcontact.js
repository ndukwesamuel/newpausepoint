import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import React from "react";
import AppScreen from "../../components/shared/AppScreen";
import {
  LightFontText,
  MediumFontText,
} from "../../components/shared/Paragrahp";

const ICEcontact = () => {
  const data = [
    {
      id: "1",
      img: require("../../assets/images/police.png"),
      name: "Nigeria Police Force",
      phone: "08033011052",
    },
    {
      id: "2",
      img: require("../../assets/images/police.png"),
      name: "LSG Ambulance Services",
      phone: "08069594030",
    },
    {
      id: "3",
      img: require("../../assets/images/ncc.png"),
      name: "NCDC",
      phone: "080097000010",
    },
    {
      id: "4",
      img: require("../../assets/images/lagoshe.png"),
      name: "LSG Ministry of Health ",
      phone: "08033565529",
    },
    {
      id: "5",
      img: require("../../assets/images/rapid.png"),
      name: "Rapid Response Squad",
      phone: "09053950347",
    },
    {
      id: "6",
      img: require("../../assets/images/cot.png"),
      name: "Distress Call",
      phone: "112",
    },
    {
      id: "7",
      img: require("../../assets/images/fireserice.png"),
      name: "Lagos State Fire Services",
      phone: "08033234943",
    },
  ];

  //   const makeCall = (phoneNumber) => {
  //     console.log({
  //       ffjfj: phoneNumber,
  //     });

  //     Linking.openURL(`tel:${phoneNumber}`);
  //   };

  const makeCall = async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        console.log("Phone number is not supported or invalid:", phoneNumber);
      }
    } catch (error) {
      console.error("Error trying to open URL:", error);
    }
  };

  return (
    <AppScreen>
      <View style={{ paddingHorizontal: 20 }}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => makeCall(item.phone)}
              style={{
                borderWidth: 1,
                borderColor: "#CFCDCD",
                paddingHorizontal: 20,
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 10,
                }}
              >
                <Image
                  source={item?.img}
                  style={{ width: 40, height: 40, borderRadius: 1 }}
                />
                <View>
                  <MediumFontText
                    data={item?.name}
                    textstyle={{ fontSize: 16, fontWeight: "500" }}
                  />
                  <LightFontText
                    data={item?.phone}
                    textstyle={{ fontSize: 12, fontWeight: "300" }}
                  />
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </AppScreen>
  );
};

export default ICEcontact;
