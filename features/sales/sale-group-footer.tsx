import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  isCredit: boolean;
  wasCreditNowPaid: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onPayCredit: () => void;
};

const SaleGroupFooter = React.memo(function SaleGroupFooter({
  isCredit,
  wasCreditNowPaid,
  expanded,
  onToggleExpand,
  onEdit,
  onPayCredit,
}: Props) {
  return (
    <View style={styles.footerRow}>
      <View style={styles.footerLeft}>
        {isCredit ? (
          <>
            <Entypo name="time-slot" size={13} color="#7A83A2" />
            <Text style={styles.pendingText}>Paiement en attente</Text>
          </>
        ) : wasCreditNowPaid ? (
          <>
            <Entypo name="check" size={13} color="#2ECC71" />
            <Text style={styles.paidText}>Crédit remboursé</Text>
          </>
        ) : null}
      </View>

      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.expandBtn} onPress={onToggleExpand}>
          <MaterialIcons
            name={expanded ? "expand-less" : "expand-more"}
            size={20}
            color="#7A83A2"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.editButton} onPress={onEdit}>
          <MaterialIcons name="edit" size={14} color="#A78BFA" />
        </TouchableOpacity>
        {isCredit && (
          <TouchableOpacity style={styles.payButton} onPress={onPayCredit}>
            <Text style={styles.payButtonText}>Marquer payé</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});

export default SaleGroupFooter;

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  expandBtn: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(167,139,250,0.12)",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(167,139,250,0.25)",
  },
  payButton: {
    backgroundColor: "#F97316",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: "rgba(249,115,22,0.45)",
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  pendingText: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "500",
  },
  paidText: {
    fontSize: 13,
    color: "#2ECC71",
    fontWeight: "600",
  },
});
