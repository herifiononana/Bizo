import { FinanceSummary } from "@/interface/finance/finance-summary";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const DailyFinanceItem = React.memo(function DailyFinanceItem({
  dateKey,
  finance,
  onPress,
}: {
  dateKey: string;
  finance: FinanceSummary;
  onPress?: () => void;
}) {
  const prettyDate = format(new Date(dateKey), "EEEE d MMMM yyyy", {
    locale: fr,
  });

  const isProfit = finance.totalProfit >= 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.85}
    >
      {/* Date header + Profit/Perte badge */}
      <View style={styles.cardHeader}>
        <View style={styles.dateRow}>
          <View style={styles.calIcon}>
            <Text style={styles.calIconText}>📅</Text>
          </View>
          <View>
            <Text style={styles.date}>{prettyDate}</Text>
          </View>
        </View>
        <View
          style={[
            styles.profitBadge,
            isProfit ? styles.profitBadgeUp : styles.profitBadgeDown,
          ]}
        >
          <View
            style={[
              styles.profitDot,
              { backgroundColor: isProfit ? "#2ECC71" : "#F43F5E" },
            ]}
          />
          <Text
            style={[
              styles.profitBadgeText,
              { color: isProfit ? "#2ECC71" : "#F43F5E" },
            ]}
          >
            {isProfit ? "Profit" : "Perte"}
          </Text>
        </View>
      </View>

      {/* 2×2 stats grid */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.label}>VENTES</Text>
          <Text style={styles.value}>
            {finance.totalSalesValue.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>CASH</Text>
          <Text style={[styles.value, { color: "#22D3EE" }]}>
            {finance.totalCashSales.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>CRÉDIT</Text>
          <Text style={[styles.value, { color: "#FB923C" }]}>
            {finance.totalCreditSales.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>PROFIT</Text>
          <Text
            style={[
              styles.value,
              { color: isProfit ? "#2ECC71" : "#F43F5E" },
            ]}
          >
            {finance.totalProfit.toLocaleString()} Ar
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

export default DailyFinanceItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#141B33",
    padding: 18,
    borderRadius: 22,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  calIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,22,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  calIconText: {
    fontSize: 16,
  },
  date: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F4F6FF",
    textTransform: "capitalize",
    letterSpacing: -0.2,
  },
  profitBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  profitBadgeUp: {
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  profitBadgeDown: {
    backgroundColor: "rgba(244,63,94,0.12)",
  },
  profitDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  profitBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  label: {
    fontSize: 11,
    color: "#545C7A",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.3,
  },
});
