import { StyleSheet, TextInput } from "react-native";

export function ThemedInput({ style, ...props }) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12
  }
});
