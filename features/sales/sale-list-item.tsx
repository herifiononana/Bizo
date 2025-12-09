import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { saveSales } from "@/services/sale";
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
      await saveSales(updatedSales);
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
        {item.salePrice.toFixed(2).toLocaleString()} Ar
      </Text>

      <Text style={styles.saleTotal}>
        💰 Total : {item.totalAmount.toFixed(2).toLocaleString()} Ar
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
    backgroundColor: Colors.dark.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: 10,
  },

  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  saleProduct: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  saleDate: {
    fontSize: 13,
    color: Colors.dark.icon,
  },

  saleDetails: {
    fontSize: 15,
    color: Colors.dark.text,
    marginTop: 6,
  },

  saleTotal: {
    fontSize: 15,
    color: Colors.dark.success,
    fontWeight: "600",
    marginTop: 4,
  },

  /* === Crédit === */
  creditContainer: {
    marginTop: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: Colors.dark.accent + "33", // accent translucide
    borderWidth: 1,
    borderColor: Colors.dark.accent,
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

  /* === Bouton Payé === */
  payButton: {
    backgroundColor: Colors.dark.success,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  payButtonText: {
    color: Colors.dark.background,
    fontWeight: "600",
    fontSize: 13,
  },
});
