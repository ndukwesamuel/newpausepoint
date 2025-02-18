import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { Entypo, AntDesign, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import {
  LightFontText,
  MediumFontText,
  RegularFontText,
} from "../../../components/shared/Paragrahp";
import { useNavigation } from "@react-navigation/native";
import AppScreen from "../../../components/shared/AppScreen";
import MiddelScreenModal from "../../../components/shared/ReuseableModal";
import ReuseModals, {
  CenterReuseModals,
} from "../../../components/shared/ReuseModals";
import { Provider, useDispatch, useSelector } from "react-redux";
import {
  All_Host_Public_events_Fun,
  All_Public_events_Fun,
  Host__events_Fun,
} from "../../../Redux/UserSide/EventSlice";
import { formatDateString } from "../../../utils/DateTime";

const Events = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const animation = useRef(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);

    // Fetch the updated data
    dispatch(All_Public_events_Fun(searchQuery));
    dispatch(Host__events_Fun(searchQuery));
    dispatch(All_Host_Public_events_Fun(searchQuery));

    // After fetching the data, set the refreshing state back to false
    setRefreshing(false);
  };

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const { user_data } = useSelector((state) => state?.AuthSlice);

  const { all_public_event_data, host_event, all_host_public_event } =
    useSelector((state) => state?.EventSlice);

  const screenWidth = Dimensions.get("window").width;
  console.log({
    aaa: all_public_event_data,
  });
  // Filter data based on the search query
  // const filteredData = data.filter(
  //   (item) =>
  //     item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //     item.content.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const handleItemClick = (itemId) => {
    // Navigate to the details screen with the selected item ID
    navigation.navigate("eventdetails", {
      name: "show_all_event",
    });
  };

  const [turnmodal, setTurnmodal] = useState(false);

  const [myevent, setMyevent] = useState("show_event");

  // };

  useEffect(() => {
    dispatch(All_Public_events_Fun(searchQuery));
    dispatch(Host__events_Fun(searchQuery));
    dispatch(All_Host_Public_events_Fun(searchQuery));

    return () => {};
  }, [dispatch, searchQuery]);

  return (
    // <AppScreen>
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      {refreshing && <ActivityIndicator size="large" color="#0C1401" />}

      <CenterReuseModals
        visible={turnmodal}
        onClose={() => setTurnmodal(false)}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            borderRadius: 10,
            elevation: 5,
            width: "50%",
          }}
        >
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
            Creat Your Event
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 6,
              }}
              onPress={() => {
                navigation.navigate("CreatePrivateEvent");
                setTurnmodal(false);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Private
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: "#04973C",
                paddingHorizontal: 12,
                paddingVertical: 2,
                borderRadius: 6,
              }}
              onPress={() => {
                navigation.navigate("CreatePublicEvent");
                setTurnmodal(false);
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "500",
                  fontSize: 14,
                  fontFamily: "RobotoSlab-Medium",
                }}
              >
                Public
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </CenterReuseModals>

      <View style={{ paddingHorizontal: 10, flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            paddingHorizontal: 20,
            gap: 10,
            // alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setMyevent("show_event")}
            style={{
              backgroundColor: myevent === "show_event" ? "green" : "lightgray",
              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RegularFontText
              data="Show Events"
              textstyle={{
                fontSize: 12,
                fontWeight: "bold",

                color: myevent === "show_event" ? "white" : "black",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setTurnmodal(true)}>
            <Ionicons name="create" size={24} color="green" />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
            paddingHorizontal: 20,
            gap: 10,
            // alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setMyevent("host_events")}
            style={{
              // backgroundColor: "lightgray",

              backgroundColor:
                myevent === "host_events" ? "green" : "lightgray",

              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RegularFontText
              data="My Private Events"
              textstyle={{
                fontSize: 12,
                fontWeight: "bold",

                color: myevent === "host_events" ? "white" : "black",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMyevent("public_host_events")}
            style={{
              backgroundColor:
                myevent === "public_host_events" ? "green" : "lightgray",

              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RegularFontText
              data="My Publc Events"
              textstyle={{
                fontSize: 12,
                fontWeight: "bold",

                color: myevent === "public_host_events" ? "white" : "black",
              }}
            />
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />

        {myevent === "host_events" && (
          <View style={{ flex: 1 }}>
            {!host_event?.userEvents?.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                />
              </View>
            ) : (
              <FlatList
                data={host_event?.userEvents}
                keyExtractor={(item) => String(item._id)}
                // numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      margin: 5,
                      padding: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "50%",
                      }}
                      onPress={() => {
                        // Navigate to the details screen with the selected item ID
                        navigation.navigate("eventdetails", {
                          name: "host_events",
                          id: item._id,
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item?.photo ||
                            "https://i.ytimg.com/vi/TjRcnRHwbrA/maxresdefault.jpg",
                        }}
                        style={{ width: "90%", height: 110 }}
                      />
                    </TouchableOpacity>
                    <View style={{ width: "50%" }}>
                      <MediumFontText
                        data={item?.title}
                        textstyle={{
                          fontSize: 16,
                          fontWeight: "500",
                          marginVertical: 5,
                        }}
                      />

                      <MediumFontText
                        data={formatDateString(item?.event_date)}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      <MediumFontText
                        data={item?.venue}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      {/* <MediumFontText
        data={`From ₦${item?.price}`}
        textstyle={{
          fontSize: 13,
          fontWeight: "500",
        }}
      /> */}
                    </View>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
          </View>
        )}

        {myevent === "show_event" && (
          <View style={{ flex: 1 }}>
            {!all_public_event_data?.totalEvents > 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                />
              </View>
            ) : (
              <FlatList
                data={all_public_event_data?.events}
                keyExtractor={(item) => String(item._id)}
                // numColumns={2}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      margin: 5,
                      padding: 5,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: "50%",
                      }}
                      // onPress={() => handleItemClick(item.id)}

                      onPress={() => {
                        // Navigate to the details screen with the selected item ID
                        navigation.navigate("eventdetails", {
                          name: "show_event",
                          id: item._id,
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item?.photo ||
                            "https://i.ytimg.com/vi/TjRcnRHwbrA/maxresdefault.jpg",
                        }}
                        style={{ width: "90%", height: 110 }}
                      />
                    </TouchableOpacity>

                    <View style={{ width: "50%" }}>
                      <MediumFontText
                        data={item?.title}
                        textstyle={{
                          fontSize: 16,
                          fontWeight: "500",
                          marginVertical: 5,
                        }}
                      />

                      <MediumFontText
                        data={formatDateString(item?.starts)}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      <MediumFontText
                        data={item?.venue}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      <MediumFontText
                        data={`From ₦${item?.price}`}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />
                    </View>
                  </View>
                )}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
              />
            )}
          </View>
        )}

        {myevent === "public_host_events" && (
          <View style={{ flex: 1 }}>
            {!all_host_public_event?.totalEvents > 0 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <LottieView
                  autoPlay
                  ref={animation}
                  style={{
                    width: 200,
                    height: 200,
                    // backgroundColor: "#eee",
                  }}
                  // Find more Lottie files at https://lottiefiles.com/featured
                  source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
                />
              </View>
            ) : (
              <FlatList
                data={all_host_public_event?.userEvents}
                keyExtractor={(item) => String(item._id)}
                // numColumns={2}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      borderWidth: 1,
                      borderColor: "#ccc",
                      borderRadius: 8,
                      margin: 5,
                      padding: 5,
                    }}
                  >
                    {console.log({
                      aa: item,
                    })}
                    <TouchableOpacity
                      style={{
                        width: "50%",
                      }}
                      // onPress={() => handleItemClick(item.id)}

                      onPress={() => {
                        // Navigate to the details screen with the selected item ID
                        navigation.navigate("eventdetails", {
                          name: "show_event",
                          id: item._id,
                        });
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            item?.photo ||
                            "https://i.ytimg.com/vi/TjRcnRHwbrA/maxresdefault.jpg",
                        }}
                        style={{ width: "90%", height: 110 }}
                      />
                    </TouchableOpacity>

                    <View style={{ width: "50%" }}>
                      <MediumFontText
                        data={item?.title}
                        textstyle={{
                          fontSize: 16,
                          fontWeight: "500",
                          marginVertical: 5,
                        }}
                      />

                      <MediumFontText
                        data={formatDateString(item?.starts)}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      <MediumFontText
                        data={item?.venue}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />

                      <MediumFontText
                        data={`From ₦${item?.price}`}
                        textstyle={{
                          fontSize: 13,
                          fontWeight: "500",
                        }}
                      />
                    </View>
                  </View>
                )}
              />
            )}
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
    // </AppScreen>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 10,
  },
});

export default Events;
