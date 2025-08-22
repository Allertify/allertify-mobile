import { useState, useEffect } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useToken } from "@/hooks/useToken";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "expo-router";

export default function FullNameScreen() {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const router = useRouter();
  const { token } = useToken();
  const { user, isLoading: userLoading, refreshUser } = useUser();

  const { mutate: updateProfile, isPending } = useUpdateProfile();

  // Initialize form with current user data
  useEffect(() => {
    if (user?.fullName) {
      const nameParts = user.fullName.split(" ");
      onChangeFirstName(nameParts[0] || "");
      onChangeLastName(nameParts.slice(1).join(" ") || "");
    }
  }, [user]);

  const onSave = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "First name is required");
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

    updateProfile(
      {
        token,
        profileData: {
          full_name: fullName // Changed from fullName to full_name due to API endpoint
        }
      },
      {
        onSuccess: (data) => {
          // Refresh user data to reflect changes
          refreshUser();
          Alert.alert("Profile updated successfully");
          router.back();
        },
        onError: (error) => {
          Alert.alert("Error", `Failed to update profile: ${error.message}`);
        }
      }
    );
  };

  if (userLoading) {
    return <View style={styles.container}>{/* Add loading spinner component here if needed */}</View>;
  }

  return (
    <View style={styles.container}>
      <ThemedInput
        value={firstName}
        onChangeText={onChangeFirstName}
        placeholder="First Name"
        autoComplete="given-name"
      />
      <ThemedInput
        value={lastName}
        onChangeText={onChangeLastName}
        placeholder="Last Name"
        autoComplete="family-name"
      />
      <ThemedButton label="Save" onPress={onSave} disabled={isPending || !firstName.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16
  }
});
