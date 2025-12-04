import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { Sale } from "@/interface/sale/sale";
import { useProductsStore } from "@/stores/product.store";
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
import { CreateSaleDTO, saleSchema } from "./create-sale.schema";

interface CreateSaleProps {
  onAddSale: (sale: Sale) => void;
  onCancel: () => void;
}

const CreateSaleForm: React.FC<CreateSaleProps> = ({ onAddSale, onCancel }) => {
  const { products } = useProductsStore((state) => state);
  const [formData, setFormData] = useState<CreateSaleDTO>({
    productId: "",
    quantity: "",
    totalPrice: "",
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
      totalPrice: "",
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
        onChangeText={(text) => {
          const total = selectedProduct?.salePrice
            ? Number(text) * selectedProduct?.salePrice
            : 0;

          setFormData({
            ...formData,
            quantity: text,
            totalPrice: total ? total.toFixed(2) : "",
          });
        }}
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

      {/* Prix */}
      <Text style={styles.label}>Total (Ar) :</Text>
      <TextInput
        placeholder="Ex: 2500"
        style={[styles.input, errors.totalPrice && styles.errorInput]}
        keyboardType="numeric"
        value={formData.totalPrice}
        onChangeText={(text) => {
          const quantitySold = selectedProduct?.salePrice
            ? Number(text) / selectedProduct.salePrice
            : Number(formData.quantity);

          setFormData({
            ...formData,
            totalPrice: text,
            quantity: String(quantitySold.toFixed(3)),
          });
        }}
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
        <SaveButton onPress={handleSubmit} />

        <CancelButton onPress={onCancel} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateSaleForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface, // surface sombre
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: Colors.dark.text, // texte principal
  },
  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: Colors.dark.text, // texte principal
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: Colors.dark.surface,
    color: Colors.dark.text,
  },
  errorInput: {
    borderColor: Colors.dark.danger, // rouge pour erreur
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    marginBottom: 6,
  },
  dropdown: {
    backgroundColor: Colors.dark.surface,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    maxHeight: 150,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  dropdownText: {
    fontSize: 15,
    color: Colors.dark.text,
  },
  selectedBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.dark.success + "33", // vert clair transparent
    borderColor: Colors.dark.success,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  selectedText: {
    color: Colors.dark.success,
    fontWeight: "600",
  },
  clearText: {
    color: Colors.dark.success,
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
    justifyContent: "space-around",
    marginTop: 10,
  },
});
