import { All_serviceReview_data_Fun } from "../../../Redux/UserSide/ServiceSlice";

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { useRoute } from "@react-navigation/native";

const VendortDetailsReview = () => {
  const dispatch = useDispatch();
  const { item } = useRoute().params;

  let vendorId = item?._id;

  console.log({
    vendorId,
  });

  const { review_service__data } = useSelector((state) => state?.ServiceSlice);
  console.log({
    llll: review_service__data?.reviews[0],
  });
  useEffect(() => {
    dispatch(All_serviceReview_data_Fun(item?._id));

    return () => {};
  }, []);
  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <ScrollView>
        {review_service__data?.reviews?.map((item, index) => (
          <View style={styles.container} key={index}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                }}
              >
                <Image source={require("../../../assets/sevImg/review.png")} />
                <Text style={styles.nameText}>{item?.user?.name}</Text>
              </View>
              <View
                style={{
                  height: 25,
                  width: 47,
                  padding: 5,
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: "#81CB9D",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 5,
                }}
              >
                <Text>
                  <Icon name="star" size={15} color="#04973C" />
                </Text>

                <Text>{item?.rating}</Text>
              </View>
            </View>

            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text style={styles.desText}>{item.comment}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {/* <View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => {
            navigation.navigate("vendorReview", {
              item: vendorId,
            });
          }}
        >
          <Text style={styles.text}>Create your Review</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    paddingBottom: 20,
    paddingTop: 20,
  },

  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#04973C",
    borderRadius: 5,
    justifyContent: "center",
    marginTop: 14,
  },

  text: {
    fontSize: 16,
    color: "white",
  },
  imgRow: {
    flexDirection: "row",

    overflow: "visible",
    gap: 10,
    paddingRight: 70,
  },
  desText: {
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F6F6F6",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
export default VendortDetailsReview;
