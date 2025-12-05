import { useProducts } from "@/hooks/product/useProduct";
import { useSale } from "@/hooks/sale/useSale";
import { exportAllDataToCSV, importAllDataFromCSV } from "@/libs/export-to-csv";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

const CsvButtons = () => {
  const { loadProducts } = useProducts();
  const { loadSales } = useSale();
  const handleExport = async () => {
    try {
      const path = await exportAllDataToCSV("backup_all");
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleExport}>
        <Ionicons name="download-outline" size={22} color="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconButton} onPress={handleImport}>
        <Ionicons name="cloud-upload-outline" size={22} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
};

export default CsvButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginVertical: 8,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "#1F2937",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
});
