import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DashboardSkeleton from "./skeleton-dashboard";

type StatProps = { label: string; value: any; color: string; icon: string };
const StatCard = ({ label, value, color, icon }: StatProps) => (
  <View style={styles.statCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + "26" }]}>
      <MaterialIcons name={icon as any} size={22} color={color} />
    </View>
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
      color: "#3B82F6",
      icon: "inventory",
    },
    {
      label: "Valeur du stock",
      value: totalStockValue?.toFixed(2) ?? 0 + "Ar",
      color: "#22C55E",
      icon: "monetization-on",
    },
    {
      label: "Ventes totales",
      value: totalSalesValue?.toFixed(2) ?? 0 + "Ar",
      color: "#F97316",
      icon: "show-chart",
    },
    {
      label: "Ventes Cash",
      value: totalCashSales?.toFixed(2) ?? 0 + " Ar",
      color: "#00D4FF",
      icon: "payments",
    },
    {
      label: "Crédit",
      value: totalCreditSales?.toFixed(2) ?? 0 + " Ar",
      color: "#EF4444",
      icon: "credit-card",
    },
    {
      label: "Bénéfice",
      value: (totalProfit.toFixed(2) ?? 0) + "Ar",
      color: "#16A34A",
      icon: "trending-up",
    },
  ];
};

function GlobalDashboard() {
  const { data: finance, loading } = useFinance();

  if (!finance || loading) return <DashboardSkeleton />;

  return (
    <View style={styles.statsGrid}>
      {data(finance).map((finance) => (
        <StatCard key={finance.label} {...{ ...finance }} />
      ))}
    </View>
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

  statCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginVertical: 8,
    backgroundColor: "#172049",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "rgba(0,212,255,0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 13,
    color: "#8891B3",
    marginTop: 4,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
});
