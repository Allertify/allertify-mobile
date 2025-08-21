import { Alert, StyleSheet, View } from "react-native";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { useSaveProduct } from "@/hooks/useSaveProduct";

export function ProductActions({ style, productId, token }) {
  const { mutate: saveToRed, isPending: isSavingRed } = useSaveProduct(productId, "RED", token);
  const { mutate: saveToGreen, isPending: isSavingGreen } = useSaveProduct(productId, "GREEN", token);

  const onAddRed = () => {
    saveToRed(undefined, {
      onSuccess: (message) => {
        Alert.alert(message || "Product added to red list");
      },
      onError: (err) => {
        Alert.alert("Failed to add to red list", err?.message || "Unknown error");
      }
    });
  };

  const onAddGreen = () => {
    saveToGreen(undefined, {
      onSuccess: (message) => {
        Alert.alert(message || "Product added to green list");
      },
      onError: (err) => {
        Alert.alert("Failed to add to green list", err?.message || "Unknown error");
      }
    });
  };

  return (
    <View style={[styles.floatingActions, style]}>
      <ThemedButton
        style={styles.actionButton}
        variant="destructive"
        label={isSavingRed ? "ADDING..." : "+ RED LIST"}
        onPress={onAddRed}
        disabled={isSavingRed || isSavingGreen}
      />
      <ThemedButton
        style={[styles.actionButton, styles.greenButton]}
        label={isSavingGreen ? "ADDING..." : "+ GREEN LIST"}
        onPress={onAddGreen}
        disabled={isSavingRed || isSavingGreen}
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
