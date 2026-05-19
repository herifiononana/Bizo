import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import DailyFinanceItem from "@/features/finance/daily-finance-item";
import { useHistory } from "@/hooks/history/useHistory";
import { getFinance } from "@/services/finance";
import { useProductsStore } from "@/stores/product.store";
import { MaterialIcons } from "@expo/vector-icons";
import { format } from "date-fns";

const DailyFinanceScreen = () => {
  const { history: sales } = useHistory();
  const products = useProductsStore((state) => state.products);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const groupedFinance = useMemo(() => {
    if (!sales) return {};
    const groups: Record<string, any[]> = {};
    sales.forEach((sale) => {
      const d = new Date(sale.saleDate);
      const dateKey = format(d, "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
    });
    return groups;
  }, [sales]);

  const filteredDates = useMemo(() => {
    if (!selectedDate) return Object.keys(groupedFinance);
    const target = format(selectedDate, "yyyy-MM-dd");
    return Object.keys(groupedFinance).filter((d) => d === target);
  }, [selectedDate, groupedFinance]);

  const dailyFinanceData = useMemo(
    () =>
      filteredDates.map((dateKey) => ({
        dateKey,
        finance: getFinance({
          products: products ?? [],
          sales: groupedFinance[dateKey],
        }),
      })),
    [filteredDates, groupedFinance, products]
  );

  const totalVentes = useMemo(
    () => dailyFinanceData.reduce((acc, d) => acc + d.finance.totalSalesValue, 0),
    [dailyFinanceData]
  );

  const daysCount = filteredDates.length;

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
          style={styles.filterBtn}
          onPress={() => setShowPicker(true)}
        >
          <MaterialIcons name="event" size={16} color="#FB923C" />
          <Text style={styles.filterBtnText}>Filtrer</Text>
        </TouchableOpacity>
      </View>

      {/* Reset filter — always visible when date selected */}
      {selectedDate && (
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => setSelectedDate(null)}
        >
          <MaterialIcons name="close" size={14} color="#FB923C" />
          <Text style={styles.resetBtnText}>Réinitialiser le filtre</Text>
        </TouchableOpacity>
      )}

      {/* Period hero card */}
      {daysCount > 0 && (
        <View style={styles.periodCard}>
          <Text style={styles.periodLabel}>PÉRIODE — TOTAL VENTES</Text>
          <Text style={styles.periodValue}>
            {totalVentes.toLocaleString()} Ar
          </Text>
          <View style={styles.periodBadgesRow}>
            <View style={styles.periodBadge}>
              <View style={styles.periodDot} />
              <Text style={styles.periodBadgeText}>
                {daysCount} jour{daysCount !== 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>
      )}

      {showPicker && (
        <DateTimePicker
          value={selectedDate ?? new Date()}
          mode="date"
          display="calendar"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}
    </>
  );

  return (
    <View style={styles.screen}>
      <FlatList
        data={dailyFinanceData}
        keyExtractor={(item) => item.dateKey}
        contentContainerStyle={styles.container}
        renderItem={({ item }) => (
          <DailyFinanceItem dateKey={item.dateKey} finance={item.finance} />
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
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(249,115,22,0.12)",
    borderWidth: 1,
    borderColor: "rgba(249,115,22,0.28)",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 14,
  },
  filterBtnText: {
    color: "#FB923C",
    fontWeight: "700",
    fontSize: 14,
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
    fontSize: 32,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -1,
    marginBottom: 12,
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
  resetBadge: {
    backgroundColor: "rgba(249,115,22,0.10)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resetBadgeText: {
    fontSize: 12,
    color: "#FB923C",
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
