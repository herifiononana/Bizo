import { ModalTrigger } from "@/components/modal-trigger";
import EditProductForm from "@/features/product/edit-product-form";
import { Product } from "@/interface/product/product";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";

type EditProductButtonProps = {
  product: Product;
  // Bouton d'ouverture personnalisable — par défaut une icône crayon.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <Entypo name="edit" size={15} color="#B7BFD8" />
  </TouchableOpacity>
);

const EditProductButton = ({ product, trigger }: EditProductButtonProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      {trigger ? trigger({ onPress: () => setModalVisible(true) }) : (
        <DefaultTrigger onPress={() => setModalVisible(true)} />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <EditProductForm
            onCancel={() => setModalVisible(false)}
            product={product}
          />
        </View>
      </Modal>
    </>
  );
};

export default EditProductButton;

const styles = StyleSheet.create({
  actionBtn: {
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
});
