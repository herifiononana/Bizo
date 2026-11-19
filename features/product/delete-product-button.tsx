import { Colors } from "@/constants/theme";
import { useDeleteProducts } from "@/hooks/product/useDeleteProducts";
import { Product } from "@/interface/product/product";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { showDeleteProductsAlert } from "./show-delete-products-alert";

function DeleteProductButton({ item }: { item: Product }) {
  const { deleteProducts } = useDeleteProducts();

  const handleDeleteProduct = () => {
    showDeleteProductsAlert({
      title: "Supprimer le produit",
      message: `Voulez-vous vraiment supprimer "${item.name}" ?`,
      onChoose: async (keepHistory) => {
        const success = await deleteProducts(new Set([item.id]), keepHistory);
        if (!success) console.error("Erreur suppression produit", item.id);
      },
    });
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
