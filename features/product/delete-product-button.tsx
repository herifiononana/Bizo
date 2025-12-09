import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";
function DeleteProductButton({
  item,
  callback,
}: {
  item: Product;
  callback: () => void;
}) {
  const { products, setProducts } = useProductsStore();
  const { sales, setSales } = useSalesStore();

  //   Supprimer un produit
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
    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteProduct}>
      <Text style={styles.deleteIcon}>🗑️</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: Colors.dark.danger + "33", // rouge léger pour fond
    borderRadius: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
});

export default DeleteProductButton;
