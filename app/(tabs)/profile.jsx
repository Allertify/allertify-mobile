import { ScrollView, StyleSheet, View, Alert, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { useUser } from "@/hooks/useUser";
import { useSubscription } from "@/hooks/useSubscription";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "@/hooks/useAuth";

const account = [
  {
    href: "/profile/subscription",
    label: "Subscriptions",
    description: "Manage your subscriptions",
    icon: "heart",
    colors: ["#ff6b6bff", "#ffa500ff", "#ff1744ff"]
  },
  {
    href: "/profile/history",
    label: "History",
    description: "View your scan history",
    icon: "time",
    colors: ["#fff5aaff", "#5af9a9ff", "#4284ffff"]
  },
  {
    href: "/profile/products",
    label: "My Products",
    description: "View your Red and Green Lists",
    icon: "list",
    colors: ["#ffc30fff", "#ff8e1eff", "#8a42ffff"]
  }
];

const settings = [
  {
    href: "/profile/allergens",
    label: "Allergens",
    description: "Manage your allergens",
    icon: "medical",
    colors: ["#ff6b6bff", "#ffa500ff", "#ff1744ff"]
  },
  {
    href: "/profile/emergency-contacts",
    label: "Emergency Contacts",
    description: "Manage your emergency contacts",
    icon: "call",
    colors: ["#e74c3cff", "#f39c12ff", "#e67e22ff"]
  },
  {
    href: "/profile/full-name",
    label: "Full Name",
    description: "Change your full name",
    icon: "person",
    colors: ["#3498dbff", "#9b59b6ff", "#2980b9ff"]
  },
  {
    href: "/profile/email",
    label: "Email",
    description: "Change your email",
    icon: "mail",
    colors: ["#1abc9cff", "#16a085ff", "#27ae60ff"]
  },
  {
    href: "/profile/password",
    label: "Password",
    description: "Change your password",
    icon: "lock-closed",
    colors: ["#34495eff", "#2c3e50ff", "#95a5a6ff"]
  }
];

function ProfileCard({ item, onPress }) {
  return (
    <Pressable style={styles.profileCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <LinearGradient colors={item.colors} style={styles.iconContainer} start={[0, 0]} end={[1, 0.8]}>
          <Ionicons name={item.icon} size={24} color="#FFFFFF" />
        </LinearGradient>
        <View style={styles.cardTextContainer}>
          <ThemedText style={styles.cardTitle}>{item.label}</ThemedText>
          <ThemedText style={styles.cardDescription}>{item.description}</ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </Pressable>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { data: subscriptionData, isLoading: subscriptionLoading } = useSubscription();
  const { logout, isLoading } = useAuth();

  const handlePressLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: performLogout
      }
    ]);
  };

  const performLogout = async () => {
    try {
      const result = await logout();

      if (result.success) {
        router.replace("/auth");
      } else {
        Alert.alert("Logout Failed", result.error || "Failed to logout. Please try again.", [{ text: "OK" }]);
      }
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An unexpected error occurred during logout.", [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Profile Card */}
        <View style={styles.profileMainCard}>
          {/* User Info Section */}
          {user && (
            <View style={styles.userSection}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={["#fff5aaff", "#42e895ff", "#4284ffff"]}
                  style={styles.avatar}
                  start={[0, 0]}
                  end={[1, 0.8]}
                >
                  <Ionicons name="person" size={32} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.userInfo}>
                <ThemedText style={styles.userName}>{user.full_name || user.name}</ThemedText>
                <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
                {subscriptionLoading ? (
                  <View style={styles.subscriptionInfo}>
                    <ThemedText style={styles.loadingText}>Loading subscription...</ThemedText>
                  </View>
                ) : subscriptionData ? (
                  <View style={styles.subscriptionInfo}>
                    <View style={styles.subscriptionBadge}>
                      <Ionicons
                        name={subscriptionData.is_free_tier ? "card-outline" : "diamond-outline"}
                        size={16}
                        color={subscriptionData.is_free_tier ? "#333" : "#B8860B"}
                      />
                      <ThemedText
                        style={[styles.subscriptionText, { color: subscriptionData.is_free_tier ? "#333" : "#B8860B" }]}
                      >
                        {subscriptionData.subscription?.tier_plan?.plan_type || "FREE"}
                      </ThemedText>
                    </View>
                    {subscriptionData.subscription?.status && (
                      <View
                        style={[
                          styles.statusBadge,
                          { backgroundColor: subscriptionData.subscription.status === "ACTIVE" ? "#4CAF50" : "#FF9800" }
                        ]}
                      >
                        <ThemedText style={styles.statusText}>{subscriptionData.subscription.status}</ThemedText>
                      </View>
                    )}
                  </View>
                ) : null}
              </View>
            </View>
          )}

          {/* Quick Actions Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Quick Actions</ThemedText>
            <View style={styles.cardsContainer}>
              {account.map((item, index) => (
                <ProfileCard key={index} item={item} onPress={() => router.push(item.href)} />
              ))}
            </View>
          </View>

          {/* Settings Section */}
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Settings</ThemedText>
            <View style={styles.cardsContainer}>
              {settings.map((item, index) => (
                <ProfileCard key={index} item={item} onPress={() => router.push(item.href)} />
              ))}
            </View>
          </View>

          {/* Logout Button */}
          <Pressable
            style={[styles.logoutButton, isLoading && styles.buttonDisabled]}
            onPress={handlePressLogout}
            disabled={isLoading}
          >
            <View style={styles.logoutContent}>
              <Ionicons name="log-out" size={20} color="#dc3545" />
              <ThemedText style={styles.logoutText}>{isLoading ? "LOGGING OUT..." : "LOGOUT"}</ThemedText>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7ECFF"
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "#F7ECFF"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2746b7ff",
    textAlign: "center"
  },
  scrollView: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 32
  },
  profileMainCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0"
  },
  avatarContainer: {
    marginRight: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4284ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4
  },
  userEmail: {
    fontSize: 16,
    color: "#666"
  },
  subscriptionInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8
  },
  subscriptionBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef"
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
    color: "white"
  },
  loadingText: {
    fontSize: 12,
    color: "#999",
    fontStyle: "italic"
  },
  section: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2746b7ff",
    marginBottom: 15
  },
  cardsContainer: {
    gap: 12
  },
  profileCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef"
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  cardTextContainer: {
    flex: 1
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2
  },
  cardDescription: {
    fontSize: 14,
    color: "#666"
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#dc3545",
    borderRadius: 12,
    marginTop: 10
  },
  buttonDisabled: {
    opacity: 0.6
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24
  },
  logoutText: {
    color: "#dc3545",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  }
});
