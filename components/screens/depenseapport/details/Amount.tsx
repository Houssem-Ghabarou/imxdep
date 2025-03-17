import { View, TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";
import { DepenseOrApport } from "@/types/depenseorapport";

interface AmountProps {
  type: string;
  setAmount: (amount: string) => void;
  amount: string;
}

const Amount = ({ type, setAmount, amount }: AmountProps) => {
  const handleAmountChange = (text: string) => {
    // Allow only numbers, commas, and dots
    const formattedText = text.replace(/[^0-9,.]/g, "");

    setAmount(formattedText);
  };

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          type === DepenseOrApport.DEPENSE
            ? { backgroundColor: DepenseOrApport.DEPENSECOLOR }
            : { backgroundColor: DepenseOrApport.APPORTCOLOR },
        ]}
        value={amount}
        onChangeText={handleAmountChange}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 100,
    borderColor: "#000000",
    borderWidth: 1,
    textAlign: "center",
    fontSize: 35,
    borderRadius: 10,

    fontWeight: "bold",
    color: "#000000",
    paddingHorizontal: 10,
  },
});

export default Amount;
