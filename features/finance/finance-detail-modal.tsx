import { OTHER_REFERENCE } from "@/constants/constants";
import { useReference } from "@/hooks/reference/useRefecence";
import { FinanceSummary } from "@/interface/finance/finance-summary";
import { Product } from "@/interface/product/product";
import { Sale } from "@/interface/sale/sale";
import { filterSalesByReference, getFinance } from "@/services/finance";
import React, { useMemo } from "react";
import {
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
}: FinanceDetailModalProps) {
  const { references } = useReference();

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
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Fermer</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  closeButton: {
    marginTop: 20,
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
