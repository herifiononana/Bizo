import { CONTACT_INFO, VALID_KEY } from "@/constants/constants";
import { useActivation } from "@/hooks/useActivation";
import React, { useState } from "react";
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ShowAlertActivation from "./show-alert-activation";

export default function ActivationModal() {
  const { activate, isValid, showAlert } = useActivation();
  const [key, setKey] = useState<string>("");

  const handleValidate = () => {
    if (key !== VALID_KEY) {
      alert("Erreur : Clé incorrecte.");
      return;
    }
    activate();
    alert(
      `Activation réussie.\n\nApplication : ${CONTACT_INFO.appName}\nValidité : 30 jours`
    );
  };

  // Si l'application est activée : ne rien afficher
  if (isValid && !showAlert) return <></>;

  // ---------- MODAL D'EXPIRATION ----------
  if (isValid && showAlert) return <ShowAlertActivation />;

  // ---------- MODAL D'ENTRÉE DE CLÉ ----------
  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {`Entrez votre clé d'activation`}
          </Text>

          <TextInput
            placeholder="Clé"
            placeholderTextColor="#7A83A2"
            style={styles.input}
            value={key}
            onChangeText={setKey}
          />

          <TouchableOpacity
            style={styles.activateButton}
            onPress={handleValidate}
          >
            <Text style={styles.activateButtonText}>Valider</Text>
          </TouchableOpacity>

          <View style={{ marginTop: 15, gap: 3 }}>
            <Text style={styles.assistanceLabel}>
              Assistance Bizo :
            </Text>
            <Text style={styles.contactText}>
              Téléphone : {CONTACT_INFO.phone}
            </Text>
            <Text style={styles.contactText}>
              WhatsApp : {CONTACT_INFO.whatsapp}
            </Text>
            <Text style={styles.contactText}>
              Mail : {CONTACT_INFO.email}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(5,8,18,0.92)",
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
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#F4F6FF",
    marginBottom: 5,
  },
  subtitle: {
    color: "#7A83A2",
    fontSize: 14,
    marginBottom: 14,
  },
  input: {
    backgroundColor: "#1B2342",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    padding: 11,
    height: 50,
    color: "#F4F6FF",
    fontSize: 15,
    marginTop: 9,
    marginBottom: 3,
  },
  activateButton: {
    backgroundColor: "#F97316",
    borderRadius: 5,
    padding: 11,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  activateButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  assistanceLabel: {
    color: "#7A83A2",
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "600",
  },
  contactText: {
    color: "#F4F6FF",
    fontSize: 13,
  },
});
