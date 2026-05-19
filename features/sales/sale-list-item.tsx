import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { saveSales } from "@/services/sale";
import { useSalesStore } from "@/stores/sales.store";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditSaleButton from "./edit-sale-button";

type SaleListItemProps = {
  product: Product;
  item: Sale;
};

const SaleListItem = React.memo(function SaleListItem({
  product,
  item,
}: SaleListItemProps) {
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);

  const handlePayCredit = async () => {
    if (!sales) return;
    const updatedSales = sales.map((sale) =>
      sale.id === item.id ? { ...item, isCredit: false } : sale
    );
    setSales(updatedSales);
    try {
      await saveSales(updatedSales);
      Alert.alert("✅ Succès", "Paiement réussi !");
    } catch (error) {
      console.error("Erreur de paiement", error);
      Alert.alert("Échec", "Paiement échoué !");
    }
  };

  const wasCreditNowPaid = !item.isCredit && !!item.clientName;

  const formattedDate = new Date(item.saleDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const detailText = item.isCredit || wasCreditNowPaid
    ? `Qté ${item.quantity} · ${item.salePrice.toLocaleString()} Ar/u · ${item.clientName}`
    : `Qté ${item.quantity} · ${item.salePrice.toLocaleString()} Ar/u`;

  return (
    <View style={styles.saleCard}>
      {/* Header row: name + badge | amount + date */}
      <View style={styles.topRow}>
        <View style={styles.nameRow}>
          <Text style={styles.saleProduct}>{product?.name}</Text>
          {item.isCredit ? (
            <View style={styles.badgeCredit}>
              <View style={styles.dot} />
              <Text style={styles.badgeCreditText}>Crédit</Text>
            </View>
          ) : wasCreditNowPaid ? (
            <View style={styles.badgePaid}>
              <View style={[styles.dot, { backgroundColor: "#2ECC71" }]} />
              <Text style={styles.badgePaidText}>Payé</Text>
            </View>
          ) : (
            <View style={styles.badgeCash}>
              <View style={[styles.dot, { backgroundColor: "#22D3EE" }]} />
              <Text style={styles.badgeCashText}>Cash</Text>
            </View>
          )}
        </View>
        <View style={styles.rightCol}>
          <Text style={styles.saleTotal}>
            {item.totalAmount.toLocaleString()} Ar
          </Text>
          <Text style={styles.saleDate}>{formattedDate}</Text>
        </View>
      </View>

      {/* Details row */}
      <Text style={styles.saleDetails}>{detailText}</Text>

      {/* Footer row */}
      <View style={styles.footerRow}>
        {item.isCredit ? (
          <>
            <View style={styles.footerLeft}>
              <Entypo name="time-slot" size={13} color="#7A83A2" />
              <Text style={styles.pendingText}>Paiement en attente</Text>
            </View>
            <View style={styles.footerActions}>
              <EditSaleButton sale={item} />
              <TouchableOpacity style={styles.payButton} onPress={handlePayCredit}>
                <Text style={styles.payButtonText}>Marquer payé</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : wasCreditNowPaid ? (
          <>
            <View style={styles.footerLeft}>
              <Entypo name="check" size={13} color="#2ECC71" />
              <Text style={styles.paidText}>Crédit remboursé</Text>
            </View>
            <EditSaleButton sale={item} />
          </>
        ) : (
          <View style={styles.footerRight}>
            <EditSaleButton sale={item} />
          </View>
        )}
      </View>
    </View>
  );
});

export default SaleListItem;

const styles = StyleSheet.create({
  saleCard: {
    backgroundColor: "#141B33",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    gap: 8,
  },
  rightCol: {
    alignItems: "flex-end",
    marginLeft: 8,
  },
  saleProduct: {
    fontSize: 17,
    fontWeight: "700",
    color: "#F4F6FF",
    letterSpacing: -0.3,
  },
  saleTotal: {
    fontSize: 18,
    color: "#2ECC71",
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  saleDate: {
    fontSize: 12,
    color: "#7A83A2",
    fontWeight: "500",
    marginTop: 2,
  },
  saleDetails: {
    fontSize: 13,
    color: "#B7BFD8",
    marginBottom: 10,
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  pendingText: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "500",
  },
  paidText: {
    fontSize: 13,
    color: "#2ECC71",
    fontWeight: "600",
  },
  payButton: {
    backgroundColor: "#F97316",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: "rgba(249,115,22,0.45)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  badgeCredit: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeCreditText: {
    fontSize: 12,
    color: "#FB923C",
    fontWeight: "700",
  },
  badgePaid: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(46,204,113,0.12)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgePaidText: {
    fontSize: 12,
    color: "#2ECC71",
    fontWeight: "700",
  },
  badgeCash: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(34,211,238,0.10)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgeCashText: {
    fontSize: 12,
    color: "#22D3EE",
    fontWeight: "700",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FB923C",
  },
});
