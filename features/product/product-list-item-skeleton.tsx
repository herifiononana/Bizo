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
      <View style={styles.deleteBtnSkeleton} />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
    backgroundColor: "#0F1535",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  card: {
    flex: 1,
    backgroundColor: "#0F1535",
  },

  skeletonBlock: {
    backgroundColor: "#172049",
    borderRadius: 6,
  },

  deleteBtnSkeleton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    backgroundColor: "#172049",
    borderRadius: 10,
  },
});
