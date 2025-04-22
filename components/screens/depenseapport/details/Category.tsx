import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchableDropdown from "@/components/shared/SearchableDropDown";
import { Ionicons } from "@expo/vector-icons";
import { category } from "@/types/category";
import firestore from "@react-native-firebase/firestore";
import { DepenseApportInterface } from "@/types/depenseapport";
interface CategoryProps {
  categories: { [key: string]: category[] };
  selectedCategory: { [key: string]: category[] };
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<{ [key: string]: category[] }>
  >;
  companyId: string;
  setCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: category[] }>
  >;
  categoryPathSelected: DepenseApportInterface["categoryPath"];
  loadingGetingCategories?: boolean;
  dataFromDetails?: any;
  displayBy: string;
  collectionName: string;
  headerlabel?: string;
  fixedCategories?: number;
}

const addSubCategoryFromLastSelected = (
  selectedCategory: CategoryProps["selectedCategory"],
  companyId: CategoryProps["companyId"],
  setSelectedCategory: CategoryProps["setSelectedCategory"],
  categories: CategoryProps["categories"],
  setCategories: React.Dispatch<
    React.SetStateAction<{ [key: string]: category[] }>
  >,
  collectionName: CategoryProps["collectionName"],
  fixedCategories?: CategoryProps["fixedCategories"]
) => {
  ///calling firestore to fetch the category collection of the last selected category
  const fetchSubCategories = async () => {
    try {
      const selectedCategoryKeys = Object.keys(selectedCategory);
      if (selectedCategoryKeys.length === 0) {
        return;
      }

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
        .collection(collectionName)
        .where("parentId", "==", parentId)
        .get();

      const subCategoryList: category[] = subCategories.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as category)
      );

      if (!fixedCategories) {
        const nextDropdownKey = `dropdown${Object.keys(categories).length + 1}`;

        setCategories((prev) => ({
          ...prev,
          [nextDropdownKey]: subCategoryList,
        }));
      } else {
        //this is for fixed categories , it will add the next dropdown only if the last selected category has subcategories
        const dropdownKeys = Object.keys(categories);
        const nextDropdownIndex = dropdownKeys.findIndex(
          (key) => !selectedCategory[key]?.length
        );

        if (nextDropdownIndex !== -1) {
          const nextDropdownKey = dropdownKeys[nextDropdownIndex];
          setCategories((prev) => ({
            ...prev,
            [nextDropdownKey]: subCategoryList,
          }));
        }
      }
    } catch (error) {}
  };

  fetchSubCategories();
};

