import { Colors } from "@/constants/theme";
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
    backgroundColor: Colors.dark.primary,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    elevation: 3,
  },

  date: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.dark.text,
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
    backgroundColor: Colors.dark.tint,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    shadowColor: Colors.dark.success,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },

  label: {
    fontSize: 12,
    color: Colors.dark.icon,
    marginBottom: 2,
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.dark.text,
  },
});
