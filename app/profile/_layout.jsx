import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Satoshi-Bold" }
      }}
    >
      <Stack.Screen
        name="history"
        options={{
          headerShown: true,
          headerTitle: "Scan History"
        }}
      />
      <Stack.Screen
        name="products"
        options={{
          headerShown: true,
          headerTitle: "My Products"
        }}
      />
      <Stack.Screen
        name="full-name"
        options={{
          headerTitle: "Change Full Name"
        }}
      />
      <Stack.Screen
        name="email"
        options={{
          headerTitle: "Change Email"
        }}
      />
      <Stack.Screen
        name="emergency-contact"
        options={{
          headerTitle: "Change Emergency Contact"
        }}
      />
      <Stack.Screen
        name="allergens"
        options={{
          headerTitle: "Change Allergens"
        }}
      />
    </Stack>
  );
}
