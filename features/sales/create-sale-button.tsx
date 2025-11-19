import { PRODUCTS_KEY, SALES_KEY } from "@/constants/key-storage";
import { useProducts } from "@/hooks/product/useProduct";
import { useSale } from "@/hooks/sale/useSale";
import { Sale } from "@/interface/sale/sale";
import { saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CreateSaleForm from "./create-sale-form";
function CreateSaleButton() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { products } = useProducts();
  const { sales } = useSale();

  const setProducts = useProductsStore(({ setProducts }) => setProducts);
  const setSales = useSalesStore(({ setSales }) => setSales);
  const handleAddSale = async (sale: Sale) => {
    if (!products || !sales) return;

    // 1. Mettre à jour les ventes
    const updatedSales = [...sales, sale];
    setSales(updatedSales);

    // 2. Mettre à jour le stock
    const updatedProducts = products.map((p) =>
      p.id === sale.productId
        ? { ...p, quantity: p.quantity - sale.quantity }
        : p
    );
    setProducts(updatedProducts);

    // 3. Sauvegarder dans AsyncStorage
    try {
      await saveData(SALES_KEY, updatedSales);
      await saveData(PRODUCTS_KEY, updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter une vente</Text>
      </TouchableOpacity>

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
  addButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
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
