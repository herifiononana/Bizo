import { ModalTrigger } from "@/components/modal-trigger";
import SecureConfirmModal from "@/components/secure-confirm-modal";
import { useProducts } from "@/hooks/product/useProduct";
import { useSale } from "@/hooks/sale/useSale";
import { importAllDataFromCSV } from "@/libs/export-to-csv";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

type ImportDataButtonProps = {
  // Bouton d'ouverture personnalisable — par défaut une icône import.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.iconButton} onPress={onPress}>
    <Ionicons name="cloud-upload-outline" size={22} color="#00D4FF" />
  </TouchableOpacity>
);

const ImportDataButton = ({ trigger }: ImportDataButtonProps) => {
  const { loadProducts } = useProducts();
  const { loadSales } = useSale();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const handleImport = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: "text/csv",
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const response: any = await importAllDataFromCSV(res.assets[0].uri);
      loadProducts();
      loadSales();
      Alert.alert(
        response?.success ? "Importation réussie" : "échec de l'importation",
        ""
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Alert.alert("Erreur", "Importation impossible.");
    } finally {
      setConfirmVisible(false);
    }
  };

  return (
    <>
      {trigger ? trigger({ onPress: () => setConfirmVisible(true) }) : (
        <DefaultTrigger onPress={() => setConfirmVisible(true)} />
      )}

      <SecureConfirmModal
        visible={confirmVisible}
        title="Importer des données"
        message="Cette action va remplacer définitivement toutes vos données locales actuelles (produits, ventes, références) par celles du fichier sélectionné. Cette action est irréversible."
        confirmLabel="Choisir un fichier et importer"
        confirmColor="#F43F5E"
        onConfirmed={handleImport}
        onCancel={() => setConfirmVisible(false)}
      />
    </>
  );
};

export default ImportDataButton;

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
