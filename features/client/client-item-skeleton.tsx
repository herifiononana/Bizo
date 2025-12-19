import { Colors } from "@/constants/theme";
import React from "react";
import { StyleSheet, View } from "react-native";

const SkeletonClientListItem = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        {/* Nom + civilité */}
        <View style={[styles.skeletonBlock, { width: "55%", height: 16 }]} />

        {/* Téléphone */}
        <View
          style={[
            styles.skeletonBlock,
            { width: "40%", height: 14, marginTop: 6 },
          ]}
        />

        {/* Email (facultatif) */}
        <View
          style={[
            styles.skeletonBlock,
            { width: "65%", height: 14, marginTop: 6 },
          ]}
        />

        {/* Adresse */}
        <View
          style={[
            styles.skeletonBlock,
            { width: "80%", height: 14, marginTop: 6 },
          ]}
        />
      </View>

      {/* Bouton supprimer */}
      <View style={styles.deleteBtnSkeleton} />
    </View>
  );
};

export default SkeletonClientListItem;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  card: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  skeletonBlock: {
    backgroundColor: Colors.dark.border, // gris neutre skeleton
    borderRadius: 6,
  },

  deleteBtnSkeleton: {
    marginLeft: 8,
    width: 30,
    height: 30,
    backgroundColor: Colors.dark.border,
    borderRadius: 8,
  },
});
