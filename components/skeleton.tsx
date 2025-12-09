import React from "react";
import { StyleSheet, View } from "react-native";

const Skeleton = ({ width = "100%", height = 20, radius = 6 }: any) => {
  return (
    <View
      style={{
        ...styles.skeleton,
        width: width as any,
        height,
        borderRadius: radius,
      }}
    />
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#2E2E33",
    opacity: 0.3,
    marginVertical: 6,
  },
});
