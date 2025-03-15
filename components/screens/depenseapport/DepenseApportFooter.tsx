import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const DepenseApportFooter = () => {
  return (
    <View style={styles.container}>
      {/* Green button with + */}
      <TouchableOpacity style={[styles.button, styles.greenButton]}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Red button with - */}
      <TouchableOpacity style={[styles.button, styles.redButton]}>
        <Ionicons name="remove" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Optional: adds a shadow for the button
  },
  greenButton: {
    backgroundColor: "#21A67C", // Green color
  },
  redButton: {
    backgroundColor: "#F44336", // Red color
  },
});

export default DepenseApportFooter;
