import { Colors } from "@/constants/theme";
import { saveSales } from "@/services/sale";
import { saveHistory } from "@/services/sale/history";
import { useHistoryStore } from "@/stores/history.store";
import { useSalesStore } from "@/stores/sales.store";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export function ClearSaleButton() {
  const { sales, setSales } = useSalesStore();
  const storedHistory = useHistoryStore((state) => state.storedHistory);
  const setStoredHistory = useHistoryStore((state) => state.setStoredHistory);

  const handleClear = () => {
    Alert.alert(
      "Supprimer l'historique des ventes",
      `Voulez-vous vraiment supprimer votre historique des ventes ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            if (!sales) return;
            try {
              const data = [...sales, ...(storedHistory ?? [])];
              await saveHistory(data);
              setStoredHistory(data);
              await saveSales([]);
              setSales([]);
            } catch (error) {
              console.error("Erreur suppression produit", error);
            }
          },
        },
      ]
    );
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
        <Entypo name="trash" size={26} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    right: 10,
  },

  iconButton: {
    padding: 12,
    backgroundColor: Colors.dark.accent,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.dark.accent,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
