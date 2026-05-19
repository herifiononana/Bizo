import { Sale } from "@/interface/sale/sale";
import ReferenceFilter from "@/features/reference/reference-filter";
import { ClearSaleButton } from "@/features/sales/clear-sale-button";
import CreateSaleButton from "@/features/sales/create-sale-button";
import SaleListItem from "@/features/sales/sale-list-item";
import SaleListItemSkeleton from "@/features/sales/sale-skeleton";
import { FilteredParamsType, useSale } from "@/hooks/sale/useSale";
import { useProductsStore } from "@/stores/product.store";
import { MaterialIcons } from "@expo/vector-icons";
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

type StatusFilter = "all" | "credit" | "paid" | "cash";

const STATUS_CHIPS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "credit", label: "Crédit" },
  { key: "paid", label: "Payés" },
  { key: "cash", label: "Cash" },
];

const SalesScreen = () => {
  const products = useProductsStore((state) => state.products);
  const { handleFilterSale, loading } = useSale();

  const [isStartPickerVisible, setStartPickerVisible] = useState<boolean>(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [referenceProduct, setReferenceProduct] = useState<string | null | undefined>(null);

  const [params, setParams] = useState<FilteredParamsType>({
    search: "",
    referenceProduct: null,
    startDate: new Date(),
    endDate: null,
    creditOnly: false,
  });

  const productMap = useMemo(
    () => new Map((products ?? []).map((p) => [p.id, p])),
    [products]
  );

  const handleConfirmStart = (date: Date) => {
    setStartPickerVisible(false);
    setParams({ ...params, startDate: date });
  };
  const handleConfirmEnd = (date: Date) => {
    setEndPickerVisible(false);
    setParams({ ...params, endDate: date });
  };

  const allFiltered = useMemo(
    () => handleFilterSale({ ...params, creditOnly: false, referenceProduct }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      params.search,
      params.startDate,
      params.endDate,
      referenceProduct,
      handleFilterSale,
    ]
  );

  const filteredSales = useMemo(() => {
    if (statusFilter === "all") return allFiltered;
    if (statusFilter === "credit") return allFiltered.filter((s) => s.isCredit);
    if (statusFilter === "paid")
      return allFiltered.filter((s) => !s.isCredit && !!s.clientName);
    if (statusFilter === "cash")
      return allFiltered.filter((s) => !s.isCredit && !s.clientName);
    return allFiltered;
  }, [allFiltered, statusFilter]);

  const todaySummary = useMemo(() => {
    const today = new Date();
    const todaySales = allFiltered.filter((s) => {
      const d = new Date(s.saleDate);
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    });
    const total = todaySales.reduce((acc, s) => acc + s.totalAmount, 0);
    return { count: todaySales.length, total };
  }, [allFiltered]);

  const startLabel = params.startDate
    ? params.startDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Date début";

  const endLabel = params.endDate
    ? params.endDate.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "Date fin";

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
      {/* Absolute-positioned filter — must be sibling of FlatList, not inside header View */}
      <ReferenceFilter
        top={60}
        right={20}
        selectedReference={referenceProduct}
        setSelectedReference={setReferenceProduct}
      />

      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Ventes</Text>
        <Text style={styles.subtitle}>
          {todaySummary.count} transaction
          {todaySummary.count !== 1 ? "s" : ""} aujourd&apos;hui
          {todaySummary.total > 0
            ? ` · ${todaySummary.total.toLocaleString()} Ar`
            : ""}
        </Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <MaterialIcons
          name="search"
          size={18}
          color="#545C7A"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Rechercher produit ou client…"
          placeholderTextColor="#545C7A"
          style={styles.searchInput}
          value={params.search}
          onChangeText={(search) => setParams({ ...params, search })}
        />
      </View>

      {/* Date filters */}
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

      {/* Segmented chips */}
      <View style={styles.chipsRow}>
        {STATUS_CHIPS.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            style={[styles.chip, statusFilter === chip.key && styles.chipActive]}
            onPress={() => setStatusFilter(chip.key)}
          >
            <Text
              style={[
                styles.chipText,
                statusFilter === chip.key && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      <FlatList
        data={filteredSales}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
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
    backgroundColor: "#0C1224",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  headerRow: {
    marginBottom: 16,
    paddingRight: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "500",
    marginTop: 3,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#F4F6FF",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
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
  chipsRow: {
    flexDirection: "row",
    marginBottom: 14,
    gap: 8,
  },
  chip: {
    flex: 1,
    height: 40,
    backgroundColor: "#1B2342",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: {
    borderColor: "#F97316",
  },
  chipText: {
    fontSize: 13,
    color: "#7A83A2",
    fontWeight: "600",
  },
  chipTextActive: {
    color: "#F97316",
    fontWeight: "700",
  },
  listContent: {
    paddingBottom: 160,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#7A83A2",
    fontSize: 15,
  },
});
