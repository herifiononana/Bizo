import { AddButton } from "@/components/add-button";
import { PRODUCTS_KEY, SALES_KEY } from "@/constants/key-storage";
import { useFinance } from "@/hooks/finance/useFinance";
import { Sale } from "@/interface/sale/sale";
import { saveData } from "@/storage";
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

  const handleAddSale = async (sale: Sale) => {
    if (!products || !sales) return;

    // 1. Mettre à jour les ventes
    const updatedSales = [sale, ...sales];
    setSales(updatedSales);

    // 2. Mettre à jour le stock
    const updatedProducts = products.map((p) =>
      p.id === sale.productId
        ? { ...p, quantity: p.quantity - sale.quantity }
        : p
    );

    // 3. Sauvegarder dans AsyncStorage
    try {
      await saveData(SALES_KEY, updatedSales);
      await saveData(PRODUCTS_KEY, updatedProducts);
      setProducts(updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    // Mettre a jour l'etat de la finance
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
    bottom: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
});
