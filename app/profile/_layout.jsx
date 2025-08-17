import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Satoshi-Bold" }
      }}
    >
      <Stack.Screen
        name="history"
        options={{
          headerTitle: "Scan History"
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          headerTitle: "My Products"
        }}
      />
    </Stack>
  );
}
