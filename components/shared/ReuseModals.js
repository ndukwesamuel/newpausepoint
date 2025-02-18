import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { MediumFontText, RegularFontText } from "./Paragrahp";

export default function ReuseModals({ visible, children }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 20,
            width: "100%",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            height: "70%",
          }}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
}

export function CenterReuseModals({ children, visible, onClose }) {
  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback
      // onPress={onClose}
      >
        <View style={styles.modalContainer}>{children}</View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export function BottomModal({ visible, onClose, handleLogout, children }) {
  return (
    <Modal transparent={true} animationType="slide" visible={visible}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              width: "100%",
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              height: "50%",
            }}
          >
            {children}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: "50%",
  },
  closeButton: {
    marginTop: 10,
    alignSelf: "flex-end",
  },
  closeButtonText: {
    color: "blue", // Customize the close button style
  },
});
