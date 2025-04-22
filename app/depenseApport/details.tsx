import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import DetailsHeader from "@/components/screens/depenseapport/details/DetailsHeader";
import Amount from "@/components/screens/depenseapport/details/Amount";
import DatePickerInput from "@/components/screens/depenseapport/details/DatePickerInput";
import Category from "@/components/screens/depenseapport/details/Category";
import firestore from "@react-native-firebase/firestore";
import { category } from "@/types/category";
import ButtonGroup from "@/components/screens/depenseapport/details/ButtonGroupt";
import { DepenseApportInterface } from "@/types/depenseapport";
import Description from "@/components/screens/depenseapport/details/Description";
import Financial from "@/components/screens/depenseapport/details/financial/Financial";
import FinancialParent from "@/components/screens/depenseapport/details/financial/FinancialParent";
import { saveCategoryPathToFirestore } from "@/utils/savePathTiFireStore";
import { extractCategoryPath } from "@/utils/extractPathFromSelected";
import Media from "@/components/screens/depenseapport/details/media/Media";
import storage from "@react-native-firebase/storage";

const Details = () => {
  const uploadFile = async (file) => {
    const fileName = file.name || `file-${Date.now()}`;
    const contentType =
      file.mimeType ||
      getMimeTypeFromName(file.name) ||
      "application/octet-stream";
    const path = `uploads/${fileName}`;

    const uploadUri =
      Platform.OS === "ios" ? file.uri.replace("file://", "") : file.uri;
    const reference = storage().ref(path);

    const task = reference.putFile(uploadUri, { contentType });

    return new Promise((resolve, reject) => {
      task.on("state_changed", (snapshot) => {
        console.log(
          `Uploading ${fileName}: ${snapshot.bytesTransferred} / ${snapshot.totalBytes}`
        );
      });

      task
        .then(async () => {
          const downloadURL = await reference.getDownloadURL();
          resolve({ ...file, downloadURL });
        })
        .catch(reject);
    });
  };

  const getMimeTypeFromName = (fileName) => {
    if (!fileName) return null;
    if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg"))
      return "image/jpeg";
    if (fileName.endsWith(".png")) return "image/png";
    if (fileName.endsWith(".pdf")) return "application/pdf";
    if (fileName.endsWith(".mp4")) return "video/mp4";
    return null;
  };
  const uploadAllFiles = async (files) => {
    try {
      const uploaded = await Promise.all(files.map(uploadFile));
      console.log("All uploaded:", uploaded);
      return uploaded; // Array with download URLs
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

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

  const [financeIds, setFinanceIds] = useState<
    DepenseApportInterface["finance"]
  >(dataFromDetails?.finance || []);

  const financeData = dataFromDetails?.finance as any[];
  const financeDebits = dataFromDetails?.financeDebits as any[];
  const [getAllFinanceData, setGetAllFinanceData] = useState<
    { financePath?: string[]; financeAmount?: number }[]
  >([]);

  //debitfinance
  const [getAllFinanceDataDebit, setGetAllFinanceDataDebit] = useState<
    { financePath?: string[]; financeAmount?: number }[]
  >([]);
  const [loadingSaving, setLoadingSaving] = useState(false);
  const [iamgesSelected, setImagesSelected] = useState<any>(null);

  const saveDepense = async () => {
    try {
      // if (Object.keys(selectedCategory).length === 0) return;

      // Get all selected categories in order
      console.log(selectedCategory, " selectedCategory");
      const categoryPath = extractCategoryPath(selectedCategory);

      const newCategoryPath = await saveCategoryPathToFirestore(
        categoryPath,
        companyId,
        "category"
      );

      const accountCategoryPath = extractCategoryPath(selectedAccountCategory);
      const newAccountCategoryPath = await saveCategoryPathToFirestore(
        accountCategoryPath,
        companyId,
        "account"
      );

      const credits = {} as any;
      for (const [index, item] of getAllFinanceData.entries()) {
        if (item?.financePath) {
          const financePath = item?.financePath;
          const newFinancePath = await saveCategoryPathToFirestore(
            financePath,
            companyId,
            "debitcredit"
          );
          credits[index] = {
            financeAmount: item.financeAmount || 0,
            financePath: newFinancePath || [],
          };
        } else {
          console.warn(
            `Skipping finance data at index ${index} due to missing selectedCategory`
          );
        }
      }

      const debits = {} as any;
      for (const [index, item] of getAllFinanceDataDebit.entries()) {
        if (item?.financePath) {
          const financePath = item?.financePath;
          const newFinancePath = await saveCategoryPathToFirestore(
            financePath,
            companyId,
            "debitcredit"
          );
          debits[index] = {
            financeAmount: item.financeAmount || 0,
            financePath: newFinancePath || [],
          };
        } else {
          console.warn(
            `Skipping finance data at index ${index} due to missing selectedCategory`
          );
        }
      }
      // Combine credits and debits into a single object

      if (iamgesSelected) {
        const uploadedItems = await uploadAllFiles(iamgesSelected);
        console.log("Uploaded Files:", uploadedItems);
      }

      const depenseData = {
        amount: amount,
        date: selectedDate,
        categoryPath: newCategoryPath,
        accountPath: newAccountCategoryPath,
        firstCategory: selectedCategory?.dropdown1?.[0]?.category,
        finance: credits,
        createdAt: new Date(),
        updatedAt: new Date(),
        financeDebits: debits,
        type: type,
        description: description,
      };

      try {
        setLoadingSaving(true);

        if (dataFromDetails?.id) {
          // Update existing document
          await firestore()
            .collection("Company")
            .doc(companyId)
            .collection("depsneapport")
            .doc(dataFromDetails?.id || "")
            .update({
              ...depenseData,
              updatedAt: new Date(),
            });
        } else {
          // Add new document
          await firestore()
            .collection("Company")
            .doc(companyId)
            .collection("depsneapport")
            .add(depenseData);
        }
      } catch (error) {
        console.log("Error saving data:", error);
      } finally {
        // Navigate to home
        router.back();

        setLoadingSaving(false);
      }
    } catch (err) {
      console.log("Error saving data:", err);
    }
  };

  const deleteDepense = async () => {
    try {
      setLoadingSaving(true);
      await firestore()
        .collection("Company")
        .doc(companyId)
        .collection("depsneapport")
        .doc(dataFromDetails?.id || "")
        .delete();
    } catch (error) {
      console.log("Error deleting data:", error);
    } finally {
      setLoadingSaving(false);
      router.back();
    }
  };

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
        {type === "depense" && (
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
        )}

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

        <Text style={styles.label}>Finance</Text>

        <FinancialParent
          name="Crédit"
          financeData={financeData}
          setFinanceIds={setFinanceIds}
          companyId={companyId}
          dataFromDetails={dataFromDetails}
          getAllFinanceData={getAllFinanceData}
          setGetAllFinanceData={setGetAllFinanceData}
        />

        {/* debit */}
        <FinancialParent
          name="Débit"
          financeData={financeDebits}
          setFinanceIds={setFinanceIds}
          companyId={companyId}
          dataFromDetails={dataFromDetails}
          getAllFinanceData={getAllFinanceDataDebit}
          setGetAllFinanceData={setGetAllFinanceDataDebit}
        />

        <Media
          iamgesSelected={iamgesSelected}
          setImagesSelected={setImagesSelected}
        />

        {loadingSaving ? (
          <ActivityIndicator
            size="large"
            color="#000000"
            style={{ marginTop: 20 }}
          />
        ) : (
          <ButtonGroup
            dataFromDetails={dataFromDetails}
            onSave={saveDepense}
            onDelete={deleteDepense}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
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
