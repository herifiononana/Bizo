import ActivationModal from "@/components/activation-modal";
import CsvButtons from "@/components/csv-button";
import GlobalDashboard from "@/features/finance/global-dashboard";
import OtherInfo from "@/features/finance/other-info";
import AddReferenceButton from "@/features/reference/add-reference-button";
import ReferenceFilterModal from "@/features/reference/reference-filter";
import AiSuggestionsButton from "@/features/suggestions/ai-suggestions-button";
import { useFinance } from "@/hooks/finance/useFinance";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const Dashboard = () => {
  const { selectedReference, setSelectedReference } = useFinance();

  const todayLabel = format(new Date(), "EEEE d MMMM", { locale: fr });
  const todayCapitalized =
    todayLabel.charAt(0).toUpperCase() + todayLabel.slice(1);

  return (
    <View style={styles.screen}>
      <ActivationModal />
      <StatusBar barStyle="light-content" backgroundColor="#0C1224" />

      {/* Absolute-positioned action buttons — must stay outside ScrollView */}
      <CsvButtons />
      <AddReferenceButton />
      <ReferenceFilterModal
        selectedReference={selectedReference}
        setSelectedReference={setSelectedReference}
        top={205}
        right={10}
      />
      <AiSuggestionsButton />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Tableau de bord</Text>
            <Text
              style={styles.subtitle}
            >{`Vue d'ensemble · ${todayCapitalized}`}</Text>
          </View>
        </View>

        <GlobalDashboard />
        <OtherInfo />
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0C1224",
  },
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 120,
  },
  headerRow: {
    marginBottom: 24,
    paddingRight: 120,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "500",
    marginTop: 4,
    textTransform: "capitalize",
  },
});
