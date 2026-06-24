import { Product } from "@/interface/product/product";
import { useReferencesStore } from "@/stores/reference.store";
import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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

  const margin =
    formData.purchasePrice && formData.salePrice
      ? (Number(formData.salePrice) - Number(formData.purchasePrice)).toLocaleString()
      : null;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, justifyContent: "flex-end" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.sheet}>
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Header */}
        <View style={styles.sheetHeader}>
          <View style={styles.sheetIconWrap}>
            <MaterialIcons name="add" size={18} color="#FB923C" />
          </View>
          <Text style={styles.sheetTitle}>Ajouter un produit</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <MaterialIcons name="close" size={20} color="#B7BFD8" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Nom du produit */}
          <Text style={styles.label}>Nom du produit</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Ex : Riz, Sucre…"
            placeholderTextColor="#545C7A"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          {/* Quantité + Référence side by side */}
          <View style={styles.row2col}>
            <View style={styles.col2}>
              <Text style={styles.label}>Quantité</Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.errorInput]}
                placeholder="Ex : 10"
                placeholderTextColor="#545C7A"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => handleChange("quantity", text)}
              />
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>
            {references?.length ? (
              <View style={styles.col2}>
                <Text style={styles.label}>Référence</Text>
                <View style={styles.selectContainer}>
                  <Picker
                    selectedValue={formData.referenceId}
                    onValueChange={(val) => handleChange("referenceId", val)}
                    style={styles.pickerContainer}
                    dropdownIconColor="#B7BFD8"
                    mode="dropdown"
                  >
                    <Picker.Item label="Catégorie…" value="" color="#545C7A" />
                    {references.map((ref) => (
                      <Picker.Item
                        key={ref.id}
                        label={ref.name}
                        value={ref.id}
                        color="#F4F6FF"
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            ) : null}
          </View>

          {/* Prix d'achat + Prix de vente side by side */}
          <View style={styles.row2col}>
            <View style={styles.col2}>
              <Text style={styles.label}>Prix d'achat (Ar)</Text>
              <TextInput
                style={[styles.input, errors.purchasePrice && styles.errorInput]}
                placeholder="Ex : 2 500"
                placeholderTextColor="#545C7A"
                keyboardType="numeric"
                value={formData.purchasePrice}
                onChangeText={(text) => handleChange("purchasePrice", text)}
              />
              {errors.purchasePrice && (
                <Text style={styles.errorText}>{errors.purchasePrice}</Text>
              )}
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Prix de vente (Ar)</Text>
              <TextInput
                style={[styles.input, errors.salePrice && styles.errorInput]}
                placeholder="Ex : 2 500"
                placeholderTextColor="#545C7A"
                keyboardType="numeric"
                value={formData.salePrice}
                onChangeText={(text) => handleChange("salePrice", text)}
              />
              {errors.salePrice && (
                <Text style={styles.errorText}>{errors.salePrice}</Text>
              )}
            </View>
          </View>

          {/* Marge estimée helper */}
          <View style={styles.marginHelper}>
            <MaterialIcons name="flash-on" size={14} color={margin ? "#2ECC71" : "#545C7A"} />
            <Text style={[styles.marginHelperText, margin && styles.marginHelperActive]}>
              {margin
                ? `Marge estimée : ${margin} Ar`
                : "Marge estimée · Saisir les prix"}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <MaterialIcons name="close" size={18} color="#B7BFD8" />
              <Text style={styles.cancelBtnText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
              <MaterialIcons name="save" size={18} color="#fff" />
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddProductForm;

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    maxHeight: "95%",
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  sheetIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(249,115,22,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    letterSpacing: -0.4,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  label: {
    fontWeight: "700",
    color: "#B7BFD8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 12,
    color: "#F4F6FF",
    fontSize: 15,
  },
  errorInput: {
    borderColor: "#F43F5E",
    backgroundColor: "rgba(244,63,94,0.06)",
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 12,
    marginBottom: 6,
    marginTop: -8,
  },
  row2col: {
    flexDirection: "row",
    gap: 10,
  },
  col2: {
    flex: 1,
  },
  selectContainer: {
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    marginBottom: 12,
    overflow: "hidden",
  },
  pickerContainer: {
    backgroundColor: "#1B2342",
    color: "#F4F6FF",
    height: 50,
  },
  marginHelper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  marginHelperText: {
    fontSize: 13,
    color: "#545C7A",
    fontWeight: "500",
  },
  marginHelperActive: {
    color: "#2ECC71",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    height: 50,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  cancelBtnText: {
    color: "#B7BFD8",
    fontWeight: "700",
    fontSize: 15,
  },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F97316",
    borderRadius: 14,
    height: 50,
    gap: 8,
    shadowColor: "rgba(249,115,22,0.45)",
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
});
