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
  const { history, setHistory } = useHistoryStore();

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
              if (history) {
                const data = [...sales, ...history];
                await saveHistory(data);
                setHistory(data);
              } else {
                setHistory(sales);
                await saveHistory(sales);
              }
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
        <Entypo name="trash" size={30} color={Colors.dark.accent} />
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
    padding: 10,
    backgroundColor: Colors.dark.primary,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
