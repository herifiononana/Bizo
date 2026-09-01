import React, { useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type PasswordPromptModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  confirmLabel?: string;
  onConfirm: (password: string) => boolean | Promise<boolean>;
  onCancel: () => void;
};

const PasswordPromptModal = ({
  visible,
  title,
  subtitle,
  confirmLabel = "Confirmer",
  onConfirm,
  onCancel,
}: PasswordPromptModalProps) => {
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      setPassword("");
      setErrorMessage(null);
    }
  }, [visible]);

  const handleConfirm = async () => {
    const isValid = await onConfirm(password);
    if (!isValid) setErrorMessage("Mot de passe incorrect.");
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Mot de passe"
            placeholderTextColor="#7A83A2"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordPromptModal;

const styles = StyleSheet.create({
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
    marginBottom: 12,
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
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  confirmButton: {
    backgroundColor: "#F97316",
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  confirmButtonText: {
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
