import { StyleSheet, View } from 'react-native';

export function ProductImage({ imageUrl, style, size = 200 }) {
  return (
    <View style={[styles.productImage, { width: size, height: size }, style]} />
  );
}

const styles = StyleSheet.create({
  productImage: {
    backgroundColor: '#f0f0f0',
    borderRadius: 16,
  },
});
