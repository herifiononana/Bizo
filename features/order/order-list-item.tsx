import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import { exportSingleOrderToCSV } from "@/libs/export-to-csv";
import { useClientsStore } from "@/stores/client.store";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DeleteOrderButton from "./delete-order-button";
import OrderDetailsCard from "./order-details-card";
import UpdateOrderButton from "./update-order-button";

interface OrderListItemProps {
  item: Order;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ item }) => {
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const { clients } = useClientsStore();
  const onSend = async () => {
    try {
      const client = clients?.find((c) => c.id === item.clientId);
      const fileName = `Commande de ${client?.civility ?? ""} ${client?.name}`;
      const path = await exportSingleOrderToCSV(fileName, item);
      if (path) Alert.alert("Export terminée", "Le fichier a été partagé.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Alert.alert("Erreur", "Export impossible.");
    }
  };

  return (
    <>
      <View style={styles.card}>
        {/* HEADER */}
        <TouchableOpacity
          onPress={() => setOpenDetail(true)}
          activeOpacity={0.8}
        >
          <View style={styles.header}>
            <View>
              <Text style={styles.client}>{item.clientName}</Text>
              <Text style={styles.date}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString()
                  : "-"}
              </Text>
            </View>

            <Text style={styles.total}>{item.total.toLocaleString()} Ar</Text>
          </View>

          {/* PRODUITS */}
          <View style={styles.products}>
            <Text style={styles.productLine}>
              • {item.order[0].productName} × {item.order[0].quantity} (
              {item.order[0].unit})
            </Text>
            <Text style={styles.productLine}>• • •</Text>
          </View>
        </TouchableOpacity>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <UpdateOrderButton order={item} />

          <TouchableOpacity
            style={[styles.actionBtn, styles.sendBtn]}
            onPress={onSend}
          >
            <Text style={[styles.actionText, styles.sendText]}>📤 Envoyer</Text>
          </TouchableOpacity>

          <DeleteOrderButton order={item} />
        </View>
      </View>
      <Modal
        visible={openDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setOpenDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <OrderDetailsCard order={item} onClose={() => setOpenDetail(false)} />
        </View>
      </Modal>
    </>
  );
};

export default OrderListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  client: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark.text,
  },

  date: {
    fontSize: 13,
    color: Colors.dark.icon,
    marginTop: 2,
  },

  total: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark.success,
  },

  /* PRODUITS */
  products: {
    marginTop: 8,
    paddingLeft: 4,
  },

  productLine: {
    fontSize: 14,
    color: Colors.dark.text,
    marginBottom: 2,
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 10,
  },

  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
  },

  sendBtn: {
    backgroundColor: Colors.dark.accent,
    borderColor: Colors.dark.accent,
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  sendText: {
    color: "#fff",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
});
