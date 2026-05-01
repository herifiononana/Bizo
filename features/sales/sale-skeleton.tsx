import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function SaleListItemSkeleton() {
  return (
    <View style={styles.saleCard}>
      {/* --- header --- */}
      <View style={styles.row}>
        <View style={styles.skeletonBlockShort} />
        <View style={styles.skeletonBlockTiny} />
      </View>

      {/* --- quantite / prix --- */}
      <View style={[styles.skeletonBlockFull, { marginTop: 8 }]} />

      {/* --- total --- */}
      <View style={[styles.skeletonBlockHalf, { marginTop: 8 }]} />

      {/* --- credit --- */}
      <View
        style={[
          styles.creditSkeleton,
          { marginTop: 10, paddingVertical: 6, paddingHorizontal: 8 },
        ]}
      >
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
    backgroundColor: "#0F1535",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
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
    backgroundColor: "#172049",
  },

  skeletonBlockTiny: {
    width: "20%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#172049",
  },

  skeletonBlockFull: {
    width: "100%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#172049",
  },

  skeletonBlockHalf: {
    width: "60%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#172049",
  },

  creditSkeleton: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "rgba(249,115,22,0.25)",
    backgroundColor: "rgba(249,115,22,0.10)",
  },
});
