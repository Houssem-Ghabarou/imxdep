import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonGroupProps {
  onDelete: () => void;
  onSave: () => void;
}
const ButtonGroup = ({ onDelete, onSave }: ButtonGroupProps) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={[styles.button, styles.deleteButton]}
        onPress={onDelete}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={onSave}
      >
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1, // Ensures equal width
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#D72525",
  },
  saveButton: {
    backgroundColor: "#21A67C",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default ButtonGroup;
