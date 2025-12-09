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
    borderRadius: 10,
    backgroundColor: Colors.dark.surface,
  },

  // animation pulsation
  pulse: {
    opacity: 0.6,
  },

  circle: {
    width: 28,
    height: 28,
    borderRadius: 50,
    backgroundColor: Colors.dark.border,
    marginBottom: 10,
  },

  lineShort: {
    width: "45%",
    height: 12,
    borderRadius: 4,
    backgroundColor: Colors.dark.border,
    marginBottom: 8,
  },

  lineLong: {
    width: "65%",
    height: 14,
    borderRadius: 4,
    backgroundColor: Colors.dark.border,
  },
});
