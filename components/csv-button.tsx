import { useProducts } from "@/hooks/product/useProduct";
import { useSale } from "@/hooks/sale/useSale";
import { exportAllDataToCSV, importAllDataFromCSV } from "@/libs/export-to-csv";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PendingAction = "export" | "import" | null;

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => (
  <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <View style={styles.grabHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>

        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: confirmColor }]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const CsvButtons = () => {
  const { loadProducts } = useProducts();
  const { loadSales } = useSale();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const handleExport = async () => {
    try {
      const path = await exportAllDataToCSV("backup_bizo");
      if (path) Alert.alert("Export terminée", "Le fichier a été partagé.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Alert.alert("Erreur", "Export impossible.");
    }
  };

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
    }
  };

  const handleConfirmPendingAction = () => {
    const action = pendingAction;
    setPendingAction(null);
    if (action === "export") handleExport();
    if (action === "import") handleImport();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setPendingAction("export")}
      >
        <Ionicons name="download-outline" size={22} color="#00D4FF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setPendingAction("import")}
      >
        <Ionicons name="cloud-upload-outline" size={22} color="#00D4FF" />
      </TouchableOpacity>

      <ConfirmationModal
        visible={pendingAction === "export"}
        title="Exporter les données"
        message="Un fichier CSV contenant vos produits, ventes et références va être créé, puis vous pourrez le partager (email, stockage, etc.). Vos données locales ne sont pas modifiées."
        confirmLabel="Exporter"
        confirmColor="#00D4FF"
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />

      <ConfirmationModal
        visible={pendingAction === "import"}
        title="Importer des données"
        message="Cette action va remplacer définitivement toutes vos données locales actuelles (produits, ventes, références) par celles du fichier sélectionné. Cette action est irréversible."
        confirmLabel="Choisir un fichier et importer"
        confirmColor="#F43F5E"
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </View>
  );
};

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
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#B7BFD8",
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#0C1224",
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#B7BFD8",
  },
});
