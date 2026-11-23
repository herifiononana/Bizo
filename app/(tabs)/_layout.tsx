import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { useExpiryCheck } from "@/hooks/product/useExpiryCheck";
import { Ionicons } from "@expo/vector-icons";
import { ColorValue } from "react-native";

// Ionicons n'accepte pas null ni number : on ne garde que les couleurs en chaîne.
const toIconColor = (color: ColorValue): string | undefined =>
  typeof color === "string" ? color : undefined;

export default function TabLayout() {
  useExpiryCheck();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F97316",
        tabBarInactiveTintColor: "#7A83A2",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -2,
        },
        tabBarStyle: {
          position: "absolute",
          bottom: 12,
          left: 12,
          right: 12,
          height: 68,
          borderRadius: 7,
          backgroundColor: "rgba(20,27,51,0.92)",
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.10)",
          elevation: 20,
          shadowColor: "#000",
          shadowOpacity: 0.45,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 8 },
          paddingBottom: 0,
          paddingHorizontal: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={22} color={toIconColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: "Ventes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" size={22} color={toIconColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="product"
        options={{
          title: "Produits",
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums-outline" size={22} color={toIconColor(color)} />
          ),
        }}
      />
      <Tabs.Screen
        name="dailyFinance"
        options={{
          title: "Historique",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={22} color={toIconColor(color)} />
          ),
        }}
      />
    </Tabs>
  );
}
