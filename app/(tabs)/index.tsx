import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface DashboardProps {
  products?: Product[];
  sales?: Sale[];
  finance?: FinanceSummary;
  navigation?: any; // si tu utilises React Navigation
}

const Dashboard: React.FC<DashboardProps> = ({
  products,
  sales,
  finance,
  navigation,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>

      {/* Bloc Finance */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Stock & Finances</Text>
        <Text style={styles.cardItem}>
          Nombre total de produits : {finance?.totalProducts ?? 0}
        </Text>
        <Text style={styles.cardItem}>
          Valeur du stock : {finance?.totalStockValue ?? 0} Ar
        </Text>
        <Text style={styles.cardItem}>
          Ventes totales : {finance?.totalSalesValue ?? 0} Ar
        </Text>
        <Text style={styles.cardItem}>
          Bénéfice total : {finance?.totalProfit ?? 0} Ar
        </Text>
      </View>

      {/* Navigation rapide */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Products")}
        >
          <Text style={styles.buttonText}>Produits</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Sales")}
        >
          <Text style={styles.buttonText}>Ventes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Finance")}
        >
          <Text style={styles.buttonText}>Finance</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  cardItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#4CAF50",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 10,
    marginVertical: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});

export default Dashboard;
