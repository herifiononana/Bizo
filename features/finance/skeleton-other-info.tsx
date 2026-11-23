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
    borderRadius: 3,
    backgroundColor: "#141B33",
    marginTop: 18,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 11,
    marginBottom: 5,
    backgroundColor: "#141B33",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 4,
    backgroundColor: "#1B2342",
    marginRight: 11,
  },
  lineShort: {
    width: "45%",
    height: 10,
    borderRadius: 3,
    backgroundColor: "#1B2342",
    marginBottom: 5,
  },
  lineLong: {
    width: "75%",
    height: 10,
    borderRadius: 3,
    backgroundColor: "#1B2342",
  },
});
