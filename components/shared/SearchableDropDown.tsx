import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
//@ts-ignore
import Dropdownimg from "../../assets/images/dropdown.svg";

interface DropdownProps {
  items?: { [key: string]: any }[] & { [index: string]: any }; // Array of objects
  placeholder?: string;
  onSelect?: (item: any) => void; // Returning the whole object
  height?: number;
  displayBy?: string; // Property to display from each object
}

const mockProps = {
  items: [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Doe" },
    { id: 3, name: "John Smith" },
    { id: 4, name: "Jane Smisth" },
    { id: 4, name: "Jane s" },
    { id: 4, name: "Jane Smxith" },
    { id: 4, name: "Jane Smitah" },
    { id: 4, name: "Jane Smitxh" },
  ],
  placeholder: "Search...",
  onSelect: (item: { [key: string]: any }) => console.log(item),
  height: 60,
  displayBy: "name",
};
const SearchableDropdown: React.FC<DropdownProps> = ({
  items = mockProps.items,
  placeholder = "Search...",
  onSelect = mockProps.onSelect,
  height = mockProps.height,
  displayBy = mockProps.displayBy,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [isDropdownVisible, setDropdownVisible] = useState(false);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setDropdownVisible(true);
    setFilteredItems(
      items.filter((item) =>
        item[displayBy].toLowerCase().includes(text.toLowerCase())
      )
    );
  };

  const handleSelect = (item: { [key: string]: any }) => {
    setSearchText(item[displayBy]); // Set the display value as search text
    setDropdownVisible(false);
    onSelect(item);
  };

  return (
    <View style={[styles.container]}>
      {/* Input Field with Arrow */}
      <TouchableOpacity
        style={[styles.inputContainer, height ? { height } : {}]}
        onPress={() => setDropdownVisible(!isDropdownVisible)}
        activeOpacity={0.7}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={searchText}
          onChangeText={handleSearch}
          onFocus={() => setDropdownVisible(true)}
        />
        <Dropdownimg
          width={20}
          height={20}
          style={{
            transform: [{ rotate: isDropdownVisible ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {/* Dropdown List */}
      {isDropdownVisible && (
        <View style={styles.dropdown}>
          <ScrollView nestedScrollEnabled={true}>
            {(filteredItems.length > 0
              ? filteredItems
              : [{ [displayBy]: searchText }]
            ).map((item: { [key: string]: any }, index: number) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(item)}
                  style={styles.item}
                >
                  <Text>{item[displayBy]}</Text>
                  {!items.some(
                    (obj: { [key: string]: any }) =>
                      obj[displayBy] === item[displayBy]
                  ) && <Ionicons name="add-circle" size={20} color="green" />}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#000000",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#FDFDFD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 150,
    zIndex: 10,
  },
  item: {
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
});

export default SearchableDropdown;
