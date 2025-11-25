import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { FinanceSummary } from "@/interface/finance/finance-summary";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
function DailyFinanceItem({
  dateKey,
  finance,
}: {
  dateKey: string;
  finance: FinanceSummary;
}) {
  const prettyDate = format(new Date(dateKey), "EEEE d MMMM yyyy", {
    locale: fr,
  });
  return (
    <View key={dateKey} style={styles.dayCard}>
      <Text style={styles.dayTitle}>{prettyDate}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Ventes totales</Text>
        <Text style={styles.value}>
          {finance.totalSalesValue.toLocaleString()} Ar
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Ventes Cash</Text>
        <Text style={styles.value}>
          {finance.totalCashSales.toLocaleString()} Ar
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={[styles.label, { color: "#B45309" }]}>Ventes Crédit</Text>
        <Text style={[styles.value, { color: "#B45309" }]}>
          {finance.totalCreditSales.toLocaleString()} Ar
        </Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Bénéfice</Text>
        <Text style={[styles.value, { color: "#16A34A" }]}>
          {finance.totalProfit.toLocaleString()} Ar
        </Text>
      </View>
    </View>
  );
}

export default DailyFinanceItem;

const styles = StyleSheet.create({
  dayCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#0F172A",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { color: "#64748B", fontSize: 15 },
  value: { color: "#0F172A", fontSize: 16, fontWeight: "700" },

  empty: { textAlign: "center", color: "#64748B", marginTop: 20 },
});
