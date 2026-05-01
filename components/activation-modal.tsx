import { CONTACT_INFO, VALID_KEY } from "@/constants/constants";
import { Colors } from "@/constants/theme";
import { useActivation } from "@/hooks/useActivation";
import React, { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
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

  // Si l’application est activée : ne rien afficher
  if (isValid && !showAlert) return <></>;

  // ---------- MODAL D'EXPIRATION ----------
  if (isValid && showAlert) return <ShowAlertActivation />;

  // ---------- MODAL D'ENTRÉE DE CLÉ ----------
  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.75)",
        }}
      >
        <View
          style={{
            backgroundColor: "#0F1535",
            padding: 22,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.10)",
            width: "85%",
          }}
        >
          <Text style={{ color: "#FFFFFF", marginBottom: 14, fontSize: 18, fontWeight: "700" }}>
            {`Entrez votre clé d'activation`}
          </Text>

          <TextInput
            placeholder="Clé"
            placeholderTextColor="#8891B3"
            style={{
              backgroundColor: "#172049",
              color: "#FFFFFF",
              padding: 12,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.10)",
              fontSize: 15,
            }}
            value={key}
            onChangeText={setKey}
          />

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: Colors.dark.accent,
              paddingVertical: 12,
              borderRadius: 12,
            }}
            onPress={handleValidate}
          >
            <Text style={{ textAlign: "center", color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
              Valider
            </Text>
          </TouchableOpacity>

          <View style={{ marginTop: 20, gap: 4 }}>
            <Text style={{ color: "#8891B3", marginBottom: 6, fontSize: 13, fontWeight: "600" }}>
              Assistance Bizo :
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
              Téléphone : {CONTACT_INFO.phone}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
              WhatsApp : {CONTACT_INFO.whatsapp}
            </Text>
            <Text style={{ color: "#FFFFFF", fontSize: 13 }}>
              Mail : {CONTACT_INFO.email}
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}
