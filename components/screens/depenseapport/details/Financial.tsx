import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Category from "./Category";
import { DepenseApportInterface } from "@/types/depenseapport";
import { category } from "@/types/category";
import { Ionicons } from "@expo/vector-icons";

interface financialProps {
  companyId: string;

  dataFromDetails?: DepenseApportInterface | null;
}

const Financial = ({ companyId, dataFromDetails }: financialProps) => {
  const financialIds = dataFromDetails?.finance as string[];
  const financialPathSelected =
    dataFromDetails?.accountPath as DepenseApportInterface["accountPath"];
  const [financeCategories, setFinanceCategories] = useState<any>([]);
  const [selectedFinanceCategory, setSelectedFinanceCategory] = useState<{
    [key: string]: category[];
  }>({} as { [key: string]: category[] });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Finance</Text>
      <Category
        fixedCategories={2}
        categoryPathSelected={financialPathSelected}
        companyId={companyId}
        displayBy="category"
        collectionName="debitcredit"
        headerlabel="Crédit"
        categories={financeCategories}
        selectedCategory={selectedFinanceCategory}
        setSelectedCategory={setSelectedFinanceCategory}
        setCategories={setFinanceCategories}
        dataFromDetails={dataFromDetails}
      />

      {/* amount finance */}
      <TextInput
        style={[styles.input]}
        //  value={description}
        //  onChangeText={handleDescriptionChange}
        multiline={true} // Allow multiline input
        textAlignVertical="top" // Align text to the top
      />

      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <View style={styles.button}>
          <Ionicons name="add" size={20} color="#000000" />
        </View>
        <Text style={{ fontSize: 15, color: "#9A9A9A" }}>{`Add Crédit`}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
  container: {
    gap: 18,
  },
  input: {
    paddingTop: 10,
    height: 50,
    borderColor: "#000000",
    borderWidth: 1,
    fontSize: 16,
    borderRadius: 10,
    color: "#000000",
    paddingHorizontal: 10,
    paddingVertical: 10, // Add padding for better spacing
    textAlignVertical: "top", // Align text to the top
  },
  button: {
    flexDirection: "row",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    backgroundColor: "#D9D9D9",
    borderColor: "#000000",
  },
});

export default Financial;
