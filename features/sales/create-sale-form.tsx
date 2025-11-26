import { useProducts } from "@/hooks/product/useProduct";
import { Sale } from "@/interface/sale/sale";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const saleSchema = z.object({
  productId: z.string().min(1, "Veuillez choisir un produit"),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Quantité invalide"
    ),
  salePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Prix invalide"),
  isCredit: z.boolean().optional(),
  clientName: z.string().optional(),
});

interface CreateSaleProps {
  onAddSale: (sale: Sale) => void;
  onCancel: () => void;
}

const CreateSaleForm: React.FC<CreateSaleProps> = ({ onAddSale, onCancel }) => {
  const { products } = useProducts();
  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    salePrice: "",
    isCredit: false,
    clientName: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState<string>("");

  const handleSelectProduct = (id: string) => {
    setFormData({ ...formData, productId: id });
    setSearch("");
  };

  const handleSubmit = () => {
    if (!products) return;

    const result = saleSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!selectedProduct) {
      setErrors({ productId: "Produit introuvable" });
      return;
    }

    const quantitySold = Number(formData.quantity);
    if (quantitySold > selectedProduct.quantity) {
      setErrors({ quantity: "Quantité supérieure au stock disponible" });
      return;
    }

    const sale: Sale = {
      id: Date.now().toString(),
      productId: selectedProduct.id,
      quantity: quantitySold,
      salePrice: Number(formData.salePrice),
      totalAmount: quantitySold * Number(formData.salePrice),
      saleDate: new Date().toISOString(),
      isCredit: formData.isCredit,
      clientName: formData.isCredit ? formData.clientName : "",
    };

    onAddSale(sale);
    Alert.alert("✅ Succès", "Vente réalisée avec succès !");
    setFormData({
      productId: "",
      quantity: "",
      salePrice: "",
      isCredit: false,
      clientName: "",
    });
  };

  // Produits filtrés pour l’autocomplete
  const filteredProducts = products
    ? products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const selectedProduct =
    products && products.find((p) => p.id === formData.productId);

  useEffect(() => {
    setFormData({
      ...formData,
      salePrice: String(selectedProduct?.salePrice ?? ""),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>🛒 Nouvelle vente</Text>

      {/* Recherche et sélection produit */}
      <Text style={styles.label}>Produit :</Text>
      {selectedProduct ? (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedText}>
            {selectedProduct.name} — Stock : {selectedProduct.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => setFormData({ ...formData, productId: "" })}
          >
            <Text style={styles.clearText}>Changer ✏️</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TextInput
            placeholder="Rechercher un produit..."
            style={[styles.input, errors.productId && styles.errorInput]}
            value={search}
            onChangeText={setSearch}
          />
          {errors.productId && (
            <Text style={styles.errorText}>{errors.productId}</Text>
          )}
          {search.length > 0 && (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              style={styles.dropdown}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelectProduct(item.id)}
                >
                  <Text style={styles.dropdownText}>
                    {item.name} ({item.quantity} en stock)
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* Quantité */}
      <Text style={styles.label}>Quantité vendue :</Text>
      <TextInput
        placeholder="Ex: 5"
        style={[styles.input, errors.quantity && styles.errorInput]}
        keyboardType="numeric"
        value={formData.quantity}
        onChangeText={(text) => setFormData({ ...formData, quantity: text })}
      />
      {errors.quantity && (
        <Text style={styles.errorText}>{errors.quantity}</Text>
      )}

      {/* Prix */}
      <Text style={styles.label}>Prix de vente (Ar) :</Text>
      <TextInput
        placeholder="Ex: 2500"
        style={[styles.input, errors.salePrice && styles.errorInput]}
        keyboardType="numeric"
        value={formData.salePrice}
        onChangeText={(text) => setFormData({ ...formData, salePrice: text })}
      />
      {errors.salePrice && (
        <Text style={styles.errorText}>{errors.salePrice}</Text>
      )}

      {/* Vente à crédit */}
      <View style={styles.creditRow}>
        <Text style={styles.label}>Vente à crédit :</Text>
        <Switch
          value={formData.isCredit}
          onValueChange={(value) =>
            setFormData({ ...formData, isCredit: value })
          }
          thumbColor={formData.isCredit ? "#16A34A" : "#f4f3f4"}
          trackColor={{ false: "#D1D5DB", true: "#A7F3D0" }}
        />
      </View>

      {/* Nom du client */}
      {formData.isCredit && (
        <>
          <Text style={styles.label}>Nom du client :</Text>
          <TextInput
            placeholder="Ex: Tamby"
            style={[styles.input, errors.clientName && styles.errorInput]}
            value={formData.clientName}
            onChangeText={(text) =>
              setFormData({ ...formData, clientName: text })
            }
          />
        </>
      )}

      {/* Boutons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>💾 Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>✖ Annuler</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateSaleForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#1E293B",
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#334155",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#F8FAFC",
  },
  errorInput: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    maxHeight: 150,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownText: {
    fontSize: 15,
    color: "#1E293B",
  },
  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#DCFCE7",
    borderColor: "#22C55E",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  selectedText: {
    color: "#065F46",
    fontWeight: "600",
  },
  clearText: {
    color: "#047857",
    fontWeight: "600",
  },
  creditRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 6,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
});
