import React from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ConfirmationModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  onConfirm: () => void;
  onCancel: () => void;
};

// Confirmation simple (sans mot de passe) : message + bouton confirmer/annuler.
const ConfirmationModal = ({
  visible,
  title,
  message,
  confirmLabel,
  confirmColor,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => (
  <Modal transparent animationType="slide" visible={visible} onRequestClose={onCancel}>
    <View style={styles.overlay}>
      <View style={styles.modalContent}>
        <View style={styles.grabHandle} />
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalMessage}>{message}</Text>

        <TouchableOpacity
          style={[styles.confirmButton, { backgroundColor: confirmColor }]}
          onPress={onConfirm}
        >
          <Text style={styles.confirmText}>{confirmLabel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ConfirmationModal;

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
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 14,
    color: "#B7BFD8",
    lineHeight: 20,
    marginBottom: 20,
  },
  confirmButton: {
    paddingVertical: 12,
    borderRadius: 14,
    marginBottom: 10,
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
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "600",
    color: "#B7BFD8",
  },
});
