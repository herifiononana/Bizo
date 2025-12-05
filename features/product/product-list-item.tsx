import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
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
  const { products, setProducts } = useProductsStore();
  const { sales, setSales } = useSalesStore();

  // Modifier un produit
  const handleEditProduct = async (updatedProduct: Product) => {
    if (!products) return;

    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );
    setProducts(updatedProducts);

    try {
      await saveProducts(updatedProducts);
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
            const updatedSales = sales
              ? sales.filter((s) => s.productId !== item.id)
              : [];
            setProducts(updatedProducts);
            setSales(updatedSales);
            try {
              await saveProducts(updatedProducts);
              await saveSales(updatedSales);
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
            Quantité :{" "}
            <Text style={styles.qty}>{item.quantity.toFixed(3)}</Text> | Prix
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
    backgroundColor: Colors.dark.surface, // surface sombre
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border, // bordure neutre
  },
  productName: {
    fontSize: 16,
    color: Colors.dark.text, // texte principal
    fontWeight: "600",
  },
  productDetails: {
    fontSize: 15,
    color: Colors.dark.icon, // texte secondaire
    marginTop: 4,
  },
  qty: {
    color: Colors.dark.info, // bleu
    fontWeight: "600",
  },
  purchase: {
    color: Colors.dark.danger, // rouge
    fontWeight: "600",
  },
  salePrice: {
    marginTop: 6,
    fontSize: 15,
    color: Colors.dark.success, // vert
  },
  sale: {
    color: Colors.dark.success,
    fontWeight: "700",
  },
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: Colors.dark.danger + "33", // rouge léger pour fond
    borderRadius: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // overlay plus visible en dark mode
    justifyContent: "center",
    padding: 20,
  },
});

export default ProductListItem;
