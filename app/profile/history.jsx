import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { HistoryItem } from "@/components/lists/HistoryItem";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/useHistory";
import { useToken } from "@/hooks/useToken";

export default function HistoryScreen() {
  const { token, isLoading: tokenLoading } = useToken();
  const { data, isLoading, error, isError } = useHistory(token);

  if (tokenLoading || isLoading) {
    return <ActivityIndicator size="large" color={Colors.blue} />;
  }

  if (isError) {
    return <ThemedText style={styles.error}>{error.message}</ThemedText>;
  }

  if (!data) {
    return <ThemedText style={styles.error}>No data</ThemedText>;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.description}>Your recent barcode scans and product lookups</ThemedText>

      {data.scans.length === 0 ? (
        <View style={styles.emptyState}>
          <ThemedText style={styles.emptyText}>No scan history yet</ThemedText>
          <ThemedText style={styles.emptySubtext}>Start scanning products to see your history here</ThemedText>
        </View>
      ) : (
        <View style={styles.historyList}>
          {data.scans.map((scan) => (
            <HistoryItem key={scan.id} scan={scan} />
          ))}
        </View>
      )}

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
  title: {
    fontSize: 28,
    textAlign: "center",
    marginBottom: 8,
    marginTop: 20
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
    fontFamily: "Satoshi-Bold"
  },
  historyList: {
    gap: 16
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8
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
