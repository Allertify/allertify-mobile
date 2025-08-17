import { useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { ThemedText } from "@/components/ui/ThemedText";

export default function PasswordScreen() {
  const [oldPassword, onChangeOldPassword] = useState("");
  const [newPassword, onChangeNewPassword] = useState("");

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>Old Password</ThemedText>
      <ThemedInput
        value={oldPassword}
        onChangeText={onChangeOldPassword}
        placeholder="••••••••••••"
        autoComplete="off"
        secureTextEntry
      />
      <ThemedText style={styles.label}>New Password</ThemedText>
      <ThemedInput
        value={newPassword}
        onChangeText={onChangeNewPassword}
        placeholder="••••••••••••"
        autoComplete="off"
        secureTextEntry
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
  },
  label: {
    fontSize: 16
  }
});
