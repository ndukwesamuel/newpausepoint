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
  Dimensions,
  Animated,
  Alert,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");
import { useDispatch, useSelector } from "react-redux";
import {
  Market_data_Fun,
  myProductFun,
} from "../../../Redux/UserSide/MarketSLice";
import { MaterialIcons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import ScreenWrapper from "../../../components/shared/ScreenWrapper";

const MarketPlace = () => {
  const dispatch = useDispatch();
  const { Market_data, MyProduct_data } = useSelector(
    (state) => state.MarketSLice
  );
  const [productType, setproductType] = useState("allProduct");
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const animation = useRef(null);

  console.log({
    fkfkf: MyProduct_data?.products[0]?.name,
  });

  useEffect(() => {
    if (userProfile_data?.user?.isGuest != true) {
      dispatch(Market_data_Fun());
      dispatch(myProductFun());
    }

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
    <ScreenWrapper
      title="Market Place"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      // showHeader={false}
    >
      {userProfile_data?.user?.isGuest ? (
        <MarketplaceComingSoon />
      ) : (
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
                backgroundColor:
                  productType === "allProduct" ? "green" : "grey",

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
                  (data) =>
                    data?.name.toLowerCase().includes(search.toLowerCase())
                  // user?.about_me?.toLowerCase().includes(search.toLowerCase())
                )}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyList}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />

              <View
                style={{ position: "absolute", right: 20, top: 20, zIndex: 1 }}
              >
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
                (data) =>
                  data?.name.toLowerCase().includes(search.toLowerCase())
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
      )}
    </ScreenWrapper>
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

const MarketplaceComingSoon = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 0.85,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();

    // Continuous pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  const handleNotifyMe = () => {
    Alert.alert(
      "Notification Set!",
      "Thank you! We'll notify you when our marketplace is available.",
      [{ text: "OK", style: "default" }]
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Background gradient effect */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(46, 204, 113, 0.05)",
          }}
        />

        <Animated.View
          style={{
            alignItems: "center",
            maxWidth: 350,
            width: "100%",
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          }}
        >
          {/* Animated Marketplace Icon */}
          <Animated.View
            style={{
              marginBottom: 30,
              transform: [{ scale: pulseAnim }],
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(46, 204, 113, 0.1)",
                borderRadius: 50,
                borderWidth: 2,
                borderColor: "rgba(46, 204, 113, 0.3)",
              }}
            >
              {/* Shopping Bag */}
              <View
                style={{
                  width: 40,
                  height: 45,
                  backgroundColor: "transparent",
                  borderWidth: 3,
                  borderColor: "#2ecc71",
                  borderTopWidth: 0,
                  borderRadius: 8,
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  position: "relative",
                }}
              >
                {/* Shopping bag handles */}
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: 8,
                    width: 24,
                    height: 16,
                    backgroundColor: "transparent",
                    borderWidth: 3,
                    borderColor: "#27ae60",
                    borderBottomWidth: 0,
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  }}
                />
              </View>

              {/* Cart wheels */}
              <View
                style={{
                  position: "absolute",
                  bottom: 15,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: 35,
                }}
              >
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "#27ae60",
                    borderRadius: 3,
                  }}
                />
                <View
                  style={{
                    width: 6,
                    height: 6,
                    backgroundColor: "#27ae60",
                    borderRadius: 3,
                  }}
                />
              </View>
            </View>
          </Animated.View>

          {/* Main Heading */}
          <Text
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#2c3e50",
              textAlign: "center",
              marginBottom: 8,
            }}
          >
            Marketplace
          </Text>

          <Text
            style={{
              fontSize: 20,
              color: "#2ecc71",
              textAlign: "center",
              marginBottom: 30,
              fontWeight: "600",
              letterSpacing: 1,
            }}
          >
            Coming Soon
          </Text>

          {/* Description */}
          <Text
            style={{
              fontSize: 16,
              color: "#7f8c8d",
              textAlign: "center",
              lineHeight: 24,
              marginBottom: 40,
              paddingHorizontal: 10,
            }}
          >
            Get ready for the ultimate shopping experience! Our marketplace will
            feature thousands of products from trusted sellers, unbeatable
            deals, and seamless checkout.
          </Text>

          {/* Features Preview */}
          <View
            style={{
              marginBottom: 40,
              width: "100%",
            }}
          >
            {[
              "Thousands of Products",
              "Trusted Sellers",
              "Secure Payments",
              "Fast Delivery",
              "Easy Returns",
              "Customer Support",
            ].map((feature, index) => (
              <View
                key={index}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  paddingHorizontal: 20,
                }}
              >
                <View
                  style={{
                    width: 10,
                    height: 10,
                    backgroundColor: index % 2 === 0 ? "#2ecc71" : "#27ae60",
                    borderRadius: 5,
                    marginRight: 15,
                  }}
                />
                <Text
                  style={{
                    fontSize: 16,
                    color: "#2c3e50",
                    fontWeight: "500",
                    flex: 1,
                  }}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Indicator */}
          <View
            style={{
              width: "100%",
              marginBottom: 40,
              paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#7f8c8d",
                textAlign: "center",
                marginBottom: 15,
              }}
            >
              Development Progress
            </Text>

            <View
              style={{
                width: "100%",
                height: 8,
                backgroundColor: "#ecf0f1",
                borderRadius: 4,
                marginBottom: 10,
                overflow: "hidden",
              }}
            >
              <Animated.View
                style={{
                  height: "100%",
                  backgroundColor: "#2ecc71",
                  borderRadius: 4,
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0%", "100%"],
                  }),
                }}
              />
            </View>

            <Text
              style={{
                fontSize: 14,
                color: "#2ecc71",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              85% Complete
            </Text>
          </View>

          {/* Notify Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "#2ecc71",
              paddingHorizontal: 40,
              paddingVertical: 18,
              borderRadius: 30,
              marginBottom: 30,
              shadowColor: "#2ecc71",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              minWidth: 250,
            }}
            onPress={handleNotifyMe}
            activeOpacity={0.8}
          >
            <Text
              style={{
                color: "#ffffff",
                fontSize: 18,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Notify Me When Ready
            </Text>
          </TouchableOpacity>

          {/* Categories Preview */}
          <View
            style={{
              backgroundColor: "rgba(46, 204, 113, 0.05)",
              borderRadius: 15,
              padding: 20,
              width: "100%",
              borderWidth: 1,
              borderColor: "rgba(46, 204, 113, 0.2)",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "#2c3e50",
                fontWeight: "600",
                textAlign: "center",
                marginBottom: 12,
              }}
            >
              Featured Categories
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#7f8c8d",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              📱 Electronics • 👕 Fashion • 🏠 Home & Garden{"\n"}
              📚 Books • ⚽ Sports • 🎮 Gaming • And More!
            </Text>
          </View>
        </Animated.View>

        {/* Floating decorative elements */}
        <View
          style={{
            position: "absolute",
            top: height * 0.12,
            left: width * 0.08,
            width: 25,
            height: 25,
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            borderRadius: 12.5,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: height * 0.22,
            right: width * 0.12,
            width: 20,
            height: 20,
            backgroundColor: "rgba(39, 174, 96, 0.3)",
            borderRadius: 10,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: height * 0.18,
            left: width * 0.18,
            width: 15,
            height: 15,
            backgroundColor: "rgba(46, 204, 113, 0.4)",
            borderRadius: 7.5,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: height * 0.35,
            left: width * 0.05,
            width: 12,
            height: 12,
            backgroundColor: "rgba(39, 174, 96, 0.25)",
            borderRadius: 6,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: height * 0.35,
            right: width * 0.08,
            width: 18,
            height: 18,
            backgroundColor: "rgba(46, 204, 113, 0.35)",
            borderRadius: 9,
          }}
        />
      </ScrollView>
    </View>
  );
};
