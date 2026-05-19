import React from "react";
import { StyleSheet, View } from "react-native";
import StatCardSkeleton from "./stat-card-skeleton";

const DashboardSkeleton = () => {
  return (
    <View>
      <View style={styles.statContainer}>
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
      <View style={styles.statContainer}>
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
      <View style={styles.statContainer}>
        <StatCardSkeleton />
        <StatCardSkeleton />
      </View>
    </View>
  );
};

export default DashboardSkeleton;

const styles = StyleSheet.create({
  statContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
});
