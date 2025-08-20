import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";

import { HorizontalList } from "@/components/lists/HorizontalList";
import { ThemedLink } from "@/components/ui/ThemedLink";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/useHistory";
import { useToken } from "@/hooks/useToken";

export default function HomeScreen() {
  const { token, isLoading: tokenLoading } = useToken();
  const { data: historyData, isLoading: historyLoading } = useHistory(token);

  if (tokenLoading || historyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  const recentScans = historyData?.scans?.slice(0, 9) || [];
  const redFoodList = historyData?.scans?.filter((scan) => scan.listType === "RED") || [];
  const greenFoodList = historyData?.scans?.filter((scan) => scan.listType === "GREEN") || [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.greeting}>👋 Hey, John Doe!</ThemedText>

      <ThemedLink label="Recent Scans" href="/profile/history" />
      <HorizontalList itemCount={recentScans.length} type="history" scans={recentScans} />

      <ThemedLink label="Red Food List" href="/profile/products" />
      <HorizontalList itemCount={redFoodList.length} type="history" scans={redFoodList} />

      <ThemedLink label="Green Food List" href="/profile/products" />
      <HorizontalList itemCount={greenFoodList.length} type="history" scans={greenFoodList} />

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
  greeting: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 32
  },
  bottomSpacing: {
    height: 100
  }
});
