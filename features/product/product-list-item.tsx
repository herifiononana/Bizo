import { PRODUCTS_KEY } from "@/constants/key-storage";
import { useProducts } from "@/hooks/product/useProduct";
import { Product } from "@/interface/product/product";
import { saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditProductForm from "./edit-product-form";

function ProductListItem({ item }: { item: Product }) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { products } = useProducts();
  const { setProducts } = useProductsStore();

  // Modifier un produit
  const handleEditProduct = async (updatedProduct: Product) => {
    if (!products) return;

    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);

    try {
      await saveData(PRODUCTS_KEY, updatedProducts);
    } catch (error) {
      console.error("Erreur sauvegarde produit", error);
    }

    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.productCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productDetails}>
            Quantité : {item.quantity} | Prix : {item.purchasePrice} Ar
          </Text>
        </View>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <EditProductForm
            onEditProduct={handleEditProduct}
            onCancel={() => setModalVisible(false)}
            product={item}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productDetails: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
});

export default ProductListItem;
