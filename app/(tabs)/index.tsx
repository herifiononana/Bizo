import GlobalDashboard from "@/features/finance/global-dashboard";
import OtherInfo from "@/features/finance/other-info";
import { useGoogleLogin } from "@/hooks/useGoogleLogin";
import { backupToCloud } from "@/lib/backupToCloud";
import { restoreBackup } from "@/lib/restoreBackup";
import * as AuthSession from "expo-auth-session";
import React from "react";
import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Dashboard = () => {
  const { login } = useGoogleLogin();
  console.log(":>>", AuthSession.makeRedirectUri());
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
        <View style={{ padding: 20 }}>
          <Button title="Connexion Google" onPress={login} />

          <View style={{ height: 20 }} />

          <Button
            title="Restaurer les données du cloud"
            onPress={async () => {
              const ok = await restoreBackup();
              alert(ok ? "Restauré !" : "Aucune sauvegarde trouvée.");
            }}
          />

          <View style={{ height: 20 }} />

          <Button
            title="Sauvegarder mes données en ligne"
            onPress={async () => {
              const ok = await backupToCloud();
              console.log("ok :>> ", ok);
              alert(ok ? "Sauvegardé !" : "Erreur de sauvegarde");
            }}
          />
        </View>

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
