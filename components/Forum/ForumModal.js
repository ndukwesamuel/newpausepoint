import React, { Children, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { MediumFontText, RegularFontText } from "../shared/Paragrahp";

function ForumModal({ visible, onClose, children }) {
  let data = [
    {
      id: "1",
      title: "Hide this post",
      description: "This announcement will be deleted instantly",
      img: require("../../assets/images/trash.png"),
    },
    {
      id: "2",
      title: "Save for later",
      description: "Save this post to view later ",
      img: require("../../assets/images/save-add.png"),
    },
    {
      id: "3",
      title: "Mute John Doe",
      description: "Temporary mute the announcement author ",
      img: require("../../assets/images/volume-cross.png"),
    },
  ];
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>{children}</View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "30%",
  },
});

export default ForumModal;
