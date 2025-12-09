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
    backgroundColor: Colors.dark.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
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
    backgroundColor: Colors.dark.border,
  },

  skeletonBlockTiny: {
    width: "20%",
    height: 14,
    borderRadius: 6,
    backgroundColor: Colors.dark.border,
  },

  skeletonBlockFull: {
    width: "100%",
    height: 14,
    borderRadius: 6,
    backgroundColor: Colors.dark.border,
  },

  skeletonBlockHalf: {
    width: "60%",
    height: 14,
    borderRadius: 6,
    backgroundColor: Colors.dark.border,
  },

  creditSkeleton: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: Colors.dark.accent,
    backgroundColor: Colors.dark.accent + "33",
  },
});
