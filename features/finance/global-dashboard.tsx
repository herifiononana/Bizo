import { useFinance } from "@/hooks/finance/useFinance";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import DashboardSkeleton from "./skeleton-dashboard";

type MiniCardProps = {
  label: string;
  value: string;
  sub: string;
  color: string;
  icon: string;
};

const MiniCard = ({ label, value, sub, color, icon }: MiniCardProps) => (
  <View style={styles.miniCard}>
    <View style={[styles.iconCircle, { backgroundColor: color + "26" }]}>
      <MaterialIcons name={icon as any} size={20} color={color} />
    </View>
    <Text style={styles.miniLabel}>{label}</Text>
    <Text style={[styles.miniValue, { color }]}>{value}</Text>
    <Text style={styles.miniSub}>{sub}</Text>
  </View>
);

function GlobalDashboard() {
  const { data: finance, loading } = useFinance();
  const sales = useSalesStore((state) => state.sales);
  const products = useProductsStore((state) => state.products);

  if (!finance || loading) return <DashboardSkeleton />;

  const today = new Date();
  const todaySales = (sales ?? []).filter((s) => {
    const d = new Date(s.saleDate);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  });

  const todayTotal = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
  const lowStockCount = (products ?? []).filter(
    (p) => p.quantity > 0 && p.quantity <= 3,
  ).length;
  const outOfStockCount = (products ?? []).filter(
    (p) => p.quantity === 0,
  ).length;
  const cashCount = (sales ?? []).filter(
    (s) => !s.isCredit && !s.clientName,
  ).length;
  const creditClients = new Set(
    (sales ?? [])
      .filter((s) => s.isCredit && s.clientName)
      .map((s) => s.clientName),
  ).size;

  const isProfit = finance.totalProfit >= 0;

  const profitPct =
    finance.totalSalesValue > 0
      ? ((finance.totalProfit / finance.totalSalesValue) * 100).toFixed(1)
      : null;

  const totalStockDisplay =
    finance.totalStockValue >= 1_000_000
      ? (finance.totalStockValue / 1_000_000).toFixed(1) + "M"
      : finance.totalStockValue >= 1_000
        ? (finance.totalStockValue / 1_000).toFixed(1) + "k"
        : finance.totalStockValue.toFixed(0);

  return (
    <View>
      {/* Hero KPI card */}
      <View style={styles.heroCard}>
        <View style={styles.heroHeader}>
          <Text style={styles.heroLabel}>BÉNÉFICE DU JOUR</Text>
          <View
            style={[
              styles.trendBadge,
              isProfit ? styles.trendUp : styles.trendDown,
            ]}
          >
            <View
              style={[
                styles.trendDot,
                { backgroundColor: isProfit ? "#2ECC71" : "#F43F5E" },
              ]}
            />
            <Text
              style={[
                styles.trendText,
                { color: isProfit ? "#2ECC71" : "#F43F5E" },
              ]}
            >
              {isProfit ? "en hausse" : "en baisse"}
            </Text>
          </View>
        </View>

        <View style={styles.heroValueRow}>
          <Text style={styles.heroValue}>
            {finance.totalProfit.toLocaleString()} Ar
          </Text>
          {profitPct !== null && (
            <Text
              style={[
                styles.heroPct,
                { color: isProfit ? "#2ECC71" : "#F43F5E" },
              ]}
            >
              {isProfit ? "+" : ""}
              {profitPct}%
            </Text>
          )}
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <View style={styles.heroSubRow}>
            <View>
              <Text style={styles.heroSubLabel}>Ventes du jour</Text>
              <Text style={styles.heroSubValue}>
                {todayTotal.toLocaleString()} Ar
              </Text>
            </View>
            <View style={styles.heroSubDivider} />
            <View>
              <Text style={styles.heroSubLabel}>Stock</Text>
              <Text style={styles.heroSubValue}>{totalStockDisplay}</Text>
            </View>
          </View>
          <View
            style={{
              width: 68,
              height: 48,
              borderRadius: 6,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2ECC7126",
            }}
          >
            <MaterialIcons name={"bar-chart"} size={30} color="#2ECC71" />
          </View>
        </View>
      </View>

      {/* 2×2 grid */}
      <View style={styles.grid}>
        <MiniCard
          label="Produits"
          value={String(finance.totalProducts)}
          sub={
            lowStockCount + outOfStockCount > 0
              ? `${lowStockCount + outOfStockCount} stock faible`
              : "Tout en stock"
          }
          color="#3B82F6"
          icon="inventory"
        />
        <MiniCard
          label="Ventes totales"
          value={finance.totalSalesValue.toLocaleString() + " Ar"}
          sub={`${(sales ?? []).length} transactions`}
          color="#FB923C"
          icon="show-chart"
        />
        <MiniCard
          label="Ventes cash"
          value={finance.totalCashSales.toLocaleString() + " Ar"}
          sub={`${cashCount} reçue${cashCount !== 1 ? "s" : ""}`}
          color="#22D3EE"
          icon="payments"
        />
        <MiniCard
          label="Crédit en cours"
          value={finance.totalCreditSales.toLocaleString() + " Ar"}
          sub={`${creditClients} client${creditClients !== 1 ? "s" : ""}`}
          color="#F43F5E"
          icon="credit-card"
        />
      </View>
    </View>
  );
}

export default GlobalDashboard;

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: "#141B33",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  heroHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  heroLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#7A83A2",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  trendUp: {
    backgroundColor: "rgba(46,204,113,0.12)",
  },
  trendDown: {
    backgroundColor: "rgba(244,63,94,0.12)",
  },
  trendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "700",
  },
  heroValueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    marginBottom: 14,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -1,
  },
  heroPct: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  heroSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  heroSubDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  heroSubLabel: {
    fontSize: 12,
    color: "#7A83A2",
    fontWeight: "500",
    marginBottom: 2,
  },
  heroSubValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F4F6FF",
    letterSpacing: -0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  miniCard: {
    width: "48%",
    borderRadius: 22,
    padding: 16,
    backgroundColor: "#141B33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  miniLabel: {
    fontSize: 12,
    color: "#7A83A2",
    fontWeight: "600",
    marginBottom: 4,
  },
  miniValue: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  miniSub: {
    fontSize: 12,
    color: "#545C7A",
    fontWeight: "500",
  },
});
