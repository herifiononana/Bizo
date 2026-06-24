import SaleGroupExpandedItems from "@/features/sales/sale-group-expanded-items";
import SaleGroupFooter from "@/features/sales/sale-group-footer";
import SaleGroupTopRow from "@/features/sales/sale-group-top-row";
import UpdateSaleGroupForm from "@/features/sales/update-sale-group-form";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { saveSales, updateSaleGroup } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SaleGroupItemProps = {
  items: Sale[];
  productMap: Map<string, Product>;
};

const SaleGroupItem = React.memo(function SaleGroupItem({
  items,
  productMap,
}: SaleGroupItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const sales = useSalesStore((state) => state.sales);
  const setSales = useSalesStore((state) => state.setSales);
  const { products, setProducts } = useProductsStore((state) => state);
  const { changeFinanceStatus } = useFinance();

  const firstItem = items[0];
  const isCredit = firstItem.isCredit ?? false;
  const wasCreditNowPaid = !firstItem.isCredit && !!firstItem.clientName;
  const groupId = firstItem.groupId;
  const totalAmount = items.reduce((sum, s) => sum + s.totalAmount, 0);

  const formattedDate = new Date(firstItem.saleDate).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const productsSummary = items
    .map((s) => {
      const p = productMap.get(s.productId);
      return p ? `${p.name} ×${s.quantity}` : "?";
    })
    .join(" · ");

  const handleUpdateGroup = async (newSales: Sale[]) => {
    if (!products || !sales || !groupId) return;

    const snapshotSales = sales;
    const snapshotProducts = products;

    const origQtyMap = new Map<string, number>();
    for (const s of items) {
      origQtyMap.set(s.productId, (origQtyMap.get(s.productId) ?? 0) + s.quantity);
    }
    const newQtyMap = new Map<string, number>();
    for (const s of newSales) {
      newQtyMap.set(s.productId, (newQtyMap.get(s.productId) ?? 0) + s.quantity);
    }
    const allProductIds = new Set([...origQtyMap.keys(), ...newQtyMap.keys()]);

    const updatedProducts = products.map((p) => {
      if (!allProductIds.has(p.id)) return p;
      const orig = origQtyMap.get(p.id) ?? 0;
      const next = newQtyMap.get(p.id) ?? 0;
      return { ...p, quantity: p.quantity + orig - next };
    });

    const updatedSales = updateSaleGroup(groupId, newSales, sales);
    setSales(updatedSales);
    setEditModalVisible(false);

    try {
      await saveSales(updatedSales);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
      changeFinanceStatus();
      Alert.alert("✅ Succès", "Vente modifiée avec succès !");
    } catch {
      setSales(snapshotSales);
      setProducts(snapshotProducts);
      Alert.alert("Erreur", "Modification échouée, données restaurées.");
    }
  };

  const handlePayCredit = async () => {
    if (!sales) return;
    const updatedSales = sales.map((sale) =>
      sale.groupId === groupId ? { ...sale, isCredit: false } : sale,
    );
    setSales(updatedSales);
    try {
      await saveSales(updatedSales);
      Alert.alert("✅ Succès", "Paiement réussi !");
    } catch {
      Alert.alert("Échec", "Paiement échoué !");
    }
  };

  return (
    <>
      <View style={styles.saleCard}>
        <SaleGroupTopRow
          itemCount={items.length}
          isCredit={isCredit}
          wasCreditNowPaid={wasCreditNowPaid}
          totalAmount={totalAmount}
          formattedDate={formattedDate}
        />

        <TouchableOpacity onPress={() => setExpanded(!expanded)}>
          <Text
            style={styles.productsSummary}
            numberOfLines={expanded ? undefined : 1}
          >
            {productsSummary}
          </Text>
        </TouchableOpacity>

        {(isCredit || wasCreditNowPaid) && firstItem.clientName ? (
          <Text style={styles.clientName}>{firstItem.clientName}</Text>
        ) : null}

        {expanded && (
          <SaleGroupExpandedItems items={items} productMap={productMap} />
        )}

        <SaleGroupFooter
          isCredit={isCredit}
          wasCreditNowPaid={wasCreditNowPaid}
          expanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
          onEdit={() => setEditModalVisible(true)}
          onPayCredit={handlePayCredit}
        />
      </View>

      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <UpdateSaleGroupForm
            groupItems={items}
            onUpdateGroup={handleUpdateGroup}
            onCancel={() => setEditModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
});

export default SaleGroupItem;

const styles = StyleSheet.create({
  saleCard: {
    backgroundColor: "#141B33",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.2)",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  productsSummary: {
    fontSize: 13,
    color: "#B7BFD8",
    marginBottom: 6,
    lineHeight: 20,
  },
  clientName: {
    fontSize: 12,
    color: "#7A83A2",
    marginBottom: 8,
    fontStyle: "italic",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
});
