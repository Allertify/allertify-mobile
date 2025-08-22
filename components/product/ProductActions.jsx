import { Alert, StyleSheet, View } from "react-native";
import { ThemedButton } from "@/components/ui/ThemedButton";
import { useSaveProduct } from "@/hooks/useSaveProduct";
import { useSaveScan } from "@/hooks/useSaveScan";

export function ProductActions({ style, productId, scanId, token }) {
  const { mutate: saveToRed, isPending: isSavingRed } = useSaveProduct(productId, "RED", token);
  const { mutate: saveToGreen, isPending: isSavingGreen } = useSaveProduct(productId, "GREEN", token);
  const { mutate: saveScan, isPending: isSavingScan } = useSaveScan(scanId, token);

  const onAddRed = () => {
    // First save the product to the red list
    saveToRed(undefined, {
      onSuccess: (message) => {
        // Then save the scan
        if (scanId) {
          saveScan(undefined, {
            onSuccess: (scanMessage) => {
              Alert.alert("Success", "Product added to red list and scan saved");
            },
            onError: (scanErr) => {
              Alert.alert(
                "Warning",
                "Product added to red list but failed to save scan: " + (scanErr?.message || "Unknown error")
              );
            }
          });
        } else {
          Alert.alert(message || "Product added to red list");
        }
      },
      onError: (err) => {
        Alert.alert("Failed to add to red list", err?.message || "Unknown error");
      }
    });
  };

  const onAddGreen = () => {
    // First save the product to the green list
    saveToGreen(undefined, {
      onSuccess: (message) => {
        // Then save the scan
        if (scanId) {
          saveScan(undefined, {
            onSuccess: (scanMessage) => {
              Alert.alert("Success", "Product added to green list and scan saved");
            },
            onError: (scanErr) => {
              Alert.alert(
                "Warning",
                "Product added to green list but failed to save scan: " + (scanErr?.message || "Unknown error")
              );
            }
          });
        } else {
          Alert.alert(message || "Product added to green list");
        }
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
        label={isSavingRed || isSavingScan ? "ADDING..." : "+ RED LIST"}
        onPress={onAddRed}
        disabled={isSavingRed || isSavingGreen || isSavingScan}
      />
      <ThemedButton
        style={[styles.actionButton, styles.greenButton]}
        label={isSavingGreen || isSavingScan ? "ADDING..." : "+ GREEN LIST"}
        onPress={onAddGreen}
        disabled={isSavingRed || isSavingGreen || isSavingScan}
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
