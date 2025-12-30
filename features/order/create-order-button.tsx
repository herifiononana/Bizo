import { AddButton } from "@/components/add-button";
import { useFinance } from "@/hooks/finance/useFinance";
import { Order } from "@/interface/order";
import { saveOrders } from "@/services/order";
import { saveProducts } from "@/services/product";
import { useOrdersStore } from "@/stores/order.store";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import CreateOrderForm from "./create-order-form";

function CreateOrderButton() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { changeFinanceStatus } = useFinance();

  const { products, setProducts } = useProductsStore((state) => state);
  const { orders, setOrders } = useOrdersStore((state) => state);

  const handleNewOrder = async (orderClient: Order) => {
    if (!products || !orders) return;

    /* 1️⃣ Mise à jour des commandes */
    const updatedOrders = [orderClient, ...orders];
    setOrders(updatedOrders);

    /* 2️⃣ Mise à jour du stock des produits */
    const updatedProducts = products.map((product) => {
      // lignes de commande qui concernent ce produit
      const relatedItems = orderClient.order.filter(
        (item) => item.productId === product.id
      );

      if (relatedItems.length === 0) return product;

      // total du stock à retirer
      const totalImpact = relatedItems.reduce(
        (sum, item) => sum + item.stockImpact,
        0
      );

      return {
        ...product,
        quantity: product.quantity - totalImpact,
        updatedAt: new Date().toISOString(),
      };
    });

    /* 3️⃣ Sauvegarde persistante */
    try {
      await saveOrders(updatedOrders);
      await saveProducts(updatedProducts);
      setProducts(updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    /* 4️⃣ Mise à jour finance */
    changeFinanceStatus();

    /* 5️⃣ Fermeture du modal */
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.addButtonContainer}>
        <AddButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal Nouvelle vente */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <CreateOrderForm
            onSubmit={handleNewOrder}
            onCancel={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
    </>
  );
}

export default CreateOrderButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
});
