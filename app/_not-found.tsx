import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>404 - Not Found</Text>
      <Text style={{ marginTop: 10 }}>Oops! This page doesn't exist.</Text>
    </View>
  );
}
