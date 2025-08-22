import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ui/ThemedText";

export function ProductBasicInfo({ product }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.productName}>{product.name}</ThemedText>
      <ThemedText style={styles.barcode}>Barcode: {product.barcode}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 16
  },
  productName: {
    fontSize: 24,
    marginBottom: 4
  },
  barcode: {
    fontSize: 12,
    color: "#999"
  }
});
