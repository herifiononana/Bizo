import { SALES_KEY } from "@/constants/key-storage";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { saveData } from "@/storage";
import { useSalesStore } from "@/stores/sales.store";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      await saveData(SALES_KEY, updatedSales);
      Alert.alert("✅ Succès", "paiement reussi !");
    } catch (error) {
      console.error("Erreur de paiement", error);
      Alert.alert("✅ Echec", "paiement echoue !");
    }
  };

  return (
    <View style={styles.saleCard}>
      <View style={styles.saleHeader}>
        <Text style={styles.saleProduct}>{product?.name}</Text>
        <Text style={styles.saleDate}>
          {new Date(item.saleDate).toLocaleDateString()}
        </Text>
      </View>

      <Text style={styles.saleDetails}>
        Qté : {item.quantity} | Prix unitaire :{" "}
        {item.salePrice.toLocaleString()} Ar
      </Text>

      <Text style={styles.saleTotal}>
        💰 Total : {item.totalAmount.toLocaleString()} Ar
      </Text>

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
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saleProduct: { fontSize: 17, fontWeight: "600", color: "#0F172A" },
  saleDate: { fontSize: 13, color: "#64748B" },
  saleDetails: { fontSize: 15, color: "#475569", marginTop: 6 },
  saleTotal: {
    fontSize: 15,
    color: "#16A34A",
    fontWeight: "600",
    marginTop: 4,
  },

  /* === Crédit === */
  creditContainer: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#FFFBEB",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  creditLabel: {
    color: "#B45309",
    fontWeight: "600",
    fontSize: 13,
  },
  clientName: {
    marginTop: 2,
    fontSize: 12,
    color: "#7C2D12",
  },

  /* === Bouton Payé === */
  payButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  payButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
});
