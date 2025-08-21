import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0
    }
  }
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Satoshi-Bold": require("../assets/fonts/Satoshi-Bold.otf")
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
          <Stack.Screen
            name="product/[productId]"
            options={{
              headerTitle: "Product Details",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontFamily: "Satoshi-Bold"
              },
              headerShadowVisible: false
            }}
          />
          <Stack.Screen
            name="scan/[scanId]"
            options={{
              headerTitle: "Scan Details",
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontFamily: "Satoshi-Bold"
              },
              headerShadowVisible: false
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
