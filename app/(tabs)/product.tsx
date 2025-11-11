import { mockProducts } from "@/data/mock-product";
import { Product } from "@/interface/product/product";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProductsScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    purchasePrice: "",
  });

  // Filtrer les produits par recherche
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Ajouter un produit
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.quantity || !newProduct.purchasePrice) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const newItem: Product = {
      id: String(Date.now()),
      name: newProduct.name,
      quantity: Number(newProduct.quantity),
      purchasePrice: Number(newProduct.purchasePrice),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts([...products, newItem]);
    setNewProduct({ name: "", quantity: "", purchasePrice: "" });
    setModalVisible(false);
  };

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
        renderItem={({ item }) => (
          <View style={styles.productCard}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>
              Quantité : {item.quantity} | Prix : {item.purchasePrice} Ar
            </Text>
          </View>
        )}
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau produit</Text>

            <TextInput
              placeholder="Nom du produit"
              style={styles.input}
              value={newProduct.name}
              onChangeText={(text) =>
                setNewProduct({ ...newProduct, name: text })
              }
            />
            <TextInput
              placeholder="Quantité"
              style={styles.input}
              keyboardType="numeric"
              value={newProduct.quantity}
              onChangeText={(text) =>
                setNewProduct({ ...newProduct, quantity: text })
              }
            />
            <TextInput
              placeholder="Prix d'achat"
              style={styles.input}
              keyboardType="numeric"
              value={newProduct.purchasePrice}
              onChangeText={(text) =>
                setNewProduct({ ...newProduct, purchasePrice: text })
              }
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddProduct}
              >
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
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
