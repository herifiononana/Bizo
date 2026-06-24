import { AddButton } from "@/components/add-button";
import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import CreateSaleForm from "./create-sale-form";
function CreateSaleButton() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { changeFinanceStatus } = useFinance();

  const { products, setProducts } = useProductsStore((state) => state);
  const { sales, setSales } = useSalesStore((state) => state);

  const handleAddSale = async (newSales: Sale[]) => {
    if (!products || !sales) return;

    const updatedSales = [...newSales, ...sales];
    setSales(updatedSales);

    let updatedProducts = [...products];
    for (const sale of newSales) {
      updatedProducts = updatedProducts.map((p) =>
        p.id === sale.productId
          ? { ...p, quantity: p.quantity - sale.quantity }
          : p
      );
    }

    try {
      await saveSales(updatedSales);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    changeFinanceStatus();
  };

  return (
    <>
      <View style={styles.addButtonContainer}>
        <AddButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal Nouvelle vente */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <CreateSaleForm
            onAddSale={handleAddSale}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default CreateSaleButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 90,
    right: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#141B33",
    borderRadius: 28,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 14,
    color: "#F4F6FF",
  },
});
