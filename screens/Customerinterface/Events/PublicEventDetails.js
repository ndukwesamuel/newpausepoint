import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Paystack, paystackProps } from "react-native-paystack-webview";

import {
  MediumFontText,
  RegularFontText,
} from "../../components/shared/Paragrahp";
import {
  Get_Singel_Public__events_Fun,
  reste_Get_Singel_Public__events_Fun,
} from "../../Redux/UserSide/EventSlice";
import { formatDateString } from "../../utils/DateTime";
import { CenterReuseModals } from "../shared/ReuseModals";
import { Forminput } from "../shared/InputForm";

const PublicEventDetails = ({ navigation, data_id }) => {
  const { single_public_event } = useSelector((state) => state.EventSlice);
  const [turnmodal, setTurnmodal] = useState(false);
  const [myevent, setMyevent] = useState("show_event");
  const paystackWebViewRef = useRef();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ticket, setTicket] = useState("");

  const dispatch = useDispatch();
  console.log({
    data_id: single_public_event,
  });

  useEffect(() => {
    dispatch(Get_Singel_Public__events_Fun(data_id));
    return () => {
      dispatch(reste_Get_Singel_Public__events_Fun());
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <View style={{ paddingHorizontal: 20, flex: 1 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              source={{
                uri:
                  single_public_event?.event?.photo ||
                  "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcRsoTuLvkvTVcU4UraMI_v0AukjQeC3AlzkjOy0RcJb9A7PlPhP",
              }}
              style={{
                width: 200,
                height: 200,
                borderRadius: 20,
                // justifyContent: "center",
                // flex: 1,
                // justifyContent: "center",
              }}
              //   resizeMode="cover"
            />
          </View>
          <MediumFontText
            data={single_public_event?.event?.title}
            textstyle={{ fontSize: 17, textAlign: "center" }}
          />

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "lightblue",
              paddingHorizontal: 10,
              paddingVertical: 10,
              borderRadius: 10,
              gap: 10,
              // marginTop: 20,
            }}
          >
            <View
              style={{
                backgroundColor: "#050A30",
                padding: 10,
                borderRadius: 50,
              }}
            >
              <Feather name="bell" size={24} color="white" />
            </View>
            <View>
              <RegularFontText
                data="Event Date"
                textstyle={{ fontSize: 15, color: "white" }}
              />

              <RegularFontText
                data={formatDateString(single_public_event?.event?.event_date)}
                textstyle={{ fontSize: 15, color: "white" }}
              />
            </View>
          </TouchableOpacity>

          <View style={{ marginTop: 10 }}>
            <MediumFontText
              data="Event Description "
              textstyle={{ fontSize: 17 }}
            />
            <RegularFontText
              data={single_public_event?.event?.description}
              textstyle={{ fontSize: 17 }}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <MediumFontText data="Venue" textstyle={{ fontSize: 17 }} />
            <MediumFontText
              data={single_public_event?.event?.venue}
              textstyle={{ fontSize: 17 }}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MediumFontText
              data="Available tickets:"
              textstyle={{ fontSize: 17 }}
            />

            <RegularFontText
              data={single_public_event?.event?.available_tickets}
              textstyle={{ fontSize: 15 }}
            />
          </View>

          <View
            style={{
              marginTop: 10,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <MediumFontText
              data=" Tickets Price:"
              textstyle={{ fontSize: 17 }}
            />

            <RegularFontText
              data={single_public_event?.event?.price}
              textstyle={{ fontSize: 15 }}
            />
          </View>
          {/* <View style={{ flex: 1 }}>
          <TicketSelectionScreen />
        </View> */}
        </View>
        <View>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              borderColor: "black",
              borderRadius: 10,
              padding: 10,
              marginTop: 10,
              alignItems: "center",
            }}
            onPress={() => setTurnmodal(true)}
          >
            <MediumFontText data="Book Now" textstyle={{ fontSize: 17 }} />
          </TouchableOpacity>
        </View>
      </View>

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
            width: "90%",
            height: "50%",
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
            Buy Event Ticket
          </Text>
          <View>
            <MediumFontText data="Name" textstyle={{ fontSize: 14 }} />
            <Forminput placeholder="Name" onChangeText={setName} value={name} />
          </View>

          <View>
            <MediumFontText data="Email" textstyle={{ fontSize: 14 }} />
            <Forminput
              placeholder="email"
              onChangeText={setEmail}
              value={email}
            />
          </View>
          <View>
            <MediumFontText data="Phone" textstyle={{ fontSize: 14 }} />
            <Forminput
              placeholder="phone"
              onChangeText={setPhone}
              value={phone}
            />
          </View>

          <View>
            <MediumFontText
              data="Number of  Tickets"
              textstyle={{ fontSize: 14 }}
            />
            <Forminput
              placeholder="Tickets"
              onChangeText={setTicket}
              value={ticket}
            />
          </View>

          {name && email && phone && ticket && (
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: "black",
                borderRadius: 10,
                padding: 10,
                marginTop: 10,
                alignItems: "center",
              }}
              onPress={() => paystackWebViewRef.current?.startTransaction()}

              // onPress={() => setTurnmodal(true)}
            >
              <MediumFontText data="Submit" textstyle={{ fontSize: 17 }} />
            </TouchableOpacity>
          )}

          <Paystack
            paystackKey="pk_test_4f6ffc3f55e513cdeb56e13dd9680afd61cb3702"
            paystackSecretKey="sk_test_55df4d0e2ef238bf1c941f52e317c5fbd46eea7a"
            // billingEmail="ndukwesamuel23@gmail.com"
            billingEmail={`${email}`}
            amount="50000"
            billingName={`${name}`}
            billingMobile="0594602088"
            currency="GHS"
            onCancel={(e) => {
              console.log(e);
              // setAmount("");
            }}
            onSuccess={(res) => {
              console.log({ res });

              // createmutation.mutate(amount);

              // setAmount("");

              Alert.alert(
                "Alert",

                `${res?.data?.event} ${res?.transactionRef?.message}`,

                [{ text: "OK" }],
                { cancelable: false }
              );
            }}
            ref={paystackWebViewRef}
          />
        </View>
      </CenterReuseModals>
    </KeyboardAvoidingView>
  );
};

