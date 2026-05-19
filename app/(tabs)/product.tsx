import { OTHER_REFERENCE } from "@/constants/constants";
import AddProductButton from "@/features/product/add-product-button";
import ProductListItem from "@/features/product/product-list-item";
import SkeletonProduct from "@/features/product/skeleton-product";
import ReferenceFilter from "@/features/reference/reference-filter";
import { useProducts } from "@/hooks/product/useProduct";
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
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false);
  const [selectedReference, setSelectedReference] = useState<
    string | null | undefined
  >(null);

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
      if (showOutOfStock && p.quantity > 3) return false;
      return true;
    });
  }, [products, search, selectedReference, showOutOfStock]);

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
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Produits</Text>
          <Text style={styles.subtitle}>
            {totalCount} article{totalCount !== 1 ? "s" : ""} · {stockValueDisplay} Ar en stock
          </Text>
        </View>
      </View>

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
        <TouchableOpacity
          style={[styles.rupturBtn, showOutOfStock && styles.ruptureActive]}
          onPress={() => setShowOutOfStock(!showOutOfStock)}
        >
          <MaterialIcons
            name="inventory"
            size={16}
            color={showOutOfStock ? "#F43F5E" : "#7A83A2"}
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
        <View
          style={[
            styles.summaryChip,
            lowStockCount > 0 && styles.chipWarning,
          ]}
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
        </View>
        <TouchableOpacity
          style={[
            styles.summaryChip,
            outOfStockCount > 0 && styles.chipDanger,
            showOutOfStock && styles.chipDangerActive,
          ]}
          onPress={() => setShowOutOfStock(!showOutOfStock)}
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
          loading ? <SkeletonProduct /> : <ProductListItem item={item} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {showOutOfStock
              ? "Aucun produit en rupture."
              : "Aucun produit pour le moment."}
          </Text>
        }
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={10}
        updateCellsBatchingPeriod={50}
        removeClippedSubviews={true}
      />

      <AddProductButton />
    </View>
  );
};

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
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: {},
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#F4F6FF",
  },
  rupturBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ruptureActive: {
    backgroundColor: "rgba(244,63,94,0.12)",
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  summaryChip: {
    flex: 1,
    backgroundColor: "#141B33",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  chipWarning: {
    backgroundColor: "rgba(245,181,68,0.06)",
    borderColor: "rgba(245,181,68,0.22)",
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#7A83A2",
    fontSize: 15,
  },
});

export default ProductsScreen;
