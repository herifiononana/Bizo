import { ModalTrigger } from "@/components/modal-trigger";
import { useUpdateSingleSale } from "@/hooks/sale/useUpdateSingleSale";
import { Sale } from "@/interface/sale/sale";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import UpdateSaleGroupForm from "./update-sale-group-form";

type EditSaleButtonProps = {
  sale: Sale;
  // Bouton d'ouverture personnalisable — par défaut une icône crayon.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.editButton} onPress={onPress}>
      <Entypo name="edit" size={16} color="#B7BFD8" />
    </TouchableOpacity>
  </View>
);

function EditSaleButton({ sale, trigger }: EditSaleButtonProps) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const { updateSingleSale } = useUpdateSingleSale();

  const handleUpdate = async (editedSales: Sale[]) => {
    setModalVisible(false);
    const success = await updateSingleSale(sale, editedSales);
    if (success) {
      Alert.alert("✅ Succès", "Vente modifiée avec succès !");
    } else {
      Alert.alert("Erreur", "Modification échouée, données restaurées.");
    }
  };

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
          <UpdateSaleGroupForm
            groupItems={[sale]}
            onUpdateGroup={handleUpdate}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default EditSaleButton;

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    backgroundColor: "rgba(255,255,255,0.04)",
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
});
