import { PRODUCTS_KEY, SALES_KEY } from "@/constants/key-storage";
import CreateSaleForm from "@/features/sales/create-sale-form";
import { Sale } from "@/interface/sale/sale";
import { getData, saveData } from "@/storage";
import { useProductsStore } from "@/stores/product.store";
import { useSalesStore } from "@/stores/sales.store";
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
import DateTimePickerModal from "react-native-modal-datetime-picker";

const SalesScreen = () => {
  const { products, setProducts } = useProductsStore((state) => state);
  const { sales, setSales } = useSalesStore((state) => state);
  const [search, setSearch] = useState<string>("");

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState<Date | null>(null);
  const [filterEndDate, setFilterEndDate] = useState<Date | null>(null);

  const [modalVisible, setModalVisible] = useState(false);

  // Filtrage ventes
  const filteredSales =
    Array.isArray(sales) && products
      ? sales.filter((sale) => {
          const product = products.find((p) => p.id === sale.productId);
          const nameMatch = product?.name
            .toLowerCase()
            .includes(search.toLowerCase());
          let dateMatch = true;

          const saleDate = new Date(sale.saleDate);
          if (filterStartDate) dateMatch = saleDate >= filterStartDate;
          if (filterEndDate) dateMatch = dateMatch && saleDate <= filterEndDate;

          return nameMatch && dateMatch;
        })
      : [];

  // Handlers Date Picker
  const handleConfirmStart = (date: Date) => {
    setStartPickerVisible(false);
    setFilterStartDate(date);
  };
  const handleConfirmEnd = (date: Date) => {
    setEndPickerVisible(false);
    setFilterEndDate(date);
  };

  const handleAddSale = async (sale: Sale) => {
    if (!products || !sales) return;

    // 1. Mettre à jour les ventes
    const updatedSales = [...sales, sale];
    setSales(updatedSales);

    // 2. Mettre à jour le stock
    const updatedProducts = products.map((p) =>
      p.id === sale.productId
        ? { ...p, quantity: p.quantity - sale.quantity }
        : p
    );
    setProducts(updatedProducts);

    // 3. Sauvegarder dans AsyncStorage
    try {
      await saveData(SALES_KEY, updatedSales);
      await saveData(PRODUCTS_KEY, updatedProducts);
    } catch (e) {
      console.log("Erreur de sauvegarde :", e);
    }

    setModalVisible(false);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedProducts = await getData(PRODUCTS_KEY);
        const storedSales = await getData(SALES_KEY);

        if (storedProducts) {
          setProducts(storedProducts);
        } else {
          setProducts([]);
          await saveData(PRODUCTS_KEY, []);
        }

        if (storedSales) {
          setSales(storedSales);
        } else {
          setSales([]);
          await saveData(SALES_KEY, []);
        }
      } catch (e) {
        console.log("Erreur de chargement :", e);
      }
    };

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Gestion des ventes</Text>

      {/* Recherche */}
      <TextInput
        placeholder="🔍 Rechercher un produit..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />

      {/* Filtres de date */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setStartPickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {filterStartDate
              ? `Début: ${filterStartDate.toLocaleDateString()}`
              : "📅 Date début"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setEndPickerVisible(true)}
        >
          <Text style={styles.dateButtonText}>
            {filterEndDate
              ? `Fin: ${filterEndDate.toLocaleDateString()}`
              : "📅 Date fin"}
          </Text>
        </TouchableOpacity>
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

      {/* Liste des ventes */}
      <FlatList
        data={filteredSales}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Aucune vente trouvée.</Text>
        }
        renderItem={({ item }) => {
          if (!products) return <></>;
          const product = products.find((p) => p.id === item.productId);
          return (
            <View style={styles.saleCard}>
              <View style={styles.saleHeader}>
                <Text style={styles.saleProduct}>{product?.name}</Text>
                <Text style={styles.saleDate}>
                  {new Date(item.saleDate).toLocaleDateString()}
                </Text>
              </View>
              <Text style={styles.saleDetails}>
                Qté : {item.quantity} | Prix unitaire : {item.salePrice} Ar
              </Text>
              <Text style={styles.saleTotal}>
                💰 Total : {item.totalAmount.toLocaleString()} Ar
              </Text>
            </View>
          );
        }}
      />

      {/* Bouton Ajouter une vente */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Ajouter une vente</Text>
      </TouchableOpacity>

      {/* Modal Nouvelle vente */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <CreateSaleForm
            onAddSale={handleAddSale}
            onCancel={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
};

export default SalesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC", padding: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 14,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 10,
    marginHorizontal: 4,
    alignItems: "center",
  },
  dateButtonText: {
    fontSize: 15,
    color: "#334155",
  },
  saleCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  saleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saleProduct: { fontSize: 17, fontWeight: "600", color: "#0F172A" },
  saleDate: { fontSize: 13, color: "#64748B" },
  saleDetails: { fontSize: 15, color: "#475569", marginTop: 6 },
  saleTotal: {
    fontSize: 15,
    color: "#16A34A",
    fontWeight: "600",
    marginTop: 4,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#94A3B8",
    fontSize: 15,
  },
  addButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 14,
  },
  label: { fontWeight: "600", marginBottom: 6 },
  productSelect: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 6,
  },
  selectedProduct: {
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#16A34A",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  saveButtonText: { color: "#fff", fontWeight: "700" },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  cancelButtonText: { fontWeight: "600", color: "#334155" },
});
