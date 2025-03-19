import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Company } from "@/types/company";
import { Route, useLocalSearchParams } from "expo-router";
import firestore from "@react-native-firebase/firestore";
import DepenseApportHeader from "@/components/screens/depenseapport/DepenseApportHeader";
import InputSearch from "@/components/shared/InputSearch";
import DepenseApportFooter from "@/components/screens/depenseapport/DepenseApportFooter";
import { DepenseApportInterface } from "@/types/depenseapport";
import { useRouter } from "expo-router";
type CompanyRoute = Company & Route;

const DepenseApport = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { id, companyName } = useLocalSearchParams<CompanyRoute>();
  const [depenseApport, setDepenseApport] = useState<DepenseApportInterface[]>(
    []
  );

  const getCompanyData = async (companyId: string) => {
    const depenseApportCollection = firestore()
      .collection("Company")
      .doc(companyId)
      .collection("depsneapport");

    const depenseApportSnapshot = await depenseApportCollection.get();

    if (!depenseApportSnapshot.empty) {
      const depenseData = depenseApportSnapshot.docs.map((doc) =>
        doc.data()
      ) as DepenseApportInterface[];

      setDepenseApport(depenseData);
    } else {
      setDepenseApport([]);
    }
  };

  useEffect(() => {
    if (id) {
      getCompanyData(id);
    }
  }, [id]);

  const navigateToDepenseApportDetails = (
    depenseorapport: DepenseApportInterface
  ) => {
    router.push({
      pathname: "/depenseApport/details",
      params: {
        data: JSON.stringify(depenseorapport),
        companyId: id,
      },
    });
  };

  const RenderDepenseApport = (item: DepenseApportInterface) => {
    const isDepense = item.type === "depense";

    return (
      <TouchableOpacity
        style={{
          borderRadius: 5,
          marginBottom: 15,
          flexDirection: "row",
        }}
        onPress={() => {
          navigateToDepenseApportDetails(item);
        }}
      >
        {/* Left border with centered height */}
        <View
          style={{
            width: 5,
            backgroundColor: isDepense ? "#D72525" : "#21A67C",
            height: "75%", // Adjust height to make it shorter
            marginRight: 10, // Space between left border and content
            alignSelf: "center", // Ensure it's vertically centered
          }}
        />

        {/* Main content */}
        <View style={{ flex: 1, padding: 5 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.kpiheader}>25.11.2024</Text>
            <Text style={styles.kpiheader}>{item.amount}</Text>
            <Text style={styles.kpiheader}>salaire</Text>
          </View>
          {item?.description && (
            <Text style={styles.description}>
              {item?.description?.length > 50
                ? item?.description.substring(0, 50) + "..."
                : item.description}
            </Text>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 10,
            }}
          >
            <View
              style={{
                height: 1,
                flex: 1,
                backgroundColor: "#B1B1B1",
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <DepenseApportHeader
        companyName={Array.isArray(companyName) ? companyName[0] : companyName}
      />
      {/* Input search */}
      <InputSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* FlatList for depenseApport */}
      <FlatList
        data={depenseApport}
        renderItem={({ item }) => <RenderDepenseApport {...item} />}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />

      {/* Footer */}
      <DepenseApportFooter companyId={id} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 30,
    gap: 20,
    justifyContent: "space-between", // Ensures footer stays at bottom
  },
  listContainer: {
    flexGrow: 1, // Makes sure FlatList grows to fill available space
    // paddingBottom: 80, // Adds space for footer
  },
  kpiheader: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000000",
  },
  description: {
    fontSize: 15,
    color: "#000000",
  },
});

export default DepenseApport;
