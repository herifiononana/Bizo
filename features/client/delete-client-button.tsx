import { Colors } from "@/constants/theme";
import { Client } from "@/interface/client/client";
import { saveClients } from "@/services/client";
import { saveOrders } from "@/services/order";
import { useClientsStore } from "@/stores/client.store";
import { useOrdersStore } from "@/stores/order.store";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity } from "react-native";

function DeleteClientButton({
  item,
  callback,
}: {
  item: Client;
  callback: () => void;
}) {
  const { clients, setClients } = useClientsStore();
  const { orders, setOrders } = useOrdersStore();

  const handleDeleteClient = () => {
    Alert.alert(
      "Supprimer le client",
      `Voulez-vous vraiment supprimer "${item.name}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!clients) return;

            const updatedClients = clients.filter((c) => c.id !== item.id);
            const updatedOrders =
              orders?.filter((o) => o.clientId !== item.id) ?? [];

            setClients(updatedClients);

            try {
              await saveClients(updatedClients);
              if (orders) {
                await saveOrders(updatedOrders);
                setOrders(updatedOrders);
              }
              callback();
            } catch (error) {
              console.error("Erreur suppression client", error);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteClient}>
      <Text style={styles.deleteIcon}>🗑️</Text>
    </TouchableOpacity>
  );
}

export default DeleteClientButton;
const styles = StyleSheet.create({
  deleteButton: {
    marginLeft: 8,
    padding: 6,
    backgroundColor: Colors.dark.danger + "33",
    borderRadius: 8,
  },
  deleteIcon: {
    fontSize: 16,
  },
});
