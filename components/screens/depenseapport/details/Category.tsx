import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import SearchableDropdown from "@/components/shared/SearchableDropDown";
import { Ionicons } from "@expo/vector-icons";
import { category } from "@/types/category";
import firestore from "@react-native-firebase/firestore";
import { DepenseApportInterface } from "@/types/depenseapport";
interface CategoryProps {
  categories: { [key: string]: category[] };
  selectedCategory: { [key: string]: category[] };
  setSelectedCategory: (
    selected:
      | { [key: string]: category[] }
      | ((prevSelected: { [key: string]: category[] }) => {
          [key: string]: category[];
        })
  ) => void;
  companyId: string;
  setCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: category[] }>
  >;
  categoryPathSelected: DepenseApportInterface["categoryPath"];
}

const renderDropdowns = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  setCategories,
  categoryPathSelected,
}: CategoryProps) => {
  const setSelectedCategoryByDropdown = (
    item: category,
    dropdownKey: string
  ) => {
    setSelectedCategory((prevSelected) => {
      // Merge previous selected category with the new selected category
      const newSelected = {
        ...prevSelected,
        [dropdownKey]: [item],
      };

      // Remove all dropdowns after the current dropdownKey
      const dropdownKeys = Object.keys(newSelected);
      const index = dropdownKeys.indexOf(dropdownKey);
      const filteredSelected = dropdownKeys
        .slice(0, index + 1)
        .reduce((acc, key) => {
          acc[key] = newSelected[key];
          return acc;
        }, {} as { [key: string]: category[] });

      return filteredSelected;
    });

    setCategories((prevCategories) => {
      const dropdownKeys = Object.keys(prevCategories);
      const index = dropdownKeys.indexOf(dropdownKey);
      const newCategories = dropdownKeys
        .slice(0, index + 1)
        .reduce((acc, key) => {
          acc[key] = prevCategories[key];
          return acc;
        }, {} as { [key: string]: category[] });

      return newCategories;
    });
  };

  return Object.keys(categories).map((key, index) => {
    console.log(
      selectedCategory[key]?.[0]?.category,
      "selectedCategory[key]?.[0]?.category"
    );
    return (
      <SearchableDropdown
        key={`${key}-${categories[key].length}`} // Ensures a re-render on state change
        items={categories[key]}
        value={selectedCategory[key]?.[0]?.category}
        setSelectedCategory={setSelectedCategory}
        onSelect={(item) => setSelectedCategoryByDropdown(item, key)}
        displayBy="category"
        placeholder={`Search in category `}
      />
    );
  });
};

const addSubCategoryFromLastSelected = (
  selectedCategory: CategoryProps["selectedCategory"],
  companyId: CategoryProps["companyId"],
  setSelectedCategory: CategoryProps["setSelectedCategory"],
  categories: CategoryProps["categories"],
  setCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: category[] }>
  >
) => {
  ///calling firestore to fetch the category collection of the last selected category
  const fetchSubCategories = async () => {
    try {
      const selectedCategoryKeys = Object.keys(selectedCategory);
      if (selectedCategoryKeys.length === 0) return;

      const lastSelectedKey =
        selectedCategoryKeys[selectedCategoryKeys.length - 1];

      const parentId = selectedCategory[lastSelectedKey][0].id;
      if (!parentId) {
        //add empty object to categories
        const nextDropdownKey = `dropdown${Object.keys(categories).length + 1}`;
        setCategories((prev) => ({
          ...prev,
          [nextDropdownKey]: [],
        }));
        return;
      }

      const subCategories = await firestore()
        .collection("Company")
        .doc(companyId)
        .collection("category")
        .where("parentId", "==", parentId)
        .get();

      const subCategoryList: category[] = subCategories.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as category)
      );
      const nextDropdownKey = `dropdown${Object.keys(categories).length + 1}`;

      setCategories((prev) => ({
        ...prev,
        [nextDropdownKey]: subCategoryList,
      }));
    } catch (error) {}
  };

  fetchSubCategories();
};
const Category = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  companyId,
  setCategories,
  categoryPathSelected,
}: CategoryProps) => {
  const isCategorySelected =
    Object.keys(selectedCategory).length > 0 ? true : false;

  // Get all keys
  const keys = Object.keys(categories);

  // Get the last key
  const lastKey = keys[keys.length - 1];

  // Get the length of the values array for the last key
  const lastKeyLength = categories[lastKey].length;

  const allowAdd =
    Object.keys(selectedCategory).length === Object.keys(categories).length;
  const allowAddWhenLastKeyHasValue = lastKeyLength > 0;
  const lastKeySelected = selectedCategory[lastKey]?.length > 0;

  useEffect(() => {
    if (categoryPathSelected && categoryPathSelected?.length === 0) return;

    const fetchCategoriesFromPath = async () => {
      let tempSelectedCategory: { [key: string]: category[] } = {};
      let tempCategories: { [key: string]: category[] } = {};

      for (let i = 0; i < categoryPathSelected.length; i++) {
        const categoryId = categoryPathSelected[i];
        const dropdownKey = `dropdown${i + 1}`;

        // Fetch category data for the current ID
        const categorySnapshot = await firestore()
          .collection("Company")
          .doc(companyId)
          .collection("category")
          .doc(categoryId)
          .get();

        if (!categorySnapshot.exists) break;

        const categoryData = {
          ...categorySnapshot.data(),
          id: categorySnapshot.id,
        } as category;

        // Store selected category
        tempSelectedCategory[dropdownKey] = [categoryData];

        // Fetch subcategories for the current category only if within range
        if (i < categoryPathSelected.length - 1) {
          const subCategorySnapshot = await firestore()
            .collection("Company")
            .doc(companyId)
            .collection("category")
            .where("parentId", "==", categoryId)
            .get();

          const subCategoryList: category[] = subCategorySnapshot.docs.map(
            (doc) => ({ ...doc.data(), id: doc.id } as category)
          );

          // Store fetched subcategories (for next dropdown)
          tempCategories[`dropdown${i + 2}`] = subCategoryList;
        }
      }

      // Update state once to prevent multiple re-renders
      console.log(tempSelectedCategory, "tempSelectedCategory");
      console.log(tempCategories, "tempCategories");
      setSelectedCategory(tempSelectedCategory);
      setCategories((prev) => ({ ...prev, ...tempCategories }));
    };

    fetchCategoriesFromPath();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Category </Text>
      {renderDropdowns({
        categories,
        setSelectedCategory,
        selectedCategory,
        companyId,
        setCategories,
        categoryPathSelected,
      })}
      {isCategorySelected &&
        (allowAddWhenLastKeyHasValue || lastKeySelected) && (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              gap: 10,
              alignItems: "center",
              marginTop: 15,
            }}
            onPress={() =>
              addSubCategoryFromLastSelected(
                selectedCategory,
                companyId,
                setSelectedCategory,
                categories,
                setCategories
              )
            }
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

export default React.memo(Category);
