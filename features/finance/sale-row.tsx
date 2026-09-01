import { Sale } from "@/interface/sale/sale";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type SaleRowProps = {
  sale: Sale;
  productName: string;
  onDelete: () => void;
};

const SaleRow = ({ sale, productName, onDelete }: SaleRowProps) => {
  const formattedDate = new Date(sale.saleDate).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.productName} numberOfLines={1}>
          {productName} ×{sale.quantity}
        </Text>
        <Text style={styles.meta}>
          {formattedDate} · {sale.totalAmount.toLocaleString()} Ar
        </Text>
      </View>
      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Ionicons name="trash-outline" size={16} color="#F43F5E" />
      </TouchableOpacity>
    </View>
  );
};

export default SaleRow;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  productName: {
    color: "#F4F6FF",
    fontWeight: "600",
    fontSize: 14,
  },
  meta: {
    color: "#7A83A2",
    fontSize: 12,
    marginTop: 2,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(244,63,94,0.10)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
});
