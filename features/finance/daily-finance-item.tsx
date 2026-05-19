import { FinanceSummary } from "@/interface/finance/finance-summary";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const DailyFinanceItem = React.memo(function DailyFinanceItem({
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
            {finance.totalProfit.toLocaleString()} Ar
          </Text>
        </View>
      </View>
    </View>
  );
});

export default DailyFinanceItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#0F1535",
    padding: 14,
    borderRadius: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    shadowColor: "rgba(0,212,255,0.08)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },

  date: {
    fontSize: 13,
    fontWeight: "700",
    color: "#8891B3",
    marginBottom: 10,
  },

  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
  },

  statItem: {
    width: "48%",
    backgroundColor: "#172049",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  label: {
    fontSize: 12,
    color: "#8891B3",
    marginBottom: 2,
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});
