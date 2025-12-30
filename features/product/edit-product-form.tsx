import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { useFinance } from "@/hooks/finance/useFinance";
import { Product } from "@/interface/product/product";
import { ProductSchema } from "@/interface/product/schema";
import { saveProducts, updateLocalProduct } from "@/services/product";
import { useProductsStore } from "@/stores/product.store";

/* =======================
 * Types
 * ======================= */

type UnitFormData = {
  type: string;
  conversion: number;
  salePrice: number;
};

type FormData = {
  name: string;
  quantity: string;
  purchasePrice: string;
  units: UnitFormData[];
};

interface EditProductFormProps {
  onCancel: () => void;
  product: Product;
}

/* =======================
 * Constantes
 * ======================= */

const DEFAULT_UNIT: UnitFormData = {
  type: "piece",
  conversion: 1,
  salePrice: 0,
};

/* =======================
 * Composant
 * ======================= */

const EditProductForm: React.FC<EditProductFormProps> = ({
  product,
  onCancel,
}) => {
  const { products, setProducts } = useProductsStore();
  const { changeFinanceStatus } = useFinance();
  const [formData, setFormData] = useState<FormData>({
    ...product,
    quantity: String(product.quantity),
    purchasePrice: product.purchasePrice ? String(product.purchasePrice) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* =======================
   * Handlers
   * ======================= */

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const addUnit = () => {
    setFormData((prev) => ({
      ...prev,
      units: [...prev.units, DEFAULT_UNIT],
    }));
  };

  const updateUnit = (
    index: number,
    field: keyof UnitFormData,
    value: string
  ) => {
    setFormData((prev) => {
      const units = [...prev.units];
      units[index] = {
        ...units[index],
        [field]: field === "type" ? value : Number(value),
      };
      return { ...prev, units };
    });
  };

  const removeUnit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    if (!products) return;
    const result = ProductSchema.safeParse(formData);

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
      units: result.data.units,
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

  /* =======================
   * Rendu
   * ======================= */

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Modifier un produit</Text>

      {/* Nom */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Nom du produit</Text>
        <TextInput
          style={[styles.input, errors.name && styles.errorInput]}
          placeholder="Ex : Riz, Sucre..."
          placeholderTextColor="#9CA3AF"
          value={formData.name}
          onChangeText={(v) => handleChange("name", v)}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      </View>

      {/* Quantité */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quantité</Text>
        <TextInput
          style={[styles.input, errors.quantity && styles.errorInput]}
          keyboardType="numeric"
          placeholder="ex : 10"
          value={formData.quantity}
          onChangeText={(v) => handleChange("quantity", v)}
        />
      </View>

      {/* Prix achat */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Prix d’achat (Ar)</Text>
        <TextInput
          style={[styles.input, errors.purchasePrice && styles.errorInput]}
          keyboardType="numeric"
          placeholder="ex : 5000"
          value={formData.purchasePrice}
          onChangeText={(v) => handleChange("purchasePrice", v)}
        />
      </View>

      {/* Unités */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Unités de vente</Text>

        {formData.units.map((unit, index) => (
          <View key={index} style={styles.unitRow}>
            <Picker
              selectedValue={unit.type}
              onValueChange={(v) => updateUnit(index, "type", v)}
              style={styles.picker}
            >
              <Picker.Item label="Pièce" value="piece" />
              <Picker.Item label="Paquet" value="paquet" />
              <Picker.Item label="Carton" value="carton" />
            </Picker>

            <TextInput
              style={[styles.input, styles.smallInput]}
              keyboardType="numeric"
              value={String(unit.conversion)}
              onChangeText={(v) => updateUnit(index, "conversion", v)}
            />

            <TextInput
              style={[styles.input, styles.mediumInput]}
              keyboardType="numeric"
              value={String(unit.salePrice)}
              onChangeText={(v) => updateUnit(index, "salePrice", v)}
            />

            <TouchableOpacity
              onPress={() => removeUnit(index)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addUnitBtn} onPress={addUnit}>
          <Text style={styles.addUnitText}>➕ Ajouter une unité</Text>
        </TouchableOpacity>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <CancelButton onPress={onCancel} />
        <SaveButton onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default EditProductForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface, // fond sombre
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
    maxHeight: 700,
    overflowY: "scroll",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.dark.text, // couleur principale
  },
  form: {
    gap: 14,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: Colors.dark.text, // texte clair
    marginBottom: 6,
    fontSize: 15,
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
    borderColor: Colors.dark.danger, // rouge d’erreur
  },
  errorText: {
    color: Colors.dark.danger,
    fontSize: 13,
    marginTop: 4,
  },
  selectContainer: {
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    height: 42,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface,
  },
  pickerContainer: {
    backgroundColor: Colors.dark.surface,
    borderColor: "#FFFFFF00",
    height: 40,
    color: Colors.dark.text,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },

  unitRow: {
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 8,
  },

  unitPicker: {
    height: 38,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    borderRadius: 10,
  },

  picker: {
    padding: 0,
    flex: 1,
    minHeight: 38,
    color: Colors.dark.text,
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },

  smallInput: {
    marginTop: 8,
    height: 38,
    minWidth: 40,
    paddingVertical: 6,
  },

  mediumInput: {
    marginTop: 8,
    minWidth: 60,
    height: 38,
    paddingVertical: 6,
  },

  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.dark.danger + "22",
    alignItems: "center",
    justifyContent: "center",
  },

  removeText: {
    color: Colors.dark.danger,
    fontSize: 16,
    fontWeight: "700",
  },

  addUnitBtn: {
    marginTop: 6,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    alignItems: "center",
  },
  addUnitText: {
    color: Colors.dark.icon,
    fontWeight: "600",
    fontSize: 14,
  },
});
