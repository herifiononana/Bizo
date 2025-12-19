import { AddButton } from "@/components/add-button";
import { Client } from "@/interface/client/client";
import { saveClients } from "@/services/client";
import { useClientsStore } from "@/stores/client.store";
import React, { useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import AddClientForm from "./add-client-form";

function AddClientButton() {
  const { clients, setClients } = useClientsStore((state) => state);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const handleAddClient = async (client: Client) => {
    const next = clients ? [client, ...clients] : [client];
    setClients(next);
    await saveClients(next);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.addButtonContainer}>
        <AddButton onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal d'ajout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <AddClientForm
            onAddClient={handleAddClient}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default AddClientButton;

const styles = StyleSheet.create({
  addButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },

  // -------- Modal --------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
