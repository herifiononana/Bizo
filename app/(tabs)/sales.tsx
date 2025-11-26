import CreateSaleButton from "@/features/sales/create-sale-button";
import SaleListItem from "@/features/sales/sale-list-item";
import { useProducts } from "@/hooks/product/useProduct";
import { FilteredParamsType, useSale } from "@/hooks/sale/useSale";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SalesScreen = () => {
  const { products } = useProducts();
  const { handleFilterSale } = useSale();

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const [params, setParams] = useState<FilteredParamsType>({
    search: "",
    startDate: new Date(),
    endDate: null,
    creditOnly: false,
  });

  // Handlers Date Picker
  const handleConfirmStart = (date: Date) => {
    setStartPickerVisible(false);
    setParams({ ...params, startDate: date });
  };
  const handleConfirmEnd = (date: Date) => {
    setEndPickerVisible(false);
    setParams({ ...params, endDate: date });
  };

  // Filtrage ventes
  const filteredSales = handleFilterSale({ ...params });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Gestion des ventes</Text>

      {/* Recherche */}
      <TextInput
        placeholder="🔍 Rechercher un produit..."
        style={styles.searchInput}
        value={params.search}
        onChangeText={(search) => setParams({ ...params, search })}
      />

      {/* Filtres de date */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartPickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {params.startDate
              ? `Début: ${params.startDate.toLocaleDateString()}`
              : "📅 Date début"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndPickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {params.endDate
              ? `Fin: ${params.endDate.toLocaleDateString()}`
              : "📅 Date fin"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 🔥 Bouton filtre ventes à crédit */}
      <TouchableOpacity
        style={[
          styles.creditButton,
          params.creditOnly && { backgroundColor: "#B45309" },
        ]}
        onPress={() => setParams({ ...params, creditOnly: !params.creditOnly })}
      >
        <Text
          style={[
            styles.creditButtonText,
            params.creditOnly && { color: "#fff" },
          ]}
        >
          💳 Ventes à crédit uniquement
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        onConfirm={handleConfirmStart}
        onCancel={() => setStartPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        onConfirm={handleConfirmEnd}
        onCancel={() => setEndPickerVisible(false)}
      />

      {/* Liste des ventes */}
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune vente trouvée.</Text>
        }
        renderItem={({ item }) => {
          if (!products) return <></>;
          const product = products.find((p) => p.id === item.productId);
          return product ? <SaleListItem {...{ product, item }} /> : <></>;
        }}
      />

      <CreateSaleButton />
    </View>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 15,
    color: "#334155",
  },

  creditButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#B45309",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  creditButtonText: {
    color: "#B45309",
    fontSize: 15,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#94A3B8",
    fontSize: 15,
  },
});
