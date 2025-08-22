import { StyleSheet, View } from "react-native";

export function PlaceholderItem() {
  return <View style={styles.placeholderItem} />;
}

const styles = StyleSheet.create({
  placeholderItem: {
    width: 100,
    height: 100,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginRight: 8
  }
});
