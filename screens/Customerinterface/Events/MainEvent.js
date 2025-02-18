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
  ScrollView,
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
import { formatDateandTime, formatDateString } from "../../../utils/DateTime";
import {
  Get_GeneralEvent_Fun,
  Get_UserEvent_Fun,
} from "../../../Redux/UserSide/MainEventSlice";

const MainEvent = () => {
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

  const [myevent, setMyevent] = useState("my_events");

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
            justifyContent: "flex-end",
            marginVertical: 10,
            paddingHorizontal: 20,
            gap: 10,
            // alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate("CreateMainEvent")}
          >
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
            onPress={() => setMyevent("my_events")}
            style={{
              // backgroundColor: "lightgray",

              backgroundColor: myevent === "my_events" ? "green" : "lightgray",

              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RegularFontText
              data="My Events"
              textstyle={{
                fontSize: 12,
                fontWeight: "bold",

                color: myevent === "my_events" ? "white" : "black",
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMyevent("estate_event")}
            style={{
              backgroundColor:
                myevent === "estate_event" ? "green" : "lightgray",

              paddingHorizontal: 12,
              paddingVertical: 2,
              borderRadius: 50,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <RegularFontText
              data="Estate Events"
              textstyle={{
                fontSize: 12,
                fontWeight: "bold",

                color: myevent === "estate_event" ? "white" : "black",
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

        {myevent === "my_events" && <MyEvent />}
        {myevent === "estate_event" && <AdminEvent />}
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

export default MainEvent;

const MyEvent = () => {
  const { all_public_event_data, host_event, all_host_public_event } =
    useSelector((state) => state?.EventSlice);

  const { userevent_data } = useSelector((state) => state?.MainEventSlice);
  console.log({
    kakfdf: userevent_data?.events[0],
  });

  const animation = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Get_UserEvent_Fun());

    return () => {};
  }, []);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);

    // Fetch the updated data
    dispatch(Get_UserEvent_Fun());

    // After fetching the data, set the refreshing state back to false
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {userevent_data?.events?.length === 0 ? (
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
              // backgroundColor: "#eee",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={userevent_data?.events}
          keyExtractor={(item) => String(item._id)}
          // numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <HistoryItem itemdata={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const AdminEvent = () => {
  const { all_public_event_data, host_event, all_host_public_event } =
    useSelector((state) => state?.EventSlice);

  const { generalevent_data } = useSelector((state) => state?.MainEventSlice);
  console.log({
    fdf: generalevent_data?.events[0],
  });

  const animation = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Get_GeneralEvent_Fun());

    return () => {};
  }, [dispatch]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    // Set the refreshing state to true
    setRefreshing(true);

    // Fetch the updated data
    dispatch(Get_GeneralEvent_Fun());

    // After fetching the data, set the refreshing state back to false
    setRefreshing(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {generalevent_data?.events?.length === 0 ? (
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
              // backgroundColor: "#eee",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("../../../assets/Lottie/Animation - 1704444696995.json")}
          />
        </ScrollView>
      ) : (
        <FlatList
          data={generalevent_data?.events}
          keyExtractor={(item) => String(item._id)}
          // numColumns={2}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <HistoryItem itemdata={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const HistoryItem = ({ itemdata }) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        borderWidth: 1,
        borderColor: "#CFCDCD",
        marginBottom: 20,
        paddingVertical: 10,
        borderRadius: 9,
      }}
      onPress={() => {
        navigation.navigate("eventdetails", {
          itemdata,
        });
      }}
    >
      <View>
        <Text
          style={{
            fontSize: 18,
            fontFamily: "RobotoSlab-SemiBold",
            fontWeight: "600",
          }}
        >
          Event Name
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          {itemdata?.name}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          Number of Guests
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          {itemdata?.guestNumber}
        </Text>
      </View>

      <View>
        {/* <Text style={{ fontSize: 18, fontFamily: "RobotoSlab-SemiBold" }}>
          Checked Out
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Status
        </Text> */}

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {itemdata?.date}
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Departure Date
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontFamily: "Inter-SemiBold",
            fontWeight: "600",
          }}
        >
          {itemdata?.time}
        </Text>

        <Text
          style={{
            fontSize: 11,
            fontFamily: "RobotoSlab-Medium",
            fontWeight: "500",
          }}
        >
          Departure Time
        </Text>
      </View>
    </TouchableOpacity>
  );
};
