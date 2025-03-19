import { View, Text, StyleSheet, TextInput } from "react-native";
import React, { useState } from "react";
import { DepenseApportInterface } from "@/types/depenseapport";

interface descriptionProps {
  setDescription: (text: string) => void;
  description: DepenseApportInterface["description"];
}
const Description = ({ description, setDescription }: descriptionProps) => {
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description</Text>
      <TextInput
        style={[styles.input]}
        value={description}
        onChangeText={handleDescriptionChange}
        multiline={true} // Allow multiline input
        textAlignVertical="top" // Align text to the top
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  input: {
    paddingTop: 10,
    height: 200,
    borderColor: "#000000",
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 10,
    color: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 10, // Add padding for better spacing
    textAlignVertical: "top", // Align text to the top
  },
});

export default Description;
