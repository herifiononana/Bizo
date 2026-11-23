import { useInvoice } from "@/hooks/invoice/useInvoice";
import { InvoiceFormat } from "@/interface/invoice/invoice";
import { Sale } from "@/interface/sale/sale";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

type InvoiceButtonProps = {
  // Ventes d'une même transaction (une vente simple ou un groupe).
  sales: Sale[];
};

const MESSAGES = {
  "no-seller": [
    "Informations vendeur manquantes",
    "Renseignez le nom de la société et le téléphone depuis le tableau de bord (icône boutique).",
  ],
  unavailable: ["Partage indisponible", "Le partage de fichiers n'est pas disponible sur cet appareil."],
  error: ["Erreur", "Impossible de générer la facture."],
} as const;

const InvoiceButton = ({ sales }: InvoiceButtonProps) => {
  const { shareInvoice } = useInvoice();

  // Une perte d'expiration n'est pas une vente facturable.
  if (sales.length === 0 || sales.some((s) => s.isExpiredLoss)) return null;

  const generate = async (format: InvoiceFormat) => {
    const result = await shareInvoice(sales, format);
    if (result !== "shared") {
      const [title, message] = MESSAGES[result];
      Alert.alert(title, message);
    }
  };

  const handlePress = () =>
    Alert.alert("Facture", "Choisir le format du PDF à partager.", [
      { text: "A4", onPress: () => generate("a4") },
      { text: "Ticket 80 mm", onPress: () => generate("ticket80") },
      { text: "Annuler", style: "cancel" },
    ]);

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <MaterialIcons name="receipt-long" size={14} color="#22D3EE" />
    </TouchableOpacity>
  );
};

export default InvoiceButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.25)",
    backgroundColor: "rgba(34,211,238,0.10)",
  },
});
