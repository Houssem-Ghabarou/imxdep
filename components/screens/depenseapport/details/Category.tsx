import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React from "react";
import SearchableDropdown from "@/components/shared/SearchableDropDown";
import { Ionicons } from "@expo/vector-icons";
import { category } from "@/types/category";

interface CategoryProps {
  categories: any[];
  selectedCategory: category;
  setSelectedCategory: (category: category) => void;
}
const Category = ({
  categories,
  setSelectedCategory,
  selectedCategory,
}: CategoryProps) => {
  const isCategorySelected =
    Object.keys(selectedCategory).length > 0 ? true : false;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category </Text>
      <SearchableDropdown
        items={categories}
        onSelect={(item: category) => setSelectedCategory(item)}
        displayBy="category"
        placeholder="Search Categories"
      />
      {isCategorySelected && (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            marginTop: 15,
          }}
        >
          <View style={styles.button}>
            <Ionicons name="add" size={20} color="#000000" />
          </View>
          <Text style={{ fontSize: 15, color: "#9A9A9A" }}>
            add sub-category
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  text: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
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

export default Category;
