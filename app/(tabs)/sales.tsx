import { Colors } from "@/constants/theme";
import { Sale } from "@/interface/sale/sale";
import ReferenceFilter from "@/features/reference/reference-filter";
import { ClearSaleButton } from "@/features/sales/clear-sale-button";
import CreateSaleButton from "@/features/sales/create-sale-button";
import SaleListItem from "@/features/sales/sale-list-item";
import SaleListItemSkeleton from "@/features/sales/sale-skeleton";
import { FilteredParamsType, useSale } from "@/hooks/sale/useSale";
import { useProductsStore } from "@/stores/product.store";
import React, { useCallback, useMemo, useState } from "react";
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
  const products = useProductsStore((state) => state.products);
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

  // O(1) product lookup for renderItem
  const productMap = useMemo(
    () => new Map((products ?? []).map((p) => [p.id, p])),
    [products]
  );

  // Handlers Date Picker
  const handleConfirmStart = (date: Date) => {
    setStartPickerVisible(false);
    setParams({ ...params, startDate: date });
  };
  const handleConfirmEnd = (date: Date) => {
    setEndPickerVisible(false);
    setParams({ ...params, endDate: date });
  };

  // Filtrage ventes — recalcule uniquement quand params ou données changent
  const filteredSales = useMemo(
    () => handleFilterSale(params),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      params.search,
      params.startDate,
      params.endDate,
      params.creditOnly,
      params.referenceProduct,
      handleFilterSale,
    ]
  );

  const renderSaleItem = useCallback(
    ({ item }: { item: Sale }) => {
      if (loading) return <SaleListItemSkeleton />;
      const product = productMap.get(item.productId);
      return product ? <SaleListItem product={product} item={item} /> : null;
    },
    [loading, productMap]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestion des ventes</Text>
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
        removeClippedSubviews={true}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune vente trouvée.</Text>
        }
        renderItem={renderSaleItem}
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
    backgroundColor: Colors.dark.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: "#0F1535",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 12,
    flex: 1,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#0F1535",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  creditButton: {
    backgroundColor: "rgba(249,115,22,0.10)",
    borderWidth: 1,
    borderColor: "#F97316",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  creditButtonText: {
    color: "#F97316",
    fontSize: 15,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#8891B3",
    fontSize: 15,
  },
});
