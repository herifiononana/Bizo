import { Colors } from "@/constants/theme";
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
        const matchesSearch = p?.name
          ?.toLowerCase()
          .includes(search?.toLowerCase());
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
    borderColor: Colors.dark.border, // bordure neutre
    color: Colors.dark.text, // texte clair
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
});

export default ProductsScreen;
