import { useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

import { ThemedButton } from "@/components/ui/ThemedButton";
import { ThemedInput } from "@/components/ui/ThemedInput";
import { useUpdateProfile } from "@/hooks/useMutateProfile";
import { useToken } from "@/hooks/useToken";
import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "expo-router";

export default function FullNameScreen() {
  const [firstName, onChangeFirstName] = useState("");
  const [lastName, onChangeLastName] = useState("");
  const router = useRouter();
  const { token } = useToken();
  const { data: userData } = useUserData(token);

  const { mutate: updateProfile, isPending } = useUpdateProfile(
    token,
    `${firstName} ${lastName}`,
    userData.phone_number
  );

  const onSave = () => {
    updateProfile({ firstName, lastName });
    Alert.alert("Profile updated successfully");
    router.back();
  };

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
      <ThemedButton label="Save" onPress={onSave} disabled={isPending} />
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
