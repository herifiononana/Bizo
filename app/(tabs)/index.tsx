import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardProps {
  products?: Product[];
  sales?: Sale[];
  finance?: FinanceSummary;
  navigation?: any;
}

const Dashboard: React.FC<DashboardProps> = ({
  products,
  sales,
  finance,
  navigation,
}) => {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Tableau de bord</Text>

        {/* Résumé financier */}
        <View style={styles.cardContainer}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Aperçu du stock et des ventes</Text>
          </View>

          <View style={styles.cardContent}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Produits</Text>
              <Text style={styles.statValue}>
                {finance?.totalProducts ?? 0}
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Valeur du stock</Text>
              <Text style={styles.statValue}>
                {finance?.totalStockValue?.toLocaleString() ?? 0} Ar
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ventes totales</Text>
              <Text style={styles.statValue}>
                {finance?.totalSalesValue?.toLocaleString() ?? 0} Ar
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Bénéfice total</Text>
              <Text style={[styles.statValue, { color: "#16A34A" }]}>
                +{finance?.totalProfit?.toLocaleString() ?? 0} Ar
              </Text>
            </View>
          </View>
        </View>

        {/* Navigation rapide */}
        <Text style={styles.sectionTitle}>Navigation rapide</Text>

        <View style={styles.buttonGrid}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.navCard, { backgroundColor: "#E0F2FE" }]}
            onPress={() => navigation.navigate("Products")}
          >
            <Text style={styles.navText}>📦 Produits</Text>
            <Text style={styles.navSubText}>Gérer le stock</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.navCard, { backgroundColor: "#DCFCE7" }]}
            onPress={() => navigation.navigate("Sales")}
          >
            <Text style={styles.navText}>💰 Ventes</Text>
            <Text style={styles.navSubText}>Historique & ajout</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.navCard, { backgroundColor: "#FEF9C3" }]}
            onPress={() => navigation.navigate("Finance")}
          >
            <Text style={styles.navText}>📊 Finance</Text>
            <Text style={styles.navSubText}>Bilan global</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F1F5F9", // gris clair moderne
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
    color: "#111827",
  },
  cardContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingBottom: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
  },
  cardContent: {
    marginTop: 10,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  statLabel: {
    fontSize: 16,
    color: "#4B5563",
  },
  statValue: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
    marginLeft: 4,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  navCard: {
    width: "48%",
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 10,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  navSubText: {
    fontSize: 14,
    color: "#374151",
    marginTop: 4,
  },
});

export default Dashboard;
