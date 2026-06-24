import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  items: Sale[];
  productMap: Map<string, Product>;
};

const SaleGroupExpandedItems = React.memo(function SaleGroupExpandedItems({
  items,
  productMap,
}: Props) {
  return (
    <View style={styles.expandedList}>
      {items.map((s, i) => {
        const p = productMap.get(s.productId);
        return (
          <View
            key={s.id}
            style={[
              styles.expandedItem,
              i < items.length - 1 && styles.expandedItemBorder,
            ]}
          >
            <Text style={styles.expandedItemName} numberOfLines={1}>
              {p?.name ?? "?"}
            </Text>
            <Text style={styles.expandedItemDetail}>
              Qté {s.quantity} · {s.salePrice.toLocaleString()} Ar/u ={" "}
              {s.totalAmount.toLocaleString()} Ar
            </Text>
          </View>
        );
      })}
    </View>
  );
});

export default SaleGroupExpandedItems;

const styles = StyleSheet.create({
  expandedList: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 4,
  },
  expandedItem: {
    paddingVertical: 6,
  },
  expandedItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
  },
  expandedItemName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F4F6FF",
  },
  expandedItemDetail: {
    fontSize: 12,
    color: "#7A83A2",
    marginTop: 2,
  },
});
