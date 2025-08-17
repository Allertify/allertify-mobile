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
        name="password"
        options={{
          headerTitle: "Change Password"
        }}
      />
    </Stack>
  );
}
