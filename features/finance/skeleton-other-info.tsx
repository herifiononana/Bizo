import React from "react";
import { StyleSheet, View } from "react-native";

const SkeletonOtherInfo = () => {
  return (
    <>
      <View style={styles.titleSkeleton} />
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

const styles = StyleSheet.create({
  titleSkeleton: {
    width: 160,
    height: 18,
    borderRadius: 8,
    backgroundColor: "#141B33",
    marginTop: 24,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    marginBottom: 6,
    backgroundColor: "#141B33",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#1B2342",
    marginRight: 14,
  },
  lineShort: {
    width: "45%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#1B2342",
    marginBottom: 6,
  },
  lineLong: {
    width: "75%",
    height: 10,
    borderRadius: 6,
    backgroundColor: "#1B2342",
  },
});
