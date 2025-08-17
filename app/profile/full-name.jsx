import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";

export default function FullNameScreen() {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");

  return (
    <View style={styles.container}>
      <ThemedInput
        value={firstName}
        onChangeText={onChangeFirstName}
        placeholder="First Name"
        autoComplete="given-name"
      />
      <ThemedInput
        value={lastName}
        onChangeText={onChangeLastName}
        placeholder="Last Name"
        autoComplete="family-name"
      />
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
