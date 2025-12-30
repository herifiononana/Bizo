import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const OrderListItemSkeleton = () => {
  return (
    <View style={styles.card}>
      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <View style={[styles.skeleton, styles.client]} />
          <View style={[styles.skeleton, styles.date]} />
        </View>

        <View style={[styles.skeleton, styles.total]} />
      </View>

      {/* PRODUITS */}
      <View style={styles.products}>
        <View style={[styles.skeleton, styles.productLine]} />
        <View style={[styles.skeleton, styles.productLineShort]} />
      </View>

      {/* ACTIONS */}
      <View style={styles.actions}>
        <View style={[styles.skeleton, styles.button]} />
        <View style={[styles.skeleton, styles.button]} />
      </View>
    </View>
  );
};

export default OrderListItemSkeleton;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  skeleton: {
    backgroundColor: Colors.dark.border,
    borderRadius: 6,
    opacity: 0.6,
  },

  /* HEADER */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  client: {
    width: 140,
    height: 16,
    marginBottom: 6,
  },

  date: {
    width: 90,
    height: 12,
  },

  total: {
    width: 80,
    height: 18,
  },

  /* PRODUITS */
  products: {
    marginTop: 10,
  },

  productLine: {
    width: "100%",
    height: 14,
    marginBottom: 6,
  },

  productLineShort: {
    width: "70%",
    height: 14,
  },

  /* ACTIONS */
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
    marginTop: 12,
  },

  button: {
    width: 90,
    height: 32,
    borderRadius: 8,
  },
});
