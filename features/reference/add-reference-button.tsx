import { CancelButton } from "@/components/cancel-button";
import { SaveButton } from "@/components/save-button";
import { Colors } from "@/constants/theme";
import { useReference } from "@/hooks/reference/useRefecence";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const AddReferenceButton = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [refName, setRefName] = useState("");
  const { addReference } = useReference();

  const handleAdd = () => {
    if (!refName.trim()) return;
    addReference({
      id: new Date().toISOString(),
      name: refName.trim().toUpperCase(),
    });
    setRefName("");
    setModalVisible(false);
  };

  return (
    <>
      {/* --- Petit bouton icône paramètre --- */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="settings-outline" size={22} color="#FFF" />
      </TouchableOpacity>

      {/* --- Modal ajout référence --- */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle référence</Text>

            <TextInput
              style={styles.input}
              placeholder="Nom de la référence"
              value={refName}
              onChangeText={setRefName}
            />

            <View style={styles.actions}>
              <SaveButton onPress={handleAdd} />

              <CancelButton onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AddReferenceButton;

const styles = StyleSheet.create({
  // Petit bouton icône paramètre
  iconButton: {
    padding: 6,
    backgroundColor: Colors.dark.primary, // fond sombre
    borderRadius: 50,
    alignSelf: "flex-start",
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.dark.primary,
  },

  // Overlay du modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000066", // semi-transparent
    justifyContent: "center",
    alignItems: "center",
  },

  // Contenu du modal
  modalContent: {
    backgroundColor: Colors.dark.surface, // surface sombre
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: Colors.dark.text, // texte clair
    textAlign: "center",
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.dark.border, // bordure neutre
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    color: Colors.dark.text, // texte saisi clair
    backgroundColor: Colors.dark.background, // champ input sombre
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  },
});
