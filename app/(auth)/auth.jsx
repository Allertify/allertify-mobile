import { ScrollView, StyleSheet, View, Text } from "react-native";

import { HorizontalList } from "@/components/HorizontalList";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";

export default function AuthScreen() {
  return <ScrollView style={styles.container} showsVerticalScrollIndicator={false}></ScrollView>;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7ECFF",
    padding: 0,
    margin: 0
  },

  title: {
    fontSize: 50,
    textAlign: "center",
    marginBottom: 0,
    fontWeight: "bold"
  }
});
