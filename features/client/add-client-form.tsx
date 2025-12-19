import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { Client } from "@/interface/client/client";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import { z } from "zod";

/* ---------------------- Validation ---------------------- */
const clientSchema = z.object({
  civility: z.enum(["Monsieur", "Madame"]),
  name: z.string().min(2, "Nom trop court"),
  phone: z.string().min(8, "Numéro invalide"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  address: z.string().min(3, "Adresse trop courte"),
});

interface AddClientFormProps {
  onAddClient: (client: Client) => void;
  onCancel: () => void;
}

const AddClientForm: React.FC<AddClientFormProps> = ({
  onAddClient,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    civility: "Monsieur",
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = () => {
    const result = clientSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const newClient: Client = {
      id: String(Date.now()),
      civility: result.data.civility,
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || undefined,
      address: result.data.address,
      createdAt: new Date().toISOString(),
    };

    onAddClient(newClient);
    Alert.alert("✅ Succès", "Client ajouté avec succès");

    setFormData({
      civility: "Monsieur",
      name: "",
      phone: "",
      email: "",
      address: "",
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Ajouter un client</Text>

      <View style={styles.form}>
        {/* Civilité */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Civilité</Text>
          <View style={styles.selectContainer}>
            <Picker
              selectedValue={formData.civility}
              onValueChange={(val) => handleChange("civility", val)}
              style={styles.pickerContainer}
            >
              <Picker.Item label="Monsieur" value="Monsieur" />
              <Picker.Item label="Madame" value="Madame" />
            </Picker>
          </View>
        </View>

        {/* Nom */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nom du client</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorInput]}
            placeholder="Ex : Heri Fiononana"
            placeholderTextColor="#9CA3AF"
            value={formData.name}
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Téléphone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.errorInput]}
            placeholder="033 28 454 04"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            value={formData.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email (facultatif)</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            placeholder="heryfiononana19@gmail.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Adresse */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={[styles.input, errors.address && styles.errorInput]}
            placeholder="Ville, quartier"
            placeholderTextColor="#9CA3AF"
            value={formData.address}
            onChangeText={(text) => handleChange("address", text)}
          />
          {errors.address && (
            <Text style={styles.errorText}>{errors.address}</Text>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <SaveButton onPress={handleSubmit} />
          <CancelButton onPress={onCancel} />
        </View>
      </View>
    </View>
  );
};

export default AddClientForm;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: Colors.dark.text,
  },
  form: {
    gap: 14,
  },
  formGroup: {
    marginBottom: 6,
  },
  label: {
    fontWeight: "600",
    color: Colors.dark.text,
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
    borderColor: Colors.dark.danger,
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
    height: 40,
    color: Colors.dark.text,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
