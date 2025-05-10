import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";

import { MediumFontText } from "../../../components/shared/Paragrahp";
import ApprovedGoods from "./ApprovedGoods";
import PendingGoods from "./PendingGoods";
import { useDispatch, useSelector } from "react-redux";
import { AdminMarket_data_Fun } from "../../../Redux/Admin/AdminMarketSLice";

const VendorLists = () => {
  const [forumlist, setforumlist] = useState(true);
  const dispatch = useDispatch();
  const { Admin_Market_data } = useSelector((state) => state.AdminMarketSLice);
  useEffect(() => {
    dispatch(AdminMarket_data_Fun());

    return () => {};
  }, []);

  console.log({
    fdfd: Admin_Market_data?.products[0],
  });
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          // marginBottom: 10,
          backgroundColor: "white",
        }}
      >
        <TouchableOpacity
          onPress={() => setforumlist(true)}
          style={{
            borderBottomWidth: forumlist ? 2 : 0,

            borderColor: "#D9D9D9",
            // marginVertical: 10,
            width: "50%",
          }}
        >
          <MediumFontText
            data="Approved Goods"
            textstyle={{
              fontSize: 20,
              fontWeight: "500",
              marginVertical: 10,
              textAlign: "center",
            }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderBottomWidth: forumlist ? 0 : 2,

            borderColor: "#D9D9D9",
            width: "50%",

            // marginVertical: 10,
          }}
          onPress={() => setforumlist(false)}
        >
          <MediumFontText
            data="Banned Goods"
            textstyle={{
              fontSize: 20,
              fontWeight: "500",
              marginVertical: 10,
              textAlign: "center",
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: "100%" }}>
        {forumlist ? <ApprovedGoods /> : <PendingGoods />}
      </View>
    </>
  );
};

export default VendorLists;
