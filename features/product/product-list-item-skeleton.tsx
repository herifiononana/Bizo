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
            { width: "80%", height: 14, marginTop: 5 },
          ]}
        />
        <View
          style={[
            styles.skeletonBlock,
            { width: "50%", height: 14, marginTop: 5 },
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
    marginBottom: 8,
    backgroundColor: "#141B33",
    borderRadius: 7,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  card: {
    flex: 1,
    backgroundColor: "#141B33",
  },

  skeletonBlock: {
    backgroundColor: "#1B2342",
    borderRadius: 3,
  },

  deleteBtnSkeleton: {
    marginLeft: 6,
    width: 32,
    height: 32,
    backgroundColor: "#1B2342",
    borderRadius: 3,
  },
});
