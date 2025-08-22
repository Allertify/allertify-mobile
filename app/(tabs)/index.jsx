import { ActivityIndicator, StyleSheet, View, ScrollView } from "react-native";
import { HorizontalList } from "@/components/lists/HorizontalList";
import { ThemedLink } from "@/components/ui/ThemedLink";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/useHistory";
import { useToken } from "@/hooks/useToken";
import { useUser } from "@/hooks/useUser";
import { useSettings } from "@/hooks/useAllergies"; // This now uses the refactored version

export default function HomeScreen() {
  const { token, isLoading: tokenLoading } = useToken();
  const { user } = useUser();
  const { allergies, isLoading: allergiesLoading } = useSettings(); // Add loading state
  const { data: historyData, isLoading: historyLoading } = useHistory(token);

  if (tokenLoading || historyLoading || allergiesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }

  const recentScans = historyData?.scans?.slice(0, 9) || [];
  const redFoodList = historyData?.scans?.filter((scan) => scan.listType === "RED") || [];
  const greenFoodList = historyData?.scans?.filter((scan) => scan.listType === "GREEN") || [];

  // Format allergies for display
  const allergiesDisplay =
    allergies && allergies.length > 0 ? `Allergies: ${allergies.join(", ")}` : "No allergies recorded";

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <ThemedText style={styles.greeting}>👋 Hey, {user?.fullName || "User"}</ThemedText>
      <ThemedText style={styles.allergiesInfo}>{allergiesDisplay}</ThemedText>

      <ThemedLink label="Recent Scans" href="/profile/history" />
      <HorizontalList itemCount={recentScans.length} type="history" scans={recentScans} />

      <ThemedLink label="Red Food List" href="/profile/products" />
      <HorizontalList itemCount={redFoodList.length} type="history" scans={redFoodList} />

      <ThemedLink label="Green Food List" href="/profile/products" />
      <HorizontalList itemCount={greenFoodList.length} type="history" scans={greenFoodList} />

      <ThemedLink label="Test" href="/onboarding-emergency" />

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
    marginBottom: 16
  },
  allergiesInfo: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 32,
    color: "#666",
    fontStyle: "italic"
  },
  bottomSpacing: {
    height: 100
  }
});
