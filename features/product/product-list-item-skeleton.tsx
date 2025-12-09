import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

export const SkeletonProductListItem = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={[styles.skeletonBlock, { width: "60%", height: 16 }]} />
        <View
          style={[
            styles.skeletonBlock,
            { width: "80%", height: 14, marginTop: 6 },
          ]}
        />
        <View
          style={[
            styles.skeletonBlock,
            { width: "50%", height: 14, marginTop: 6 },
          ]}
        />
      </View>

      <View style={styles.deleteBtnSkeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  skeletonBlock: {
    backgroundColor: Colors.dark.border, // gris doux
    borderRadius: 6,
  },

  deleteBtnSkeleton: {
    marginLeft: 8,
    width: 30,
    height: 30,
    backgroundColor: Colors.dark.border,
    borderRadius: 8,
  },
});
