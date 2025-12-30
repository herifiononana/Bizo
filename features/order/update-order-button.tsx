import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UpdateOrderForm from "./update-order-form";

function UpdateOrderButton({ order }: { order: Order }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.actionText}>✏️ Modifier</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <UpdateOrderForm
            order={order}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default UpdateOrderButton;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },

  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },

  editBtn: {
    borderColor: Colors.dark.border,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.text,
  },
});
