import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { Client } from "@/interface/client/client";
import { saveClients, updateLocalClient } from "@/services/client";
import { useClientsStore } from "@/stores/client.store";
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

export type ClientDTO = z.infer<typeof clientSchema>;

interface EditClientFormProps {
  client: Client;
  onCancel: () => void;
}

const EditClientForm: React.FC<EditClientFormProps> = ({
  client,
  onCancel,
}) => {
  const { clients, setClients } = useClientsStore();

  const [formData, setFormData] = useState<ClientDTO>({
    civility: client.civility,
    name: client.name,
    phone: client.phone,
    email: client.email ?? "",
    address: client.address,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof ClientDTO, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  const handleSubmit = async () => {
    if (!clients) return;

    const result = clientSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const updatedClient: Client = {
      ...client,
      civility: result.data.civility,
      name: result.data.name,
      phone: result.data.phone,
      email: result.data.email || undefined,
      address: result.data.address,
      updatedAt: new Date().toISOString(),
    };

    try {
      const updatedClients = await updateLocalClient(clients, updatedClient);
      setClients(updatedClients);
      await saveClients(updatedClients);
      Alert.alert("✅ Succès", "Client modifié avec succès !");
      onCancel();
    } catch (error) {
      console.error("Erreur modification client", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Modifier le client</Text>

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
            value={formData.name}
            placeholder="Ex : Heri Fiononana"
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => handleChange("name", text)}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Téléphone */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={[styles.input, errors.phone && styles.errorInput]}
            value={formData.phone}
            keyboardType="phone-pad"
            placeholder="033 28 454 04"
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => handleChange("phone", text)}
          />
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* Email */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email (facultatif)</Text>
          <TextInput
            style={[styles.input, errors.email && styles.errorInput]}
            value={formData.email}
            keyboardType="email-address"
            placeholder="email@gmail.com"
            placeholderTextColor="#9CA3AF"
            onChangeText={(text) => handleChange("email", text)}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Adresse */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={[styles.input, errors.address && styles.errorInput]}
            value={formData.address}
            placeholder="Ville, quartier"
            placeholderTextColor="#9CA3AF"
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

export default EditClientForm;
const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.surface, // fond sombre
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
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
    borderColor: Colors.dark.border, // bordure neutre
    borderRadius: 10,
    height: 42,
    overflow: "hidden",
    backgroundColor: Colors.dark.surface, // surface sombre
  },
  pickerContainer: {
    backgroundColor: Colors.dark.surface,
    borderColor: "#FFFFFF00",
    color: Colors.dark.text,
    height: 40,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
