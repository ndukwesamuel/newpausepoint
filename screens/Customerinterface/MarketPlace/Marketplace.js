import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

import { useDispatch, useSelector } from "react-redux";
import {
  Market_data_Fun,
  myProductFun,
} from "../../../Redux/UserSide/MarketSLice";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

const MarketPlace = () => {
  const dispatch = useDispatch();
  const { Market_data, MyProduct_data } = useSelector(
    (state) => state.MarketSLice
  );
  const [productType, setproductType] = useState("allProduct");

  const animation = useRef(null);

  console.log({
    fkfkf: MyProduct_data?.products[0]?.name,
  });

  useEffect(() => {
    dispatch(Market_data_Fun());
    dispatch(myProductFun());

    return () => {};
  }, [dispatch]);
  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
  };
  const navigation = useNavigation();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);
    dispatch(Market_data_Fun());
    dispatch(myProductFun());

    // Wait for 2 seconds
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <View key={item?.id} style={styles.cardContainer}>
      <Pressable
        onPress={() => {
          navigation.navigate("MarketReview", {
            item,
            productType,
          });
        }}
        key={item?.id}
      >
        <View style={styles.cardImage}>
          <Image
            source={{
              uri: item.images[0]?.url, //Market_data?.products[1]?.images[0]?.url
            }}
            style={styles.image}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardName}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>

          <Text style={styles.cardSubtitle}>{item?.status}</Text>
        </View>
      </Pressable>
    </View>
  );

  const renderEmptyList = () => (
    <ScrollView
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: 200,
          height: 200,
        }}
        source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
      />
    </ScrollView>
  );

  const [mart, setMart] = useState(false);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "flex-end",
          paddingRight: 20,
          paddingTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: productType === "myproduct" ? "green" : "grey",
            padding: 5,
            paddingHorizontal: 10,
          }}
          onPress={() => setproductType("myproduct")}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            My Product
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: productType === "allProduct" ? "green" : "grey",

            padding: 5,
            paddingHorizontal: 10,
          }}
          onPress={() => setproductType("allProduct")}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            All Product
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 9,
          paddingHorizontal: 10,
          margin: 10,
          backgroundColor: "#F6F8FA",
        }}
      >
        <Icon name="search" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Search by name or service..."
          style={{
            flex: 1,
            paddingVertical: 18,
            paddingLeft: 1,
            color: "#333",
          }}
          placeholderTextColor="#777"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      {productType === "myproduct" ? (
        <View>
          <FlatList
            // data={MyProduct_data?.products}
            data={MyProduct_data?.products?.filter(
              (data) => data?.name.toLowerCase().includes(search.toLowerCase())
              // user?.about_me?.toLowerCase().includes(search.toLowerCase())
            )}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmptyList}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />

          <View style={{ position: "absolute", right: 20, top: 20, zIndex: 1 }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("CreateProduct")}
            >
              <MaterialIcons name="mode-edit" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <FlatList
          // data={Market_data?.products}

          data={Market_data?.products?.filter(
            (data) => data?.name.toLowerCase().includes(search.toLowerCase())
            // user?.about_me?.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyList}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  listContainer: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardContainer: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 10,
    backgroundColor: "#F3FFF3",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    width: "100%",
  },
  cardName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: "200",
    color: "#333",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "green",
    borderRadius: 50,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MarketPlace;
