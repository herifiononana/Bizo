import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { saveSales } from "@/services/sale";
import { useSalesStore } from "@/stores/sales.store";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditSaleButton from "./edit-sale-button";

type SaleListItemProps = {
  product: Product;
  item: Sale;
};

function SaleListItem({ product, item }: SaleListItemProps) {
  const { sales, setSales } = useSalesStore();

  const handlePayCredit = async () => {
    if (!sales) return;
    const updatedSales = sales.map((sale) =>
      sale.id === item.id ? { ...item, isCredit: false } : sale
    );
    setSales(updatedSales);
    try {
      await saveSales(updatedSales);
      Alert.alert("✅ Succès", "paiement reussi !");
    } catch (error) {
      console.error("Erreur de paiement", error);
      Alert.alert("✅ Echec", "paiement echoue !");
    }
  };

  // todo : refactor inline style
  return (
    <View style={styles.saleCard}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.saleHeader}>
            <Text style={styles.saleProduct}>{product?.name}</Text>
          </View>
          <Text style={styles.saleDetails}>
            Qté : {item.quantity} | Prix unitaire :{" "}
            {item.salePrice.toFixed(2).toLocaleString()} Ar
          </Text>
          <Text style={styles.saleTotal}>
            💰 Total : {item.totalAmount.toFixed(2).toLocaleString()} Ar
          </Text>
        </View>

        <View style={{ display: "flex", justifyContent: "flex-end" }}>
          <Text style={styles.saleDate}>
            {new Date(item.saleDate).toLocaleDateString()}
          </Text>
          <EditSaleButton sale={item} />
        </View>
      </View>
      {/* Affichage si vente à crédit */}
      {item.isCredit && (
        <View style={styles.creditContainer}>
          <View style={styles.creditRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.creditLabel}>💳 Crédit</Text>
              {item.clientName ? (
                <Text style={styles.clientName}>👤 {item.clientName}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={styles.payButton}
              onPress={handlePayCredit}
            >
              <Text style={styles.payButtonText}>✓ Payé</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

export default SaleListItem;

const styles = StyleSheet.create({
  saleCard: {
    backgroundColor: "#0F1535",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginBottom: 10,
    shadowColor: "rgba(0,212,255,0.06)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },

  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  saleProduct: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  saleDate: {
    fontSize: 13,
    color: "#8891B3",
  },

  saleDetails: {
    fontSize: 14,
    color: "#8891B3",
    marginTop: 6,
  },

  saleTotal: {
    fontSize: 15,
    color: Colors.dark.success,
    fontWeight: "600",
    marginTop: 4,
  },

  creditContainer: {
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,22,0.10)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.25)",
  },

  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  creditLabel: {
    color: Colors.dark.accent,
    fontWeight: "600",
    fontSize: 13,
  },

  clientName: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.dark.danger,
  },

  payButton: {
    backgroundColor: Colors.dark.success,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  payButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 13,
  },
});
