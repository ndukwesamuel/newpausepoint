import {
  View,
  Text,
  KeyboardAvoidingView,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";

import { Feather } from "@expo/vector-icons";

import {
  MediumFontText,
  RegularFontText,
} from "../../components/shared/Paragrahp";
import { useDispatch, useSelector } from "react-redux";
import { Get_Singel_Host__events_Fun } from "../../Redux/UserSide/EventSlice";
import { formatDate, formatDateString } from "../../utils/DateTime";

const PrivateEventDetails = ({ navigation, data_id }) => {
  console.log({
    aa: data_id,
  });

  const dispatch = useDispatch();

  const { single_host_event } = useSelector((state) => state.EventSlice);

  useEffect(() => {
    dispatch(Get_Singel_Host__events_Fun(data_id));
    return () => {};
  }, [dispatch]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View style={{ paddingHorizontal: 20, flex: 1 }}>
        <View style={{ alignItems: "center" }}>
          <Image
            source={{
              uri:
                single_host_event?.event?.photo ||
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
          data={single_host_event?.event?.title}
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
              data={formatDateString(single_host_event?.event?.event_date)}
              textstyle={{ fontSize: 15, color: "white" }}
            />
          </View>
        </TouchableOpacity>
        <View style={{ marginTop: 10 }}>
          <MediumFontText
            data="Event Description "
            textstyle={{ fontSize: 17 }}
          />
          <MediumFontText
            data={single_host_event?.event?.description}
            textstyle={{ fontSize: 17 }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <MediumFontText data="Venue" textstyle={{ fontSize: 17 }} />
          <MediumFontText
            data={single_host_event?.event?.venue}
            textstyle={{ fontSize: 17 }}
          />
        </View>

        <View style={{ marginTop: 10, flexDirection: "row" }}>
          <MediumFontText
            data="Number Of Guest :"
            textstyle={{ fontSize: 17 }}
          />
          <MediumFontText
            data={single_host_event?.event?.number_of_guests}
            textstyle={{ fontSize: 17 }}
          />
        </View>

        <View style={{ marginTop: 10 }}>
          <MediumFontText
            data="Email Of Guest :"
            textstyle={{ fontSize: 17 }}
          />
          <FlatList
            data={single_host_event?.event?.add_guests}
            renderItem={({ item }) => (
              <View>
                <MediumFontText data={item} textstyle={{ fontSize: 17 }} />
              </View>
            )}
          />
        </View>
      </View>
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

export default PrivateEventDetails;
