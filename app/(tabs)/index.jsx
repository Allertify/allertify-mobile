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
    allergies && allergies.length > 0 ? `Allergies: ${allergies.filter(Boolean).join(", ")}` : "No allergies recorded";

  return (
    <View style={styles.screenContainer}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <ThemedText style={styles.greeting}>👋 Hey, {user?.fullName || "User"}</ThemedText>
        <ThemedText style={styles.allergiesInfo}>{allergiesDisplay}</ThemedText>

        <ThemedLink label="Recent Scans" href="/profile/history" />
        <HorizontalList itemCount={recentScans.length} type="history" scans={recentScans} />

        <ThemedLink label="Red Food List" href="/profile/products" />
        <HorizontalList itemCount={redFoodList.length} type="history" scans={redFoodList} />

        <ThemedLink label="Green Food List" href="/profile/products" />
        <HorizontalList itemCount={greenFoodList.length} type="history" scans={greenFoodList} />

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Emergency Call Floating Button */}
      <View style={styles.floatingButtonContainer}>
        <Pressable
          style={styles.emergencyButton}
          onPress={handleEmergencyCall}
          android_ripple={{ color: "rgba(255,255,255,0.3)", radius: 35 }}
        >
          <LinearGradient
            colors={["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
            style={styles.emergencyButtonGradient}
            start={[0, 0]}
            end={[0, 1]}
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
  screenContainer: {
    flex: 1,
    backgroundColor: "#fff"
  },
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
  },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    alignItems: "center"
  },
  emergencyButton: {
    width: 50,
    height: 50,
    borderRadius: 35,
    elevation: 8,
    shadowColor: "#8a42ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.4,
    shadowRadius: 8
  },
  emergencyButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center"
  },
  emergencyContactInfo: {
    marginTop: 8,
    backgroundColor: "rgba(0,0,0,0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    maxWidth: 120
  },
  emergencyContactText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center"
  }
});
