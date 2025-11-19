import { PRODUCTS_KEY, SALES_KEY } from "@/constants/key-storage";
import { Sale } from "@/interface/sale/sale";
import { getFinance } from "@/services/finance";
import { getData, saveData } from "@/storage";
import { useFinanceSummaryStore } from "@/stores/finance.store";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React, { useEffect, useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text, View } from "react-native";

const Dashboard = () => {
  const { products, setProducts } = useProductsStore((state) => state);
  const { sales, setSales } = useSalesStore((state) => state);
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);

  const { finance: data, setFinance } = useFinanceSummaryStore(
    (state) => state
  );

  const handleFilterSales = (date: Date) => {
    if (!sales) return;

    setFilteredSales(
      sales.filter((sale) => {
        const saleDate = new Date(sale.saleDate);

        const isSameDay =
          saleDate.getFullYear() === date.getFullYear() &&
          saleDate.getMonth() === date.getMonth() &&
          saleDate.getDate() === date.getDate();

        return isSameDay;
      })
    );
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProducts = await getData(PRODUCTS_KEY);
        const storedSales = await getData(SALES_KEY);

        if (storedProducts) {
          setProducts(storedProducts);
        } else {
          setProducts([]);
          await saveData(PRODUCTS_KEY, []);
        }

        if (storedSales) {
          setSales(storedSales);
        } else {
          setSales([]);
          await saveData(SALES_KEY, []);
        }
      } catch (e) {
        console.log("Erreur de chargement :", e);
      }
    };

    loadData();
  }, [setProducts, setSales]);

  // --- Quand sales change → filtrer les ventes du jour ---
  useEffect(() => {
    if (sales) {
      handleFilterSales(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sales]);

  useEffect(() => {
    if (products && sales) {
      setFinance(getFinance({ products, sales: filteredSales }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, sales]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Titre */}
        <Text style={styles.title}>Tableau de bord</Text>
        <Text style={styles.subtitle}>
          Aperçu de vos statistiques en un coup d’œil 📊
        </Text>

        {/* Cartes de statistiques principales */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.cardBlue]}>
            <Text style={styles.statLabel}>Produits</Text>
            <Text style={styles.statValue}>{data?.totalProducts ?? 0}</Text>
            <Text style={styles.statHint}>articles en stock</Text>
          </View>

          <View style={[styles.statCard, styles.cardGreen]}>
            <Text style={styles.statLabel}>Valeur du stock</Text>
            <Text style={styles.statValue}>
              {data?.totalStockValue ?? 0} Ar
            </Text>
            <Text style={styles.statHint}>valeur totale</Text>
          </View>

          <View style={[styles.statCard, styles.cardYellow]}>
            <Text style={styles.statLabel}>Ventes totales</Text>
            <Text style={styles.statValue}>
              {data?.totalSalesValue ?? 0} Ar
            </Text>
            <Text style={styles.statHint}>cumul des ventes</Text>
          </View>

          <View style={[styles.statCard, styles.cardEmerald]}>
            <Text style={styles.statLabel}>Bénéfice total</Text>
            <Text style={styles.statValue}>+{data?.totalProfit ?? 0} Ar</Text>
            <Text style={styles.statHint}>revenu net</Text>
          </View>
        </View>

        {/* Bloc de résumé visuel */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Résumé financier</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Produits</Text>
              <Text style={styles.summaryValue}>
                {data?.totalProducts ?? 0}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Stock</Text>
              <Text style={styles.summaryValue}>
                {data?.totalStockValue ?? 0} Ar
              </Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Ventes</Text>
              <Text style={styles.summaryValue}>
                {data?.totalSalesValue ?? 0} Ar
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: "#16A34A" }]}>
                +{data?.totalProfit ?? 0} Ar
              </Text>
              <Text style={styles.summaryLabel}>Bénéfice</Text>
            </View>
          </View>
        </View>

        <Text style={styles.footerText}>
          Dernière mise à jour : {new Date().toLocaleDateString()}
        </Text>
      </ScrollView>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#475569",
    textAlign: "center",
    marginBottom: 24,
  },
  statsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    width: "48%",
    borderRadius: 18,
    paddingVertical: 22,
    paddingHorizontal: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  statLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0F172A",
  },
  statHint: {
    fontSize: 13,
    color: "#475569",
    marginTop: 4,
  },
  cardBlue: {
    backgroundColor: "#E0F2FE",
  },
  cardGreen: {
    backgroundColor: "#DCFCE7",
  },
  cardYellow: {
    backgroundColor: "#FEF9C3",
  },
  cardEmerald: {
    backgroundColor: "#D1FAE5",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
  },
  summaryLabel: {
    color: "#64748B",
    fontSize: 14,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  footerText: {
    marginTop: 28,
    fontSize: 13,
    color: "#94A3B8",
    textAlign: "center",
  },
});
