import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
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

export type productDTO = z.infer<typeof productSchema>;

interface EditProductFormProps {
  onEditProduct: (product: Product) => void;
  onCancel: () => void;
  product: Product;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  onEditProduct,
  onCancel,
  product,
}) => {
  const [formData, setFormData] = useState<productDTO>({
    name: product.name,
    quantity: String(product.quantity),
    purchasePrice: String(product.purchasePrice),
    salePrice: String(product.salePrice ?? ""),
  });

  const { changeFinanceStatus } = useFinance();
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

    // Mettre à jour le produit existant (même id et createdAt)
    const updatedProduct: Product = {
      ...product,
      name: result.data.name,
      quantity: Number(result.data.quantity),
      purchasePrice: Number(result.data.purchasePrice),
      salePrice: Number(result.data.salePrice),
      updatedAt: new Date().toISOString(),
    };

    onEditProduct(updatedProduct);
    Alert.alert("✅ Succès", "Produit modifié avec succès !");
    changeFinanceStatus();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Modifier le produit</Text>

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
          <SaveButton onPress={handleSubmit} />

          <CancelButton onPress={onCancel} />
        </View>
      </View>
    </View>
  );
};

export default EditProductForm;

// Les styles peuvent rester identiques
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
  form: { gap: 14 },
  formGroup: { marginBottom: 6 },
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
  errorInput: { borderColor: "#DC2626" },
  errorText: { color: "#DC2626", fontSize: 13, marginTop: 4 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
