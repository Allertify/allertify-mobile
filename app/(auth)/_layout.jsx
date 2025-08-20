import { AuthProvider } from "@/hooks/useAuthContext";
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="otp" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="login" />
      </Stack>
    </AuthProvider>
  );
}
