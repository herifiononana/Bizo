import { Colors } from "@/constants/theme";
import { Sale } from "@/interface/sale/sale";
import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import UpdateSaleForm from "./update-sale-form";

function EditSaleButton({ sale }: { sale: Sale }) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setModalVisible(true)}
      >
        <Entypo name="edit" size={18} color={Colors.dark.text} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <UpdateSaleForm onCancel={() => setModalVisible(false)} sale={sale} />
        </View>
      </Modal>
    </View>
  );
}

export default EditSaleButton;

const styles = StyleSheet.create({
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 1,
  },
  editButton: {
    marginLeft: 8,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.text + "33",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // overlay plus visible en dark mode
    justifyContent: "center",
    padding: 20,
  },
});
