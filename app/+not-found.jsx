import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Oops! Not Found",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: "Satoshi-Bold",
          },
        }}
      />
      <View style={styles.container}>
        <ThemedText style={styles.text}>This screen does not exist.</ThemedText>
        <Link href="/(tabs)" style={styles.link}>
          Go back to Home screen.
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  link: {
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
