import { Colors } from "@/constants/theme";
import { Client } from "@/interface/client/client";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DeleteClientButton from "./delete-client-button";
import EditClientForm from "./edit-client-form";

function ClientListItem({ item }: { item: Client }) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <View style={styles.clientWrapper}>
        <TouchableOpacity
          style={styles.clientCard}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.name}>
            {item.civility} {item.name}
          </Text>

          <Text style={styles.info}>📞 {item.phone}</Text>

          {item.email ? <Text style={styles.info}>✉️ {item.email}</Text> : null}

          <Text style={styles.address}>📍 {item.address}</Text>
        </TouchableOpacity>

        {/* Bouton suppression */}
        <DeleteClientButton
          item={item}
          callback={() => setModalVisible(false)}
        />
      </View>

      {/* Modal édition */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <EditClientForm
            client={item}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

export default ClientListItem;

const styles = StyleSheet.create({
  clientWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    padding: 14,
  },

  clientCard: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark.text,
    marginBottom: 4,
  },

  info: {
    fontSize: 14,
    color: Colors.dark.icon,
  },

  address: {
    fontSize: 13,
    color: Colors.dark.icon,
    marginTop: 6,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    padding: 20,
  },
});
