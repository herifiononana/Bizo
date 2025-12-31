import { Colors } from "@/constants/theme";
import ReferenceFilter from "@/features/reference/reference-filter";
import { ClearSaleButton } from "@/features/sales/clear-sale-button";
import CreateSaleButton from "@/features/sales/create-sale-button";
import SaleListItem from "@/features/sales/sale-list-item";
import SaleListItemSkeleton from "@/features/sales/sale-skeleton";
import { FilteredParamsType, useSale } from "@/hooks/sale/useSale";
import { useProductsStore } from "@/stores/product.store";
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
  const { products } = useProductsStore((state) => state);
  const { handleFilterSale, loading } = useSale();

  const [isStartPickerVisible, setStartPickerVisible] =
    useState<boolean>(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState<boolean>(false);

  const [params, setParams] = useState<FilteredParamsType>({
    search: "",
    referenceProduct: null,
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
      <ReferenceFilter
        {...{
          top: 10,
          right: 10,
          selectedReference: params.referenceProduct,
          setSelectedReference: (ref) =>
            setParams({ ...params, referenceProduct: ref }),
        }}
      />
      {/* Recherche */}
      <View style={{ display: "flex", flexDirection: "row", gap: 4 }}>
        <TextInput
          placeholder="🔍 Rechercher un produit ou client"
          style={styles.searchInput}
          value={params.search}
          onChangeText={(search) => setParams({ ...params, search })}
        />
        {/* Filtres références */}
      </View>
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
          params.creditOnly && { backgroundColor: Colors.dark.accent },
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
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune vente trouvée.</Text>
        }
        renderItem={({ item }) => {
          if (loading) return <SaleListItemSkeleton />;
          if (!products) return <></>;
          const product = products.find((p) => p.id === item.productId);
          return product ? <SaleListItem {...{ product, item }} /> : <></>;
        }}
      />
      <ClearSaleButton />
      <CreateSaleButton />
    </View>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background, // fond sombre
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.dark.text, // texte clair
    textAlign: "center",
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: Colors.dark.surface, // surface sombre
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border, // bordure neutre
    padding: 12,
    flex: 1,
    fontSize: 16,
    color: Colors.dark.text, // texte clair
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.dark.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 15,
    color: Colors.dark.text,
  },

  creditButton: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.accent, // accent orange
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  creditButtonText: {
    color: Colors.dark.accent,
    fontSize: 15,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.dark.icon, // texte secondaire clair
    fontSize: 15,
  },
});
