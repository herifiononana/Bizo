import { Sale } from "@/interface/sale/sale";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import InvoicePreviewModal from "./invoice-preview-modal";

type InvoiceButtonProps = {
  // Ventes d'une même transaction (une vente simple ou un groupe).
  sales: Sale[];
};

const InvoiceButton = ({ sales }: InvoiceButtonProps) => {
  const [visible, setVisible] = useState(false);

  // Une perte d'expiration n'est pas une vente facturable.
  if (sales.length === 0 || sales.some((s) => s.isExpiredLoss)) return null;

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <MaterialIcons name="receipt-long" size={14} color="#22D3EE" />
      </TouchableOpacity>
      {visible && (
        <InvoicePreviewModal sales={sales} onClose={() => setVisible(false)} />
      )}
    </>
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
