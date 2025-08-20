import { ScrollView, StyleSheet, View, Alert } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedLink } from "@/components/ui/ThemedLink";
import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { useAuthContext } from "@/hooks/useAuthContext";

const account = [
  {
    href: "/profile/history",
    label: "History",
    description: "View your scan history"
  },
  {
    href: "/profile/products",
    label: "My Products",
    description: "View your Red and Green Lists"
  }
];

const settings = [
  {
    href: "/profile/allergens",
    label: "Allergens",
    description: "Manage your allergens"
  },
  {
    href: "/profile/emergency-contacts",
    label: "Emergency Contacts",
    description: "Manage your emergency contacts"
  },
  {
    href: "/profile/full-name",
    label: "Full Name",
    description: "Change your full name"
  },
  {
    href: "/profile/email",
    label: "Email",
    description: "Change your email"
  },
  {
    href: "/profile/password",
    label: "Password",
    description: "Change your password"
  }
];

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, user, isLoading } = useAuthContext();

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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* User Info Section */}
      {user && (
        <View style={styles.userSection}>
          <ThemedText style={styles.userName}>{user.full_name || user.name}</ThemedText>
          <ThemedText style={styles.userEmail}>{user.email}</ThemedText>
        </View>
      )}

      <View style={{ marginBottom: 16 }}>
        {account.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>

      <View style={{ marginBottom: 32 }}>
        <ThemedText style={{ fontSize: 20 }}>Settings</ThemedText>
        {settings.map((item, index) => (
          <ThemedLink key={index} {...item} />
        ))}
      </View>

      <ThemedButton
        variant="destructive"
        label={isLoading ? "LOGGING OUT..." : "LOGOUT"}
        onPress={handlePressLogout}
        disabled={isLoading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 32
  },
  userSection: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef"
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
  }
});
