import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarStyle: { 
          backgroundColor: Colors.backgroundCard,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              color={focused ? Colors.primary : Colors.textLight} 
              size={size} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="vagas"
        options={{
          title: "Vagas",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "briefcase" : "briefcase-outline"} 
              color={focused ? Colors.primary : Colors.textLight} 
              size={size} 
            />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused, size }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              color={focused ? Colors.primary : Colors.textLight} 
              size={size} 
            />
          ),
        }}
      />
    </Tabs>
  );
}