import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { saveProducts, updateLocalProduct } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";
import { useReferencesStore } from "@/stores/reference.store";
import { Picker } from "@react-native-picker/picker";
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
  referenceId: z.string().optional(),
});

export type productDTO = z.infer<typeof productSchema>;

interface EditProductFormProps {
  onCancel: () => void;
  product: Product;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  onCancel,
  product,
}) => {
  const { products, setProducts } = useProductsStore();

  const [formData, setFormData] = useState<productDTO>({
    name: product.name,
    quantity: String(product.quantity),
    purchasePrice: String(product.purchasePrice),
    salePrice: String(product.salePrice ?? ""),
    referenceId: product?.referenceId ?? "",
  });
  const { references } = useReferencesStore();

  const { changeFinanceStatus } = useFinance();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async () => {
    if (!products) return;
    const result = productSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const selectedReference = references?.find(
      (r) => r.id === result.data.referenceId
    )?.id;

    // Mettre à jour le produit existant (même id et createdAt)
    const updatedProduct: Product = {
      ...product,
      name: result.data.name,
      quantity: Number(result.data.quantity),
      purchasePrice: Number(result.data.purchasePrice),
      salePrice: Number(result.data.salePrice),
      referenceId: selectedReference ?? product.referenceId,
      updatedAt: new Date().toISOString(),
    };

    try {
      const updatedProducts = await updateLocalProduct(
        products,
        updatedProduct
      );

      setProducts(updatedProducts);
      await saveProducts(updatedProducts);
      changeFinanceStatus();
      Alert.alert("✅ Succès", "Produit modifié avec succès !");
      onCancel();
    } catch (error) {
      console.error("Erreur sauvegarde produit", error);
    }
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
            placeholderTextColor="#8891B3"
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
            placeholderTextColor="#8891B3"
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
            placeholderTextColor="#8891B3"
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
            placeholderTextColor="#8891B3"
            keyboardType="numeric"
            value={formData.salePrice}
            onChangeText={(text) => handleChange("salePrice", text)}
          />
          {errors.salePrice && (
            <Text style={styles.errorText}>{errors.salePrice}</Text>
          )}
        </View>
        {references?.length ? (
          <View style={styles.formGroup}>
            <Text style={styles.label}>Référence</Text>
            <View style={styles.selectContainer}>
              <Picker
                selectedValue={formData.referenceId}
                onValueChange={(val) => handleChange("referenceId", val)}
                style={styles.pickerContainer}
                dropdownIconColor="#B7BFD8"
                mode="dropdown"
              >
                <Picker.Item label="Sélectionner une référence..." value="" color="#545C7A" />
                {references.map((ref) => (
                  <Picker.Item key={ref.id} label={ref.name} value={ref.id} color="#F4F6FF" />
                ))}
              </Picker>
            </View>
          </View>
        ) : (
          <></>
        )}

        <View style={styles.actions}>
          <CancelButton onPress={onCancel} />
          <SaveButton onPress={handleSubmit} />
        </View>
      </View>
    </View>
  );
};

export default EditProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#141B33",
    padding: 22,
    paddingTop: 14,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 18,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  form: {
    gap: 14,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#B7BFD8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    padding: 14,
    height: 50,
    marginBottom: 10,
    color: "#F4F6FF",
    fontSize: 15,
  },
  errorInput: {
    borderColor: "#F43F5E",
    backgroundColor: "rgba(244,63,94,0.06)",
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 13,
    marginBottom: 6,
  },
  selectContainer: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
  },
  pickerContainer: {
    backgroundColor: "#1B2342",
    borderColor: "transparent",
    color: "#F4F6FF",
    height: 50,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 14,
    gap: 10,
  },
});
