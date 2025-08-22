import { ActivityIndicator, ScrollView, StyleSheet, View, Pressable } from "react-native";
import { HorizontalList } from "@/components/lists/HorizontalList";
import { ThemedText } from "@/components/ui/ThemedText";
import { useSavedScans } from "@/hooks/useSavedScans";
import { useToken } from "@/hooks/useToken";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useMemo } from "react";

function ListStatsCard({ title, count, icon, colors, subtitle, onPress }) {
  return (
    <Pressable style={styles.statsCard} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.statsGradient} start={[0, 0]} end={[1, 0.8]}>
        <View style={styles.statsHeader}>
          <View style={styles.statsIconContainer}>
            <Ionicons name={icon} size={28} color="#FFFFFF" />
          </View>
          <View style={styles.statsContent}>
            <ThemedText style={styles.statsCount}>{count}</ThemedText>
            <ThemedText style={styles.statsTitle}>{title}</ThemedText>
            {subtitle && <ThemedText style={styles.statsSubtitle}>{subtitle}</ThemedText>}
          </View>
        </View>
        <View style={styles.statsArrow}>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.7)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function ProductListSection({
  title,
  description,
  products,
  icon,
  colors,
  emptyMessage,
  emptySubtext,
  emptyIcon,
  listType
}) {
  return (
    <View style={styles.listSection}>
      <View style={styles.listHeader}>
        <LinearGradient colors={colors} style={styles.listHeaderGradient} start={[0, 0]} end={[1, 0]}>
          <View style={styles.listHeaderContent}>
            <View style={styles.listTitleContainer}>
              <Ionicons name={icon} size={24} color="#FFFFFF" />
              <View style={styles.listTitleText}>
                <ThemedText style={styles.listTitle}>{title}</ThemedText>
                <ThemedText style={styles.listDescription}>{description}</ThemedText>
              </View>
            </View>
            <View style={styles.listCountBadge}>
              <ThemedText style={styles.listCountText}>{products.length}</ThemedText>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.listContent}>
        {products.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name={emptyIcon} size={64} color="#CBD5E0" />
            <ThemedText style={styles.emptyStateTitle}>{emptyMessage}</ThemedText>
            <ThemedText style={styles.emptyStateText}>{emptySubtext}</ThemedText>
          </View>
        ) : (
          <View style={styles.productsContainer}>
            <HorizontalList itemCount={products.length} type="history" scans={products} />
            {products.length > 6 && (
              <View style={styles.showMoreContainer}>
                <Pressable style={styles.showMoreButton}>
                  <ThemedText style={styles.showMoreText}>View all {products.length} items</ThemedText>
                  <Ionicons name="chevron-down" size={16} color="#667eea" />
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

export default function ProductsScreen() {
  const router = useRouter();
  const { token, isLoading: tokenLoading } = useToken();
  const { data: savedProducts, isLoading: savedProductsLoading } = useSavedScans(token);

  const { greenList, redList, recentlyAdded } = useMemo(() => {
    if (!savedProducts?.scans) {
      return { greenList: [], redList: [], recentlyAdded: [] };
    }

    const green = savedProducts.scans.filter((product) => product.listType === "GREEN") || [];
    const red = savedProducts.scans.filter((product) => product.listType === "RED") || [];

    // Get recently added items (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = savedProducts.scans.filter((product) => new Date(product.createdAt) > weekAgo).slice(0, 10);

    return { greenList: green, redList: red, recentlyAdded: recent };
  }, [savedProducts]);

  if (tokenLoading || savedProductsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
      </View>
    );
  }

  const totalProducts = greenList.length + redList.length;

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </Pressable>
        <View style={styles.headerContent}>
          <ThemedText style={styles.headerTitle}>My Product Lists</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Manage your safe and avoided products</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Overview Cards */}
          <View style={styles.overviewSection}>
            <View style={styles.overviewGrid}>
              <ListStatsCard
                title="Safe Products"
                count={greenList.length}
                icon="checkmark-circle"
                colors={["#2ed573", "#7bed9f"]}
                subtitle="approved items"
              />
              <ListStatsCard
                title="Avoid List"
                count={redList.length}
                icon="warning"
                colors={["#ff6b6b", "#ffa500"]}
                subtitle="items to avoid"
              />
            </View>

            <View style={styles.totalCard}>
              <LinearGradient
                colors={["#667eea", "#764ba2", "#f093fb"]}
                style={styles.totalCardGradient}
                start={[0, 0]}
                end={[1, 1]}
              >
                <View style={styles.totalCardContent}>
                  <View style={styles.totalStats}>
                    <Ionicons name="library" size={32} color="#FFFFFF" />
                    <View style={styles.totalInfo}>
                      <ThemedText style={styles.totalCount}>{totalProducts}</ThemedText>
                      <ThemedText style={styles.totalLabel}>Total Saved Products</ThemedText>
                    </View>
                  </View>
                  {recentlyAdded.length > 0 && (
                    <View style={styles.recentBadge}>
                      <Ionicons name="time" size={14} color="#FFFFFF" />
                      <ThemedText style={styles.recentText}>{recentlyAdded.length} added this week</ThemedText>
                    </View>
                  )}
                </View>
              </LinearGradient>
            </View>
          </View>

          {totalProducts === 0 ? (
            <View style={styles.mainEmptyState}>
              <LinearGradient
                colors={["#a2baefff", "#fbc6d7ff"]}
                style={styles.emptyGradient}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Ionicons name="library-outline" size={80} color="rgba(255,255,255,0.8)" />
                <ThemedText style={styles.mainEmptyTitle}>No Saved Products Yet</ThemedText>
                <ThemedText style={styles.mainEmptyText}>
                  Start scanning products to build your personal safe and avoid lists
                </ThemedText>
                <Pressable style={styles.scanButton} onPress={() => router.push("/scan")}>
                  <ThemedText style={styles.scanButtonText}>Start Scanning</ThemedText>
                  <Ionicons name="camera" size={20} color="#FFFFFF" />
                </Pressable>
              </LinearGradient>
            </View>
          ) : (
            <>
              {/* Recently Added Section */}
              {recentlyAdded.length > 0 && (
                <ProductListSection
                  title="Recently Added"
                  description="Products added in the last week"
                  products={recentlyAdded}
                  icon="time"
                  colors={["#667eea", "#764ba2"]}
                  emptyMessage="No recent additions"
                  emptySubtext="Products added this week will appear here"
                  emptyIcon="time-outline"
                  listType="RECENT"
                />
              )}

              {/* Green List Section */}
              <ProductListSection
                title="Safe Products"
                description="Items that are generally well-tolerated and safe for you"
                products={greenList}
                icon="checkmark-circle"
                colors={["#2ed573", "#5f27cd"]}
                emptyMessage="No safe products yet"
                emptySubtext="Products marked as safe will appear here"
                emptyIcon="checkmark-circle-outline"
                listType="GREEN"
              />

              {/* Red List Section */}
              <ProductListSection
                title="Products to Avoid"
                description="Items that may cause adverse reactions or contain allergens"
                products={redList}
                icon="warning"
                colors={["#ff6b6b", "#ff4757"]}
                emptyMessage="No items to avoid"
                emptySubtext="Products to avoid will appear here"
                emptyIcon="warning-outline"
                listType="RED"
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

  // Overview Section
  overviewSection: {
    marginBottom: 32
  },
  overviewGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16
  },
  statsCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6
  },
  statsGradient: {
    padding: 20,
    minHeight: 120
  },
  statsHeader: {
    flex: 1
  },
  statsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  statsContent: {
    alignItems: "center"
  },
  statsCount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  statsSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2
  },
  statsArrow: {
    alignItems: "flex-end"
  },

  // Total Card
  totalCard: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8
  },
  totalCardGradient: {
    padding: 24
  },
  totalCardContent: {
    gap: 16
  },
  totalStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  totalInfo: {
    flex: 1
  },
  totalCount: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)"
  },
  recentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
    alignSelf: "flex-start"
  },
  recentText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF"
  },

  // List Sections
  listSection: {
    marginBottom: 28
  },
  listHeader: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    marginBottom: 16
  },
  listHeaderGradient: {
    padding: 20
  },
  listHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  listTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1
  },
  listTitleText: {
    flex: 1
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4
  },
  listDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    lineHeight: 16
  },
  listCountBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16
  },
  listCountText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  listContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 3
  },
  productsContainer: {
    padding: 16
  },
  showMoreContainer: {
    marginTop: 16,
    alignItems: "center"
  },
  showMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#667eea"
  },

  // Empty States
  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4A5568",
    marginTop: 20,
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
