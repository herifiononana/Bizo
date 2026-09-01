import { useHistorySecurity } from "@/hooks/history/useHistorySecurity";
import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type SecureConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmColor?: string;
  onConfirmed: () => void | Promise<void>;
  onCancel: () => void;
};

// Composant dédié : confirmation d'une action sensible protégée par le mot de passe
// configuré dans les réglages de l'historique (même mot de passe partout dans l'app).
const SecureConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel = "Confirmer",
  confirmColor = "#F43F5E",
  onConfirmed,
  onCancel,
}: SecureConfirmModalProps) => {
  const { hasPassword, verifyPassword } = useHistorySecurity();
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPassword("");
      setErrorMessage(null);
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (!verifyPassword(password)) {
      setErrorMessage("Mot de passe incorrect.");
      return;
    }
    await onConfirmed();
  };

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.grabHandle} />
          <Text style={styles.title}>{title}</Text>

          {hasPassword ? (
            <>
              <Text style={styles.message}>{message}</Text>

              <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor="#7A83A2"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              <TouchableOpacity
                style={[styles.confirmButton, { backgroundColor: confirmColor }]}
                onPress={handleConfirm}
              >
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.message}>
              Configurez d&apos;abord un mot de passe de suppression dans les
              réglages de l&apos;historique.
            </Text>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Annuler</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SecureConfirmModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(5,8,18,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#141B33",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  grabHandle: {
    width: 40,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 999,
    alignSelf: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    color: "#B7BFD8",
    lineHeight: 20,
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
  },
  errorText: {
    color: "#F43F5E",
    fontSize: 13,
    marginTop: 8,
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 14,
    marginTop: 16,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#0C1224",
  },
  cancelButton: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: "#1B2342",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    marginTop: 10,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#B7BFD8",
  },
});
