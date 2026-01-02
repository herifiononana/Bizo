import { Colors } from "@/constants/theme";
import { exportAllOrdersDataToCSV } from "@/libs/export-to-csv";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

const SendOrdersButton = () => {
  const onSend = async () => {
    try {
      const fileName = `Commandes`;
      const path = await exportAllOrdersDataToCSV(fileName);
      if (path) Alert.alert("Export terminée", "Le fichier a été partagé.");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      Alert.alert("Erreur", "Export impossible.");
    }
  };

  return (
    <TouchableOpacity style={styles.addBtn} onPress={onSend}>
      <FontAwesome name="send" size={24} color={Colors.dark.accent} />
    </TouchableOpacity>
  );
};

export default SendOrdersButton;

const styles = StyleSheet.create({
  addBtn: {
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
