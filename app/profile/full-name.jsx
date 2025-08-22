import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useToken } from "@/hooks/useToken";
import { useUser } from "@/hooks/useUser";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function FullNameScreen() {
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading: userLoading, refreshUser } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateProfile();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (user?.fullName) {
      const nameParts = user.fullName.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
    }
  }, [user]);

  const handleSave = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    updateProfile(
      {
        token,
        profileData: { full_name: fullName }
      },
      {
        onSuccess: () => {
          refreshUser();
          Alert.alert("Success", "Profile updated successfully!");
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to update profile: ${error.message}`);
        }
      }
    );
  };

  const isFormValid = firstName.trim();

  return (
    <KeyboardAvoidingView
      style={styles.keyboardAvoidingContainer}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <LinearGradient
        colors={["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
        style={styles.fullScreen}
        start={[0, 0]}
        end={[0, 1]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header_container}>
            <Pressable style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              <ThemedText style={styles.backText}>Back</ThemedText>
            </Pressable>
          </View>

          <View style={styles.form_container}>
            <View style={styles.title_container}>
              <LinearGradient
                colors={["#fff5aaff", "#ff6b6bff", "#4284ffff"]}
                style={styles.iconContainer}
                start={[0, 0]}
                end={[1, 0.8]}
              >
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText style={styles.title}>Full Name</ThemedText>
              <ThemedText style={styles.subtitle}>Update your name information for your profile.</ThemedText>
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={firstName}
                onChangeText={setFirstName}
                autoComplete="given-name"
                editable={!isPending}
              />
            </View>

            <View style={styles.input_container}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={lastName}
                onChangeText={setLastName}
                autoComplete="family-name"
                editable={!isPending}
              />
            </View>

            <Pressable
              style={[styles.saveButton, (!isFormValid || isPending) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isFormValid || isPending}
            >
              <LinearGradient
                colors={!isFormValid || isPending ? ["#ccc", "#ccc"] : ["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
                style={styles.saveButtonGradient}
                start={[0, 0]}
                end={[1, 0.8]}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <ThemedText style={styles.saveButtonText}>{isPending ? "Saving..." : "Save"}</ThemedText>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1
  },
  fullScreen: {
    flex: 1
  },
  scrollView: {
    flex: 1
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40
  },
  header_container: {
    paddingBottom: 20,
    width: "100%"
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start"
  },
  backText: {
    color: "#FFFFFF",
    fontSize: 20,
    marginLeft: 8
  },
  form_container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 30,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8
  },
  title_container: {
    alignItems: "center",
    marginBottom: 30
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#8a42ffff",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 24,
    color: "#333",
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
    lineHeight: 20
  },
  input_container: {
    width: "100%",
    marginBottom: 15
  },
  input: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: "#333"
  },
  saveButton: {
    borderRadius: 12,
    width: "100%",
    marginTop: 5
  },
  saveButtonDisabled: {
    opacity: 0.6
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
