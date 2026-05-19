import React from "react";
import { StyleSheet, View } from "react-native";

export default function SaleListItemSkeleton() {
  return (
    <View style={styles.saleCard}>
      <View style={styles.row}>
        <View style={styles.skeletonBlockShort} />
        <View style={styles.skeletonBlockTiny} />
      </View>
      <View style={[styles.skeletonBlockFull, { marginTop: 10 }]} />
      <View style={[styles.skeletonBlockHalf, { marginTop: 8 }]} />
      <View style={[styles.creditSkeleton, { marginTop: 12, paddingVertical: 10, paddingHorizontal: 12 }]}>
        <View style={styles.row}>
          <View style={styles.skeletonBlockShort} />
          <View style={styles.skeletonBlockTiny} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  saleCard: {
    backgroundColor: "#141B33",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skeletonBlockShort: {
    width: "40%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
  skeletonBlockTiny: {
    width: "20%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
  skeletonBlockFull: {
    width: "100%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
  skeletonBlockHalf: {
    width: "60%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
  creditSkeleton: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: "rgba(249,115,22,0.22)",
    backgroundColor: "rgba(249,115,22,0.08)",
  },
});
