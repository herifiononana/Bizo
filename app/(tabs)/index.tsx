import ActivationModal from "@/components/activation-modal";
import CsvButtons from "@/components/csv-button";
import { Colors } from "@/constants/theme";
import GlobalDashboard from "@/features/finance/global-dashboard";
import OtherInfo from "@/features/finance/other-info";
import AddReferenceButton from "@/features/reference/add-reference-button";
import ReferenceFilterModal from "@/features/reference/reference-filter";
import { useFinance } from "@/hooks/finance/useFinance";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const Dashboard = () => {
  const { selectedReference, setSelectedReference } = useFinance();

  return (
    <View style={styles.screen}>
      <ActivationModal />
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <CsvButtons />
      <AddReferenceButton />
      <ReferenceFilterModal {...{ selectedReference, setSelectedReference }} />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Tableau de bord</Text>
          <Text style={styles.subtitle}>Vue d’ensemble de votre activité</Text>
        </View>

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
  screen: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },

  container: { flex: 1 },

  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.dark.text,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 15,
    color: Colors.dark.icon,
    marginBottom: 22,
    textAlign: "center",
  },

  footerText: {
    marginTop: 25,
    fontSize: 12,
    color: Colors.dark.tabIconDefault,
    textAlign: "center",
  },
});
