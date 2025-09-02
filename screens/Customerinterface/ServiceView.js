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
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
  StatusBar,
  // ScrollView,
} from "react-native";
import { Rating } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { All_service__data_Fun } from "../../Redux/UserSide/ServiceSlice";
import LottieView from "lottie-react-native";
import ScreenWrapper from "../../components/shared/ScreenWrapper";

const { width, height } = Dimensions.get("window");

const ServiceView = ({ navigation }) => {
  const dispatch = useDispatch();
  const animation = useRef(null);
  const { userProfile_data } = useSelector((state) => state.ProfileSlice);

  const { all_service__data } = useSelector((state) => state.ServiceSlice);

  useEffect(() => {
    if (userProfile_data?.user?.isGuest != true) {
      dispatch(All_service__data_Fun());
    }

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
    <ScreenWrapper
      title="Service"
      navigation={navigation}
      headerStyle={{
        backgroundColor: "white",
      }}
      // showHeader={false}
    >
      {userProfile_data?.user?.isGuest ? (
        <ArtisanComingSoon />
      ) : (
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
      )}
    </ScreenWrapper>
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

const ArtisanComingSoon = () => {
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
        toValue: 0.75,
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
      "Thank you! We'll notify you when artisan services are available.",
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
          {/* Animated Tool Icon */}
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
              {/* Hammer */}
              <View
                style={{
                  position: "absolute",
                  width: 8,
                  height: 60,
                  backgroundColor: "#2ecc71",
                  borderRadius: 4,
                  transform: [{ rotate: "45deg" }],
                }}
              />
              {/* Wrench */}
              <View
                style={{
                  position: "absolute",
                  width: 8,
                  height: 60,
                  backgroundColor: "#27ae60",
                  borderRadius: 4,
                  transform: [{ rotate: "-45deg" }],
                }}
              />
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
            Artisan Services
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
            We're crafting something amazing! Our skilled artisan services will
            connect you with expert craftspeople for all your home improvement
            and repair needs.
          </Text>

          {/* Features Preview */}
          <View
            style={{
              marginBottom: 40,
              width: "100%",
            }}
          >
            {[
              "Expert Craftspeople",
              "Quality Guaranteed",
              "Fair Pricing",
              "Easy Booking",
              "24/7 Support",
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
              75% Complete
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

          {/* Additional Info */}
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
                fontSize: 14,
                color: "#7f8c8d",
                textAlign: "center",
                lineHeight: 20,
              }}
            >
              🔨 Carpentry • 🔧 Plumbing • ⚡ Electrical{"\n"}
              🎨 Painting • 🏠 Home Repairs • And More!
            </Text>
          </View>
        </Animated.View>

        {/* Floating decorative elements */}
        <View
          style={{
            position: "absolute",
            top: height * 0.15,
            left: width * 0.1,
            width: 25,
            height: 25,
            backgroundColor: "rgba(46, 204, 113, 0.2)",
            borderRadius: 12.5,
          }}
        />

        <View
          style={{
            position: "absolute",
            top: height * 0.25,
            right: width * 0.15,
            width: 20,
            height: 20,
            backgroundColor: "rgba(39, 174, 96, 0.3)",
            borderRadius: 10,
          }}
        />

        <View
          style={{
            position: "absolute",
            bottom: height * 0.2,
            left: width * 0.2,
            width: 15,
            height: 15,
            backgroundColor: "rgba(46, 204, 113, 0.4)",
            borderRadius: 7.5,
          }}
        />
      </ScrollView>
    </View>
  );
};
