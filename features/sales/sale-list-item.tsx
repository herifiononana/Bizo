import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type SaleListItemProps = {
  product: Product;
  item: Sale;
};
function SaleListItem({ product, item }: SaleListItemProps) {
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

      {/* Affichage si la vente est à crédit */}
      {item.isCredit && (
        <Text style={styles.creditLabel}>💳 Vente à crédit</Text>
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
  creditLabel: {
    color: "#B45309", // orange foncé pour se démarquer
    fontWeight: "600",
    marginTop: 4,
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
});
