import { ModalTrigger } from "@/components/modal-trigger";
import PasswordPromptModal from "@/components/password-prompt-modal";
import { OTHER_REFERENCE } from "@/constants/constants";
import { useDeleteDaySales } from "@/hooks/history/useDeleteDaySales";
import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import { useReference } from "@/hooks/reference/useRefecence";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { filterSalesByReference, getFinance } from "@/services/finance";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ReferenceBreakdown = {
  id: string;
  name: string;
  summary: FinanceSummary;
};

type FinanceDetailModalProps = {
  // Bouton d'ouverture personnalisable — dépend du contexte (carte jour, carte période…), pas de défaut générique possible.
  trigger: ModalTrigger;
  title: string;
  sales: Sale[];
  products: Product[];
  // Présent uniquement pour une journée précise — absent pour la vue "Période" (plusieurs jours).
  dateKey?: string;
};

const ReferenceSummaryRow = ({
  name,
  summary,
}: {
  name: string;
  summary: FinanceSummary;
}) => {
  const isProfit = summary.totalProfit >= 0;

  return (
    <View style={styles.row}>
      <Text style={styles.rowTitle}>{name}</Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={styles.label}>VENTES</Text>
          <Text style={styles.value}>
            {summary.totalSalesValue.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>CASH</Text>
          <Text style={[styles.value, { color: "#22D3EE" }]}>
            {summary.totalCashSales.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>CRÉDIT</Text>
          <Text style={[styles.value, { color: "#FB923C" }]}>
            {summary.totalCreditSales.toLocaleString()} Ar
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.label}>PROFIT</Text>
          <Text
            style={[
              styles.value,
              { color: isProfit ? "#2ECC71" : "#F43F5E" },
            ]}
          >
            {summary.totalProfit.toLocaleString()} Ar
          </Text>
        </View>
      </View>
    </View>
  );
};

export default function FinanceDetailModal({
  trigger,
  title,
  sales,
  products,
  dateKey,
}: FinanceDetailModalProps) {
  const { references } = useReference();
  const { hasPassword, verifyPassword } = useHistorySecurity();
  const { deleteDaySales } = useDeleteDaySales();

  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(false);
  const [passwordPromptVisible, setPasswordPromptVisible] = useState(false);

  const breakdown = useMemo<ReferenceBreakdown[]>(() => {
    const groups = [
      ...(references ?? []).map((ref) => ({ id: ref.id, name: ref.name })),
      { id: OTHER_REFERENCE, name: "Autres" },
    ];

    return groups
      .map((group) => ({
        id: group.id,
        name: group.name,
        summary: getFinance({
          products,
          sales: filterSalesByReference(sales, products, group.id),
        }),
      }))
      .filter((group) => group.summary.totalSalesValue > 0);
  }, [references, sales, products]);

  const handleDeleteDay = () => {
    if (!hasPassword) {
      Alert.alert(
        "Mot de passe requis",
        "Configurez d'abord un mot de passe de suppression dans les réglages de l'historique."
      );
      return;
    }

    Alert.alert(
      "Confirmer la suppression",
      `Voulez-vous vraiment supprimer les ${sales.length} vente(s) du ${title} ? Le stock des produits concernés sera restauré. Cette action est irréversible.`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => setPasswordPromptVisible(true),
        },
      ]
    );
  };

  const handleConfirmDelete = async (password: string) => {
    if (!verifyPassword(password)) return false;

    const success = await deleteDaySales(sales);
    setPasswordPromptVisible(false);
    if (success) {
      Alert.alert("✅ Succès", "Ventes supprimées et stock restauré.");
      onClose();
    } else {
      Alert.alert("Erreur", "Suppression échouée, données restaurées.");
    }
    return true;
  };

  return (
    <>
      {trigger({ onPress: () => setVisible(true) })}

      <Modal
        transparent
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.modalContent}>
            <View style={styles.grabHandle} />
            <Text style={styles.title}>{title}</Text>

            <ScrollView
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {breakdown.length === 0 ? (
                <Text style={styles.empty}>Aucune vente sur cette période.</Text>
              ) : (
                breakdown.map((group) => (
                  <ReferenceSummaryRow
                    key={group.id}
                    name={group.name}
                    summary={group.summary}
                  />
                ))
              )}
            </ScrollView>

            {dateKey && sales.length > 0 && (
              <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteDay}>
                <Ionicons name="trash-outline" size={16} color="#F43F5E" />
                <Text style={styles.deleteText}>Supprimer cette journée</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>

        <PasswordPromptModal
          visible={passwordPromptVisible}
          title="Confirmer la suppression"
          subtitle="Saisissez le mot de passe pour continuer."
          confirmLabel="Supprimer"
          onConfirm={handleConfirmDelete}
          onCancel={() => setPasswordPromptVisible(false)}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  list: {
    paddingBottom: 8,
  },
  row: {
    marginBottom: 16,
  },
  rowTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B7BFD8",
    letterSpacing: 0.3,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    width: "48%",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  label: {
    fontSize: 11,
    color: "#545C7A",
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 17,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.3,
  },
  empty: {
    textAlign: "center",
    color: "#7A83A2",
    fontSize: 14,
    marginTop: 12,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "rgba(244,63,94,0.08)",
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
  deleteText: {
    color: "#F43F5E",
    fontWeight: "700",
    fontSize: 13,
  },
  closeButton: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#F97316",
  },
  closeText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#fff",
  },
});
