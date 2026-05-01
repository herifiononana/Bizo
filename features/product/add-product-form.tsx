import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { Product } from "@/interface/product/product";
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
    referenceId: "",
  });
  const { references } = useReferencesStore();

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

    const selectedReference =
      references?.find((r) => r.id === result.data.referenceId)?.id ?? "";

    const newProduct: Product = {
      id: String(Date.now()),
      name: result.data.name,
      quantity: Number(result.data.quantity),
      purchasePrice: Number(result.data.purchasePrice),
      salePrice: Number(result.data.salePrice),
      referenceId: selectedReference,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onAddProduct(newProduct);
    Alert.alert("✅ Succès", "Produit ajouté avec succès !");
    setFormData({
      name: "",
      quantity: "",
      purchasePrice: "",
      salePrice: "",
      referenceId: "",
    });
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
              >
                <Picker.Item label="Sélectionner une référence..." value="" />
                {references.map((ref) => (
                  <Picker.Item key={ref.id} label={ref.name} value={ref.id} />
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

export default AddProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F1535",
    borderRadius: 20,
    padding: 20,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#FFFFFF",
  },
  form: {
    gap: 14,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 6,
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
    backgroundColor: "#172049",
    color: "#FFFFFF",
  },
  errorInput: {
    borderColor: Colors.dark.danger,
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    marginTop: 4,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 12,
    height: 44,
    overflow: "hidden",
    backgroundColor: "#172049",
  },
  pickerContainer: {
    backgroundColor: "#172049",
    borderColor: "transparent",
    height: 44,
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
