import { ThemedText } from "@/components/ui/ThemedText";
import { useRouter } from "expo-router";
import { ScrollView } from "react-native";

export default function onboarding() {
  const router = useRouter();

  return (
    <ScrollView>
      <ThemedText>Onboarding</ThemedText>
    </ScrollView>
  );
}
