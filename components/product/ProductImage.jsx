import { StyleSheet, View, Image } from "react-native";

export function ProductImage({ imageUrl, style, size = 200 }) {
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[styles.productImage, { width: size, height: size }]}
          resizeMode="contain"
        />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: "hidden"
  },
  productImage: {
    borderRadius: 16
  },
  placeholder: {
    backgroundColor: "#f0f0f0",
    borderRadius: 16
  }
});
