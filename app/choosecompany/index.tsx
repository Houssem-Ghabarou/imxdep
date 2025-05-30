import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import SearchableDropdown from "@/components/shared/SearchableDropDown";
import CustomButton from "@/components/shared/CustomButton";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";
import { Company } from "@/types/company";
import Toast from "react-native-toast-message";
import { useIsFocused } from "@react-navigation/native";
const ChooseCompany = () => {
  const isFocused = useIsFocused();
  const router = useRouter();
  const [selectedCompany, setSelectedCompany] = useState<Company>();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const getCompanies = async () => {
    const companiesCollection = firestore().collection("Company");
    const companies = await companiesCollection.get();
    const companyData = companies.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Company & { id: string })
    );
    setCompanies(companyData);
    setLoading(false);
  };

  useEffect(() => {
    if (isFocused) {
      getCompanies();
    }
  }, [isFocused]);

  const navigateToDepenseApport = () => {
    if (!selectedCompany) {
      Toast.show({
        type: "error",
        text1: "Sélectionnez une entreprise",
      });
      return;
    }
    router.push({
      pathname: "/depenseApport/[id]",
      params: {
        id: selectedCompany?.id ?? "",
        companyName: selectedCompany?.companyName,
      },
    });
  };
  const createAndNavigateToDepenseApport = async () => {
    if (selectedCompany?.companyName === "" || !selectedCompany) {
      Toast.show({
        type: "error",
        text1: "Sélectionnez une entreprise",
      });
      return;
    }

    try {
      const companiesCollection = firestore().collection("Company");
      const existingCompanyQuery = await companiesCollection
        .where("companyName", "==", selectedCompany.companyName)
        .get();

      if (!existingCompanyQuery.empty) {
        // If a company with the same name exists, get its ID and navigate
        const existingCompany = existingCompanyQuery.docs[0];
        router.push({
          pathname: "/depenseApport/[id]",
          params: {
            id: existingCompany.id,
            companyName: existingCompany.data().companyName,
          },
        });
      } else if (!selectedCompany?.id) {
        // If no company exists and no ID is provided, create a new company
        const newCompany = {
          companyName: selectedCompany?.companyName || "New Company",
          createdAt: firestore.FieldValue.serverTimestamp(),
        };
        const companyRef = await companiesCollection.add(newCompany);
        const newCompanyId = companyRef.id;

        router.push({
          pathname: "/depenseApport/[id]",
          params: {
            id: newCompanyId,
            companyName: newCompany.companyName,
          },
        });
      } else {
        // If the company already has an ID, navigate directly
        navigateToDepenseApport();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erreur lors de la gestion de l'entreprise",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Choose company</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#21A67C" />
      ) : (
        <>
          <SearchableDropdown
            items={companies}
            placeholder="Search company..."
            onSelect={(item) => setSelectedCompany(item as Company)}
            displayBy="companyName"
            height={60}
          />

          <CustomButton
            title="Continue"
            onPressFunction={createAndNavigateToDepenseApport}
            height={60}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    gap: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
});

export default ChooseCompany;
