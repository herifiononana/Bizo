import { PRODUCTS_KEY } from "@/constants/key-storage";
import { useProducts } from "@/hooks/product/useProduct";
import { Product } from "@/interface/product/product";
import { saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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

  // Supprimer un produit
  const handleDeleteProduct = () => {
    Alert.alert(
      "Supprimer le produit",
      `Voulez-vous vraiment supprimer "${item.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!products) return;
            const updatedProducts = products.filter((p) => p.id !== item.id);
            setProducts(updatedProducts);
            try {
              await saveData(PRODUCTS_KEY, updatedProducts);
            } catch (error) {
              console.error("Erreur suppression produit", error);
            }
          },
        },
      ]
    );
  };

  return (
    <>
      <View style={styles.productWrapper}>
        <TouchableOpacity
          style={styles.productCard}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.productName}>{item.name}</Text>

          <Text style={styles.productDetails}>
            Quantité : <Text style={styles.qty}>{item.quantity}</Text> | Prix
            achat : <Text style={styles.purchase}>{item.purchasePrice} Ar</Text>
          </Text>

          {item.salePrice && (
            <Text style={styles.salePrice}>
              💰 Prix de vente :{" "}
              <Text style={styles.sale}>{item.salePrice} Ar</Text>
            </Text>
          )}
        </TouchableOpacity>

        {/* Bouton supprimer */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteProduct}
        >
          <Text style={styles.deleteIcon}>🗑️</Text>
        </TouchableOpacity>
      </View>

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
  productWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productName: {
    fontSize: 16,
  },
  productDetails: {
    fontSize: 15,
    color: "#475569",
    marginTop: 4,
  },
  qty: {
    color: "#0EA5E9",
    fontWeight: "600",
  },
  purchase: {
    color: "#DC2626",
    fontWeight: "600",
  },
  salePrice: {
    marginTop: 6,
    fontSize: 15,
    color: "#166534",
  },
  sale: {
    color: "#16A34A",
    fontWeight: "700",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
});

export default ProductListItem;
