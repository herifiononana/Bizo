import { OTHER_REFERENCE } from "@/constants/constants";
import AddProductButton from "@/features/product/add-product-button";
import DeleteSelectedProductsBar from "@/features/product/delete-selected-products-bar";
import ProductListItem from "@/features/product/product-list-item";
import { getEmptyListMessage, matchesStockFilter, StockFilter } from "@/features/product/stock-filter.helper";
import ProductSelectionHeader from "@/features/product/product-selection-header";
import SkeletonProduct from "@/features/product/skeleton-product";
import ReferenceFilter from "@/features/reference/reference-filter";
import { useProducts } from "@/hooks/product/useProduct";
import { useProductSelection } from "@/hooks/product/useProductSelection";
import { useProductsStore } from "@/stores/product.store";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProductsScreen: React.FC = () => {
  const { loading } = useProducts();
  const products = useProductsStore((state) => state.products);

  const [search, setSearch] = useState<string>("");
  const [stockFilter, setStockFilter] = useState<StockFilter>(null);

  const toggleStockFilter = (filter: Exclude<StockFilter, null>) =>
    setStockFilter((current) => (current === filter ? null : filter));
  const [selectedReference, setSelectedReference] = useState<
    string | null | undefined
  >(null);

  const {
    isSelecting,
    selectedIds,
    startSelection,
    toggle,
    selectAll,
    stopSelection,
  } = useProductSelection();

  const allProducts = products ?? [];

  const totalCount = allProducts.length;
  const lowStockCount = allProducts.filter(
    (p) => p.quantity > 0 && p.quantity <= 3
  ).length;
  const outOfStockCount = allProducts.filter((p) => p.quantity === 0).length;

  const totalStockValue = allProducts.reduce(
    (acc, p) => acc + p.quantity * p.purchasePrice,
    0
  );
  const stockValueDisplay =
    totalStockValue >= 1_000_000
      ? (totalStockValue / 1_000_000).toFixed(1) + "M"
      : totalStockValue >= 1_000
      ? (totalStockValue / 1_000).toFixed(1) + "k"
      : totalStockValue.toFixed(0);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    const s = search.toLowerCase();
    return products.filter((p) => {
      if (s && !p.name.toLowerCase().includes(s)) return false;
      if (selectedReference) {
        if (selectedReference === OTHER_REFERENCE) {
          if (p.referenceId) return false;
        } else {
          if (p.referenceId !== selectedReference) return false;
        }
      }
      return matchesStockFilter(p, stockFilter);
    });
  }, [products, search, selectedReference, stockFilter]);

  const filteredIds = filteredProducts.map((product) => product.id);
  const allSelected =
    filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));

  return (
    <View style={styles.container}>
      {/* Absolute-positioned filter — must be sibling of FlatList */}
      <ReferenceFilter
        selectedReference={selectedReference}
        setSelectedReference={setSelectedReference}
        top={60}
        right={20}
      />

      {/* Header */}
      {isSelecting ? (
        <ProductSelectionHeader
          selectedCount={selectedIds.size}
          allSelected={allSelected}
          onSelectAll={() => selectAll(filteredIds)}
          onClear={() => selectAll([])}
          onClose={stopSelection}
        />
      ) : (
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Produits</Text>
            <Text style={styles.subtitle}>
              {totalCount} article{totalCount !== 1 ? "s" : ""} · {stockValueDisplay} Ar en stock
            </Text>
          </View>
        </View>
      )}

      {/* Search + rupture filter */}
      <View style={styles.searchRow}>
        <MaterialIcons
          name="search"
          size={18}
          color="#545C7A"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Rechercher un produit…"
          placeholderTextColor="#545C7A"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
        {!isSelecting && (
          <TouchableOpacity
            style={styles.rupturBtn}
            onPress={() => startSelection()}
          >
            <MaterialIcons name="checklist" size={16} color="#7A83A2" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[
            styles.rupturBtn,
            stockFilter === "alert" && styles.ruptureActive,
          ]}
          onPress={() => toggleStockFilter("alert")}
        >
          <MaterialIcons
            name="inventory"
            size={16}
            color={stockFilter === "alert" ? "#F43F5E" : "#7A83A2"}
          />
        </TouchableOpacity>
      </View>

      {/* Stock summary chips */}
      <View style={styles.chipsRow}>
        <View style={styles.summaryChip}>
          <Text style={styles.chipTopLabel}>TOTAL</Text>
          <Text style={styles.chipValue}>{totalCount}</Text>
          <Text style={styles.chipBottomLabel}>articles</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.summaryChip,
            lowStockCount > 0 && styles.chipWarning,
            stockFilter === "low" && styles.chipWarningActive,
          ]}
          onPress={() => toggleStockFilter("low")}
        >
          <Text style={styles.chipTopLabel}>FAIBLE</Text>
          <Text
            style={[
              styles.chipValue,
              lowStockCount > 0 && styles.chipValueWarning,
            ]}
          >
            {lowStockCount}
          </Text>
          <Text style={styles.chipBottomLabel}>articles</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.summaryChip,
            outOfStockCount > 0 && styles.chipDanger,
            stockFilter === "out" && styles.chipDangerActive,
          ]}
          onPress={() => toggleStockFilter("out")}
        >
          <Text style={styles.chipTopLabel}>RUPTURE</Text>
          <Text
            style={[
              styles.chipValue,
              outOfStockCount > 0 && styles.chipValueDanger,
            ]}
          >
            {outOfStockCount}
          </Text>
          <Text style={styles.chipBottomLabel}>articles</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item, index) =>
          loading ? "skeleton-" + index : item.id.toString()
        }
        renderItem={({ item }) =>
          loading ? <SkeletonProduct /> : (
            <ProductListItem
              item={item}
              isSelecting={isSelecting}
              isSelected={selectedIds.has(item.id)}
              onToggle={toggle}
              onStartSelection={startSelection}
            />
          )
        }
        contentContainerStyle={[
          styles.listContent,
          isSelecting && styles.listContentSelecting,
        ]}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {getEmptyListMessage(stockFilter)}
          </Text>
        }
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
        extraData={selectedIds}
      />

      {isSelecting ? (
        <DeleteSelectedProductsBar
          selectedIds={selectedIds}
          onDeleted={stopSelection}
        />
      ) : (
        <AddProductButton />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C1224",
    paddingHorizontal: 15,
    paddingTop: 60,
  },
  headerRow: {
    marginBottom: 12,
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
    marginTop: 2,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 11,
    height: 50,
    marginBottom: 9,
    gap: 6,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#F4F6FF",
  },
  rupturBtn: {
    padding: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ruptureActive: {
    backgroundColor: "rgba(244,63,94,0.12)",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 11,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: "#141B33",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: "center",
  },
  chipWarning: {
    backgroundColor: "rgba(245,181,68,0.06)",
    borderColor: "rgba(245,181,68,0.22)",
  },
  chipWarningActive: {
    backgroundColor: "rgba(245,181,68,0.16)",
    borderColor: "#F5B544",
  },
  chipDanger: {
    backgroundColor: "rgba(244,63,94,0.06)",
    borderColor: "rgba(244,63,94,0.22)",
  },
  chipDangerActive: {
    backgroundColor: "rgba(244,63,94,0.16)",
    borderColor: "#F43F5E",
  },
  chipTopLabel: {
    fontSize: 10,
    color: "#545C7A",
    fontWeight: "700",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  chipValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.5,
    marginVertical: 2,
  },
  chipValueWarning: {
    color: "#F5B544",
  },
  chipValueDanger: {
    color: "#F43F5E",
  },
  chipBottomLabel: {
    fontSize: 11,
    color: "#7A83A2",
    fontWeight: "500",
  },
  listContent: {
    paddingBottom: 120,
  },
  listContentSelecting: {
    paddingBottom: 180,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#7A83A2",
    fontSize: 15,
  },
});

export default ProductsScreen;
