import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { DepenseApportInterface } from "@/types/depenseapport";
import Financial from "./Financial";
import { Ionicons } from "@expo/vector-icons";
interface financialProps {
  companyId: string;

  dataFromDetails?: DepenseApportInterface | null;
  setFinanceIds: React.Dispatch<
    React.SetStateAction<DepenseApportInterface["finance"]>
  >;
  getAllFinanceData: any;
  setGetAllFinanceData: React.Dispatch<React.SetStateAction<any>>;
  financeData: any[];
  name: string;
}
const FinancialParent = ({
  companyId,
  dataFromDetails,
  setFinanceIds,
  getAllFinanceData,
  setGetAllFinanceData,
  financeData,
  name,
}: financialProps) => {
  const [financeNumber, setfinanceNumber] = useState(
    financeData && Object.keys(financeData).length > 0
      ? Object.keys(financeData).length
      : 1
  );

  return (
    <View>
      {Array(financeNumber)
        .fill(null)
        .map((_, index) => (
          <View
            key={index}
            style={{
              marginTop: 15,
            }}
          >
            <Financial
              name={name}
              financialPathSelected={financeData?.[index]?.financePath}
              amountFinance={financeData?.[index]?.financeAmount}
              financialNumber={index}
              getAllFinanceData={getAllFinanceData}
              setGetAllFinanceData={setGetAllFinanceData}
              setFinanceIds={setFinanceIds}
              companyId={companyId}
              dataFromDetails={dataFromDetails}
              key={index}
            />
          </View>
        ))}

      <TouchableOpacity
        onPress={() => setfinanceNumber(financeNumber + 1)}
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
        <Text style={{ fontSize: 15, color: "#9A9A9A" }}>{`Add ${name}`}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FinancialParent;
