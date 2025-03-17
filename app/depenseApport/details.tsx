import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import DetailsHeader from "@/components/screens/depenseapport/details/DetailsHeader";
import Amount from "@/components/screens/depenseapport/details/Amount";
import DatePickerInput from "@/components/screens/depenseapport/details/DatePickerInput";
import Category from "@/components/screens/depenseapport/details/Category";
import firestore from "@react-native-firebase/firestore";
import { category } from "@/types/category";

interface CategoryState {
  [key: string]: category[];
}
const Details = () => {
  const data = useLocalSearchParams();
  const type = data?.type as string;
  const companyId = data?.companyId as string;
  const [amount, setAmount] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [categories, setCategories] = useState<category[]>([]);
  const [loadingGetingCategories, setLoadingGetingCategories] = useState(true);

  console.log(categories, "categories");
  const [selectedCategory, setSetselectedCategory] = useState<category>(
    {} as category
  );

  const getCompanyCategories = async (companyId: string) => {
    try {
      const depenseApportCollection = firestore()
        .collection("Company")
        .doc(companyId)
        .collection("category");
      const categories = await depenseApportCollection.get();
      if (!categories.empty) {
        const categoryData = categories.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as category[];
        setCategories(categoryData);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingGetingCategories(false);
    }
  };

  useEffect(() => {
    if (companyId) {
      getCompanyCategories(companyId);
    }
  }, [companyId]);

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
        {loadingGetingCategories ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Category
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSetselectedCategory}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
