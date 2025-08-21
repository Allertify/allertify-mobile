import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { PlaceholderItem } from "../common/PlaceholderItem";
import { ProductItem } from "../product/ProductItem";

export function HorizontalList({ itemCount = 5, type = "placeholder", listType = "green", scans = [] }) {
  const router = useRouter();

  const renderItem = (index) => {
    if (type === "history" && scans[index]) {
      const scan = scans[index];
      return (
        <TouchableOpacity
          key={scan.id}
          style={styles.historyItem}
          onPress={() => {
            router.push(`/scan/${scan.id}`);
          }}
        >
          <Image
            source={{ uri: scan.product.imageUrl }}
            style={styles.historyImage}
            defaultSource={require("@/assets/ramen_default.png")}
          />
        </TouchableOpacity>
      );
    }

    if (type === "product") {
      return (
        <ProductItem
          key={index}
          product={{
            id: index.toString(),
            name: `Product ${index + 1}`,
            brand: `Brand ${index + 1}`
          }}
          listType={listType}
        />
      );
    }
    return <PlaceholderItem key={index} />;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
      {Array.from({ length: itemCount }, (_, index) => renderItem(index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  horizontalList: {
    paddingVertical: 12,
    gap: 8
  },
  historyItem: {
    marginRight: 8
  },
  historyImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#f0f0f0"
  }
});
