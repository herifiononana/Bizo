import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const StatCardSkeleton = () => {
  return (
    <View style={[styles.card, styles.pulse]}>
      <View style={styles.circle} />
      <View style={styles.lineShort} />
      <View style={styles.lineLong} />
    </View>
  );
};

export default StatCardSkeleton;

const styles = StyleSheet.create({
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#0F1535",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  pulse: {
    opacity: 0.7,
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#172049",
    marginBottom: 10,
  },

  lineShort: {
    width: "45%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#172049",
    marginBottom: 8,
  },

  lineLong: {
    width: "65%",
    height: 14,
    borderRadius: 4,
    backgroundColor: "#172049",
  },
});
