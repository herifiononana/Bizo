import AddProductButton from "@/features/product/add-product-button";
import ProductListItem from "@/features/product/product-list-item";
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

const ProductsScreen: React.FC = () => {
  const { products } = useProductsStore((state) => state);
  const [search, setSearch] = useState<string>("");
  const [showOutOfStock, setShowOutOfStock] = useState<boolean>(false);

  // Filtrer les produits par recherche + rupture
  const filteredProducts = products
    ? products.filter((p) => {
        const matchesSearch = p.name
          .toLowerCase()
          .includes(search.toLowerCase());
        const matchesOutOfStock = showOutOfStock ? p.quantity <= 3 : true;
        return matchesSearch && matchesOutOfStock;
      })
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produits</Text>

      {/* Zone recherche + filtre */}
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

      {/* Liste des produits */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Aucun produit {showOutOfStock ? "en rupture" : ""} pour le moment.
          </Text>
        }
        renderItem={({ item }) => <ProductListItem {...{ item }} />}
      />

      {/* Bouton ajout produit */}
      <AddProductButton />
    </View>
  );
};

// ------------------ STYLES ------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
    textAlign: "center",
  },

  // === FILTRE ===
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  // --- Chip / Tag style ---
  filterChip: {
    marginLeft: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },

  filterChipActive: {
    backgroundColor: "#DC2626",
    borderColor: "#B91C1C",
  },

  filterChipText: {
    fontSize: 16,
    color: "#374151",
  },

  filterChipTextActive: {
    color: "#fff",
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});

export default ProductsScreen;
