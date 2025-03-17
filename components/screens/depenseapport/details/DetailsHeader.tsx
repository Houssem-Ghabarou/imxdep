import { Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
//@ts-ignore
import CloseIcon from "@/assets/images/close.svg";
import { useRouter } from "expo-router";

interface DetailsHeaderProps {
  type: string;
}

const DetailsHeader = ({ type }: DetailsHeaderProps) => {
  const router = useRouter();

  const backToDepenseApport = () => {
    router.back();
  };
  return (
    <LinearGradient
      style={styles.linearGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={
        type === "depense" ? ["#FFCBCB", "#FFFFFF"] : ["#9FEFD1", "#FFFFFF"]
      }
    >
      <Text style={[styles.title]}>
        {type === "depense" ? "Dépense" : "Apport"}
      </Text>
      <TouchableOpacity onPress={backToDepenseApport}>
        <CloseIcon width={60} height={60} />
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradient: {
    // height: 60,
    paddingLeft: 30,
    paddingRight: 30,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
});
export default DetailsHeader;
