import AddProductButton from "@/features/product/add-product-button";
import ProductListItem from "@/features/product/product-list-item";
import { useProducts } from "@/hooks/product/useProduct";
import React, { useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, View } from "react-native";

const ProductsScreen: React.FC = () => {
  const { products } = useProducts();
  const [search, setSearch] = useState<string>("");

  // Filtrer les produits par recherche
  const filteredProducts = products
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produits</Text>

      {/* Barre de recherche */}
      <TextInput
        placeholder="Rechercher un produit..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {/* Liste des produits */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucun produit pour le moment.</Text>
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
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productDetails: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
  },
});

export default ProductsScreen;
