import ExportDataButton from "@/components/export-data-button";
import ImportDataButton from "@/components/import-data-button";
import React from "react";
import { StyleSheet, View } from "react-native";

// Regroupe les boutons export/import CSV, positionnés en colonne en haut à droite.
const CsvButtons = () => (
  <View style={styles.container}>
    <ExportDataButton />
    <ImportDataButton />
  </View>
);

export default CsvButtons;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 10,
    flexDirection: "column",
    gap: 10,
    zIndex: 999,
  },
});
