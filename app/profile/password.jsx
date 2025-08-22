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
import { useState } from "react";
import { ThemedText } from "@/components/ui/ThemedText";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function PasswordScreen() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword.trim()) {
      Alert.alert("Error", "Please enter your old password");
      return;
    }

    if (!newPassword.trim()) {
      Alert.alert("Error", "Please enter a new password");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "New password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    // Add your password update logic here
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Success", "Password updated successfully!");
      router.back();
    }, 1000);
  };

  const isFormValid = oldPassword.trim() && newPassword.trim() && newPassword.length >= 8;

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
                <Ionicons name="lock-closed" size={40} color="#FFFFFF" />
              </LinearGradient>
              <ThemedText style={styles.title}>Change Password</ThemedText>
              <ThemedText style={styles.subtitle}>Update your password to keep your account secure.</ThemedText>
            </View>

            <View style={styles.input_section}>
              <ThemedText style={styles.label}>Old Password</ThemedText>
              <View style={styles.input_container}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#999"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry
                  autoComplete="off"
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.input_section}>
              <ThemedText style={styles.label}>New Password</ThemedText>
              <View style={styles.input_container}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••••••"
                  placeholderTextColor="#999"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoComplete="off"
                  editable={!isLoading}
                />
              </View>
              <ThemedText style={styles.helpText}>Password must be at least 8 characters</ThemedText>
            </View>

            <Pressable
              style={[styles.saveButton, (!isFormValid || isLoading) && styles.saveButtonDisabled]}
              onPress={handleSave}
              disabled={!isFormValid || isLoading}
            >
              <LinearGradient
                colors={!isFormValid || isLoading ? ["#ccc", "#ccc"] : ["#ffc30fff", "#ff8e1eff", "#8a42ffff"]}
                style={styles.saveButtonGradient}
                start={[0, 0]}
                end={[1, 0.8]}
              >
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <ThemedText style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save"}</ThemedText>
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
  input_section: {
    width: "100%",
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8
  },
  input_container: {
    width: "100%"
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
  helpText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4
  },
  saveButton: {
    borderRadius: 12,
    width: "100%"
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
