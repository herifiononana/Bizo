import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
import { saveOrders } from "@/services/order";
import { saveProducts } from "@/services/product";
import { useOrdersStore } from "@/stores/order.store";
import { useProductsStore } from "@/stores/product.store";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
function DeleteProductButton({
  item,
  callback,
}: {
  item: Product;
  callback: () => void;
}) {
  const { products, setProducts } = useProductsStore();
  const { orders, setOrders } = useOrdersStore();

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

            const updatedOrders =
              orders?.filter((o) => {
                o.order.filter((orderItem) => orderItem.productId !== item.id);
              }) ?? [];
            setProducts(updatedProducts);
            try {
              await saveProducts(updatedProducts);
              if (orders) {
                await saveOrders(updatedOrders);
                setOrders(updatedOrders);
              }
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
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.danger + "33",
  },
  deleteIcon: {
    fontSize: 16,
  },
});

export default DeleteProductButton;
