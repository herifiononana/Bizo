import PasswordPromptModal from "@/components/password-prompt-modal";
import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import { useDeleteProducts } from "@/hooks/product/useDeleteProducts";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { showDeleteProductsAlert } from "./show-delete-products-alert";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type DeleteSelectedProductsBarProps = {
  selectedIds: Set<string>;
  onDeleted: () => void;
};

// Barre auto-suffisante : confirmation + mot de passe + suppression groupée.
const DeleteSelectedProductsBar = ({
  selectedIds,
  onDeleted,
}: DeleteSelectedProductsBarProps) => {
  const { hasPassword, verifyPassword } = useHistorySecurity();
  const { deleteProducts, countLinkedSales } = useDeleteProducts();
  const [passwordPromptVisible, setPasswordPromptVisible] = useState(false);
  const [keepHistory, setKeepHistory] = useState(true);

  const selectedCount = selectedIds.size;
  const isDisabled = selectedCount === 0;

  const handlePress = () => {
    if (!hasPassword) {
      Alert.alert(
        "Mot de passe requis",
        "Configurez d'abord un mot de passe de suppression dans les réglages de l'historique."
      );
      return;
    }

    const linkedSalesCount = countLinkedSales(selectedIds);
    showDeleteProductsAlert({
      title: `Supprimer ${selectedCount} produit${selectedCount > 1 ? "s" : ""} ?`,
      message: `${linkedSalesCount} vente${linkedSalesCount > 1 ? "s" : ""} liée${
        linkedSalesCount > 1 ? "s" : ""
      }.`,
      onChoose: (shouldKeepHistory) => {
        setKeepHistory(shouldKeepHistory);
        setPasswordPromptVisible(true);
      },
    });
  };

  const handleConfirm = async (password: string) => {
    if (!verifyPassword(password)) return false;

    const success = await deleteProducts(selectedIds, keepHistory);
    setPasswordPromptVisible(false);
    if (success) {
      onDeleted();
    } else {
      Alert.alert("Erreur", "Suppression échouée, données restaurées.");
    }
    return true;
  };

  return (
    <>
      <View style={styles.bar}>
        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          disabled={isDisabled}
          onPress={handlePress}
        >
          <Ionicons name="trash-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Supprimer ({selectedCount})</Text>
        </TouchableOpacity>
      </View>

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

const styles = StyleSheet.create({
  // Au-dessus de la barre d'onglets flottante (bottom 12 + hauteur 68).
  bar: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 92,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F43F5E",
    paddingVertical: 14,
    borderRadius: 5,
    elevation: 6,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default DeleteSelectedProductsBar;
