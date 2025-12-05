import { AddButton } from "@/components/add-button";
import AddProductForm from "@/features/product/add-product-form";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { saveProducts } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

function AddProductButton() {
  const { products, setProducts } = useProductsStore((state) => state);
  const { changeFinanceStatus } = useFinance();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddProduct = async (product: Product) => {
    const next = products ? [product, ...products] : [product];
    setProducts(next);
    await saveProducts(next);
    setModalVisible(false);
    changeFinanceStatus();
  };

  return (
    <>
      <View style={styles.addButtonContainer}>
        <AddButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal d'ajout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <AddProductForm
            onAddProduct={handleAddProduct}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default AddProductButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },

  // -------- Modal --------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
