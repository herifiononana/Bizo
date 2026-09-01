import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import FinanceDetailModal from "@/features/finance/finance-detail-modal";
import DailyFinanceItem from "@/features/finance/daily-finance-item";
import HistorySecurityModal from "@/features/finance/history-security-modal";
import { useHistory } from "@/hooks/history/useHistory";
import { Sale } from "@/interface/sale/sale";
import { getFinance } from "@/services/finance";
import { useProductsStore } from "@/stores/product.store";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type DetailTarget = { title: string; sales: Sale[]; dateKey?: string };

const DailyFinanceScreen = () => {
  const { history: sales } = useHistory();
  const products = useProductsStore((state) => state.products);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [detailTarget, setDetailTarget] = useState<DetailTarget | null>(null);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);

  const groupedFinance = useMemo(() => {
    if (!sales) return {};
    const groups: Record<string, Sale[]> = {};
    sales.forEach((sale) => {
      const d = new Date(sale.saleDate);
      const dateKey = format(d, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
    });
    return groups;
  }, [sales]);

  const filteredDates = useMemo(() => {
    const keys = Object.keys(groupedFinance);
    if (!startDate && !endDate) return keys;
    const startKey = startDate ? format(startDate, "yyyy-MM-dd") : null;
    const endKey = endDate ? format(endDate, "yyyy-MM-dd") : null;
    return keys.filter((key) => {
      if (startKey && key < startKey) return false;
      if (endKey && key > endKey) return false;
      return true;
    });
  }, [startDate, endDate, groupedFinance]);

  const dailyFinanceData = useMemo(
    () =>
      filteredDates.map((dateKey) => ({
        dateKey,
        sales: groupedFinance[dateKey],
        finance: getFinance({
          products: products ?? [],
          sales: groupedFinance[dateKey],
        }),
      })),
    [filteredDates, groupedFinance, products]
  );

  const periodSales = useMemo(
    () => filteredDates.flatMap((dateKey) => groupedFinance[dateKey]),
    [filteredDates, groupedFinance]
  );

  const periodFinance = useMemo(
    () => getFinance({ products: products ?? [], sales: periodSales }),
    [products, periodSales]
  );

  const totalVentes = periodFinance.totalSalesValue;
  const totalProfit = periodFinance.totalProfit;

  const daysCount = filteredDates.length;

  const startLabel = startDate
    ? format(startDate, "dd/MM/yyyy")
    : "Date début";
  const endLabel = endDate ? format(endDate, "dd/MM/yyyy") : "Date fin";

  const handleConfirmStart = (date: Date) => {
    setStartPickerVisible(false);
    setStartDate(date);
  };
  const handleConfirmEnd = (date: Date) => {
    setEndPickerVisible(false);
    setEndDate(date);
  };

  const ListHeader = (
    <>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Historique</Text>
          <Text style={styles.subtitle}>
            {"Résumé journalier · "}{daysCount}{" jour"}{daysCount !== 1 ? "s" : ""}{" d’activité"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.securityButton}
          onPress={() => setSecurityModalVisible(true)}
        >
          <Ionicons name="lock-closed-outline" size={18} color="#F4F6FF" />
        </TouchableOpacity>
      </View>

      {/* Date range filters */}
      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartPickerVisible(true)}
        >
          <MaterialIcons name="event" size={14} color="#7A83A2" />
          <Text style={styles.dateButtonText}>{startLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndPickerVisible(true)}
        >
          <MaterialIcons name="event" size={14} color="#7A83A2" />
          <Text style={styles.dateButtonText}>{endLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* Reset filter — visible when a date bound is set */}
      {(startDate || endDate) && (
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => {
            setStartDate(null);
            setEndDate(null);
          }}
        >
          <MaterialIcons name="close" size={14} color="#FB923C" />
          <Text style={styles.resetBtnText}>Réinitialiser le filtre</Text>
        </TouchableOpacity>
      )}

      {/* Period hero card */}
      {daysCount > 0 && (
        <TouchableOpacity
          style={styles.periodCard}
          activeOpacity={0.85}
          onPress={() =>
            setDetailTarget({ title: "Période", sales: periodSales })
          }
        >
          <Text style={styles.periodLabel}>PÉRIODE</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricSubLabel}>TOTAL VENTES</Text>
              <Text style={styles.periodValue}>
                {totalVentes.toLocaleString()} Ar
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricSubLabel}>BÉNÉFICE</Text>
              <Text style={styles.profitValue}>
                {totalProfit.toLocaleString()} Ar
              </Text>
            </View>
          </View>
          <View style={styles.periodBadgesRow}>
            <View style={styles.periodBadge}>
              <View style={styles.periodDot} />
              <Text style={styles.periodBadgeText}>
                {daysCount} jour{daysCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      )}

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        date={startDate ?? new Date()}
        onConfirm={handleConfirmStart}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        date={endDate ?? new Date()}
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndPickerVisible(false)}
      />
    </>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={dailyFinanceData}
        keyExtractor={(item) => item.dateKey}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <DailyFinanceItem
            dateKey={item.dateKey}
            finance={item.finance}
            onPress={() =>
              setDetailTarget({
                title: format(new Date(item.dateKey), "EEEE d MMMM yyyy", {
                  locale: fr,
                }),
                sales: item.sales,
                dateKey: item.dateKey,
              })
            }
          />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun résultat</Text>
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <FinanceDetailModal
        visible={!!detailTarget}
        onClose={() => setDetailTarget(null)}
        title={detailTarget?.title ?? ""}
        sales={detailTarget?.sales ?? []}
        products={products ?? []}
        dateKey={detailTarget?.dateKey}
      />

      <HistorySecurityModal
        visible={securityModalVisible}
        onClose={() => setSecurityModalVisible(false)}
      />
    </View>
  );
};

export default DailyFinanceScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#0C1224" },
  container: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 120 },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  securityButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1B2342",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: "#7A83A2",
    marginTop: 3,
    fontSize: 13,
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    height: 44,
    paddingHorizontal: 12,
    gap: 6,
  },
  dateButtonText: {
    fontSize: 13,
    color: "#B7BFD8",
    fontWeight: "600",
  },
  periodCard: {
    backgroundColor: "#141B33",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  periodLabel: {
    fontSize: 11,
    color: "#7A83A2",
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  periodValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.8,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  metricCol: {
    flex: 1,
  },
  metricDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 14,
    alignSelf: "stretch",
  },
  metricSubLabel: {
    fontSize: 10,
    color: "#7A83A2",
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  profitValue: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2ECC71",
    letterSpacing: -0.8,
  },
  periodBadgesRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  periodBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(46,204,113,0.10)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 5,
  },
  periodDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#2ECC71",
  },
  periodBadgeText: {
    fontSize: 12,
    color: "#2ECC71",
    fontWeight: "700",
  },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(249,115,22,0.10)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.28)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
    marginBottom: 12,
  },
  resetBtnText: {
    color: "#FB923C",
    fontWeight: "700",
    fontSize: 13,
  },
  empty: { textAlign: "center", color: "#7A83A2", marginTop: 20, fontSize: 15 },
});
