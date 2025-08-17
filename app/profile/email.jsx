import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";

export default function EmailScreen() {
  const [email, onChangeEmail] = useState("");

  return (
    <View style={styles.container}>
      <ThemedInput value={email} onChangeText={onChangeEmail} placeholder="m@example.com" autoComplete="email" />
      <ThemedButton label="Save" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16
  }
});
