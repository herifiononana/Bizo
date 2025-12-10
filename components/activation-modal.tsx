import { useActivation } from "@/hooks/useActivation";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ActivationModal() {
  const { activate, isValid } = useActivation();
  const [key, setKey] = useState<string>("");

  const VALID_KEY = "AMILO-2025"; // clé que tu donnes à tes clients

  const handleValidate = () => {
    if (key !== VALID_KEY) {
      Alert.alert("Erreur", "Clé incorrecte");
      return;
    }
    activate();
    Alert.alert("Activation", "L’application est activée pour 30 jours");
  };

  if (isValid) return <></>;

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
            padding: 16,
            borderRadius: 10,
            width: "80%",
          }}
        >
          <Text style={{ color: "white", marginBottom: 12, fontSize: 18 }}>
            {`Entrez votre clé d'activation`}
          </Text>

          <TextInput
            placeholder="Clé"
            placeholderTextColor="#999"
            style={{
              backgroundColor: "#374151",
              color: "white",
              padding: 10,
              borderRadius: 6,
            }}
            value={key}
            onChangeText={setKey}
          />

          <TouchableOpacity
            style={{
              marginTop: 16,
              backgroundColor: "#10B981",
              padding: 10,
              borderRadius: 6,
            }}
            onPress={handleValidate}
          >
            <Text style={{ textAlign: "center", color: "white", fontSize: 16 }}>
              Valider
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
