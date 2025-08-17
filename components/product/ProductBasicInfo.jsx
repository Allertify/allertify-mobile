import { StyleSheet, View } from 'react-native';

import { ThemedText } from '../ui/ThemedText';

export function ProductBasicInfo({ product }) {
  return (
    <View style={styles.section}>
      <ThemedText style={styles.productName}>{product.name}</ThemedText>
      <ThemedText style={styles.brandName}>{product.brand}</ThemedText>
      <ThemedText style={styles.barcode}>Barcode: {product.barcode}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
  },
  productName: {
    fontSize: 24,
    marginBottom: 4,
  },
  brandName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  barcode: {
    fontSize: 12,
    color: '#999',
  },
});
