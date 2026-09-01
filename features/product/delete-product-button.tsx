import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { saveProducts } from "@/services/product";
import { saveSales } from "@/services/sale";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
function DeleteProductButton({ item }: { item: Product }) {
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
      <Entypo name="trash" size={18} color={Colors.dark.danger} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(244,63,94,0.10)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
});

export default DeleteProductButton;
