import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Company } from "@/types/company";
import { Route, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";

type CompanyRoute = Company & Route;

const DepenseApport = () => {
  const { id, companyName } = useLocalSearchParams<CompanyRoute>();
  const [depenseApport, setDepenseApport] = useState<any>(null);

  const getCompanyData = async (companyId: string) => {
    console.log("Fetching data for company ID:", companyId);

    const depenseApportCollection = firestore()
      .collection("Company")
      .doc(companyId)
      .collection("depsneapport");

    const depenseApportSnapshot = await depenseApportCollection.get();

    if (!depenseApportSnapshot.empty) {
      const depenseData = depenseApportSnapshot.docs.map((doc) => doc.data());
      setDepenseApport(depenseData);
      console.log("Depense data:", depenseData);
    } else {
      console.log("No data found in the 'depsneapport' sub-collection.");
    }
  };

  useEffect(() => {
    if (id) {
      getCompanyData(id);
    }
  }, [id]);

  return (
    <View>
      <Text>{companyName}</Text>
      {depenseApport ? (
        <View>
          {/* Render depenseApport data */}
          {depenseApport.map((item, index) => (
            <Text key={index}>{JSON.stringify(item)}</Text> // Example rendering
          ))}
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default DepenseApport;
