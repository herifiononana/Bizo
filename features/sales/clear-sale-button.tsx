import { Colors } from "@/constants/theme";
import { saveSales } from "@/services/sale";
import { useSalesStore } from "@/stores/sales.store";
import Entypo from "@expo/vector-icons/Entypo";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";

export function ClearSaleButton() {
  const { setSales } = useSalesStore();

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
            setSales([]);
            try {
              await saveSales([]);
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
