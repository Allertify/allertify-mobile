import { StyleSheet, TouchableOpacity, View, Image } from "react-native";

import { ThemedText } from "../ui/ThemedText";

export function ProductItem({ product, listType = "green" }) {
  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imageContainer}>
        {product?.image ? (
          <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
        ) : (
          <View style={styles.productImage} />
        )}
        <View style={[styles.riskBadge, listType === "red" ? styles.redBadge : styles.greenBadge]}>
          <ThemedText style={styles.riskText}>{listType === "red" ? "🔴" : "🟢"}</ThemedText>
        </View>
      </View>
      <ThemedText style={styles.productName} numberOfLines={2}>
        {product?.name || "Product Name"}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    marginRight: 12
  },
  imageContainer: {
    position: "relative",
    marginBottom: 8
  },
  productImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f0f0f0",
    borderRadius: 12
  },
  riskBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center"
  },
  greenBadge: {
    backgroundColor: "#D4EDDA"
  },
  redBadge: {
    backgroundColor: "#F8D7DA"
  },
  riskText: {
    fontSize: 12
  },
  productName: {
    fontSize: 12,
    marginBottom: 4,
    lineHeight: 16
  }
});
