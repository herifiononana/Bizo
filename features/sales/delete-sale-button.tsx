import PasswordPromptModal from "@/components/password-prompt-modal";
import { useDeleteDaySales } from "@/hooks/history/useDeleteDaySales";
import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import { Sale } from "@/interface/sale/sale";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

type DeleteSaleButtonProps = {
  salesToDelete: Sale[];
  confirmMessage: string;
};

// Bouton auto-suffisant : icône + confirmation + mot de passe + suppression avec restauration du stock.
const DeleteSaleButton = ({ salesToDelete, confirmMessage }: DeleteSaleButtonProps) => {
  const { hasPassword, verifyPassword } = useHistorySecurity();
  const { deleteDaySales } = useDeleteDaySales();
  const [passwordPromptVisible, setPasswordPromptVisible] = useState(false);

  const handlePress = () => {
    if (!hasPassword) {
      Alert.alert(
        "Mot de passe requis",
        "Configurez d'abord un mot de passe de suppression dans les réglages de l'historique."
      );
      return;
    }

    Alert.alert("Confirmer la suppression", confirmMessage, [
      { text: "Annuler", style: "cancel" },
      {
        text: "Supprimer",
        style: "destructive",
        onPress: () => setPasswordPromptVisible(true),
      },
    ]);
  };

  const handleConfirm = async (password: string) => {
    if (!verifyPassword(password)) return false;

    const success = await deleteDaySales(salesToDelete);
    setPasswordPromptVisible(false);
    if (success) {
      Alert.alert("✅ Succès", "Vente supprimée et stock restauré.");
    } else {
      Alert.alert("Erreur", "Suppression échouée, données restaurées.");
    }
    return true;
  };

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Ionicons name="trash-outline" size={14} color="#F43F5E" />
      </TouchableOpacity>

      <PasswordPromptModal
        visible={passwordPromptVisible}
        title="Confirmer la suppression"
        subtitle="Saisissez le mot de passe pour continuer."
        confirmLabel="Supprimer"
        onConfirm={handleConfirm}
        onCancel={() => setPasswordPromptVisible(false)}
      />
    </>
  );
};

export default DeleteSaleButton;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "rgba(244,63,94,0.10)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
});
