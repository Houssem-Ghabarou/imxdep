import { View, Text, TextInput, StyleSheet } from "react-native";
import React from "react";
//@ts-ignore
import SearchIcon from "../../assets/images/search.svg";
interface InputSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const InputSearch = ({ searchQuery, setSearchQuery }: InputSearchProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TextInput
        style={styles.input}
        autoCapitalize="none"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={{ position: "absolute", right: 15, top: 15 }}>
        <SearchIcon width={30} height={30} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: "100%",
    height: 66,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 18,
  },
});

export default InputSearch;
