import { mockProducts } from "@/data/mock-product";
import AddProductForm from "@/features/product/add-product-form";
import ProductListItem from "@/features/product/product-list-item";
import { Product } from "@/interface/product/product";
import { getData, saveData } from "@/storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState<string>("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  // Filtrer les produits par recherche
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Ajouter un produit
  const handleAddProduct = async (newProduct: Product) => {
    const updatedProducts = [...products, newProduct];
    setProducts(updatedProducts);
    await saveData("products", updatedProducts); // persistance offline
    setModalVisible(false);
  };

  // Charger les produits depuis AsyncStorage
  useEffect(() => {
    const loadProducts = async () => {
      const storedProducts = await getData("products");
      if (storedProducts) setProducts(storedProducts);
      else {
        setProducts(mockProducts);
        await saveData("products", mockProducts);
      }
    };
    loadProducts();
  }, []);

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
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter un produit</Text>
      </TouchableOpacity>

      {/* Modal d'ajout */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <AddProductForm
            onAddProduct={handleAddProduct}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
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
  addButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },

  // -------- Modal --------
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: {
    fontWeight: "600",
  },
});

export default ProductsScreen;
