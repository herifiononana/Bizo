import { Product } from "@/interface/product/product";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2, "Le nom du produit est trop court"),
  quantity: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) >= 0,
      "Quantité invalide"
    ),
  purchasePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Prix invalide"),
  salePrice: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Prix invalide")
    .optional(),
});

interface AddProductFormProps {
  onAddProduct: (product: Product) => void;
  onCancel: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({
  onAddProduct,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    purchasePrice: "",
    salePrice: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = () => {
    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const newProduct: Product = {
      id: String(Date.now()),
      name: result.data.name,
      quantity: Number(result.data.quantity),
      purchasePrice: Number(result.data.purchasePrice),
      salePrice: Number(result.data.salePrice),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProduct(newProduct);
    Alert.alert("✅ Succès", "Produit ajouté avec succès !");
    setFormData({ name: "", quantity: "", purchasePrice: "", salePrice: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Ajouter un produit</Text>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom du produit</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Ex : Riz, Sucre..."
            placeholderTextColor="#9CA3AF"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Quantité</Text>
          <TextInput
            style={[styles.input, errors.quantity && styles.errorInput]}
            placeholder="Ex : 10"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={formData.quantity}
            onChangeText={(text) => handleChange("quantity", text)}
          />
          {errors.quantity && (
            <Text style={styles.errorText}>{errors.quantity}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix d’achat (Ar)</Text>
          <TextInput
            style={[styles.input, errors.purchasePrice && styles.errorInput]}
            placeholder="Ex : 2500"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={formData.purchasePrice}
            onChangeText={(text) => handleChange("purchasePrice", text)}
          />
          {errors.purchasePrice && (
            <Text style={styles.errorText}>{errors.purchasePrice}</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Prix de vente (Ar)</Text>
          <TextInput
            style={[styles.input, errors.salePrice && styles.errorInput]}
            placeholder="Ex : 2500"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={formData.salePrice}
            onChangeText={(text) => handleChange("salePrice", text)}
          />
          {errors.salePrice && (
            <Text style={styles.errorText}>{errors.salePrice}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
            <Text style={styles.saveText}>💾 Enregistrer</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>❌ Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#166534",
  },
  form: {
    gap: 14,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#111827",
  },
  errorInput: {
    borderColor: "#DC2626",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 13,
    marginTop: 4,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 10,
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#16A34A",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#16A34A",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  saveText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelText: {
    color: "#374151",
    fontWeight: "700",
    fontSize: 16,
  },
});
