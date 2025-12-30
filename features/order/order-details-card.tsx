import { Colors } from "@/constants/theme";
import { Order } from "@/interface/order";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface OrderDetailsCardProps {
  order: Order;
  onClose: () => void;
}

const OrderDetailsCard: React.FC<OrderDetailsCardProps> = ({
  order,
  onClose,
}) => {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.client}>{order.clientName}</Text>
        <Text style={styles.date}>
          {order.createdAt
            ? new Date(order.createdAt).toLocaleDateString()
            : "-"}
        </Text>{" "}
      </View>
      <TouchableOpacity onPress={onClose} style={styles.closeContainer}>
        <Text style={styles.close}>✕</Text>
      </TouchableOpacity>
      {/* LISTE DES PRODUITS */}
      <ScrollView style={styles.lines}>
        {order.order.map((item, index) => (
          <View key={index} style={styles.line}>
            <View style={styles.lineHeader}>
              <Text style={styles.product}>{item.productName}</Text>
              <Text style={styles.subTotal}>
                {item.subTotal.toLocaleString()} Ar
              </Text>
            </View>

            <View style={styles.lineDetails}>
              <Text style={styles.detail}>
                Quantité : {item.quantity} {item.unit}
              </Text>
              <Text style={styles.detail}>
                Prix unitaire : {item.unitPrice.toLocaleString()} Ar
              </Text>
              <Text style={styles.stockImpact}>
                Impact stock : -{item.stockImpact}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* TOTAL */}
      <View style={styles.footer}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{order.total.toLocaleString()} Ar</Text>
      </View>
    </View>
  );
};

export default OrderDetailsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 16,
    padding: 16,
    maxHeight: "90%",
    position: "relative",
  },

  /* HEADER */
  header: {
    marginBottom: 12,
  },

  client: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.text,
  },

  date: {
    fontSize: 13,
    color: Colors.dark.icon,
    marginTop: 2,
  },

  /* LIGNES */
  lines: {
    marginTop: 10,
  },

  line: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
    paddingVertical: 10,
  },

  lineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  product: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.dark.text,
  },

  subTotal: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.dark.success,
  },

  lineDetails: {
    marginLeft: 4,
  },

  detail: {
    fontSize: 13,
    color: Colors.dark.text,
  },

  stockImpact: {
    fontSize: 12,
    color: Colors.dark.danger,
    marginTop: 2,
  },

  /* FOOTER */
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.dark.text,
  },

  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.dark.success,
  },

  closeContainer: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  close: {
    fontSize: 18,
    color: Colors.dark.danger,
    fontWeight: "700",
  },
});
