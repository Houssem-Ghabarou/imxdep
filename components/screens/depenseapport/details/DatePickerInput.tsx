import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePickerModal from "react-native-date-picker";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons"; // For calendar icon
//@ts-ignore
import DatePickerIcon from "@/assets/images/datepickericon.svg";
interface DatePickerInputProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
        <Text style={styles.dateText}>
          {format(selectedDate, "dd MMMM yyyy")}{" "}
          {/* Example: 25 November 2024 */}
        </Text>
        <DatePickerIcon width={60} height={60} />
      </TouchableOpacity>

      {/* Date Picker Modal */}
      <DateTimePickerModal
        modal
        open={open}
        date={selectedDate}
        mode="date"
        onConfirm={(date: Date) => {
          setOpen(false);
          setSelectedDate(date);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    padding: 1,
    paddingHorizontal: 20,
  },
  dateText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DatePickerInput;
