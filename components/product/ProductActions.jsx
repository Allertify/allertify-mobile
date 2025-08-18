import { StyleSheet, View } from "react-native";
import { ThemedButton } from "@/components/ui/ThemedButton";

export function ProductActions({ style, onAddGreen, onAddRed }) {
  return (
    <View style={[styles.floatingActions, style]}>
      <ThemedButton
        style={styles.actionButton}
        variant="destructive"
        label={"+ RED LIST"}
        onPress={onAddRed || (() => {})}
      />
      <ThemedButton
        style={[styles.actionButton, styles.greenButton]}
        label={"+ GREEN LIST"}
        onPress={onAddGreen || (() => {})}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  floatingActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  actionButton: {
    flex: 1
  },
  greenButton: {
    backgroundColor: "#a6d17d"
  }
});
