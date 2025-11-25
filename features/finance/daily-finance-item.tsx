import { FinanceSummary } from "@/interface/finance/finance-summary";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

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
    <View key={dateKey} style={styles.card}>
      <Text style={styles.date}>{prettyDate}</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.label}>Ventes</Text>
          <Text style={styles.value}>
            {finance.totalSalesValue.toLocaleString()} Ar
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.label}>Cash</Text>
          <Text style={[styles.value, { color: "#22C55E" }]}>
            {finance.totalCashSales.toLocaleString()} Ar
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.label}>Crédit</Text>
          <Text style={[styles.value, { color: "#F97316" }]}>
            {finance.totalCreditSales.toLocaleString()} Ar
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.label}>Profit</Text>
          <Text style={[styles.value, { color: "#16A34A" }]}>
            +{finance.totalProfit.toLocaleString()} Ar
          </Text>
        </View>
      </View>
    </View>
  );
}

export default DailyFinanceItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1E293BEE",
    padding: 8,
    borderRadius: 12,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  date: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F1F5F9",
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "48%",
    marginBottom: 4,
    backgroundColor: "#334155",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    color: "#94A3B8",
  },
  value: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F1F5F9",
  },
});
