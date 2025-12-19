import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  // const colorScheme = useColorScheme() ?? "dark";
  const colorScheme = "dark";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].accent, // Orange
        tabBarInactiveTintColor: Colors[colorScheme].icon, // Gris neutre
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors[colorScheme].background, // BG dynamique
          borderTopWidth: 0.5,
          borderTopColor: Colors[colorScheme].border, // Border palette
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sales"
        options={{
          title: "Ventes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="card-outline" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="product"
        options={{
          title: "Produits",
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="client"
        options={{
          title: "Client",
          tabBarIcon: ({ color }) => (
            <Entypo name="users" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="order"
        options={{
          title: "Commande",
          tabBarIcon: ({ color }) => (
            <AntDesign name="ordered-list" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dailyFinance"
        options={{
          title: "Historique",
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
