import ExportDataButton from "@/components/export-data-button";
import SellerSettingsModal from "@/features/invoice/seller-settings-modal";
import ImportDataButton from "@/components/import-data-button";
import React from "react";
import { StyleSheet, View } from "react-native";

// Regroupe les boutons export/import CSV et infos vendeur (factures), positionnés en colonne en haut à droite.
const CsvButtons = () => (
  <View style={styles.container}>
    <ExportDataButton />
    <ImportDataButton />
    <SellerSettingsModal />
  </View>
);

export default CsvButtons;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: 10,
    flexDirection: "column",
    gap: 11, // boutons de 44 px, pas de 55 px comme la pile en dessous
    zIndex: 999,
  },
});
