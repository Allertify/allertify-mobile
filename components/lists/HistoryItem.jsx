import { StyleSheet, View, Image } from "react-native";
import { ThemedText } from "../ui/ThemedText";
import { Colors } from "@/constants/Colors";

export function HistoryItem({ scan }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "SAFE":
        return Colors.green;
      case "WARNING":
        return Colors.yellow;
      case "DANGER":
        return Colors.red;
      default:
        return "#999";
    }
  };

  return (
    <View style={styles.itemContainer}>
      {scan.product.imageUrl ? (
        <Image source={{ uri: scan.product.imageUrl }} style={styles.productImage} />
      ) : (
        <Image source={require("@/assets/ramen_default.png")} style={styles.productImage} />
      )}
      <View style={styles.itemContent}>
        <ThemedText style={styles.productName} numberOfLines={2}>
          {scan.product.name}
        </ThemedText>
        <ThemedText style={styles.scanDate}>{formatDate(scan.scanDate)}</ThemedText>
        <View style={styles.riskContainer}>
          <View style={[styles.riskBadge, { backgroundColor: getRiskLevelColor(scan.riskLevel) }]}>
            <ThemedText style={styles.riskText}>{scan.riskLevel}</ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0"
  },
  itemContent: {
    flex: 1,
    gap: 4
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    lineHeight: 20
  },
  scanDate: {
    fontSize: 12,
    color: "#666",
    fontWeight: "400"
  },
  riskContainer: {
    marginTop: 4
  },
  riskBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12
  },
  riskText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#fff",
    textTransform: "uppercase"
  }
});
