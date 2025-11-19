import { PRODUCTS_KEY } from "@/constants/key-storage";
import AddProductForm from "@/features/product/add-product-form";
import { useProducts } from "@/hooks/product/useProduct";
import { Product } from "@/interface/product/product";
import { saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

function AddProductButton() {
  const { products } = useProducts();
  const setProducts = useProductsStore(({ setProducts }) => setProducts);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddProduct = async (product: Product) => {
    const next = products ? [...products, product] : [product];
    setProducts(next);
    await saveData(PRODUCTS_KEY, next);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter un produit</Text>
      </TouchableOpacity>

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
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
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
