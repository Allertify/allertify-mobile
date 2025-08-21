import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { HorizontalList } from "@/components/lists/HorizontalList";
import { ThemedText } from "@/components/ui/ThemedText";
import { useSavedProducts } from "@/hooks/useSavedProducts";
import { useToken } from "@/hooks/useToken";

export default function ProductsScreen() {
  const { token, isLoading: tokenLoading } = useToken();
  const { data: savedProducts, isLoading: savedProductsLoading } = useSavedProducts(token);

  if (tokenLoading || savedProductsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#91bef8" />
      </View>
    );
  }

  const greenList = savedProducts.scans.filter((product) => product.listType === "GREEN") || [];
  const redList = savedProducts.scans.filter((product) => product.listType === "RED") || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <ThemedText style={styles.title}>🟢 Green List</ThemedText>
        <ThemedText style={styles.description}>Safe products that are generally well-tolerated</ThemedText>
        {greenList.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No green list items yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>Start scanning products to build your green list</ThemedText>
          </View>
        ) : (
          <HorizontalList itemCount={greenList.length} type="history" scans={greenList} />
        )}
      </View>

      <View style={styles.section}>
        <ThemedText style={styles.title}>🔴 Red List</ThemedText>
        <ThemedText style={styles.description}>Products that may cause adverse reactions</ThemedText>
        {redList.length === 0 ? (
          <View style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>No red list items yet</ThemedText>
            <ThemedText style={styles.emptySubtext}>Start scanning products to build your red list</ThemedText>
          </View>
        ) : (
          <HorizontalList itemCount={redList.length} type="history" scans={redList} />
        )}
      </View>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 24
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  section: {
    marginBottom: 40
  },
  title: {
    fontSize: 22,
    marginBottom: 8
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    fontFamily: "Satoshi-Bold"
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    textAlign: "center"
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center"
  },
  bottomSpacing: {
    height: 100
  }
});
