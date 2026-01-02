import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import { saveOrders } from "@/services/order";
import { saveProducts } from "@/services/product";
import { useOrdersStore } from "@/stores/order.store";
import { useProductsStore } from "@/stores/product.store";
import { Entypo } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

function DeleteOrderButton({ order }: { order: Order }) {
  const { orders, setOrders } = useOrdersStore();
  const { products, setProducts } = useProductsStore();

  /* =========================
   * SUPPRESSION DE COMMANDE
   * ========================= */
  const onDelete = () => {
    Alert.alert(
      "🗑️ Supprimer la commande",
      "Cette action est irréversible. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: handleDeleteOrder,
        },
      ]
    );
  };
  const handleDeleteOrder = async () => {
    if (!orders || !products) return;

    /* 1️⃣ Supprimer la commande */
    const updatedOrders = orders.filter((o) => o.id !== order.id);

    /* 2️⃣ Restaurer le stock (UNIT-AWARE) */
    const updatedProducts = products.map((product) => {
      const impactedItems = order.order.filter(
        (i) => i.productId === product.id
      );

      if (impactedItems.length === 0) return product;

      // ✅ stockImpact est déjà en unité de base
      const restoreImpact = impactedItems.reduce(
        (sum, i) => sum + i.stockImpact,
        0
      );

      return {
        ...product,
        quantity: product.quantity + restoreImpact,
        updatedAt: new Date().toISOString(),
      };
    });

    /* 3️⃣ Sauvegarde */
    await saveOrders(updatedOrders);
    await saveProducts(updatedProducts);

    setOrders(updatedOrders);
    setProducts(updatedProducts);

    Alert.alert("✅ Succès", "Commande supprimée et stock restauré");
  };
  return (
    <TouchableOpacity
      style={[styles.actionBtn, styles.deleteBtn]}
      onPress={onDelete}
    >
      <Entypo name="trash" size={18} color={Colors.dark.danger} />
    </TouchableOpacity>
  );
}

export default DeleteOrderButton;

const styles = StyleSheet.create({
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  deleteBtn: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.danger + "33",
  },

  deleteText: {
    color: "#fff",
  },
});
