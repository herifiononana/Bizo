import { OTHER_REFERENCE } from "@/constants/constants";
import { Colors } from "@/constants/theme";
import AddProductButton from "@/features/product/add-product-button";
import ProductListItem from "@/features/product/product-list-item";
import SkeletonProduct from "@/features/product/skeleton-product";
import ReferenceFilter from "@/features/reference/reference-filter";
import { useProducts } from "@/hooks/product/useProduct";
import { useProductsStore } from "@/stores/product.store";
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

  // 🔍 Filtering optimisé
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
      <Text style={styles.title}>Produits</Text>

      <ReferenceFilter
        selectedReference={selectedReference}
        setSelectedReference={setSelectedReference}
        top={10}
        right={10}
      />

      <View style={styles.topRow}>
        <TextInput
          placeholder="Rechercher..."
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity
          style={[styles.filterChip, showOutOfStock && styles.filterChipActive]}
          onPress={() => setShowOutOfStock(!showOutOfStock)}
        >
          <Text
            style={[
              styles.filterChipText,
              showOutOfStock && styles.filterChipTextActive,
            ]}
          >
            📦
          </Text>
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
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun produit {showOutOfStock ? "en rupture" : ""} pour le moment.
          </Text>
        }
        // ⚡ Recommended optimization when data > 500 items :
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

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background, // fond sombre
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: Colors.dark.text, // texte clair
    textAlign: "center",
    marginBottom: 10,
  },

  // === FILTRE ===
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: Colors.dark.surface, // surface sombre pour input
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginLeft: 8,
  },

  // --- Chip / Tag style ---
  filterChip: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.dark.primary,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  filterChipActive: {
    backgroundColor: Colors.dark.danger, // rouge accent
    borderColor: Colors.dark.danger,
  },

  filterChipText: {
    fontSize: 16,
    color: Colors.dark.text, // texte clair
  },

  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: Colors.dark.icon, // texte secondaire clair
  },

  referenceRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  refChip: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    marginRight: 8,
    marginBottom: 6,
  },

  refChipActive: {
    backgroundColor: "#2563EB",
    borderColor: "#1E40AF",
  },

  refChipText: {
    color: "#374151",
    fontSize: 14,
  },

  refChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default ProductsScreen;
