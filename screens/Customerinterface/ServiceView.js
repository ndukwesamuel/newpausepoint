import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Rating } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { All_service__data_Fun } from "../../Redux/UserSide/ServiceSlice";
import LottieView from "lottie-react-native";

const ServiceView = ({ navigation }) => {
  const dispatch = useDispatch();
  const animation = useRef(null);

  const { all_service__data } = useSelector((state) => state.ServiceSlice);

  useEffect(() => {
    dispatch(All_service__data_Fun());

    return () => {};
  }, [dispatch]);

  const [search, setSearch] = useState("");

  const handleSearch = (text) => {
    setSearch(text);
  };

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(All_service__data_Fun());
    setRefreshing(false);
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        navigation.navigate("vendorService", { item: item });
      }}
      key={item?.id}
      style={{
        flex: 1, // Take equal space
        marginBottom: 10,
        padding: 5, // Add some padding to avoid overlap
      }}
    >
      <View style={styles.cards}>
        <View style={styles.cardImage}>
          <Image
            source={{
              uri: item?.photo?.url,
            }}
            style={{
              width: "100%",
              height: 150,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </View>
        <View style={styles.cardContent}>
          <Text style={{ paddingBottom: 10 }}>
            <Rating
              readonly
              startingValue={item?.avgRating} // Use item.avgRating for the rating value
              imageSize={17}
              fractions={5}
            />
          </Text>

          <Text style={styles.cardName}>{item?.FullName}</Text>
          <Text style={styles.cardSubtitle}>{item.about_me}</Text>
        </View>
      </View>
    </Pressable>
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
        source={require("../../assets/Lottie/Animation - 1704444696995.json")}
      />
    </ScrollView>
  );

  return (
    <View
      style={{
        padding: 10,
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View style={styles.inputs}>
        <Icon name="search" size={20} color="#777" style={styles.icon} />
        <TextInput
          placeholder="Search by name or service..."
          style={styles.input}
          placeholderTextColor="#777"
          value={search}
          onChangeText={handleSearch}
        />
      </View>

      <View
        style={{
          // justifyContent: "space-evenly",
          // flexDirection: "row",
          // flexWrap: "wrap",
          flex: 1,
        }}
      >
        <FlatList
          // data={all_service__data?.vendors?.filter((user) =>
          //   user?.FullName.toLowerCase().includes(search.toLowerCase())
          // )}

          data={all_service__data?.vendors?.filter(
            (user) =>
              user?.FullName.toLowerCase().includes(search.toLowerCase()) ||
              user?.about_me?.toLowerCase().includes(search.toLowerCase())
          )}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={renderEmptyList}
          numColumns={2}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          columnWrapperStyle={{
            justifyContent: "space-between", // Ensure even spacing
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cards: {
    backgroundColor: "#fff",
    margin: 10,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    width: 170,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardContent: {
    padding: 10,
    backgroundColor: "#F3FFF3",
    borderWidth: 1,
    borderColor: "#C5F3C5",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  inputs: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 9,
    paddingHorizontal: 10,
    margin: 10,
    backgroundColor: "#F6F8FA",
  },
  input: {
    flex: 1,
    paddingVertical: 18,
    paddingLeft: 1,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
});

export default ServiceView;
