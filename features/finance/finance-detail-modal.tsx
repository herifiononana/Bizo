import PasswordPromptModal from "@/components/password-prompt-modal";
import { OTHER_REFERENCE } from "@/constants/constants";
import SaleRow from "@/features/finance/sale-row";
import { useDeleteDaySales } from "@/hooks/history/useDeleteDaySales";
import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import { useReference } from "@/hooks/reference/useRefecence";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { filterSalesByReference, getFinance } from "@/services/finance";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
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
  visible: boolean;
  onClose: () => void;
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
  visible,
  onClose,
  title,
  sales,
  products,
  dateKey,
}: FinanceDetailModalProps) {
  const { references } = useReference();
  const { hasPassword, verifyPassword } = useHistorySecurity();
  const { deleteDaySales } = useDeleteDaySales();

  // Copie locale affichée : mise à jour immédiatement après une suppression,
  // sans attendre que le parent recalcule et repasse la prop `sales`.
  const [displaySales, setDisplaySales] = useState<Sale[]>(sales);
  const [pendingDeletion, setPendingDeletion] = useState<{
    sales: Sale[];
    closeOnSuccess: boolean;
  } | null>(null);

  useEffect(() => {
    setDisplaySales(sales);
  }, [sales]);

  const productMap = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

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
          sales: filterSalesByReference(displaySales, products, group.id),
        }),
      }))
      .filter((group) => group.summary.totalSalesValue > 0);
  }, [references, displaySales, products]);

  const requestDeletion = (
    salesToDelete: Sale[],
    confirmMessage: string,
    closeOnSuccess: boolean
  ) => {
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
        onPress: () =>
          setPendingDeletion({ sales: salesToDelete, closeOnSuccess }),
      },
    ]);
  };

  const handleDeleteDay = () => {
    requestDeletion(
      displaySales,
      `Voulez-vous vraiment supprimer les ${displaySales.length} vente(s) du ${title} ? Le stock des produits concernés sera restauré. Cette action est irréversible.`,
      true
    );
  };

  const handleDeleteSale = (sale: Sale) => {
    const productName = productMap.get(sale.productId)?.name ?? "ce produit";
    requestDeletion(
      [sale],
      `Voulez-vous vraiment supprimer cette vente de ${productName} ? Le stock sera restauré. Cette action est irréversible.`,
      false
    );
  };

  const handleConfirmDelete = async (password: string) => {
    if (!verifyPassword(password)) return false;
    if (!pendingDeletion) return false;

    const { sales: salesToDelete, closeOnSuccess } = pendingDeletion;
    const success = await deleteDaySales(salesToDelete);
    setPendingDeletion(null);

    if (success) {
      const deletedIds = new Set(salesToDelete.map((sale) => sale.id));
      setDisplaySales((prev) => prev.filter((sale) => !deletedIds.has(sale.id)));
      Alert.alert("✅ Succès", "Vente(s) supprimée(s) et stock restauré.");
      if (closeOnSuccess) onClose();
    } else {
      Alert.alert("Erreur", "Suppression échouée, données restaurées.");
    }
    return true;
  };

  return (
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

            {displaySales.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Ventes</Text>
                {displaySales.map((sale) => (
                  <SaleRow
                    key={sale.id}
                    sale={sale}
                    productName={
                      productMap.get(sale.productId)?.name ?? "Produit supprimé"
                    }
                    onDelete={() => handleDeleteSale(sale)}
                  />
                ))}
              </>
            )}
          </ScrollView>

          {dateKey && displaySales.length > 0 && (
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
        visible={!!pendingDeletion}
        title="Confirmer la suppression"
        subtitle="Saisissez le mot de passe pour continuer."
        confirmLabel="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeletion(null)}
      />
    </Modal>
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B7BFD8",
    letterSpacing: 0.3,
    marginTop: 4,
    marginBottom: 8,
    textTransform: "uppercase",
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
