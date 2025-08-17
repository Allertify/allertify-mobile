import { StyleSheet, Text } from "react-native";

export function ThemedText({ style, ...props }) {
  return <Text style={[styles.default, style]} {...props} />;
}

const styles = StyleSheet.create({
  default: {
    fontFamily: "Satoshi-Bold",
  },
});
