import { CONTACT_INFO } from "@/constants/constants";
import { Colors } from "@/constants/theme";
import { useActivation } from "@/hooks/useActivation";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function ShowAlertActivation() {
  const { showAlert } = useActivation();

  const [open, setOpen] = useState<boolean>(showAlert);

  if (!open) return <></>;

  // ---------- MODAL D'EXPIRATION ----------
  return (
    <Modal visible transparent animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.6)",
        }}
      >
        <View
          style={{
            backgroundColor: "#1F2937",
            padding: 14,
            borderRadius: 3,
            width: "80%",
          }}
        >
          <Text style={{ color: "white", fontSize: 18, marginBottom: 9 }}>
            ACTIVATION EXPIRÉE
          </Text>

          <Text style={{ color: Colors.dark.info, marginBottom: 6 }}>
            {`L'activation expire bientôt.`}
          </Text>

          <Text style={{ color: "white", marginBottom: 3 }}>
            Veuillez contacter l’admin :
          </Text>

          <Text style={{ color: "white" }}>
            📞 Téléphone : {CONTACT_INFO.phone}
          </Text>
          <Text style={{ color: "white" }}>
            💬 WhatsApp : {CONTACT_INFO.whatsapp}
          </Text>
          <Text style={{ color: "white", marginBottom: 9 }}>
            📧 Mail : {CONTACT_INFO.email}
          </Text>

          <TouchableOpacity
            onPress={() => {
              setOpen(false);
            }}
            style={{
              marginTop: 8,
              backgroundColor: Colors.dark.accent,
              padding: 8,
              borderRadius: 3,
            }}
          >
            <Text style={{ textAlign: "center", fontSize: 16, color: "white" }}>
              Compris
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
