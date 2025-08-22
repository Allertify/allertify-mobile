import { ActivityIndicator, ScrollView, StyleSheet, View, Pressable } from "react-native";
import { HistoryItem } from "@/components/lists/HistoryItem";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/useHistory";
import { useToken } from "@/hooks/useToken";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo } from "react";

function StatsCard({ title, count, icon, colors, subtitle }) {
  return (
    <View style={styles.statsCard}>
      <LinearGradient colors={colors} style={styles.statsGradient} start={[0, 0]} end={[1, 0.8]}>
        <View style={styles.statsIconContainer}>
          <Ionicons name={icon} size={24} color="#FFFFFF" />
        </View>
        <View style={styles.statsContent}>
          <ThemedText style={styles.statsCount}>{count}</ThemedText>
          <ThemedText style={styles.statsTitle}>{title}</ThemedText>
          {subtitle && <ThemedText style={styles.statsSubtitle}>{subtitle}</ThemedText>}
        </View>
      </LinearGradient>
    </View>
  );
}

function HistorySection({ title, scans, icon, emptyMessage, emptyIcon }) {
  return (
    <View style={styles.historySection}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color="#2D3748" />
        <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
        <View style={styles.countBadge}>
          <ThemedText style={styles.countBadgeText}>{scans.length}</ThemedText>
        </View>
      </View>

      <View style={styles.sectionContent}>
        {scans.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={emptyIcon} size={48} color="#CBD5E0" />
            <ThemedText style={styles.emptyStateTitle}>No Items Yet</ThemedText>
            <ThemedText style={styles.emptyStateText}>{emptyMessage}</ThemedText>
          </View>
        ) : (
          <View style={styles.historyList}>
            {scans.map((scan) => (
              <HistoryItem key={scan.id} scan={scan} />
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const { token, isLoading: tokenLoading } = useToken();
  const { data, isLoading, error, isError } = useHistory(token);

  const stats = useMemo(() => {
    if (!data?.scans) return { total: 0, redList: 0, greenList: 0 };

    const total = data.scans.length;
    const redList = data.scans.filter((scan) => scan.listType === "RED").length;
    const greenList = data.scans.filter((scan) => scan.listType === "GREEN").length;

    return { total, redList, greenList };
  }, [data]);

  if (tokenLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ff6b6b" />
        <ThemedText style={styles.errorText}>{error.message}</ThemedText>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document-outline" size={64} color="#CBD5E0" />
        <ThemedText style={styles.errorText}>No data available</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>Scan History</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Your product scanning activity</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Stats Overview */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <StatsCard
                title="Total Scans"
                count={stats.total}
                icon="scan"
                colors={["#667eea", "#764ba2"]}
                subtitle="all time"
              />
            </View>
            <View style={styles.statsGrid}>
              <StatsCard
                title="Red List"
                count={stats.redList}
                icon="warning"
                colors={["#ff6b6b", "#ffa500"]}
                subtitle="to avoid"
              />
              <StatsCard
                title="Green List"
                count={stats.greenList}
                icon="checkmark-circle"
                colors={["#2ed573", "#5f27cd"]}
                subtitle="safe items"
              />
            </View>
          </View>

          {data.scans.length === 0 ? (
            <View style={styles.mainEmptyState}>
              <LinearGradient colors={["#f093fb", "#f5576c"]} style={styles.emptyGradient} start={[0, 0]} end={[1, 1]}>
                <Ionicons name="scan-outline" size={80} color="rgba(255,255,255,0.8)" />
                <ThemedText style={styles.mainEmptyTitle}>No Scan History Yet</ThemedText>
                <ThemedText style={styles.mainEmptyText}>
                  Start scanning products to track your allergen analysis history
                </ThemedText>
                <Pressable style={styles.scanButton} onPress={() => router.push("/scan")}>
                  <ThemedText style={styles.scanButtonText}>Start Scanning</ThemedText>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </Pressable>
              </LinearGradient>
            </View>
          ) : (
            <>
              {/* Display all scans from newest to oldest */}
              <HistorySection
                title="All Scans"
                scans={data.scans} // Use the full list of scans
                icon="time"
                emptyMessage="No scans available"
                emptyIcon="time-outline"
              />
            </>
          )}

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F7ECFF",
    flex: 1,
    paddingTop: 25
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7ECFF"
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7ECFF",
    padding: 24,
    gap: 16
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center"
  },

  // Header Styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2
  },
  headerContent: {
    flex: 1
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    marginBottom: 4
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666"
  },

  scrollView: {
    flex: 1
  },
  content: {
    padding: 20
  },

  // Stats Section
  statsSection: {
    marginBottom: 32
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6
  },
  statsGradient: {
    padding: 16,
    alignItems: "center",
    minHeight: 100
  },
  statsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  statsContent: {
    alignItems: "center"
  },
  statsCount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4
  },
  statsTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  statsSubtitle: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2
  },

  // History Sections
  historySection: {
    marginBottom: 28
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2D3748",
    flex: 1
  },
  countBadge: {
    backgroundColor: "#667eea",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3
  },
  historyList: {
    padding: 16,
    gap: 12
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A5568",
    marginTop: 16,
    marginBottom: 8
  },
  emptyStateText: {
    fontSize: 14,
    color: "#718096",
    textAlign: "center",
    lineHeight: 20
  },
  mainEmptyState: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    marginVertical: 20
  },
  emptyGradient: {
    padding: 40,
    alignItems: "center"
  },
  mainEmptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 12,
    textAlign: "center"
  },
  mainEmptyText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF"
  },

  bottomSpacing: {
    height: 100
  }
});
