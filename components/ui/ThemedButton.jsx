import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";

export function ThemedButton({ style, variant = "default", label, ...props }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.default,
        variant === "destructive" ? styles.destructive : undefined,
        pressed && styles.pressed,
        style
      ]}
      {...props}
    >
      <ThemedText style={styles.label}>{label}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  default: {
    backgroundColor: Colors.blue,
    borderRadius: 12,
    padding: 16
  },
  destructive: {
    backgroundColor: Colors.red
  },
  pressed: {
    opacity: 0.8
  },
  label: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  }
});
