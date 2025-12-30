import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import UpdateOrderButton from "./update-order-button";

interface OrderListItemProps {
  item: Order;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ item }) => {
  const onSend = () => {};
  return (
    <View style={styles.card}>
      {/* HEADER */}
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
        {item.order.map((p, index) => (
          <Text key={index} style={styles.productLine}>
            • {p.productName} × {p.quantity} ({p.unit})
          </Text>
        ))}
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <UpdateOrderButton order={item} />

        <TouchableOpacity
          style={[styles.actionBtn, styles.sendBtn]}
          onPress={onSend}
        >
          <Text style={[styles.actionText, styles.sendText]}>📤 Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
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
});
