import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import DetailsHeader from "@/components/screens/depenseapport/details/DetailsHeader";
import Amount from "@/components/screens/depenseapport/details/Amount";
import DatePickerInput from "@/components/screens/depenseapport/details/DatePickerInput";
import Category from "@/components/screens/depenseapport/details/Category";
import firestore from "@react-native-firebase/firestore";
import { category } from "@/types/category";
import ButtonGroup from "@/components/screens/depenseapport/details/ButtonGroupt";
import { DepenseApportInterface } from "@/types/depenseapport";
import Description from "@/components/screens/depenseapport/details/Description";

const Details = () => {
  const data = useLocalSearchParams();
  const dataFromDetails = data?.data
    ? typeof data?.data === "string"
      ? (JSON.parse(data?.data) as DepenseApportInterface)
      : null
    : null;
  const categoryPathSelected =
    dataFromDetails?.categoryPath as DepenseApportInterface["categoryPath"];
  const accountPathSelected =
    dataFromDetails?.accountPath as DepenseApportInterface["accountPath"];
  const type = dataFromDetails?.type || (data?.type as string);
  const companyId = data?.companyId as string;
  const [amount, setAmount] = useState<DepenseApportInterface["amount"]>(
    dataFromDetails?.amount || ""
  );
  const [selectedDate, setSelectedDate] = useState<Date>(
    dataFromDetails?.date
      ? new Date(dataFromDetails.date.seconds * 1000)
      : new Date()
  );
  const [categories, setCategories] = useState<any>([]);
  const [accountCategories, setAccountCategories] = useState<any>([]);
  const [selectedCategory, setSetselectedCategory] = useState<{
    [key: string]: category[];
  }>({} as { [key: string]: category[] });
  const [selectedAccountCategory, setSelectedAccountCategory] = useState<{
    [key: string]: category[];
  }>({} as { [key: string]: category[] });
  const [selectedAccounts, setSelectedAccounts] = useState<{
    [key: string]: category[];
  }>({} as { [key: string]: category[] });
  const [description, setDescription] = useState<
    DepenseApportInterface["description"]
  >(dataFromDetails?.description || "");

  const saveCategoryPathToFirestore = async (
    categoryPath: string[],
    companyId: string,
    collectionName: string
  ) => {
    let parentId = null; // Root categories will have `null` as `parentId`
    let lastCategoryId = null;
    let categoryPathIds = []; // This will store the IDs of each category in the path

    for (const category of categoryPath) {
      if (!category) continue;

      if (category.length === 20) {
        // Likely an existing Firestore document ID (Firestore IDs are usually 20 characters)
        lastCategoryId = category;
        parentId = category; // Move to the next category in the hierarchy
      } else {
        // This is a new category (since it doesn't have an ID)
        try {
          const newCategoryRef = await firestore()
            .collection("Company")
            .doc(companyId)
            .collection(collectionName)
            .add({
              category: category, // The category name
              parentId: parentId, // Link to the parent category
            });

          lastCategoryId = newCategoryRef.id;
          parentId = lastCategoryId; // Set parentId for next category in the path
        } catch (error) {
          return null;
        }
      }

      // Add the category ID to the path
      categoryPathIds.push(lastCategoryId);
    }

    return categoryPathIds; // Return the array with all category IDs in the path
  };

  const saveDepense = async () => {
    if (Object.keys(selectedCategory).length === 0) return;

    // Get all selected categories in order
    const categoryPath = Object.keys(selectedCategory)
      .sort(
        (a, b) =>
          parseInt(a.replace("dropdown", "")) -
          parseInt(b.replace("dropdown", ""))
      )
      .map((key) => {
        const categoryItem = selectedCategory[key][0]; // Get first selected category
        return categoryItem.id ? categoryItem.id : categoryItem.category; // Use id if exists, otherwise use category name
      });

    const newCategoryPath = await saveCategoryPathToFirestore(
      categoryPath,
      companyId,
      "category"
    );

    console.log(selectedAccountCategory, "selecteeeeeed");
    const accountCategoryPath = Object.keys(selectedAccountCategory)
      .sort(
        (a, b) =>
          parseInt(a.replace("dropdown", "")) -
          parseInt(b.replace("dropdown", ""))
      )
      .map((key) => {
        const categoryItem = selectedAccountCategory[key][0]; // Get first selected category
        return categoryItem.id ? categoryItem.id : categoryItem.category; // Use id if exists, otherwise use category name
      });
    const newAccountCategoryPath = await saveCategoryPathToFirestore(
      accountCategoryPath,
      companyId,
      "account"
    );

    const depenseData = {
      amount: amount,
      date: selectedDate,
      categoryPath: newCategoryPath,
      accountPath: newAccountCategoryPath,
      type: type,
      description: description,
    };

    try {
      await firestore()
        .collection("Company")
        .doc(companyId)
        .collection("depsneapport")
        .add(depenseData);
    } catch (error) {}
  };

  // useEffect(() => {
  //   // if (dataFromDetails?.date?.seconds) {
  //   //   const formattedDate = new Date(dataFromDetails.date.seconds * 1000);
  //   //   // Prevent setting state if the date is the same
  //   //   if (selectedDate.getTime() !== formattedDate.getTime()) {
  //   //     setSelectedDate(formattedDate);
  //   //   }
  //   // }
  //   // if (dataFromDetails?.amount) {
  //   //   setAmount(dataFromDetails?.amount);
  //   // }
  //   // if (dataFromDetails?.description) {
  //   //   setDescription(dataFromDetails?.description);
  //   // }
  // }, [dataFromDetails]); // Only re-run when `dataFromDetails` changes

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent} // Add this
      keyboardShouldPersistTaps="handled"
    >
      <DetailsHeader type={type} />
      <View style={styles.subcontainer}>
        <Amount amount={amount} setAmount={setAmount} type={type} />
        <DatePickerInput
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />

        {/* category selection */}
        <Category
          categoryPathSelected={categoryPathSelected}
          companyId={companyId}
          displayBy="category"
          collectionName="category"
          headerlabel="Category"
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSetselectedCategory}
          setCategories={setCategories}
          dataFromDetails={dataFromDetails}
        />

        {/*  description */}
        <Description
          description={description}
          setDescription={setDescription}
        />
        {/* save and delet button flex row  */}
        {/* accout category */}
        <Category
          categoryPathSelected={accountPathSelected}
          companyId={companyId}
          displayBy="category"
          collectionName="account"
          headerlabel="Account"
          categories={accountCategories}
          selectedCategory={selectedAccountCategory}
          setSelectedCategory={setSelectedAccountCategory}
          setCategories={setAccountCategories}
          dataFromDetails={dataFromDetails}
        />
        <ButtonGroup
          onDelete={() => console.log("delete")}
          onSave={saveDepense}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    flexGrow: 1, // Ensure content takes up available space
  },
  subcontainer: {
    gap: 20,
    padding: 30,
  },
});

export default Details;
