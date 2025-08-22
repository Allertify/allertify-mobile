import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { fontFamily: "Satoshi-Bold" }
      }}
    >
      <Stack.Screen
        name="subscription"
        options={{
          headerTitle: "Subscription Plans"
        }}
      />
      <Stack.Screen
        name="allergens"
        options={{
          headerShown: false
        }}
      />
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
          headerTitle: "Change Emergency Contact",
          headerShown: false
        }}
      />
    </Stack>
  );
}
