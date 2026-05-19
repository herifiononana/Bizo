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
      ],
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={handleClear}>
        <Entypo name="trash" size={24} color="#F43F5E" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 90,
    left: 18,
  },
  iconButton: {
    width: 46,
    height: 46,
    backgroundColor: "rgba(244,63,94,0.12)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.30)",
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
