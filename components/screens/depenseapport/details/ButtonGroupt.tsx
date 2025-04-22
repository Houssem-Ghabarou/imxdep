import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ButtonGroupProps {
  onDelete: () => void;
  onSave: () => void;
  dataFromDetails: any; // Replace with the actual type if known
}
const ButtonGroup = ({
  onDelete,
  onSave,
  dataFromDetails,
}: ButtonGroupProps) => {
  return (
    <View style={styles.buttonContainer}>
      {dataFromDetails && (
        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={onDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.saveButton]}
        onPress={onSave}
      >
        <Text style={styles.buttonText}>
          {dataFromDetails ? "Update" : "Save"}
        </Text>
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
