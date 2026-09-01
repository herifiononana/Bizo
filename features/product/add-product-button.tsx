import { AddButton } from "@/components/add-button";
import { ModalTrigger } from "@/components/modal-trigger";
import AddProductForm from "@/features/product/add-product-form";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { saveProducts } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";

type AddProductButtonProps = {
  // Bouton d'ouverture personnalisable — par défaut le bouton "+" flottant.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <View style={styles.addButtonContainer}>
    <AddButton onPress={onPress} />
  </View>
);

function AddProductButton({ trigger }: AddProductButtonProps) {
  const { products, setProducts } = useProductsStore((state) => state);
  const { changeFinanceStatus } = useFinance();
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddProduct = async (product: Product) => {
    const next = products ? [product, ...products] : [product];
    setProducts(next);
    await saveProducts(next);
    setModalVisible(false);
    changeFinanceStatus();
  };

  return (
    <>
      {trigger ? trigger({ onPress: () => setModalVisible(true) }) : (
        <DefaultTrigger onPress={() => setModalVisible(true)} />
      )}

      {/* Modal d'ajout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <AddProductForm
            onAddProduct={handleAddProduct}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default AddProductButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 90,
    right: 18,
  },

  // -------- Modal --------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
