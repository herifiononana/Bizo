import { ModalTrigger } from "@/components/modal-trigger";
import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type HistorySecurityModalProps = {
  // Bouton d'ouverture personnalisable — par défaut une icône cadenas.
  trigger?: ModalTrigger;
};

const DefaultTrigger: ModalTrigger = ({ onPress }) => (
  <TouchableOpacity style={styles.defaultTrigger} onPress={onPress}>
    <Ionicons name="lock-closed-outline" size={18} color="#F4F6FF" />
  </TouchableOpacity>
);

const HistorySecurityModal = ({ trigger }: HistorySecurityModalProps) => {
  const { hasPassword, changePassword } = useHistorySecurity();

  const [visible, setVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onClose = () => setVisible(false);

  useEffect(() => {
    if (visible) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [visible]);

  const handleSave = async () => {
    if (!newPassword) {
      Alert.alert("Erreur", "Le mot de passe ne peut pas être vide.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    const success = await changePassword(newPassword, oldPassword);
    if (!success) {
      Alert.alert("Erreur", "Ancien mot de passe incorrect.");
      return;
    }

    Alert.alert("✅ Succès", "Mot de passe enregistré.");
    onClose();
  };

  return (
    <>
      {trigger ? trigger({ onPress: () => setVisible(true) }) : (
        <DefaultTrigger onPress={() => setVisible(true)} />
      )}

      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Mot de passe de suppression</Text>
          <Text style={styles.subtitle}>
            Requis pour supprimer les ventes d&apos;une journée dans l&apos;historique.
          </Text>

          {hasPassword && (
            <TextInput
              style={styles.input}
              placeholder="Ancien mot de passe"
              placeholderTextColor="#7A83A2"
              secureTextEntry
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          )}
          <TextInput
            style={styles.input}
            placeholder="Nouveau mot de passe"
            placeholderTextColor="#7A83A2"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmer le mot de passe"
            placeholderTextColor="#7A83A2"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Enregistrer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </Modal>
    </>
  );
};

export default HistorySecurityModal;

const styles = StyleSheet.create({
  defaultTrigger: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    padding: 20,
  },
  container: {
    backgroundColor: "#141B33",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    width: "100%",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 6,
  },
  subtitle: {
    color: "#7A83A2",
    fontSize: 13,
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#1B2342",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 14,
    height: 50,
    color: "#F4F6FF",
    fontSize: 15,
    marginBottom: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    backgroundColor: "rgba(244,63,94,0.08)",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(244,63,94,0.25)",
  },
  cancelButtonText: {
    color: "#F43F5E",
    fontSize: 15,
    fontWeight: "700",
  },
});
