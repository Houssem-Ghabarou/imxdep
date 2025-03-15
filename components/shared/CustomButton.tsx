import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";

interface ButtonProps {
  onPressFunction?: () => void;
  height?: number;
  title: String;
}
const CustomButton = ({ onPressFunction, title, height }: ButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, height ? { height } : {}]}
      onPress={onPressFunction}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

// 💡 Styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5FBF9C",
    borderColor: "#21A67C",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    justifyContent: "center", // Center text vertically
    alignItems: "center", // Center text horizontally
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
