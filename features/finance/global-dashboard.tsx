import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import ReferenceFilter from "../reference/reference-filter";

type StatProps = { label: string; value: any; color: string; icon: string };
const StatCard = ({ label, value, color, icon }: StatProps) => (
  <View style={[styles.statCard, { backgroundColor: color }]}>
    <MaterialIcons name={icon as any} size={26} color={Colors.dark.primary} />
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
  </View>
);

const data = (financeSummary: FinanceSummary): StatProps[] => {
  const {
    totalProducts,
    totalStockValue,
    totalSalesValue,
    totalCashSales,
    totalCreditSales,
    totalProfit,
  } = financeSummary;

  return [
    {
      label: "Produits",
      value: totalProducts,
      color: "#E0F2FE",
      icon: "inventory",
    },
    {
      label: "Valeur du stock",
      value: totalStockValue?.toFixed(2) ?? 0 + "Ar",
      color: "#DCFCE7",
      icon: "monetization-on",
    },
    {
      label: "Ventes totales",
      value: totalSalesValue?.toFixed(2) ?? 0 + "Ar",
      color: "#FEF9C3",
      icon: "show-chart",
    },
    {
      label: "Ventes Cash",
      value: totalCashSales?.toFixed(2) ?? 0 + " Ar",
      color: "#D1FAE5",
      icon: "payments",
    },
    {
      label: "Crédit",
      value: totalCreditSales?.toFixed(2) ?? 0 + " Ar",
      color: "#FEE2E2",
      icon: "credit-card",
    },
    {
      label: "Bénéfice",
      value: (totalProfit.toFixed(2) ?? 0) + "Ar",
      color: "#BBF7D0",
      icon: "trending-up",
    },
  ];
};

function GlobalDashboard() {
  const {
    data: finance,
    selectedReference,
    setSelectedReference,
  } = useFinance();

  //   todo : ajouter un skeleton
  if (!finance) return <></>;

  return (
    <>
      <ReferenceFilter {...{ selectedReference, setSelectedReference }} />
      <View style={styles.statsGrid}>
        {data(finance).map((finance) => (
          <StatCard key={finance.label} {...{ ...finance }} />
        ))}
      </View>
    </>
  );
}

export default GlobalDashboard;

/* -------------------
   STYLES
--------------------*/
const styles = StyleSheet.create({
  /* CARDS WRAPPER */
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  /* SINGLE CARD */
  statCard: {
    width: "48%",
    borderRadius: 16,
    padding: 18,
    marginVertical: 8,

    // theme (fond gris très léger)
    backgroundColor: Colors.dark.card,
  },

  statLabel: {
    fontSize: 14,
    color: Colors.dark.primary, // texte secondaire
    marginTop: 8,
  },

  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.dark.primary, // texte principal
  },
});
