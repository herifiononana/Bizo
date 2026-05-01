import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const SkeletonOtherInfo = () => {
  // 4 blocs (comme MiniBlocks)
  return (
    <>
      {/* Title skeleton */}
      <View style={styles.titleSkeleton} />

      {/* Repeating 5 blocks */}
      {[1, 2, 3, 4, 5].map((_, i) => (
        <View key={i} style={styles.row}>
          <View style={styles.circle} />
          <View style={{ flex: 1 }}>
            <View style={styles.lineShort} />
            <View style={styles.lineLong} />
          </View>
        </View>
      ))}
    </>
  );
};

export default SkeletonOtherInfo;

/* STYLES */
const styles = StyleSheet.create({
  titleSkeleton: {
    width: 160,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#172049",
    marginTop: 25,
    marginBottom: 12,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    backgroundColor: "#0F1535",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#172049",
    marginRight: 12,
  },

  lineShort: {
    width: "45%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#172049",
    marginBottom: 6,
  },

  lineLong: {
    width: "75%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#172049",
  },
});
