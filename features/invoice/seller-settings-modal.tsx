import { ModalTrigger } from "@/components/modal-trigger";
import { useSeller } from "@/hooks/invoice/useSeller";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SellerSettingsModalProps = {
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.defaultTrigger} onPress={onPress}>
    <Ionicons name="storefront-outline" size={18} color="#F4F6FF" />
  </TouchableOpacity>
);

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SellerSettingsModal = ({ trigger }: SellerSettingsModalProps) => {
  const { seller, updateSeller } = useSeller();
  const [visible, setVisible] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const open = () => {
    setBusinessName(seller?.businessName ?? "");
    setPhone(seller?.phone ?? "");
    setEmail(seller?.email ?? "");
    setError("");
    setVisible(true);
  };
  const close = () => setVisible(false);

  const handleSave = async () => {
    if (!businessName.trim() || !phone.trim()) {
      setError("Le nom et le téléphone sont obligatoires.");
      return;
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      setError("E-mail invalide.");
      return;
    }
    await updateSeller({
      businessName: businessName.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
    });
    Alert.alert("✅ Succès", "Informations vendeur enregistrées.");
    close();
  };

  return (
    <>
      {trigger ? trigger({ onPress: open }) : <DefaultTrigger onPress={open} />}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Informations vendeur</Text>
            <Text style={styles.subtitle}>
              Affichées en en-tête de chaque facture.
            </Text>

            <Text style={styles.label}>Société ou marché</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : Boutique Tamby"
              placeholderTextColor="#545C7A"
              value={businessName}
              onChangeText={(t) => {
                setBusinessName(t);
                setError("");
              }}
            />

            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : 034 00 000 00"
              placeholderTextColor="#545C7A"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={(t) => {
                setPhone(t);
                setError("");
              }}
            />

            <Text style={styles.label}>E-mail · optionnel</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex : contact@boutique.mg"
              placeholderTextColor="#545C7A"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setError("");
              }}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={close}>
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default SellerSettingsModal;

const styles = StyleSheet.create({
  defaultTrigger: {
    width: 44,
    height: 44,
    borderRadius: 4,
    backgroundColor: "#1B2342",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5,8,18,0.75)",
    padding: 15,
  },
  container: {
    backgroundColor: "#141B33",
    borderRadius: 9,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },
  title: { fontSize: 18, fontWeight: "800", color: "#F4F6FF", marginBottom: 5 },
  subtitle: { color: "#7A83A2", fontSize: 13, marginBottom: 12 },
  label: {
    fontWeight: "700",
    color: "#B7BFD8",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 11,
    height: 48,
    color: "#F4F6FF",
    fontSize: 15,
    marginBottom: 9,
  },
  error: { color: "#F43F5E", fontSize: 13, marginBottom: 6 },
  actions: { flexDirection: "row", justifyContent: "space-around", marginTop: 6 },
  saveButton: {
    backgroundColor: "#F97316",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 5,
  },
  saveButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  cancelButton: {
    backgroundColor: "rgba(244,63,94,0.08)",
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
  cancelButtonText: { color: "#F43F5E", fontSize: 15, fontWeight: "700" },
});
