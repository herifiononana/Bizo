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
    padding: 18,
    borderRadius: 22,
    backgroundColor: "#141B33",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  pulse: {
    opacity: 0.7,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1B2342",
    marginBottom: 12,
  },
  lineShort: {
    width: "45%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#1B2342",
    marginBottom: 8,
  },
  lineLong: {
    width: "65%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
});
