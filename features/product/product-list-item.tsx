import { PRODUCTS_STORAGE_KEY } from "@/constants/key-storage";
import { mockProducts } from "@/data/mock-product";
import { Product } from "@/interface/product/product";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import EditProductForm from "./edit-product-form";

function ProductListItem({
  item,
  refetch,
}: {
  item: Product;
  refetch: (products: Product[]) => void;
}) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      } else {
        setProducts(mockProducts);
        await AsyncStorage.setItem(
          PRODUCTS_STORAGE_KEY,
          JSON.stringify(mockProducts)
        );
      }
    } catch (error) {
      console.error("Erreur chargement produits", error);
    }
  };

  // Modifier un produit
  const handleEditProduct = async (updatedProduct: Product) => {
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);
    refetch(updatedProducts);

    try {
      await AsyncStorage.setItem(
        PRODUCTS_STORAGE_KEY,
        JSON.stringify(updatedProducts)
      );
    } catch (error) {
      console.error("Erreur sauvegarde produit", error);
    }

    setModalVisible(false);

    loadProducts();
  };

  // Charger les produits depuis AsyncStorage
  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div>
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
    </div>
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
