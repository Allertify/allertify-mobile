import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: "Satoshi-Bold"
        },
        headerShadowVisible: false,
        tabBarActiveTintColor: Colors.blue,
        tabBarLabelStyle: {
          fontFamily: "Satoshi-Bold"
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Allertify",
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "home" : "home-outline"} color={color} size={24} />
          )
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "barcode" : "barcode-outline"} color={color} size={24} />
          )
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "person" : "person-outline"} color={color} size={24} />
          )
        }}
      />
    </Tabs>
  );
}
