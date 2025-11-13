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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = () => {
    const result = productSchema.safeParse(formData);

    if (!result.success) {
      // Récupérer les erreurs
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProduct(newProduct);
    Alert.alert("Succès", "Produit ajouté avec succès ✅");
    setFormData({ name: "", quantity: "", purchasePrice: "" });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajouter un produit</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom du produit</Text>
        <TextInput
          style={[styles.input, errors.name && styles.errorInput]}
          placeholder="Ex: Riz, Sucre..."
          value={formData.name}
          onChangeText={(text) => handleChange("name", text)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={[styles.input, errors.quantity && styles.errorInput]}
          placeholder="Ex: 10"
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
          placeholder="Ex: 2500"
          keyboardType="numeric"
          value={formData.purchasePrice}
          onChangeText={(text) => handleChange("purchasePrice", text)}
        />
        {errors.purchasePrice && (
          <Text style={styles.errorText}>{errors.purchasePrice}</Text>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
          <Text style={styles.saveText}>Enregistrer</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
    color: "#111827",
  },
  formGroup: {
    marginBottom: 14,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    fontSize: 16,
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
    marginTop: 18,
  },
  saveButton: {
    backgroundColor: "#16A34A",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    marginLeft: 8,
  },
  saveText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
});