const renderDropdowns = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  setCategories,
  categoryPathSelected,
  loadingGetingCategories,
  collectionName,
  displayBy,
  fixedCategories,
  companyId,
}: CategoryProps) => {
  const setSelectedCategoryByDropdown = (
    item: category,
    dropdownKey: string
  ) => {
    let newSelected = {
      ...selectedCategory,
      [dropdownKey]: [item],
    };
    setSelectedCategory((prevSelected) => {
      // Merge previous selected category with the new selected category
      newSelected = {
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

    if (!fixedCategories) {
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
    } else {
      // Ensure only the first dropdown is considered as the last selected
      const dropdownKeys = Object.keys(categories);
      for (let i = 1; i < dropdownKeys.length; i++) {
        setCategories((prev) => ({
          ...prev,
          [dropdownKeys[i]]: [],
        }));
      }

      addSubCategoryFromLastSelected(
        { dropdown1: newSelected["dropdown1"] }, // Always pass the first dropdown as the last selected
        companyId,
        setSelectedCategory,
        categories,
        setCategories,
        collectionName,
        fixedCategories
      );
    }
  };

  if (loadingGetingCategories) {
    return <ActivityIndicator size="small" color="#000000" />;
  }

  if (Object.keys(categories).length === 0) {
    //render empty dropdown
    return (
      <SearchableDropdown
        items={[]}
        value={""}
        setSelectedCategory={setSelectedCategory}
        onSelect={(item) => setSelectedCategoryByDropdown(item, "dropdown1")}
        displayBy={displayBy}
        placeholder={`Search in ${displayBy} `}
      />
    );
  }

  //fixed categoris

  if (fixedCategories) {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {Object.keys(categories)
          .slice(0, fixedCategories)
          .map((key) => (
            <View key={`${key}-${categories[key].length}`} style={{ flex: 1 }}>
              <SearchableDropdown
                items={categories[key]}
                value={selectedCategory[key]?.[0]?.category}
                setSelectedCategory={setSelectedCategory}
                onSelect={(item) => setSelectedCategoryByDropdown(item, key)}
                displayBy={displayBy}
                placeholder={`Search in category `}
              />
            </View>
          ))}
      </View>
    );
  }

  return Object.keys(categories).map((key, index) => {
    return (
      <View key={`${key}-${categories[key].length}`}>
        <SearchableDropdown
          items={categories[key]}
          value={selectedCategory[key]?.[0]?.category}
          setSelectedCategory={setSelectedCategory}
          onSelect={(item) => setSelectedCategoryByDropdown(item, key)}
          displayBy={displayBy}
          placeholder={`Search in category `}
        />
        {/* vertical line on left */}
        {index < Object.keys(categories).length - 1 && (
          <View
            style={{
              height: 23,
              width: 2,
              backgroundColor: "#989898",
            }}
          />
        )}
      </View>
    );
  });
};

const Category = ({
  categories,
  setSelectedCategory,
  selectedCategory,
  companyId,
  setCategories,
  categoryPathSelected,
  dataFromDetails,
  displayBy,
  collectionName,
  headerlabel = "Category",
  fixedCategories,
}: CategoryProps) => {
  const [loadingGetingCategories, setLoadingGetingCategories] =
    useState<boolean>(true);
  const isCategorySelected =
    Object.keys(selectedCategory).length > 0 ? true : false;

  // Get all keys
  const keys = Object.keys(categories);

  // Get the last key
  const lastKey = keys?.[keys?.length - 1];

  // Get the length of the values array for the last key
  const lastKeyLength = categories?.[lastKey]?.length;

  const allowAdd =
    Object.keys(selectedCategory)?.length === Object.keys(categories)?.length;
  const allowAddWhenLastKeyHasValue = lastKeyLength > 0;
  const lastKeySelected = selectedCategory[lastKey]?.length > 0;

  // Initialize categories arrayy with fixed categories count
  useEffect(() => {
    if (!fixedCategories) {
      setCategories({});
    }
  }, [fixedCategories, setCategories]);

  const getCompanyCategories = async (companyId: string) => {
    try {
      const rootCategoriesSnapshot = await firestore()
        .collection("Company")
        .doc(companyId)
        .collection(collectionName)
        .where("parentId", "==", null) // Fetch only root categories
        .get();

      // If no categories exist, exit early
      if (rootCategoriesSnapshot.empty) {
        setCategories({ dropdown1: [] }); // Ensure the first dropdown is always set
        if (!dataFromDetails) setLoadingGetingCategories(false);
        return;
      }

      const fetchedCategories = rootCategoriesSnapshot.docs.map((doc) => ({
        id: doc.id,
        category: doc.data().category,
      }));

      setCategories({
        dropdown1: fetchedCategories, // Always set the first dropdown
      });

      if (fixedCategories) {
        //conitnue generating empty dropdowns
        for (let i = 2; i <= fixedCategories; i++) {
          setCategories((prev) => ({
            ...prev,
            [`dropdown${i}`]: [],
          }));
        }
      }
    } catch (err) {
    } finally {
      if (!dataFromDetails) setLoadingGetingCategories(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      getCompanyCategories(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    if (!categoryPathSelected || categoryPathSelected.length === 0) {
      setLoadingGetingCategories(false);
      return;
    }

    setLoadingGetingCategories(true);

    const fetchCategoriesFromPath = async () => {
      try {
        let tempSelectedCategory: { [key: string]: category[] } = {};
        let tempCategories: { [key: string]: category[] } = {};

        for (let i = 0; i < categoryPathSelected.length; i++) {
          const categoryId = categoryPathSelected[i];
          const dropdownKey = `dropdown${i + 1}`;

          // Fetch category data
          const categoryDoc = await firestore()
            .collection("Company")
            .doc(companyId)
            .collection(collectionName)
            .doc(categoryId)
            .get();

          if (!categoryDoc.exists) break;

          tempSelectedCategory[dropdownKey] = [
            { ...categoryDoc.data(), id: categoryDoc.id } as category,
          ];

          // Fetch subcategories for the next dropdown (if applicable)
          if (i < categoryPathSelected.length - 1) {
            const subCategorySnapshot = await firestore()
              .collection("Company")
              .doc(companyId)
              .collection(collectionName)
              .where("parentId", "==", categoryId)
              .get();

            if (!subCategorySnapshot.empty) {
              tempCategories[`dropdown${i + 2}`] = subCategorySnapshot.docs.map(
                (doc) => ({ ...doc.data(), id: doc.id } as category)
              );
            }
          }
        }

        // Batch update state once at the end
        setSelectedCategory(tempSelectedCategory);
        setCategories((prev) => ({ ...prev, ...tempCategories }));
      } catch (error) {
        console.error("Error fetchsinsg categories fsrom path:", error);
      } finally {
        setLoadingGetingCategories(false);
      }
    };

    fetchCategoriesFromPath();

    // // Cleanup function to reset state on unmount
    // return () => {
    //   setSelectedCategory({});
    //   setCategories({});
    // };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{headerlabel} </Text>
      {renderDropdowns({
        categories,
        setSelectedCategory,
        selectedCategory,
        companyId,
        setCategories,
        categoryPathSelected,
        loadingGetingCategories,
        collectionName,
        displayBy,
        fixedCategories,
      })}
      {isCategorySelected &&
        (allowAddWhenLastKeyHasValue || lastKeySelected) &&
        !fixedCategories && (
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
                setCategories,
                collectionName
              )
            }
          >
            <View style={styles.button}>
              <Ionicons name="add" size={20} color="#000000" />
            </View>
            <Text style={{ fontSize: 15, color: "#9A9A9A" }}>
              {`Add ${collectionName}`}
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
