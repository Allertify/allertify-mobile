import { ActivityIndicator, StyleSheet, View, ScrollView, Pressable, Linking, Alert } from "react-native";
import { HorizontalList } from "@/components/lists/HorizontalList";
import { ThemedLink } from "@/components/ui/ThemedLink";
import { ThemedText } from "@/components/ui/ThemedText";
import { Colors } from "@/constants/Colors";
import { useHistory } from "@/hooks/useHistory";
import { useToken } from "@/hooks/useToken";
import { useUser } from "@/hooks/useUser";
import { useAllergies } from "@/hooks/useAllergies";
import { useEmergencyContact } from "@/hooks/useEmergencyContact";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

function QuickActionCard({ title, count, icon, colors, onPress, subtitle }) {
  return (
    <Pressable style={styles.quickActionCard} onPress={onPress}>
      <LinearGradient colors={colors} style={styles.cardGradient} start={[0, 0]} end={[1, 0.8]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Ionicons name={icon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.cardInfo}>
            <ThemedText style={styles.cardCount}>{count}</ThemedText>
            <ThemedText style={styles.cardTitle}>{title}</ThemedText>
            {subtitle && <ThemedText style={styles.cardSubtitle}>{subtitle}</ThemedText>}
          </View>
        </View>
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

function WelcomeCard({ user, allergiesDisplay }) {
  return (
    <View style={styles.welcomeCard}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#f093fb"]}
        style={styles.welcomeGradient}
        start={[0, 0]}
        end={[1, 1]}
      >
        <View style={styles.welcomeContent}>
          <View style={styles.avatarSection}>
            <LinearGradient
              colors={["#ffecd2", "#fcb69f", "#ff9a9e"]}
              style={styles.welcomeAvatar}
              start={[0, 0]}
              end={[1, 1]}
            >
              <ThemedText style={styles.avatarText}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </ThemedText>
            </LinearGradient>
            <View style={styles.greetingSection}>
              <ThemedText style={styles.welcomeGreeting}>Welcome back!</ThemedText>
              <ThemedText style={styles.welcomeName}>{user?.fullName || "User"}</ThemedText>
            </View>
          </View>
          <View style={styles.allergiesSection}>
            <View style={styles.allergiesBadge}>
              <Ionicons name="medical" size={16} color="#b10f0fff" />
              <ThemedText style={styles.allergiesText}>Allergies: {allergiesDisplay}</ThemedText>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { token, isLoading: tokenLoading } = useToken();
  const { user } = useUser();
  const { allergies, isLoading: allergiesLoading } = useAllergies();
  const { data: historyData, isLoading: historyLoading } = useHistory(token);
  const { emergencyContact, hasEmergencyContact } = useEmergencyContact();

  const handleEmergencyCall = async () => {
    if (!hasEmergencyContact || !emergencyContact) {
      Alert.alert("No Emergency Contact", "You haven't set up an emergency contact yet. Would you like to add one?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Add Contact",
          onPress: () => router.push("/profile/emergency-contact")
        }
      ]);
      return;
    }

    const phoneNumber = emergencyContact.phone_number || emergencyContact.phone;
    const contactName = emergencyContact.name;

    Alert.alert("Emergency Call", `Call ${contactName}?\n${phoneNumber}`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Call Now",
        style: "destructive",
        onPress: () => {
          const telUrl = `tel:${phoneNumber}`;
          Linking.canOpenURL(telUrl)
            .then((supported) => {
              if (supported) {
                return Linking.openURL(telUrl);
              } else {
                Alert.alert("Error", "Phone calls are not supported on this device");
              }
            })
            .catch((err) => {
              console.error("Error opening phone app:", err);
              Alert.alert("Error", "Failed to open phone app");
            });
        }
      }
    ]);
  };

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

  const allergiesDisplay =
    allergies && allergies.length > 0 ? `${allergies.filter(Boolean).join(", ")}` : "No allergies recorded";

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Welcome Card */}
          <WelcomeCard user={user} allergiesDisplay={allergiesDisplay} />

          {/* Quick Actions Grid */}
          <View style={styles.section}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="flash-outline" size={20} color="#2D3748" />
              <ThemedText style={styles.sectionTitle}>Quick Overview</ThemedText>
            </View>
            <View style={styles.quickActionsGrid}>
              <QuickActionCard
                title="Recent Scans"
                count={recentScans.length}
                icon="scan"
                colors={["#ff8488ff", "#ffa4e2ff", "#ffafe6ff"]}
                onPress={() => router.push("/profile/history")}
                subtitle="items scanned"
              />
              <QuickActionCard
                title="Red List"
                count={redFoodList.length}
                icon="warning"
                colors={["#ff6b6b", "#ffa500", "#ff4757"]}
                onPress={() => router.push("/profile/products")}
                subtitle="avoid eating these"
              />
              <QuickActionCard
                title="Green List"
                count={greenFoodList.length}
                icon="checkmark-circle"
                colors={["#2ed573", "#7bed9f", "#5f27cd"]}
                onPress={() => router.push("/profile/products")}
                subtitle="feel free to eat these"
              />
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.titleWithIcon}>
                <Ionicons name="time-outline" size={20} color="#2D3748" />
                <ThemedText style={styles.sectionTitle}>Recent Activity</ThemedText>
              </View>
              <Pressable onPress={() => router.push("/profile/history")}>
                <ThemedText style={styles.seeAllText}>See All</ThemedText>
              </Pressable>
            </View>
            <View style={styles.listContainer}>
              {recentScans.length > 0 ? (
                <HorizontalList itemCount={recentScans.length} type="history" scans={recentScans} />
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="scan-outline" size={48} color="#CBD5E0" />
                  <ThemedText style={styles.emptyStateTitle}>No Recent Scans</ThemedText>
                  <ThemedText style={styles.emptyStateText}>
                    Start scanning products to see your activity here
                  </ThemedText>
                </View>
              )}
            </View>
          </View>

          {/* Lists Overview */}
          <View style={styles.section}>
            <View style={styles.titleWithIcon}>
              <Ionicons name="list-outline" size={20} color="#2D3748" />
              <ThemedText style={styles.sectionTitle}>My Lists</ThemedText>
            </View>

            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <View style={styles.listTitleContainer}>
                  <View style={[styles.listIndicator, { backgroundColor: "#ff6b6b" }]} />
                  <Ionicons name="warning-outline" size={18} color="#d23333ff" />
                  <ThemedText style={styles.listTitle}>Red Food List</ThemedText>
                </View>
                <Pressable onPress={() => router.push("/profile/products")}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </Pressable>
              </View>
              <View style={styles.listContainer}>
                {redFoodList.length > 0 ? (
                  <HorizontalList itemCount={redFoodList.length} type="history" scans={redFoodList} />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="warning-outline" size={48} color="#FFB3B3" />
                    <ThemedText style={styles.emptyStateTitle}>No Red List Items</ThemedText>
                    <ThemedText style={styles.emptyStateText}>Products to avoid will appear here</ThemedText>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <View style={styles.listTitleContainer}>
                  <View style={[styles.listIndicator, { backgroundColor: "#2ed573" }]} />
                  <Ionicons name="checkmark-circle-outline" size={18} color="#06a247ff" />
                  <ThemedText style={styles.listTitle}>Green Food List</ThemedText>
                </View>
                <Pressable onPress={() => router.push("/profile/products")}>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </Pressable>
              </View>
              <View style={styles.listContainer}>
                {greenFoodList.length > 0 ? (
                  <HorizontalList itemCount={greenFoodList.length} type="history" scans={greenFoodList} />
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons name="checkmark-circle-outline" size={48} color="#B3E6C7" />
                    <ThemedText style={styles.emptyStateTitle}>No Green List Items</ThemedText>
                    <ThemedText style={styles.emptyStateText}>Safe products will appear here</ThemedText>
                  </View>
                )}
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </View>
      </ScrollView>

      {/* Emergency Call Floating Button */}
      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
          android_ripple={{ color: "rgba(255,255,255,0.3)", radius: 35 }}
        >
          <LinearGradient
            colors={["#ff416c", "#ff4b2b", "#d63031"]}
            style={styles.emergencyButtonGradient}
            start={[0, 0]}
            end={[1, 1]}
          >
            <Ionicons name="call" size={28} color="#FFFFFF" />
          </LinearGradient>
        </Pressable>

        {hasEmergencyContact && (
          <View style={styles.emergencyContactInfo}>
            <ThemedText style={styles.emergencyContactText}>{emergencyContact?.name}</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECFF",
    paddingTop: 25
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F7ECFF"
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingTop: 10
  },

  // Welcome Card Styles
  welcomeCard: {
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10
  },
  welcomeGradient: {
    padding: 24
  },
  welcomeContent: {
    gap: 16
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  welcomeAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  greetingSection: {
    flex: 1
  },
  welcomeGreeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 4
  },
  welcomeName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF"
  },
  allergiesSection: {
    alignItems: "flex-start"
  },
  allergiesBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8
  },
  allergiesText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500"
  },

  // Section Styles
  section: {
    marginBottom: 28
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2D3748"
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  seeAllText: {
    fontSize: 16,
    color: "#667eea",
    fontWeight: "600"
  },

  // Empty State Styles
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16
  },
  emptyStateTitle: {
    fontSize: 18,
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

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: "row",
    gap: 12
  },
  quickActionCard: {
    flex: 1, // Remove this line: minHeight: 200,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6
  },
  cardGradient: {
    padding: 20,
    height: 240, // Fixed height - no expansion allowed
    justifyConent: "space-between"
  },
  cardHeader: {
    flex: 1
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12
  },
  cardInfo: {
    flex: 1
  },
  cardCount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 4
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF"
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2
  },
  cardArrow: {
    alignItems: "flex-end"
  },

  // List Styles
  listContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 3
  },
  listSection: {
    marginBottom: 20
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  listTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8
  },
  listIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748"
  },

  // Emergency Button Styles
  bottomSpacing: {
    height: 120
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center"
  },
  emergencyButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 12
  },
  emergencyButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center"
  },
  emergencyContactInfo: {
    marginTop: 12,
    backgroundColor: "rgba(0,0,0,0.85)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    maxWidth: 140
  },
  emergencyContactText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center"
  }
});
