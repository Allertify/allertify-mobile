import { Image, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/ThemedText";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ThemedText>Sign Ups</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    alignContent: "center",
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: "#F7ECFF",
    paddingTop: 50,
    paddingBottom: 50
  }
});
