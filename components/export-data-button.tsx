import ConfirmationModal from "@/components/confirmation-modal";
import { ModalTrigger } from "@/components/modal-trigger";
import { exportAllDataToCSV } from "@/libs/export-to-csv";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

type ExportDataButtonProps = {
  // Bouton d'ouverture personnalisable — par défaut une icône export.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <Ionicons name="download-outline" size={22} color="#00D4FF" />
  </TouchableOpacity>
);

const ExportDataButton = ({ trigger }: ExportDataButtonProps) => {
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleExport = async () => {
    try {
      const path = await exportAllDataToCSV("backup_bizo");
      if (path) Alert.alert("Export terminée", "Le fichier a été partagé.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Alert.alert("Erreur", "Export impossible.");
    } finally {
      setConfirmVisible(false);
    }
  };

  return (
    <>
      {trigger ? trigger({ onPress: () => setConfirmVisible(true) }) : (
        <DefaultTrigger onPress={() => setConfirmVisible(true)} />
      )}

      <ConfirmationModal
        visible={confirmVisible}
        title="Exporter les données"
        message="Un fichier CSV contenant vos produits, ventes et références va être créé, puis vous pourrez le partager (email, stockage, etc.). Vos données locales ne sont pas modifiées."
        confirmLabel="Exporter"
        confirmColor="#00D4FF"
        onConfirm={handleExport}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
};

export default ExportDataButton;

const styles = StyleSheet.create({
  iconButton: {
    padding: 10,
    backgroundColor: "#141B33",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
