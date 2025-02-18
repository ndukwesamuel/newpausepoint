import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Expo has this built-in

const CustomStarRating = ({ maxStars = 5, onRatingSelected }) => {
  const [rating, setRating] = useState(0); // Store the rating value selected by the user

  const handleStarPress = (selectedRating) => {
    setRating(selectedRating); // Update the state when a star is pressed
    onRatingSelected(selectedRating); // Send the rating to the parent component via the callback
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {/* Create stars based on the maxStars prop */}
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleStarPress(starValue)}
            >
              <FontAwesome
                name={starValue <= rating ? "star" : "star-o"} // filled star for selected, outline for unselected
                size={40}
                color={starValue <= rating ? "#f5c518" : "#ccc"} // golden color for filled, gray for unselected
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
  },
  ratingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});

export default CustomStarRating;
