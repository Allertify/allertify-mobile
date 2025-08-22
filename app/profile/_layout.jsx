import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
        headerTitleStyle: { fontFamily: "Satoshi-Bold" }
      }}
    >
      <Stack.Screen
        name="subscription"
        options={{
          headerTitle: "Subscription Plans"
        }}
      />
      <Stack.Screen name="allergens" />
      <Stack.Screen name="history" />
      <Stack.Screen name="products" />
      <Stack.Screen name="full-name" />
      <Stack.Screen name="email" />
      <Stack.Screen name="emergency-contact" />
    </Stack>
  );
}
