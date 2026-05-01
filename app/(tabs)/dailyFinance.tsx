import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Colors } from "@/constants/theme";
import DailyFinanceItem from "@/features/finance/daily-finance-item";
import { useHistory } from "@/hooks/history/useHistory";
import { getFinance } from "@/services/finance";
import { useProductsStore } from "@/stores/product.store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const DailyFinanceScreen = () => {
  // const { sales } = useSalesStore();
  const { history: sales } = useHistory();
  const { products } = useProductsStore((state) => state);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  // ---------------------------------------------------
  // Grouper les ventes par jour
  // ---------------------------------------------------
  const groupedFinance = useMemo(() => {
    if (!sales) return {};

    const groups: Record<string, any[]> = {};

    sales.forEach((sale) => {
      const d = new Date(sale.saleDate);
      const dateKey = format(d, "yyyy-MM-dd"); // clé unique par jour

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(sale);
    });

    return groups;
  }, [sales]);

  // ---------------------------------------------------
  // Filtrer selon la date choisie (ou tout)
  // ---------------------------------------------------
  const filteredDates = useMemo(() => {
    if (!selectedDate) return Object.keys(groupedFinance);

    const target = format(selectedDate, "yyyy-MM-dd");
    return Object.keys(groupedFinance).filter((d) => d === target);
  }, [selectedDate, groupedFinance]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Résumé journalier</Text>

        {/* Date sélectionnée */}
        <Text style={styles.subtitle}>
          {selectedDate
            ? format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })
            : "Toutes les dates"}
        </Text>

        {/* Sélecteur de date */}
        <View style={styles.dateRow}>
          <TouchableOpacity
            style={styles.datePickerButton}
            onPress={() => setShowPicker(true)}
          >
            <Text style={styles.datePickerText}>Filtrer par date</Text>
          </TouchableOpacity>

          {selectedDate && (
            <TouchableOpacity
              style={[styles.datePickerButton, styles.resetButton]}
              onPress={() => setSelectedDate(null)}
            >
              <Text style={styles.datePickerText}>Réinitialiser</Text>
            </TouchableOpacity>
          )}
        </View>

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

        {/* LISTE DES RÉSUMÉS PAR JOUR */}
        {filteredDates.length === 0 && (
          <Text style={styles.empty}>Aucun résultat</Text>
        )}

        {filteredDates.map((dateKey) => {
          const daySales = groupedFinance[dateKey];
          const finance = getFinance({
            products: products ?? [],
            sales: daySales,
          });

          return <DailyFinanceItem key={dateKey} {...{ dateKey, finance }} />;
        })}
      </ScrollView>
    </View>
  );
};

export default DailyFinanceScreen;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.dark.background },
  container: { padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#FFFFFF",
  },
  subtitle: {
    textAlign: "center",
    color: "#8891B3",
    marginBottom: 16,
    fontSize: 14,
  },

  dateRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  datePickerButton: {
    backgroundColor: "#0F1535",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  resetButton: { backgroundColor: "#F97316", borderColor: "#F97316" },
  datePickerText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  empty: { textAlign: "center", color: "#8891B3", marginTop: 20 },
});
