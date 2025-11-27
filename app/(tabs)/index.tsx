import GlobalDashboard from "@/features/finance/global-dashboard";
import OtherInfo from "@/features/finance/other-info";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const Dashboard = () => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>Vue d’ensemble de votre activité</Text>

        {/* CARDS PRINCIPALES */}
        <GlobalDashboard />

        {/* LISTES DYNAMIQUES */}
        <OtherInfo />

        <Text style={styles.footerText}>
          Mise à jour : {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

/* -------------------
   STYLES
--------------------*/
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F8FAFC" },
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#475569",
    marginBottom: 22,
    textAlign: "center",
  },
  footerText: {
    marginTop: 25,
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
});
