import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { truncateText } from "../../../utils/Utils";

const PendingGoods = () => {
  const navigation = useNavigation();
  const { Admin_Market_data } = useSelector((state) => state.AdminMarketSLice);

  const [pendingProducts, setPendingProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products

  useEffect(() => {
    const pendingProducts = Admin_Market_data?.products.filter(
      (product) => product.status === "Decline"
    );
    setPendingProducts(pendingProducts);
    setFilteredProducts(pendingProducts); // Initialize with all pending products
  }, [Admin_Market_data]);

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query) {
      const filtered = pendingProducts.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(pendingProducts); // Show all products if query is empty
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search by product name..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ScrollView>
        {filteredProducts?.map((item, index) => (
          <View style={styles.itemContainer} key={index}>
            <View style={styles.itemDetails}>
              <Pressable
                onPress={() => navigation.navigate("ProductDetails", { item })}
              >
                <Image
                  source={{
                    uri: item.images[0]?.url,
                  }}
                  style={styles.itemImage}
                />
              </Pressable>

              <View>
                <Text style={styles.itemName}>
                  {truncateText(item.name, 30)}
                </Text>
                <Text style={styles.itemService}>
                  {truncateText(item.description, 30)}
                </Text>
              </View>
            </View>
            <Text style={styles.itemPrice}>{item.price}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    flex: 1,
    height: "100%",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  itemDetails: {
    flexDirection: "row",
    gap: 20,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemService: {
    width: "90%",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PendingGoods;
