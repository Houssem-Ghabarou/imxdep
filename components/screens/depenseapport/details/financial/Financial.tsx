import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import Category from "../Category";
import { DepenseApportInterface, finance } from "@/types/depenseapport";
import { category } from "@/types/category";
import { Ionicons } from "@expo/vector-icons";
import { extractCategoryPath } from "@/utils/extractPathFromSelected";
import { saveCategoryPathToFirestore } from "@/utils/savePathTiFireStore";

interface financialProps {
  companyId: string;

  dataFromDetails?: DepenseApportInterface | null;
  setFinanceIds: React.Dispatch<
    React.SetStateAction<DepenseApportInterface["finance"]>
  >;

  getAllFinanceData?: any;
  setGetAllFinanceData?: React.Dispatch<React.SetStateAction<any>>;
  financialNumber: number;
  financialPathSelected: string[];
  amountFinance: string;
  name: string;
}

const Financial = ({
  companyId,
  dataFromDetails,
  setFinanceIds,
  getAllFinanceData,
  setGetAllFinanceData,
  financialNumber,
  financialPathSelected,
  amountFinance,
  name,
}: financialProps) => {
  const financialIds = dataFromDetails?.finance as string[];

  const [financeCategories, setFinanceCategories] = useState<any>([]);
  const [selectedFinanceCategory, setSelectedFinanceCategory] = useState<{
    [key: string]: category[];
  }>({} as { [key: string]: category[] });
  const [amoutFinance, setAmoutFinance] = useState<finance["financeAmount"]>(
    amountFinance || ""
  );

  useEffect(() => {
    const categoryPath = extractCategoryPath(selectedFinanceCategory);

    if (categoryPath.length === 2 && setGetAllFinanceData) {
      setGetAllFinanceData((prevData: any) => {
        const updatedData = [...prevData];
        updatedData[financialNumber] = {
          financeAmount: amoutFinance,
          financePath: categoryPath,
        };
        return updatedData;
      });
    }
  }, [selectedFinanceCategory, amoutFinance]);

  return (
    <View style={styles.container}>
      <Category
        fixedCategories={2}
        categoryPathSelected={financialPathSelected}
        companyId={companyId}
        displayBy="category"
        collectionName="debitcredit"
        headerlabel={name}
        categories={financeCategories}
        selectedCategory={selectedFinanceCategory}
        setSelectedCategory={setSelectedFinanceCategory}
        setCategories={setFinanceCategories}
        dataFromDetails={dataFromDetails}
      />

      {/* amount finance */}
      <TextInput
        style={[styles.input]}
        value={amoutFinance}
        onChangeText={(text) => {
          setAmoutFinance(text);
        }}
        multiline={true} // Allow multiline input
        textAlignVertical="top" // Align text to the top
      />

      {/* <Button title="Save" onPress={saveFinance} /> */}
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
