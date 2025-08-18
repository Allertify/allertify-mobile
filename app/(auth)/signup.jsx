import { Image, Pressable, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ui/ThemedText";
import Ionicons from "@expo/vector-icons/Ionicons";
import VeggiesDefault from "@/assets/veggies_default.png";

export default function SignUpScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.title_container}>
        <Pressable
          onPress={() => {
            router.push("/auth");
          }}
        >
          <Ionicons name="chevron-back-circle" size={35} color="#6327B7" />
        </Pressable>
        <ThemedText style={styles.title}>Sign Up</ThemedText>
      </View>
      <ThemedText style={styles.subtitle}>Let's get to know eachother!</ThemedText>

      <Image source={VeggiesDefault} style={styles.veggies} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#F7ECFF",
    alignItems: "center",
    padding: 30
  },

  title_container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20
  },

  title: {
    fontSize: 40,
    color: "#6327B7",
    textAlign: "center",
    marginBottom: 0
  },

  subtitle: {
    fontSize: 18,
    color: "#AB6FFE"
  },

  veggies: {
    alignSelf: "center",
    width: 500,
    height: 0
  }
});
