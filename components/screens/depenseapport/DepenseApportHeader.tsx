import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
interface headerProps {
  companyName: string;
}
const DepenseApportHeader = ({ companyName }: headerProps) => {
  const router = useRouter();

  const gotoChooseCompany = () => {
    router.back();
    // router.push({
    //   pathname: "/choosecompany",
    // });
  };
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text style={{ fontWeight: 700, fontSize: 20, color: "#000000" }}>
        {companyName}
      </Text>
      <TouchableOpacity onPress={gotoChooseCompany}>
        <Text style={{ fontWeight: 400, fontSize: 15, color: "#6D6D6D" }}>
          Modifier la société
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DepenseApportHeader;