// TicketSelectionScreen.js

const TicketSelectionScreen = ({ navigation }) => {
  const [selectedTickets, setSelectedTickets] = useState([]);

  const availableTickets = [
    { id: 1, type: "Regular (1000 to attend )", price: 20000 },
    { id: 2, type: "Vip (1000 to attend )", price: 500000 },
    { id: 3, type: "Table Of 5 (10 to attend )", price: 500000 },
    { id: 4, type: "Table Of 10 (10 to attend )", price: 500000 },
    { id: 5, type: "VIP", price: 50 },
    // Add more ticket types as needed
  ];

  const toggleTicketSelection = (ticketId) => {
    const isSelected = selectedTickets.includes(ticketId);
    if (isSelected) {
      setSelectedTickets(selectedTickets.filter((id) => id !== ticketId));
    } else {
      setSelectedTickets([...selectedTickets, ticketId]);
    }
  };

  const proceedToPayment = () => {
    // You can navigate to the payment screen with the selected tickets
    // navigation.navigate("PaymentScreen", { selectedTickets });

    console.log("Selected Tickets:", selectedTickets);
  };
  const [numColumns, setNumColumns] = useState(2);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Select Your Tickets</Text> */}

      <MediumFontText data="Select Your Tickets" textstyle={styles.header} />
      <FlatList
        key={numColumns}
        numColumns={numColumns}
        data={availableTickets}
        keyExtractor={(item) => item.id.toString()}
        columnWrapperStyle={{
          //   justifyContent: "space-between",
          gap: 5,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.ticketButton,
              selectedTickets.includes(item.id) && styles.selectedTicket,
            ]}
            onPress={() => toggleTicketSelection(item.id)}
          >
            <View style={{ alignItems: "center" }}>
              <MediumFontText
                data={item.type}
                textstyle={{ fontSize: 15, color: "black" }}
              />
              <MediumFontText
                data={`${item.type} - $${item.price}`}
                textstyle={{ fontSize: 15, color: "black" }}
              />
            </View>
          </TouchableOpacity>
        )}
      />

      {/* {availableTickets.map((ticket) => (
          <TouchableOpacity
            key={ticket.id}
            style={[
              styles.ticketButton,
              selectedTickets.includes(ticket.id) && styles.selectedTicket,
            ]}
            onPress={() => toggleTicketSelection(ticket.id)}
          >
            <Text>{ticket.type}</Text>
            <Text>{`${ticket.type} - $${ticket.price}`}</Text>
          </TouchableOpacity>
        ))} */}
      <TouchableOpacity
        style={styles.proceedButton}
        onPress={proceedToPayment}
        disabled={selectedTickets.length === 0}
      >
        <Text style={styles.proceedButtonText}>Proceed to Payment</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    marginTop: 20,
  },
  header: {
    fontSize: 20,
    // marginBottom: 20,
  },
  ticketButton: {
    paddingVertical: 5,
    paddingHorizontal: 7, // marginVertical: 5,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 8,
    width: "50%",
    marginVertical: 5,
    // margin: 8,
    // padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white", // Set the background color if needed
    elevation: 5, // Android box shadow
    shadowColor: "rgba(0, 0, 0, 0.1)", // iOS box shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  selectedTicket: {
    backgroundColor: "lightblue",
  },
  proceedButton: {
    // marginTop: 20,
    padding: 10,
    backgroundColor: "green",
    borderRadius: 8,
  },
  proceedButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default PublicEventDetails;
