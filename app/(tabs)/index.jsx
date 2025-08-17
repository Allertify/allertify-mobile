import { StyleSheet, View, ScrollView } from "react-native";

import { HorizontalList } from "@/components/HorizontalList";
import { ThemedLink } from "@/components/ThemedLink";
import { ThemedText } from "@/components/ThemedText";

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.greeting}>👋 Hey, John Doe!</ThemedText>

      <ThemedLink label="Recent Scans" href="/history" />
      <HorizontalList itemCount={9} />

      <ThemedLink label="Red Food List" href="/products" />
      <HorizontalList itemCount={9} />

      <ThemedLink label="Green Food List" href="/products" />
      <HorizontalList itemCount={9} />

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 24,
  },
  greeting: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 32,
  },
  bottomSpacing: {
    height: 100,
  },
});
